import child_process from "child_process";
import yargs from "yargs";
import AdmZip from "adm-zip";
import fs from "fs-extra";

const PACK_REL = "releases/packs"

function getArgs() {
  const argv = yargs(process.argv)
    .version(false)
    .usage("Usage: $0")
    .option("version", {
      alias: "v",
      type: "string",
      demandOption: false,
      description: "Version number to label this release",
    }).argv;

  return argv;
}

function getVersion(args) {
  var version = args.v;
  if (!version) {
    version = child_process.execSync("git describe --tags").toString().trim();
  };
  return version;
}

function updateModule(version) {
  let moduleJson = fs.readJSONSync("module.json");
  moduleJson.version = version;
  moduleJson.download = `https://github.com/baileymh/pf1e-content/releases/download/${version}/pf-content.${version}.zip`;
  fs.writeJSONSync("module.json", moduleJson, { spaces: 2 });
}

async function createArchive(version) {
  const zip = new AdmZip();
  const outputFile = `./releases/pf-content.${version}.zip`;
  zip.addLocalFolder("./releases/packs", "pf-content/packs");
  zip.addLocalFolder("./assets", "pf-content/assets");
  zip.addLocalFile("changelog.md", "pf-content/");
  zip.addLocalFile("CREDITS.md", "pf-content/");
  zip.addLocalFile("Legal.txt", "pf-content/");
  zip.addLocalFile("LICENSE.md", "pf-content/");
  zip.addLocalFile("OGL.txt", "pf-content/");
  zip.addLocalFile("README.md", "pf-content/");
  zip.addLocalFile("module.json", "pf-content/");
  zip.writeZip(outputFile);
}

/* 
 * Main
 */

console.log("Build was run");
const args = getArgs();
const version = getVersion(args);
console.log(`Releasing ${version}`);
updateModule(version);
createArchive(version);

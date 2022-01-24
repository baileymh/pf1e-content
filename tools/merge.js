import {diffString, diff} from "json-diff";
import sanitize from "sanitize-filename";
import fs from "fs-extra";
import crypto from "crypto";

import path from "path";

const ADDITIONS_DIR = "additions";
const PACK_SRC = "src/packs";

function cleanItem(item) {
  // Remove export source information
  if (item.flags?.exportSource) {
    delete item.flags.exportSource;
  };
  return item;
};

function uid(len) {
  return crypto.randomBytes(Math.ceil(Math.max(8, len * 2)))
    .toString('base64')
    .replace(/[+\/]/g, '')
    .slice(0, len);
};

function mergePacks() {
  // Determine the source folders to process
  const folders = fs.readdirSync(ADDITIONS_DIR).filter((file) => {
    return fs.statSync(path.join(ADDITIONS_DIR, file)).isDirectory();
  });
  console.log(`Found addition folders: ${folders}`);

  // Process each folder
  folders.map((folder) => {
    // Find all files to be added to this pack
    const files = fs.readdirSync(path.join(ADDITIONS_DIR, folder)).filter((file) => {
      return fs.statSync(path.join(ADDITIONS_DIR, folder, file)).isFile();
    });

    // Update or Insert each entry into the pack
    files.map((file) => {
      console.log(`Processing file: ${file}`);
      const filePath = path.join(ADDITIONS_DIR, folder, file);
      var addJson = cleanItem(JSON.parse(fs.readFileSync(filePath, 'utf8')));
      const addFileName = sanitize(addJson.name);
      const packFile = path.join(PACK_SRC, folder, `${addFileName}.json`);

      if (fs.existsSync(packFile)) {
        var existingEntry = fs.readJsonSync(packFile)
        let existingId = existingEntry._id;
        console.log(`Keeping existing ID: ${existingId}`);
        addJson._id = existingId;
      } else {
        // TODO: Check every ID and retry if already exists, not that that's remotely likely...
        var existingEntry = {};
        let newId = uid(16);
        addJson._id = newId;
        console.log(`Generated Id: ${newId}`);
      };
      if (addJson.name === "#[CF_tempEntity]") {
        console.log(`Not processing #[CF_tempEntity] from ${filePath}`);
      } else {
        console.log(`Diff of ${addJson.name}\n${diffString(existingEntry, addJson)}`);
        fs.writeJSON(packFile, addJson, {spaces: 2});
      };
    });
  });
};

/*
 * Main
 */

mergePacks();

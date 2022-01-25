import {diffString, diff} from "json-diff";
import slugify from "slugify";
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

function addItem(folder, data, packFiles) {
  if (data._id) {
    var filterOn = data._id;
  } else {
    var filterOn = slugify(data.name);
  }
  const existingFiles = packFiles.filter((file) => {
    return file.includes(filterOn);
  });

  var fileName = "";
  switch (existingFiles.length) {
    case 0:
      // new file
      let newId = uid(16);
      fileName = `${slugify(data.name)}-${newId}`;
      console.log(`Adding new item: ${data.name}`);
      break;
    case 1:
      // Single file to update
      fileName = existingFiles[0];
      let existingItem = fs.readJSONSync(path.join(PACK_SRC, folder, fileName));
      console.log(`Updating item: ${data.name}\nDiff:\n${diffString(existingItem, data)}`);
      break;
    default:
      // multiple files ask user what to do 
      console.log(`${data.name} matches multiple items not yet implemented for merge: ${existingFiles}`);
      return;
  };
  fs.writeJSON(path.join(PACK_SRC, folder, fileName), data, {spaces: 2});
};

function mergePacks() {
  // Determine the source folders to process
  const folders = fs.readdirSync(ADDITIONS_DIR).filter((file) => {
    return fs.statSync(path.join(ADDITIONS_DIR, file)).isDirectory();
  });
  console.log(`Found addition folders: ${folders}`);

  // Process each folder
  folders.map((folder) => {
    // Find all inputFiles to be added to this pack
    const inputFiles = fs.readdirSync(path.join(ADDITIONS_DIR, folder)).filter((file) => {
      return fs.statSync(path.join(ADDITIONS_DIR, folder, file)).isFile();
    });
    console.log(`Found input files: ${inputFiles}`);

    try {
      var packFiles = fs.readdirSync(path.join(PACK_SRC, folder)).filter((file) => {
        return fs.statSync(path.join(PACK_SRC, folder, file)).isFile();
      });
    } catch (e) {
      console.log(`No compendium found for: ${folder}`);
      console.log(`For available compendiums check folder names at: ${PACK_SRC}`);
      process.exit(1);
    };

    // Update or Insert each item into the src folder
    inputFiles.map((inputFile) => {
      console.log(`Processing inputFile: ${inputFile}`);
      const inputFilePath = path.join(ADDITIONS_DIR, folder, inputFile);
      var inputJSON = cleanItem(JSON.parse(fs.readFileSync(inputFilePath, 'utf8')));
      addItem(folder, inputJSON, packFiles);
    });
  });
};

/*
 * Main
 */

mergePacks();

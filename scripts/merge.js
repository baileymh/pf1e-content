import Datastore from "@seald-io/nedb";
import {diffString, diff} from "json-diff";

import fs from "fs";
import path from "path";

const PACK_SRC = "additions";
const PACK_DIR = "packs";

function cleanItem(item) {
  // Remove export source information
  if (item.flags?.exportSource) {
    delete item.flags.exportSource;
  };
  return item;
};

function loadDatabases() {
  const dbFiles = fs.readdirSync(PACK_DIR).filter((file) => {
    return fs.statSync(path.join(PACK_DIR, file)).isFile();
  });

  var databases = {};
  dbFiles.map((file) => {
    databases[file] = new Datastore({filename: path.resolve(PACK_DIR, file), autoload: true});
  });
  return databases;
};

function mergePacks(databases) {
  // Determine the source folders to process
  const folders = fs.readdirSync(PACK_SRC).filter((file) => {
    return fs.statSync(path.join(PACK_SRC, file)).isDirectory();
  });
  console.log(`Found folders: ${folders}`);

  // Open a database per folder
  folders.map((folder) => {
    console.log(`Processing: ${folder}`)
    const db = databases[`${folder}.db`];

    // Find all files to be added to this database
    const files = fs.readdirSync(path.join(PACK_SRC, folder)).filter((file) => {
      return fs.statSync(path.join(PACK_SRC, folder, file)).isFile();
    });

    // Update or Insert each entry into the database
    files.map((file) => {
      console.log(`Processing file: ${file}`);
      let filePath = path.join(PACK_SRC, folder, file);
      let newDoc = cleanItem(JSON.parse(fs.readFileSync(filePath, 'utf8')));
      db.findOne({name: newDoc.name}, function (_, docs) {
        let originalDoc = docs;
        db.update({name: newDoc.name}, newDoc, {returnUpdatedDocs: true, upsert: true}, function (_, __, docs) {
          let diff = diffString(originalDoc, docs)
          let diffMessage = `Diff for ${newDoc.name}:\n${diff}`;
          console.log(diffMessage);
        });
      });
    });
    // Compact the database
    db.persistence.compactDatafile();
  });
};

const databases = loadDatabases();
mergePacks(databases);

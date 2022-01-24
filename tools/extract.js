import Datastore from "@seald-io/nedb";
import fs from "fs-extra";
import sanitize from "sanitize-filename";

import path from "path";

const PACK_SRC = "src/packs";
const PACK_DIR = "packs";

function loadDatabases() {
  const dbFiles = fs.readdirSync(PACK_DIR).filter((file) => {
    return fs.statSync(path.join(PACK_DIR, file)).isFile();
  });

  var databases = {};
  dbFiles.map((file) => {
    databases[file.replace('.db', '')] = new Datastore({filename: path.resolve(PACK_DIR, file), autoload: true});
  });
  return databases;
};

function extractDatabase(name, db) {
  db.find({}, function (err, docs) {
    docs.map((doc) => {
      let folder = path.join(PACK_SRC, name);
      if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
      };
      if (doc.name === "#[CF_tempEntity]") {
        // These are special cased files we don't intend to ever merge them so the filename doesn't need to be predictable, just unique
        var fileName = path.join(folder, `[${doc._id}] ${sanitize(doc.name)}.json`);
      } else {
        var fileName = path.join(folder, `${sanitize(doc.name)}.json`);
      }
      if (fs.existsSync(fileName)) {
        // Add a unique identifier to any duplicate items
        fileName = fileName.replace(".json", ` [${doc._id}].json`)
      }
      fs.writeJSONSync(fileName, doc, {spaces: 2});
    });
  });
};

/*
  * Main
  */

const databases = loadDatabases();
Object.entries(databases).forEach(function ([key, value]) {
  extractDatabase(key, value);
});

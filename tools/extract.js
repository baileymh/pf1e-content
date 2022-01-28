import Datastore from "@seald-io/nedb";
import fs from "fs-extra";
import slugify from "slugify";

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
      const folder = path.join(PACK_SRC, name);
      if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
      };
      const fileName = path.join(folder, `${slugify(doc.name)}-${doc._id}.json`);
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

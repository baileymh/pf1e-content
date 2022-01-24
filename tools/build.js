import Datastore from "@seald-io/nedb";
import fs from "fs-extra";

import path from "path";

const PACK_SRC = "src/packs";
const PACK_REL = "releases/packs";

function buildPacks() {
  const packFolders = fs.readdirSync(PACK_SRC).filter((file) => {
    return fs.statSync(path.join(PACK_SRC, file)).isDirectory();
  });

  packFolders.map((folder) => {
    console.log(`Processing folder: ${folder}`);
    var db = new Datastore({filename: `${path.join(PACK_REL, folder)}.db`, autoload: true});
    const packFiles = fs.readdirSync(path.join(PACK_SRC, folder)).filter((file) => {
      return fs.statSync(path.join(PACK_SRC, folder, file)).isFile();
    });
    packFiles.map((file) => {
      const doc = fs.readJSONSync(path.join(PACK_SRC, folder, file));
      db.insert(doc, (err, rtn) => {
        if (err){
          console.log(`Error inserting ${doc._id}:\n${err}`);
          process.exit(1);
        };
      });
    });
    db.persistence.compactDatafile();
  });
};

/*
  * Main
  */

buildPacks();

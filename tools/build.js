import Datastore from "@seald-io/nedb";

import path from "path";

import PackGroup from "./lib/packgroup.js";

const PACK_REL = "releases/packs";
const srcPacks = new PackGroup("./src/packs");

srcPacks.packs.map((pack) => {
  console.log(`Processing: ${pack}`);
  var db = new Datastore({filename: `${path.join(PACK_REL, pack.name)}.db`, autoload: true});
  pack.documents.map((document) => {
    db.insert(document.json, (err, rtn) => {
      if (err) {
        console.log(`Error inserting ${document.json._id}:\n${err}`);
        process.exit(1);
      };
    });
  });
  db.persistence.compactDatafile();
});

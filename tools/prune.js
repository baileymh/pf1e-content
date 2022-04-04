// Prune stored .json files of unnecessary data to lighten the compendiums

import PackGroup from "./lib/packgroup.js";
import pruneDocument from './lib/pruneDocument.js';
const srcPacks = new PackGroup("./src/packs");

const start = performance.now();
let lastReport = start;

srcPacks.packs.forEach((pack) => {
  console.log("Pruning pack:", pack.name);
  const docs = pack.documents;
  docs.forEach((doc, i) => {
    const startCurrent = performance.now();
    // Do actual cleaning (updateDoc calls cleanup routines itself)
    // TODO: Save document only if it has changed.
    pack.updateDoc(doc);

    // Report processing state every few seconds
    const now = performance.now();
    if ((now - lastReport) > 15_000) {
      lastReport = now;
      const currentDocTime = now - startCurrent;
      console.log(i+1, "/", docs.length, ":", doc.name, `[${Math.round(currentDocTime)}ms]`);
    }
  });
});

const end = performance.now();
console.log("All packs processed in", Math.round(end - start), "ms");

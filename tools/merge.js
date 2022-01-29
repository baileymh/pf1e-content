import PackGroup from "./lib/packgroup.js";

const addPackGroup = new PackGroup('./additions');
const srcPackGroup = new PackGroup('./src/packs');

let diffs = [];
addPackGroup.packs.map((addPack) => {
  // Find the pack to merge with
  let targetPack = srcPackGroup.packs.filter((srcPack) => {
    return srcPack.name === addPack.name;
  });
  if (targetPack.length != 1) throw `Could not find ${addPack} in src folder to merge with`;
  targetPack = targetPack[0];

  // Add all documents to the pack
  addPack.documents.map((document) => {
    console.log(`Upserting ${document}`);
    diffs.push(targetPack.upsertDoc(document));
  });
});

// Log diffs
console.log(`Merge Diffs:`);
diffs.map((diff) => {
  console.log(`${diff.document.json.name}`);
  console.log(`${diff.diffString}`);
});

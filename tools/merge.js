import PackGroup from "./lib/packgroup.js";

const addPackGroup = new PackGroup('./additions');
const srcPackGroup = new PackGroup('./src/packs');

let diffs = [];
for (const [i, addPack] of addPackGroup.packs.entries()) {
  // Find the pack to merge with
  let targetPack = srcPackGroup.packs.filter((srcPack) => {
    return srcPack.name === addPack.name;
  });
  if (targetPack.length != 1) throw `Could not find ${addPack} in src folder to merge with`;
  targetPack = targetPack[0];

  // Add all documents to the pack
  for (const [i, document] of addPack.documents.entries()) {
    console.log(`Upserting ${document}`);
    diffs.push(targetPack.upsertDoc(document));
    // Pause processing until an answer has been received
    await Promise.all(diffs);
  };
};

// Log diffs
let completeDiffs = await Promise.all(diffs);
console.log(`Merge Diffs:`);
completeDiffs.map((diff) => {
  console.log(`${diff.document.json.name}`);
  console.log(`${diff.diffString}`);
});

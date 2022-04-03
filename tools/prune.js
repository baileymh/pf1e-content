// Prune stored .json files of unnecessary data to lighten the compendiums

import PackGroup from "./lib/packgroup.js";
import pruneDocument from './lib/pruneDocument.js';
const srcPacks = new PackGroup("./src/packs");

srcPacks.packs.forEach((pack) => {
	console.log("Pruning pack:", pack.name);
	const docs = pack.documents;
	let lastReport = performance.now();
	docs.forEach((doc, i) => {
		// Report processing state every 5 seconds
		const now = performance.now();
		if ((now - lastReport) > 5_000) {
			lastReport = now;
			console.log(i, "/", docs.length, ":", doc.name);
		}
		const { diffString } = pack.updateDoc(doc);
		if (diffString) console.log(doc.name, '\n', diffString);
	});
});

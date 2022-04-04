import fs from "fs-extra";
import path from "path";

import Pack from "./pack.js";

/* An PackGroup folder which can contain multiple packs */
export default class PackGroup {
  constructor(packPath) {
    this._packPath = packPath;
  };

  toString() {
    return `PackGroup[${path.basename(this.packPath)}]`;
  };

  get packPath() {
    return this._packPath;
  };

  get configuredPacks() {
    const module = fs.readJSONSync('./module.json');
    return module.packs.reduce((allPacks, pack) => {
      allPacks[pack.name] = {
        id: pack.name,
        label: pack.label,
        basename: path.win32.basename(pack.path, '.db'),
        path: pack.path,
        type: pack.type ?? pack.entity
      };
      return allPacks;
    }, {});
  }

  get packs() {
    const knownPacks = this.configuredPacks;

    let packs = [];
    let folders = fs.readdirSync(this.packPath).filter((file) => {
      return fs.statSync(path.join(this.packPath, file)).isDirectory();
    });
    folders.map((folder) => {
      const known = knownPacks[folder] ?? Object.keys(knownPacks).find(p => p.basename === folder);
      if (!known) console.warn("Could not match", folder, "to a pack in module.json for type information");
      packs.push(new Pack(path.join(this.packPath, folder), { type: known?.type }));
    });
    return packs;
  };
};

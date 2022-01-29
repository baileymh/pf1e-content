import fs from "fs";
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

  get packs() {
    let packs = [];
    let folders = fs.readdirSync(this.packPath).filter((file) => {
      return fs.statSync(path.join(this.packPath, file)).isDirectory();
    });
    folders.map((folder) => {
      packs.push(new Pack(path.join(this.packPath, folder)));
    });
    return packs;
  };
};

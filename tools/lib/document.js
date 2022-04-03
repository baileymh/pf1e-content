import fs from "fs-extra";
import path from "path";

/* A single document for adding to packs */
export default class Document {
  constructor(filePath) {
    this._filePath = filePath;
  };

  get filePath() {
    return this._filePath;
  };

  get name() {
    return path.basename(this._filePath);
  };

  toString() {
    return `Document[${this.filePath}]`;
  };

  #removeNestedKey(key, item) {
    if (typeof item === 'object' && item != null) {
      Object.getOwnPropertyNames(item).forEach(function (testKey) {
        if (testKey === key) delete item[testKey];
        else this.#removeNestedKey(key, item[testKey]);
      }.bind(this));
    };
  };

  #clean(item) {
    // Remove export source flags
    if (item.flags?.exportSource) {
      delete item.flags.exportSource;
    };
    // Remove core sourceId
    if (item.flags?.core?.sourceId) {
      delete item.flags.core.sourceId;
    };
    // Remove permission data
    this.#removeNestedKey("permission", item);
    return item;
  }

  /* JSON object for this document */
  get json() {
    return this.#clean(fs.readJSONSync(this.filePath));
  };

  /* Write a new document in the given pack */
  create(pack) {
    let data = this.json;
    data._id = pack.getId();
    let fileName = pack.formatDocumentName(data);
    let filePath = path.join(pack.folderPath, fileName);
    if (fs.existsSync(filePath)) throw `Document already exists can not create: ${filePath}`;
    fs.writeJSONSync(filePath, data, {spaces: 2});
  };
};

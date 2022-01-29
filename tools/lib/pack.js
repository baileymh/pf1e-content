import path from "path";

import fs from "fs-extra";
import { diffString } from "json-diff";
import slugify from "slugify";
import crypto from "crypto";

import Document from "./document.js";

/* A pack folder which can container multiple documents for addition */
export default class Pack {
  constructor(folderPath) {
    this._folderPath = folderPath;
  };

  get folderPath() {
    return this._folderPath;
  };

  get name() {
    return path.basename(this._folderPath);
  };

  toString() {
    return `Pack[${path.basename(this.folderPath)}]`;
  };

  get documents() {
    var documents = [];
    var inputFiles = fs.readdirSync(this.folderPath).filter((file) => {
      return fs.statSync(path.join(this.folderPath, file)).isFile();
    });
    inputFiles.map((file) => {
      documents.push(new Document(path.join(this.folderPath, file)));
    });
    return documents;
  };

  #slugifyName(name) {
    return slugify(name, {remove: /[*~,\"!;:@/\\\|\?<>]/g});
  };

  formatDocumentName(document) {
    if (!document._id) throw `Id required for ${this}`;
    let slug = this.#slugifyName(document.name);
    return `${slug}-${document._id}`;
  };

  findDocs(document = null, id = null) {
    // Search by name or Id
    let searchFor;
    if (id) searchFor = id;
    else if (document) {
      let data = document.json;
      if (data._id) searchFor = data._id;
      else searchFor = this.#slugifyName(data.name);
    };

    // Find documents that match the serach
    let matchingFiles = [];
    this.documents.map((document) => {
      if (document.filePath.includes(searchFor)) {
        matchingFiles.push(document);
      };
    });
    return matchingFiles;
  };

  validateId(id) {
    let matchingFiles = this.findDocs(null, id);
    if (matchingFiles.length > 0) return false;
    else return true;
  };

  #getUid() {
    return crypto.randomBytes(Math.ceil(Math.max(8, 16 * 2)))
      .toString('base64')
      .replace(/[+\/]/g, '')
      .slice(0, 16);
  };

  getId() {
    let id = this.#getUid();
    // TODO: Remove when id collision testing is done.
    // let id = "FIXME";
    while (!this.validateId(id)) {
      console.log(`Id collision on ${id} trying again, this should be extremely rare`);
      id = this.#getUid();
    };
    return id;
  };

  /* Write a new document in the pack */
  createDoc(document) {
    let data = document.json;
    data._id = this.getId();
    let filePath = path.join(this.folderPath, this.formatDocumentName(data));
    if (fs.existsSync(filePath)) throw `Document already exists can not create: ${filePath}`;
    fs.writeJSONSync(filePath, data, {spaces: 2});
    return {document: document, diffString: diffString({}, data)};
  };

  /* Update an existing document */
  updateDoc(document) {
    let matchingFiles = this.findDocs(document);
    let filePath;
    let originalData;
    switch (matchingFiles.length) {
      case 0:
        throw `Couldn't fid document to update ${document.filePath}`;
      case 1:
        filePath = matchingFiles[0].filePath;
        originalData = matchingFiles[0].json;
        break;
      default:
        throw `Found more than one file to update for ${document.filePath}, not yet implemented`;
        break;
    };
    fs.writeJSONSync(filePath, document.json, {spaces: 2});
    return {document: document, diffString: diffString(originalData, document.json)};
  };

  /* Update or Create the document */
  upsertDoc(document) {
    let matchingFiles = this.findDocs(document);
    let delta;
    if (!matchingFiles.length) {
      delta = this.createDoc(document)
    }
    else {
      delta = this.updateDoc(document)
    };
    return delta;
  };
};

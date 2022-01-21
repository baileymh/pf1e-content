const Datastore = require("nedb");

const fs = require("fs");
const path = require("path");

const PACK_SRC = "additions";
const PACK_DIR = "packs";

function logme(value) {
  console.log(value)
};


async function compilePacks() {
  // Determine the source folders to process
  const folders = fs.readdirSync(PACK_SRC).filter((file) => {
    return fs.statSync(path.join(PACK_SRC, file)).isDirectory();
  });
  console.log(`Found folders: ${folders}`);

  // Open a database per folder
  folders.map((folder) => {
    console.log(`Processing: ${folder}`)
    const db = new Datastore({filename: path.resolve(__dirname, PACK_DIR, `${folder}.db`), autoload: true});

    // Find all files to be added to this database
    const files = fs.readdirSync(path.join(PACK_SRC, folder)).filter((file) => {
      return fs.statSync(path.join(PACK_SRC, folder, file)).isFile();
    });

    // Update or Insert each entry into the database
    files.map((file) => {
      console.log(`Processing file: ${file}`);
      let filePath = path.join(PACK_SRC, folder, file);
      let json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      console.log(`Looking for: ${json.name}`)
      db.find({name: json.name}, function (err, docs) {
        console.log(`Found: ${json.name}`);
        db.update({name: json.name}, json, {upsert: true}, function (err, num, docs, upsert) {
          console.log(`Modified num: ${num}\nupsert: ${upsert||false}`);
        });
      });
    });
  });
};

compilePacks();

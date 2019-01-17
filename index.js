const fs = require('fs'),
path = require('path'),
ALL_VALID_AGRS = ['-f', '-d', '-dest'],
HELP_AGRS = ['-h', '--help'],
jsonFilePattern = /\.[json]+$/i;

var item = {
  srcFiles: [],
  dstFile: ""
};

main();

async function main() {
  if (HELP_AGRS.indexOf(process.argv[2]) > -1) {
    printHelpInfo();
    return;
  }

  const srcDst = getSrcAndDest();
  if (!srcDst) {
    return;
  }
  const dstFile = srcDst.dstFile;
  fs.readFile('template.json', 'utf8', async function readFileCallback(err, data)   {
    if (err) {
      console.log(err);
    } else {
      const obj = JSON.parse(data); //now it an object
      await appendChildData(srcDst.srcFiles, obj, appendOneChildData);
      const json = JSON.stringify(obj); //convert it back to json
      fs.writeFile(dstFile, json, 'utf8', function(err) {
        if (err) {
          console.log(err);
        }
      }); // write it back 
    }
  });
}

async function appendChildData(files, res, fn) {
  return files.reduce( async (p, item) => {
    await p;
    return fn(item, res);
  }, Promise.resolve());
}

function appendOneChildData(file, res) {
  return new Promise(function(resolve, reject) {
    fs.readFile(file, 'utf8', function readFileCallback(err, data) {
      if (err) {
        reject(err);
      } else {
        const obj = JSON.parse(data); //now it an object
        const newData = {};
        newData.name = obj.info.name;
        newData.item = obj.item;
        res.item.push(newData);
        resolve(res);
      }
    });
  });
}

function getSrcAndDest() {
  const args = process.argv;
  let dstFile = '',
  srcFiles = [],
  pos = [],
  fPos,
  dPos,
  dstPos;

  for (let i = 2; i < args.length; i++) {
    if (ALL_VALID_AGRS.indexOf(args[i]) > -1) {
      pos[args[i]] = i;
    }
  }

  fPos = pos[ALL_VALID_AGRS[0]];
  dPos = pos[ALL_VALID_AGRS[1]];
  dstPos = pos[ALL_VALID_AGRS[2]];

  if (typeof fPos === 'undefined' && typeof dPos === 'undefined') {
    console.log('At least -f or -d should be has value');
  } else if (typeof fPos !== 'undefined') {
    srcFiles = getFiles(fPos, args);
  } else {
    srcFiles = getFolderFiles(dPos, args);
  }

  if (srcFiles.find(function(it) {
    return !it.match(jsonFilePattern);
  })) {
    console.log('All input files should be json file!');
    return false;
  }

  if (srcFiles.length == 0) {
    console.log('At least one file json is input!');
    return false;
  }

  dstFile = getDestFile(dstPos);

  item.srcFiles = srcFiles;
  item.dstFile = dstFile;

  printInfo(srcFiles, dstFile);

  return item;
}

function getDestFile(destPos) {
  if (typeof destPos !== 'undefined') {
    return process.argv[destPos + 1];
  }
  return 'master.json';
}

function getFolderFiles(dPos, args) {
  const folder = args[dPos + 1];
  const relativePath = path.join(__dirname, folder);
  return fs.readdirSync(path.join(__dirname, folder)).filter(it => {
    return it.match(jsonFilePattern);
  }).map(it => {
    return path.join(relativePath, it);
  });
}

function getFiles(fPos, args) {
  let res = [];
  for (let i = fPos + 1; i < args.length; i++) {
    if (ALL_VALID_AGRS.indexOf(args[i]) == -1) {
      res.push(args[i]);
    } else {
      break;
    }
  }
  return res;
}

function printInfo(srcFiles, dstFile) {
  console.log(`Input: `);
  for (let i = 0; i < srcFiles.length; i++) {
    console.log(`   ${srcFiles[i]}`);
  }
  console.log(`Output: ${dstFile}`);
}

function printHelpInfo() {
  console.log(`
    Postman Combine Help:
      -h, --help    help
      -f            all input json files
      -d            input folder contains all json files
      -dest         output file

    Postman Combine loves you <3!
  `);
}
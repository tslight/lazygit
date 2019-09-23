const args = {};
const fs   = require('fs');
const home = require('os').homedir();
const path = require('path');

function expandPath(filepath) {
  if (filepath[0] === '~') {
    return path.join(home, filepath.slice(1));
  }
  return filepath;
}

function chkDir(dir) {
  //https://stackove rflow.com/a/40686853
  if (fs.existsSync(dir) == false) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

args.chkToken = (arg) => {
  if (arg == undefined) {
    try {
      var config = require('../config');
      if(config.token == undefined) {
	console.log("No API token provided. Aborting.");
	process.exit(1);
      }
      return config.token;
    } catch(e) {
      console.log("Cannot find config file. Aborting.");
      process.exit(1);
    }
  } else {
    return arg;
  }
};

args.chkDest = (arg) => {
  if (arg == undefined) {
    try {
      var config = require('../config');
      if(config.dest == undefined) {
	console.log("No destination provided. Aborting.");
	process.exit(1);
      }
      chkDir(config.dest);
      return expandPath(config.dest);
    } catch(e) {
      console.log("Cannot find config file. Aborting.");
      process.exit(1);
    }
  } else {
    chkDir(arg);
    return expandPath(arg);
  }
};

args.chkGroup = (arg) => {
  return arg;
};

module.exports = args;

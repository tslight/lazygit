const fs    = require('fs');
const home  = require('os').homedir();
const path  = require('path');
const yargs = require('yargs');
const args  = yargs
      .option('token', {
	alias: 't',
	description: 'Gitlab API token',
	type: 'string',
      })
      .option('destination', {
	alias: 'd',
	description: 'Destination directory',
	type: 'string',
      })
      .option('group', {
	alias: 'g',
	description: 'Group to download.',
	type: 'string',
      })
      .option('verbose', {
	alias: 'v',
	description: 'Increase verbosity.',
	type: 'boolean',
      })
      .help()
      .alias('help', 'h')
      .argv;

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

args.chkToken = () => {
  if (args.token) {
    return args.token;
  } else {
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
  }
};

args.chkDest = () => {
  if (args.destination) {
    chkDir(args.destination);
    return expandPath(args.destination);
  } else {
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
  }
};

module.exports = args;

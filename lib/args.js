const util  = require('./util');
const yargs = require('yargs');
const args  = yargs
  .option('destination', {
    alias: 'd',
    description: 'Destination directory',
    type: 'string',
  })
  .option('group', {
    alias: 'g',
    description: 'Group to download.',
    default: '',
    type: 'string',
  })
  .option('token', {
    alias: 't',
    description: 'Gitlab API token',
    type: 'string',
  })
  .option('status', {
    alias: 's',
    description: 'View local status.',
    type: 'boolean',
  })
  .option('verbose', {
    alias: 'v',
    description: 'Increase verbosity.',
    type: 'boolean',
  })
  .help()
  .alias('help', 'h')
  .argv;

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
    util.chkDir(util.expandPath(args.destination));
    return util.expandPath(args.destination);
  } else {
    try {
      var config = require('../config');
      if(config.dest == undefined) {
	console.log("No destination provided. Aborting.");
	process.exit(1);
      }
      util.chkDir(util.expandPath(config.dest));
      return util.expandPath(config.dest);
    } catch(e) {
      console.log("Cannot find config file. Aborting.");
      process.exit(1);
    }
  }
};

module.exports = args;

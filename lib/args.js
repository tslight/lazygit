const util  = require('./util');
const yargs = require('yargs');
const args  = yargs
      .option('create', {
	alias: 'c',
	description: 'Create a gitlab runner registering script',
	type: 'string',
      })
      .option('file', {
	description: 'Destination file for gitlab runner script',
	type: 'string',
      })
      .option('destination', {
	alias: 'd',
	description: 'Destination directory to operate on',
	type: 'string',
      })
      .option('fetch', {
	alias: 'f',
	description: 'Run fetch --all, instead of pull',
	type: 'boolean',
      })
      .option('http', {
	description: 'Use http url to access projects',
	type: 'boolean',
      })
      .option('ssh', {
	description: 'Use ssh url to access projects',
	type: 'boolean',
	default: true,
      })
      .option('namespaces', {
	alias: 'n',
	description: 'Namespace to download (group or user)',
	type: 'array',
	default: '',
      })
      .option('show', {
	alias: 'S',
	description: 'The API resource/context to work with',
	type: 'string',
      })
      .option('slack', {
	description: 'Update Slack integration settings',
	type: 'boolean',
      })
      .option('status', {
	alias: 's',
	description: 'View local project status',
	type: 'boolean',
      })
      .option('token', {
	alias: 't',
	description: 'Gitlab API token',
	type: 'string',
      })
      .option('verbose', {
	alias: 'v',
	description: 'Increase verbosity',
	type: 'boolean',
      })
      .help()
      .alias('h', 'help')
      .conflicts('fetch', 'status')
      .implies('create', 'file')
      .argv;

args.chkFile = () => {
  if (args.file) {
    return util.expandPath(args.file);
  }
};

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
      console.log(e);
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
      console.log(e);
      console.log("Cannot find config file. Aborting.");
      process.exit(1);
    }
  }
};

module.exports = args;

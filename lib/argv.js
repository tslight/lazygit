const argv = require('yargs');
const util  = require('./util');
const lazy = require('./gitlab/lazy');
const Runners = require('./gitlab/Runners');

argv
  .command('create [resource]', 'Create GitLab resources', {
    file: {
      alias: 'f',
      default: 'http://yargs.js.org/',
      description: 'Destination file for gitlab runner script',
      type: 'string',
    }
  }, (argv) => {
    return Runners.makeBashScript(argv.create, argv.file);
  })
  .command('show [resource]', 'Show GitLab resources', {
    order: {
      alias: 'o',
      description: 'Attribute to order API resources by',
      type: 'string',
    },
    attributes: {
      alias: 'a',
      description: 'Only show these attributes of a resource',
      type: 'array',
    },
    filter_key: {
      alias: 'K',
      description: 'Key to filter API resources by',
      type: 'string',
    },
    filter_value: {
      alias: 'V',
      description: 'Value to filter API resources by',
      type: 'string',
    }
  }, (argv) => {
    return lazy.show(argv)
      .then((data) => {
	data.map((d) => {
	  console.log(JSON.stringify(d, null, 2));
	});
      });
  })
  .command('run [command]', 'Run git commands on GitLab', {}, (argv) => {
    return lazy.run(argv.run);
  })
  .option('destination', {
    alias: 'd',
    description: 'Destination directory to operate on',
    type: 'string',
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
    description: 'Enter namespaces to operate on',
    type: 'array',
    default: '',
  })
  .option('projects', {
    alias: 'p',
    description: 'Enter projects to operate on',
    type: 'array',
  })
  .option('groups', {
    alias: 'g',
    description: 'Enter groups to operate on',
    type: 'array',
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
  .implies('filter_key', 'filter_value')
  .argv;

argv.chkFile = () => {
  if (argv.file) {
    return util.expandPath(argv.file);
  }
};

argv.chkToken = () => {
  if (argv.token) {
    return argv.token;
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

argv.chkDest = () => {
  if (argv.destination) {
    util.chkDir(util.expandPath(argv.destination));
    return util.expandPath(argv.destination);
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

module.exports = argv;

const argv = require('yargs');
const axios = require('axios');
const util  = require('./util');
const parse  = require('./parse');
const lazy = require('./gitlab/lazy');
const api = require('./gitlab/api');
const Runners = require('./gitlab/runners');

argv
  .command('create [resource]', 'Create GitLab resources', {
    file: {
      alias: 'f',
      default: 'http://yargs.js.org/',
      description: 'Destination file for gitlab runner script',
      type: 'string',
    }
  }, (argv) => {
    if (argv.file) {
      util.expandPath(argv.file);
    }
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
  .coerce('destination', (argv) => {
    return parse.destination(argv.destination);
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
  .coerce('token', (argv) => {
    return parse.token(argv.token);
  })
  .option('verbose', {
    alias: 'v',
    description: 'Increase verbosity',
    type: 'boolean',
  })
  .help()
  .alias('h', 'help')
  .argv;

module.exports = argv;

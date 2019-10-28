exports.command = 'runner <resource>';
exports.desc = 'Create runner registering script for resource';
exports.builder = {
  'file': {
    alias: 'f',
    description: 'Destination file for gitlab runner script',
    type: 'string',
  },
};
exports.handler = (argv) => {
  console.log('Creating runner script for %s', argv.resource);
};

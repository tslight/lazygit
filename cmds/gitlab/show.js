exports.command = 'show <resource>';
exports.desc = 'Show metadata of API resource';
exports.builder = {
  'order': {
    alias: 'o',
    description: 'Attribute to order API resources by',
    type: 'string',
  },
  'attributes': {
    alias: 'a',
    description: 'Only show these attributes of a resource',
    type: 'array',
  },
  'filter_key': {
    alias: 'K',
    description: 'Key to filter API resources by',
    type: 'string',
  },
  'filter_value': {
    alias: 'V',
    description: 'Value to filter API resources by',
    type: 'string',
  },
};
exports.handler = function (argv) {
  console.log('Showing %s', argv.resource);
};

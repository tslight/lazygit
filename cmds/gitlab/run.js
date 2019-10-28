exports.command = 'run <command>';
exports.desc = 'Run Git command';
exports.builder = {};
exports.handler = (argv) => {
  console.log('Running %s', argv.command);
};

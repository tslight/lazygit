exports.command = 'hub <command>';
exports.desc = 'Interact with GitHub API';
exports.builder = function (yargs) {
  return yargs.commandDir('./github');
};
exports.handler = function (argv) {};

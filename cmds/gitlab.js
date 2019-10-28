exports.command = 'lab <command>';
exports.desc = 'Interact with GitLab API';
exports.builder = (yargs) => {
  return yargs.commandDir('./gitlab');
};
exports.handler = (argv) => {};

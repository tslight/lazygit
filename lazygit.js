#!/usr/bin/env node
require('yargs')
  .commandDir('cmds')
  .demandCommand()
  .config()
  .help()
  .alias('h', 'help')
  .argv

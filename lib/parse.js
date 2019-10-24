const axios = require('axios');
const util = require('./util');
const parse = {};

parse.destination = (destination) => {
  if (argv.destination) {
    util.chkDir(util.expandPath(argv.destination));
    return util.expandPath(argv.destination);
  } else {
    try {
      if(config.dest == undefined) {
	console.log("No destination provided. Aborting.");
	process.exit(1);
      }
      util.chkDir(util.expandPath(config.dest));
      return util.expandPath(config.dest);
    } catch(e) {
      console.log(e);
      console.log("Cannot find config file. Aborting.");
      return process.exit(1);
    }
  }
};

parse.token = (token) => {
  if (token) {
    return axios.create({
      baseURL: 'https://www.gitlab.com',
      headers: {'PRIVATE-TOKEN': token}
    });
  } else {
    try {
      const config = require('../config');
      if (config.token == undefined) {
	console.log("No API token provided. Aborting.");
	return process.exit(1);
      } else {
	return axios.create({
	  baseURL: 'https://www.gitlab.com',
	  headers: {'PRIVATE-TOKEN': config.token}
	});
      }
    } catch(e) {
      console.log(e);
      console.log("Cannot find config file. Aborting.");
      return process.exit(1);
    }
  }
};

module.exports = parse;

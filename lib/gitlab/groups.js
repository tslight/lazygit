const api = require('./api');
const args = require('../args');
const Projects = require('./projects');
const Runners = require('./runners');
const util = require('./util');
const Groups = {};

Groups.getProjectUrls = () => {
  return api.getResource('groups', {attributes: ['projects']})
    .then((projects) => {
      return Projects.getUrls(projects.flat());
    });
};

Groups.makeRunnerRegisterScript = (file) => {
  util.makeBashScript(file);
  return api.getResource('groups')
    .then((groups) => {
      return Runners.getTokens(groups);
    })
    .then((tokens) => {
      return Runners.getCommands(tokens);
    })
    .then((runners) => {
      return runners.map((runner) => {
	console.log(runner);
	return util.addRunnerToScript(file, runner);
      });
    });
};

Groups.registerRunners = () => {
  return api.getResource('groups')
    .then((groups) => {
      return groups.map((group) => {
	return Runners.register(group.name, group.runners_token);
      });
    });
};

module.exports = Groups;

const fs = require('fs');
const api = require('./api');
const git = require('../git');
const args = require('../args');
const util = require('./util');
const Runners = require('./runners');
const Projects = {};

Projects.getUrls = (projects) => {
  // Pull out url attributes from all project objects.
  return projects.map((project) => {
    return (args.http ? project.http_url_to_repo : project.ssh_url_to_repo);
  });
};

Projects.makeRunnerRegisterScript = (file) => {
  util.makeBashScript(file);
  return api.getResource('projects')
    .then((projects) => {
      return Runners.getTokens(projects.flat());
    })
    .then((tokens) => {
      return Runners.getCommands(tokens);
    })
    .then((runners) => {
      return runners.map((runner) => {
	util.addRunnerToScript(file, runner);
	console.log(runner);
      });
    });
};

Projects.putSlackSetting = (setting, webhook) => {
  return api.getIds('projects')
    .then((ids) => {
      return ids.map((id) => {
	return api.putSlackSetting(id);
      });
    });
};

Projects.run = (cmd) => {
  return api.getResource('projects')
    .then((projects) => {
      return Projects.getUrls(projects);
    })
    .then((urls) => {
      return urls.map((url) => {
	return git.run(url, cmd);
      });
    });
};

module.exports = Projects;

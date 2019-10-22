const api = require('./api');
const git = require('../git');
const args = require('../args');
const Projects = {};

Projects.getUrls = (projects) => {
  // Pull out url attributes from all project objects.
  return projects.map((project) => {
    return (args.http ? project.http_url_to_repo : project.ssh_url_to_repo);
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
  return api.getResources('projects')
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

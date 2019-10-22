const api = require('./api');
const Projects = require('./projects');
const Groups = {};

Groups.getProjectUrls = () => {
  return api.getResource('groups', {attributes: ['projects']})
    .then((projects) => {
      return Projects.getUrls(projects.flat());
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

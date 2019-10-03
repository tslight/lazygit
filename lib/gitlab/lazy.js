const resource = require('../args').resource;
const api      = require('./api');
const Groups   = require('./groups');
const Projects = require('./projects');
const Runners  = require('./runners');
const lazy     = {};

lazy.init = () => {
  switch(resource) {
  case 'groups':
    Groups.get();
    break;
  case 'projects':
    Projects.run();
    break;
  case 'runners':
    Runners.showOwned();
    break;
  case 'group-runner-tomls':
    Groups.getRunnerTomls();
    break;
  case 'group-runner-cmds':
    Groups.getRunnerCommands();
    break;
  case 'group-register-runners':
    Groups.registerRunners();
    break;
  case 'project-hooks':
    Projects.getAttributes(api.getProjectHooks);
    break;
  case 'project-jobs':
    Projects.getAttributes(api.getProjectJobs);
    break;
  case 'project-pipelines':
    Projects.getAttributes(api.getProjectPipelines);
    break;
  case 'project-schedules':
    Projects.getAttributes(api.getProjectSchedules);
    break;
  case 'project-tree':
    Projects.getAttributes(api.getProjectTree);
    break;
  case 'project-runner-tomls':
    Projects.getRunnerTomls();
    break;
  case 'project-runner-cmds':
    Projects.getRunnerCommands();
    break;
  default:
    Projects.run();
  }
};

module.exports = lazy;

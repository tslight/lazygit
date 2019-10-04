const create   = require('../args').create;
const file     = require('../args').chkFile();
const resource = require('../args').resource;
const api      = require('./api');
const Groups   = require('./groups');
const Projects = require('./projects');
const Runners  = require('./runners');
const lazy     = {};

lazy.init = () => {
  switch(create) {
  case 'groups':
    return Groups.makeRunnerRegisterScript(file);
  case 'projects':
    return Projects.makeRunnerRegisterScript(file);
  default:
    break;
  }

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
  case 'project-slack-service':
    Projects.getAttributes(api.getProjectSlackService);
    break;
  case 'project-tree':
    Projects.getAttributes(api.getProjectTree);
    break;
  default:
    Projects.run();
  }
};

module.exports = lazy;

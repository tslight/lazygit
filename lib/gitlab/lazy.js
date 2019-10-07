const create   = require('../args').create;
const file     = require('../args').chkFile();
const show     = require('../args').show;
const slack    = require('../args').slack;
const setting  = require('../args').setting;
const webhook  = require('../args').webhook;
const api      = require('./api');
const Groups   = require('./groups');
const Projects = require('./projects');
const Runners  = require('./runners');
const lazy     = {};

lazy.create = () => {
  switch(create) {
  case 'groups':
    return Groups.makeRunnerRegisterScript(file);
  case 'projects':
    return Projects.makeRunnerRegisterScript(file);
  default:
    break;
  }
};

lazy.show = (show) => {
  switch(show) {
  case 'groups':
    return Groups.getProjectUrls();
  case 'runners':
    return api.getRunners();
  case 'hooks':
    return Projects.getAttributes(api.getProjectHooks);
  case 'jobs':
    return Projects.getAttributes(api.getProjectJobs);
  case 'pipelines':
    return Projects.getAttributes(api.getProjectPipelines);
  case 'schedules':
    return Projects.getAttributes(api.getProjectSchedules, 'next_run_at');
  case 'slack':
    return Projects.getAttributes(api.getProjectSlackService);
  case 'tree':
    return Projects.getAttributes(api.getProjectTree);
  default:
    break;
  }
};

lazy.init = () => {
  if (slack) {
    return Projects.putSlackSetting();
  } else if (show != undefined) {
    return lazy.show(show)
      .then((data) => {
	console.log(data);
      });
  } else if (create != undefined) {
    return lazy.create(create);
  } else {
    Projects.run();
  }
};

module.exports = lazy;

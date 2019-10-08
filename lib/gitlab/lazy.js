const args = require('../args');
const file = require('../args').chkFile();
const api = require('./api');
const Groups = require('./groups');
const Projects = require('./projects');
const Runners = require('./runners');
const lazy = {};

lazy.create = () => {
  switch(args.create) {
  case 'groups':
    return Groups.makeRunnerRegisterScript(file);
  case 'projects':
    return Projects.makeRunnerRegisterScript(file);
  default:
    break;
  }
};

lazy.show = () => {
  switch(args.show) {
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
  if (args.slack) {
    return Projects.putSlackSetting();
  } else if (args.show != undefined) {
    return lazy.show()
      .then((data) => {
	console.log(data);
      });
  } else if (args.create != undefined) {
    return lazy.create();
  } else if (args.run != undefined) {
    Projects.run(args.run);
  } else {
    Projects.run('pull-or-clone');
  }
};

module.exports = lazy;

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
  default:
    return Projects.getAttributes(
      args.show,
      args.order,
      args.filter_key,
      args.filter_value
    );
    break;
  }
};

lazy.init = () => {
  if (args.slack) {
    return Projects.putSlackSetting();
  } else if (args.show != undefined) {
    return lazy.show()
      .then((data) => {
	console.log(JSON.stringify(data, null, 2));
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

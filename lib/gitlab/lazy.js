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
    return Groups.get();
  case 'projects':
    return Projects.get();
  case 'group_urls':
    return Groups.getProjectUrls();
  case 'project_urls':
    return Projects.getProjectUrls();
  case 'runners':
    return api.getRunners();
  case 'commits':
    return Projects.getAttributes(
      'repository/commits',
      'created_at',
      'title'
    );
  default:
    return Projects.getAttributes(
      args.show,
      args.order,
      args.attribute,
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

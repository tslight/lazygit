const args = require('../args');
const file = require('../args').chkFile();
const api = require('./api');
const Groups = require('./groups');
const Projects = require('./projects');
const Runners = require('./runners');
const lazy = {};
const outputFilters = {
  attributes: args.attributes,
  filterKey: args.filter_key,
  filterValue: args.filter_value,
  sortKey: args.order,
};

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
    return Groups.get(outputFilters);
  case 'projects':
    return Projects.get(outputFilters);
  case 'group_urls':
    return Groups.getProjectUrls();
  case 'project_urls':
    return Projects.getProjectUrls();
  case 'runners':
    return Runners.showOwned(outputFilters);
  case 'commits':
    return Projects.getResource('repository/commits', {
      sortKey: 'created_at',
      attributes: ['title'],
    });
  default:
    return Projects.getResource(args.show, outputFilters);
    break;
  }
};

lazy.init = () => {
  if (args.slack) {
    return Projects.putSlackSetting();
  } else if (args.show != undefined) {
    return lazy.show()
      .then((data) => {
	data.map((d) => {
	  console.log(JSON.stringify(d, null, 2));
	});
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

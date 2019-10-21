const args = require('../args');
const file = require('../args').chkFile();
const api = require('./api');
const Groups = require('./groups');
const Projects = require('./projects');
const Runners = require('./runners');
const util = require('./util');
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
      attributes: ['title', 'author_name'],
    });
  case 'schedules':
    return Projects.getResource('pipeline_schedules', {
      sortKey: 'next_run_at',
      attributes: ['description', 'cron'],
    });
  case 'all_members':
    if (args.groups != undefined) {
      return Groups.getResource('members/all', {
	sortKey: 'name',
	attributes: ['name', 'access_level'],
      })
	.then((members) => {
	  return util.getMembersAccessLevel(members);
	});
    } else if (args.projects != undefined) {
      return Projects.getResource('members/all', {
	sortKey: 'name',
	attributes: ['name', 'access_level'],
      })
	.then((members) => {
	  return util.getMembersAccessLevel(members);
	});
    } else {
      console.log("You have not entered any projects or groups...");
      process.exit(1);
    }
  default:
    if (args.groups != undefined) {
      return Groups.getResource(args.show, outputFilters);
    } else {
      return Projects.getResource(args.show, outputFilters);
    }
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

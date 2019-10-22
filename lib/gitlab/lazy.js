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

lazy.show = () => {
  switch(args.show) {
  case 'groups':
  case 'projects':
    return api.getResources(args.show, outputFilters);
  case 'group_urls':
    return Groups.getProjectUrls();
  case 'project_urls':
    return Projects.getProjectUrls();
  case 'runners':
    return api.getResources('runners', outputFilters);
  case 'commits':
    return api.getSubResources('projects', 'repository/commits', {
      sortKey: 'created_at',
      attributes: ['title', 'author_name'],
    });
  case 'schedules':
    return api.getSubResources('projects', 'pipeline_schedules', {
      sortKey: 'next_run_at',
      attributes: ['description', 'cron'],
    });
  case 'all_members':
    if (args.groups != undefined) {
      return api.getSubResources('groups', 'members/all', {
	sortKey: 'name',
	attributes: ['name', 'access_level'],
      })
	.then((members) => {
	  return util.getMembersAccessLevel(members);
	});
    } else if (args.projects != undefined) {
      return api.getSubResources('projects', 'members/all', {
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
      return api.getSubResources('groups', args.show, outputFilters);
    } else {
      return api.getSubResources('projects', args.show, outputFilters);
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
    return Runners.makeBashScript(args.create, file);
  } else if (args.run != undefined) {
    return Projects.run(args.run);
  } else {
    return Projects.run('pull-or-clone');
  }
};

module.exports = lazy;

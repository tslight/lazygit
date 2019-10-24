const api = require('./api');
const git = require('../git');
const Runners = require('./runners');

const getMembersAccessLevel = (members) => {
  let levels = {
    50: 'Owner',
    40: 'Maintainer',
    30: 'Developer',
    20: 'Reporter',
    10: 'Guest',
  };
  return members.map((member) => {
    member['access_level'] = levels[member['access_level']];
    return member;
  });
};
const lazy = {};

lazy.run = (argv) => {
  return api.getResources('projects', {
    attributes: argv.http ? ['http_url_to_repo'] : ['ssh_url_to_repo']
  })
    .then((urls) => {
      return urls.map((url) => {
	return git.run(url, argv.run);
      });
    });
};

lazy.urls = (argv) => {
  if (argv.groups != undefined) {
    return api.getResources('groups', {attributes: ['projects']})
      .then((projects) => {
	return projects.flat().map((project) => {
	  return (argv.http ? project.http_url_to_repo : project.ssh_url_to_repo);
	});
      });
  } else {
    return api.getResources('projects', {
      attributes: argv.http ? ['http_url_to_repo'] : ['ssh_url_to_repo']
    });
  }
};

lazy.members = (argv) => {
  if (argv.groups != undefined) {
    return api.getSubResources('groups', 'members/all', {
      sortKey: 'name',
      attributes: ['name', 'access_level'],
    })
      .then((members) => {
	return getMembersAccessLevel(members);
      });
  } else {
    return api.getSubResources('projects', 'members/all', {
      sortKey: 'name',
      attributes: ['name', 'access_level'],
    })
      .then((members) => {
	return getMembersAccessLevel(members);
      });
  }
};

lazy.show = (argv) => {
  let out = {
    attributes: argv.attributes,
    filterKey: argv.filter_key,
    filterValue: argv.filter_value,
    sortKey: argv.order,
  };
  switch(argv.show) {
  case 'groups':
  case 'namespaces':
  case 'projects':
  case 'runners':
    return api.getResources(argv.show, out);
  case 'urls':
    return lazy.urls();
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
    return lazy.members();
  default:
    if (argv.groups != undefined) {
      return api.getSubResources('groups', argv.show, out);
    } else {
      return api.getSubResources('projects', argv.show, out);
    }
    break;
  }
};

module.exports = lazy;

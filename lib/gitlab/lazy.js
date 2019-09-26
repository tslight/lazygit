const resource = require('../args').resource;
const util = require('../util');
const git = require('../git');
const Groups = require('./groups');
const Projects = require('./projects');
const Runners = require('./runners');
const lazy = {};

lazy.runGit = (urls) => {
  // Send urls to be processed by git.
  return urls.map((url) => {
    return git.run(url);
  });
};

lazy.narrow = (lib) => {
  return lib.get()
    .then((obj) => {
      return lib.getNamespace((obj));
    });
};

lazy.Groups = () => {
  return lazy.narrow(Groups)
    .then ((groups) => {
      return util.getNestedAttr(groups, 'id');
    })
    .then ((gids) => {
      let projects = gids.map((gid) => {
	return Groups.getProjects(gid);
      });
      Promise.all(projects)
	.then((projects) => {
	  return projects.flat();
	})
	.then((projects) => {
	  return Groups.getProjectUrls(projects);
	})
	.then((urls) => {
	  console.log(urls);
	});
    });
};

lazy.Projects = () => {
  return lazy.narrow(Projects)
    .then((projects) => {
      return Projects.getUrls(projects);
    })
    .then((urls) => {
      return lazy.runGit(urls);
    });
};

lazy.projectTokens = () => {
  return lazy.narrow(Projects)
    .then((projects) => {
      return Projects.getRunnerTokens(projects);
    })
    .then((projectTokens) => {
      console.log(projectTokens);
    });
};

lazy.Runners = () => {
  return Runners.getOwned()
    .then((runners) => {
      console.log(runners);
    });
};

lazy.groupTokens = () => {
  return lazy.narrow(Groups)
    .then((groups) => {
      console.log(groups);
    });
};

lazy.init = () => {
  switch(resource) {
    case 'groups':
      lazy.Groups();
      break;
    case 'projects':
      lazy.Projects();
      break;
    case 'runners':
      lazy.Runners();
      break;
    case 'tokens':
      lazy.projectTokens();
      break;
    default:
      lazy.Projects();
  }
};

module.exports = lazy;

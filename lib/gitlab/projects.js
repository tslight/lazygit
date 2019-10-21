const fs = require('fs');
const api = require('./api');
const clr  = require('../color');
const git = require('../git');
const args = require('../args');
const util = require('./util');
const Runners = require('./runners');
const Projects = {};

Projects.getNamespace = (projects) => {
  // Filter project objects by match to namespace argument - defaults to an
  // empty string, so if no namespace argument - returns all projects.
  return args.namespaces.map((namespace) => {
    return projects.filter((project) => {
      return project.path_with_namespace.startsWith(namespace);
    });
  }).flat();
};

Projects.get = (out = {}) => {
  return api.getProjects()
    .then((projects) => {
      if (args.projects != undefined) {
	return util.narrow(args.projects, projects);
      } else {
	return Projects.getNamespace(projects);
      }
    })
    .then((projects) => {
      return projects.map((project) => {
	return project.id;
      });
    })
    .then((gids) => {
      let projects = gids.map((gid) => {
	return api.getProjectIds(gid);
      });
      return Promise.all(projects)
	.then((projects) => {
	  return projects.flat();
	})
	.then((projects) => {
	  return util.filter(projects, out);
	});
    });
};

Projects.getIds = () => {
  return Projects.get()
    .then((projects) => {
      return projects.map((project) => {
	return project.id;
      });
    });
};

Projects.getUrls = (projects) => {
  // Pull out url attributes from all project objects.
  return projects.map((project) => {
    return (args.http ? project.http_url_to_repo : project.ssh_url_to_repo);
  });
};

Projects.makeRunnerRegisterScript = (file) => {
  util.makeBashScript(file);
  return Projects.get()
    .then((projects) => {
      return Runners.getTokens(projects.flat());
    })
    .then((tokens) => {
      return Runners.getCommands(tokens);
    })
    .then((runners) => {
      return runners.map((runner) => {
	util.addRunnerToScript(file, runner);
	console.log(runner);
      });
    });
};

Projects.getResource = (resource, out) => {
  return Projects.getIds()
    .then((ids) => {
      let resources = ids.map((id) => {
	return api.getProjectResource(id, resource);
      });
      return Promise.all((resources))
	.then((resources) => {
	  return util.filter(resources, out);
	});
    });
};

Projects.putSlackSetting = (setting, webhook) => {
  return Projects.getIds()
    .then((ids) => {
      return ids.map((id) => {
	return api.putSlackSetting(id);
      });
    });
};

Projects.run = (cmd) => {
  return Projects.get()
    .then((projects) => {
      return Projects.getUrls(projects);
    })
    .then((urls) => {
      return urls.map((url) => {
	return git.run(url, cmd);
      });
    });
};

module.exports = Projects;

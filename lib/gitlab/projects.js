const fs = require('fs');
const api = require('./api');
const clr  = require('../color');
const git = require('../git');
const http = require('../args').http;
const namespaces = require('../args').namespaces;
const Runners = require('./runners');
const Projects = {};

Projects.getNamespace = (projects) => {
  // Filter project objects by match to namespace argument - defaults to an
  // empty string, so if no namespace argument - returns all projects.
  return namespaces.map((namespace) => {
    return projects.filter((project) => {
      return project.path_with_namespace.startsWith(namespace);
    });
  }).flat();
};

Projects.getUrls = (projects) => {
  // Pull out url attributes from all project objects.
  return projects.map((project) => {
    if (http) {
      return project.http_url_to_repo;
    } else {
      return project.ssh_url_to_repo;
    }
  });
};

Projects.getRunnerTokens = (projects) => {
  // Pull out url attributes from all project objects.
  return projects.map((project) => {
    console.log(project);
    return project.runners_token;
  });
};

Projects.makeRunnerRegisterScript = (file) => {
  fs.writeFile(file, '#!/usr/bin/env bash\n\n', function (err) {
    if (err) throw err;
    console.log(`\n${clr.grn}Created ${file}.${clr.off}\n`);
  });
  return api.getProjects()
    .then((projects) => {
      return Projects.getNamespace(projects);
    })
    .then((projects) => {
      return projects.map((project) => {
	return project.id;
      });
    })
    .then((ids) => {
      let projects = ids.map((id) => {
	return api.getProjectIds(id);
      });
      Promise.all(projects)
	.then((projects) => {
	  return Runners.getTokens(projects);
	})
	.then((tokens) => {
	  return Runners.getCommands(tokens);
	})
	.then((runners) => {
	  return runners.map((runner) => {
	    fs.appendFile(file, runner, function (err) {
	      if (err) throw err;
	      console.log(runner);
	    });
	  });
	});
    });
};

Projects.getAttributes = (getterFunction, sortKey) => {
  return api.getProjects()
    .then((projects) => {
      return Projects.getNamespace(projects);
    })
    .then((projects) => {
      return projects.map((project) => {
	return project.id;
      });
    })
    .then((ids) => {
      let attributes = ids.map((id) => {
	return getterFunction(id);
      });
      return Promise.all((attributes))
	.then((attributes) => {
	  return attributes.flat();
	})
	.then((attributes) => {
	  // https://flaviocopes.com/how-to-sort-array-of-objects-by-property-javascript/
	  if (sortKey != undefined) {
	    return attributes.sort((a, b) => {
	      return a[sortKey] > b[sortKey] ? 1 : -1;
	    });
	  } else {
	    return attributes;
	  }
	});
    });
};

Projects.putSlackSetting = (setting, webhook) => {
  return api.getProjects()
    .then((projects) => {
      return Projects.getNamespace(projects);
    })
    .then((projects) => {
      return projects.map((project) => {
	return project.id;
      });
    })
    .then((ids) => {
      return ids.map((id) => {
	return api.putSlackSetting(id);
      });
    });
};

Projects.run = (cmd) => {
  return api.getProjects()
    .then((projects) => {
      return Projects.getNamespace(projects);
    })
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

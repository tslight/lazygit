const fs        = require('fs');
const api       = require('./api');
const git       = require('../git');
const http      = require('../args').http;
const namespace = require('../args').namespace;
const Runners   = require('./runners');
const Projects  = {};

Projects.getNamespace = (projects) => {
  // Filter project objects by match to namespace argument - defaults to an
  // empty string, so if no namespace argument - returns all projects.
  return projects.filter((project) => {
    return project.path_with_namespace.startsWith(namespace);
  });
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

Projects.getRunnerTomls = () => {
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
	  return Runners.getToml(tokens);
	})
	.then((runners) => {
	  console.log(runners);
	});
    });
};

Projects.makeRunnerRegisterScript = (file) => {
  fs.writeFile(file, '#!/usr/bin/env bash\n\n', function (err) {
    if (err) throw err;
    console.log(`Created ${file}.`);
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
	      console.log(`Added ${runner} to ${file}`);
	    });
	  });
	});
    });
};

Projects.getAttributes = (getterFunction) => {
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
      Promise.all((attributes))
	.then((attributes) => {
	  return attributes.flat();
	})
	.then((attributes) => {
	  console.log(attributes);
	});
    });
};

Projects.getCiProjects = () => {
  return Projects.getAttributes(api.getProjectTree)
    .then((files) => {
      return files.map((file) => {
	if (file.name == '.gitlab-ci.yml') {
	  console.log(file);
	};
      });
    });
};

Projects.run = () => {
  return api.getProjects()
    .then((projects) => {
      return Projects.getNamespace(projects);
    })
    .then((projects) => {
      return Projects.getUrls(projects);
    })
    .then((urls) => {
      return urls.map((url) => {
	return git.run(url);
      });
    });
};

module.exports = Projects;

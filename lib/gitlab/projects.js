const fs = require('fs');
const api = require('./api');
const clr  = require('../color');
const git = require('../git');
const args = require('../args');
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

Projects.getProjects = (projects) => {
  return args.projects.map((project) => {
    return projects.filter((prj) => {
      return prj.name == project;
    });
  }).flat();
};

Projects.get = () => {
  return api.getProjects()
    .then((projects) => {
      if (args.projects != undefined) {
	return Projects.getProjects(projects);
      } else {
	return Projects.getNamespace(projects);
      }
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
  return Projects.getIds()
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

Projects.getResource = ({
  resource,
  sortKey,
  attribute,
  filterKey,
  filterValue
}) => {
  return Projects.getIds()
    .then((ids) => {
      let resources = ids.map((id) => {
	return api.getProjectResource(id, resource);
      });
      return Promise.all((resources))
	.then((resources) => {
	  return resources.flat();
	})
	.then((resources) => {
	  if (filterKey != undefined && filterValue != undefined) {
	    return resources.filter((attr) => {
	      return (attr[filterKey] == filterValue ? attr : null);
	    });
	  } else {
	    return resources;
	  }
	})
	.then((resources) => {
	  // https://flaviocopes.com/how-to-sort-array-of-objects-by-property-javascript/
	  if (sortKey != undefined) {
	    return resources.sort((a, b) => {
	      return a[sortKey] > b[sortKey] ? 1 : -1;
	    });
	  } else {
	    return resources;
	  }
	})
	.then((resources) => {
	  if (attribute != undefined) {
	    return resources.map((res) => {
	      return res[attribute];
	    });
	  } else {
	    return resources;
	  }
	});
    });}
;

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

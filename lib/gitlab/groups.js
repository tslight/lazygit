const api       = require('./api');
const http      = require('../args').http;
const namespace = require('../args').namespace;
const Projects  = require('./projects');
const Runners   = require('./runners');
const Groups    = {};

Groups.getNamespace = (groups) => {
  // Filter group objects by match to namespace argument - defaults to an
  // empty string, so if no namespace argument - returns all groups.
  return groups.filter((group) => {
    return group.full_path.startsWith(namespace);
  });
};

Groups.getProjectUrls = () => {
  return api.getGroups()
    .then((groups) => {
      return Groups.getNamespace(groups);
    })
    .then((groups) => {
      return groups.map((group) => {
	return group.id;
      });
    })
    .then ((gids) => {
      let projects = gids.map((gid) => {
	return api.getGroupProjects(gid);
      });
      Promise.all(projects)
	.then((projects) => {
	  return projects.flat();
	})
	.then((projects) => {
	  return Projects.getUrls(projects);
	})
	.then((urls) => {
	  console.log(urls);
	});
    });
};

Groups.getRunnerTomls = () => {
  return api.getGroups()
    .then((groups) => {
      return Groups.getNamespace(groups);
    })
    .then((groups) => {
      return groups.map((group) => {
	return group.id;
      });
    })
    .then((gids) => {
      let groups = gids.map((gid) => {
	return api.getGroupIds(gid);
      });
      Promise.all(groups)
	.then((groups) => {
	  return Runners.getTokens(groups);
	})
	.then((tokens) => {
	  return Runners.getToml(tokens);
	})
	.then((runners) => {
	  console.log(runners);
	});
    });
};

Groups.getRunnerCommands = () => {
  return api.getGroups()
    .then((groups) => {
      return Groups.getNamespace(groups);
    })
    .then((groups) => {
      return groups.map((group) => {
	return group.id;
      });
    })
    .then((gids) => {
      let groups = gids.map((gid) => {
	return api.getGroupIds(gid);
      });
      Promise.all(groups)
	.then((groups) => {
	  return Runners.getTokens(groups);
	})
	.then((tokens) => {
	  return Runners.getCommands(tokens);
	})
	.then((runners) => {
	  return runners.map((runner) => {
	    console.log(runner);
	  });
	});
    });
};

Groups.registerRunners = () => {
  return api.getGroups()
    .then((groups) => {
      return Groups.getNamespace(groups);
    })
    .then((groups) => {
      return groups.map((group) => {
	return group.id;
      });
    })
    .then((gids) => {
      let groups = gids.map((gid) => {
	return api.getGroupIds(gid);
      });
      Promise.all(groups)
	.then((groups) => {
	  return groups.map((group) => {
	    return Runners.register(group.name, group.runners_token);
	  });
	});
    });
};

module.exports = Groups;

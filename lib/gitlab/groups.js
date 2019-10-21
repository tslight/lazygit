const api = require('./api');
const args = require('../args');
const Projects = require('./projects');
const Runners = require('./runners');
const util = require('./util');
const Groups = {};

Groups.getNamespace = (groups) => {
  // Filter group objects by match to namespace argument - defaults to an
  // empty string, so if no namespace argument - returns all groups.
  return args.namespaces.map((namespace) => {
    return groups.filter((group) => {
      return group.full_path.startsWith(namespace);
    });
  }).flat();
};

Groups.get = (out = {}) => {
  return api.getGroups()
    .then((groups) => {
      if (args.groups != undefined) {
	return util.narrow(args.groups, groups);
      } else {
	return Groups.getNamespace(groups);
      }
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
      return Promise.all(groups)
	.then((groups) => {
	  return groups.flat();
	})
	.then((groups) => {
	  return util.filter(groups, out);
	});
    });
};

Groups.getProjectUrls = () => {
  return Groups.get({attributes: ['projects']})
    .then((projects) => {
      return Projects.getUrls(projects.flat());
    });
};

Groups.makeRunnerRegisterScript = (file) => {
  util.makeBashScript(file);
  return Groups.get()
    .then((groups) => {
      return Runners.getTokens(groups);
    })
    .then((tokens) => {
      return Runners.getCommands(tokens);
    })
    .then((runners) => {
      return runners.map((runner) => {
	console.log(runner);
	return util.addRunnerToScript(file, runner);
      });
    });
};

Groups.registerRunners = () => {
  return Groups.get()
    .then((groups) => {
      return groups.map((group) => {
	return Runners.register(group.name, group.runners_token);
      });
    });
};

module.exports = Groups;

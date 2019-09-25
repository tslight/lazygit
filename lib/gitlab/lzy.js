const groups = require('../args').groups;
const git = require('../git');
const grp = require('./grp');
const prj = require('./prj');
const lzy = {};

lzy.runGit = (urls) => {
  // Send urls to be processed by git.
  return urls.map((url) => {
    return git.run(url);
  });
};

lzy.Groups = () => {
  return grp.get()
    .then((groups) => {
      return grp.getNamespace(groups);
    })
    .then ((groups) => {
      return grp.getIds(groups);
    })
    .then ((gids) => {
      let projects = gids.map((gid) => {
	return grp.getProjects(gid);
      });
      Promise.all(projects)
	.then((projects) => {
	  return projects.flat();
	})
	.then((projects) => {
	  return grp.getProjectUrls(projects);
	})
	.then((urls) => {
	  console.log(urls);
	});
    });
};

lzy.Projects = () => {
  return prj.get()
    .then((projects) => {
      return prj.getNamespace(projects);
    })
    .then((projects) => {
      return prj.getUrls(projects);
    })
    .then((urls) => {
      return lzy.runGit(urls);
    });
};

lzy.lazy = () => {
  (groups ? lzy.Groups() : lzy.Projects());
};

module.exports = lzy;

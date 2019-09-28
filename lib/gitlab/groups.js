const api       = require('./api');
const http      = require('../args').http;
const namespace = require('../args').namespace;
const Projects  = require('./projects');
const Groups    = {};

Groups.get = () => {
  let slug = `/api/v4/groups`;
  let attr = `\?per_page\=999`;

  return api.get(slug + attr)
    .then((groups) => {
      return groups.data;
    });
};

Groups.getNamespace = (groups) => {
  // Filter group objects by match to namespace argument - defaults to an
  // empty string, so if no namespace argument - returns all groups.
  return groups.filter((group) => {
    return group.full_path.startsWith(namespace);
  });
};

Groups.getTokens = () => {
  return Groups.get()
    .then((groups) => {
      return Groups.getNamespace(groups);
    })
    .then((groups) => {
      console.log(groups);
    });
};

Groups.getProjects = (gid) => {
  let slug = `/api/v4/groups/${gid}/projects`;
  let attr = `\?per_page\=999`;

  return api.get(slug + attr)
    .then((projects) => {
      return projects.data;
    });
};

Groups.getProjectUrls = () => {
  return Groups.get()
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
	return Groups.getProjects(gid);
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

module.exports = Groups;

const api = require('./api');
const http = require('../args').http;
const namespace = require('../args').namespace;
const grp = {};

grp.getProjects = (gid) => {
  let slug = `/api/v4/groups/${gid}/projects`;
  let attr = `\?per_page\=999`;

  return api.get(slug + attr)
    .then((projects) => {
      return projects.data;
    });
};

grp.getProjectUrls = (projects) => {
  return projects.map((project) => {
    if (http) {
      return project.http_url_to_repo;
    } else {
      return project.ssh_url_to_repo;
    }
  });
};

grp.getIds = (groups) => {
  return groups.map((group) => {
    return group.id;
  });
};

grp.getNamespace = (groups) => {
  // Filter group objects by match to namespace argument - defaults to an
  // empty string, so if no namespace argument - returns all groups.
  return groups.filter((group) => {
    return group.full_path.startsWith(namespace);
  });
};

grp.get = () => {
  let slug = `/api/v4/groups\?per_page\=999`;
  return api.get(slug)
    .then((groups) => {
      return groups.data;
    });
};

module.exports = grp;

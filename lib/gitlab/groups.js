const api = require('./api');
const http = require('../args').http;
const namespace = require('../args').namespace;
const Groups = {};

Groups.getProjects = (gid) => {
  let slug = `/api/v4/groups/${gid}/projects`;
  let attr = `\?per_page\=999`;

  return api.get(slug + attr)
    .then((projects) => {
      return projects.data;
    });
};

Groups.getProjectUrls = (projects) => {
  return projects.map((project) => {
    if (http) {
      return project.http_url_to_repo;
    } else {
      return project.ssh_url_to_repo;
    }
  });
};

Groups.getNamespace = (groups) => {
  // Filter group objects by match to namespace argument - defaults to an
  // empty string, so if no namespace argument - returns all groups.
  return groups.filter((group) => {
    return group.full_path.startsWith(namespace);
  });
};

Groups.get = () => {
  let slug = `/api/v4/groups`;
  let attr = `\?per_page\=999`;

  return api.get(slug + attr)
    .then((groups) => {
      return groups.data;
    });
};

module.exports = Groups;

const api = require('./api');
const http = require('../args').http;
const namespace = require('../args').namespace;
const groups = {};

groups.getUrls = (id) => {
  let slug = `/api/v4/groups/${id}/projects\?per_page\=999`;
  return api.get(slug)
    .then((repos) => {
      return repos.data.map((r) => {
	return r.ssh_url_to_repo;
      });
    });
};

groups.getNamespace = (groups) => {
  // Filter group objects by match to namespace argument - defaults to an
  // empty string, so if no namespace argument - returns all groups.
  return groups.filter((group) => {
    return group.full_path.startsWith(namespace);
  });
};

groups.get = () => {
  let slug = `/api/v4/groups\?per_page\=999`;
  return api.get(slug)
    .then((groups) => {
      return groups.data;
    });
};

module.exports = groups;

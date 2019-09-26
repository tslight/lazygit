const api = require('./api');
const http = require('../args').http;
const namespace = require('../args').namespace;
const Projects = {};

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

Projects.getNamespace = (projects) => {
  // Filter project objects by match to namespace argument - defaults to an
  // empty string, so if no namespace argument - returns all projects.
  return projects.filter((project) => {
    return project.path_with_namespace.startsWith(namespace);
  });
};

Projects.get = () => {
  // https://docs.gitlab.com/ee/api/projects.html#list-all-projects
  // Return all projects that the authenticated user is a member or owner of.
  let slug = `/api/v4/projects`;
  let attr = `\?per_page\=999\&owned\=true\&membership\=true\&simple\=true`;

  return api.get(slug + attr)
    .then((projects) => {
      return projects.data;
    });
};

module.exports = Projects;

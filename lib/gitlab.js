const axios = require('axios');
const args = require('./args');
const git = require('./git');
const token = args.chkToken();
const namespace = args.namespace;
const host = 'https://www.gitlab.com';
const gitlab = {
  api: axios.create({
    baseURL: host,
    headers: {'PRIVATE-TOKEN': token}
  })
};

gitlab.getProjects = () => {
  // https://docs.gitlab.com/ee/api/projects.html#list-all-projects
  let slug = `/api/v4/projects`;
  let attr = `\?per_page\=999\&owned\=true\&membership\=true\&simple\=true`;

  return gitlab.api.get(slug + attr)
    .then((projects) => {
      return(projects);
    });
};

gitlab.lazy = () => {
  return gitlab.getProjects()
    .then((projects) => {
      return projects.data.filter((project) => {
	return project.path_with_namespace.startsWith(namespace);
      });
    })
    .then((data) => {
      return data.map((project) => {
	return project.ssh_url_to_repo;
      });
    })
    .then((urls) => {
      return urls.map((url) => {
	return git.run(url);
      });
    });
};

module.exports = gitlab;

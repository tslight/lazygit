const axios  = require('axios');
const args   = require('./args');
const git    = require('./git');
const token  = args.chkToken();
const host   = 'https://www.gitlab.com';
const gitlab = {
  api: axios.create({
    baseURL: host,
    headers: {'PRIVATE-TOKEN': token}
  })
};

gitlab.getProjects = () => {
  let attr = {
    per_page: `\?per_page\=999`,
    owned: `\&owned\=true`,
    member: `\&membership\=true`,
    simple: `\&simple\=true`
  };
  let slug = `/api/v4/projects`;
  let query = `${attr.per_page}${attr.owned}${attr.member}${attr.simple}`;

  return gitlab.api.get(slug + query)
    .then((projects) => {
      return(projects);
    });
};

gitlab.lazy = () => {
  return gitlab.getProjects()
    .then((projects) => {
      return projects.data.filter((project) => {
	return project.path_with_namespace.startsWith(args.namespace);
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

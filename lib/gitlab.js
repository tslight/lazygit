const axios  = require('axios');
const args   = require('./args');
const token  = args.chkToken();
const host   = 'https://www.gitlab.com';
const gitlab = {
  api: axios.create({
    baseURL: host,
    headers: {'PRIVATE-TOKEN': token}
  })
};

gitlab.getUrls = (id) => {
  let slug = `/api/v4/groups/${id}/projects\?per_page\=999`;
  return gitlab.api.get(slug)
    .then((repos) => {
      return repos.data.map((r) => {
	return r.ssh_url_to_repo;
      });
    });
};

gitlab.getGroups = () => {
  let slug = `/api/v4/groups\?per_page\=999`;
  return gitlab.api.get(slug)
    .then((groups) => {
      return groups.data.filter((group) => {
	return group.full_path.startsWith(args.group);
      });
    })
    .then((data) => {
      return data.map((group) => {
	return group.id;
      });
    });
};

module.exports = gitlab;

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

gitlab.lazyGroups = () => {
  return gitlab.getGroups()
    .then((gids) => {
      // https://stackoverflow.com/a/39452119 - Using a function that returns
      // promises within a map returns an array of promises. Duh...
      let groupUrls = gids.map((id) => {
	return gitlab.getUrls(id);
      });
      // ...So we have to resolve all these promises before proceeding.
      Promise.all(groupUrls) // Returns array of arrays...
	.then((groupUrls) => {
	  return groupUrls.flat(); // ...Which we need to flatten.
	})
	.then((allUrls) => {
	  return allUrls.map((url) => {
	    return git.run(url);
	  });
	});
    });
};

module.exports = gitlab;

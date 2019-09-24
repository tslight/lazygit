#!/usr/bin/env node
const axios     = require('axios');
const fs        = require('fs');
const git       = require('./lib/git');
const args      = require('./lib/args');
const token     = args.chkToken();
const dest      = args.chkDest();
const host      = 'https://www.gitlab.com';
const gitlabApi = axios.create({
  baseURL: host,
  headers: {'PRIVATE-TOKEN': token}
});

runGit = (url) => {
  let path = dest + '/' + url.substring(url.indexOf(':') + 1);
  path = path.replace('.git', '').replace('//', '/');
  if (args.status) {
    git.status(path);
    return;
  }
  (fs.existsSync(path) ? git.pull(path) : git.clone(url, path));
};

getUrls = (id) => {
  let slug = `/api/v4/groups/${id}/projects\?per_page\=999`;
  return gitlabApi.get(slug)
    .then((repos) => {
      return repos.data.map((r) => {
	return r.ssh_url_to_repo;
      });
    });
};

getGroups = () => {
  let slug = `/api/v4/groups\?per_page\=999`;
  return gitlabApi.get(slug)
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

lazygit = () => {
  return getGroups()
    .then((gids) => {
      return gids.map((id) => {
	return getUrls(id)
	  .then((urls) => {
	    return urls.map((url) => {
	      return runGit(url);
	    });
	  });
      });
    });
};

return lazygit();

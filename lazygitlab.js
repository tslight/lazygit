#!/usr/bin/env node
const axios     = require('axios');
const fs        = require('fs');
const git       = require('./modules/git');
const args      = require('./modules/args');
const token     = args.chkToken();
const dest      = args.chkDest();
const host      = 'https://www.gitlab.com';
const gitlabApi = axios.create({
  baseURL: "https://www.gitlab.com",
  headers: {'PRIVATE-TOKEN': "jvBukuh6y8xTd6MyLwFz"}
});

runGit = (url) => {
  let path = dest + '/' + url.substring(url.indexOf(':') + 1);
  path = path.replace('.git', '').replace('//', '/');
  (fs.existsSync(path) ? git.pull(path) : git.clone(url, path, args.verbose));
};

getUrls = (id) => {
  return gitlabApi.get(`/api/v4/groups/${id}/projects\?per_page\=999`)
    .then((repos) => {
      return repos.data.map((r) => {
	return r.ssh_url_to_repo;
      });
    });
};

getGroups = (name) => {
  if (name) {
    return gitlabApi.get('/api/v4/groups\?per_page\=999')
      .then((groups) => {
	return groups.data.filter((g) => {
	  return g.full_path.startsWith(name);
	});
      })
      .then((groups) => {
	return groups.map((group) => {
	  return group.id;
	});
      });
  } else {
    return gitlabApi.get('/api/v4/groups\?per_page\=999')
      .then((groups) => {
	return groups.data.map((group) => {
	  return group.id;
	});
      });
  }
};

lazygit = (group_name) => {
  return getGroups(group_name)
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

return lazygit(args.group);

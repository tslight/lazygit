#!/usr/bin/env node
const fs     = require('fs');
const git    = require('./lib/git');
const gitlab = require('./lib/gitlab');
const args   = require('./lib/args');
const dest   = args.chkDest();
const host   = 'https://www.gitlab.com';

runGit = (url) => {
  let path = dest + '/' + url.substring(url.indexOf(':') + 1);
  path = path.replace('.git', '').replace('//', '/');
  if (args.status) {
    git.status(path);
    return;
  }
  if (args.fetch) {
    (fs.existsSync(path) ? git.fetch(path) : git.clone(url, path));
  } else {
    (fs.existsSync(path) ? git.pull(path) : git.clone(url, path));
  }
};

// lazygit = () => {
//   return gitlab.getGroups()
//     .then((gids) => {
//       return gids.map((id) => {
//	return gitlab.getUrls(id);
//       });
//     })
//     .then((urls) => {
//       return urls.map((url) => {
//	return runGit(url);
//       });
//     });
// };

lazygit = () => {
  return gitlab.getGroups()
    .then((gids) => {
      return gids.map((id) => {
	return gitlab.getUrls(id)
	  .then((urls) => {
	    return urls.map((url) => {
	      return runGit(url);
	    });
	  });
      });
    });
};

return lazygit();

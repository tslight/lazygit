#!/usr/bin/env node
const git    = require('./lib/git');
const gitlab = require('./lib/gitlab');

// return gitlab.getGroups()
//   .then((gids) => {
//     return gids.map((id) => {
//       return gitlab.getUrls(id);
//     });
//   })
//   .then((urls) => {
//     return urls.map((url) => {
//       return runGit(url);
//     });
//   });

return gitlab.getGroups()
  .then((gids) => {
    return gids.map((id) => {
      return gitlab.getUrls(id)
	.then((urls) => {
	  return urls.map((url) => {
	    return git.run(url);
	  });
	});
    });
  })

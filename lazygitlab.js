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

// return gitlab.getGroups()
//   .then((gids) => {
//     return gids.map((id) => {
//       return gitlab.getUrls(id)
//	.then((urls) => {
//	  return urls.map((url) => {
//	    return git.run(url);
//	  });
//	});
//     });
//   })

return gitlab.getGroups()
  .then((gids) => {
    let urlArrays = gids.map((id) => {
      return gitlab.getUrls(id)
    })
    Promise.all(urlArrays)
      .then((urlArrays) => {
	let urls = []
	urlArrays.map((urlArray) => {
	  urlArray.map((url) => {
	    urls.push(url);
	  })
	});
	return urls
      })
      .then((urls) => {
	return urls.map((url) => {
	  return git.run(url);
	})
      })
  });

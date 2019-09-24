#!/usr/bin/env node
const git    = require('./lib/git');
const gitlab = require('./lib/gitlab');

return gitlab.getGroups()
  .then((gids) => {
    let groupUrls = gids.map((id) => {
      return gitlab.getUrls(id);
    });
    Promise.all(groupUrls)
      .then((groupUrls) => {
	return groupUrls.flat();
      })
      .then((allUrls) => {
	return allUrls.map((url) => {
	  return git.run(url);
	});
      });
  });

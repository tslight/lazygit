#!/usr/bin/env node
const git    = require('./lib/git');
const gitlab = require('./lib/gitlab');

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

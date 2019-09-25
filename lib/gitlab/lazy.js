const groups = require('../args').groups;
const git = require('../git');
const grp = require('./groups');
const prj = require('./projects');
const lazy = {};

lazy.runGit = (urls) => {
  // Send urls to be processed by git.
  return urls.map((url) => {
    return git.run(url);
  });
};

lazy.Groups = () => {
  return grp.get()
    .then((groups) => {
      return grp.getNamespace(groups);
    })
    .then ((groups) => {
      console.log(groups.full_path);
      return;
    });
};

lazy.Projects = () => {
  return prj.get()
    .then((projects) => {
      return prj.getNamespace(projects);
    })
    .then((projects) => {
      return prj.getUrls(projects);
    })
    .then((urls) => {
      return lazy.runGit(urls);
    });
};

lazy.lazy = () => {
  (groups ? lazy.Groups() : lazy.Projects());
};

module.exports = lazy;

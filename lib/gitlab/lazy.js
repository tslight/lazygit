const resource = require('../args').resource;
const Groups   = require('./groups');
const Projects = require('./projects');
const Runners  = require('./runners');
const lazy     = {};

lazy.init = () => {
  switch(resource) {
  case 'groups':
    Groups.get();
    break;
  case 'projects':
    Projects.run();
    break;
  case 'runners':
    Runners.showOwned();
    break;
  case 'group-tokens':
    Groups.getTokens();
    break;
  case 'project-hooks':
    Projects.getAllHooks();
    break;
  case 'project-tokens':
    Projects.getTokens();
    break;
  default:
    Projects.run();
  }
};

module.exports = lazy;

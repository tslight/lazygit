const resource = require('../args').resource;
const Groups   = require('./groups');
const Projects = require('./projects');
const Runners  = require('./runners');
const lazy     = {};

lazy.init = () => {
  switch(resource) {
  case 'groups':
    Groups.getTokens();
    break;
  case 'projects':
    Projects.run();
    break;
  case 'runners':
    Runners.showOwned();
    break;
  case 'tokens':
    Projects.getTokens();
    break;
  default:
    Projects.run();
  }
};

module.exports = lazy;

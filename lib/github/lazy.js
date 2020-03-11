const args = require('./args');
const git = require('./git');
const Resources = require('./resources.js');
const axios = require('axios');
const token = args.chkToken();
const api = axios.create({
  baseURL: 'https://api.github.com',
  headers: {'Authorization': `token ${token}`}
});
const outputFilters = {
  attributes: args.attributes,
  filterKey: args.filter_key,
  filterValue: args.filter_value,
  sortKey: args.order,
};
const lazy = {};

lazy.getResource = (resource, out=outputFilters) => {
  return api.get(resource)
    .then((response) => {
      return Resources.out(response.data, out);
    })
    .catch((err) => {
      console.error(err.message);
      process.exit(1);
    });
};

lazy.getRepoUrls = () => {
  let protocol = args.http ? ['clone_url'] : ['ssh_url'];
  return lazy.getResource('/user/repos', {attributes: protocol})
    .then((response) => {
      return response;
    });
};

lazy.init = () => {
  if (args.show != undefined) {
    return lazy.getResource(args.show)
      .then((response) => {
	console.log(JSON.stringify(response, null, 2));
	// console.log(JSON.stringify(response, null, 2));
      });
  } else {
    return lazy.getRepoUrls()
      .then((urls) => {
	return urls.map((url) => {
	  git.run(url, args.run);
	});
      });
  }
};

module.exports = lazy;

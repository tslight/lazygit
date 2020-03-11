const args = require('./args');
const axios = require('axios');
const token = args.chkToken();
const api = axios.create({
  baseURL: 'https://api.github.com',
  headers: {'Authorization': `token ${token}`}
});
const scratch = {};

scratch.get_repos = () => {
  return api.get('/user/repos')
    .then((response) => {
      return response.data.map((repo) => {
	 return {
	  "url": repo.ssh_url,
	  "path": repo.full_name
	 };
      });
    })
    .catch((err) => {
      console.error(JSON.stringify(err, null, 2));
    });
};

scratch.init = () => {
  return scratch.get_repos()
    .then((response) => {
      console.log(response);
    });
};

module.exports = scratch;

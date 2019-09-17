axios = require('axios');
// gitlab = axios.create({
//   baseURL: "https://www.gitlab.com",
//   headers: {
//     'PRIVATE-TOKEN': "jvBukuh6y8xTd6MyLwFz"
//   }
// });
// console.log(gitlab);
// groups = gitlab.get('/api/v4/groups\?per_page\=999');
// console.log(groups);

gl = axios.create({
  baseURL: "https://www.gitlab.com",
  json: true,
  qs: {simple: true},
  headers: {'PRIVATE-TOKEN': "jvBukuh6y8xTd6MyLwFz"}
});

let gids = [];
let projects = [];

getUrls = () => {
  return gids.map((id) => {
    return gl.get(`/api/v4/groups/${id}/projects\?per_page\=999`)
      .then((repos) => {
	// console.log(repos);
	return repos.data.map((r) => {
	  return projects.push(r.ssh_url_to_repo);
	});
      })
      .catch((err) => {
	throw err;
      });
  });
};

getGroups = () => {
  return gl.get('/api/v4/groups\?per_page\=999')
    .then((groups) => {
      return groups.data.map((g) => {
	return gids.push(g.id);
      });
    });
};

return getGroups()
  .then((groups) => {
    return getUrls(groups);
  })
  .then((urls) => {
    console.log(urls);
  });

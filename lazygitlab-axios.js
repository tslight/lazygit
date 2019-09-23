axios = require('axios');

gl = axios.create({
  baseURL: "https://www.gitlab.com",
  headers: {'PRIVATE-TOKEN': "jvBukuh6y8xTd6MyLwFz"}
});

getUrls = (id) => {
  return gl.get(`/api/v4/groups/${id}/projects\?per_page\=999`)
    .then((repos) => {
      return repos.data.map((r) => {
	return r.ssh_url_to_repo;
      });
    });
};

getGroups = () => {
  return gl.get('/api/v4/groups\?per_page\=999')
    .then((groups) => {
      return groups.data.map((g) => {
	return g.id;
      });
    });
};

return getGroups()
  .then((gids) => {
    // console.log(gids);
    return gids.map((id) => {
      return getUrls(id)
	.then((urls) => {
	  // console.log(urls);
	});
    });
  });

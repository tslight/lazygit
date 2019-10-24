const axios = require('axios');
const Resources = require('./resources');
const api = {};

api.init = (token) => {
  return axios.create({
    baseURL: 'https://www.gitlab.com',
    headers: {'PRIVATE-TOKEN': token}
  });
};

api._get = (axios, slug, attr = '', page = 1, pages = []) => {
  console.log(api.axios);
  return axios.get(slug + `?per_page=100&page=${page}` + attr)
    .then((response) => {
      let retrivedPages = pages.concat(response.data);
      if (response.headers['x-total'] > retrivedPages.length) {
	page++;
	return api._get(slug, attr, page, retrivedPages);
      }
      return retrivedPages;
    });
};

api.getResources = (argv, endpoint, out = {}) => {
  return api._get(argv.token, `/api/v4/${endpoint}`, `&owned=true&membership=true`)
    .then((resources) => {
      if (argv.groups != undefined) {
	return Resources.getNames(argv.groups, resources);
      } else if (argv.projects != undefined) {
	return Resources.getNames(argv.projects, resources);
      } else {
	return Resources.getNamespaces(argv.namespaces, resources);
      }
    })
    .then((resources) => {
      return resources.map((resource) => {
	return resource.id;
      });
    })
    .then((ids) => {
      let resources = ids.map((id) => {
	return api._get(`/api/v4/${endpoint}/${id}`);
      });
      return Promise.all(resources)
	.then((resources) => {
	  return resources.flat();
	})
	.then((resources) => {
	  return Resources.out(resources, out);
	});
    });
};

api.getIds = (endpoint) => {
  return api.getResources(endpoint)
    .then((resources) => {
      return resources.map((resource) => {
	return resource.id;
      });
    });
};

api.getSubResources = (resource, endpoint, out) => {
  return api.getIds(resource)
    .then((ids) => {
      let resources = ids.map((id) => {
	return api._get(`/api/v4/${resource}/${id}/${endpoint}`);
      });
      return Promise.all((resources))
	.then((resources) => {
	  return Resources.out(resources, out);
	});
    });
};

module.exports = api;

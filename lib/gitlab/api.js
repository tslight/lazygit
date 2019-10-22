const axios = require('axios');
const token = require('../args').chkToken();
const util = require('./util');
const args = require('../args');
const api = axios.create({
  baseURL: 'https://www.gitlab.com',
  headers: {'PRIVATE-TOKEN': token}
});

api._get = (slug, attr = '', page = 1, pages = []) => {
  return api.get(slug + `?per_page=100&page=${page}` + attr)
    .then((response) => {
      let retrivedPages = pages.concat(response.data);
      if (response.headers['x-total'] > retrivedPages.length) {
	page++;
	return api._get(slug, attr, page, retrivedPages);
      }
      return retrivedPages;
    });
};

api.getResources = (endpoint, out = {}) => {
  return api._get(`/api/v4/${endpoint}`,
		  `&owned=true&membership=true`)
    .then((resources) => {
      if (args.groups != undefined) {
	return util.narrow(args.groups, resources);
      } else if (args.projects != undefined) {
	return util.narrow(args.projects, resources);
      } else {
	return util.getNamespace(resources);
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
	  return util.filter(resources, out);
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
	  return util.filter(resources, out);
	});
    });
};

module.exports = api;

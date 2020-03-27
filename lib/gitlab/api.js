const axios = require('axios');
const args = require('./args');
const Resources = require('./resources');
const token = args.chkToken();
const api = axios.create({
  baseURL: 'https://www.gitlab.com',
  headers: {'PRIVATE-TOKEN': token}
});

api._getoffset = (slug, attr = '', page = 1, pages = []) => {
  return api.get(slug + `?per_page=100&page=${page}` + attr)
    .then((response) => {
      // console.log(response);
      let retrivedPages = pages.concat(response.data);
      if (response.headers['x-total'] > retrivedPages.length) {
	page++;
	return api._get(slug, attr, page, retrivedPages);
      }
      return retrivedPages;
    })
    .catch((err) => {
      console.error(`${err.code} error when calling ${err.syscall}.\n`+
		    `Are you connected to the network? Aborting.`);
      if (err.isAxiosError) {
	process.exit(1);
      }
      // console.log(JSON.stringify(err, null, 2));
    });
};

api._get = (slug, attr = '', sortKey = 'id', results = []) => {
  return api.get(slug + `?pagination=keyset&per_page=100&order_by=${sortKey}&sort=asc` + attr)
    .then((response) => {
      // console.log(response);
      let retrivedPages = results.concat(response.data);
      if (response.headers['Link'] != undefined) {
	slug = response.headers['Link'].replace("https://www.gitlab.com", '');
	return api.get(slug);
      }
      return retrivedPages;
    })
    .catch((err) => {
      console.log(JSON.stringify(err, null, 2));
      console.error(`${err.code} error when calling ${err.syscall} using key based pagination.\n`+
		    `Trying offset based instead...`);
      return api._getoffset(slug, attr);
    });
};

api.getResources = (endpoint, out = {}) => {
  return api._get(`/api/v4/${endpoint}`,
		  `&owned=true&membership=true`)
    .then((resources) => {
      if (args.groups != undefined) {
	return Resources.getNames(args.groups, resources);
      } else if (args.projects != undefined) {
	return Resources.getNames(args.projects, resources);
      } else {
	return Resources.getNamespaces(args.namespaces, resources);
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
	// console.log(`/api/v4/${resource}/${id}/${endpoint}`);
	return api._get(`/api/v4/${resource}/${id}/${endpoint}`);
      });
      return Promise.all((resources))
	.then((resources) => {
	  return Resources.out(resources, out);
	});
    });
};

module.exports = api;

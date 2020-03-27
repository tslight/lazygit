const axios = require('axios');
const args = require('./args');
const Resources = require('./resources');
const token = args.chkToken();
const api = axios.create({
  baseURL: 'https://www.gitlab.com/api/v4',
  headers: {'PRIVATE-TOKEN': token}
});

// api._get = (slug, attr='', limit=0, page=1, pages=[]) => {
//   return api._getoffset(slug, attr, limit, page, pages);
// };

api._get = (slug, attr='', limit=0, page=1, pages=[]) => {
  let per_page = 100;
  let page_limit = 0;

  switch(true) {
  case(limit > 0 && limit < 100):
    per_page = limit;
    page_limit = 1;
    break;
  case(limit >= 100):
    page_limit = limit / 100 + 1;
    break;
  }

  // console.log(`Limit: ${limit}, PP: ${per_page}, PL: ${page_limit}, Page: ${page}, Pages: ${pages.length}`)

  return api.get(slug + `?per_page=${per_page}&page=${page}` + attr)
    .then((response) => {
      let retrivedPages = pages.concat(response.data);
      // console.log(retrivedPages.length)
      if ((response.headers['x-total'] > retrivedPages.length) &&
	  (page_limit > retrivedPages.length)) {
	page++;
	return api._get(slug, attr, limit, page, retrivedPages);
      }
      return retrivedPages;
    })
    .catch((err) => {
      console.log(JSON.stringify(err, null, 2));
      console.error(`${err.code} error when calling ${err.syscall}.\n`+
		    `Are you connected to the network? Aborting.`);
      if (err.isAxiosError) {
	process.exit(1);
      }
    });
};

api._getkey = (slug, attr = '', limit = 0, sortKey = 'id', pages = []) => {
  let per_page = 100;
  let page_limit = 0;

  switch(true) {
  case(limit > 0 && limit < 100):
    per_page = limit;
    page_limit = 1;
    break;
  case(limit >= 100):
    page_limit = limit / 100 + 1;
    break;
  }

  if (attr == '') {
    attr =
      `?pagination=keyset`+
      `&per_page=${per_page}`+
      `&order_by=${sortKey}`+
      `&sort=desc`+
      `&owned=true&membership=true`;
  }

  return api.get(slug + attr)
    .then((response) => {
      // console.log(response)
      let retrivedPages = pages.concat(response.data);
      if (response.headers != undefined && response.headers.links != undefined) {
	slug = response.headers.links.replace(/^<.*v4|\?.*$/g, '');
	attr = response.headers.links.replace(/^<.*\?|>; rel.*$/g, '');
	return api._getkey(slug, '?' + attr, limit, sortKey, retrivedPages);
      }
      return retrivedPages;
    })
    .catch((err) => {
      console.log(JSON.stringify(err, null, 2));
      console.error(`${err.message}. Trying offset based instead...`);
      return api._getkeyoffset(slug, attr, limit);
    });
};

api.getResources = (endpoint, limit, out = {}) => {
  return api._get(`/${endpoint}`, ``, limit, out.sortKey)
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
	return api._get(`/${endpoint}/${id}`);
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

api.getSubResources = (resource, endpoint, limit, out) => {
  return api.getIds(resource)
    .then((ids) => {
      let resources = ids.map((id) => {
	return api._get(`/${resource}/${id}/${endpoint}`, '', limit, out.sortKey);
      });
      return Promise.all((resources))
	.then((resources) => {
	  return Resources.out(resources, out);
	});
    });
};

module.exports = api;

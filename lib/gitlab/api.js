const axios = require('axios');
const args = require('./args');
const Resources = require('./resources');
const token = args.chkToken();
const api = axios.create({
  baseURL: 'https://www.gitlab.com/api/v4',
  headers: {'PRIVATE-TOKEN': token}
});

api._get = (slug, attr='', limit=0, page=1, items=[]) => {
  let per_page = 100;
  let page_limit = 0;
  let last_page_items = per_page;

  switch(true) {
  case(limit > 0 && limit < 100):
    per_page = limit;
    page_limit = 1;
    break;
  case(limit >= 100):
    page_limit = Math.floor(limit/100);
    last_page_items = limit % 100;
    if (last_page_items > 0) page_limit++;
    if (page == page_limit) per_page = last_page_items;
    break;
  }

  console.log(`Slug: ${slug}\n`+
	      `Attr: ${attr}\n`+
	      `Limit: ${limit}\n`+
	      `Per Page: ${per_page}\n`+
	      `Page Limit: ${page_limit}\n`+
	      `Page: ${page}\n`+
	      `Items: ${items.length}`);

  return api.get(slug + `?per_page=${per_page}&page=${page}` + attr)
    .then((response) => {
      let retrivedItems = items.concat(response.data);
      console.log(response.headers['x-total']);
      console.log(response.headers.link['x-total']);
      if ((retrivedItems.length >= response.headers['x-total']) || (page >= page_limit)) {
	return retrivedItems;
      }
      page++;
      return api._get(slug, attr, limit, page, retrivedItems);
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

api.getResources = (endpoint, out = {}) => {
  return api._get(`/${endpoint}`, `&owned=true&membership=true`, out.limit)
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
	return api._get(`/${endpoint}/${id}`, ``, out.limit);
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
	return api._get(`/${resource}/${id}/${endpoint}`, '', out.limit);
      });
      return Promise.all((resources))
	.then((resources) => {
	  return Resources.out(resources, out);
	});
    });
};

module.exports = api;

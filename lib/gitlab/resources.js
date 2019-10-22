const args = require('../args');
const Resources  = {};

Resources.getNamespaces = (resource) => {
  // Filter group objects by match to namespace argument - defaults to an
  // empty string, so if no namespace argument - returns all groups & projects.
  return args.namespaces.map((namespace) => {
    return resource.filter((resource) => {
      if (resource.path_with_namespace != undefined) {
	return resource.path_with_namespace.startsWith(namespace);
      } else if (resource.full_path != undefined) {
	return resource.full_path.startsWith(namespace);
      } else {
	return resource;
      }
    });
  }).flat();
};

Resources.getNames = (chosenResources, allResources) => {
  return chosenResources.map((chosenResource) => {
    return allResources.filter((resource) => {
      return resource.name == chosenResource;
    });
  }).flat();
};

Resources.filter = (resources, key, value) => {
  if (key != undefined && value != undefined) {
    return resources.filter((attr) => {
      return (attr[key] == value ? attr : null);
    });
  } else {
    return resources;
  }
};

Resources.sort = (resources, key) => {
  // https://flaviocopes.com/how-to-sort-array-of-objects-by-property-javascript/
  if (key != undefined) {
    return resources.sort((a, b) => {
      return a[key] > b[key] ? 1 : -1;
    });
  } else {
    return resources;
  }
};

Resources.trim = (resources, attributes) => {
  if (attributes != undefined) {
    if (attributes.length > 1) {
      return resources.map((res) => {
	let newObj = {};
	attributes.map((attr) => {
	  newObj[attr] = res[attr];
	});
	return newObj;
      }).flat();
    } else {
      return resources.map((res) => {
	return attributes.map((attr) => {
	  return res[attr];
	});
      }).flat();
    }
  } else {
    return resources;
  }
};

Resources.out = (resources, out) => {
  return new Promise((resolve, reject) => {
    resolve(resources.flat());
  })
    .then((resources) => {
      return Resources.filter(resources, out.filterKey, out.filterValue);
    })
    .then((resources) => {
      return Resources.sort(resources, out.sortKey);
    })
    .then((resources) => {
      return Resources.trim(resources, out.attributes);
    });
};

module.exports = Resources;

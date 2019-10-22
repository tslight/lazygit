const fs = require('fs');
const clr  = require('../color');
const args = require('../args');
const Runners = require('./runners');
const util  = {};

util.getNestedAttr = (objs, attr) => {
  return objs.map((obj) => {
    return obj[attr];
  });
};

util.getMembersAccessLevel = (members) => {
  let levels = {
    50: 'Owner',
    40: 'Maintainer',
    30: 'Developer',
    20: 'Reporter',
    10: 'Guest',
  };
  return members.map((member) => {
    member['access_level'] = levels[member['access_level']];
    return member;
  });
};

util.getNamespace = (resource) => {
  // Filter group objects by match to namespace argument - defaults to an
  // empty string, so if no namespace argument - returns all groups.
  return args.namespaces.map((namespace) => {
    return resource.filter((resource) => {
      if (resource.path_with_namespace != undefined) {
	return resource.path_with_namespace.startsWith(namespace);
      } else if (resource.full_path != undefined) {
	return resource.full_path.startsWith(namespace);
      } else {
	console.log(`Couldn't find namespace path in:\n ${resource}`);
	return process.exit(1);
      }
    });
  }).flat();
};

util.narrow = (chosenResources, allResources) => {
  return chosenResources.map((chosenResource) => {
    return allResources.filter((resource) => {
      return resource.name == chosenResource;
    });
  }).flat();
};

util.filterResources = (resources, key, value) => {
  if (key != undefined && value != undefined) {
    return resources.filter((attr) => {
      return (attr[key] == value ? attr : null);
    });
  } else {
    return resources;
  }
};

util.sortResources = (resources, key) => {
  // https://flaviocopes.com/how-to-sort-array-of-objects-by-property-javascript/
  if (key != undefined) {
    return resources.sort((a, b) => {
      return a[key] > b[key] ? 1 : -1;
    });
  } else {
    return resources;
  }
};

util.getAttributes = (resources, attributes) => {
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

util.filter = (resources, out) => {
  return new Promise((resolve, reject) => {
    resolve(resources.flat());
  })
    .then((resources) => {
      return util.filterResources(resources, out.filterKey, out.filterValue);
    })
    .then((resources) => {
      return util.sortResources(resources, out.sortKey);
    })
    .then((resources) => {
      return util.getAttributes(resources, out.attributes);
    });
};

module.exports = util;

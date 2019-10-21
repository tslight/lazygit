const util  = {};

util.getNestedAttr = (objs, attr) => {
  return objs.map((obj) => {
    return obj[attr];
  });
};

util.narrow = (lib) => {
  return lib.get()
    .then((obj) => {
      return lib.getNamespace((obj));
    });
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

util.getAttributes = (resources, attribute) => {
  if (attribute != undefined) {
    return resources.map((res) => {
      return res[attribute];
    });
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
      return util.getAttributes(resources, out.attribute);
    });
};

module.exports = util;

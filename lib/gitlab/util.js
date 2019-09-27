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

modules.export = util;

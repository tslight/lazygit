const axios   = require('axios');
const cmd     = require('node-cmd');
const fs      = require('fs');

const nc  = "\x1b[0m";
const br  = "\x1b[1m";
const red = "\x1b[1m\x1b[31m";
const grn = "\x1b[1m\x1b[32m";
const yel = "\x1b[1m\x1b[33m";
const blu = "\x1b[1m\x1b[34m";
const mag = "\x1b[1m\x1b[35m";
const cyn = "\x1b[1m\x1b[36m";
const wht = "\x1b[1m\x1b[37m";

const host = 'https://www.gitlab.com';
const args = require('./modules/args');
const token = args.chkToken(process.argv[2]);
const dest = args.chkDest(process.argv[3]);
const group = args.chkDest(process.argv[4]);

gl = axios.create({
  baseURL: "https://www.gitlab.com",
  headers: {'PRIVATE-TOKEN': "jvBukuh6y8xTd6MyLwFz"}
});

cloneRepo = (url) => {
  let path = dest + '/' + url.substring(url.indexOf(':') + 1);
  path = path.replace('.git', '');
  path = path.replace('//', '/');
  if (fs.existsSync(path)) {
    cmd.run(`git -C ${path} pull`);
    console.log(`${grn}UPDATED${nc} ${path} :-)`);
  } else {
    cmd.run(`git clone ${url} ${path}`);
    console.log(`${yel}CLONED${nc} ${url} to ${path} :-)`);
  }
};

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

nameToGroupID = (name) => {

}

cloneAll = () => {
  return getGroups()
    .then((gids) => {
      // console.log(gids);
      return gids.map((id) => {
	return getUrls(id)
	  .then((urls) => {
	    return urls.map((url) => {
	      return cloneRepo(url);
	    });
	  });
      });
    });
};

if (group == undefined) {
  return cloneAll();
} else {

}

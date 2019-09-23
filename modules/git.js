const cmd   = require('node-cmd');
const git = {};

const nc  = "\x1b[0m";
const br  = "\x1b[1m";
const red = "\x1b[1m\x1b[31m";
const grn = "\x1b[1m\x1b[32m";
const yel = "\x1b[1m\x1b[33m";
const blu = "\x1b[1m\x1b[34m";
const mag = "\x1b[1m\x1b[35m";
const cyn = "\x1b[1m\x1b[36m";
const wht = "\x1b[1m\x1b[37m";

git.pull = (path) => {
  cmd.get(`git -C ${path} pull`, (err, data, stderr) => {
    if(data) {
      if (data.includes('Already up to date')) {
	console.log(`${grn}${path}:${nc} ${data}`.trim());
      } else {
	console.log(`${yel}${path}\n${nc} ${data}`.trim());
      }
    }
    if(stderr) {
      if(stderr.includes('no such ref was fetched')) {
	console.log(`${grn}${path}:${nc} Nothing to see here.`.trim());
      } else {
	console.log(`${red}${path}\n${nc} ${err}`.trim());
      }
    }
  });
};

git.clone = (url, path) => {
  cmd.get(`git clone ${url} ${path}`, (err, data, stderr) => {
    console.log(`${yel}Cloning ${cyn}${url}${yel} to ${mag}${path}...${nc}`);
  });
};

module.exports = git;

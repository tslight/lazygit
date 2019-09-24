const cmd   = require('node-cmd');
const args  = require('./args');
const git   = {};

const nc  = "\x1b[0m";
const br  = "\x1b[1m";
const red = "\x1b[1m\x1b[31m";
const grn = "\x1b[1m\x1b[32m";
const yel = "\x1b[1m\x1b[33m";
const blu = "\x1b[1m\x1b[34m";
const mag = "\x1b[1m\x1b[35m";
const cyn = "\x1b[1m\x1b[36m";
const wht = "\x1b[1m\x1b[37m";

function fetchOut(data, stderr, path) {
  if (stderr.includes('no such ref was fetched')) {
    if (args.verbose) {
      console.log(`${grn}${path}:${mag} Nothing to see here.${nc}`);
      return;
    }
  } else if (stderr) {
    console.log(`${red}${path}:${mag} ERROR${nc}\n${stderr}`);
    return;
  }

  if (data.includes('Already up to date')  || data.endsWith('Fetching origin')) {
    if (args.verbose) {
      console.log(`${grn}${path}:${cyn} Already up to date.${nc}`);
    }
  } else {
    console.log(`${yel}${path}:${mag} UPDATING...${nc}\n${data}`);
  }
}

git.fetch = (path) => {
  cmd.get(`git -C ${path} fetch --all`, (err, data, stderr) => {
    fetchOut(data.trim(), stderr.trim(), path);
  });
};

git.pull = (path) => {
  cmd.get(`git -C ${path} pull`, (err, data, stderr) => {
    fetchOut(data.trim(), stderr.trim(), path);
  });
};

git.clone = (url, path) => {
  cmd.get(`git clone ${url} ${path}`, (err, data, stderr) => {
    console.log(`${yel}Cloning ${cyn}${url}${yel} to ${mag}${path}...${nc}`);
  });
};

git.status = (path) => {
  cmd.get(`git -C ${path} status -s`, (err, data, stderr) => {
    if (data) {
      console.log(
	`${yel}${path}:${mag} MODIFIED${nc}\n${data.trimRight()}${nc}`
      );
    } else {
      if (args.verbose) {
	console.log(`${grn}${path}:${cyn} Nothing to commit.${nc}`);
      }
    }
  });
};

module.exports = git;

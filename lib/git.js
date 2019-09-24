const cmd  = require('node-cmd');
const fs   = require('fs');
const args = require('./args');
const dest = args.chkDest();
const git  = {};

const nc  = "\x1b[0m";
const br  = "\x1b[1m";
const red = "\x1b[1m\x1b[31m";
const grn = "\x1b[1m\x1b[32m";
const yel = "\x1b[1m\x1b[33m";
const blu = "\x1b[1m\x1b[34m";
const mag = "\x1b[1m\x1b[35m";
const cyn = "\x1b[1m\x1b[36m";
const wht = "\x1b[1m\x1b[37m";

function fetchOut(data, stderr, err, path) {
  let p = path.replace(`${dest}/`, '');
  let emptyRepo = err && stderr.includes('no such ref was fetched');
  let upToDate = (
    data.includes('Already up to date') || data.endsWith('Fetching origin')
  );

  if (emptyRepo) {
    if (args.verbose) {
      console.log(`${grn}${p}:${mag} Nothing to see here.${nc}`);
    }
  } else if (upToDate)  {
    if (args.verbose) {
      console.log(`${grn}${p}:${cyn} Already up to date.${nc}`);
    }
  } else if (err) {
    console.log(`${red}${p}:${mag} ERROR...${nc}\n${stderr}`);
  } else {
    console.log(`${yel}${p}:${mag} UPDATING...${nc}\n${data}`);
  }
}

git.clone = (url, path) => {
  cmd.get(`git clone ${url} ${path}`, (err, data, stderr) => {
    console.log(`${yel}Cloning ${cyn}${url}${yel} to ${mag}${path}...${nc}`);
  });
};

git.fetch = (path) => {
  cmd.get(`git -C ${path} fetch --all`, (err, data, stderr) => {
    fetchOut(data.trim(), stderr.trim(), err, path);
  });
};

git.pull = (path) => {
  cmd.get(`git -C ${path} pull`, (err, data, stderr) => {
    fetchOut(data.trim(), stderr.trim(), err, path);
  });
};

git.status = (path) => {
  cmd.get(`git -C ${path} status -s`, (err, data, stderr) => {
    let p = path.replace(`${dest}/`, '');
    if (data) {
      console.log(
	`${yel}${p}:${mag} MODIFIED...${nc}\n${data.trimRight()}${nc}`
      );
    } else {
      if (args.verbose) {
	console.log(`${grn}${p}:${cyn} Nothing to commit.${nc}`);
      }
    }
  });
};

git.run = (url) => {
  let path = dest + '/' + url.substring(url.indexOf(':') + 1);
  path = path.replace('.git', '').replace('//', '/');
  if (args.status) {
    git.status(path);
    return;
  }
  if (args.fetch) {
    (fs.existsSync(path) ? git.fetch(path) : git.clone(url, path));
  } else {
    (fs.existsSync(path) ? git.pull(path) : git.clone(url, path));
  }
};

module.exports = git;

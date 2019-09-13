#!/usr/bin/env node
'use strict';
const cmd     = require('node-cmd');
const fs      = require('fs');
const home    = require('os').homedir();
const lodash  = require('lodash');
const path    = require('path');
const Promise = require('bluebird');
const rp      = require('request-promise');

const nc  = "\x1b[0m"
const br  = "\x1b[1m"
const red = "\x1b[1m\x1b[31m"
const grn = "\x1b[1m\x1b[32m"
const yel = "\x1b[1m\x1b[33m"
const blu = "\x1b[1m\x1b[34m"
const mag = "\x1b[1m\x1b[35m"
const cyn = "\x1b[1m\x1b[36m"
const wht = "\x1b[1m\x1b[37m"

const config = require('./config');
const token  = config.token;

function expandPath(filepath) {
  if (filepath[0] === '~') {
    return path.join(home, filepath.slice(1));
  }
  return filepath;
}

if (process.argv[2] == undefined) {
  if (config.dest == undefined) {
    var dest = `${home}/src`;
  } else {
    var dest = expandPath(config.dest);
  }
} else {
  var dest = (process.argv[2]);
}

const host  = 'https://www.gitlab.com';
const group = process.argv[3];

//https://stackoverflow.com/a/40686853
if (fs.existsSync(dest) == false) {
  fs.mkdirSync(dest, { recursive: true });
}

rp.get('https://www.gitlab.com/api/v4/groups\?per_page\=999', {
  json: true,
  qs: {
    simple: true,
  },
  headers: {
    'PRIVATE-TOKEN': token
  }
}).then(groups => {
  let pgits = [];
  let promises = [];
  if (group == undefined) {
    let gids = lodash.map(groups, 'id');
    for (let gid of gids) {
      promises.push(
	rp.get(`${host}/api/v4/groups/${gid}/projects\?per_page\=999`, {
	  json: true,
	  qs: {
	    simple: true,
	  },
	  headers: {
	    'PRIVATE-TOKEN': token
	  }
	}).then(projects => {
	  let ps = lodash.map(projects, 'ssh_url_to_repo');
	  for (let p of ps) {
	    pgits.push(p);
	  }
	})
      );
    }
  } else {
    promises.push(
      rp.get(`${host}/api/v4/groups/${group}/projects\?per_page\=999`, {
	json: true,
	qs: {
	  simple: true,
	},
	headers: {
	  'PRIVATE-TOKEN': token
	}
      }).then(projects => {
	let ps = lodash.map(projects, 'ssh_url_to_repo');
	for (let p of ps) {
	  pgits.push(p);
	}
      })
    );
  }
  Promise.all(promises).then(() => {
    // console.log(pgits);
    for (let git of pgits) {
      let path = dest + '/' + git.substring(git.indexOf(':') + 1);
      path = path.replace('.git', '');
      path = path.replace('//', '/');
      if (fs.existsSync(path)) {
	cmd.run(`git -C ${path} pull`);
	console.log(`${grn}UPDATED${nc} ${path} :-)`);
      } else {
	cmd.run(`git clone ${git} ${path}`);
	console.log(`${yel}CLONED${nc} ${git} to ${path} :-)`);
      }
    }
  });
});

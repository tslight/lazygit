#!/usr/bin/env node
'use strict';
const Promise = require('bluebird');
const rp = require('request-promise');
const lodash = require('lodash');
const cmd = require('node-cmd');
const fs = require('fs');
const tokenJson = require('./token');
const token = tokenJson.token;
const destination = process.argv[2];
const group = process.argv[3];
const host = 'https://www.gitlab.com';

if (destination == undefined) {
  console.log(`No directory argument... Aborting!\n`);
  process.exit();
} else if (fs.existsSync(destination) == false) {
  console.log(`${destination} does not exist... Aborting!\n`);
  process.exit();
} else {
  console.log(`Cloning or updating repos to ${destination}...`);
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
      let path = destination + '/' + git.substring(git.indexOf(':') + 1);
      path = path.replace('.git', '');
      path = path.replace('//', '/');
      if (fs.existsSync(path)) {
	cmd.run(`git -C ${path} pull`);
	console.log(`UPDATED ${path} :-)`);
      } else {
	cmd.run(`git clone ${git} ${path}`);
	console.log(`CLONED ${git} to ${path} :-)`);
      }
    }
  });
});

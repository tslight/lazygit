const fs = require('fs');
const clr  = require('../color');
const api = require('./api');
const initScript = (file) => {
  if (file != undefined) {
    fs.writeFile(file, '#!/usr/bin/env bash\n\n', function (err) {
      if (err) throw err;
      console.log(`\n${clr.grn}Created ${file}.${clr.off}\n`);
    });
  }
};
const addRunnerToScript = (file, runner) => {
  if (file != undefined) {
    fs.appendFile(file, runner, function (err) {
      if (err) throw err;
    });
  }
};
const Runners = {};

Runners.getTokens = (resources) => {
  // https://stackoverflow.com/a/26265095
  return resources.reduce((map, res) => {
    map[res.name] = res.runners_token;
    return map;
  }, {});
};

Runners.getCommands = (tokens) => {
  let runners = [];
  for (name in tokens) {
    runners.push(
      `gitlab-runner register \\\n` +
	`\t--non-interactive \\\n` +
	`\t--url "https://gitlab.com/" \\\n` +
	`\t--registration-token "${tokens[name]}" \\\n` +
	`\t--description "${name} runner, using ${tokens[name]} token" \\\n` +
	`\t--tag-list "${name}, ${tokens[name]}" \\\n` +
	`\t--maximum-timeout 14400 \\\n` +
	`\t--executor "shell"\n\n`
    );
  }
  return runners;
};

Runners.makeBashScript = (resourceType, file) => {
  initScript(file);
  // console.log(api)
  return api.getResource(resourceType)
    .then((resources) => {
      return Runners.getTokens(resources);
    })
    .then((tokens) => {
      return Runners.getCommands(tokens);
    })
    .then((runners) => {
      return runners.map((runner) => {
	console.log(runner);
	return addRunnerToScript(file, runner);
      });
    });
};

Runners.register = (name, token) => {
  let slug = `api/v4/runners`;
  // curl --request POST "https://gitlab.example.com/api/v4/runners"
  //      --form "token=<registration_token>"
  //      --form "description=test-1-20150125-test"
  //      --form "tag_list=ruby,mysql,tag1,tag2"

  return api.post(slug, {
    token: token,
    description: `Gitlab Runner for ${name}, using ${token} token`,
    locked: false,
    run_untagged: true,
    tag_list: [name, `${name}-runner`, token],
    access_level: "not_protected",
  })
    .then((response) => {
      console.log(response);
      return response.status;
    });
};

module.exports = Runners;

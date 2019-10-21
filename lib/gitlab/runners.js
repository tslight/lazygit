const api = require('./api');
const util = require('./util');
const Runners = {};

Runners.showOwned = (out) => {
  return api.getRunners()
    .then((runners) => {
      return util.filter(runners, out);
    });
};

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

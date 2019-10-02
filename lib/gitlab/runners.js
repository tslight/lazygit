const TOML = require('@iarna/toml');
const api = require('./api');
const Runners = {};

Runners.showOwned = () => {
  return api.getRunners()
    .then((runners) => {
      console.log(runners);
    });
};

Runners.getTokens = (resources) => {
  // https://stackoverflow.com/a/26265095
  return resources.reduce((map, res) => {
    map[res.name] = res.runners_token;
    return map;
  }, {});
};

Runners.getToml = (tokens) => {
  let runners = { runners: [] };
  for (name in tokens) {
    runners.runners.push(
      {
	name: `${name}-runner`,
	url: "https://gitlab.com/",
	token: tokens[name],
	executor: "shell",
	run_exec: "",
      }
    );
  }
  return TOML.stringify(runners);
};

Runners.getCommands = (tokens) => {
  let runners = [];
  for (name in tokens) {
    runners.push(
      `gitlab-runner register ` +
	`--non-interactive ` +
	`--url "https://gitlab.com/" ` +
	`--registration-token "${tokens[name]}" ` +
	`--description "${name}-${tokens[name]}" ` +
	`--tag-list "${name}, ${tokens[name]}" ` +
	`--executor "shell" ` +
	`--run-untagged="true" ` +
	`--locked="false" ` +
	`--access-level="not_protected"`
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

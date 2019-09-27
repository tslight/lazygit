const api = require('./api');
const Runners = {};

Runners.getProject = (id) => {
  let slug = `api/v4/projects/${id}/runners`;
  let attr = `\?per_page\=999`;

  return api.get(slug + attr)
    .then((runners) => {
      return runners.data;
    });
};

Runners.getOwned = () => {
  let slug = `api/v4/runners`;

  return api.get(slug)
    .then((runners) => {
      return runners.data;
    });
};

Runners.showOwned = () => {
  return Runners.getOwned()
    .then((runners) => {
      console.log(runners);
    });
};

Runners.register = (projectName) => {
  let slug = `api/v4/projects/${id}/runners`;
  // curl --request POST "https://gitlab.example.com/api/v4/runners"
  //      --form "token=<registration_token>"
  //      --form "description=test-1-20150125-test"
  //      --form "tag_list=ruby,mysql,tag1,tag2"

  return api.post(slug, {
    token: "udSr9ah3APyF5D8zR6Xm",
    description: `Gitlab Runner for ${projectName}`,
    locked: false,
    run_untagged: true,
    tag_list: [projectName],
    access_level: "not_protected",
  })
    .then((response) => {
      console.log(response.status);
      return response.status;
    });
};

module.exports = Runners;

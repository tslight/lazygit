const axios = require('axios');
const token = require('../args').chkToken();
const api = axios.create({
  baseURL: 'https://www.gitlab.com',
  headers: {'PRIVATE-TOKEN': token}
});

api._get = (slug, attr) => {
  return api.get(encodeURI(slug + attr))
    .then((response) => {
      return response.data;
    });
};

api._put = (slug, attr) => {
  return api.put(encodeURI(slug + attr))
    .then((response) => {
      console.log(response.status);
      console.log(response.statusText);
      console.log(response.config);
      console.log(response.data);
    });
};

api.putSlackSetting = (id) => {
  let slug = `/api/v4/projects/${id}/services/slack`;
  let webhook = 'https://hooks.slack.com/services/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';
  let attr = `?webhook=${webhook}&username=GitLab&notify_only_broken_pipelines=0&branches_to_be_notified=all&push_channel=source-control&issue_channel=source-control&confidential_issue_channel=source-control&merge_request_channel=source-control&note_channel=source-control&confidential_note_channel=source-control&tag_push_channel=source-control&pipeline_channel=ci-gitlab&wiki_page_channel=source-control&deployment_channel=source-control`;
  // let attr = `?webhook=${webhook}&${setting}`;
  return api._put(slug, attr);
};

api.getGroups = () => {
  let slug = `/api/v4/groups`;
  let attr = `?per_page=999`;
  return api._get(slug, attr);
};

api.getGroupIds = (id) => {
  let slug = `/api/v4/groups/${id}`;
  let attr = `?per_page=999`;
  return api._get(slug, attr);
};

api.getGroupProjects = (gid) => {
  let slug = `/api/v4/groups/${gid}/projects`;
  let attr = `?per_page=999`;
  return api._get(slug, attr);
};

api.getProjects = () => {
  let slug = `/api/v4/projects`;
  let attr = `?per_page=999&owned=true&membership=true`;
  return api._get(slug, attr);
};

api.getProjectIds = (gid) => {
  let slug = `/api/v4/projects/${gid}`;
  let attr = `?per_page=999`;
  return api._get(slug, attr);
};

api.getProjectResource = (id, resource) => {
  let slug = `/api/v4/projects/${id}/${resource}`;
  let attr = `?per_page=999`;
  return api._get(slug, attr);
};

api.getRunners = () => {
  let slug = `api/v4/runners`;
  let attr = `?per_page=999`;
  return api._get(slug, attr);
};

module.exports = api;

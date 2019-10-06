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
  console.log(`${api.defaults.baseURL}${slug}${attr}`);
  return api.put(encodeURI(slug + attr))
    .then((response) => {
      console.log(response.status);
      console.log(response.statusText);
      console.log(response.config);
      console.log(response.data);
    });
};

api.putSlackSetting = (id, setting) => {
  let webhook = `https://hooks.slack.com/services/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`;
  let slug = `/api/v4/projects/${id}/services/slack`;
  let attr = `?webhook=${webhook}&${setting}`;
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

api.getProjectHooks = (id) => {
  let slug = `/api/v4/projects/${id}/hooks`;
  let attr = `?per_page=999`;
  return api._get(slug, attr);
};

api.getProjectJobs = (id) => {
  let slug = `/api/v4/projects/${id}/jobs`;
  let attr = `?per_page=999`;
  return api._get(slug, attr);
};

api.getProjectPipelines = (id) => {
  let slug = `/api/v4/projects/${id}/pipelines`;
  let attr = `?per_page=999`;
  return api._get(slug, attr);
};

api.getProjectRunners = (id) => {
  let slug = `api/v4/projects/${id}/runners`;
  let attr = `?per_page=999`;
  return api._get(slug, attr);
};

api.getProjectSchedules = (id) => {
  let slug = `/api/v4/projects/${id}/pipeline_schedules`;
  let attr = `?per_page=999`;
  return api._get(slug, attr);
};

api.getProjectSlackService = (id) => {
  let slug = `/api/v4/projects/${id}/services/slack`;
  let attr = `?per_page=999`;
  return api._get(slug, attr);
};

api.getProjectTree = (id) => {
  let slug = `/api/v4/projects/${id}/repository/tree`;
  let attr = `?per_page=999`;
  return api._get(slug, attr);
};

api.getRunners = () => {
  let slug = `api/v4/runners`;
  let attr = `?per_page=999`;
  return api._get(slug, attr);
};

module.exports = api;

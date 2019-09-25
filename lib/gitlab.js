const axios = require('axios');
const args = require('./args');
const git = require('./git');
const token = args.chkToken();
const namespace = args.namespace;
const host = 'https://www.gitlab.com';
const gitlab = {
  api: axios.create({
    baseURL: host,
    headers: {'PRIVATE-TOKEN': token}
  })
};

/*
 * Agnostic Methods
 */
gitlab.runGit = (urls) => {
  // Send urls to be processed by git.
  return urls.map((url) => {
    return git.run(url);
  });
};

gitlab.getNamespace = (projects) => {
  // Filter project objects by match to namespace argument - defaults to an
  // empty string, so if no namespace argument - returns all projects.
  return projects.data.filter((project) => {
    return project.path_with_namespace.startsWith(namespace);
  });
};

/*
 * Group Methods
 */
gitlab.getGroupUrls = (id) => {
  let slug = `/api/v4/groups/${id}/projects\?per_page\=999`;
  return gitlab.api.get(slug)
    .then((repos) => {
      return repos.data.map((r) => {
	return r.ssh_url_to_repo;
      });
    });
};

gitlab.getGroups = () => {
  let slug = `/api/v4/groups\?per_page\=999`;
  return gitlab.api.get(slug)
    .then((groups) => {
      return groups.data.filter((group) => {
	return group.full_path.startsWith(args.group);
      });
    })
    .then((data) => {
      return data.map((group) => {
	return group.id;
      });
    });
};

/*
 * Project Methods
 */
gitlab.getProjectUrls = (projects) => {
  // Pull out url attributes from all project objects.
  return projects.map((project) => {
    if (args.http) {
      return project.http_url_to_repo;
    } else {
      return project.ssh_url_to_repo;
    }
  });
};

gitlab.getProjects = () => {
  // https://docs.gitlab.com/ee/api/projects.html#list-all-projects
  // Return all projects that the authenticated user is a member or owner of.
  let slug = `/api/v4/projects`;
  let attr = `\?per_page\=999\&owned\=true\&membership\=true\&simple\=true`;

  return gitlab.api.get(slug + attr)
    .then((projects) => {
      return(projects);
    });
};

gitlab.lazy = () => {
  return gitlab.getProjects()
    .then((projects) => {
      return gitlab.getNamespace(projects);
    })
    .then((projects) => {
      return gitlab.getProjectUrls(projects);
    })
    .then((urls) => {
      return gitlab.runGit(urls);
    });
};

module.exports = gitlab;

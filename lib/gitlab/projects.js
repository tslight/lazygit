const api       = require('./api');
const git       = require('../git');
const http      = require('../args').http;
const namespace = require('../args').namespace;
const Runners   = require('./runners');
const Projects  = {};

Projects.get = () => {
  // https://docs.gitlab.com/ee/api/projects.html#list-all-projects
  // Return all projects that the authenticated user is a member or owner of.
  let slug = `/api/v4/projects`;
  let attr = `\?per_page\=999\&owned\=true\&membership\=true`;

  return api.get(slug + attr)
    .then((projects) => {
      return projects.data;
    });
};

Projects.getHooks = (id) => {
  let slug = `/api/v4/projects/${id}/hooks`;
  let attr = `\?per_page\=999`;

  return api.get(slug + attr)
    .then((hooks) => {
      console.log(hooks.data);
      return hooks.data;
    });
};

Projects.getIds = (gid) => {
  let slug = `/api/v4/projects/${gid}`;
  let attr = `\?per_page\=999`;

  return api.get(slug + attr)
    .then((projects) => {
      return projects.data;
    });
};

Projects.getNamespace = (projects) => {
  // Filter project objects by match to namespace argument - defaults to an
  // empty string, so if no namespace argument - returns all projects.
  return projects.filter((project) => {
    return project.path_with_namespace.startsWith(namespace);
  });
};

Projects.getUrls = (projects) => {
  // Pull out url attributes from all project objects.
  return projects.map((project) => {
    if (http) {
      return project.http_url_to_repo;
    } else {
      return project.ssh_url_to_repo;
    }
  });
};

Projects.getRunnerTokens = (projects) => {
  // Pull out url attributes from all project objects.
  return projects.map((project) => {
    console.log(project);
    return project.runners_token;
  });
};

Projects.getTokens = () => {
  return Projects.get()
    .then((projects) => {
      return Projects.getNamespace(projects);
    })
    .then((projects) => {
      return projects.map((project) => {
	return project.id;
      });
    })
    .then((ids) => {
      let projects = ids.map((id) => {
	return Projects.getIds(id);
      });
      Promise.all(projects)
	.then((projects) => {
	  return Runners.getTokens(projects);
	})
	.then((tokens) => {
	  return Runners.getToml(tokens);
	})
	.then((runners) => {
	  console.log(runners);
	});
    });
};

Projects.getAllHooks = () => {
  return Projects.get()
    .then((projects) => {
      return Projects.getNamespace(projects);
    })
    .then((projects) => {
      return projects.map((project) => {
	return project.id;
      });
    })
    .then((ids) => {
      let hooks = ids.map((id) => {
	return Projects.getHooks(id);
      });
      Promise.all((hooks))
	.then((hooks) => {
	  console.log(hooks);
	});
    });
};

Projects.run = () => {
  return Projects.get()
    .then((projects) => {
      return Projects.getNamespace(projects);
    })
    .then((projects) => {
      return Projects.getUrls(projects);
    })
    .then((urls) => {
      return urls.map((url) => {
	return git.run(url);
      });
    });
};

module.exports = Projects;

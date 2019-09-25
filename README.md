# SLACK OFF. BE A LAZY GIT.

Run git commands or configuration on all projects or groups of an authenticated
Gitlab user.

So far only Gitlab is supported and the git commands - `clone`, `pull`, `fetch`
& `status`.

**Coming soon** - GitHub support & wider array of commands and configuration...

## INSTALLATION

Clone the repo, run `npm install` in the project root, to download
dependancies, and then `npm link` to install as a CLI app called `lazygitlab`.

**Coming soon** - official npm package...

## CONFIGURATION

Copy `config.example.json` to `config.json` and edit to your tastes. It should
be fairly self explantatory...

### TOKENS

Generate a Gitlab Personal Access Token from
[here](https://gitlab.com/profile/personal_access_tokens).

### DESTINATION

To specify which directory you'd like to clone/update change the `destination`
value in `config.json`.

### EXAMPLE

```javascript
{
  "dest": "/path/to/location/for/projects"
  "token" : "GITLAB_TOKEN"
}
```

Alternatively you can pass command line arguments to overwrite the default
configuration...

## OPTIONS

``` shell
Options:
  --version          Show version number
  --destination, -d  Destination directory to operate on
  --fetch, -f        Run fetch --all, instead of pull
  --groups, -g       Act on groups rather than projects
  --http, -h         Use http url to access projects
  --namespace, -n    Namespace to download (group or user)
  --status, -s       View local project status
  --token, -t        Gitlab API token
  --verbose, -v      Increase verbosity
  --help             Show help
```

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

``` text
Options:
  --version          Show version number
  --create, -c       Create a gitlab runner registering script
  --file, -f         Destination file for gitlab runner script
  --destination, -d  Destination directory to operate on
  --http             Use http url to access projects
  --ssh              Use ssh url to access projects
  --namespaces, -n   Namespace to query (group or user)
  --projects, -p     Projects to query (group or user)
  --groups, -g       Groups to query (group or user)
  --run, -r          Git command to run
  --show, -s         API resource to show
  --order, -o        Field to order API resources by
  --filter_key       Key to filter API resources by
  --filter_value     Value to filter API resources by
  --slack            Update Slack integration settings
  --token, -t        Gitlab API token
  --verbose, -v      Increase verbosity
  -h, --help         Show help
```

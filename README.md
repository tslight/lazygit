# SLACK OFF. BE A LAZY GIT.

So far this only supports Gitlab, but hopefully it will support GitHub too
soon...

Firstly you need to generate a Gitlab Personal Access Token from
[here](https://gitlab.com/profile/personal_access_tokens).

To authenicate to Gitlab copy `config.example.json` to `config.json` and add your
Gitlab Personal Access Token.

To specify which directory you'd like to clone/update change the `destination`
value in `config.json`.

```javascript
{
  "dest": "/path/to/location/for/projects"
  "token" : "GITLAB_TOKEN"
}
```

Then run `npm install` in the project root, to download dependancies, and `npm
link` to install as CLI app called `lazygitlab`

Alternatively you can pass command line arguments to overwrite the default
configuration.

You can also pass a the `--namespace` argument, and `lazygitlab` will only
download the projects under that namespace (can be a group path or your
username - for personal projects).

The `--status` flag will run `git status` on the locally downloaded projects,
so you can see what you've changed locally since you're last commit.

``` shell
Options:
  --version          Show version number
  --destination, -d  Destination directory to operate on
  --fetch, -f        Run fetch --all, instead of pull
  --namespace, -n    Namespace to download (group or user)
  --token, -t        Gitlab API token
  --status, -s       View local project status
  --verbose, -v      Increase verbosity
  --help, -h         Show help
```

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
  "dest": "/path/to/location/for/repos"
  "token" : "GITLAB_TOKEN"
}
```

Then run `npm install` in the project root, to download dependancies, and `npm
link` to install as CLI app called `lazygitlab`

Alternatively you can pass command line arguments to overwrite the default
configuration.

You can also pass a the `--group` argument, and `lazygitlab` will only download
the repositories under that group (recursively).

The `--status` flag will run `git status` on the locally downloaded repos, so
you can see what you've changed locally since you're last commit.

``` shell
Options:
  --version          Show version number
  --token, -t        Gitlab API token
  --destination, -d  Destination directory
  --group, -g        Group to download
  --verbose, -v      Increase verbosity
  --status, -s       View local status
  --help, -h         Show help
```

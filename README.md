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
configuration, and/or specify groups.

``` shell
Options:
  --version          Show version number                               [boolean]
  --token, -t        Gitlab API token                                   [string]
  --destination, -d  Destination directory                              [string]
  --group, -g        Group to download.                                 [string]
  --verbose, -v      Increase verbosity.                               [boolean]
  --status, -s       View local status.                                [boolean]
  --help, -h         Show help                                         [boolean]
```

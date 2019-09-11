# SLACK OFF. BE A LAZY GIT.

So far this only supports Gitlab, but hopefully it will support GitHub too
soon...

Firstly you need to generate a Gitlab Personal Access Token from
[here](https://gitlab.com/profile/personal_access_tokens).  To authenicate to
Gitlab copy `token.example.json` to `token.json` and add your Gitlab Personal
Access Token

```javascript
{
  "token" : "GITLAB_TOKEN"
}

```

Then run `npm install` in the project root, to download dependancies.

Finally run `npm run gitlab /path/to/directory` and you will have all the repos :smiley.

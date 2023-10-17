# qn-changelog

A tool designed to generate the release changelog for Qiniu.

## install

```shell
npm install -g qn-changelog
```

## usage

```text
Usage: qn-changelog [options] <base> <head>

Tools for generate changelog

Arguments:
  base                   base and head can be branch name or tag or commit hash
  head                   base and head can be branch name or tag or commit hash

Options:
  -V, --version          output the version number
  -u, --user <user>      github user
  -r, --repo <repo>      repo name
  -t, --token <token>    github access token, should specific when first run, it will be recorded into local config file: $HOME/.qn-changelog/config.json
  -a, --all              show all pull-request, not filter deploy pr
  --before <before>      filter changelog before time
  --after <after>        filter changelog after time
  -f, --format <format>  result format (choices: "html", "markdown", default: "markdown")
  -h, --help             display help for command

Examples:
  # generate changelog between master and develop
  $ qn-changelog master develop

  # generate changelog between B160623-H-1 and master, include pr for deploy
  $ qn-changelog B160623-H-1 master --all
```

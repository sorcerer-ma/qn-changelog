#! /usr/bin/env node

'use strict'

import { getIssuesFromBody } from './libs/issues'
import {
  Changelog,
  newChangelog,
  showChangelog,
  isNotDeployChangelog,
  isNotMasterMergeIntoDevelop
} from './libs/changelog'
import {
  getCommits,
  getPullRequest
} from './libs/api'
import yargs = require('yargs')

let argv: any = yargs
  .usage('Usage: changelog <base> <head> [options]\n\n<base> and <head> can be branch name or tag or commit hash')
  .demand(2)
  .example('changelog master develop', 'generate changelog between master and develop')
  .example('changelog B160623-H-1 master --all', 'generate changelog between B160623-H-1 and master, include pr for deploy')
  .options('u', {
    alias: 'user',
    describe: 'github user'
  })
  .options('r', {
    alias: 'repo',
    describe: 'repo name'
  })
  .options('a', {
    alias: 'all',
    describe: 'show all pull-request, not filter deploy pr'
  })
  .options('f', {
    alias: 'from',
    describe: 'time filter (coming soon)'
  })
  .options('config', {
    describe: "edit config file"
  })
  .help('h')
  .alias('h', 'help')
  .locale('en')
  .argv

let user: string = 'qbox',
  repo: string = 'portal-v4',
  base: string = 'master',
  head: string = 'develop'

function initArgs(): void {
  base = argv._[0]
  head = argv._[1]
}

function _errorHandler(err: Error): void {
  console.error(err.message)
}

function filterMergePrNumbers(commits: Array<RepositoryCommit>): Array<number> {
  let prReg: RegExp = /Merge pull request #(\d+)/
  return commits.map((commit) => {
    return commit.commit.message.match(prReg)
  }).filter((matches) => {
    return matches && matches.length === 2
  }).map<number>((matches) => {
    return +matches[1]
  })
}

function filterChangelog(changelogs: Array<Changelog>): Array<Changelog> {
  if (argv.a) { return changelogs }
  return changelogs
    .filter(isNotDeployChangelog)
    .filter(isNotMasterMergeIntoDevelop)
}

function genChangelog(): Promise<any> {
  return getCommits(user, repo, base, head)
    .then((res: CommitsComparison) => {
      return filterMergePrNumbers(res.commits)
    })
    .then((prNumbers: Array<number>) => {
      return Promise.all(prNumbers.map<Promise<any>>((prNumber) => {
        return getPullRequest(user, repo, prNumber)
      }))
    })
    .then((res: Array<PullRequest>) => {
      return res.map<Changelog>(newChangelog)
    })
    .then(filterChangelog)
    .catch(_errorHandler)
}

function markdownChangelogs(changelogs: Array<Changelog>): string {
  return changelogs
    .map((c) => { return c.toMarkdown() })
    .reduce((ret, m) => {
      return ret += '\n- ' + m
    }, 'changelog:')
}

function main(): void {
  initArgs()
  genChangelog()
    .then(markdownChangelogs)
    .then(console.log)
}

main()

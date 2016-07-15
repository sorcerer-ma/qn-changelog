#! /usr/bin/env node

'use strict'

import moment = require('moment');

import { getIssuesFromBody } from './libs/issues'
import {
  Changelog,
  newChangelog,
  isNotDeployChangelog,
  isNotMasterMergeIntoDevelop,
  isNotDevelopMergeIntoMaster
} from './libs/changelog'
import * as formatter from './libs/format'
import {
  init,
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
  .options('t', {
    alias: 'token',
    describe: 'github access token, should specific when first run, it will be recorded into local config file: $HOME/.qn-changelog/config.json'
  })
  .options('a', {
    alias: 'all',
    describe: 'show all pull-request, not filter deploy pr'
  })
  .options('before', {
    describe: 'filter changelog before time'
  })
  .options('after', {
    describe: 'filter changelog after time'
  })
  .options('f', {
    alias: 'format',
    describe: 'result format',
    choices: ['html', 'markdown'],
    default: 'markdown'
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
  if (argv.after && !moment(argv.after).isValid()) {
    throw new TypeError('after is invalid time')
  }
  if (argv.before && !moment(argv.before).isValid()) {
    throw new TypeError('before is invalid time')
  }
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
    .filter(isNotDevelopMergeIntoMaster)
}

function filterTime(changelogs: Array<Changelog>): Array<Changelog> {
  if (argv.after) {
    changelogs = changelogs.filter((c: Changelog) => {
      return c.mergedAt.isAfter(argv.after)
    })
  }
  if (argv.before) {
    changelogs = changelogs.filter((c: Changelog) => {
      return c.mergedAt.isBefore(argv.before)
    })
  }
  return changelogs
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
    .then(filterTime)
    .catch(_errorHandler)
}

function main(): void {
  initArgs()
  init(argv.t)

  let format: formatter.ChangelogsFormatter

  if (argv.format) {
    switch (argv.format) {
      case 'html':
        format = formatter.toHtml
        break;

      default:
        format = formatter.toMarkdown
        break;
    }
  }

  genChangelog()
    .then(format)
    .then(console.log)
}

main()

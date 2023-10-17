#!/usr/bin/env node

import moment from 'moment'
import { Command, Option } from 'commander'
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

const program = new Command()
program.name('qn-changelog')
    .description('A tool designed to generate the release changelog for Qiniu.')
    .version('0.2.2')

program.argument('<base>', 'base and head can be branch name or tag or commit hash')
    .argument('<head>', 'base and head can be branch name or tag or commit hash')

program.option('-u, --user <user>', 'github user')
    .option('-r, --repo <repo>', 'repo name')
    .option('-t, --token <token>', 'github access token, should specific when first run, it will be recorded into local config file: $HOME/.qn-changelog/config.json')
    .option('-a, --all', 'show all pull-request, not filter deploy pr')
    .option('--before <before>', 'filter changelog before time')
    .option('--after <after>', 'filter changelog after time')
    .addOption(new Option('-f, --format <format>', 'result format').default('markdown').choices(['html', 'markdown']))

program.addHelpText('before', `<base> and <head> can be branch name or tag or commit hash`)
program.addHelpText('after', `
Examples:
  # generate changelog between master and develop
  $ qn-changelog master develop

  # generate changelog between B160623-H-1 and master, include pr for deploy
  $ qn-changelog B160623-H-1 master --all
`)

program.showHelpAfterError()

program.parse()


let user: string = 'qbox',
    repo: string = 'portal-v4',
    base: string = 'master',
    head: string = 'develop'

function initArgs(): void {
    base = program.args[0]
    head = program.args[1]

    if (program.opts().after && !moment(program.opts().after).isValid()) {
        throw new TypeError('after is invalid time')
    }
    if (program.opts().before && !moment(program.opts().before).isValid()) {
        throw new TypeError('before is invalid time')
    }

    repo = program.opts().repo ? program.opts().repo : 'portal-v4'
    user = program.opts().user ? program.opts().user : 'qbox'
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
    if (program.opts().a) { return changelogs }
    return changelogs
        .filter(isNotDeployChangelog)
        .filter(isNotMasterMergeIntoDevelop)
        .filter(isNotDevelopMergeIntoMaster)
}

function filterTime(changelogs: Array<Changelog>): Array<Changelog> {
    if (program.opts().after) {
        changelogs = changelogs.filter((c: Changelog) => {
            return c.mergedAt.isAfter(program.opts().after)
        })
    }
    if (program.opts().before) {
        changelogs = changelogs.filter((c: Changelog) => {
            return c.mergedAt.isBefore(program.opts().before)
        })
    }
    return changelogs
}

function genChangelog(): Promise<any> {
    return getCommits(user, repo, base, head)
        .then((res: CommitsComparison) => {
            return filterMergePrNumbers(res.commits);
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
    init(program.opts().t)

    let format: formatter.ChangelogsFormatter

    if (program.opts().format === 'html') {
        format = formatter.toHtml
    } else {
        format = formatter.toMarkdown
    }

    genChangelog()
        .then(format)
        .then(console.log)
}

main()

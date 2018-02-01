#! /usr/bin/env node
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
const changelog_1 = require("./libs/changelog");
const formatter = require("./libs/format");
const api_1 = require("./libs/api");
const yargs = require("yargs");
let argv = yargs
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
    .argv;
let user = 'qbox', repo = 'portal-v4', base = 'master', head = 'develop';
function initArgs() {
    base = argv._[0];
    head = argv._[1];
    if (argv.after && !moment(argv.after).isValid()) {
        throw new TypeError('after is invalid time');
    }
    if (argv.before && !moment(argv.before).isValid()) {
        throw new TypeError('before is invalid time');
    }
    repo = argv.repo ? argv.repo : 'portal-v4';
    user = argv.user ? argv.user : 'qbox';
}
function _errorHandler(err) {
    console.error(err.message);
}
function filterMergePrNumbers(commits) {
    let prReg = /Merge pull request #(\d+)/;
    return commits.map((commit) => {
        return commit.commit.message.match(prReg);
    }).filter((matches) => {
        return matches && matches.length === 2;
    }).map((matches) => {
        return +matches[1];
    });
}
function filterChangelog(changelogs) {
    if (argv.a) {
        return changelogs;
    }
    return changelogs
        .filter(changelog_1.isNotDeployChangelog)
        .filter(changelog_1.isNotMasterMergeIntoDevelop)
        .filter(changelog_1.isNotDevelopMergeIntoMaster);
}
function filterTime(changelogs) {
    if (argv.after) {
        changelogs = changelogs.filter((c) => {
            return c.mergedAt.isAfter(argv.after);
        });
    }
    if (argv.before) {
        changelogs = changelogs.filter((c) => {
            return c.mergedAt.isBefore(argv.before);
        });
    }
    return changelogs;
}
function genChangelog() {
    return api_1.getCommits(user, repo, base, head)
        .then((res) => {
        return filterMergePrNumbers(res.commits);
    })
        .then((prNumbers) => {
        return Promise.all(prNumbers.map((prNumber) => {
            return api_1.getPullRequest(user, repo, prNumber);
        }));
    })
        .then((res) => {
        return res.map(changelog_1.newChangelog);
    })
        .then(filterChangelog)
        .then(filterTime)
        .catch(_errorHandler);
}
function main() {
    initArgs();
    api_1.init(argv.t);
    let format;
    if (argv.format === 'html') {
        format = formatter.toHtml;
    }
    else {
        format = formatter.toMarkdown;
    }
    genChangelog()
        .then(format)
        .then(console.log);
}
main();

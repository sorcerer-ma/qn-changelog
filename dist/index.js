#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const commander_1 = require("commander");
const changelog_1 = require("./libs/changelog");
const formatter = __importStar(require("./libs/format"));
const api_1 = require("./libs/api");
const program = new commander_1.Command();
program.name('qn-changelog')
    .description('Tools for generate changelog')
    .version('0.2.2');
program.argument('<base>', 'base and head can be branch name or tag or commit hash')
    .argument('<head>', 'base and head can be branch name or tag or commit hash');
program.option('-u, --user <user>', 'github user')
    .option('-r, --repo <repo>', 'repo name')
    .option('-t, --token <token>', 'github access token, should specific when first run, it will be recorded into local config file: $HOME/.qn-changelog/config.json')
    .option('-a, --all', 'show all pull-request, not filter deploy pr')
    .option('--before <before>', 'filter changelog before time')
    .option('--after <after>', 'filter changelog after time')
    .addOption(new commander_1.Option('-f, --format <format>', 'result format').default('markdown').choices(['html', 'markdown']));
program.addHelpText('before', `<base> and <head> can be branch name or tag or commit hash`);
program.addHelpText('after', `
Examples:
  # generate changelog between master and develop
  $ qn-changelog master develop

  # generate changelog between B160623-H-1 and master, include pr for deploy
  $ qn-changelog B160623-H-1 master --all
`);
program.showHelpAfterError();
program.parse();
let user = 'qbox', repo = 'portal-v4', base = 'master', head = 'develop';
function initArgs() {
    base = program.args[0];
    head = program.args[1];
    if (program.opts().after && !(0, moment_1.default)(program.opts().after).isValid()) {
        throw new TypeError('after is invalid time');
    }
    if (program.opts().before && !(0, moment_1.default)(program.opts().before).isValid()) {
        throw new TypeError('before is invalid time');
    }
    repo = program.opts().repo ? program.opts().repo : 'portal-v4';
    user = program.opts().user ? program.opts().user : 'qbox';
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
    if (program.opts().a) {
        return changelogs;
    }
    return changelogs
        .filter(changelog_1.isNotDeployChangelog)
        .filter(changelog_1.isNotMasterMergeIntoDevelop)
        .filter(changelog_1.isNotDevelopMergeIntoMaster);
}
function filterTime(changelogs) {
    if (program.opts().after) {
        changelogs = changelogs.filter((c) => {
            return c.mergedAt.isAfter(program.opts().after);
        });
    }
    if (program.opts().before) {
        changelogs = changelogs.filter((c) => {
            return c.mergedAt.isBefore(program.opts().before);
        });
    }
    return changelogs;
}
function genChangelog() {
    return (0, api_1.getCommits)(user, repo, base, head)
        .then((res) => {
        return filterMergePrNumbers(res.commits);
    })
        .then((prNumbers) => {
        return Promise.all(prNumbers.map((prNumber) => {
            return (0, api_1.getPullRequest)(user, repo, prNumber);
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
    (0, api_1.init)(program.opts().t);
    let format;
    if (program.opts().format === 'html') {
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

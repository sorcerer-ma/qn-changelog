'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const GitHubApi = require("github");
var github = new GitHubApi();
function init(token) {
    if (token) {
        setToken(token);
    }
    else {
        token = getToken();
    }
    if (token) {
        github.authenticate({
            type: 'oauth',
            token: token
        });
    }
}
exports.init = init;
function setToken(token) {
    let configDirPath = `${process.env.HOME}/.qn-changelog`;
    let configFilePath = `${configDirPath}/config.json`;
    let config = {
        token: token
    };
    try {
        fs.accessSync(configDirPath, fs.constants.F_OK);
    }
    catch (e) {
        try {
            fs.mkdirSync(configDirPath);
        }
        catch (e) {
            console.error('set token failed, error:', e);
        }
    }
    try {
        fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2), 'utf-8');
    }
    catch (e) {
        console.error('set token failed, error:', e);
    }
}
function getToken() {
    let configFilePath = process.env.HOME + '/.qn-changelog/config.json';
    try {
        fs.accessSync(configFilePath, fs.constants.F_OK);
    }
    catch (e) {
        return '';
    }
    let configStr = fs.readFileSync(configFilePath, 'utf-8');
    let config = JSON.parse(configStr);
    return config.token;
}
function getCommits(user, repo, base, head) {
    return new Promise((resolve, reject) => {
        github.repos.compareCommits({
            user: user,
            repo: repo,
            base: base,
            head: head
        }, (err, res) => {
            err ? reject(err) : resolve(res);
        });
    });
}
exports.getCommits = getCommits;
function getPullRequest(user, repo, prNumber) {
    return new Promise((resolve, reject) => {
        github.pullRequests.get({
            user: user,
            repo: repo,
            number: prNumber
        }, (err, res) => {
            err ? reject(err) : resolve(res);
        });
    });
}
exports.getPullRequest = getPullRequest;

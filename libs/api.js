'use strict';
const GitHubApi = require('github');
var github = new GitHubApi();
var token = process.env['GITHUB_TOKEN'];
github.authenticate({
    type: 'oauth',
    token: token
});
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

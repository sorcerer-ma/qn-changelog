'use strict';
const redmineIssueReg = /issues\/(\d+)/g, jiraIssueReg = /browse\/([a-zA-Z0-9-]+)/g, githubIssuesReg = /#(\d+)/g;
function getIssuesFromBody(prBody) {
    var matched;
    let ret = [];
    matched = jiraIssueReg.exec(prBody);
    while (matched != null) {
        ret.push(matched[1]);
        matched = jiraIssueReg.exec(prBody);
    }
    return ret;
}
exports.getIssuesFromBody = getIssuesFromBody;
function formatJiraIssue(issue) {
    return `https://jira.qiniu.io/browse/${issue}`;
}
exports.formatJiraIssue = formatJiraIssue;

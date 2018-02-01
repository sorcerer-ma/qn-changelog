'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const redmineIssueReg = /issues\/(\d+)/g, jiraIssueReg = /browse\/([a-zA-Z0-9-]+)/g, jiraPRTitleIssueReg = /[A-Za-z0-9]+-\d+/g, githubIssuesReg = /#(\d+)/g;
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
function getIssuesFromTitle(prTitle) {
    var matched;
    let ret = [];
    matched = jiraPRTitleIssueReg.exec(prTitle);
    while (matched != null) {
        ret.push(matched[0]);
        matched = jiraPRTitleIssueReg.exec(prTitle);
    }
    return ret;
}
exports.getIssuesFromTitle = getIssuesFromTitle;
function formatJiraIssue(issue) {
    return `https://jira.qiniu.io/browse/${issue}`;
}
exports.formatJiraIssue = formatJiraIssue;

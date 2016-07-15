'use strict';
const moment = require('moment');
const issues_1 = require('./issues');
class Changelog {
    constructor(pr) {
        this.number = pr.number;
        this.title = pr.title;
        this.issueNumbers = issues_1.getIssuesFromBody(pr.body);
        this.user = pr.user;
        this.mergedAt = moment(pr.merged_at);
    }
    toString() {
        let issues = this.issueNumbers.join(',');
        return `[${issues}] ${this.title} #${this.number} (@${this.user.login})`;
    }
    toMarkdown() {
        let urlMarkdown = this.issueNumbers.map((issue) => {
            return `[${issue}](${issues_1.formatJiraIssue(issue)})`;
        }).join(',');
        return `- [${urlMarkdown}] ${this.title} #${this.number} (@${this.user.login})`;
    }
    toHtml() {
        let anchorEls = this.issueNumbers.map((issue) => {
            return `<a href="${issues_1.formatJiraIssue(issue)}">${issue}</a>`;
        }).join(', ');
        return `<li>[${anchorEls}] ${this.title} #${this.number} (@${this.user.login})</li>`;
    }
    isDeployChangelog() {
        return /^B\d{6}/.test(this.title);
    }
    isMasterToDevelop() {
        return /master\s*->\s*develop/i.test(this.title);
    }
    isDevelopToMaster() {
        return /develop\s*->\s*master/i.test(this.title);
    }
}
exports.Changelog = Changelog;
function newChangelog(pr) {
    return new Changelog(pr);
}
exports.newChangelog = newChangelog;
function isNotDeployChangelog(c) {
    return !c.isDeployChangelog();
}
exports.isNotDeployChangelog = isNotDeployChangelog;
function isNotMasterMergeIntoDevelop(c) {
    return !c.isMasterToDevelop();
}
exports.isNotMasterMergeIntoDevelop = isNotMasterMergeIntoDevelop;
function isNotDevelopMergeIntoMaster(c) {
    return !c.isDevelopToMaster();
}
exports.isNotDevelopMergeIntoMaster = isNotDevelopMergeIntoMaster;
function showChangelog(c) {
    return c.toString();
}
exports.showChangelog = showChangelog;

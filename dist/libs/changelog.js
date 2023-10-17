"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.showChangelog = exports.isNotDevelopMergeIntoMaster = exports.isNotMasterMergeIntoDevelop = exports.isNotDeployChangelog = exports.newChangelog = exports.Changelog = void 0;
const moment_1 = __importDefault(require("moment"));
const issues_1 = require("./issues");
class Changelog {
    constructor(pr) {
        this.number = pr.number;
        this.title = pr.title;
        let issueNumbers = (0, issues_1.getIssuesFromTitle)(pr.title);
        if (issueNumbers.length == 0) {
            issueNumbers = (0, issues_1.getIssuesFromBody)(pr.body);
        }
        this.issueNumbers = issueNumbers;
        this.user = pr.user;
        this.mergedAt = (0, moment_1.default)(pr.merged_at);
    }
    toString() {
        let issues = this.issueNumbers.join(',');
        return `[${issues}] ${this.title} #${this.number} (@${this.user.login})`;
    }
    toMarkdown() {
        let urlMarkdown = this.issueNumbers.map((issue) => {
            return `[${issue}](${(0, issues_1.formatJiraIssue)(issue)})`;
        }).join(',');
        return `- [${urlMarkdown}] ${this.title} #${this.number} (@${this.user.login})`;
    }
    toHtml() {
        let anchorEls = this.issueNumbers.map((issue) => {
            return `<a href="${(0, issues_1.formatJiraIssue)(issue)}">${issue}</a>`;
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

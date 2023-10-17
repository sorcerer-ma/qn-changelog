import moment from 'moment'

import {
	getIssuesFromBody,
	getIssuesFromTitle,
	formatJiraIssue
} from './issues'

class Changelog {
	number: number
	title: string
	issueNumbers: Array<string>
	user: User
	mergedAt: moment.Moment

	constructor(pr: PullRequest) {
		this.number = pr.number
		this.title = pr.title
		let issueNumbers = getIssuesFromTitle(pr.title)
		if (issueNumbers.length == 0) {
			issueNumbers = getIssuesFromBody(pr.body)
		}
		this.issueNumbers = issueNumbers
		this.user = pr.user
		this.mergedAt = moment(pr.merged_at)
	}

	toString(): string {
		let issues: string = this.issueNumbers.join(',')
		return `[${issues}] ${this.title} #${this.number} (@${this.user.login})`
	}

	toMarkdown(): string {
		let urlMarkdown: string = this.issueNumbers.map((issue: string) => {
			return `[${issue}](${formatJiraIssue(issue)})`
		}).join(',')
		return `- [${urlMarkdown}] ${this.title} #${this.number} (@${this.user.login})`
	}

	toHtml(): string {
		let anchorEls: string = this.issueNumbers.map((issue: string) => {
			return `<a href="${formatJiraIssue(issue)}">${issue}</a>`
		}).join(', ')
		return `<li>[${anchorEls}] ${this.title} #${this.number} (@${this.user.login})</li>`
	}

	isDeployChangelog(): boolean {
		return /^B\d{6}/.test(this.title)
	}

	isMasterToDevelop(): boolean {
		return /master\s*->\s*develop/i.test(this.title)
	}

	isDevelopToMaster(): boolean {
		return /develop\s*->\s*master/i.test(this.title)
	}
}

function newChangelog(pr: PullRequest): Changelog {
	return new Changelog(pr)
}

function isNotDeployChangelog(c: Changelog): boolean {
	return !c.isDeployChangelog()
}

function isNotMasterMergeIntoDevelop(c: Changelog): boolean {
	return !c.isMasterToDevelop()
}

function isNotDevelopMergeIntoMaster(c: Changelog): boolean {
	return !c.isDevelopToMaster()
}

function showChangelog(c: Changelog): string {
	return c.toString()
}

export {
	Changelog,
	newChangelog,
	isNotDeployChangelog,
	isNotMasterMergeIntoDevelop,
	isNotDevelopMergeIntoMaster,
	showChangelog
}

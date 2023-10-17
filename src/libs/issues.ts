const redmineIssueReg: RegExp = /issues\/(\d+)/g,
	jiraIssueReg: RegExp = /browse\/([a-zA-Z0-9-]+)/g,
	jiraPRTitleIssueReg: RegExp = /[A-Za-z][A-Za-z0-9]*-\d+/g,
	githubIssuesReg: RegExp = /#(\d+)/g

export function getIssuesFromBody(prBody: string): Array<string> {
	var matched: RegExpExecArray
	let ret: Array<string> = []
	matched = jiraIssueReg.exec(prBody)
	while (matched != null) {
		ret.push(matched[1])
		matched = jiraIssueReg.exec(prBody)
	}
	return ret
}

export function getIssuesFromTitle(prTitle: string): Array<string> {
	var matched: RegExpExecArray
	let ret: Array<string> = []
	matched = jiraPRTitleIssueReg.exec(prTitle)
	while (matched != null) {
		ret.push(matched[0])
		matched = jiraPRTitleIssueReg.exec(prTitle)
	}
	return ret
}

export function formatJiraIssue(issue: string): string {
	return `https://jira.qiniu.io/browse/${issue}`
}

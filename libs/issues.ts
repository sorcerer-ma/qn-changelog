'use strict'

const redmineIssueReg: RegExp = /issues\/(\d+)/g,
  jiraIssueReg: RegExp = /browse\/([a-zA-Z0-9-]+)/g,
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

export function formatJiraIssue(issue: string): string {
  return `https://jira.qiniu.io/browse/${issue}`
}

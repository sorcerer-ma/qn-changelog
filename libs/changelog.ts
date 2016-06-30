'use strict'

import {
  getIssuesFromBody,
  formatJiraIssue
} from './issues'

class Changelog {
  number: number
  title: string
  issueUrls: Array<string>
  user: User

  constructor(pr: PullRequest) {
    this.number = pr.number
    this.title = pr.title
    this.issueUrls = getIssuesFromBody(pr.body)
    this.user = pr.user
  }

  show(): string {
    var urls: string = this.issueUrls.join(',')
    return `[${urls}] ${this.title} #${this.number} (@${this.user.login})`
  }

  toMarkdown(): string {
    let urlMarkdown: string = this.issueUrls.map((issue: string) => {
      return `[${issue}](${formatJiraIssue(issue)})`
    }).join(',')
    return `[${urlMarkdown}] ${this.title} #${this.number} (@${this.user.login})`
  }

  isDeployChangelog(): boolean {
    return /^B\d{6}/.test(this.title)
  }

  isMasterToDevelop(): boolean {
    return /master -> develop/i.test(this.title)
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

function showChangelog(c: Changelog): string {
  return c.show()
}

function markdownChangelog(c: Changelog): string {
  return c.toMarkdown()
}

export {
  Changelog,
  newChangelog,
  isNotDeployChangelog,
  isNotMasterMergeIntoDevelop,
  showChangelog
}

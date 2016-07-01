'use strict'

import moment = require('moment')

import {
  getIssuesFromBody,
  formatJiraIssue
} from './issues'

class Changelog {
  number: number
  title: string
  issueUrls: Array<string>
  user: User
  mergedAt: moment.Moment

  constructor(pr: PullRequest) {
    this.number = pr.number
    this.title = pr.title
    this.issueUrls = getIssuesFromBody(pr.body)
    this.user = pr.user
    this.mergedAt = moment(pr.merged_at)
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
  isNotDevelopMergeIntoMaster,
  showChangelog
}

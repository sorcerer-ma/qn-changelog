'use strict'

import GitHubApi = require('github')

var github = new GitHubApi()

var token: string = process.env['GITHUB_TOKEN']

github.authenticate({
  type: 'oauth',
  token: token
})

function getCommits(user: string, repo: string, base: string, head: string): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    github.repos.compareCommits({
      user: user,
      repo: repo,
      base: base,
      head: head
    }, (err: Error, res: CommitsComparison) => {
      err ? reject(err) : resolve(res)
    })
  })
}

function getPullRequest(user: string, repo: string, prNumber: number): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    github.pullRequests.get({
      user: user,
      repo: repo,
      number: prNumber
    }, (err: Error, res: PullRequest) => {
      err ? reject(err) : resolve(res)
    })
  })
}

export {
  getCommits,
  getPullRequest
}

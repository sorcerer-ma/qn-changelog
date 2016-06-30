'use strict'

import fs = require('fs')
import GitHubApi = require('github')

var github = new GitHubApi()

function init(token?: string): void {
  if (token) {
    setToken(token)
  } else {
    token = getToken()
  }

  if (token) {
    github.authenticate({
      type: 'oauth',
      token: token
    })
  }
}

function setToken(token: string): void {
  let configDirPath: string = `${process.env.HOME}/.qn-changelog`
  let configFilePath: string = `${configDirPath}/config.json`

  let config: Object = {
    token: token
  }

  try {
    fs.accessSync(configDirPath, fs.F_OK)
  } catch (e) {
    try {
      fs.mkdirSync(configDirPath)
    } catch (e) {
      console.error('set token failed, error:', e)
    }
  }

  try {
    fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2), 'utf-8')
  } catch (e) {
    console.error('set token failed, error:', e)
  }
}

function getToken(): string {
  let configFilePath: string = process.env.HOME + '/.qn-changelog/config.json'
  try {
    fs.accessSync(configFilePath, fs.F_OK)
  } catch (e) {
    return ''
  }

  let configStr: string = fs.readFileSync(configFilePath, 'utf-8')
  let config = JSON.parse(configStr)
  return config.token
}

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
  init,
  getCommits,
  getPullRequest
}

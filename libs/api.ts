'use strict'

import * as fs from 'fs'
import GitHubApi = require('@octokit/rest')

var github = new GitHubApi()

function init(token?: string): void {
  if (token) {
    setToken(token)
  } else {
    token = getToken()
  }

  if (token) {
    github = new GitHubApi({
      auth: token
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
    fs.accessSync(configDirPath, fs.constants.F_OK)
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
    fs.accessSync(configFilePath, fs.constants.F_OK)
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
      owner: user,
      repo: repo,
      base: base,
      head: head
    }).then((res) => {
      resolve(res.data)
    }).catch((err) => {
      console.error(err)
    })
  })
}

function getPullRequest(user: string, repo: string, prNumber: number): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    github.pulls.get({
      owner: user,
      repo: repo,
      pull_number: prNumber
    }).then((res) => {
      resolve(res.data)
    }).catch((err) => {
      console.error(err)
    })
  })
}

export {
  init,
  getCommits,
  getPullRequest
}

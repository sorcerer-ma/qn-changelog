var GitHubApi = require("github")
var github = new GitHubApi()

github.authenticate({
  type: 'oauth',
  token: 'b75897c379a574c8e1569ca343e1a79882619f00'
})

type GithubUserName = string
type GithubRepoName = string

const user: GithubUserName = 'qbox',
  repo: GithubRepoName = 'portal-v4',
  prReg: RegExp = /Merge pull request #(\d+)/

function _errorHandler(err: Error): void {
  console.error(err.message)
}

function getCommits(user: string, repo: string, base: string, head: string): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    github.repos.compareCommits({
      user: user,
      repo: repo,
      base: base,
      head: head
    }, (err, res) => {
      err ? reject(err) : resolve(res)
    })
  })
}

getCommits(user, repo, 'master', 'develop')
  .then((res: CommitsComparison) => { return res }, _errorHandler)
  .then((res) => {
    console.log(res.commits.map((commit) => {
      return commit.commit.message.match(prReg)
    }).filter((matches) => {
      return matches && matches.length == 2
    }).map((matches) => {
      return matches[1]
    }))
  })

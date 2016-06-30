declare interface CommitsComparison {
  base_commit?: RepositoryCommit,
  merge_base_commit?: RepositoryCommit,

  status?: string,
  ahead_by?: number,
  behind_by?: number,
  total_commits?: number,

  commits?: Array<RepositoryCommit>,
  Files?: Array<CommitFile>,
}

declare interface RepositoryCommit {
  sha?: string,
  commit?: Commit,
  author?: User,
  committer?: User,
  parents?: Array<Commit>,
  message?: string,
  html_url?: string,

  stats?: CommitStats,
  files?: Array<CommitFile>,
}

declare interface CommitFile {
  sha?: string,
  filename?: string,
  additions?: number,
  deletions?: number,
  changes?: number,
  status?: string,
  patch?: string,
}

declare interface Commit {
  sha?: string,
  author?: CommitAuthor,
  committer?: CommitAuthor,
  message?: string,
  tree?: any, // interface Tree
  parents: Array<Commit>,
  stats?: CommitStats,
  url?: string,

  comment_count?: number,
}

declare interface CommitAuthor {
  date?: Date,
  name?: string,
  email?: string,
}

declare interface CommitStats {
  additions?: number,
  deletions?: number,
  total?: number,
}

declare interface User {
  login?: string
  // TODO: other properties
}

declare interface PullRequest {
  number?: number,
  state?: string,
  title?: string,
  body?: string,
  created_at?: Date,
  updated_at?: Date,
  closed_at?: Date,
  merged_at?: Date,
  user?: User,
  merged?: boolean,
  mergeable?: boolean,
  merged_by?: User,
  comments?: number,
  commits?: number,
  additions?: number,
  deletions?: number,
  changed_files?: number,
  url?: string,
  html_url?: string,
  issue_url?: string,
  statuses_url?: string,
  diff_url?: string,
  patch_url?: string,
  head?: PullRequestBranch,
  base?: PullRequestBranch
}

declare interface PullRequestBranch {
  label?: string,
  ref?: string,
  sha?: string,
  repo?: Repository,
  user?: User
}

declare type Repository = any

interface Repos {
  compareCommits(p: any, cb: Function): any
}

interface PullRequests {
  get(p:any, cb:Function): any
}

declare class GitHubApi {
  constructor(opt?: any)

  authenticate(param: any): any

  repos: Repos
  pullRequests: PullRequests
}

declare module 'github' {
  export = GitHubApi
}

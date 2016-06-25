interface CommitsComparison {
  base_commit?: RepositoryCommit,
  merge_base_commit?: RepositoryCommit,

  status?: string,
  ahead_by?: number,
  behind_by?: number,
  total_commits?: number,

  commits?: Array<RepositoryCommit>,
  Files?: Array<CommitFile>,
}

interface RepositoryCommit {
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

interface CommitFile {
  sha?: string,
  filename?: string,
  additions?: number,
  deletions?: number,
  changes?: number,
  status?: string,
  patch?: string,
}

interface Commit {
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

interface CommitAuthor {
  date?: Date,
  name?: string,
  email?: string,
}

interface CommitStats {
  additions?: number,
  deletions?: number,
  total?: number,
}

// TODO
type User = any

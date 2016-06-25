declare var GitHubApi: any;
declare var github: any;
declare type GithubUserName = string;
declare type GithubRepoName = string;
declare const user: GithubUserName, repo: GithubRepoName, prReg: RegExp;
declare function _errorHandler(err: Error): void;
declare function getCommits(user: string, repo: string, base: string, head: string): Promise<any>;

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPullRequest = exports.getCommits = exports.init = void 0;
const fs = __importStar(require("fs"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const octokit_1 = require("octokit");
let github = new octokit_1.Octokit({
    request: { fetch: node_fetch_1.default }
});
function init(token) {
    if (token) {
        setToken(token);
    }
    else {
        token = getToken();
    }
    if (token) {
        github = new octokit_1.Octokit({
            request: { fetch: node_fetch_1.default },
            auth: token
        });
    }
}
exports.init = init;
function setToken(token) {
    let configDirPath = `${process.env.HOME}/.qn-changelog`;
    let configFilePath = `${configDirPath}/config.json`;
    let config = {
        token: token
    };
    try {
        fs.accessSync(configDirPath, fs.constants.F_OK);
    }
    catch (e) {
        try {
            fs.mkdirSync(configDirPath);
        }
        catch (e) {
            console.error('set token failed, error:', e);
        }
    }
    try {
        fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2), 'utf-8');
    }
    catch (e) {
        console.error('set token failed, error:', e);
    }
}
function getToken() {
    let configFilePath = process.env.HOME + '/.qn-changelog/config.json';
    try {
        fs.accessSync(configFilePath, fs.constants.F_OK);
    }
    catch (e) {
        return '';
    }
    let configStr = fs.readFileSync(configFilePath, 'utf-8');
    let config = JSON.parse(configStr);
    return config.token;
}
function getCommits(user, repo, base, head) {
    return new Promise((resolve, reject) => {
        github.rest.repos.compareCommits({
            owner: user,
            repo: repo,
            base: base,
            head: head
        }).then((res) => {
            resolve(res.data);
        }).catch((err) => {
            console.error(err);
        });
    });
}
exports.getCommits = getCommits;
function getPullRequest(user, repo, prNumber) {
    return new Promise((resolve, reject) => {
        github.rest.pulls.get({
            owner: user,
            repo: repo,
            pull_number: prNumber
        }).then((res) => {
            resolve(res.data);
        }).catch((err) => {
            console.error(err);
        });
    });
}
exports.getPullRequest = getPullRequest;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("isomorphic-fetch");
const vscode = require("vscode");
const xhr_1 = require("./xhr");
const blameDataCache = new Map();
function fetchBlameData(repo, rev, path, startLine = 0, endLine = 0) {
    const key = `${repo}:${path}:${rev}:${startLine}:${endLine}`;
    const cachedBlameData = blameDataCache.get(key);
    if (cachedBlameData) {
        return Promise.resolve(cachedBlameData);
    }
    return fetchGQL(`query getBlameData($repo: String, $rev: String, $path: String, $startLine: Int, $endLine: Int) {
        root {
            repository(uri: $repo) {
                commit(rev: $rev) {
                    commit {
                        file(path: $path) {
                            blameRaw(startLine: $startLine, endLine: $endLine)
                        }
                    }
                }
            }
        }
    }`, { repo, rev, path, startLine, endLine }).then(query => {
        if (!query || !query.data || !query.data.root) {
            return null;
        }
        const root = query.data.root;
        if (!root.repository || !root.repository.commit || !root.repository.commit.commit) {
            return null;
        }
        const commit = root.repository && root.repository.commit.commit;
        if (!commit || !commit.file) {
            return null;
        }
        blameDataCache.set(key, commit.file.blameRaw);
        return commit.file.blameRaw;
    });
}
exports.fetchBlameData = fetchBlameData;
/**
 * gitCmdCache caches the result for a git command based. This helps prevent multiple round trip fetches
 * for content we have already resolved.
 */
const gitCmdCache = new Map();
function fetchForGitCmd(repo, params) {
    const key = `${repo}:${params.toString()}`;
    const cachedResponse = gitCmdCache.get(key);
    if (cachedResponse) {
        return Promise.resolve(cachedResponse);
    }
    return fetchGQL(`query gitCmdRaw($repo: String, $params: [String]) {
        root {
            repository(uri: $repo) {
                gitCmdRaw(params: $params)
            }
        }
    }`, { repo, params }).then(query => {
        if (!query || !query.data || !query.data.root) {
            return null;
        }
        const root = query.data.root;
        if (!root.repository || !root.repository.gitCmdRaw) {
            return null;
        }
        gitCmdCache.set(key, root.repository.gitCmdRaw);
        return root.repository.gitCmdRaw;
    });
}
exports.fetchForGitCmd = fetchForGitCmd;
function fetchGQL(query, variables) {
    const endpoint = vscode.workspace.getConfiguration('remote').get('endpoint');
    // The X-Requested-By header is required for the Sourcegraph API to allow
    // the use of cookie auth (to protect against CSRF).
    return xhr_1.doFetch(`${endpoint}/.api/graphql`, { method: 'POST', body: JSON.stringify({ query, variables }), 'x-sourcegraph-client': 'gitlens-extension', headers: { 'X-Requested-By': '_' } })
        .then(resp => resp.json())
        .then(json => json)
        .catch(err => {
        return err;
    });
}
//# sourceMappingURL=fetch.js.map
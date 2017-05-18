"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("isomorphic-fetch");
function combineHeaders(a, b) {
    let headers = new Headers(a);
    b.forEach((val, name) => { headers.append(name, val); });
    return headers;
}
exports.combineHeaders = combineHeaders;
function defaultOptions() {
    if (typeof Headers === 'undefined') {
        return undefined;
    }
    const headers = new Headers();
    return {
        headers,
        credentials: 'include'
    };
}
;
function doFetch(url, opt) {
    let defaults = defaultOptions();
    const fetchOptions = Object.assign({}, defaults, opt);
    if (opt.headers && defaults) {
        // the above object merge might override the auth headers. add those back in.
        fetchOptions.headers = combineHeaders(opt.headers, defaults.headers);
    }
    return fetch(url, fetchOptions);
}
exports.doFetch = doFetch;
//# sourceMappingURL=xhr.js.map
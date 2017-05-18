import 'isomorphic-fetch';

type FetchOptions = { headers: Headers, credentials: string };

export function combineHeaders(a: Headers, b: Headers): Headers {
    let headers = new Headers(a);
    b.forEach((val: string, name: any) => { headers.append(name, val); });
    return headers;
}

function defaultOptions(): FetchOptions | undefined {
    if (typeof Headers === 'undefined') {
        return undefined;
    }
    const headers = new Headers();
    return {
        headers,
        credentials: 'include'
    };
};

export function doFetch(url: string, opt?: any): Promise<Response> {
    let defaults = defaultOptions();
    const fetchOptions = Object.assign({}, defaults, opt);
    if (opt.headers && defaults) {
        // the above object merge might override the auth headers. add those back in.
        fetchOptions.headers = combineHeaders(opt.headers, defaults.headers);
    }
    return fetch(url, fetchOptions);
}

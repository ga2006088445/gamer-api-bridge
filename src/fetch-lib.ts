import fetch, { Response } from "node-fetch";
import { JSDOM } from "jsdom";

import { getBaseCookie, getSocksProxyAgent, getUserAgent } from "./env-manager";

export function buildFullUrl(baseUrl: string, pathSegment: string) {
    let url = new URL(baseUrl);
    // 確保基 URL 以斜杠結尾
    if (!url.pathname.endsWith('/')) {
        url.pathname += '/';
    }
    // 附加路徑片段
    url.pathname += pathSegment;
    return url.href;
}

export async function fetchPageContent(url: string): Promise<Document> {
    const userAgent = getUserAgent();
    const cookie = getBaseCookie();
    const agent = getSocksProxyAgent();

    const headers: Record<string, string> = {
        "User-Agent": userAgent,
        "Content-Type": "application/x-www-form-urlencoded",
    };

    cookie ? headers["Cookie"] = cookie : null;

    const response = await fetch(url, {
        method: "GET",
        headers,
        agent,
    });

    const pageText = await response.text();
    const dom = new JSDOM(pageText);
    return dom.window.document;
}

export async function fetchPostFormUrlencoded(url: string, body: Record<string, string>): Promise<Response> {
    const userAgent = getUserAgent();
    const cookie = getBaseCookie();
    const agent = getSocksProxyAgent();

    const headers: Record<string, string> = {
        "User-Agent": userAgent,
        "Content-Type": "application/x-www-form-urlencoded",
    };

    cookie ? headers["Cookie"] = cookie : null;

    const bodyParams = new URLSearchParams();
    Object.entries(body).forEach(([key, value]) => {
        bodyParams.append(key, value);
    });

    const response = await fetch(url, {
        method: "POST",
        headers,
        body: bodyParams,
        agent,
    });

    return response;
}
import { SocksProxyAgent } from "socks-proxy-agent";

// 取得 UserAgent 的資料
export function getUserAgent() {
    const mozillaAgent = "Mozilla/5.0"
    const windowsNT = "Windows NT 10.0; Win64; x64"
    const chromeAgent = "Chrome/120.0.0.0"
    const appleWebKitAgent = "AppleWebKit/537.36 (KHTML, like Gecko)"
    const safariAgent = "Safari/537.36"
    const userAgent = `${mozillaAgent} (${windowsNT}) ${appleWebKitAgent} ${chromeAgent} ${safariAgent}`
    return userAgent;
}

// 取得 SocksProxyAgent 
export function getSocksProxyAgent() {
    const socksUrl = process.env["SOCKS_PROXY_URL"] as string;
    const agent = socksUrl ? new SocksProxyAgent(socksUrl) : undefined;
    return agent;
}

// 取得基礎 cookie
export function getBaseCookie() {
    const cookie = process.env["CLOUDFLARE_COOKIE"];
    if (!cookie) {
        throw new Error("CLOUDFLARE_COOKIE is not defined");
    }
    return cookie;
}

// 取得登入頁面 Url
export function getLoginPageUrl() {
    const url = process.env["LOGIN_PAGE_URL"];
    if (!url) {
        throw new Error("LOGIN_PAGE_URL is not defined");
    }
    return url;
}

// 取得登入 API Url
export function getLoginApiUrl() {
    const url = process.env["LOGIN_API_URL"];
    if (!url) {
        throw new Error("LOGIN_API_URL is not defined");
    }
    return url;
}

// 取得首頁 Url
export function getHomePageUrl() {
    const url = process.env["HOME_PAGE_URL"];
    if (!url) {
        throw new Error("HOME_PAGE_URL is not defined");
    }
    return url;
}

// 取得部落格頁面 Url
export function getBlogPageUrl() {
    const url = process.env["BLOG_PAGE_URL"];
    if (!url) {
        throw new Error("BLOG_PAGE_URL is not defined");
    }
    return url;
}

// 取得登入時回傳的 cookie key
export function getLoginCookieKey() {
    const key = process.env["LOGIN_COOKIE_KEY"];
    if (!key) {
        throw new Error("LOGIN_COOKIE_KEY is not defined");
    }
    return key.split(",").map((key) => key.trim());
}
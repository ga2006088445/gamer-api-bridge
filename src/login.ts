import { fetchPageContent, fetchPostFormUrlencoded } from "./fetch-lib";

import { getLoginApiUrl, getLoginPageUrl, getLoginCookieKey } from "./env-manager";

import { Cookie } from "tough-cookie";

// 發送登入 API 可也接受帳號密碼的輸入函式
export async function login(username: string, password: string) {
    const url = getLoginApiUrl();

    // 發送 HTTP POST form-data 請求, 回應此次請求的 SetCookie 回傳
    const { token: alternativeCaptcha } = await getAlternativeCaptcha();

    const body = {
        userid: username,
        password: password,
        autoLogin: "T",
        alternativeCaptcha,
    };

    const response = await fetchPostFormUrlencoded(url, body);

    // 取得 Set-Cookie 的資料
    const headerValues = response.headers.values();

    if (!headerValues) {
        throw new Error("set-cookie not found");
    }

    const cookies: Cookie[] = [];

    for (const headerValue of headerValues) {
        const cookie = Cookie.parse(headerValue);
        if (cookie) {
            cookies.push(cookie);
        }
    }

    const loginCookieKey = getLoginCookieKey();
    const setCookieArrayFiltered = cookies.filter((cookie) => loginCookieKey.includes(cookie.key));
    const cookieString = setCookieArrayFiltered.map((cookie) => cookie.cookieString()).join("; ");

    return cookieString;
}

// 取得 alternativeCaptcha 的資料
export async function getAlternativeCaptcha() {
    const loginPageUrl = getLoginPageUrl();
    const document = await fetchPageContent(loginPageUrl);

    // 獲取特定元素的 value
    const value = document.querySelector<HTMLInputElement>('input[name="alternativeCaptcha"]')?.value;
    if (!value) {
        throw new Error("alternativeCaptcha not found");
    }
    return { token: value };
}

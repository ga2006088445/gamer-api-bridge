import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";

import fetch from "node-fetch";
import { JSDOM } from "jsdom";

import { getBaseCookie, getLoginApiUrl, getLoginPageUrl, getSocksProxyAgent, getUserAgent } from "./env-manager";

// 發送登入 API 可也接受帳號密碼的輸入函式
async function login(username: string, password: string) {
  const url = getLoginApiUrl();
  const userAgent = getUserAgent();
  const cookie = getBaseCookie();
  const agent = getSocksProxyAgent();

  const headers: Record<string, string> = {
    "User-Agent": userAgent,
    "Content-Type": "application/x-www-form-urlencoded",
  };

  cookie ? headers["Cookie"] = cookie : null;

  // 發送 HTTP POST form-data 請求, 回應此次請求的 SetCookie 回傳
  const { token: alternativeCaptcha } = await getAlternativeCaptcha();

  const body = new URLSearchParams();
  body.append("userid", username);
  body.append("password", password);
  body.append("autoLogin", "T");
  body.append("alternativeCaptcha", alternativeCaptcha);

  const response = await fetch(url, {
    method: "POST",
    headers,
    body,
    agent,
  });

  // 取得 Set-Cookie 的資料
  const setCookie = response.headers.get("set-cookie");
  if (!setCookie) {
    throw new Error("set-cookie not found");
  }
  return setCookie;
}



// 取得 alternativeCaptcha 的資料
async function getAlternativeCaptcha() {
  const loginPageUrl = getLoginPageUrl();
  const cookie = getBaseCookie();
  const agent = getSocksProxyAgent();

  const mozillaAgent = "Mozilla/5.0"
  const windowsNT = "Windows NT 10.0; Win64; x64"
  const chromeAgent = "Chrome/120.0.0.0"
  const appleWebKitAgent = "AppleWebKit/537.36 (KHTML, like Gecko)"
  const safariAgent = "Safari/537.36"
  const userAgent = `${mozillaAgent} (${windowsNT}) ${appleWebKitAgent} ${chromeAgent} ${safariAgent}`

  const headers: Record<string, string> = {
    "User-Agent": userAgent
  };
  cookie ? headers["Cookie"] = cookie : null;

  // 發送 HTTP 請求
  const response = await fetch(loginPageUrl, {
    headers,
    agent,
  });
  const body = await response.text();

  // 使用 jsdom 解析 HTML
  const dom = new JSDOM(body);
  const document = dom.window.document;

  // 獲取特定元素的 value
  const value = document.querySelector<HTMLInputElement>('input[name="alternativeCaptcha"]')?.value;
  if (!value) {
    throw new Error("alternativeCaptcha not found");
  }
  return { token: value };
}



const app = new Elysia()
  .use(
    swagger({
      path: "/swagger",
      documentation: {
        info: { version: process.env.VERSION ?? "0.0.0", title: "china-vpn" },
      }
    }),
  )
  .get("/getToken", getAlternativeCaptcha)
  .post("/login", async ({ body }) => {
    const { username, password } = body;
    const cookie = await login(username, password);
    return { cookie };
  }, {
    body: t.Object({
      username: t.String(),
      password: t.String(),
    })
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);

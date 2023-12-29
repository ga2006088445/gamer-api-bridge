# gamer-api-bridge

本專案提供一系列 gamer 相關 REST API 來實現特定功能，包括取得登入時一次性驗證碼、獲取 anime 今日答案，以及用戶登入取回 Cookie。

## 環境建置 & 啟動

本專案需要 Node.js & Bun 環境。
clone 專案後啟動順序：

```bash
bun install
bun dev
```

### API 文件

```bash
bun dev
```
查看 `http://localhost:3000/swagger`

### 環境變數
可透過 建立 `.env` 檔案在開發時設定環境變數

- `SOCKS_PROXY_URL`: 代理伺服器地址，格式為 socks5://????。
- `CLOUDFLARE_COOKIE`: Cloudflare 保護的 cookie 值。
- `LOGIN_PAGE_URL`: 登入頁面的 URL。
- `LOGIN_API_URL`: 登入 API 的 URL。
- `HOME_PAGE_URL`: 首頁的 URL。
- `BLOG_PAGE_URL`: Blog 頁面的 URL。
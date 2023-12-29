# docker build .  設定 VERSION 範例
# docker build . --build-arg VERSION=0.0.1 -t gamer-api-bridge:0.0.1

# docker run 範例
# docker run --rm \
#   -d -p 13000:3000 \
#   -e NODE_ENV="production" \
#   -e SOCKS_PROXY_URL="socks5://123.456.789.000:12345" \
#   -e CLOUDFLARE_COOKIE='XXXX' \
#   -e LOGIN_PAGE_URL="https://aaap" \
#   -e LOGIN_API_URL="https://aaahp" \
#   -e HOME_PAGE_URL="https://aaaw/" \
#   -e BLOG_PAGE_URL="https://aaaue" \
#   -e TZ="Asia/Taipei" \
#   --name gamer-api-bridge gamer-api-bridge:0.0.1

# 使用 ARG 將 Project VERSION 設置為預設值
ARG VERSION=0.0.0

FROM oven/bun:1 as base

# 將 ARG 的版本抓進 image 中
ARG VERSION
ENV VERSION=${VERSION}

WORKDIR /usr/src/app

# 安裝 套件
FROM base AS install
WORKDIR /temp/prod

COPY package.json bun.lockb .
RUN bun install --frozen-lockfile --production

# Test
FROM base AS release
ENV NODE_ENV=production

COPY --from=install /temp/prod/node_modules node_modules
COPY . .

RUN bun test

# run the app
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "src/index.ts" ]

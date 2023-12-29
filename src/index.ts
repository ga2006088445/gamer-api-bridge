import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";

import { getAlternativeCaptcha, login } from "./login";
import { getAnswerToday } from "./parse-blog";

const app = new Elysia()
  .use(
    swagger({
      path: "/swagger",
      documentation: {
        info: { version: process.env.VERSION ?? "0.0.0", title: "gamer-api-bridge" },
      }
    }),
  )
  .get("/getToken", getAlternativeCaptcha)
  .get("/getAnswerToday", async () => {
    const result = await getAnswerToday();
    return result;
  })
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

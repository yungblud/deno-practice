import { Application } from "https://deno.land/x/oak/mod.ts";
import api from "./source/api/index.ts"

const app = new Application()

app.use(async (ctx, next) => {
  await next()
  const rt = ctx.response.headers.get("X-Response-Time");
  console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
})

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set("X-Response-Time", `${ms}ms`);
})

app.use(api.todo.routes())
app.use(api.todo.allowedMethods())

await app.listen({ port: 8000 });

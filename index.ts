// import { listenAndServe } from "https://deno.land/std@v0.51.0/http/server.ts";
// import {
//   createRouter,
//   AugmentedRequest,
//   createRouteMap,
//   textResponse,
//   jsonResponse,
//   streamResponse,
//   NotFoundError
// } from "https://deno.land/x/reno@v1.0.0-alpha.1/reno/mod.ts";
// import { todo, todos, createErrorResponse } from "./source/api/index.ts"
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

// app.use(async (ctx) => {
  // const result = await ctx.request.body({
  //   contentTypes: {
  //     text: ["application/json"]
  //   }
  // })
  // result.type
// })

app.use(api.todo.routes())
app.use(api.todo.allowedMethods())

// app.use((ctx) => {
//   ctx.response.body = "Hello World!";
// });

await app.listen({ port: 8000 });

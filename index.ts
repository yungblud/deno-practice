import { listenAndServe } from "https://deno.land/std@v0.51.0/http/server.ts";
import {
  createRouter,
  AugmentedRequest,
  createRouteMap,
  textResponse,
  jsonResponse,
  streamResponse,
  NotFoundError
} from "https://deno.land/x/reno@v1.0.0-alpha.1/reno/mod.ts";
import { todo, todos, createErrorResponse } from "./source/api/index.ts"

const SERVER_HOST = "0.0.0.0:8080"

export const routes = createRouteMap([
  ["/api/todos", todos],
  ["/api/todo/?(\\d+$)", todo]
]);

const router = createRouter(routes);

(async () => {
  console.log("Listening for requests...");

  await listenAndServe(
    SERVER_HOST,
    async (req) => {
      try {
        const res = await router(req);
        return req.respond(res);
      } catch (e) {
        const statusCode = e instanceof NotFoundError ? 404 : 500
        return req.respond({
          status: statusCode,
          ...createErrorResponse(statusCode, e)
        })
      }
    },
  );
})();
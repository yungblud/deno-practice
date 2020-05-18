import {
    // createRouter,
    AugmentedRequest,
    // createRouteMap,
    // textResponse,
    jsonResponse,
    JsonRequest
    // streamResponse,
  } from "https://deno.land/x/reno@v1.0.0-alpha.1/reno/mod.ts";
//   import { readJson, readJsonSync } from "https://deno.land/std/fs/mod.ts";
import { methodNotAllowedResponse } from "./handleError.ts"
import data from "./data.ts"

// const data = [
//     {
//         id: 1,
//         title: "Laundry"
//     },
//     {
//         id: 2,
//         title: "Walking"
//     },
//     {
//         id: 3,
//         title: "Working"
//     },
//     {
//         id: 4,
//         title: "Tea Time"
//     }
// ]

export const todos = () => {
    const { readFileSync } = Deno
    return jsonResponse([
        {
            id: 1,
            title: "Laundry"
        },
        {
            id: 2,
            title: "Walking"
        },
        {
            id: 3,
            title: "Working"
        },
        {
            id: 4,
            title: "Tea Time"
        }
    ])
}

export const todo = (req: JsonRequest) => {
    const { writeFileSync } = Deno
    const [id] = req.routeParams
    const { url, method } = req
    switch (method) {
        case "GET":
            const filteredTodo = data.filter((todoItem) => todoItem.id === +id)
            return jsonResponse({
                todo: filteredTodo.length === 1 ? filteredTodo[0] : null
            })
        case "POST":
            return jsonResponse({
                hello: "world"
            })
        default:
            return methodNotAllowedResponse(url, method)
    }
}



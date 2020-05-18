import {
    // createRouter,
    AugmentedRequest,
    // createRouteMap,
    // textResponse,
    jsonResponse,
    // streamResponse,
  } from "https://deno.land/x/reno@v1.0.0-alpha.1/reno/mod.ts";

const data = [
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
]

export const todos = () => {
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

export const todo = (req: Pick<AugmentedRequest, "routeParams">) => {
    const [id] = req.routeParams
    const filteredTodo = data.filter((todoItem) => todoItem.id === +id)
    return jsonResponse({
        todo: filteredTodo.length === 1 ? filteredTodo[0] : null
    })
}
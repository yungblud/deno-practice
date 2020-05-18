import {
    jsonResponse,
    textResponse
} from "https://deno.land/x/reno@v1.0.0-alpha.1/reno/mod.ts";

export const methodNotAllowedResponse = (url: string, method: string) => {
    return {
        status: 405,
        ...textResponse(`Method ${method} not allowed for ${url}`)
    }
}

export const createErrorResponse = (statusCode: number, e: any) => {
    return jsonResponse({
        statusCode,
        e: e.toString()
    })
}

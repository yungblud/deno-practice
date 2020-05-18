import {
    jsonResponse,
} from "https://deno.land/x/reno@v1.0.0-alpha.1/reno/mod.ts";

export const createErrorResponse = (statusCode: number, e: any) => {
    return jsonResponse({
        statusCode,
        e: e.toString()
    })
}

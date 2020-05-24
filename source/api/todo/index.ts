import { Router } from "https://deno.land/x/oak/mod.ts"
import { create, read, list, toggleIsDone, deleteTodoById } from "./todo.ctrl.ts"
// import { Todo } from "../../models/todo.ts"

const router = new Router()

router.get("/api/todo", list)
router.get("/api/todo/:id", read)
router.post("/api/todo", create)
router.patch("/api/todo/:id", toggleIsDone)
router.delete("/api/todo/:id", deleteTodoById)

export default router
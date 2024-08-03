import {Router} from "express"
import {addThread, getThread, deleteThread} from "../controllers/thread.controller.js"
import { requireAuth } from "../middlewares/requireAuth.js"

const router = Router()

router.route("/addThread").post(requireAuth, addThread)
router.route("/getThread").get(getThread)
router.route("/deleteThread").delete(requireAuth, deleteThread)

export default router

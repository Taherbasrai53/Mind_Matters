import {Router} from "express"
import {addThread, getThread} from "../controllers/thread.controller.js"
import { requireAuth } from "../middlewares/requireAuth.js"

const router = Router()

router.route("/addThread").post(requireAuth, addThread)
router.route("/getThread").get(requireAuth, getThread)

export default router

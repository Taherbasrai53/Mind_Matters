import {Router} from 'express'
import {getAll, createRoom} from '../controllers/room.controller.js'
import { requireAuth } from '../middlewares/requireAuth.js'

const router= Router()

router.route('/getAll').get(getAll)
router.route('/createRoom').post(requireAuth, createRoom)

export default router


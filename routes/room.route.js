import {Router} from 'express'
import {getAll, createRoom, deleteRoom, updateRoom, Upvote} from '../controllers/room.controller.js'
import { requireAuth } from '../middlewares/requireAuth.js'
import {upload} from '../middlewares/multer.js'

const router= Router()

router.route('/getAll').get(getAll)
router.route('/createRoom').post(requireAuth, upload.single("ThumbNail"), createRoom)
router.route('/deleteRoom').delete(requireAuth, deleteRoom)
router.route('/updateRoom').put(requireAuth, upload.single("ThumbNail"), updateRoom)
router.route('/upvote').put(requireAuth, Upvote)

export default router


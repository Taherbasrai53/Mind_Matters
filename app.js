import express, { urlencoded } from "express"
const app= express()

import cors from "cors"
import cookieParser from "cookie-parser"

app.use(cors({origin: process.env.CORS_ORIGIN}))

app.use(express.json({limit:"16kb"}))

app.use(express.urlencoded({extended:true, limit:"16kb"}))

app.use(express.static("public"))

app.use(cookieParser())



// import router

import userRouter from "./routes/user.route.js"

app.use("/users", userRouter)

import roomRouter from './routes/room.route.js'

app.use("/rooms", roomRouter)

import threadRouter from './routes/thread.route.js'

app.use("/threads", threadRouter)

export { app } 
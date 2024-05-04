import express, { urlencoded } from "express"
const app= express()

import dotenv from "dotenv"

dotenv.config({path: './env'})

import connectDB from "./db/index.js"

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

connectDB()
.then(()=>{

    app.on("error", (error)=>{
        console.log("error!!!", error)
        throw error
    })

    app.listen(process.env.PORT, ()=>{
        console.log("the app is listening on ", process.env.PORT)
    })
})
.catch((err)=>{
    console.log("there was an error while connecting to the DB ", err)
})

export { app } 
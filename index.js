import dotenv from "dotenv"

dotenv.config({path: './env'})

import connectDB from "./db/index.js"
import {app} from "./app.js"
// import express from 'express'
// const app = express()

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
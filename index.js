import dotenv from "dotenv"

dotenv.config({path: './env'})

import connectDB from "./db/index.js"



connectDB()
.then(()=>{
    app.listen(process.env.PORT, ()=>{
        console.log("the app is listening on ", process.env.PORT)
    })
})
.catch((err)=>{
    console.log("there was an error while connecting to the DB ", err)
})
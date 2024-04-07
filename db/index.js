import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"



const db_connect= async ()=>{
    try{
        const connectionInstance=await mongoose.connect(`${process.env.CONNECTION_STRING}//${DB_NAME}`)
        console.log(`\n MONGODB connected !! DB Host ${connectionInstance.connection.host}`)
    }
    catch(ex)
    {
        console.log("exception in db connect "+ex)
        process.exit(1)
    }
}

export default db_connect
import mongoose from "mongoose"
import jwt from"json-web-token"

let userSchema= new mongoose.Schema({
    UserName:{
        type:String, 
        required:[true, "UserName is required"],
        unique:[true, "User already exists"], 
        index:true,
        trim:true
    },
    Password:{
        type:String,
        required:[true, "UserName is required"]        
    },
    ProfilePic:{
        type:String
    },
    RoomsCreated:[
        {
            type:mongoose.schema.type.ObjectId,
            ref:"Room"
        }
    ],
    UserType:{
        type:String,
        enum:['Professional', 'Laymen'],
        default: 'Laymen'
    },
    Rank:{
        type:String, 
        enum:['Private'],
        default: 'Private'
    }
}, 
{
    timestamps:true
})

mongoose.methods.checkPassword= function (password)
{
    return this.password===password
}

mongoose.methods.generateToken = function()
{
    jwt.sign(
        {
            _id:this._id,
            type:this.UserType
        },
        process.env.ACCESS_TOKEN_SECRET_KEY,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

export const User= mongoose.model("User", userSchema)
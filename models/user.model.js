import mongoose from "mongoose"
import jwt from"jsonwebtoken"

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
        required:[true, "Password is required"]        
    },
    ProfilePic:{
        type:String
    },
    RoomsCreated:[
        {
            type:mongoose.Schema.Types.ObjectId,
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

userSchema.methods.checkPassword= function (password)
{
    return this.Password===password
}

userSchema.methods.generateToken = function()
{
    return jwt.sign(
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
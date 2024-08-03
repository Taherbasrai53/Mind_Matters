import {asyncHandler} from "../utils/asyncHandler.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import { uploadOnAWS } from "../utils/S3Util.js"
import fs from "fs"

let registerUser= asyncHandler( async(req, res)=>{
    
    const {UserName, Password}= req.body;
    
    if(
        [UserName, Password].some((feild)=> feild?.trim()==="")
    ){
        //throw new ApiError(400, "UserName and Password are required fields")
        res.status(406).json({
            success:false,
            message:"Please fill all required feilds"
        })
    }
    
    
    let existingUser= await User.findOne({UserName:UserName})
    //console.log(existingUser)

    if(existingUser!==null)
    {
        return res.status(400).json({
            success:false,
            message:"A user with the existing username already exists"
        })
        
    }
    const profilePicLocalPath=req.file?.path;
    let ProfilePic="";
    
    if(profilePicLocalPath)
    {
        ProfilePic=await uploadOnAWS(profilePicLocalPath)  
        
        fs.unlinkSync(profilePicLocalPath)
    }
    
    
    let savedUser= await User.create({
        UserName: UserName,
        Password:Password,
        ProfilePic:ProfilePic.Location        
    })


    return  res.status(200).json({
        id: savedUser._id,
        success:true,
        message:"new User is created"      
    })
})


let loginUser= asyncHandler(async (req, res)=>{

    // get the variables from the front end

    let {UserName, Password}= req.body;

    //check if they are not empty

    if(
        [UserName, Password].some((feild)=> feild?.trim()==="")
    )
    {
        res.status(400).json({
            success:false,
            message:"Please enter the Username and Password"
        })
    }

    // check if the user credentials are correct

    let foundUser= await User.findOne({
        $and:[{UserName:UserName}, {Password:Password}]
    }).select(" -password").populate("RoomsCreated")

    if(!foundUser)
    {
        res.send(403).json({
            success:false,
            message:"the username or password is not correct"
        })
    }

    const token= foundUser.generateToken();    
    //console.log(token)

    res.status(200).json({        
        token: token,
        User:foundUser
    })
})

export {registerUser, loginUser}
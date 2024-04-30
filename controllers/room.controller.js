import { asyncHandler } from "../utils/asyncHandler.js";
import {Room} from "../models/room.model.js"
import {User} from "../models/user.model.js"

const getAll= asyncHandler(async (req, res)=>{

    let rooms= await Room.find()

    res.status(200).json(rooms)
})

const createRoom= asyncHandler(async (req, res)=>{

    let {RoomName}= req.body;

    if(RoomName===null)
    {
        return res.status(400).json({
            success:false, 
            message:"please enter a valid room name"
        })
    }
    let room= await Room.create({
        Owner:req.User._id,
        RoomName:RoomName
    })

    //et user= await User.findOne({_id:req.User._id});
    //user.RoomsCreated.add(room._id);

    req.User.RoomsCreated.push(room._id);

    await req.User.save()

    return res.status(200).json({
        id:room._id,
        success:true,
        message:"room created successfully"
    })
})


export {getAll, createRoom}
import { asyncHandler } from "../utils/asyncHandler.js";
import {User} from "../models/user.model.js"
import {Room} from "../models/room.model.js"


const search= asyncHandler(async (req, res)=>{

    const {query}= req.query;

    if(query==="" || query===null)
    {
        return res.status(200).json([{}, {}])
    }

    let users= await User.find({$or:[{UserName:{$regex:query, $options:'i'}}, {ProfilePic:{$regex:query, $options:'i'}}]}).select("UserName ProfilePic")
    let rooms= await Room.find({RoomName:{$regex:query, $options:'i'}}).select("RoomName ThumbNail UpVotes DownVotes")

    return res.status(200).json([
        users, rooms
    ])
})

export {search}
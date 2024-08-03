import { asyncHandler } from "../utils/asyncHandler.js";
import {Room} from "../models/room.model.js"
import {Thread} from "../models/thread.model.js"
import {User} from "../models/user.model.js"
import {Activity} from "../models/activity.model.js"
import { deleteFromAWS, uploadOnAWS } from "../utils/S3Util.js";
import mongoose from "mongoose"
import fs from "fs"
//import {db} from "mongodb"
//import { Aggregate } from "mongoose";

const getAll= asyncHandler(async (req, res)=>{

    //const {skip}= Number(req.query) || 0;
    let skip=Number(req.query.skip) || 0;
    
    //let rooms= await Room.find().sort("-createdAt").skip(skip).limit(15)       
    let rooms= await Room.aggregate([
        {
            $sort:{
                createdAt:-1
            }
        },
        {
            $skip: skip
        },
        {
            $limit: 15
        },
        {
            $lookup:{
                from: "users",
                localField:"Owner",
                foreignField:"_id",
                as:"ownerDetails"
            }
        },
        {
            $lookup:{
                from:"threads",
                localField:"_id",
                foreignField:"RoomId",
                as:"comments"
            }
        },
        {
            $lookup:{
                from:"activities",
                let:{userId:"$Owner", roomId:"$_id"},
                pipeline:[
                    {
                        $match:{
                            $expr:{
                                $and:[
                                    {$eq:["$PerformedBy", "$$userId"]},
                                    {$eq:["$RoomId", "$$roomId"]},
                                    {$eq:["$Type", "Room"]}
                                ]
                            }
                        }
                    }
                ],
                as: "userActivities"
            }
        },
        {
            $addFields:{
                ownerName:{
                    $arrayElemAt: ["$ownerDetails.UserName", 0]
                },
                ownerPP:{
                    $arrayElemAt:["$ownerDetails.ProfilePic", 0]
                },
                commentsCount:{
                    $size: "$comments"
                },
                isUpvote:{
                    $cond: {
                        if: { $eq: [{ $arrayElemAt: ["$userActivities.Operation", 0] }, "Liked"] },
                        then: true,
                        else: false
                    }
                },
                isDownVote:{
                    $cond:{
                        if:{$eq:[{$arrayElemAt:["$userActivities.Operation", 0]}, "Disliked"]},
                        then: true,
                        else:false
                    }
                }
            }
        },
        {
            $project:{
                userActivities:0,
                ownerDetails:0,
                __v:0,
                comments:0                
            }
        }
    ])


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

    let localFilePath=req.file?.path
    let ThumbNail=""
    console.log("req.filr", req.file);
    if(localFilePath)
    {        
        let ret= await uploadOnAWS(localFilePath)
        ThumbNail=ret.Location
        fs.unlinkSync(localFilePath)        
    }
    //console.log("User", req.User)
    let room= await Room.create({
        Owner:req.User._id,
        RoomName:RoomName,
        ThumbNail
    })
    // console.log("hello", room)
    if(!room)
    {
        res.status(500).json({
            message:"something went wrong"
        })
    }

    //et user= await User.findOne({_id:req.User._id});
    //user.RoomsCreated.add(room._id);

    req.User.RoomsCreated.push(room._id);

    await req.User.save()

    return res.status(200).json({
        // id:room._id,
        success:true,
        message:"room created successfully"
    })
})

const Upvote= asyncHandler(async (req, res)=>{
    let {_id, action}= req.body;
    _id= new mongoose.Types.ObjectId(_id)
    let UserId= req.User._id;

    if(!_id)
    {
        return res.status(400).json({
            success:false, 
            message:"please enter a valid id"
        })
    }
    if(action===null || action===undefined)
    {
        return res.status(400).json({
            success:false, 
            message:"please select a valid action"
        })
    }
    let activityId= await Activity.findOne({ PerformedBy: UserId, RoomId: _id })
    if(activityId)
    {
        console.log("id", activityId)
        await Activity.findByIdAndDelete({_id:activityId._id});
    }

    let votes= await Room.findOne({_id}).select("UpVotes DownVotes");
    let addAct={};
    let LikeCount=votes.UpVotes;
    let DownCount=votes.DownVotes;

    switch(action){
        case 1:
            LikeCount+=1;
            addAct={
                Type:"Room",
                RoomId:_id,
                Operation:"Liked",
                PerformedBy:UserId
            }
            break;
        case 2:
            DownCount+=1
            addAct={
                Type:"Room",
                RoomId:_id,
                Operation:"Disliked",
                PerformedBy:UserId
            }
            break;
        case 3:
            LikeCount-=1
            break;
        case 4:
            DownCount-=1
            break;
        case 5:
            DownCount-=1;
            LikeCount+=1;
            addAct={
                Type:"Room",
                RoomId:_id,
                Operation:"Liked",
                PerformedBy:UserId
            }
            break;
        case 6:
            DownCount+=1
            LikeCount-=1
            addAct={
                Type:"Room",
                RoomId:_id,
                Operation:"Disliked",
                PerformedBy:UserId
            }
            break;        
    }         
        
    await Room.findByIdAndUpdate({_id}, {UpVotes: LikeCount, DownVotes:DownCount});

    if (addAct.Type && addAct.PerformedBy) { // Ensure required fields are present
        let activity = await Activity.create(addAct);
    }  

    return res.status(200).json({
        success:true, 
        message:"Room upvoted successfully" 
    })

})

const updateRoom = asyncHandler(async (req, res)=>{
    let {_id, RoomName}= req.body;
    //console.log(RoomName)

    let UserId= req.User._id

    if(RoomName===null || RoomName==="")
    {
        return res.status(400).json({
            success:false, 
            message:"please enter a valid room name"
        })
    }

    _id= typeof _id=== mongoose.Types.ObjectId? _id: new mongoose.Types.ObjectId(_id)

    //console.log(_id)

    let room= await Room.findOne({_id: _id, Owner:UserId})

    if(!room)
        {
            return res.status(400).json({
                success:false, 
                message:"no such room exists"
            })
        }

    let localFilePath=req.file?.path
    
    if(localFilePath)
    {
        let ret= await uploadOnAWS(localFilePath)
        let ThumbNail=ret.Location
        fs.unlinkSync(localFilePath)
        await deleteFromAWS(room.ThumbNail)


        await Room.findByIdAndUpdate({_id}, {RoomName, ThumbNail})
       
    }
    else
    {
        await Room.findByIdAndUpdate({_id}, {RoomName})
    }

    return res.status(200).json({
        success:true, 
        message:"Room updated successfully"
    })
})

const deleteRoom= asyncHandler(async (req, res)=>{
    let {id}=req.body;

    let UserId= req.User._id

    if(id==null || id=="")
    {
        return res.status(400).json({
            success:false,
            message:"please send a valid Id"
        })
    }    
    
    id=new mongoose.Types.ObjectId(id)
    


    let room= await Room.findOne({_id:id, Owner:UserId})

    if(!room)
    {
        return res.status(400).json({
            success:false, 
            message:"no such room exists"
        })
    }
    
    if(room.ThumbNail!=="")
    {
        await deleteFromAWS(room.ThumbNail)
    }    

    let deletedRoom=await Room.deleteOne({ _id: id });
    let deletedThreads=await Thread.deleteMany({RoomId:id});
    

    if(deletedRoom.count==0)
    {
        return res.status(400).json({
            success:false,
            message:"something went wrong plz try again later"
        })
    }

    return res.status(200).json({
        success:true,
        message:"The room has been deleted successsfully"
    })

})


export {getAll, createRoom, updateRoom, deleteRoom, Upvote}
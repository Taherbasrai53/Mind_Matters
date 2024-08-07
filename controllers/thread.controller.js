import {Thread} from "../models/thread.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import mongoose from "mongoose";

const addThread= asyncHandler(async (req, res)=>{

    let {RoomId, ParentId, Value}= req.body;

    if([RoomId, Value].some((item)=> item==""?true:false))
    {
        return res.status(400).json({
            success:false,
            message:"please enter all required fields"
        })
    }

    let newThread= await Thread.create({
        UserId:req.User._id,
        RoomId:RoomId,
        ParentId:ParentId,
        Value:Value
    })



    return res.status(200).json({
        success:true, 
        message:"thread added succesfully"
    })
})

const getThread= asyncHandler(async (req, res)=>{
    let roomId= req.query.id

    if(roomId==null || roomId.length==0)
    {
        return res.status(400).json({
            success:false, 
            message:"Please enter a valid room Id"
        })
    }

    //let threads= await Thread.find({RoomId:roomId}).lean()    
    //console.log(threads[0]) 

    let threads= await Thread.aggregate([
        {
            $match:{
                RoomId:new mongoose.Types.ObjectId(roomId)
            }
        },
        {            
            $lookup:{
                from: "users",
                localField: "UserId",
                foreignField:"_id",
                as:"userDetails"
            }
        },
        {
            $addFields:{
                OwnerName:{
                    $arrayElemAt:["$userDetails.UserName", 0]
                },
                OwnerPP:{
                    $arrayElemAt:["$userDetails.ProfilePic", 0]
                }
            }
        },
        {
            $project:{
                userDetails:0,
                __v:0
            }
        }
    ])

    //console.log(threads)
    if(threads.length==0)
    {
        return res.status(200).json([]);
    }

    const hm= new Map();

    threads.forEach((t)=>{
        if(t.ParentId===null)
        {
            if(!hm.has('x'))
            {
                hm.set('x', []);
            }
            let templs=hm.get('x')
            templs.push(t);
            hm.set('x', templs);
        }
        else
        {
            if(!hm.has(t.ParentId.toString()))
            {
                hm.set(t.ParentId.toString(), []);
            }
            let templs=hm.get(t.ParentId.toString());
            templs.push(t);

            hm.set(t.ParentId.toString(), templs)
        }   
    })  
    //console.log(hm)
    //console.log(hm.has(hm.get('x')[0]._id));

    let result=  dfs(hm, 'x');
        
    //console.log(result);

    return res.status(200).json(
        result
    )
})

const dfs=  (hm, key)=>{

    if(!hm.has(key))
    {
        return [];
    }
    //console.log("hello")
    const ls= []

    hm.get(key).forEach((e)=>{
        let temp=  dfs(hm, e._id.toString());
        console.log(temp);
        e.children=temp;

        ls.push(e);
    })

    return ls;
}

const deleteThread= asyncHandler(async (req, res)=>{

    let{id}= req.body
    let UserId= req.User._id;

    if(id==null || id==0)
    {
        return res.status(400).json({
            success:false, 
            message:"please send a valid id"
        })
    }

    id=new mongoose.Types.ObjectId(id)

    let thread= await Thread.findById({_id:id})

    if(!thread)
    {
        return res.status(400).json({
            success:false, 
            message:"no thread found"
        })
    }


    let deletedThread= await Thread.deleteOne({_id:id, UserId: UserId})

    if(deletedThread.count==0)
    {
        return res.status(400).json({
            success:false, 
            message:"something went wrong please try again later"
        })
    }

    return res.status(200).json({
        success:true, 
        message:"thread deleted successfully"
    })
})


export {addThread, getThread, deleteThread}
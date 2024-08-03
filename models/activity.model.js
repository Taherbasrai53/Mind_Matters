import mongoose from 'mongoose'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'

const activitySchema= new mongoose.Schema({

    Type:{
        type:String,
        enum:["Room", "Thread"],
        required:true
    },
    RoomId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Room',        
    },
    ThreadId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Thread',
    },
    Operation:{
        type:String, 
        enum:["Liked", "Disliked", "AddedThread", "RepliedTo"]
    },
    PerformedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
}, 
{
    timestamps:true
})


mongoose.plugin(mongooseAggregatePaginate)

export const Activity= mongoose.model("Activity", activitySchema)
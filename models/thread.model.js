import mongoose from 'mongoose'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'


let threadSchema= new mongoose.Schema(
    {
        UserId:{
            type:mongoose.Schema.Types.ObjectId, 
            ref:'User',
            required:true
        },
        RoomId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Room',
            required:true
        },
        ParentId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Thread',
            index:true
        },
        Value:{
            type:String,
            trim:true,
            required:true
        },
        Likes:{
            type:Number,
            default:0
        }
    },
    {
        timestamps:true
    }
)

mongoose.plugin(mongooseAggregatePaginate)

export const Thread= mongoose.model("Thread", threadSchema)
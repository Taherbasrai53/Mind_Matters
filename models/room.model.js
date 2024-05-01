import mongoose from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"


let roomSchema= new mongoose.Schema(
    {
        Owner:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        RoomName:{
            type:String,
            required:true,
            index:true,
            trim:true
        },
        ThumbNail:{
            type:String            
        },
        UpVotes:{
            type:Number,
            default:0
        },
        DownVotes:{
            type:Number,
            default:0
        }
    },
    {
        timestamps:true
    }
)

mongoose.plugin(mongooseAggregatePaginate)

export const Room= mongoose.model("Room", roomSchema)
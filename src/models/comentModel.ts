import mongoose,{Document,Schema} from "mongoose";

interface Icomment{
    PollId:Schema.Types.ObjectId,
    comment:{
        userId:Schema.Types.ObjectId,
        text:string,
        createdBy:string,
    }
}


const Commentschema=new mongoose.Schema<Icomment>({

    PollId:{
        type:Schema.Types.ObjectId,
        ref:"Poll",
        required:true,
    },
    comment:[{
        userId:{
            type:Schema.Types.ObjectId,
            ref:"USER",
            required:true,
        },
        text:{
            type:String,
            required:true,
        },
        createdBy:{
            type:String,
            required:true,
        }
    }]
})


export const Comment= mongoose.model<Icomment>("Comment",Commentschema);
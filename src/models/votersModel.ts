import mongoose ,{Document,Mongoose,Schema}from "mongoose";


interface IVOTES{
    userId:Schema.Types.ObjectId,
    pollId:Schema.Types.ObjectId,
    optionId:Schema.Types.ObjectId,
}




const VoterSchema=new mongoose.Schema<IVOTES>({

    userId:{
        type:mongoose.Schema.ObjectId,
        ref:"USER",
        required:true,
    },
    pollId:{
        type:mongoose.Schema.ObjectId,
        ref:"Poll",
        required:true,
    },
    optionId:{
             type:mongoose.Schema.ObjectId,
             required:true
    }
},{timestamps:true});

const Voter=mongoose.model("Voter",VoterSchema);

export default Voter;


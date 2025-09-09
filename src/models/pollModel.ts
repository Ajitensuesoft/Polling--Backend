import mongoose,{Document,Schema} from "mongoose";


interface IOPTION{
    id:string,
    text:string,
    votes:Schema.Types.ObjectId[];
    name:string,
}

interface IPOLL{
    userId:Schema.Types.ObjectId;
    createdBy:string;
    Question:string;
    Option:IOPTION[];
}


const voteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "USER",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

const optionSchema=new mongoose.Schema<IOPTION>({
   
    text:{
        type:String,
        required:true,
    },
    // votes:[{
    //     type:mongoose.Schema.ObjectId,
    //     ref:"USER"
    // }],
    // name:{
    //     type:String
    // }
     votes: [voteSchema], 
})

const PollSchema=new mongoose.Schema<IPOLL>({

    userId:{
        type:mongoose.Schema.ObjectId,
        ref:"USER",
        required:true,
    },
    createdBy:{
        type:String,
        required:true,
    },
    Question:{
        type:String,
        required:true,
    },
    Option:{
        type:[optionSchema],
    },

},{timestamps:true});



const Poll=mongoose.model<IPOLL>("Poll",PollSchema);

export default Poll;
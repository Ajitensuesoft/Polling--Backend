import Poll from "../models/pollModel";
import Voter from "../models/votersModel";
import type { JwtPayload } from "jsonwebtoken";
import cron from "node-cron";
import { Comment } from "../models/comentModel";

import { Parser } from "json2csv";


// cron.schedule("* * * * *", async () => {
//   console.log("corn running");
//   try {
//     const result = await Poll.deleteMany({ ExpiredAt: { $lte: new Date() } });
//     console.log(` Expired tasks removed: ${result.deletedCount}`);
//   } catch (err) {
//     console.error("Error cleaning tasks:", err);
//   }
// });
// cron.schedule("* * * * *", async () => {
//   const closed = await Poll.updateMany(
//     { expiresAt: { $lte: new Date() }, status: "open" },
//     { status: "closed" }
//   );

//   if (closed.modifiedCount > 0) {
//     io.emit("polls-closed"); 
//   }
// });


export const PollCreate = async (req: any, res: any) => {
  let userId: string = req.userId;
  let { createdBy, Question, Option,ExpiredAt } = req.body;
  console.log("PollCreate req.body:", req.body);

  if (!createdBy || !Question || !Option || !Array.isArray(Option)) {
    return res.status(400).json({ message: "all fields are required" });
  }

  try {
    const mappedOptions = Option.map((o: any) => ({
      text: o.value,
      votes: [],
      name:o.name
    }));

    const newPoll = new Poll({
      ExpiredAt,
      userId,
      createdBy,
      Question,
      Option: mappedOptions,
      status: "open"
    });

    const pollCreated = await newPoll.save();
       console.log("newPoll",pollCreated);
    return res.status(200).json({
      message: "Poll created successfully",
      data: {
        Poll: {
            _id: pollCreated._id,
            userId: pollCreated.userId,
            createdBy: pollCreated.createdBy,
            Question: pollCreated.Question,
            Option: pollCreated.Option,
            ExpiredAt:pollCreated.ExpiredAt,
            status:"open"
          
        }
      }
    });
  } catch (err) {
    console.log("PollCreate Error:", err);
    return res.status(500).json({ message: "internal server error" });
  }
};



export const AllPolls=async(req:any,res:any)=>{

    try{
        let allPolls=await Poll.find().lean();
        console.log("allPolls",allPolls);
        return res.status(200).json({
            message:"all Polls fetched successfully",
            data:allPolls
        })
    }
    catch(err){
        return res.status(500).json({
            message:"internal server error"
        })
    }
}



export const SinglePoll=async(req:any,res:any)=>{

    let id=req.params.id;
    console.log("id",id);
    try{
        let singlePoll=await Poll.find({userId:id}).lean();;
        console.log("singlePoll",singlePoll);
        return res.status(200).json({
            message:"single poll fetched successfully",
            data:singlePoll
        })
    }
    catch(err){
        return res.status(500).json({
            message:"internal server error"
        })
    }
}




export const PollVote = async (req: any, res: any) => {
  const { PollId, OptId, userId,name } = req.body;
  console.log("PollId, OptId, userId", PollId, OptId, userId,name);


  const userId1=req.userId as string;
  try {
    
    const poll = await Poll.findOne({ _id: PollId, "Option._id": OptId });
    if (!poll) {
      return res.status(404).json({ message: "Poll or option not found" });
    }

 const userId=userId1;
    const existingVote = await Voter.findOne({ pollId: PollId, userId });
    if (existingVote) {
      return res.status(400).json({ message: "User already voted for this poll" });
    }

    
    const newVoter = new Voter({ userId, pollId: PollId, optionId: OptId });
    await newVoter.save();

    
   let updatedPoll= await Poll.updateOne(
      { _id: PollId, "Option._id": OptId },
      { $push: { "Option.$.votes": { userId,name} } }
      
    );
console.log("updatedPoll",updatedPoll);
    return res.status(200).json({ message: "Vote recorded successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error", });
  }
};












export const CommentPoll=async(req:any,res:any)=>{

    let id=req.params.id;
    console.log("id",id);
    try{
        let singlePoll=await Poll.find({_id:id}).lean();;
        console.log("singlePoll",singlePoll);
        return res.status(200).json({
            message:"single poll fetched successfully",
            data:singlePoll
        })
    }
    catch(err){
        return res.status(500).json({
            message:"internal server error"
        })
    }
}






export const CreateComment=async(req:any,res:any)=>{
        const data=req.body;
        console.log("data",data);
        const {PollId,comment}=data;
        console.log("polldata",PollId,comment);
 console.log("commentCreated",PollId,comment);
        let {userId,text,createdBy}=comment;
        
  try{
      
    let freshComment=new Comment(
        {
            PollId,
            comment:[{
                userId,
                text,
                createdBy,
            }]
        }
    )

    let commentdata=await freshComment.save();
    console.log("commentdata",commentdata);
    return res.status(200).json({
        message:"comment created successfully",
        data:commentdata
    })
  

  }catch(err){
return res.status(500).json({
            message:"internal server error"
        })
  }
}








export const Allcomments=async(req:any,res:any)=>{

  try{

    let allcomments=await Comment.find().lean();
    console.log("allcomments",allcomments);
    return res.status(200).json({
        message:"all comments fetched successfully",
        data:allcomments
    })
  }
  catch(err:any){
    return res.status(500).json({
            message:"internal server error"
        })
  }
  }
  


  export const updateComment = async (req: any, res: any) => {
  const data = req.body;
  console.log("updatedatavia", data);

  try {
    let updatedata = await Comment.updateOne(
      { PollId: data.pollId, "comment._id": data.commentId }, 
      { 
        $set: { "comment.$.text": data.text } 
      }
    );

    console.log("updatedata", updatedata);
    return res.status(200).json({
      message: "comment updated successfully",
      data: updatedata,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({
      message: "internal server error",
    });
  }
};



export const deleteComment=async(req:any,res:any)=>{

  // let id=req.params.id;
  let id=req.params.id;
  console.log("id",id);
  let _id=id;
  try{
      let deletedata=await Comment.findByIdAndDelete(_id);
      console.log("deletedata",deletedata);
      return res.status(200).json({
          message:"comment deleted successfully",
          data:deletedata
      })
  }
  catch(err){
      return res.status(500).json({
          message:"internal server error"
      })
  }
}




// controllers/pollController.ts


export const exportAllPolls = async (req: any, res: any) => {
  try {
    const polls = await Poll.find().lean(); // get all polls
console.log("polls",polls);
    if (!polls || polls.length === 0) {
      return res.status(404).json({ message: "No polls found" });
    }

   
    const csvData: any[] = [];
console.log("csvData",csvData);
    polls.forEach((poll) => {
      poll.Option.forEach((opt) => {
        csvData.push({
          PollQuestion: poll.Question,
          PollCreatedBy: poll.createdBy,
          Option: opt.text,
          Votes: opt.votes.length, 
        });
      });
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(csvData);
    console.log("realcsv",csv);
    res.header("Content-Type", "text/csv");
    res.attachment("all_polls.csv");
    return res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

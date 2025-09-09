import Poll from "../models/pollModel";
import Voter from "../models/votersModel";
import type { JwtPayload } from "jsonwebtoken";



export const PollCreate = async (req: any, res: any) => {
  let userId: string = req.userId;
  let { createdBy, Question, Option } = req.body;

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
      userId,
      createdBy,
      Question,
      Option: mappedOptions
    });

    const pollCreated = await newPoll.save();

    return res.status(200).json({
      message: "Poll created successfully",
      data: {
        Poll: {
            _id: pollCreated._id,
            userId: pollCreated.userId,
            createdBy: pollCreated.createdBy,
            Question: pollCreated.Question,
            Option: pollCreated.Option
          
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
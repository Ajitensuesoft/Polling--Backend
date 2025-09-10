import express from "express";
import { Request,Response } from "express";
const routes=express.Router();


import {Signup,Login,Logout} from "../controllers/User.controller"

import {isAuth} from "../middlewares/authMiddleware";
import {PollCreate,AllPolls,SinglePoll,PollVote,CommentPoll,CreateComment, Allcomments,updateComment,deleteComment,exportAllPolls}  from "../controllers/PollController";

routes.post("/signup",Signup);
routes.post("/login",Login);
routes.post("/logout",Logout);


routes.get("/me",isAuth,(req:Request,res:Response)=>{
    res.send("hey you are")
})


routes.post("/pollCreate",isAuth,PollCreate);
routes.get("/allPolls",isAuth,AllPolls);
routes.get("/singlePoll/:id",isAuth,SinglePoll);

//votes
routes.post("/votePoll",isAuth,PollVote);
routes.get("/commentPoll/:id",isAuth,CommentPoll);
routes.post("/createComment",isAuth,CreateComment);

routes.get("/allcomments",isAuth,Allcomments);

routes.put("/updatedComment",isAuth,updateComment)
routes.delete("/deleteComment/:id",isAuth,deleteComment)

routes.get("/csvdata",isAuth,exportAllPolls);
export default routes;
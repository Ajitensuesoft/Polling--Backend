import express from "express";
const app=express();
import dotenv from "dotenv";
import { connectDb } from "./config/db";
dotenv.config();
const PORT=process.env.PORT;
console.log("port",PORT);
import routes from "./routes/userRoutes";
import cors from "cors";
import cookieParser from "cookie-parser";

import http from "http";
import { Server } from "socket.io";
import cron from "node-cron";
import Poll from "./models/pollModel";


const server = http.createServer(app);

// export const io = new Server(server, {
//   cors: {
//     origin: "https://polling-frontend-pi.vercel.app",
//     credentials: true,
//   },
// });
// ["http://localhost:5173", "https://polling-frontend-ephz.vercel.app"]
export const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://polling-frontend-ephz.vercel.app"],
    credentials: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["Authorization", "Content-Type"],
  },
});



//votes socket

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);
  
  
  socket.on("vote", (data) => {
    console.log("Vote received:", data);
    
    
    io.emit("voteUpdate", data);
  });
  

  //for comment portion
 socket.on("newComment", (comment) => {
    console.log("New comment:", comment);
    io.emit("commentAdded", comment); 
  });

  socket.on("updateComment", (comment) => {
    console.log("Updated comment:", comment);
    io.emit("commentUpdated", comment); 
  });

  socket.on("deleteComment", (commentId) => {
    console.log("Deleted comment ID:", commentId);
    io.emit("commentDeleted", commentId); 
  });


  socket.on("disconnect", () => {
    console.log(" Client disconnected:", socket.id);
  });
});


cron.schedule("* * * * *", async () => {
  const closed = await Poll.updateMany(
    { ExpiredAt: { $lte: new Date() }, status: "open" },
    { status: "closed" }
  );

  if (closed.modifiedCount > 0) {
    io.emit("polls-closed"); 
  }
});



app.get("/",(req,res)=>{
  res.send("hello");
})


app.use(cors({
  origin: ["http://localhost:5173", "https://polling-frontend-ephz.vercel.app"], // allow local + deployed frontend
  credentials: true, // allow cookies
   methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Authorization', 'Content-Type'],
}));

app.use(cookieParser());
app.use(express.json());

connectDb();
app.use("/app/v1",routes);
server.listen(PORT,()=>{
console.log("app is listning",PORT)
})

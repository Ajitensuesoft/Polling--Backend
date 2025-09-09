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


const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "https://polling-frontend-pi.vercel.app",
    credentials: true,
  },
});



//votes socket

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);
  
  
  socket.on("vote", (data) => {
    console.log("Vote received:", data);
    
    
    io.emit("voteUpdate", data);
  });
  
  socket.on("disconnect", () => {
    console.log(" Client disconnected:", socket.id);
  });
});




app.get("/",(req,res)=>{
  res.send("hello");
})


app.use(cors({
  origin: ["http://localhost:5173", "https://polling-frontend-pi.vercel.app"], // allow local + deployed frontend
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

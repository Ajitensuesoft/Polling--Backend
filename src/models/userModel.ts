import mongoose,{Document,Schema} from "mongoose";


interface IUSER extends Document{
    name:string,
    email:string,
    password:string,
}



const userSchema=new mongoose.Schema<IUSER>({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    }
},{timestamps:true});



export const USER=mongoose.model<IUSER>("USER",userSchema);


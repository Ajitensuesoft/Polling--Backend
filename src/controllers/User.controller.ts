import {USER}from "../models/userModel";
import {Request,Response} from "express";
import jwt  from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET=process.env.JWT_SECRET  as string;



export const Signup=async(req:Request,res:Response)=>{
             let{name,email,password}=req.body;
             if(!name|| !email|| !password){
                return res.status(401).json({
                    message:"all fields are required"
                })
             }
    try{
           let exituser=await USER.findOne({email:email});
           if(exituser){
            return res.status(400).json({
                message:"user already exist",
            })
           }

           const hashPassword=await bcrypt.hash(password,10);

           if(!hashPassword){
            return res.status(500).json({
                message:"password not hashed"
            })
           }

           let newUser=new USER({
            name,
            email,
            password:hashPassword,
           })

           const userCreated=await newUser.save();
           console.log("userCreated",userCreated);

           return res.status(201).json({
            message:"Account created successfully",
            data:{
                user:{
                    name:userCreated.name,
                    email:userCreated.email,
                    id:userCreated._id
                }
            }
           })

    }
    catch(err){
return res.status(500).json({
    message:"internal server error"
})
    }
}



// export const Login=async(req:Request,res:Response)=>{
//           let {email,password}=req.body;
//           console.log("email,password",email,password);
//           if(!email || !password){
// return res.status(400).json({
//     message:"all fields are required"
// })
//           }

//     try{

//         const isExist=await USER.findOne({email:email});
//         console.log("isExist",isExist);
//         if(!isExist){
//             return res.status(401).json({
//                 message:"user not exist",
//             })
//         }

//         let isMatch=await bcrypt.compare(password,isExist.password);
//         console.log("isMatch",isMatch);
//         if(!isMatch){
//             return res.status(401).json({
//                 message:"invalid credatianls or password is incorrect",
                
//             })
//         }


//         let optionss={
//             id:isExist.id,
//             name:isExist.name,
//             email:isExist.email,
//         }


//         const token=jwt.sign(optionss,JWT_SECRET,{expiresIn:"3hr"});
// console.log("token",token);

//     //  const options: any = {
//     //   expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
//     //   httpOnly: true,
//     //   secure:process.env.NODE_ENV === "production",
//     //   sameSite:'none',
//     // };

//     const options = {
//   httpOnly: true,
//   secure: true, // Render = always https
//   sameSite: "none" as const,
//   expires: new Date(Date.now() + 3*24*60*60*1000),
// };


//         res.cookie("token",token,options).status(200).json({
//             message:"Account created successfully",
//             data:{
//                 user:{
//                     name:isExist.name,
//                     email:isExist.email,
//                     id:isExist._id,
//                 },
//                 token:token
//             }
//         })

//     }

//     catch(err){
// return res.status(500).json({
//     message:"internal server error"
// })    }
// }


export const Login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log("email,password", email, password);

  if (!email || !password) {
    return res.status(400).json({
      message: "all fields are required",
    });
  }

  try {
    const isExist = await USER.findOne({ email });
    console.log("isExist", isExist);

    if (!isExist) {
      return res.status(401).json({
        message: "user not exist",
      });
    }

    const isMatch = await bcrypt.compare(password, isExist.password);
    console.log("isMatch", isMatch);

    if (!isMatch) {
      return res.status(401).json({
        message: "invalid credentials or password is incorrect",
      });
    }

    const payload = {
      id: isExist.id,
      name: isExist.name,
      email: isExist.email,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "3h" });
    console.log("token", token);

    // ✅ Only return JSON (no cookies needed)
    return res.status(200).json({
      message: "Login successful",
      data: {
        user: {
          name: isExist.name,
          email: isExist.email,
          id: isExist._id,
        },
        token, // client will use this in Authorization header
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "internal server error",
    });
  }
};



export const Logout=async(req:Request,res:Response)=>{

    try{
          res.clearCookie("token").status(200).json({
            message:"Logout successfully",
          })
    }
    catch(err){
return res.status(500).json({
    message:"internal server error"
    
    
}) 
    }
}
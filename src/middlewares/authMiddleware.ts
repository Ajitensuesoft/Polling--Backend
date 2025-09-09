// import { Request, Response, NextFunction } from "express";
// import jwt, { JwtPayload } from "jsonwebtoken";
// import dotenv from "dotenv";

// // Extend Express Request interface to include 'user'
// declare global {
//   namespace Express {
//     interface Request {
//       user?: string | JwtPayload;
//     }
//   }
// }

// interface Idecoder{
  
//   id: string;
//   name: string;
//   email: string;

// }

// dotenv.config();

// const JWT_SECRET = process.env.JWT_SECRET as string;



// export const isAuth = (req:any, res: Response, next: NextFunction) => {
//   console.log("req.cookies",req.cookies);
//   try {
//     const token = req.cookies?.token;
//     console.log("token",token);

//     if (!token) {
//       return res.status(401).json({ message: "Token not found" });
//     }

//     const decoded = jwt.verify(token, JWT_SECRET) as Idecoder;
//     console.log("decoded",decoded);
  
  
//     req.userId = decoded.id as string;

//     next(); 
//   } catch (err) {
//     return res.status(401).json({ message: "Invalid or expired token " });
//   }
// };




import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

declare global {
  namespace Express {
    interface Request {
      user?: string | JwtPayload;
      userId?: string;
    }
  }
}

interface Idecoder {
  id: string;
  name: string;
  email: string;
}

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization header missing or malformed" });
    }

    const token = authHeader.split(" ")[1];
    console.log("token",token);
    const decoded = jwt.verify(token, JWT_SECRET) as Idecoder;

    req.userId = decoded.id;
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

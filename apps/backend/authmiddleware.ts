import type { Request,Response,NextFunction } from "express";
import jwt, {type JwtPayload} from "jsonwebtoken";

interface AuthenticatedRequest extends Request{
  userId ?: string;
}

interface customjwtpayload extends JwtPayload{
  userId?: string;
}


function authmiddleware(req:AuthenticatedRequest,res:Response,next:NextFunction){
  const token = req.headers.token as string;
  
  if(!token){
    res.status(401).json({error: "Unauthorized token"});
    return;
  }

  try {
    const secretKey:string = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token,secretKey) as customjwtpayload;
    const userId = decoded.userId as string;
    if(userId){
      req.userId = userId;
      next();
    }
  } catch (error) {
    res.status(401).json({
      error: "Invalid or expired token"
    })
  };
};

export default authmiddleware;
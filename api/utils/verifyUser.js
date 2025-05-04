//this is used to check whether user is authienticated or not 
//we want to extract cookie from browser so we used cookie parser in index.js
//verify user and add it to req and then update user will be called inside which we'll be having access to that user

import jwt  from "jsonwebtoken";
import {errorHandler} from './error.js';

export const verifyToken = (req,res,next) =>{
  const token= req.cookies.access_token;
  if(!token){
    return next(errorHandler(401,'Unauthorized'));
  }
 //verify user
  jwt.verify(token,process.env.JWT_SECRET,(err,user) => {
    if(err){
      return next(errorHandler(401,'Unauthorized'));
    }
    //token is verified then user will be added to the req
    req.user=user;
    next();//update user will be called
  });
}
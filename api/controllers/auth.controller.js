import User from '../models/user.model.js';
import bcryptjs from "bcryptjs";
import { errorHandler } from '../utils/error.js';
import jwt  from 'jsonwebtoken';

// signup controller
export const signup =async (req,res,next)=>{
  const {username,email,password}= req.body;


if(!username || !email || !password || username === '' || email === '' || password === ''){
   next(errorHandler(400,'All fields are required'));
}
//hashsync has async with it
const hashedPassword= bcryptjs.hashSync(password,10);

const newUser= new User({
  username,
  email,
  password: hashedPassword
});

try{
await newUser.save();
res.json('Signup successfull');
}catch(error){
next(error);
}
};

// signin controller
export const signin = async (req,res,next)=>{
   const {email,password}=req.body;
   if (!email || !password || email === '' || password === ''){
    next(errorHandler(400,'All fields are required'));
   }

   try{
     const validUser=await User.findOne({username});
     if(!validUser){
      return next(errorHandler(404,'User not found'));
     }
     const validPassword= bcryptjs.compareSync(password, validUser.password); //we can't compare directly because validUser password in db is hashed and the one he enters is not so comparesync will 1st hash it then compare it
     
     if(!validPassword){
      return next(errorHandler(404,'Invalid password'));
     }

     //now when both email and pswrd are correct we need to authenticate the user
     //generate token
     const token=jwt.sign(
      {id:validUser._id}, process.env.JWT_SECRET,
      );

      //we don't want to send password in response ,so separating password and rest,and send rest instead on validUser in response
      const {password:pass, ...rest}= validUser._doc;

//set cookie 
      res.status(200).cookie('access_token',token,{
        httpOnly:true
      }).json(rest);

   }catch(error){
    next(error);
   }
}
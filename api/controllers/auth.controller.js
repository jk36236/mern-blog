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
     const validUser=await User.findOne({email});
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
      {id:validUser._id, isAdmin:validUser.isAdmin}, process.env.JWT_SECRET,
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


//google auth controller
export const google = async(req,res,next) =>{
  //check if user exists ,if yes then signin otherwise create new user
  const {name,email,googlePhotoUrl}=req.body;
  try {
     const user= await User.findOne({email});
      if(user){
        const token= jwt.sign({id:user._id,isAdmin:user.isAdmin}, process.env.JWT_SECRET,)
        const {password:pass, ...rest}= user._doc;
      //set cookie 
      res.status(200).cookie('access_token',token,{
        httpOnly:true
      }).json(rest);
      }else{
        //we can't signup user without pswd but we don;t have pswrd here , so we will generate random pswrd for and signup him an later on let him change the pswrd
       const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8); //to make it strong we use 2 times random pswrd
       const hashedPassword= bcryptjs.hashSync(generatedPassword,10);

       const newUser= new User({
        username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),//to make username unique ,ex: Sahand Ghav(we get) => sahandghav1276
        email,
        password:hashedPassword,
        profilePicture:googlePhotoUrl,
       });
       await newUser.save();
       const token= jwt.sign({id: newUser._id, isAdmin:newUser.isAdmin},process.env.JWT_SECRET);
       const {password:pass, ...rest}= user._doc;
       //set cookie 
       res.status(200).cookie('access_token',token,{
         httpOnly:true
       }).json(rest);
      }
  } catch (error) {
    next(error);
  }
}
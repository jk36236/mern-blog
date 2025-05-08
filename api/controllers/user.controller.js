import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs';
import User from "../models/user.model.js";


export const test= (req,res)=>{
  res.json({message:'api is working'});
}

export const updateUser =async (req,res,next) =>{
  //err realted to userid
  //we'll get 2 user ids one from cookie(req.user.id) and one from params(/update/:userId)
 if(req.user.id !== req.params.userId){
   //it means user is not authenticated so not allowed to update
   return next(errorHandler(403,'You are not allowed to update this user'));

 }
 //err realted to pswrd
  if(req.body.password){
    if(req.body.password.length< 6){
      return next(errorHandler(400,'Password must be atleast 6 characters'));
    }
    //if pswrd then encrypt it
    req.body.password= bcryptjs.hashSync(req.body.password,10);
  }
//err realted to usrname
if(req.body.username){
  if(req.body.username.length< 7 || req.body.username.length > 20){
    return next(errorHandler(400,'Username must be between 7 and 20 characters'));
  }
  //we don't want it to include space 
  if(req.body.username.includes(' ')){
    return next(errorHandler(400,'Username can not contain spaces'));
  }
 //it should be lowercase
  if(req.body.username !== req.body.username.toLowerCase()){
    return next(errorHandler(400,'Username must be lowercase'));
  }
//it don't include any characters
  if(!req.body.username.match(/^[a-zA-Z0-9]+$/)){
    return next(errorHandler(400,'Username can only contain letters and numbers'));
  }

}
  //now update the user
  try {
    const updatedUser= await User.findByIdAndUpdate(req.params.userId,{
      $set:{
        username:req.body.username,
        email:req.body.email,
        profilePicture:req.body.profilePicture,
        password:req.body.password,
      }
    },{new:true}); //added new true to send the updated information,otherwise it would have send old information
    const {password, ...rest} = updatedUser._doc;
    res.status(200).json(rest);

  } catch (error) {
    next(error);
  }
}




export const deleteUser = async(req,res,next)=>{
  if(req.user.id !== req.params.userId){
    return next(errorHandler(403,'You are not allowed to delete this user'));
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json('User has been deleted');
  } catch (error) {
    next(error);
  }
}


export const signOut= async(req,res,next)=>{
  try {
    res.clearCookie('access_token').status(200).json('User has been signed out');
  } catch (error) {
    next(error);
  }
}
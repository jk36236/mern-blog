import Post from '../models/post.model.js';
import { errorHandler } from "../utils/error.js"

export const create =async (req,res,next)=>{
  if(!req.user.isAdmin){
    return next(errorHandler(403,'You are not allowed to create a post'));
  }
 
  if(!req.body.title || !req.body.content){
    return next(errorHandler(400,'Please provide all required fields'));
  }
//for seo purpose it's better to have a slug instead of having a post id or url
//we 'll replace anything that is not letters and numbers with '-'

const slug= req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');

const newPost= new Post({
  ...req.body,
  slug,
  userId:req.user.id//to know which admin created post
});

//add in db
try {
  const savedPost=await newPost.save();
  res.status(201).json(savedPost);
} catch (error) {
  next(error);
}
}
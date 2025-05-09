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
//when a new post is created ,each post will be redirected to a new url by using slug

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

//we'll use this in multiple places like in :- getposts, when we search posts, and in recent post
//now we can use this api route everywhere in our application

export const getPosts = async(req,res,next)=>{
 try {
  const startIndex= parseInt(req.query.startIndex) || 0;//to know from which index to start fetching posts
  const limit= parseInt(req.query.limit) || 9; //to limit posts on 1 page
  const sortDirection = req.query.order === 'asc' ? 1 : -1;

  const posts = await Post.find({
    //finding posts in case of different scenarios i.e according to query which user do
...(req.query.userId && {userId: req.query.userId}), //--for user
...(req.query.category && {category: req.query.category}),//--for category
...(req.query.slug && {slug: req.query.slug}),//--for slug
...(req.query.postId && { _id: req.query.postId}),//--for postID

//for search term- we're going to search in title ,content
...(req.query.searchTerm && {
  $or:[
    {title:{$regex: req.query.searchTerm, $options: 'i'}},//to search inside title ,option'i' means case(upper,lower) does not matter
    {content:{$regex: req.query.searchTerm, $options: 'i'}}, //to search inside content
  ],
}),
 })
.sort({ updatedAt: sortDirection })
.skip(startIndex)
.limit(limit)


const totalPosts=await Post.countDocuments();

//posts in last month
const now= new Date();
const oneMonthAgo= new Date(
  now.getFullYear(),
  now.getMonth() - 1,
  now.getDate()
);

const lastMonthPosts= await Post.countDocuments({
  createdAt:{$gte:oneMonthAgo},
})
res.status(200).json({
  posts,
  totalPosts,
  lastMonthPosts,
});

 } catch (error) {
  next(error);
 }
};


export const deletePost = async (req,res,next)=>{
 
  if(!req.user.isAdmin || req.user.id !== req.params.userId){
   return next(errorHandler(403,'You are not allowed to delete this post'));
  }

  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json('The post has been deleted');
  } catch (error) {
    next(error);
  }
}
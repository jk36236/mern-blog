import { useState,useEffect } from "react";
import { Button, Spinner } from 'flowbite-react';
import { Link, useParams } from 'react-router-dom';
import CallToAction from "../components/CallToAction";

const PostPage = () => {
  const {postSlug} = useParams();
  const [loading,setLoading]=useState(true);
  const [error,setError]= useState(false);
  const [post,setPost]=useState(null);

  // console.log(post);

 useEffect(()=>{
  //  console.log(postSlug);
  //we'll fetch data based on this slug
  const fetchPost = async ()=>{
     try {
      setLoading(true);
      const res= await fetch(`/api/post/getposts?slug=${postSlug}`);
      const data=await res.json();

      if(!res.ok){
        setError(true);
        setLoading(false);
        return;
      }
      if(res.ok){
        setPost(data.posts[0]);
        setLoading(false);
        setError(false);
      }

     } catch (error) {
      setError(true);
      setLoading(false);
     }
  }
  fetchPost();
 },[postSlug]);


 if(loading){
  return (
   <div className="flex justify-center items-center min-h-screen">
    <Spinner size='xl'/>
   </div>
  );
 }

  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen ">
     <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>{post && post.title}</h1>

     <Link className='self-center mt-5'
      to={`/search?category=${post && post.category}`}
     >
     <Button color='gray' pill size='xs'>{post && post.category}</Button>
     </Link>

    <img src={post && post.image} alt={post && post.title} className='mt-10 p-3 max-h-[600px] w-full object-cover'/>

    <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs'>
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className='italic'>
          {/* for each 1000 charaters we want to add 1 min */}
          {post && (post.content.length / 1000).toFixed(0)} mins read 
        </span>
      </div>
{/* content -we want to add it as HTML not plain text ,use dangerouslySetInnerHTML, it's html and we've to style it with css(post-content class)*/}
      <div
        className='p-3 max-w-2xl mx-auto w-full post-content'
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div> 
   

   <div className='max-w-4xl mx-auto w-full'>
        <CallToAction />
      </div>

      
    </main>
  )
}

export default PostPage
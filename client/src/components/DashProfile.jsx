import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { useState,useRef,useEffect } from "react";
import { useSelector, useDispatch} from "react-redux"
import { updateStart,updateSuccess,updateFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess ,signoutSuccess} from "../redux/user/userSlice";

import {HiOutlineExclamationCircle } from 'react-icons/hi';
import {Link} from 'react-router-dom';


const DashProfile = () => {
  const {currentUser, error,loading}= useSelector((state)=> state.user);
  const [imageFile,setImageFile]= useState(null);
  const [imageFileUrl,setImageFileUrl]= useState(null); 
  const [formData,setFormData]=useState({});
 const[imageFileUploading,setImageFileUploading]=useState(false);
 const [updateUserSuccess,setUpdateUserSuccess]=useState(null);
 const [updateUserError,setUpdateUserError]=useState(null);
 const [showModal,setShowModal]=useState(false);
 

  const filePickerRef=useRef();
  const dispatch=useDispatch();
  
  const handleImageChange=(e)=>{
    const file= e.target.files[0];
    if(file){
    setImageFile(file);
    setImageFileUrl(URL.createObjectURL(file));//converting image value into temporary url, we can't save it in db, it(url) only works in browser
    }
  }
// console.log(imageFile,imageFileUrl);--we'll get the value of image now we need to convert this into url to set into the profilepicture of user

//to upload image in storage(created in cloudinary)
useEffect(()=>{
   if(imageFile){
    uploadImage();
   }
},[imageFile]);

const uploadImage = async ()=>{
  setImageFileUploading(true);
  const data = new FormData()
  data.append("file", imageFile)
  data.append("upload_preset", "profile")
  data.append("cloud_name","dweil4esn")
  data.append('folder', 'profile');
  
  const cloudName= import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,{
  method:"post",
  body: data,
  })
  
  .then(resp => resp.json())
  .then(data => {
    // console.log(data);
    // console.log(data.url);
    setImageFileUrl(data.url);
    // console.log(imageFileUrl);
    setFormData({ ...formData, profilePicture: data.url}); 
    setImageFileUploading(false);
  })
  .catch((err) => {
    console.log('Upload error',err);
    setImageFile(null);
    setImageFileUrl(null);
    setImageFileUploading(false);
});
  }
 
  const handleChange=(e)=>{
   setFormData({ ...formData, [e.target.id]: e.target.value});
  }

  // console.log(formData);
  const handleSubmit= async (e)=>{
    e.preventDefault()//page refersh prevent
    //if empty form ,return
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if(Object.keys(formData).length === 0){
      setUpdateUserError('No changes made');
      return;
    }
//before making update request check if image is uploaded or not 
//agar ye check nahi lagaya then update upload a new image and clicks on update then will get error because image is not uploaded till now,so we have to check whether image is fully uploaded and we got back the url then update
 if(imageFileUploading){
  setUpdateUserError('Please wait for image to upload');
  return;
 }

    //else we'll update the user
    try {
      dispatch(updateStart());
      const res= await fetch(`/api/user/update/${currentUser._id}`,{
      method:'PUT',
      headers:{
        'Content-Type':'application/json',
      },
      body:JSON.stringify(formData),
      });
      const data=await res.json();
      if(!res.ok){
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
        return;
      }else{
        dispatch(updateSuccess(data));
        setUpdateUserSuccess('User profile update successfully');
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
    
  }

const handleDeleteUser= async ()=>{
  setShowModal(false);
  try {
    dispatch(deleteUserStart());
    const res= await fetch(`/api/user/delete/${currentUser._id}`,{
      method:'DELETE',
    });
    const data= await res.json();
    if(!res.ok){
      dispatch(deleteUserFailure(data.message));
    }else{
      dispatch(deleteUserSuccess(data));
    }
  } catch (error) {
    dispatch(deleteUserFailure(error.message));
  }
}

const handleSignout= async()=>{
  try {
    const res= await fetch('/api/user/signout',{
      method:'POST',
    });
    const data= await res.json();
    if(!res.ok){
      console.log(data.message);
    }else{
      dispatch(signoutSuccess());
    }
  } catch (error) {
    console.log(error.message);
  }
}


  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
 {/* input for updating image - we want to open it when someone clicks on profile picture and for that we'll create reference*/}
     <input type='file' accept="image/*" onChange={handleImageChange} ref={filePickerRef} hidden/>

        {/* image */}
        <div className="w-32 h-32 self-center  cursor-pointer shadow-md overflow-hidden rounded-full" onClick={()=> filePickerRef.current.click() }>
          {/* if imageFile url exists show it else show profilePicture */}
        <img src={imageFileUrl || currentUser.profilePicture} alt="user" className="rounded-full w-full h-full object-cover border-8 border-lightgray" />
        </div>
       {/* inputs */}
       <TextInput type="text" id='username' placeholder="username" defaultValue={currentUser.username} onChange={handleChange}/>
       
       <TextInput type="email" id='email' placeholder="email" defaultValue={currentUser.email} onChange={handleChange}/>

       <TextInput type="password" id='password' placeholder="password"  onChange={handleChange}/>
       {/* button */}
       <Button type='submit' gradientDuoTone='purpleToBlue' outline 
       disabled={loading || imageFileUploading}
       >
      {loading ? 'Loading...' : 'Update'}
       </Button>
 {/* create post button only availaible to admin */}
 {
  currentUser.isAdmin && (
    <Link to={'/create-post'}>
    <Button
      type='button'
      gradientDuoTone='purpleToPink'
      className='w-full'
    >
   Create a post
    </Button>
    </Link>
  )
 }

      </form>

      <div className="text-red-500 flex justify-between mt-5">
        <span onClick={()=> setShowModal(true)} className="cursor-pointer">Delete Account</span>
        <span onClick={handleSignout}  className="cursor-pointer">Sign Out</span>
      </div>
 {updateUserSuccess && (
   <Alert color='success' className='mt-5'>
    {updateUserSuccess}
   </Alert>
 )}

{updateUserError && (
   <Alert color='failure' className='mt-5'>
    {updateUserError}
   </Alert>
 )}
{error && (
   <Alert color='failure' className='mt-5'>
    {error}
   </Alert>
 )}
<Modal show={showModal} onClose={()=> setShowModal(false)} popup size='md'>
  <Modal.Header />
  <Modal.Body>
    <div className='text-center'>
      <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
      <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">Are you sure you want to delete your account?</h3>
      <div className="flex justify-center gap-4">
        <Button color='failure' onClick={handleDeleteUser}>
          Yes, I'm sure
        </Button>
        <Button color='gray' onClick={()=> setShowModal(false)}>No, cancel</Button>
      </div>
    </div>
  </Modal.Body>
</Modal>
    </div>
  )
}

export default DashProfile

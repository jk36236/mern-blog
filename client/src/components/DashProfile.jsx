import { Button, TextInput } from "flowbite-react";
import { useState,useRef,useEffect } from "react";
import { useSelector} from "react-redux"




const DashProfile = () => {
  const {currentUser}= useSelector((state)=> state.user);
  const [imageFile,setImageFile]= useState(null);
  const [imageFileUrl,setImageFileUrl]= useState(null); 
  const filePickerRef=useRef();

  
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
  
  })
  .catch((err) => {
    console.log('Upload error',err);
    setImageFile(null);
    setImageFileUrl(null);
});
  }
 


  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4 ">
 {/* input for updating image - we want to open it when someone clicks on profile picture and for that we'll create reference*/}
     <input type='file' accept="image/*" onChange={handleImageChange} ref={filePickerRef} hidden/>

        {/* image */}
        <div className="w-32 h-32 self-center  cursor-pointer shadow-md overflow-hidden rounded-full" onClick={()=> filePickerRef.current.click() }>
          {/* if imageFile url exists show it else show profilePicture */}
        <img src={imageFileUrl || currentUser.profilePicture} alt="user" className="rounded-full w-full h-full object-cover border-8 border-lightgray" />
        </div>
       {/* inputs */}
       <TextInput type="text" id='username' placeholder="username" defaultValue={currentUser.username}/>
       
       <TextInput type="email" id='email' placeholder="email" defaultValue={currentUser.email}/>

       <TextInput type="password" id='password' placeholder="password" />
       {/* button */}
       <Button type='submit' gradientDuoTone='purpleToBlue' outline>
        Update
       </Button>
      </form>

      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
    </div>
  )
}

export default DashProfile

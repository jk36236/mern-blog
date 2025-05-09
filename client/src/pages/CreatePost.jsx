import {Alert, Button, FileInput, Select, TextInput} from 'flowbite-react';
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CreatePost = () => {
  const [file,setFile]=useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});

  const handleUploadImage=async()=>{
     try {
      if(!file){
        setImageUploadError('Please select an image');
        return;
      }
  setImageUploadError(null);
  const data = new FormData()
  data.append("file", file)
  data.append("upload_preset", "profile")
  data.append("cloud_name","dweil4esn")
  data.append('folder', 'post');
  
  const cloudName= import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,{
  method:"post",
  body: data,
  })
  
  .then(resp => resp.json())
  .then(data => {
    console.log(data);
    console.log(data.url);
    setImageUploadError(null);
    setFormData({ ...formData, image: data.url}); 
  })
    } catch (error) {
      setImageUploadError('Image upload failed');
      console.log(error);
    }
  }


  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Create a post</h1>
      <form className='flex flex-col gap-4'>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
         <TextInput type='text' placeholder='Title' required id='title' className='flex-1'/>
        <Select>
           <option value="uncategorized">Select a category</option>
           <option value="javascript">Javascript</option>
           <option value="reactjs">React.js</option>
           <option value="nextjs">Next.js</option>
        </Select>
        </div>
      
      <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
        <FileInput type='file' accept='image/*' onChange={(e)=>setFile(e.target.files[0])}/>
        <Button type='button' gradientDuoTone='purpleToBlue' size="sm" outline onClick={handleUploadImage}>Upload Image</Button>
      </div>
      {imageUploadError &&  <Alert color='failure'>{imageUploadError}</Alert>}

      {formData.image && (
        <img
          src={formData.image}
          alt='upload'
          className='w-full h-72 object-cover'
          />
      )}
     
       <ReactQuill theme='snow' placeholder='Write something...' className='h-72 mb-12'  required/>
      </form>

      <Button type='submit' gradientDuoTone='purpleToPink'>Publish </Button>
    </div>
  )
}

export default CreatePost

import { Button } from 'flowbite-react'
import React from 'react'
import {AiFillGoogleCircle} from 'react-icons/ai';
import {GoogleAuthProvider, signInWithPopup,getAuth} from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

const OAuth = () => {
  const auth=getAuth(app); //we've to add fiebase app here otherwise will not be able to know who is requesting
  const dispatch=useDispatch();
  const navigate=useNavigate();

  const handleGoogleClick = async () =>{
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({prompt : 'select_account'});//so it'll always ask you to select account and not directly signin again after selecting account for 1st time

    try {
      const resultsFromGoogle = await signInWithPopup(auth,provider);
      // console.log(resultsFromGoogle); to test
      //we'll now send this data to BE
      const res= await fetch('/api/auth/google',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          name:resultsFromGoogle.user.displayName,
          email:resultsFromGoogle.user.email,
          googlePhotoUrl: resultsFromGoogle.user.photoURL,
        })
      })
      const data=await res.json();
      if(res.ok){
      dispatch(signInSuccess(data));
      navigate('/');
      }
    } catch (error) {
      console.log(error);
    }
  }


  return (
    //type=button not submit because it is inside form and we don't want to submit the form by clicking on it .
    <Button type='button' gradientDuoTone='pinkToOrange' outline onClick={handleGoogleClick}>
      <AiFillGoogleCircle className='w-6 h-6 mr-2' />
      Continue with Google
    </Button>
  )
}

export default OAuth

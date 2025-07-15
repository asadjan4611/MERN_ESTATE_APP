import React from 'react'
import {getAuth, GoogleAuthProvider, signInWithPopup} from 'firebase/auth'
import { useDispatch } from 'react-redux'
import {app} from '../firebase/'
import {signInSuccess} from '../redux/user/userSlice.js';
import {useNavigate} from 'react-router-dom';
export default function OAuth() {
     const dispatch = useDispatch();
     const navigate = useNavigate();
    const onsubmitWithGoogle = async() =>{
      try {
        console.log("successfully created at start");
         const provider = new GoogleAuthProvider();
         const auth = getAuth(app);

         const result = await signInWithPopup(auth,provider);
         const res = await fetch(`${baseUrl}/auth/google`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ 
    name: result.user.displayName, 
    email: result.user.email, 
    photo: result.user.photoURL 
  })
 
}
     
);
   const data = await res.json();
      dispatch(signInSuccess(data))
      navigate("/");
      } catch (error) {
        console.log("the error is ocuring while sigingin with google ",error)
      }
    }
  return (
    
    <button type='button'
     onClick={onsubmitWithGoogle}
     className='p-3 rounded-lg text-white bg-red-700 uppercase hover:opacity-90'>Continue with google</button>
  )
}

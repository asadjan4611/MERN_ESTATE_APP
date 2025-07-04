import { useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '../firebase'; // Your Firebase config
import {updateUserStart,updateUserSuccessfully,updateUserFailure} from '../redux/user/userSlice.js'
import { useDispatch } from 'react-redux';
export default function Profile() {
  const { currentUser,loading,error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [updateUser, setUpdateuser] = useState(null);
  const [fileUploadProgress, setFileUploadProgress] = useState(0);
  const [formData, setFormData] = useState({});
  const dispath =useDispatch();
  console.log(formData);
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFileUploadProgress(Math.round(progress));
      },
      (error) => {
        console.error('Upload error:', error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          // Here you would typically update the user's avatar in your database
          console.log('File available at', downloadURL);
        } catch (error) {
          console.error('Error getting download URL:', error);
        }
      }
    );
  };

 const handleSubmit = async(e) => {
   e.preventDefault();
   try {
    dispath(updateUserStart());
    const res =  await fetch(`http://localhost:3000/test/update/${currentUser._id}`,{
     method:"POST",
      headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),

    

    });
    const data =await  res.json();

    if(data.success === false){
       dispath(updateUserFailure(data.message));
       return;
    }
     dispath(updateUserSuccessfully(data))
     setUpdateuser(true);

   } catch (error) {
         dispath(updateUserFailure(error.message));

   }
 }



  useEffect(()=>{
    if (file) {
      handleFileUpload(file)
    }
  },[file]);
  
   const handleChange =  (e) =>{
    setFormData({...formData,[e.target.id]:e.target.value});
   }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input 
          onChange={(e) => setFile(e.target.files[0])}
          accept='image/*' 
          type="file" 
          ref={fileRef} 
          hidden 
        />

        <div className='relative self-center'>
          {currentUser?.avatar && (
            <img 
              onClick={() => fileRef.current.click()}
              src={currentUser.avatar}
              alt='profile'
              className='rounded-full h-24 w-24 object-cover cursor-pointer mt-1'
            />
          )}
          {fileUploadProgress > 0 && fileUploadProgress < 100 && (
            <div className='absolute bottom-0 left-0 right-0 bg-gray-200 rounded-full h-2'>
              <div 
                className='bg-blue-500 h-2 rounded-full' 
                style={{ width: `${fileUploadProgress}%` }}
              ></div>
            </div>
          )}
        </div>

        <input 
          defaultValue={currentUser?.username || ''}
          type='text' 
          placeholder='username'
          id='username' 
          className='border p-3 rounded-lg' 
          onChange={handleChange}
        />
        <input 
          defaultValue={currentUser?.email || ''}
          type='email' 
          placeholder='email' 
          id='email'
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />
        <input 
          type='password' 
          placeholder='password'
          id='password' 
          className='border p-3 rounded-lg'
          onChange={handleChange} 
        />
        <button 
        disabled={loading}
          type='submit'
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ?"Loading...." :"Update"}
        </button>
        <div className='flex justify-between mt-1 text-red-600'>
          <span className='cursor-pointer'>Delete account</span>
          <span className='cursor-pointer'>Sign out</span>
        </div>
        <p className='text-red-700 text-center text-[2pxl] uppercase'>{error?error:""}</p>
         <p className='text-green-700 text-center text-[2pxl] uppercase'>{updateUser?"User updated successflly":""}</p>
      </form>
    </div>
  );
}
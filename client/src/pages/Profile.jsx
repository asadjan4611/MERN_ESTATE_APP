import { useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '../firebase'; // Your Firebase config
import {
  updateUserStart,
  updateUserSuccessfully,
  updateUserFailure,
  deleteUserFailure,
  deleteUserSuccess,
  deleteUserStart,
  signOutUserStart,
      signOutUserSuccess,
      signOutUserFailure,

} from '../redux/user/userSlice.js'
import { useDispatch } from 'react-redux';
import { useNavigate,Link } from 'react-router-dom';


export default function Profile() {
  const { currentUser,loading,error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const navigate= useNavigate();
  const [file, setFile] = useState(null);
  const [updateUser, setUpdateuser] = useState(null);
  const [listeningData,setListeningData]   = useState([]);
  const [showlisteningerror, setShowlisteningerror] = useState(null);
  const [fileUploadProgress, setFileUploadProgress] = useState(0);
  const [formData, setFormData] = useState({});
  const dispath =useDispatch();
  console.log(formData);
  console.log(listeningData.length);

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
     credentials:"include",
      headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
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

 const handleDelte  = async() =>{
  try {
    dispath(deleteUserStart());
    const resp = await fetch(`http://localhost:3000/test/delete/${currentUser._id}`,
     {
      method:"DELETE"
     }
    );
     const data = resp.json();
     if(data.success === false){
       dispath(deleteUserFailure(data.message));
       return;
    }
     dispath(deleteUserSuccess(data))

  } catch (error) {
    dispath(deleteUserFailure(error.message));
  }
 }

const handleSignOut = async (e) => {
  e.preventDefault();
  try {
    dispath(signOutUserStart()); // Corrected typo: dispath → dispatch
    
    const res = await fetch('http://localhost:3000/auth/signout', {
      credentials: 'include' // Required for cookie clearance
    });
    

    dispath(signOutUserSuccess());
   
    navigate("/");
    // Full page reload (clears all state)
    
  } catch (error) {
    dispath(signOutUserFailure(error.message));
  }
};


const handleshowListening = async () =>{
   try {
    setShowlisteningerror(null)
    const res = await fetch(`http://localhost:3000/test/listening/${currentUser._id}`
      ,{
      method:"GET",
     credentials:"include",
      headers: {
          'Content-Type': 'application/json',
        },
    }
      
    );

      const data = await  res.json();
      if (data.success === false) {
        setShowlisteningerror(data.message);
        return;
      }
      setListeningData(data);
   } catch (error) {
    setShowlisteningerror(error.message);
   }
}

const handleDelteListening =async(e) =>{
  console.log("hi")
  try {
    const res = await fetch(`http://localhost:3000/test/deleteListening/${e}`,
    {
    method:"DELETE",
    credentials:'include',
    headers :{
       'Content-Type': 'application/json',
    }
    }
      );
  console.log("hi 2")
      
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return ;
      }

      setListeningData((prev)=>prev.filter((listening)=>listening._id !== e ));
  } catch (error) {
    console.log(error);
  }
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
        </form>
        <Link to={'/createListening'}>
        <div 
        className='bg-slate-700 text-center mt-2 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
          Create a Listening
        </div>
        </Link>
        <div className='flex justify-between mt-1 text-red-600'>
          <span onClick={handleDelte} className='hover:underline mt-3 cursor-pointer'>Delete account</span>
          <span onClick={handleSignOut}  className='cursor-pointer mt-3'>Sign out</span>
        </div>
        <p className='text-red-700 mt-2 text-center text-[2pxl] uppercase'>{error?error:""}</p>
         <p className='text-green-700 mt-2 text-center text-[2pxl] uppercase'>{updateUser?"User updated successflly":""}</p>
         <button onClick={handleshowListening} className=' cursor-pointer uppercase text-green-600 mt-3 w-full hover:underline'>show listening</button>
         <p className='text-red-500'>{showlisteningerror ? {showlisteningerror} : ""}</p>
         <div>
        
         {
  listeningData && listeningData.length > 0  &&
     <>
       <h1 className='text-[10pxl] font-bold text-center m-8'>Your Listening</h1>
    {
    listeningData.map((listening) => (
  
        
       <div
  key={listening._id}
  className="flex justify-between items-center mt-4 border rounded-lg p-3"
> <Link
  to={`/listening/${listening._id}`}
  className="flex items-center gap-4 flex-1"
>
  {/* Image */}
  <img
    src={listening.imageUrls?.[0]}
    alt="Listening"
    className="w-16 h-16 object-cover border rounded"
  />

  {/* Title */}
  <p className="text-slate-600 font-bold hover:underline truncate">
    {listening.name}
  </p>
</Link>


  {/* Action Buttons */}
  <div className="flex flex-col items-center">
    <button 
     onClick={()=>handleDelteListening(listening._id)}
    className="uppercase m-2 text-red-600 hover:underline cursor-pointer">Delete</button>
    <Link  to={`/update-Listening/${listening._id}`}>
    <button
     className="uppercase m-2 hover:underline cursor-pointer text-green-900">Edit</button>
     </Link>
  </div>
</div>
      
      

    ))
   } </>
     }

  </div>
    
    </div>
  );
}
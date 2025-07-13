import React, { useRef, useState } from 'react'
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {useDispatch} from 'react-redux'
import {useNavigate,useParams} from 'react-router-dom'
export default function updateListening() {

  const [files ,setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(false);
   const [uploading, setuploading] = useState(false);
   const [loading, setLoading] = useState(false);
   const [loadingsuccessfull, setLoadingsuccessfull] = useState(false);
   const [error, setError] = useState(false);
    const [updateSuccessfully,setUpdateSuccessfully] = useState(false);
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const params = useParams();
   const {currentUser} = useSelector((state)=>state.user);
  const [formData ,setFormData] = useState({
    imageUrl :[],
    name:"",
    address:"",
    description:"",
    type:'rent',
    bedrooms:"",
    bathrooms:"",
    regularPrice:'50',
    discountPrice:'0',
    furnished:false,
    parking:true,
    offer:false,
    
  });
  
 console.log(formData)

 useEffect (
  ()=>{
  const fetching = async() =>{
  console.log('hi1');
  const listeningId = params.listeningId;
  const res = await fetch(`http://localhost:3000/test/getListeningData/${listeningId}`);
  console.log('hi3 is here');
  const data =await res.json();
  console.log(data.imageUrl);
// if (!Array.isArray(data.imageUrls) && Array.isArray(data.imageUrl)) {
//   data.imageUrls = data.imageUrl;
// }

  if (data.success === false) {
    console.log(data.message);
    return;
  }
  console.log('hi4');
  
  setFormData(data);
  console.log(formData)
  }
  fetching();
  },[]
 );

  const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const handleDeleteImage = (index) =>{
  setFormData({

  ...formData,
  imageUrl:formData.imageUrl.filter((_,i)=> i !==index )
  })
}

const handleImageSubmit = async (e) => {
  if (files.length === 0) {
    setImageUploadError("Please select at least one image");
    return;
  }

  if (files.length > 0 && files.length < 7) {
    setImageUploadError(false);
    setuploading(true);
    const promises = [];

    for (let i = 0; i < files.length; i++) {
      const base64 = await fileToBase64(files[i]);
      const res = await fetch('http://localhost:3000/image/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64 }),
      });
      const data = await res.json();
      promises.push(data.url); // returned base64 string
    }

    setFormData({
      ...formData,
      imageUrls: formData.imageUrl.concat(promises),
    });
    setImageUploadError(false);
    setuploading(false);
  } else {
    setuploading(false);
    setImageUploadError('You can only upload 6 images per listing');
  }
} 

const handleChange = (e) => {
  const { id, type, checked, value } = e.target;

  if (id === 'Sale' || id === 'Rent') {
   
    setFormData({
      ...formData,
      type:e.target.id}
  );
  } else if (type === 'checkbox') {
    // For other checkboxes like parking, offer, furnished
    setFormData({
      ...formData,
      [e.target.id]:e.target.checked
    }
      
    );
  } else if (type === 'number'){
     setFormData({
      ...formData,
      [id]:parseInt(value)
     })
  }
   else {
    // For text, number, textarea fields
    setFormData({
      ...formData,
      [e.target.id]:e.target.value
    }
  );
  }
};

const handleFromSubmitt =async (e) =>{
console.log("everything is okay");
    setUpdateSuccessfully(false);
  e.preventDefault();
  try {
if (formData.imageUrl.length < 1) {
  return setError("you have choose at least one image");
}
console.log("everything is also now okay");


if ( +formData.regularPrice< +formData.discountPrice) {
   return setError("Your Regular Price must be greater then Discount Price");
}

  setLoading(true);
  setLoadingsuccessfull(true);
  setError(false);
console.log("everything is okay before fetching");

    const res = await fetch(
       `http://localhost:3000/test/updateListening/${params.listeningId}`,{
        method:"PUT",
        credentials:"include",
          headers:{
            "Content-type":'application/json'
        },
        body:JSON.stringify({
          ...formData,
          useRef:currentUser._id
        })
      }
    );
const data =await res.json();
console.log("everything is okay at data response");

if (data.success === false) {
  //setError(data.message)
  setError(data.message);
  setUpdateSuccessfully(false);
}
  setLoading(false)
  setLoadingsuccessfull(false);
  setUpdateSuccessfully(true);

  navigate(`/listening/${data._id}`);
  } catch (error) {
    setError(error.message);
    setUpdateSuccessfully(false);
    setLoading(false);
  }
}

  return (
    <main className='max-w-4xl mx-auto'>
        <h1 className='text-[18px] text-center font-bold my-9'>Update your Listening</h1>
        <form onSubmit={handleFromSubmitt}>
            <div className='flex  flex-wrap flex-col gap-4 max-w-lg mx-auto'>
                <input
                className=' rounded-lg p-3 border'
                type="text"
                 placeholder='Name'
                 id='name'
                  required
                  onChange={handleChange}
                  value={formData.name}
                minLength={10}
                 maxLength={20} />
           
           <input
                className=' rounded-lg p-3 border'
                type="text"
                id='description'
                 placeholder='Desription' 
                 required
                 onChange={handleChange}
                  value={formData.description}
                  minLength={10}
                  // maxLength={40}
                    />
           
           <input
                className=' rounded-lg p-3 border'
                type="text"
                id='address'
                onChange={handleChange}
                  value={formData.address}
                 placeholder='Address' 
                 required minLength={10}
                  maxLength={180} />
           
              <div className='flex gap-x-9  gap-y-5 flex-wrap p-3'>
                <div className='flex gap-2 flex-wrap'>
                 <input 
                 type="checkbox" 
                 id='Sale'
                 onChange={handleChange}
                 checked={formData.type === 'Sale'}
                  className='w-5' />
                 <span>Sell</span>
                </div>

                <div className='flex gap-2 flex-wrap'>
                 <input
                  type="checkbox"
                   id='Rent'
                   onChange={handleChange}
                 checked={formData.type === 'Rent'}
                    className='w-5' />
                 <span>Rent</span>
                </div>

                <div className='flex gap-2 flex-wrap'>
                 <input 
                 type="checkbox" 
                 id='parking'
                 onChange={handleChange}
                 value={formData.parking}
                  className='w-5' />
                 <span>Parking Spot</span>
                </div>

                <div className='flex gap-2 flex-wrap'>
                 <input
                  type="checkbox" 
                  id='furnished'
                   onChange={handleChange}
                 value={formData.furnished}
                  className='w-5' />
                 <span>Furnished</span>
                </div>


               
                <div className='flex gap-2 flex-wrap'>
                 <input 
                 type="checkbox"
                  id='offer'
                   onChange={handleChange}
                 value={formData.offer}
                  className='w-5' />
                 <span>Offer</span>
                </div>
              </div>
              <div className='flex flex-wrap gap-6'>
               <div className='flex gap-2'>
                <input 
                className='p-[2px] border rounded-lg border-gray-300'
                 type="number"
                  id='bedrooms' 
                   onChange={handleChange}
                 value={formData.bedrooms}
                  required min ='1'
                   max='10' />
                <span >Beds</span>
               </div>

               <div className='flex gap-2'>
                <input
                 className='p-[2px] border rounded-lg border-gray-300'
                  type="number" 
                  id='bathrooms'
                  onChange={handleChange}
                 value={formData.bathrooms}
                   required min ='1'
                    max='10' />
                <span >Baths</span>
               </div>

               <div className='flex gap-2'>
                <input className='p-[2px] border rounded-lg border-gray-300'
                 type="number" 
                 id='regularPrice'
                 onChange={handleChange}
                 value={formData.regularPrice}
                  required min ='50' 
                  max='10000000' />
                <div className=''>
                <span >Regular Price</span>
                <p> ($ / month)</p>
                </div>
               </div>
                
                {formData.offer && (
                 <div className='flex gap-2'>
                <input
                 className='p-[2px] border rounded-lg border-gray-300' 
                 type="number"
                  id='discountPrice'
                   required min ='0'
                   onChange={handleChange}
                 value={formData.discountPrice} 
                   max='100000' />
                <div className='flex flex-col items-center flex-wrap '>
                <span >Disount Price</span>
                <p> ($ / month)</p>
                </div>
               </div>
                )}
              


               
              </div>

             <div className="space-y-2">
              <p className="font-semibold">Images:
                 <span className="font-normal text-gray-600 ml-2">The first image will be the cover (max 6)</span>
                 </p>
                <div className="flex gap-4 items-center"> {/* Changed this line to flex-row */}
            <input 
                onChange={(e)=>setFiles(e.target.files)}
                className="flex-1 p-3 border border-gray-300 rounded" 
                type="file" 
                id="images" 
                accept="image/*" 
                multiple 
    />
                <button 
                type='button'
                disabled={uploading}
                onClick={handleImageSubmit}
                className="px-6 py-3 text-white bg-green-700 border border-green-700 rounded uppercase hover:bg-green-800 whitespace-nowrap"
                >
                {uploading ? 'Uploading...' :'Upload'}
                </button>
                </div>
                 <p className='text-red-700 text-sm'>
            {imageUploadError && imageUploadError}
          </p>
          {
            formData.imageUrl.length >0  && formData.imageUrl.map((url,index)=>(
              <div key={url} className='flex justify-between p-3 border-none items-center'>
                <img src={url}
                 alt="https://images.unsplash.com/photo-1751013781844-fa6a78089e49?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8"
                 className='w-30 h-20 object-cover rounded-lg'
              
                 />
                 <button
                  type='button'
                   onClick={()=>handleDeleteImage(index)}
                  className='text-red-600 uppercase border-none cursor-pointer hover:underline hover:opacity-75'>Delete</button>
              </div>
            ))
          }
                </div>
          <button disabled={uploading || loading} className='p-3 bg-slate-600 text-white uppercase rounded-lg '>
            {loading?"Updating...." :"Update Listening"}
            </button>
             {loadingsuccessfull || updateSuccessfully  && <p className='text-green-600 text-center uppercase'>Updated Successfully</p>}
            {error && <p className='text-red-600 uppercase'>{error}</p>}

            </div>
        </form>
    </main>
  )
}

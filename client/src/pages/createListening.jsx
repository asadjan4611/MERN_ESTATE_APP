import React, { useState } from 'react'

export default function () {

  const [files ,setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(false);
   const [uploading, setuploading] = useState(false);
  const [formData ,setFormData] = useState({
    imageUrls :[]
  });
  

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
  imageUrls:formData.imageUrls.filter((_,i)=> i !==index )
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
      imageUrls: formData.imageUrls.concat(promises),
    });
    setImageUploadError(false);
    setuploading(false);
  } else {
    setuploading(false);
    setImageUploadError('You can only upload 6 images per listing');
  }
} 

  return (
    <main className='max-w-4xl mx-auto'>
        <h1 className='text-[18px] text-center font-bold my-9'>Create a Listening</h1>
        <form>
            <div className='flex  flex-wrap flex-col gap-4 max-w-lg mx-auto'>
                <input
                className=' rounded-lg p-3 border'
                type="text"
                 placeholder='Name'
                 id='name'
                  required minLength={10} maxLength={20} />
           
           <input
                className=' rounded-lg p-3 border'
                type="Description"
                id='description'
                 placeholder='Desription' 
                 required minLength={10}
                  maxLength={40} />
           
           <input
                className=' rounded-lg p-3 border'
                type="address"
                id='address'
                 placeholder='Address' 
                 required minLength={10} maxLength={80} />
           
              <div className='flex gap-x-9  gap-y-5 flex-wrap p-3'>
                <div className='flex gap-2 flex-wrap'>
                 <input type="checkbox" id='Sale' className='w-5' />
                 <span>Sell</span>
                </div>

                <div className='flex gap-2 flex-wrap'>
                 <input type="checkbox" id='Rent' className='w-5' />
                 <span>Rent</span>
                </div>

                <div className='flex gap-2 flex-wrap'>
                 <input type="checkbox" id='parking' className='w-5' />
                 <span>Parking Spot</span>
                </div>

                <div className='flex gap-2 flex-wrap'>
                 <input type="checkbox" id='furnished' className='w-5' />
                 <span>Furnished</span>
                </div>

                <div className='flex gap-2 flex-wrap'>
                 <input type="checkbox" id='offer' className='w-5' />
                 <span>Offer</span>
                </div>
              </div>
              <div className='flex flex-wrap gap-6'>
               <div className='flex gap-2'>
                <input className='p-[2px] border rounded-lg border-gray-300' type="number" id='bedroom' required min ='1' max='10' />
                <span >Beds</span>
               </div>

               <div className='flex gap-2'>
                <input className='p-[2px] border rounded-lg border-gray-300' type="number" id='bathroom' required min ='1' max='10' />
                <span >Baths</span>
               </div>

               <div className='flex gap-2'>
                <input className='p-[2px] border rounded-lg border-gray-300' type="number" id='regularPrice' required min ='1' max='10' />
                <div className=''>
                <span >Regular Price</span>
                <p> ($ / month)</p>
                </div>
               </div>

               <div className='flex gap-2'>
                <input className='p-[2px] border rounded-lg border-gray-300' type="number" id='discountPrice' required min ='1' max='10' />
                <div className='flex flex-col items-center flex-wrap '>
                <span >Disount Price</span>
                <p> ($ / month)</p>
                </div>
               </div>


               
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
            formData.imageUrls.length >0  && formData.imageUrls.map((url,index)=>(
              <div key={url} className='flex justify-between p-3 border-none items-center'>
                <img src={url}
                 alt="https://images.unsplash.com/photo-1751013781844-fa6a78089e49?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8"
                 className='w-20 h-20 object-contain rounded-lg'
              
                 />
                 <button type='button' onClick={()=>handleDeleteImage(index)} className='text-red-600 uppercase border-none hover:opacity-75'>Delete</button>
              </div>
            ))
          }
                </div>
          <button className='p-3 bg-slate-600 text-white uppercase rounded-lg '>create listening</button>
            </div>
        </form>
    </main>
  )
}

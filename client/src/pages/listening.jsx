import React from "react";
import {useParams} from 'react-router-dom'
import { useState,useEffect } from "react";
import { Swiper,SwiperSlide } from "swiper/react";
import  SwiperCore  from "swiper";
import { Navigation } from "swiper/modules";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';
import { useSelector } from 'react-redux';
import "swiper/css/bundle";
import Contact from "../components/Contact";
export default function Listening() {
    SwiperCore.use([Navigation]);
    const [listening,setListening] =useState(null);
    const [loading ,setLoading]  = useState(false);
    const [error, setError] = useState(false);
    const [copied, setCopied] = useState(false);
    const [contact, setContact] = useState(false);
    const params = useParams();
    console.log(listening);
    const { currentUser } = useSelector((state) => state.user);

   useEffect(() => {
   const fetchingListening = async () => {
     setError(false);       
     setLoading(true);    
     try {
      const res = await fetch(`http://localhost:3000/test/getListeningData/${params.listeningId}`, {
        method: "GET",
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      setListening(data);
      setLoading(false);
      if (data.success === false) {
        setLoading(false);
        setError(true);
        console.log(data.message)
      }
      setLoading(false);
      setError(false);
    } catch (error) {
      setError("Failed to fetch listening");
      console.log(error);
      setLoading(false);
    } 
  };

  fetchingListening();
}, [params.listeningId]);

    return (
        <main>
            {
            loading &&<p className="text-center mt-7 uppercase text-2xl"> Loading......</p>
            }

            {
                error && <p className="text-center mt-7 uppercase text-2xl text-red">Something went wrong</p>
            }


            {
                listening && !error && !loading &&
                (
                    <div>
                        <Swiper navigation>
                            {
                                listening.imageUrl.map((url)=>(
                                    <SwiperSlide key={url}>
                                        <div className="h-[350px] mx-12 mt-4 object-cover"
                                        style={{
                                            background:`url(${url}) center no-repeat`,
                                            backgroundSize:"cover"
                                        }}
                                        ></div>
                                    </SwiperSlide>
                                ))
                            }
                        </Swiper>
                         <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
            <FaShare
              className='text-slate-500'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>

          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
              Link copied!
            </p>
          )}
          <div className='flex flex-col max-w-4xl mx-auto p-3 my-3 gap-4'>
            <p className='text-2xl font-semibold'>
              {listening.name} - ${' '}
              {listening.offer  ? listening.discountPrice.toLocaleString('en-US'): listening.regularPrice.toLocaleString('en-US')}
              {listening.type === 'rent' && ' / month'}
            </p>
            <p className='flex items-center mt-4 gap-2 text-slate-600  text-sm'>
              <FaMapMarkerAlt className='text-green-700' />
              {listening.address}
            </p>
            <div className='flex gap-4'>
              <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                {listening.type === 'rent' ? 'For Rent' : 'For Sale'}
              </p>
              {listening.offer && (
                <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                  ${+listening.regularPrice - +listening.discountPrice} OFF
                </p>
              )}
            </div>
            <p className='text-slate-800'>
              <span className='font-semibold text-black'>Description - </span>
              {listening.description}
            </p>
            <ul className='text-green-900 font-semibold mt-4 text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBed className='text-lg' />
                {listening.bedrooms > 1
                  ? `${listening.bedrooms} beds `
                  : `${listening.bedrooms} bed `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBath className='text-lg' />
                {listening.bathrooms > 1
                  ? `${listening.bathrooms} baths `
                  : `${listening.bathrooms} bath `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaParking className='text-lg' />
                {listening.parking ? 'Parking spot' : 'No Parking'}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaChair className='text-lg' />
                {listening.furnished ? 'Furnished' : 'Unfurnished'}
              </li>
            </ul>
            {currentUser && listening.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className='bg-slate-700 text-white rounded-lg mt-5 uppercase hover:opacity-95 p-3'
              >
                Contact landlord
              </button>
            )}
            {contact && <Contact listening={listening} />}
          </div>
                    </div>
                )
            }
            </main>
    )
}
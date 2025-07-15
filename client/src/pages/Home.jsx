import { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
import {  Swiper,SwiperSlide} from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import 'swiper/css/bundle'
import ListingItem from '../components/ListenItem';
import { list } from 'firebase/storage';



export default function Home() {
  const [offerListening,setOfferListening] = useState([]);
const [saleListening,setSaleListening] = useState([]);
const [rentListening,setRentListening] = useState([]);
SwiperCore.use([Navigation]);

useEffect(()=>{

  const fetchOfferListening =async () =>{
     try {
      const res = await fetch(`http://localhost:3000/test/gettingListening?offer=true&limit=4`,
        {
          method:"GET",
          credentials:"include",
          headers:{
            "Content-type":"application/json"
          }
        }
      );
      const data = await res.json();
      setOfferListening(data);
      fetchRentListening();
      fetchSaleListening();
     } catch (error) {
      console.log(error);
     }
  }

  const fetchRentListening =async () =>{
  try {
    const res = await fetch(`http://localhost:3000/test/gettingListening?type=Rent&limit=4`,
        {
          method:"GET",
          credentials:"include",
          headers:{
            "Content-type":"application/json"
          }
        }
      );
      const data = await res.json();
      setRentListening(data);

  } catch (error) {
    console.log(error)
  }
  }

  const fetchSaleListening =async () =>{
  try {
    const res = await fetch(`http://localhost:3000/test/gettingListening?type=Sale&limit=4`,
        {
          method:"GET",
          credentials:"include",
          headers:{
            "Content-type":"application/json"
          }
        }
      );
      const data = await res.json();
      setSaleListening(data);
      
  } catch (error) {
    console.log(error)
  }
  }


  fetchOfferListening();

},[]);
  return (
    <div>
  {/* //  first module */}
   <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          Find your next <span className='text-slate-500'>perfect</span>
          <br />
          place with ease
        </h1>
        <div className='text-gray-400 text-xs sm:text-sm'>
          Sahand Estate is the best place to find your next perfect place to
          live.
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link
          to={'/search'}
          className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'
        >
          Let's get started...
        </Link>
      </div>
  {/* // second Module  */}
  <Swiper navigation>

  {
    offerListening && offerListening.length>0 && (
      offerListening.map((listing)=>(
        <SwiperSlide key={listing._id}>
          <img
          src={Array.isArray(listing.imageUrl) ? listing.imageUrl[0] : listing.imageUrl}
          alt="Listing"
          className="h-[400px] w-full object-cover rounded-lg"
        />
        {/* <div
        className='h-[400px]' key={listing._id}
        style={{background:`url(${listing.imageUrl}) center no-repeat`, backgroundSize:'cover'}}
        >

        </div> */}
        </SwiperSlide>
      ))
    )
  }
  </Swiper>
  {/* //Third Module */}

  <div className='mx-w-6xl mx-auto gap-8 p-3 flex flex-col my-10 '>
   {/* offerListening */}
   {
    offerListening && offerListening.length >0 && (
      <div className=''>
        <div className='my-3'>
          <h2 className='text-2xl font-semibold text-slate-500'>Recent Offer</h2>
          <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>
          Show more offers
          </Link>
        </div>
        <div className='flex flex-wrap gap-4'>
          {
            offerListening.map((listen)=>(
              <ListingItem key={listen._id} listen={listen}/>
            ))
          }
        </div>
      </div>
    )
   }

   {/* for RENT */}
   {
    rentListening && rentListening.length >0 && (
      <div className=''>
        <div className='my-3'>
          <h2 className='text-2xl font-semibold text-slate-500'>Recent places for Rent</h2>
          <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}>
          Show more places
          </Link>
        </div>
        <div className='flex flex-wrap gap-4'>
          {
            rentListening.map((listen)=>(
              <ListingItem key={listen._id} listen={listen}/>
            ))
          }
        </div>
      </div>
    )
   }
   {/* for sale  */}
   
    {
    saleListening && saleListening.length >0 && (
      <div className=''>
        <div className='my-3'>
          <h2 className='text-2xl font-semibold text-slate-500'>Recent places for Sale</h2>
          <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=sale'}>
          Show more Sale
          </Link>
        </div>
        <div className='flex flex-wrap gap-4'>
          {
            saleListening.map((listen)=>(
              <ListingItem key={listen._id} listen={listen}/>
            ))
          }
        </div>
      </div>
    )
   }
  </div>
</div>
  )
}

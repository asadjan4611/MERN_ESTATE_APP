import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ListenItem from '../components/ListenItem';
const baseUrl = import.meta.env.VITE_API_URL;
export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showMore,setShowMore]  = useState(false);
  const [listings, setListings] = useState([]);
  console.log("your listening are here",listings);


  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'created_at',
    order: 'desc',
  });

  const handleChange = (e) => {
    const { id, type, value, checked } = e.target;

    if (id === 'all' || id === 'rent' || id === 'sale') {
      setSidebardata((prev) => ({ ...prev, type: id }));
    } else if (id === 'searchTerm') {
      setSidebardata((prev) => ({ ...prev, searchTerm: value }));
    } else if (id === 'parking' || id === 'furnished' || id === 'offer') {
      setSidebardata((prev) => ({ ...prev, [id]: checked }));
    } else if (id === 'sort_order') {
      const [sort, order] = value.split('_');
      setSidebardata((prev) => ({ ...prev, sort, order }));
    }
  };
  
  const handleShowMore=async ()=>{
    const numberOfListening = listings.length;
    const startOfIndex = numberOfListening;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex",startOfIndex);
    const searchQuerry = urlParams.toString();
    const res = await fetch(
          `${baseUrl}/test/gettingListening?${searchQuerry}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          }
        );
        const data = await res.json();
        if (data.length <9) {
          setShowMore(false)
        }
        setListings([...listings,...data]);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebardata.searchTerm);
    urlParams.set('type', sidebardata.type);
    urlParams.set('parking', sidebardata.parking);
    urlParams.set('furnished', sidebardata.furnished);
    urlParams.set('offer', sidebardata.offer);
    urlParams.set('sort', sidebardata.sort);
    urlParams.set('order', sidebardata.order);
    navigate(`/search?${urlParams.toString()}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');
  
    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true',
        furnished: furnishedFromUrl === 'true',
        offer: offerFromUrl === 'true',
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchListings = async () => {
      try {
        setShowMore(false);
        setLoading(true);
        const str = urlParams.toString();
        console.log(str);
        const res = await fetch(
          `${baseUrl}/test/gettingListening?${str}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          }
        );
        const data = await res.json();
        if (data.success === false) {
          setError(data.message || 'Something went wrong');
          setListings([]);
          setLoading(false)
        } else {
          setListings(data);
          if (data.length >8) {
            setShowMore(true);
          }else{
            setShowMore(false)
          }
        
        }
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(err.message || 'Failed to fetch');
      }
    };

    fetchListings();
  }, [location.search]);

  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Search Term:</label>
            <input
              id='searchTerm'
              type='text'
              value={sidebardata.searchTerm}
              onChange={handleChange}
              placeholder='Search...'
              className='border rounded-lg p-3 w-full'
            />
          </div>

          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Type</label>
            {['all', 'rent', 'sale'].map((type) => (
              <div key={type} className='flex gap-2'>
                <input
                  id={type}
                  type='checkbox'
                  checked={sidebardata.type === type}
                  onChange={handleChange}
                  className='w-5'
                />
                <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
              </div>
            ))}
            <div className='flex gap-2'>
              <input
                id='offer'
                type='checkbox'
                checked={sidebardata.offer}
                onChange={handleChange}
                className='w-5'
              />
              <span>Offer</span>
            </div>
          </div>

          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Amenities</label>
            {['parking', 'furnished'].map((item) => (
              <div key={item} className='flex gap-2'>
                <input
                  id={item}
                  type='checkbox'
                  checked={sidebardata[item]}
                  onChange={handleChange}
                  className='w-5'
                />
                <span>{item.charAt(0).toUpperCase() + item.slice(1)}</span>
              </div>
            ))}
          </div>

          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Sort:</label>
            <select
              id='sort_order'
              onChange={handleChange}
              defaultValue='createdAt_desc'
              className='border rounded-lg p-3'
            >
              <option value='regularPrice_desc'>Price High to Low</option>
              <option value='regularPrice_asc'>Price Low to High</option>
              <option value='created_at_desc'>Latest</option>
              <option value='created_at_asc'>Oldest</option>
            </select>
          </div>
          
          <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
            {loading ? "Loading......" :"Search"}
          </button>
        </form>
      </div>

      {/* Right Side */}
      <div className=' flex-1'>
        <h1 className='text-3xl font-semibold p-3 text-slate-700 mt-5'>
          Listings:
        </h1>
        <div className='p-7 flex flex-wrap gap-4'>
          { !loading && listings.length === 0 && (
            <p className='text-2xl uppercase text-center '>No Listening found</p>
          )}
          
          
           { 
           
           !loading && listings && listings.map((listen)=>(
            
             <ListenItem key={listen._id} listen ={listen}  />
           )
          )}
          {
            loading && (
              <p className='text-2xl text-center line-clamp-1'>Loading.....</p>
            )
          }
          {
            showMore && (
              <button
              onClick={()=>handleShowMore()}
              className='cursor-pointer text-red-500 hover:underline uppercase'
              >
                Show more
              </button>
            )
          }
        </div>
      </div>
    </div>
  );
}

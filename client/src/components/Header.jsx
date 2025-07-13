import {FaSearch} from 'react-icons/fa'
import {Link,useNavigate} from 'react-router-dom'
import {useSelector} from 'react-redux';
import { useEffect, useState } from 'react';
export default function Header() {
  useEffect(()=>{
   const urlParams = new URLSearchParams(location.search);
   const searchTermFromUrl = urlParams.get('searchTerm');
   if (searchTermFromUrl) {
    setSearchTerm(searchTermFromUrl);
   }
  },[location.search]);
  const {currentUser} = useSelector(state=>state.user);
  const [searchTerm,setSearchTerm] = useState("");
  const Navigate =useNavigate();
  const handleSubmit = (e) =>{
   e.preventDefault();
   const urlParsms = new URLSearchParams(window.location.search);
   urlParsms.set('setSearchTerm',setSearchTerm);
   const searchQuerry = urlParsms.toString();
   Navigate(`/search?${searchQuerry}`);
  }
  return (
    <header className='bg-slate-200 shadow-md'>
     <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
           <Link to = '/'>
        <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
            <span className='text-slate-500'>
                Sahand
            </span>
             <span className='text-slate-700'>
                Estate
            </span>
        </h1>
        </Link>
        <form onSubmit={handleSubmit} className='bg-slate-100 p-3 rounded-xl flex justify-center'>
        <input 
        type="text "
         value={searchTerm}
         onChange={(e)=>setSearchTerm(e.target.value)}
         className='bg-transparent focus:outline-none sm:w-64 '
          placeholder='Search...' />
          <button>

        <FaSearch className='text-slate-600'/>
          </button>
        </form>
        <ul className='flex gap-4'>
            <Link to="/">
            <li className='hidden sm:inline hover:underline'>Home</li>
            </Link>
            <Link to="/About">
            <li className='hidden sm:inline hover:underline' >About</li>
            </Link>
             <Link to="/Profile">
             { currentUser ?(
                <img className='rounded-full object-cover h-7' src={currentUser.avatar} alt="profile" />
             ) :(
              <li className=' hover:underline'>Sign in</li>
             )
             }
            
            </Link>
        </ul>
     </div>
    </header>
  )
}

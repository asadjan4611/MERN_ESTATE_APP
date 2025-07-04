import {FaSearch} from 'react-icons/fa'
import {Link} from 'react-router-dom'
import {useSelector} from 'react-redux';
export default function Header() {
  const {currentUser} = useSelector(state=>state.user);
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
        <form className='bg-slate-100 p-3 rounded-xl flex justify-center'>
        <input type="text " className='bg-transparent focus:outline-none sm:w-64 ' placeholder='Search...' />
        <FaSearch className='text-slate-600'/>
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

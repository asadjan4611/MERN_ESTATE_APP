import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';

export default function ListingItem({ listen }) {
  return (
    <div className='bg-white flex flex-row shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[270px]'>
      <Link to={`/listening/${listen._id}`}>
      {/* navigate(`/listening/${data._id}`); */}
        <img
          src={
            listen.imageUrl[0] || "https://images.unsplash.com/photo-1752352343628-5067de7bb84f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxNHx8fGVufDB8fHx8fA%3D%3D"
          }
        //   alt='https://images.unsplash.com/photo-1750263147723-ebd447918d89?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8'
          className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300'
        />
        <div className='p-3 flex flex-col gap-2 w-full'>
          <p className='truncate text-lg font-semibold text-slate-700'>
            {listen.name}
          </p>
          <div className='flex items-center gap-1'>
            <MdLocationOn className='h-4 w-4 text-green-700' />
            <p className='text-sm text-gray-600 truncate w-full'>
              {listen.address}
            </p>
          </div>
          <p className='text-sm text-gray-600 line-clamp-2'>
            {listen.description}
          </p>
          <p className='text-slate-500 mt-2 font-semibold '>
            $
            {listen.offer
              ? listen.discountPrice.toLocaleString('en-US')
              : listen.regularPrice.toLocaleString('en-US')}
            {listen.type === 'rent' && ' / month'}
          </p>
          <div className='text-slate-700 flex gap-4'>
            <div className='font-bold text-xs'>
              {listen.bedrooms > 1
                ? `${listen.bedrooms} beds `
                : `${listen.bedrooms} bed `}
            </div>
            <div className='font-bold text-xs'>
              {listen.bathrooms > 1
                ? `${listen.bathrooms} baths `
                : `${listen.bathrooms} bath `}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
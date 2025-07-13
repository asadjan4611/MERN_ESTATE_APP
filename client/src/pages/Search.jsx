import  React  from "react";

export default function Search() {
    return(
        <div className="flex flex-col md:flex-row">
            <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
          <form className="flex flex-col gap-8" >
            <div className="flex  item-center gap-3">
             <label className="whitespace-nowrap mt-7 font-semibold">Search Term:</label>
             <input
             placeholder="Search......"
             id="search"
             className=" mt-5 w-full rounded-lg p-3 border"
              type="text" />
              </div>
              <div className="flex gap-2 flex-wrap item-center">
              <label className="font-semibold">Type</label>
              <div className="flex gap-2">
                <input 
                id="all"
                className="w-5"
                type="checkbox" />
                <span>Rent & Sale</span>
              </div>

              <div className="flex gap-2">
                <input 
                id="sale"
                className="w-5"
                type="checkbox" />
                <span>Sale</span>
              </div>

              <div className="flex gap-2">
                <input 
                id="rent"
                className="w-5"
                type="checkbox" />
                <span>Rent</span>
              </div>

              <div className="flex gap-2">
                <input 
                id="offer"
                className="w-5"
                type="checkbox" />
                <span>Offer</span>
              </div>
              </div>


              <div className="flex gap-2 flex-wrap item-center">
              <label className="font-semibold">Amenties</label>
              <div className="flex gap-2">
                <input 
                id="parkin"
                className="w-5"
                type="checkbox" />
                <span>Parking</span>
              </div>

              <div className="flex gap-2">
                <input 
                id="furnished"
                className="w-5"
                type="checkbox" />
                <span>Furnished</span>
              </div>

              </div>


              <div className="flex items-center gap-2">
                <label className="font-semibold">Sort:</label>
                <select className="border rounded-lg p-3 " id="sort_order">
                    <option >Price High to Low</option>
                    <option >Price low to High</option>
                    <option >Latest</option>
                    <option >Oldest</option>
                    
                </select>
              </div>
              <button className="bg-slate-700 rounded-lg text-white item-center uppercase p-3">Search</button>
          </form>
            </div>
            {/* Right Side Start from here */}
            <div className="">
            <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">Listening Results:</h1>
            </div>
        </div>
    )
}
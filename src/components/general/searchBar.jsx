/* eslint-disable react-hooks/set-state-in-effect */
'use client'
import { useSearchStore } from '@/store/useSearchStore';
import React, { useEffect, useState } from 'react';
import {usePathname} from 'next/navigation';

const SearchBar = () => {
 const {open, setOpen, search, setSearch} = useSearchStore()
 

 const pathname = usePathname();

 const visible = pathname ==="/shop";


  return open && visible && (
    <div className='mt-15 bg-white border-t border-b border-gray-100 text-center transition-all duration-500 ease-in-out'>
      <div className='container mx-auto px-8 md:px-6 py-3 md:py-6 relative'>
        
        {/* Main Search Input Container */}
        <div className='inline-flex items-center justify-center border-b-2 border-gray-900 w-full max-w-3xl group focus-within:border-indigo-600 transition-all duration-300'>
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='flex-1 outline-none bg-transparent text-base  tracking-tight placeholder:text-gray-200 py-4' 
            type="text" 
            placeholder='Search our collection...' 
            autoFocus
          />
          
          {/* Search Icon inside the bar */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-300 group-focus-within:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Close Button - Positioned to the right */}
        <div 
          onClick={() => setOpen(false)}
          className='absolute top-1/2 -translate-y-1/2 right-0 md:right-10 cursor-pointer p-2 text-gray-400 hover:text-red-500 transition-colors'
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getProduct } from '@/lib/api'
import ItemCard from '@/components/general/ItemCard'
import SkeletonShop from '@/components/skeleton/SkeletonShop'

const JalabiyaPage = () => {
  const [jalabiyaProducts, setJalabiyaProducts] = useState([]);
  const [sortType, setSortType] = useState('relavent');

   const loadProducts = async () =>{
      const data = await getProduct();
      const jalabiyaData = data.product;
  
      const filterJalabiya = jalabiyaData.filter((item)=> item.subCategory === "Jalabiya");
  
      setJalabiyaProducts(filterJalabiya);
  
    }
  
    
  
    const sortProduct = () =>{
      let fCopy = jalabiyaProducts.slice()
  
      switch(sortType){
          case "low-high":
              setJalabiyaProducts(fCopy.sort((a,b)=> a.price - b.price));
              break;
          case "high-low":
              setJalabiyaProducts(fCopy.sort((a,b)=> b.price - a.price));
              break;
          default:
          jalabiyaProducts;
          break;
      }
    }
  
  
  
  
    useEffect(()=>{
      loadProducts();
    }, []);
   
    useEffect(()=>{
       sortProduct();
    }, [sortType]);
    

  
  
  return (
    <div className='pt-24 pb-16 px-6 max-w-7xl mx-auto'>
      
      {/* --- BREADCRUMBS --- */}
      <div className='flex gap-2 text-xs uppercase tracking-widest text-gray-400 mb-10'>
        <Link href="/" className='hover:text-indigo-600 transition-colors'>Home</Link>
        <span>/</span>
        <Link href="/shop" className='hover:text-indigo-600 transition-colors'>Shop</Link>
        <span>/</span>
        <span className='text-gray-900 font-bold'>Jalabiya</span>
      </div>

      {/* --- CATEGORY HEADER --- */}
      <div className='flex flex-col md:flex-row justify-between items-end gap-6 mb-6 md:mb-12 border-b border-gray-100 pb-5 md:pb-10'>
        <div className='max-w-2xl'>
            <h1 className='text-4xl md:text-6xl font-bold font-prata text-gray-900 uppercase leading-tight'>
                The <span className='text-indigo-600 italic font-light wh'>Jalabiya</span> Series
            </h1>
            <p className='text-gray-500 mt-4 text-sm md:text-base leading-relaxed'>
                Traditional silhouettes reimagined for the modern world. Our Jalabiyas offer unparalleled comfort without compromising on presence. Meticulously tailored for a clean, flowing drape.
            </p>
        </div>

        <div className='flex items-center gap-4'>
            <p className='text-xs font-bold uppercase tracking-widest text-gray-400'>{jalabiyaProducts.length} Products</p>
            <select 
                onChange={(e) => setSortType(e.target.value)} 
                className='border border-gray-200 text-[10px] font-bold uppercase tracking-widest px-4 py-3 focus:outline-none focus:border-indigo-600'
            >
                <option value="relavent">Sort: Relevant</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
            </select>
        </div>
      </div>

      {/* --- PRODUCT GRID --- */}
      <div className='grid grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-8 gap-y-8 md:gap-y-16'>
        {jalabiyaProducts.length === 0 ? Array.from({length: 6}).map((_, index)=>(
          <SkeletonShop key={index}/>
        )) : jalabiyaProducts.map((item) => (
          <ItemCard key={item._id} id={`/product/${item._id}`} image={item.image[0]} name={item.name} price={item.price} category={item.category} subCategory={item.subCategory}/>
        ))}
      </div>

      {/* --- EMPTY STATE --- */}
      {jalabiyaProducts.length === 0 && (
        <div className='py-32 text-center'>
            <p className='text-gray-400 font-prata italic text-lg'>Exploring new fabrics. Check back soon.</p>
        </div>
      )}

    </div>
  )
}

export default JalabiyaPage
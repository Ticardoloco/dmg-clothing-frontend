/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import ItemCard from '@/components/general/ItemCard'
import { getProduct } from '@/lib/api'
import SkeletonShop from '@/components/skeleton/SkeletonShop'

const AgbadaPage = () => {
  const [agbadaProducts, setAgbadaProducts] = useState([]);
  const [sortType, setSortType] = useState('relavent');


  const loadProducts = async () =>{
    const data = await getProduct();
    const AgbadaData = data.product;

    const filterAgada = AgbadaData.filter((item)=> item.subCategory === "Agbada");

    setAgbadaProducts(filterAgada);

  }

  

  const sortProduct = () =>{
    let fCopy = agbadaProducts.slice()

    switch(sortType){
        case "low-high":
            setAgbadaProducts(fCopy.sort((a,b)=> a.price - b.price));
            break;
        case "high-low":
            setAgbadaProducts(fCopy.sort((a,b)=> b.price - a.price));
            break;
        default:
        agbadaProducts;
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
        <Link href="/" className='hover:text-indigo-600'>Home</Link>
        <span>/</span>
        <Link href="/shop" className='hover:text-indigo-600'>Shop</Link>
        <span>/</span>
        <span className='text-gray-900 font-bold'>Agbada</span>
      </div>

      {/* --- CATEGORY HEADER --- */}
      <div className='flex flex-col md:flex-row justify-between items-end gap-6 mb-6 md:mb-12 border-b border-gray-100 pb-5 md:pb-10'>
        <div className='max-w-2xl'>
            <h1 className='text-4xl md:text-6xl font-bold font-prata text-gray-900 uppercase leading-tight'>
                The <span className='text-indigo-600 italic font-light'>Agbada</span> Series
            </h1>
            <p className='text-gray-500 mt-4 text-sm md:text-base leading-relaxed'>
                The pinnacle of African prestige. Our Agbada collection combines voluminous traditional silhouettes with modern embroidery techniques, designed for the man who commands respect in every room.
            </p>
        </div>

        <div className='flex items-center gap-4'>
            <p className='text-xs font-bold uppercase tracking-widest text-gray-400'>{agbadaProducts?.length} Products</p>
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
      <div className='grid grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-8  gap-y-8 md:gap-y-16'>
        {agbadaProducts.length === 0 ? Array.from({length: 6}).map((_, index)=>(
          <SkeletonShop key={index}/>
        )) : agbadaProducts?.map((item) => (
          <ItemCard key={item._id} id={`/product/${item._id}`} category={item.category} subCategory={item.subCategory} name={item.name} price={item.price} image={item.image[0]}/>
        ))}
      </div>

      {/* --- EMPTY STATE (If no products) --- */}
      {agbadaProducts?.length === 0 && (
        <div className='py-20 text-center'>
            <p className='text-gray-400 font-prata italic'>No Agbada styles found in this collection.</p>
        </div>
      )}

    </div>
  )
}

export default AgbadaPage
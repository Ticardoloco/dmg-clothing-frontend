/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getProduct } from '@/lib/api'
import ItemCard from '@/components/general/ItemCard'
import SkeletonShop from '@/components/skeleton/SkeletonShop'

const CargoPage = () => {
  const [sortType, setSortType] = useState('relevant');
  const [cargoProducts, setCargoProduct] = useState([]);

  const loadProduct = async () =>{
        const data = await getProduct();
        const cargoData = data.product;

        const filterProducts = cargoData.filter((item)=> item.subCategory === "Cargo pants");

        setCargoProduct(filterProducts);
    };

    const sortProducts = () =>{
        let fCopy = cargoProducts.slice();

        switch(sortType){
            case "low-high":
                setCargoProduct(fCopy.sort((a,b)=> a.price - b.price));
                break;
            case "high-low":
                setCargoProduct(fCopy.sort((a,b)=> b.price - a.price));
               break;
            default:
                cargoProducts; 
                break;
        }
    }


    useEffect(()=>{
        loadProduct();
    },[])
  
    useEffect(()=>{
        sortProducts()
    }, [sortType])

 

  return (
    <div className='pt-24 pb-16 px-6 max-w-7xl mx-auto'>
      
      {/* --- BREADCRUMBS --- */}
      <div className='flex gap-2 text-xs uppercase tracking-widest text-gray-400 mb-10'>
        <Link href="/" className='hover:text-indigo-600 transition-colors'>Home</Link>
        <span>/</span>
        <Link href="/shop" className='hover:text-indigo-600 transition-colors'>Shop</Link>
        <span>/</span>
        <span className='text-gray-900 font-bold'>Cargo Pants</span>
      </div>

      {/* --- CATEGORY HEADER --- */}
      <div className='flex flex-col md:flex-row justify-between items-end gap-6 mb-6 md:mb-12 border-b border-gray-100 pb-5 md:pb-10'>
        <div className='max-w-2xl'>
            <h1 className='text-4xl md:text-6xl font-bold font-prata text-gray-900 uppercase leading-tight'>
                The <span className='text-indigo-600 italic font-light'>Cargo</span> Series
            </h1>
            <p className='text-gray-500 mt-4 text-sm md:text-base leading-relaxed'>
                Form meets function. Our cargo series redefines utility with tailored fits and reinforced construction. Whether you&apos;re navigating the city or the outdoors, do it with effortless style and total capability.
            </p>
        </div>

        <div className='flex items-center gap-4'>
            <p className='text-xs font-bold uppercase tracking-widest text-gray-400'>{cargoProducts.length} Products</p>
            <select 
                onChange={(e) => setSortType(e.target.value)} 
                className='border border-gray-200 text-[10px] font-bold uppercase tracking-widest px-4 py-3 focus:outline-none focus:border-indigo-600'
            >
                <option value="relevant">Sort: Relevant</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
            </select>
        </div>
      </div>

      {/* --- PRODUCT GRID --- */}
      <div className='grid grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-8 gap-y-8 md:gap-y-16'>
        {cargoProducts.length === 0 ? Array.from({length:6}).map((_, index)=>(
            <SkeletonShop key={index}/>
        )) : cargoProducts.map((item) => (
         <ItemCard key={item._id} id={`/product/${item._id}`} name={item.name} image={item.image[0]} price={item.price} category={item.category} subCategory={item.subCategory}/>
        ))}
      </div>

      {/* --- EMPTY STATE --- */}
      {cargoProducts.length === 0 && (
        <div className='py-32 text-center'>
            <p className='text-gray-400 font-prata italic text-lg'>Exploring new fabrics. Check back soon.</p>
        </div>
      )}

    </div>
  )
}

export default CargoPage
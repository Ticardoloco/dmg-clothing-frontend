'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import ProductCard from '@/components/general/ProductCard'
import { getProduct } from '@/lib/api'
import { set } from 'react-hook-form'
import { useSearchStore } from '@/store/useSearchStore'
import SkeletonCard from '@/components/skeleton/SkeletonCard'

const ShopPage = () => {
  const [ products, setProducts] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [sortType, setSortType] = useState('relevant');
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const {search, open} = useSearchStore();

  
    const loadProducts = async () =>{
      const data = await getProduct()

      setProducts(data.product);
    }

    
  



  

  
  
  const toggleCategory = (e) =>{
    
    if(category.includes(e.target.value)){
      setCategory((prev)=> prev.filter((item)=> item !== e.target.value))
    } else{
      setCategory((prev)=> [...prev, e.target.value])
    }  
  }

  const toggleSubCategory = (e) =>{
    if (subCategory.includes(e.target.value)) {
      setSubCategory((prev)=> prev.filter((item)=> item !== e.target.value));
    } else {
      setSubCategory((prev)=> [...prev, e.target.value])
    }
  }

  const applyFilter = () =>{
    let productCopy = products.slice();

    if (search && open) {
      productCopy = productCopy.filter((item)=> item.name.toLowerCase().includes(search.toLowerCase()))
    }

    if (category.length > 0) {
      productCopy = productCopy.filter((item)=> category.includes(item.category));
    }

    if (subCategory.length > 0) {
      productCopy = productCopy.filter((item) => subCategory.includes(item.subCategory));
    }

    setFilterProducts(productCopy);
  }


  const sortProducts = () =>{
    let fpCopy = filterProducts.slice()

    switch (sortType){
      case "low-high":
        setFilterProducts(fpCopy.sort((a, b)=> a.price - b.price) );
        break;
      case "high-low":
        setFilterProducts(fpCopy.sort((a, b)=> b.price - a.price));
        break;
      default:
        applyFilter()
        break;

    }
  }
  
  useEffect(()=>{
    loadProducts()
    applyFilter()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[category, subCategory, search, products])

  useEffect(()=>{
    sortProducts()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[sortType, products])




  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-24 border-t border-gray-100 px-6 max-w-7xl mx-auto'>
      
      {/* --- FILTER SIDEBAR --- */}
      <div className='min-w-60'>
        <p onClick={() => setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2 uppercase font-prata font-bold'>
          Filters
          <Image width={12} height={12} src="/dropdown.png" className={`h-3 sm:hidden transition-transform ${showFilter ? 'rotate-90' : ''}`} alt="" />
        </p>

        {/* Category Filter */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-bold uppercase tracking-widest'>Categories</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            {['Top', 'Bottom', 'Full'].map((item) => (
              <p key={item} className='flex gap-2 items-center'>
                <input className='w-3 accent-indigo-600 cursor-pointer' type="checkbox" value={item} onChange={toggleCategory}/> {item}
              </p>
            ))}
          </div>
        </div>

        {/* SubCategory Filter */}
        <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-bold uppercase tracking-widest'>Type</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            {['Agbada', 'Kaftan', 'Vintage', 'Jalabiya', 'Cargo pants', 'Jacket'].map((item) => (
              <p key={item} className='flex gap-2 items-center'>
                <input className='w-3 accent-indigo-600 cursor-pointer' type="checkbox" value={item} onChange={toggleSubCategory} /> {item}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* --- PRODUCT GRID SIDE --- */}
      <div className='flex-1'>
        
        <div className='flex justify-between text-base sm:text-2xl mb-4 items-center'>
          <h2 className='font-prata uppercase font-bold text-gray-700'>
            All <span className='text-indigo-600 italic font-light'>Collections</span>
          </h2>

          {/* Product Sort */}
          <select onChange={(e) => setSortType(e.target.value)} className='border-2 border-gray-300 text-sm px-2 py-2 rounded-sm focus:outline-none focus:border-indigo-600 cursor-pointer'>
            <option value="relavent">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        {/* Map Products */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-8 mt-8'>
          {products.length === 0 ? Array.from({length: 12}).map((_, index)=>(
            <SkeletonCard key={index}/>
          )): filterProducts.map((item) => (
           <ProductCard key={item._id} id={`/product/${item._id}`} name={item.name} price={item.price} subCategory={item.subCategory} image={item.image[0]}/>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ShopPage
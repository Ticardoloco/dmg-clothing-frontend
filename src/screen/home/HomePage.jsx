"use client"
import BestSeller from '@/components/home/BestSeller'
import BrandFeatures from '@/components/home/BrandFeatures'
import Hero from '@/components/home/Hero'
import LatestCollection from '@/components/home/LatestCollection'
import { getProduct } from '@/lib/api'
import React, {useState, useEffect} from 'react'

const HomePage = () => {
  const [products, setProducts] = useState([]); 
   useEffect(()=>{
      const loadProduct = async () =>{
        try {
          const data = await getProduct();
  
        const dataProducts = data.product;
  
        setProducts(dataProducts);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      }
  
      loadProduct();
     },[])
  return (
    <div className='w-full'>
      <Hero/>
      <LatestCollection products={products}/>
      <BestSeller products={products}/>
      <BrandFeatures/>
    </div>
  )
}

export default HomePage

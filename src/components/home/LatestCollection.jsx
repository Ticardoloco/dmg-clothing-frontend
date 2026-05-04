'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '../general/ProductCard';
import { getProduct } from '@/lib/api';
import SkeletonCard from '../skeleton/SkeletonCard';

const LatestCollection = () => {
 const [products, setProducts] = useState([]);

 useEffect(()=>{
  const loadProducts = async ()=>{
    const data = await getProduct();
    setProducts(data.product)
  }

  loadProducts()
 })
 

  return (
    <section className="pb-20 bg-white text-gray-900">
      <div className="container mx-auto px-6">
        
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-prata text-gray-900 mb-4">
            Latest <span className="text-indigo-600 italic font-light">Collection</span>
          </h2>
          <div className="w-20 h-1 bg-indigo-600 mx-auto mb-6"></div>
          <p className="text-gray-500 max-w-lg mx-auto text-sm md:text-base tracking-wide uppercase">
            Discover our newest arrivals, blending heritage craftsmanship with contemporary style.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {products.length === 0 ? Array.from({length: 10}).map((_, index)=>(
            <SkeletonCard key={index}/>
          )) : (products.toReversed().slice(0,10).map((product) => (
           <ProductCard key={product._id} image={product.image[0]} id={`/product/${product._id}`} name={product.name} subCategory={product.subCategory} price={product.price}/>
          )))}

          
        </div>

        {/* View All Button */}
        <div className="mt-20 text-center">
          <Link 
            href="/shop" 
            className="inline-block px-12 py-4 border border-black text-black font-bold text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300"
          >
            View Entire Shop
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestCollection;
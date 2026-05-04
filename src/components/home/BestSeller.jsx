'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getProduct } from '../../lib/api';
import SkeletonCard from '../skeleton/SkeletonCard';

const BestSeller = () => {
   const [bestSellers, setBestSellers] = useState([]);

   useEffect(()=>{
    const loadProduct = async () =>{
      const data = await getProduct();

      const dataProducts = data.product;
      const productFilter = dataProducts.filter((item)=> item.bestSeller === true);

      setBestSellers(productFilter);
    }

    loadProduct();
   },[])
  return (
    <section className="py-8 sm:py-16 bg-gray-50/50">
      <div className="container mx-auto px-6">
        
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-prata text-gray-900 mb-4 uppercase tracking-tight">
            Best <span className="text-indigo-600 italic font-light">Sellers</span>
          </h2>
          <div className="w-16 h-1 bg-indigo-600 mx-auto mb-6"></div>
          <p className="text-gray-500 max-w-lg mx-auto text-xs md:text-sm tracking-[0.2em] uppercase leading-relaxed">
            Our community&apos;s most-loved pieces, handpicked for quality and timeless style.
          </p>
        </div>

        {/* Best Seller Grid - 5 Columns on Desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {bestSellers.length === 0 ? Array.from({length: 5}).map((_, index)=>(
            <SkeletonCard key={index}/>
          )) : bestSellers.slice(0,5).map((product) => (
            <Link 
              key={product._id} 
              href={`/product/${product._id}`} 
              className="group block"
            >
              {/* Image Container */}
              <div className="relative aspect-3/4 overflow-hidden bg-white rounded-sm mb-4 shadow-sm">
                <Image
                  src={product.image[0]}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                
                {/* Best Seller Badge */}
                <div className="absolute top-3 left-3 bg-indigo-600 text-white text-[8px] font-bold uppercase tracking-widest px-2 py-1 z-10">
                  Best Seller
                </div>

                {/* Subtle Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
              </div>

              {/* Product Info */}
              <div className="">
                <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-[0.15em] mb-1">
                  {product.subCategory}
                </p>
                <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors duration-300 uppercase tracking-tighter">
                  {product.name}
                </h3>
                <div className="">
                    <p className="text-gray-900 font-bold text-sm">
                        ₦{product.price.toLocaleString()}
                    </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSeller;
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const ProductCard = ({id, name, image, subCategory, price}) => {
  return (
     <Link 
              href={id} 
              className="group block"
            >
              {/* Image Container */}
              <div className="relative aspect-3/4 overflow-hidden bg-gray-100 rounded-sm mb-4">
                <Image
                  src={image}
                  alt={name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Subtle overlay hint */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
              </div>

              {/* Product Info */}
              <div className="text-center sm:text-left">
                <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest mb-1">
                  {subCategory}
                </p>
                <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                  {name}
                </h3>
                <p className="text-gray-900 font-bold text-sm">
                  ₦{price.toLocaleString()}
                </p>
              </div>
            </Link>
  )
}

export default ProductCard

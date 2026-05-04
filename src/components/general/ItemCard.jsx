import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const ItemCard = ({id, image, subCategory, name, price, category}) => {
  return (
    <Link href={id} className='group'>
            <div className='relative aspect-3/4 overflow-hidden bg-gray-50 mb-4'>
              <Image 
                src={image} 
                alt={name} 
                fill 
                className='object-cover transition-transform duration-1000 group-hover:scale-105'
              />
              {/* Badge for Material */}
              <div className='absolute bottom-4 left-4'>
                <p className='bg-white/90 backdrop-blur-sm text-[9px] font-bold px-3 py-1 uppercase tracking-widest shadow-sm'>
                  {subCategory}
                </p>
              </div>
            </div>

            <div className='flex justify-between items-start'>
                <div>
                    <h3 className='text-sm font-bold uppercase tracking-tight text-gray-800 group-hover:text-indigo-600 transition-colors'>
                        {name}
                    </h3>
                    <p className='text-gray-500 text-xs mt-1 uppercase tracking-widest'>{category}</p>
                </div>
                <p className='text-sm font-bold text-gray-900'>₦{price.toLocaleString()}</p>
            </div>
          </Link>
  )
}

export default ItemCard

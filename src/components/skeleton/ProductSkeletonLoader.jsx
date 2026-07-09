import React from 'react';
import Skeleton from 'react-loading-skeleton';
import "react-loading-skeleton/dist/skeleton.css";

const ProductPageSkeleton = () => {
  return (
    <div className='pt-14 md:pt-28 pb-8 md:pb-16 px-6 max-w-7xl mx-auto'>
      <div className='flex flex-col md:flex-row gap-12 lg:gap-20'>

        {/* --- LEFT: PRODUCT IMAGES SKELETON --- */}
        <div className='w-full md:w-1/2 flex flex-col md:flex-row-reverse gap-4'>
          {/* Main Hero Image Placeholder */}
          <div className='relative aspect-3/4 w-full bg-gray-50 border border-gray-100'>
            <Skeleton height="100%" containerClassName="h-full block" />
          </div>
          
          {/* Thumbnail Strip Placeholders */}
          <div className='flex flex-row md:flex-col gap-4'>
            {[1, 2, 3].map((idx) => (
              <div key={idx} className='relative w-24 aspect-3/4'>
                <Skeleton height="100%" containerClassName="h-full block" />
              </div>
            ))}
          </div>
        </div>

        {/* --- RIGHT: PRODUCT DETAILS SKELETON --- */}
        <div className='w-full md:w-1/2 flex flex-col gap-6'>
          <div>
            {/* Subcategory Hint */}
            <Skeleton width={100} height={14} className="mb-2" />
            {/* Title Block */}
            <Skeleton width="85%" height={38} />
            {/* Price Tag */}
            <Skeleton width={130} height={28} className="mt-4" />
          </div>

          {/* Description Paragraph Blocks */}
          <div className='max-w-md space-y-2'>
            <Skeleton count={3} height={16} />
            <Skeleton width="65%" height={16} />
          </div>

          {/* Sizing Matrix Grid Mock */}
          <div className='mt-4 flex flex-col gap-3'>
            <Skeleton width={90} height={12} />
            <div className='flex gap-3'>
              {[1, 2, 3, 4].map((idx) => (
                <Skeleton key={idx} width={48} height={48} />
              ))}
            </div>
          </div>

          {/* Color Blocks Grid Mock */}
          <div className='mt-2 flex flex-col gap-3'>
            <Skeleton width={95} height={12} />
            <div className='flex gap-3'>
              {[1, 2, 3].map((idx) => (
                <Skeleton key={idx} width={82} height={48} />
              ))}
            </div>
          </div>

          {/* Primary Call To Action Button (Add To Cart) */}
          <div className="mt-4">
            <Skeleton width={160} height={52} />
          </div>

          {/* Bottom Informational Accordions */}
          <div className='mt-8 pt-8 border-t border-gray-100 space-y-5'>
            <div className='flex justify-between items-center'>
              <Skeleton width={120} height={14} />
              <Skeleton width={12} height={14} />
            </div>
            <div className='flex justify-between items-center'>
              <Skeleton width={150} height={14} />
              <Skeleton width={12} height={14} />
            </div>
          </div>
        </div>

      </div>

      {/* Brand Features Footer Section */}
      <div className='mt-14 md:mt-28'>
        <Skeleton height={140} />
      </div>
    </div>
  );
};

export default ProductPageSkeleton;
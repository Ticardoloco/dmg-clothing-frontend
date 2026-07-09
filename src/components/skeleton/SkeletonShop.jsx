import React from 'react';
import Skeleton from 'react-loading-skeleton';
import "react-loading-skeleton/dist/skeleton.css";

const SkeletonShop = () => {
  return (
    <div className="flex flex-col gap-3">
      {/* Product Card Image Wrapper Placeholder */}
      <div className="relative aspect-3/4 w-full bg-gray-50 border border-gray-100">
        <Skeleton height="100%" containerClassName="h-full block" />
      </div>

      {/* Product Metadata Info Placeholders */}
      <div className="space-y-1">
        {/* Category tag line */}
        <Skeleton width="40%" height={12} />
        {/* Main Item Name */}
        <Skeleton width="85%" height={16} />
        {/* Price tag */}
        <Skeleton width="30%" height={14} className="mt-1" />
      </div>
    </div>
  );
};

export default SkeletonShop;
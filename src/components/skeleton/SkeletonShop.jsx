import React from 'react'
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";


const SkeletonShop = () => {
  return (
    <div className='w-full h-75 md:h-129.75'>
      <Skeleton className='w-full h-full'/>
      <div className="w-full flex justify-between">
        <div>
            <Skeleton width={160} height={20}/>
            <Skeleton width={70} height={20}/>
        </div>
         <Skeleton width={100} height={20}/>
      </div>
    </div>
  )
}

export default SkeletonShop

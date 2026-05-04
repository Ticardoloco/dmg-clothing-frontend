import React from 'react'
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";


const SkeletonCard = () => {
  return (
    <div className=''>
      <Skeleton width="100%" height={280}/>
      <Skeleton width={120} height={20}/>
      <Skeleton width={160} height={20}/>
      <Skeleton width={100} height={20}/>
    </div>
  )
}

export default SkeletonCard

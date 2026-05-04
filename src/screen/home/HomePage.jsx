import BestSeller from '@/components/home/BestSeller'
import BrandFeatures from '@/components/home/BrandFeatures'
import Hero from '@/components/home/Hero'
import LatestCollection from '@/components/home/LatestCollection'
import React from 'react'

const HomePage = () => {
  return (
    <div className='w-full'>
      <Hero/>
      <LatestCollection/>
      <BestSeller/>
      <BrandFeatures/>
    </div>
  )
}

export default HomePage

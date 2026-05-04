'use client'
import React from 'react'
import Image from 'next/image'
import BrandFeatures from '@/components/home/BrandFeatures'


const AboutPage = () => {
  return (
    <div className='pt-24 pb-8 sm:pb-16'>
      <div className='max-w-7xl mx-auto px-6'>
        
        {/* --- HEADER SECTION --- */}
        <div className='text-center pt-10 mb-10'>
            <h1 className='text-4xl md:text-5xl font-bold font-prata text-gray-900 uppercase tracking-tight'>
                About <span className='text-indigo-600 italic font-light'>Us</span>
            </h1>
            <div className='w-16 h-1 bg-indigo-600 mx-auto mt-4'></div>
        </div>

        {/* --- STORY SECTION --- */}
        <div className='my-10 flex flex-col md:flex-row gap-16 items-center'>
            {/* Image Side */}
            <div className='w-full md:w-1/2 relative aspect-4/5 overflow-hidden shadow-2xl'>
                <Image 
                    src="https://res.cloudinary.com/dyo0bdgnf/image/upload/v1776772113/blue-senator-side_aa5kls.jpg" 
                    alt="Our Heritage" 
                    fill 
                    className='object-cover'
                />
            </div>

            {/* Text Side */}
            <div className='flex flex-col justify-center gap-6 md:w-1/2 text-gray-600'>
                <h2 className='text-2xl font-bold font-prata text-gray-800 uppercase'>Our Heritage & Vision</h2>
                <p>
                    DMG Clothing was born out of a desire to bridge the gap between traditional African heritage and contemporary global fashion. We believe that what you wear is a reflection of your identity, and every stitch in our garments tells a story of culture, craftsmanship, and class.
                </p>
                <p>
                    Since our inception, we have worked tirelessly to source the finest fabrics—from premium silks for our Kaftans to heavy-duty cottons for our Cargo range—ensuring that every piece bearing the DMG name is built to last.
                </p>
                <div className='bg-gray-50 border-l-4 border-indigo-600 p-6 italic'>
                    &quot;Fashion fades, but style is eternal. Our mission is to provide you with the pieces that define your legacy.&quot;
                </div>
                <h3 className='font-bold text-gray-900 uppercase tracking-widest text-sm'>Our Mission</h3>
                <p>
                    To become the premier destination for modern individuals who value tradition but demand contemporary quality. We aim to empower our community through clothing that inspires confidence.
                </p>
            </div>
        </div>

        {/* --- WHY CHOOSE US SECTION --- */}
        <div className='py-10 sm:py-20'>
            <div className='text-center mb-12'>
                <h2 className='text-3xl font-bold font-prata text-gray-800 uppercase'>Why <span className='text-indigo-600'>Choose Us</span></h2>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 border border-gray-200'>
                <div className='border-r border-b md:border-b-0 border-gray-200 px-10 md:px-16 py-12 flex flex-col gap-5 hover:bg-indigo-600 hover:text-white transition-all duration-300 group'>
                    <b className='text-gray-900 group-hover:text-white uppercase tracking-widest'>Quality Assurance:</b>
                    <p className='text-gray-600 group-hover:text-indigo-100 text-sm'>We meticulously select and vet each garment to ensure it meets our stringent quality standards.</p>
                </div>
                <div className='border-r border-b md:border-b-0 border-gray-200 px-10 md:px-16 py-12 flex flex-col gap-5 hover:bg-indigo-600 hover:text-white transition-all duration-300 group'>
                    <b className='text-gray-900 group-hover:text-white uppercase tracking-widest'>Convenience:</b>
                    <p className='text-gray-600 group-hover:text-indigo-100 text-sm'>With our user-friendly interface and hassle-free ordering process, shopping has never been easier.</p>
                </div>
                <div className='px-10 md:px-16 py-12 flex flex-col gap-5 hover:bg-indigo-600 hover:text-white transition-all duration-300 group'>
                    <b className='text-gray-900 group-hover:text-white uppercase tracking-widest'>Exceptional Customer Service:</b>
                    <p className='text-gray-600 group-hover:text-indigo-100 text-sm'>Our team of dedicated professionals is here to assist you the way, ensuring your satisfaction is our top priority.</p>
                </div>
            </div>
        </div>

      </div>
    </div>
  )
}

export default AboutPage
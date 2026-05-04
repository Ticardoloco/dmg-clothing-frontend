import Image from 'next/image'
import Link from 'next/link'
import React from 'react'


const Hero = () => {
  return (
    // <div className='flex flex-col sm:flex-row border border-gray-400'>
    //   <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0">
    //     <div className="text-[#414141]">
    //         <div className="flex items-center gap-2">
    //             <p className="w-8 md:w-11 h-0.5 bg-[#414141]"></p>
    //             <p className="font-medium text-sm md:text-base ">OUR BEST SELLER</p>
    //         </div>

    //         <h1 className="font-prata text-3xl sm:py-3 lg:text-5xl leading-relaxed">Latest Arrivals</h1>

    //         <div className="flex items-center gap-2">
    //             <Link href="/shop" ><p className="font-semibold text-sm md:text-base ">SHOP NOW</p></Link>
    //             <p className="w-8 md:w-11 h-0.5 bg-[#414141] cursor-pointer"></p>
    //         </div>
    //     </div>
    //   </div>
    //   <Image
    //   width={479}
    //   height={383}
    //   src="/main-bg.png"
    //   alt='main bg'
    //   className='w-full sm:w-1/2 h-95.75'
    //   />
    // </div>

    <section className="relative w-full bg-white overflow-hidden text-center sm:text-left">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between py-12 lg:py-24 gap-12">
          
          {/* Left Content: Text & CTA */}
          <div className="w-full lg:w-1/2 space-y-8 z-10">
            <div className="space-y-4">
              <h2 className="text-sm font-bold tracking-widest text-indigo-600 uppercase">
                New Arrivals 2026
              </h2>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight">
                Elevate Your <br /> 
                <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600">
                  Everyday Look
                </span>
              </h1>
              <p className="text-gray-600 text-lg md:text-xl max-w-lg leading-relaxed">
                Experience the perfect blend of comfort and high-street fashion with DMG&apos;s latest seasonal drop.
              </p>
            </div>

            <div className="flex justify-center sm:justify-normal flex-wrap gap-4">
              <Link 
                href="/shop" 
                className="px-10 py-4 bg-gray-900 text-white font-semibold rounded-md hover:bg-gray-800 transition-all shadow-lg hover:shadow-indigo-200/50"
              >
                Shop Collection
              </Link>
              <Link 
                href="/about" 
                className="px-10 py-4 border-2 border-gray-200 text-gray-900 font-semibold rounded-md hover:border-gray-900 transition-all"
              >
                Lookbook
              </Link>
            </div>

            {/* Trust Badges / Stats */}
            <div className="pt-8 flex justify-center sm:justify-items-normal gap-8 border-t border-gray-100">
              <div>
                <p className="text-2xl font-bold text-gray-900">50k+</p>
                <p className="text-sm text-gray-500">Happy Customers</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">100+</p>
                <p className="text-sm text-gray-500">Premium Styles</p>
              </div>
            </div>
          </div>

          {/* Right Content: Image Section */}
          <div className="w-full lg:w-1/2 relative">
            {/* Decorative background circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-100 rounded-full blur-3xl opacity-50 -z-10"></div>
            
            <div className="relative mx-auto overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src="https://res.cloudinary.com/dyo0bdgnf/image/upload/v1776771543/black-senator-straight_i1i2hx.jpg"
                alt="DMG Fashion Model"
                // Using 600x800 for a professional portrait look
                width={600}
                height={800}
                priority // Tells Next.js to load this immediately (LCP)
                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              
              {/* Floating Tag */}
              <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-xl border border-white/20">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Premium Material</p>
                <p className="text-lg font-bold text-gray-900">100% Organic Cotton</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}



export default Hero

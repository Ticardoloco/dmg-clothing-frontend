'use client'
import React from 'react';

const BrandFeatures = () => {
  // Feature Data structured from your image
  const features = [
    {
      title: "Easy Exchange Policy",
      description: "We offer hassle-free exchange on all orders",
      icon: (
        // Simple SVG for Exchange/Transfer (Matches the style of your image)
        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 group-hover:scale-110 transition-transform text-gray-900 group-hover:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      )
    },
    {
      title: "7 Days Return Policy",
      description: "We provide 7 days free return guarantee",
      icon: (
        // Simple SVG for Checkmark/Guarantee (Matches the style of your image)
        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 group-hover:scale-110 transition-transform text-gray-900 group-hover:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      )
    },
    {
      title: "Best Customer Support",
      description: "We provide 24/7 dedicated support team",
      icon: (
        // Simple SVG for Headphones/Support (Matches the style of your image)
        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 group-hover:scale-110 transition-transform text-gray-900 group-hover:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2zM9 12v1M15 12v1M9 16h6" />
        </svg>
      )
    },
  ];

  return (
    <section className="pt-10 sm:pt-20 border-t border-gray-100 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Optional: Add a title for consistency with other homepage sections */}
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-sm font-semibold text-indigo-600 uppercase tracking-widest mb-2">Our Promise</h2>
          <p className="text-4xl md:text-5xl font-bold font-prata text-gray-900 uppercase tracking-tight">
            The DMG <span className="text-indigo-600 italic font-light">Guarantee</span>
          </p>
        </div>

        {/* Features Flex Container (Matches the layout in your image) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-12 lg:gap-16">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group flex flex-col items-center text-center p-6 bg-white hover:bg-gray-50 transition-colors rounded-sm"
            >
              {/* Icon Container with slight elevation */}
              <div className="flex items-center justify-center mb-8 p-6 bg-white shadow-lg group-hover:shadow-xl transition-shadow border border-gray-50">
                {feature.icon}
              </div>

              {/* Title using consistent bold styling */}
              <h3 className="text-base font-bold text-gray-900 uppercase tracking-widest mb-3">
                {feature.title}
              </h3>

              {/* Description (Lightened text, like your image) */}
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandFeatures;
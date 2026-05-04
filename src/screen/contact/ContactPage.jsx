'use client'
import React from 'react'
import Image from 'next/image'

const ContactPage = () => {
  return (
    <div className='pt-24 pb-0 sm:pb-16'>
      <div className='max-w-7xl mx-auto px-6'>
        
        {/* --- HEADER SECTION --- */}
        <div className='text-center pt-6  sm:pt-10 mb-8 sm:mb-16'>
            <h1 className='text-4xl md:text-5xl font-bold font-prata text-gray-900 uppercase tracking-tight'>
                Contact <span className='text-indigo-600 italic font-light'>Us</span>
            </h1>
            <div className='w-16 h-1 bg-indigo-600 mx-auto mt-4'></div>
        </div>

        <div className='flex flex-col md:flex-row justify-center gap-8 sm:gap-16 mb-8 sm:mb-16'>
            
            {/* --- CONTACT DETAILS SIDE --- */}
            <div className='w-full md:w-1/2'>
                <div className='relative aspect-video md:aspect-square overflow-hidden mb-8 shadow-sm'>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.1011257337427!2d3.2460053736497407!3d6.508882323335818!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b858df94ffe13%3A0xf91dc0179c4fb246!2s37%20Oluarikawe%20St%2C%20Alimosho%2C%20Lagos%20100266%2C%20Lagos!5e0!3m2!1sen!2sng!4v1776940155671!5m2!1sen!2sng"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"></iframe>
                </div>
                
                <div className='flex flex-col gap-6 text-gray-600'>
                    <h2 className='text-xl font-bold font-prata text-gray-800 uppercase tracking-widest'>Our Store</h2>
                    <p className='leading-relaxed'>
                        37 Oluarikawe Street, Off Ijagemo Road, Afrugbin B/S <br />
                        Ijegun, Ikotun Lagos, Nigeria
                    </p>
                    <p className='leading-relaxed'>
                        Tel: +234-903-297-0254 <br />
                        Email: admin@dmgclothing.com
                    </p>
                    
                    <h2 className='text-xl font-bold font-prata text-gray-800 uppercase tracking-widest mt-4'>Careers at DMG</h2>
                    <p>Learn more about our teams and job openings.</p>
                    
                    <button className='w-fit border border-black px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300'>
                        Explore Jobs
                    </button>
                </div>
            </div>

            {/* --- CONTACT FORM SIDE --- */}
            <div className='w-full md:w-1/2 bg-gray-50 p-8 md:p-12'>
                <h2 className='text-2xl font-bold font-prata text-gray-900 mb-8 uppercase'>Send us a message</h2>
                
                <form className='flex flex-col gap-6'>
                    <div className='flex flex-col gap-2'>
                        <label className='text-xs font-bold uppercase tracking-widest text-gray-500'>Full Name</label>
                        <input 
                            type="text" 
                            placeholder='Your Name'
                            className='w-full border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:border-indigo-600 transition-colors'
                        />
                    </div>

                    <div className='flex flex-col gap-2'>
                        <label className='text-xs font-bold uppercase tracking-widest text-gray-500'>Email Address</label>
                        <input 
                            type="email" 
                            placeholder='Email@example.com'
                            className='w-full border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:border-indigo-600 transition-colors'
                        />
                    </div>

                    <div className='flex flex-col gap-2'>
                        <label className='text-xs font-bold uppercase tracking-widest text-gray-500'>Message</label>
                        <textarea 
                            rows="4" 
                            placeholder='How can we help you?'
                            className='w-full border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:border-indigo-600 transition-colors resize-none'
                        ></textarea>
                    </div>

                    <button className='bg-black text-white px-10 py-4 text-xs font-bold uppercase tracking-widest hover:bg-indigo-600 transition-colors shadow-lg'>
                        Send Message
                    </button>
                </form>
            </div>
        </div>


      </div>
    </div>
  )
}

export default ContactPage
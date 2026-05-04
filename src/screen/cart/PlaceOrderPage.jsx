/* eslint-disable react-hooks/set-state-in-effect */
'use client'
import BrandFeatures from '@/components/home/BrandFeatures';
import { useCartStore } from '@/store/useCartStore';
import React, { useEffect, useState } from 'react';


const PlaceOrder = () => {
  const [method, setMethod] = useState('cod'); // Default payment method
  const [mounted, setMounted] = useState(false);


  const getTotal = useCartStore((state)=> state.getTotal);

  useEffect(()=>{
    setMounted(true);
  }, []);

  return (
    <div className='pt-28 pb-20 px-6 max-w-7xl mx-auto'>
      
      {/* --- PAGE TITLE --- */}
      <div className='flex items-center gap-4 mb-12'>
        <h1 className='text-2xl md:text-3xl font-bold font-prata uppercase'>
            Delivery <span className='text-indigo-600 italic font-light'>Information</span>
        </h1>
      </div>

      <div className='flex flex-col lg:flex-row gap-16'>
        
        {/* --- LEFT SIDE: SHIPPING FORM --- */}
        <div className='flex-1 flex flex-col gap-6'>
          <div className='grid grid-cols-2 gap-4'>
            <input className='border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-600 transition-all' type="text" placeholder='First name' />
            <input className='border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-600 transition-all' type="text" placeholder='Last name' />
          </div>
          <input className='border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-600 transition-all' type="email" placeholder='Email address' />
          <input className='border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-600 transition-all' type="text" placeholder='Street' />
          <div className='grid grid-cols-2 gap-4'>
            <input className='border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-600 transition-all' type="text" placeholder='City' />
            <input className='border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-600 transition-all' type="text" placeholder='State' />
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <input className='border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-600 transition-all' type="number" placeholder='Zipcode' />
            <input className='border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-600 transition-all' type="text" placeholder='Country' />
          </div>
          <input className='border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-600 transition-all' type="tel" placeholder='Phone' />
        </div>

        {/* --- RIGHT SIDE: PAYMENT & TOTALS --- */}
        <div className='w-full lg:w-112.5'>
          
          {/* Order Totals Card */}
          <div className='bg-gray-50 p-8 rounded-sm mb-8'>
            <h2 className='text-lg font-bold font-prata uppercase mb-6'>Cart Totals</h2>
            <div className='flex flex-col gap-3 text-sm'>
                <div className='flex justify-between text-gray-600'>
                    <span>Subtotal</span>
                    <span>₦{ mounted ? getTotal().toLocaleString() : 0}</span>
                </div>
                <div className='flex justify-between text-gray-600'>
                    <span>Shipping Fee</span>
                    <span>₦10,000</span>
                </div>
                <div className='h-px bg-gray-200 my-2'></div>
                <div className='flex justify-between text-lg font-bold text-gray-900'>
                    <span>Total</span>
                    <span>₦{mounted ? (getTotal() + 10000).toLocaleString(): 0}</span>
                </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className='mt-12'>
            <h2 className='text-sm font-bold uppercase tracking-widest mb-6'>Payment Method</h2>
            <div className='flex flex-col gap-3'>
                
                {/* Stripe/Card Option */}
                <div onClick={() => setMethod('card')} className={`flex items-center gap-4 border px-4 py-3 cursor-pointer transition-all ${method === 'card' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'}`}>
                    <div className={`w-3 h-3 border rounded-full ${method === 'card' ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`}></div>
                    <span className='text-xs font-bold uppercase text-gray-600 tracking-wider'>Paystack (card)</span>
                </div>

                {/* Razorpay Option */}
                <div onClick={() => setMethod('razorpay')} className={`flex items-center gap-4 border px-4 py-3 cursor-pointer transition-all ${method === 'razorpay' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'}`}>
                    <div className={`w-3 h-3 border rounded-full ${method === 'razorpay' ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`}></div>
                    <span className='text-xs font-bold uppercase text-gray-600 tracking-wider'>Razorpay</span>
                </div>

                {/* Cash on Delivery */}
                <div onClick={() => setMethod('cod')} className={`flex items-center gap-4 border px-4 py-3 cursor-pointer transition-all ${method === 'cod' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'}`}>
                    <div className={`w-3 h-3 border rounded-full ${method === 'cod' ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`}></div>
                    <span className='text-xs font-bold uppercase text-gray-600 tracking-wider'>Cash on Delivery</span>
                </div>
            </div>

            <button className='w-full bg-black text-white py-4 mt-10 text-xs font-bold uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-xl'>
                Place Order
            </button>
          </div>
        </div>

      </div>

      {/* --- TRUST FOOTER --- */}
      <div className='mt-24'>
        <BrandFeatures />
      </div>
    </div>
  );
};

export default PlaceOrder;
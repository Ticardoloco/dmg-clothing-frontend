/* eslint-disable react-hooks/set-state-in-effect */
'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { useRouter } from 'next/navigation';



const Cart = () => {
const [mounted, setMounted] = useState(false);

const cart = useCartStore((state) => state.cart);
const increaseQty = useCartStore((state) => state.increaseQty);
const decreaseQty = useCartStore((state) => state.decreaseQty);
const removeItem = useCartStore((state) => state.removeItem);
const clearCart = useCartStore((state) => state.clearCart);
const getTotal = useCartStore((state) => state.getTotal);

const router = useRouter();

useEffect(() => {
  setMounted(true);
}, []);

  return (
    <div className='pt-28 pb-20 px-6 max-w-7xl mx-auto'>
      
      {/* --- HEADER --- */}
      <div className='text-2xl font-bold font-prata uppercase border-b border-gray-100 pb-8 mb-10'>
        Your <span className='text-indigo-600 italic font-light'>Cart</span>
      </div>

      <div className='flex flex-col lg:flex-row gap-16'>
        
        {/* --- LEFT: ITEMS LIST --- */}
        <div className='flex-1 flex flex-col gap-8'>
          {cart.map((item, index) => (
            <div key={index} className='flex gap-6 border-b border-gray-50  group'>
              <div className='relative w-15 h-20 md:w-15 md:h-20 overflow-hidden bg-gray-50'>
                <Image src={item.image} alt={item.name} fill className='object-cover' />
              </div>
              
              <div className='flex-1 flex flex-col justify-between'>
                <div>
                  <div className='flex justify-between items-start'>
                    <h3 className='text-sm font-bold uppercase tracking-tight text-gray-900'>{item.name}</h3>
                    <p className='text-sm font-bold'>₦{item.price.toLocaleString()}</p>
                  </div>
                  <p className='text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1'>Size: {item.size}</p>

                  {item.color && (<p className='text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1'>Color: {item.color}</p>)}
                </div>

                <div className='flex justify-between items-center mt-2'>
                  {/* Simple Quantity Toggle */}
                  <div className='flex border border-gray-200 items-center'>
                    <button onClick={()=> decreaseQty(item._id, item.size, item.color)} className='px-3 py-1 hover:bg-gray-100 transition-colors'>-</button>
                    <span className='px-4 text-xs font-bold'>{item.quantity}</span>
                    <button onClick={()=> increaseQty(item._id, item.size, item.color)} className='px-3 py-1 hover:bg-gray-100 transition-colors'>+</button>
                  </div>
                  
                  {/* Remove Button */}
                  <button onClick={()=> removeItem(item._id, item.size, item.color)} className='text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors'>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          {cart.length > 0 && (
            <button onClick={()=> clearCart()} className="mt-6 inline-block bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-indigo-600 transition-colors">Clear all</button>
          )}

          {cart.length === 0 && (
            <div className='text-center py-20'>
              <p className='font-prata italic text-gray-400'>Your cart is currently empty.</p>
              <Link href="/shop" className='mt-6 inline-block bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-indigo-600 transition-colors'>
                Start Shopping
              </Link>
            </div>
          )}
        </div>

        {/* --- RIGHT: SUMMARY --- */}
        <div className='w-full lg:w-96'>
          <div className='bg-gray-50 p-8 sticky top-32'>
            <h2 className='text-xl font-bold font-prata uppercase mb-6'>Order Summary</h2>
            
            <div className='flex flex-col gap-4 text-sm'>
              <div className='flex justify-between text-gray-600'>
                <span>Subtotal</span>
                <span>₦{mounted ? getTotal().toLocaleString(): 0}</span>
              </div>
              <div className='flex justify-between text-gray-600'>
                <span>Shipping Fee</span>
                <span className='text-[10px] font-bold uppercase text-indigo-600'>₦10,000</span>
              </div>
              <div className='h-px bg-gray-200 my-2'></div>
              <div className='flex justify-between text-lg font-bold text-gray-900'>
                <span>Total</span>
                <span>₦{mounted ? (parseInt(getTotal()) + 10000).toLocaleString() : 0}</span>
              </div>
            </div>

            <button onClick={()=> router.push('place-order')} className='w-full bg-black text-white mt-10 py-5 text-xs font-bold uppercase tracking-[0.2em] hover:bg-indigo-600 transition-colors shadow-lg'>
              Proceed to Checkout
            </button>

            <div className='mt-6 flex flex-col gap-3'>
                <p className='text-[10px] text-center text-gray-400 uppercase tracking-widest'>Secure Payments Guaranteed</p>
                <div className='flex justify-center gap-4 opacity-30 grayscale'>
                    <div className='w-8 h-5 bg-gray-400 rounded-sm' />
                    <div className='w-8 h-5 bg-gray-400 rounded-sm' />
                    <div className='w-8 h-5 bg-gray-400 rounded-sm' />
                </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Cart
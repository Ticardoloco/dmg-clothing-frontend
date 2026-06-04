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
          {cart.map((item, index) => {
            // Read the secure maxStock number directly from the flat object
            const maxAllowedStock = item.maxStock !== undefined ? Number(item.maxStock) : 10;
            const reachedMaxStock = item.quantity >= maxAllowedStock;

            return (
              <div key={index} className='flex gap-6 border-b border-gray-50 group'>
                <div className='relative w-15 h-20 md:w-15 md:h-20 overflow-hidden bg-gray-50'>
                  {item.image && (
                    <Image src={item.image} alt={item.name} fill className='object-cover' />
                  )}
                </div>
                
                <div className='flex-1 flex flex-col justify-between'>
                  <div>
                    <div className='flex justify-between items-start'>
                      <h3 className='text-base md:text-lg font-bold uppercase tracking-tight text-gray-900'>{item.name}</h3>
                      <p className='text-base md:text-lg font-bold'>₦{item.price.toLocaleString()}</p>
                    </div>
                    {item.size && (
                      <p className='text-sm md:text-base font-bold text-indigo-600 uppercase tracking-widest mt-1'>Size: {item.size}</p>
                    )}
                    {item.color && (
                      <p className='text-sm md:text-base font-bold text-indigo-600 uppercase tracking-widest mt-1'>Color: {item.color}</p>
                    )}
                  </div>

                  <div className='flex justify-between items-center mt-2'>
                    {/* Quantity Toggle */}
                    <div className='flex border border-gray-200 items-center'>
                      <button 
                        onClick={() => decreaseQty(item._id, item.size, item.color)} 
                        className='px-3 py-1 hover:bg-gray-100 transition-colors cursor-pointer'
                      >
                        -
                      </button>
                      
                      <span className='px-4 text-base md:text-lg font-bold'>{item.quantity}</span>
                      
                      <button 
                        onClick={() => !reachedMaxStock && increaseQty(item._id, item.size, item.color)} 
                        disabled={reachedMaxStock}
                        className={`px-3 py-1 transition-colors ${
                          reachedMaxStock 
                            ? 'bg-gray-100 text-gray-300 cursor-not-allowed' 
                            : 'hover:bg-gray-100 cursor-pointer'
                        }`}
                      >
                        +
                      </button>
                    </div>
                    
                    {/* Remove Button */}
                    <button onClick={() => removeItem(item._id, item.size, item.color)} className='text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors cursor-pointer'>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {cart.length > 0 && (
            <button onClick={() => clearCart()} className="mt-6 inline-block bg-black text-white px-8 py-4 text-sm md:text-base font-bold uppercase tracking-widest hover:bg-indigo-600 transition-colors cursor-pointer">Clear all</button>
          )}

          {cart.length === 0 && (
            <div className='text-center py-20'>
              <p className='font-prata italic text-gray-400'>Your cart is currently empty.</p>
              <Link href="/shop" className='mt-6 inline-block bg-black text-white px-8 py-4 text-base font-bold uppercase tracking-widest hover:bg-indigo-600 transition-colors'>
                Start Shopping
              </Link>
            </div>
          )}
        </div>

        {/* --- RIGHT: SUMMARY --- */}
        <div className='w-full lg:w-96'>
          <div className='bg-gray-50 p-8 sticky top-32'>
            <h2 className='text-xl font-bold font-prata uppercase mb-6'>Order Summary</h2>
            
            <div className='flex flex-col gap-4 text-base md:text-lg'>
              <div className='flex justify-between text-gray-600'>
                <span>Subtotal</span>
                <span>₦{mounted ? getTotal().toLocaleString() : 0}</span>
              </div>
              <div className='flex justify-between text-gray-600'>
                <span>Shipping Fee</span>
                <span className='text-sm md:text-base font-bold uppercase text-indigo-600'>₦10,000</span>
              </div>
              <div className='h-px bg-gray-200 my-2'></div>
              <div className='flex justify-between text-lg font-bold text-gray-900'>
                <span>Total</span>
                <span>₦{mounted ? (parseInt(getTotal()) + 10000).toLocaleString() : 0}</span>
              </div>
            </div>

            <button onClick={() => router.push('place-order')} className='w-full bg-black text-white mt-10 py-5 text-sm md: font-bold uppercase tracking-[0.2em] hover:bg-indigo-600 transition-colors shadow-lg cursor-pointer'>
              Proceed to Checkout
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Cart;
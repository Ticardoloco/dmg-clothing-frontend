'use client'
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-8 sm:pt-20 pb-3">
      <div className="container mx-auto px-6">
        
        <div className="flex flex-col lg:flex-row justify-between gap-12 mb-16">
          
          {/* Brand & Newsletter Section */}
          <div className="lg:w-1/3">
            <Link className='hidden sm:block' href="/">
              <h2 className="font-bold text-3xl text-black font-prata mb-6">
                DMG<span className="text-base font-semibold text-indigo-600">Clothing</span>
              </h2>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-sm">
              Crafting premium traditional and contemporary attire for the modern individual. Quality, heritage, and style in every stitch.
            </p>
            
            {/* Simple Newsletter */}
            <div className="flex flex-col gap-3">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-900">Join our mailing list</p>
              <form className="flex w-full max-w-md">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-indigo-600 transition-colors"
                />
                <button className="bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-indigo-600 transition-colors">
                  Join
                </button>
              </form>
            </div>
          </div>

          {/* Quick Links Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 lg:w-1/2">
            
            {/* Column 1 */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-900 mb-6">Company</h4>
              <ul className="flex flex-col gap-4 text-sm text-gray-500">
                <li className="hover:text-indigo-600 transition-colors"><Link href="/">Home</Link></li>
                <li className="hover:text-indigo-600 transition-colors"><Link href="/about">About us</Link></li>
                <li className="hover:text-indigo-600 transition-colors"><Link href="/contact">Delivery</Link></li>
                <li className="hover:text-indigo-600 transition-colors"><Link href="/">Privacy Policy</Link></li>
              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-900 mb-6">Shop</h4>
              <ul className="flex flex-col gap-4 text-sm text-gray-500">
                <li className="hover:text-indigo-600 transition-colors"><Link href="/shop/agbada">Agbada</Link></li>
                <li className="hover:text-indigo-600 transition-colors"><Link href="/shop/jalabiya">Jalabiya</Link></li>
                <li className="hover:text-indigo-600 transition-colors"><Link href="/shop/vintage">Vintage</Link></li>
                <li className="hover:text-indigo-600 transition-colors"><Link href="/shop/cargo-pant">Cargo Pants</Link></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-900 mb-6">Get in Touch</h4>
              <ul className="flex flex-col gap-4 text-sm text-gray-500">
                <li>+234-903-297-0254</li>
                <li>contact@dmgclothing.com</li>
                <li className="pt-2 flex gap-4">
                    {/* Social Icons would go here */}
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all cursor-pointer">
                        <span className="text-xs font-bold">Fb</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all cursor-pointer">
                        <span className="text-xs font-bold">In</span>
                    </div>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-3 sm:pt-6 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-6">
          <p className="text-xs text-gray-400 tracking-widest uppercase">
            © 2026 DMG CLOTHING - ALL RIGHTS RESERVED.
          </p>
          
          {/* Payment Icons Placeholder */}
          <div className="flex gap-4 opacity-50 grayscale hover:grayscale-0 transition-all">
             <div className="w-10 h-6 bg-gray-200 rounded-sm"></div>
             <div className="w-10 h-6 bg-gray-200 rounded-sm"></div>
             <div className="w-10 h-6 bg-gray-200 rounded-sm"></div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
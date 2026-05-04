/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
'use client'
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import BrandFeatures from '@/components/home/BrandFeatures';
import { getProduct } from '@/lib/api';
import { useCartStore } from '@/store/useCartStore';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProductPage = () => {
  const { id } = useParams();
  const [allProducts, setAllProducts] = useState([]);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("")
  const [size, setSize] = useState(null);
  const [color, setColor] = useState(null);
 

  const addToCart = useCartStore((state)=> state.addToCart);
  const cart = useCartStore((state)=> state.cart);

  // This mock data should ideally come from a central data file or API

  const loadProducts = async () =>{
    const data = await getProduct();

    setAllProducts(data.product);
  }

  

  useEffect(()=>{
    loadProducts();
  }, [])

  useEffect(() => {
  if (allProducts.length > 0) {
    const product = allProducts.find(item => item._id.toString() === id);
    if (product) {
      setProductData(product);
      setImage(product.image[0])
    }
  }
}, [id, allProducts]);

  // if (!productData) return <div className='pt-40 text-center font-prata italic'>Loading masterpiece...</div>;

  
   if (!productData) {
    return (
      <div className="flex gap-10 p-10">
        {/* Image Skeleton */}
        <Skeleton height={600} width={500} />

        {/* Text Skeleton */}
        <div className="flex flex-col gap-4">
          <Skeleton width={600} height={100} />
          <Skeleton width={600} height={100} />
          <Skeleton count={5} />
          <Skeleton width={600} height={200} />
        </div>
      </div>
    );
  }

  const hasSizes = productData.sizes?.length > 0;
  const hasColors = productData.colors?.length > 0;
   
  
  const handleAdd = () =>{
     const before = cart.length;
    

    if (hasSizes && hasColors && !size && !color) {
      toast.error("please select size and color");
      return
    }

    if (hasSizes && !size) {
      toast.error("please select size");
      return
    }

    
    if (hasColors && !color) {
      toast.error("please select color");
      return
    }

    

     addToCart(productData, size || null, color || null);

      const after = useCartStore.getState().cart.length;
      if (after > before) {
    toast.success("Added to cart ✅");
  }
  }


  return (
    <div className='pt-14 md:pt-28 pb-8 md:pb-16 px-6 max-w-7xl mx-auto'>
      <ToastContainer position='top-right' autoClose={1500}/>
      <div className='flex flex-col md:flex-row gap-12 lg:gap-20'>
        
        {/* --- LEFT: PRODUCT IMAGES --- */}
        <div className='w-full md:w-1/2 flex flex-col md:flex-row-reverse gap-4'>
          <div className='relative aspect-3/4 w-full overflow-hidden bg-gray-50 border border-gray-100'>
          
            <Image 
              fill
              src={image} 
              alt={productData.name} 
              priority
              className='object-cover hover:scale-105 transition-transform duration-1000'
            />
          </div>
          {/* Thumbnail Gallery (Optional) */}
          <div className='flex flex-row md:flex-col gap-4 '>
             {productData.image.map((item, index) => (
                <div  onClick={()=>setImage(item)} key={index} className='relative w-24 aspect-3/4 cursor-pointer opacity-60 hover:opacity-100 transition-opacity'>
                    <Image src={item} alt="thumbnail" fill className='object-cover' />
                </div>
             ))}
          </div>
        </div>

        {/* --- RIGHT: PRODUCT DETAILS --- */}
        <div className='w-full md:w-1/2 flex flex-col gap-6'>
          <div>
            <p className='text-xs font-bold uppercase tracking-[0.2em] text-indigo-600 mb-2'>{productData.subCategory}</p>
            <h1 className='text-3xl md:text-4xl font-bold font-prata text-gray-900 uppercase'>{productData.name}</h1>
            <p className='text-2xl font-bold text-gray-900 mt-4'>₦{productData.price.toLocaleString()}</p>
          </div>

          <p className='text-gray-500 text-sm leading-relaxed max-w-md'>
            {productData.description}
          </p>

          {/* Size Selection */}
          <div className='mt-4 flex flex-col gap-4'>
            <p className='text-xs font-bold uppercase tracking-widest text-gray-900'>Select Size</p>
            <div className='flex gap-3'>
              {productData.sizes?.map((item) => (
                <button
                  key={item}
                  onClick={() => setSize(item)}
                  className={`w-12 h-12 text-xs font-bold border transition-all cursor-pointer ${item === size ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-200 hover:border-black'}`}
                >
                  {item}
                </button>
              ))}
            </div>

            

            {hasColors ?
            <div className="">
                <p className='text-xs font-bold uppercase tracking-widest text-gray-900 mb-4'>Select Color</p>
            
            <div className='flex gap-3'>
              {productData.colors?.map((item) => (
                <button
                  key={item}
                  onClick={() => setColor(item)}
                  className={`px-8 py-4 text-xs font-bold border transition-all cursor-pointer ${item === color ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-200 hover:border-black'}`}
                >
                  {item}
                </button>
              ))}
            </div></div>: null}
          </div>

          {/* Quantity & CTA */}
          
            
            
            <button onClick={handleAdd} className='w-40 bg-black text-white py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-indigo-600 transition-colors shadow-xl cursor-pointer'>
              Add to Cart
            </button>
        

          {/* Additional Info Accordion (Minimalist) */}
          <div className='mt-8 pt-8 border-t border-gray-100 space-y-4 text-xs font-bold uppercase tracking-widest'>
            <div className='flex justify-between items-center cursor-pointer hover:text-indigo-600'>
                <span>Fabric & Care</span>
                <span>+</span>
            </div>
            <div className='flex justify-between items-center cursor-pointer hover:text-indigo-600'>
                <span>Shipping & Returns</span>
                <span>+</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- BOTTOM SECTION: TRUST BADGES --- */}
      <div className='md-14 md:mt-28'>
        <BrandFeatures />
      </div>
    </div>
  );
};

export default ProductPage;
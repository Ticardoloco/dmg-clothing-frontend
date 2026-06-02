// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable react-hooks/set-state-in-effect */
// 'use client'
// import React, { useState, useEffect, useRef } from 'react';
// import { useParams } from 'next/navigation';
// import Image from 'next/image';
// import BrandFeatures from '@/components/home/BrandFeatures';
// import { getProduct } from '@/lib/api';
// import { useCartStore } from '@/store/useCartStore';
// import { ToastContainer, toast } from 'react-toastify';
// import "react-toastify/dist/ReactToastify.css";
// import Skeleton from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";

// const ProductPage = () => {
//   const { id } = useParams();
//   const [allProducts, setAllProducts] = useState([]);
//   const [productData, setProductData] = useState(null);
//   const [image, setImage] = useState("");
//   const [size, setSize] = useState(null);
//   const [color, setColor] = useState(null);
//   const [currentVariant, setCurrentVariant] = useState(null);

//   // Tracks the last item + configuration successfully added to prevent duplicate success toasts
//   const lastAddedRef = useRef(null);

//   const addToCart = useCartStore((state) => state.addToCart);
//   const cart = useCartStore((state) => state.cart);

//   const loadProducts = async () => {
//     try {
//       const data = await getProduct();
//       setAllProducts(data.product);
//     } catch (error) {
//       console.error("Failed to fetch products:", error);
//     }
//   };

//   useEffect(() => {
//     loadProducts();
//   }, []);

//   useEffect(() => {
//     if (allProducts.length > 0) {
//       const product = allProducts.find(item => item._id.toString() === id);
//       if (product) {
//         setProductData(product);
//         setImage(product.image[0]);
//       }
//     }
//   }, [id, allProducts]);

//   const hasSizes = productData?.sizes?.length > 0;
//   const hasColors = productData?.colors?.length > 0;

//   useEffect(() => {
//     if (productData && productData.variants) {
//       const match = productData.variants.find((v) => {
//         const sizeMatch = hasSizes && size && v.size
//           ? v.size.toUpperCase() === size.toUpperCase()
//           : !hasSizes;

//         const colorMatch = hasColors && color && v.color
//           ? v.color.toLowerCase() === color.toLowerCase()
//           : !hasColors;

//         return sizeMatch && colorMatch;
//       });

//       setCurrentVariant(match || null);
//     } else {
//       setCurrentVariant(null);
//     }
//   }, [size, color, productData, hasSizes, hasColors]);

//   if (!productData) {
//     return (
//       <div className="flex flex-col md:flex-row gap-10 p-10 max-w-7xl mx-auto">
//         <Skeleton height={600} width={500} />
//         <div className="flex flex-col gap-4">
//           <Skeleton width={600} height={100} />
//           <Skeleton width={600} height={100} />
//           <Skeleton count={5} />
//           <Skeleton width={600} height={200} />
//         </div>
//       </div>
//     );
//   }

//   const selectionsMade = (hasSizes ? !!size : true) && (hasColors ? !!color : true);
  
//   const isInitialOutOfStock = selectionsMade && productData.variants && (!currentVariant || currentVariant.stock <= 0);

//   const getCartLimitReached = () => {
//     if (!selectionsMade || !currentVariant) return false;

//     const existingCartItem = cart.find(
//       (item) =>
//         item._id === productData._id &&
//         (!hasSizes || item.size === size) &&
//         (!hasColors || item.color === color)
//     );

//     const currentCartQty = existingCartItem ? existingCartItem.quantity : 0;
//     return currentCartQty + 1 > currentVariant.stock;
//   };

//   const isLimitReached = getCartLimitReached();
//   const showStockWarning = isInitialOutOfStock || isLimitReached;

//   const getVariantLabel = () => {
//     if (size && color) return `Size ${size} (${color})`;
//     if (size) return `Size ${size}`;
//     if (color) return `Color ${color}`;
//     return "";
//   };

//   const handleAdd = () => {
//     if (hasSizes && hasColors && !size && !color) {
//       toast.error("please select size and color", { toastId: "selection-missing" });
//       return;
//     }

//     if (hasSizes && !size) {
//       toast.error("please select size", { toastId: "size-missing" });
//       return;
//     }

//     if (hasColors && !color) {
//       toast.error("please select color", { toastId: "color-missing" });
//       return;
//     }

//     const variantLabel = getVariantLabel();
//     const uniqueToastId = `${productData._id}-${size}-${color}`;

//     if (isInitialOutOfStock) {
//       toast.error(`Sorry, this item in ${variantLabel} is out of stock!`, {
//         toastId: uniqueToastId
//       });
//       return;
//     }

//     if (isLimitReached) {
//       toast.error(`Cannot add more. You have reached the maximum available stock for ${variantLabel}!`, {
//         toastId: uniqueToastId
//       });
//       return;
//     }

//     // Run the state update function unconditionally so items continue to add up in the cart backend
//     addToCart(productData, size || null, color || null);
    
//     // Check if this exact combination matches the last successfully triggered user action
//     if (lastAddedRef.current !== uniqueToastId) {
//       toast.success(`Added ${productData.name} (${variantLabel}) to cart ✅`, {
//         toastId: uniqueToastId
//       });
//       // Store the token identifier so subsequent clicks on this exact setup are muted
//       lastAddedRef.current = uniqueToastId;
//     }
//   };

//   return (
//     <div className='pt-14 md:pt-28 pb-8 md:pb-16 px-6 max-w-7xl mx-auto'>
//       <ToastContainer position='top-right' autoClose={1500} />
//       <div className='flex flex-col md:flex-row gap-12 lg:gap-20'>

//         {/* --- LEFT: PRODUCT IMAGES --- */}
//         <div className='w-full md:w-1/2 flex flex-col md:flex-row-reverse gap-4'>
//           <div className='relative aspect-3/4 w-full overflow-hidden bg-gray-50 border border-gray-100'>
//             <Image
//               fill
//               src={image}
//               alt={productData.name}
//               priority
//               className='object-cover hover:scale-105 transition-transform duration-1000'
//             />
//           </div>
//           <div className='flex flex-row md:flex-col gap-4 '>
//             {productData.image.map((item, index) => (
//               <div onClick={() => setImage(item)} key={index} className='relative w-24 aspect-3/4 cursor-pointer opacity-60 hover:opacity-100 transition-opacity'>
//                 <Image src={item} alt="thumbnail" fill className='object-cover' />
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* --- RIGHT: PRODUCT DETAILS --- */}
//         <div className='w-full md:w-1/2 flex flex-col gap-6'>
//           <div>
//             <p className='text-xs font-bold uppercase tracking-[0.2em] text-indigo-600 mb-2'>{productData.subCategory}</p>
//             <h1 className='text-3xl md:text-4xl font-bold font-prata text-gray-900 uppercase'>{productData.name}</h1>
//             <p className='text-2xl font-bold text-gray-900 mt-4'>₦{productData.price.toLocaleString()}</p>
//           </div>

//           <p className='text-gray-500 text-sm leading-relaxed max-w-md'>
//             {productData.description}
//           </p>

//           {/* Size & Color Modules */}
//           <div className='mt-4 flex flex-col gap-4'>
//             {hasSizes && (
//               <>
//                 <p className='text-xs font-bold uppercase tracking-widest text-gray-900'>Select Size</p>
//                 <div className='flex gap-3'>
//                   {productData.sizes?.map((item) => (
//                     <button
//                       key={item}
//                       type="button"
//                       onClick={() => setSize(item)}
//                       className={`w-12 h-12 text-xs font-bold border transition-all cursor-pointer ${item === size ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-200 hover:border-black'}`}
//                     >
//                       {item}
//                     </button>
//                   ))}
//                 </div>
//               </>
//             )}

//             {hasColors && (
//               <div className="mt-2">
//                 <p className='text-xs font-bold uppercase tracking-widest text-gray-900 mb-4'>Select Color</p>
//                 <div className='flex gap-3'>
//                   {productData.colors?.map((item) => (
//                     <button
//                       key={item}
//                       type="button"
//                       onClick={() => setColor(item)}
//                       className={`px-8 py-4 text-xs font-bold border transition-all cursor-pointer ${item === color ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-200 hover:border-black'}`}
//                     >
//                       {item}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Dynamic Out Of Stock Variant Message */}
//             {showStockWarning && (
//               <p className="text-xs font-semibold text-rose-600 mt-2 tracking-wide animate-pulse">
//                 * {isInitialOutOfStock 
//                   ? `${getVariantLabel()} is currently out of stock.` 
//                   : `Maximum store stock reached for ${getVariantLabel()} in your cart.`}
//               </p>
//             )}
//           </div>

//           {/* Quantity & CTA */}
//           <div className="mt-4">
//             <button 
//               onClick={handleAdd} 
//               className='w-40 bg-black text-white py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-indigo-600 transition-colors shadow-xl cursor-pointer'
//             >
//               Add to Cart
//             </button>
//           </div>

//           {/* Additional Info Accordion */}
//           <div className='mt-8 pt-8 border-t border-gray-100 space-y-4 text-xs font-bold uppercase tracking-widest'>
//             <div className='flex justify-between items-center cursor-pointer hover:text-indigo-600'>
//               <span>Fabric & Care</span>
//               <span>+</span>
//             </div>
//             <div className='flex justify-between items-center cursor-pointer hover:text-indigo-600'>
//               <span>Shipping & Returns</span>
//               <span>+</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className='mt-14 md:mt-28'>
//         <BrandFeatures />
//       </div>
//     </div>
//   );
// };

// export default ProductPage;

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
'use client'
import React, { useState, useEffect, useRef } from 'react';
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
  const [image, setImage] = useState("");
  const [size, setSize] = useState(null);
  const [color, setColor] = useState(null);
  const [currentVariant, setCurrentVariant] = useState(null);

  const lastAddedRef = useRef(null);

  const addToCart = useCartStore((state) => state.addToCart);
  const cart = useCartStore((state) => state.cart);

  const loadProducts = async () => {
    try {
      const data = await getProduct();
      setAllProducts(data.product);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (allProducts.length > 0) {
      const product = allProducts.find(item => item._id.toString() === id);
      if (product) {
        setProductData(product);
        setImage(product.image[0]);
      }
    }
  }, [id, allProducts]);

  const hasSizes = productData?.sizes?.length > 0;
  const hasColors = productData?.colors?.length > 0;
  const hasVariants = productData?.variants?.length > 0;

  useEffect(() => {
    if (productData && hasVariants) {
      const match = productData.variants.find((v) => {
        const sizeMatch = hasSizes && size && v.size
          ? v.size.toUpperCase() === size.toUpperCase()
          : !hasSizes;

        const colorMatch = hasColors && color && v.color
          ? v.color.toLowerCase() === color.toLowerCase()
          : !hasColors;

        return sizeMatch && colorMatch;
      });

      setCurrentVariant(match || null);
    } else {
      setCurrentVariant(null);
    }
  }, [size, color, productData, hasSizes, hasColors, hasVariants]);

  if (!productData) {
    return (
      <div className="flex flex-col md:flex-row gap-10 p-10 max-w-7xl mx-auto">
        <Skeleton height={600} width={500} />
        <div className="flex flex-col gap-4">
          <Skeleton width={600} height={100} />
          <Skeleton width={600} height={100} />
          <Skeleton count={5} />
          <Skeleton width={600} height={200} />
        </div>
      </div>
    );
  }

  const selectionsMade = (hasSizes ? !!size : true) && (hasColors ? !!color : true);
  
  // FIXED: Handles structural baseline stock whether it's an explicit variant or flat item root
  const getAvailableStockLimit = () => {
    if (hasVariants) {
      if (!currentVariant) return 0;
      return currentVariant.stock ?? currentVariant.quantity ?? currentVariant.qty ?? 0;
    }
    return productData.stock ?? productData.quantity ?? productData.qty ?? 0;
  };

  const totalAvailableStock = getAvailableStockLimit();
  const isInitialOutOfStock = selectionsMade && totalAvailableStock <= 0;

  const getCartLimitReached = () => {
    if (!selectionsMade) return false;

    const existingCartItem = cart.find(
      (item) =>
        String(item._id) === String(productData._id) &&
        (!hasSizes || (item.size || "").toLowerCase() === (size || "").toLowerCase()) &&
        (!hasColors || (item.color || "").toLowerCase() === (color || "").toLowerCase())
    );

    const currentCartQty = existingCartItem ? existingCartItem.quantity : 0;
    return currentCartQty >= totalAvailableStock;
  };

  const isLimitReached = getCartLimitReached();
  const showStockWarning = selectionsMade && (isInitialOutOfStock || isLimitReached);

  const getVariantLabel = () => {
    if (size && color) return `Size ${size} (${color})`;
    if (size) return `Size ${size}`;
    if (color) return `Color ${color}`;
    return "This item";
  };

  const handleAdd = () => {
    // 1. Structural Interaction Selection Alerts
    if (hasSizes && hasColors && !size && !color) {
      toast.error("please select size and color", { toastId: "selection-missing" });
      return;
    }
    if (hasSizes && !size) {
      toast.error("please select size", { toastId: "size-missing" });
      return;
    }
    if (hasColors && !color) {
      toast.error("please select color", { toastId: "color-missing" });
      return;
    }

    const variantLabel = getVariantLabel();
    const uniqueToastId = `${productData._id}-${size || 'none'}-${color || 'none'}`;

    // 2. FIXED: Strict Return Walls to block execution paths immediately
    if (isInitialOutOfStock) {
      toast.error(`Sorry, ${variantLabel} is out of stock!`, { toastId: uniqueToastId });
      return; 
    }

    if (isLimitReached) {
      toast.error(`Cannot add more. You have reached the maximum available stock for ${variantLabel}!`, { toastId: uniqueToastId });
      return; 
    }

    // 3. Safe Execution Path
    addToCart(productData, size || null, color || null);
    
    if (lastAddedRef.current !== uniqueToastId) {
      toast.success(`Added ${productData.name} (${variantLabel}) to cart ✅`, {
        toastId: uniqueToastId
      });
      lastAddedRef.current = uniqueToastId;
    }
  };

  return (
    <div className='pt-14 md:pt-28 pb-8 md:pb-16 px-6 max-w-7xl mx-auto'>
      <ToastContainer position='top-right' autoClose={1500} />
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
          <div className='flex flex-row md:flex-col gap-4 '>
            {productData.image.map((item, index) => (
              <div onClick={() => setImage(item)} key={index} className='relative w-24 aspect-3/4 cursor-pointer opacity-60 hover:opacity-100 transition-opacity'>
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

          {/* Size & Color Modules */}
          <div className='mt-4 flex flex-col gap-4'>
            {hasSizes && (
              <>
                <p className='text-xs font-bold uppercase tracking-widest text-gray-900'>Select Size</p>
                <div className='flex gap-3'>
                  {productData.sizes?.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => { setSize(item); lastAddedRef.current = null; }}
                      className={`w-12 h-12 text-xs font-bold border transition-all cursor-pointer ${item === size ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-200 hover:border-black'}`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </>
            )}

            {hasColors && (
              <div className="mt-2">
                <p className='text-xs font-bold uppercase tracking-widest text-gray-900 mb-4'>Select Color</p>
                <div className='flex flex-wrap gap-3'>
                  {productData.colors?.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => { setColor(item); lastAddedRef.current = null; }}
                      className={`px-8 py-4 text-xs font-bold border transition-all cursor-pointer ${item === color ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-200 hover:border-black'}`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Dynamic UI Feedback Warnings */}
            {showStockWarning && (
              <p className="text-xs font-semibold text-rose-600 mt-2 tracking-wide animate-pulse">
                * {isInitialOutOfStock 
                  ? `${getVariantLabel()} is currently out of stock.` 
                  : `Maximum store stock reached for ${getVariantLabel()} inside your cart.`}
              </p>
            )}
          </div>

          {/* Quantity & CTA */}
          <div className="mt-4">
            <button 
              onClick={handleAdd} 
              disabled={showStockWarning}
              className={`w-40 bg-black text-white py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-indigo-600 transition-colors shadow-xl cursor-pointer ${
                showStockWarning 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-black text-white hover:bg-indigo-600 cursor-pointer'
              }`}
            >
              {isInitialOutOfStock ? "Out Of Stock" : isLimitReached ? "Limit Reached" : "Add to Cart"}
            </button>
          </div>

          {/* Additional Info Accordion */}
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

      <div className='mt-14 md:mt-28'>
        <BrandFeatures />
      </div>
    </div>
  );
};

export default ProductPage;
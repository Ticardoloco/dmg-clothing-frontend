
// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// export const useCartStore = create(
//     persist((set, get)=>({
//         cart: [],

//         addToCart: (product, size, color)=>{
//             const existing = get().cart.find((item)=> 
//             item._id === product._id &&
//             item.size === size &&
//             item.color === color
//         );

//         if (existing) {
//             set({
//                 cart: get().cart.map((item)=> 
//                 item._id === product._id &&
//                 item.size === size &&
//                 item.color === color
//                  ? { ...item, quantity: item.quantity + 1 }
//                 : item
//                 ),
//             });
//         }else{
//             set({
//                 cart: [...get().cart, 
//                     {
//                         _id: product._id,
//                         name: product.name,
//                         price: product.price,
//                         image: product.image?.[0],
//                         size,
//                         color,
//                         quantity: 1,
//                     },
//                 ],
//             });
//         }
//         },

//         increaseQty: (id, size, color)=>{
//             set({
//                 cart: get().cart.map((item)=>
//                 item._id === id &&
//                 item.size === size &&
//                 item.color === color 
//                 ? {...item, quantity: item.quantity + 1} 
//                 : item
//                 ),
//             });
//         },

//         decreaseQty: (id, size, color)=>{
//             set({
//                 cart: get().cart.map((item)=> 
//                 item._id === id &&
//                 item.size === size &&
//                 item.color === color 
//                 ? { ...item, quantity: Math.max(1, item.quantity - 1) }
//                 : item
//                 )
//                 .filter((item)=> item.quantity > 0)
//             });
//         },

//         removeItem: (id, size, color)=>{
//             set({
//                 cart: get().cart.filter((item)=> 
//                !( item._id === id &&
//                 item.size === size &&
//                 item.color === color )
                
//                 ),
//             });
//         },

//         clearCart: ()=> set({cart: []}),

//         getTotal: () => {
//             return get().cart.reduce((total, item)=> total + item.price * item.quantity, 
//             0
//         );
//         },

//     }),
// {
//      name: "cart-storage", // localStorage key
// }
// )
// )

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
    persist(
        (set, get) => ({
            cart: [],

            addToCart: (product, size, color) => {
                const currentCart = get().cart;
                
                const existing = currentCart.find((item) => 
                    String(item._id) === String(product._id) &&
                    (item.size || "").toLowerCase() === (size || "").toLowerCase() &&
                    (item.color || "").toLowerCase() === (color || "").toLowerCase()
                );

                // Find the variant if size/color are provided
                const matchedVariant = product.variants?.find((v) => {
                    const sizeMatch = size && v.size 
                        ? v.size.toLowerCase() === size.toLowerCase() 
                        : !size;
                    const colorMatch = color && v.color 
                        ? v.color.toLowerCase() === color.toLowerCase() 
                        : !color;
                    return sizeMatch && colorMatch;
                });

                // Extract stock value from any backend naming convention safely
                let backendStock = undefined;
                if (matchedVariant) {
                    backendStock = matchedVariant.stock ?? matchedVariant.quantity ?? matchedVariant.qty ?? matchedVariant.inventory;
                }
                if (backendStock === undefined) {
                    backendStock = product.stock ?? product.quantity ?? product.qty ?? product.inventory;
                }

                // If backend stock is found, cast it to a number. If completely missing, use 10 as default.
                const finalMaxStock = backendStock !== undefined ? Number(backendStock) : 10;

                if (existing) {
                    // 🛑 STOPS ADDING: If the quantity in the cart already matches or exceeds backend limits
                    if (existing.quantity >= finalMaxStock) {
                        console.warn("Out of stock baseline reached!");
                        return;
                    }

                    set({
                        cart: currentCart.map((item) => 
                            String(item._id) === String(product._id) &&
                            (item.size || "").toLowerCase() === (size || "").toLowerCase() &&
                            (item.color || "").toLowerCase() === (color || "").toLowerCase()
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                    });
                } else {
                    // 🛑 STOPS ADDING: If the product starts out-of-stock on the backend (stock is 0)
                    if (finalMaxStock <= 0) return; 

                    set({
                        cart: [
                            ...currentCart, 
                            {
                                _id: product._id,
                                name: product.name,
                                price: product.price,
                                image: product.image?.[0] || product.image,
                                size,
                                color,
                                quantity: 1,
                                maxStock: finalMaxStock // 🔥 Crucial: Saved flat on the item root!
                            },
                        ],
                    });
                }
            },

            increaseQty: (id, size, color) => {
                const currentCart = get().cart;
                
                const targetItem = currentCart.find((item) =>
                    String(item._id) === String(id) &&
                    (item.size || "").toLowerCase() === (size || "").toLowerCase() &&
                    (item.color || "").toLowerCase() === (color || "").toLowerCase()
                );

                if (!targetItem) return;

                // Read the flat maximum stock value saved directly on the cart item
                const limit = targetItem.maxStock !== undefined ? Number(targetItem.maxStock) : 10;

                // 🛑 STOPS ADDING: Hard wall preventing addition if cart meets backend stock threshold
                if (targetItem.quantity >= limit) {
                    console.warn(`Cannot add more. Backend stock limit is ${limit}`);
                    return;
                }

                set({
                    cart: currentCart.map((item) =>
                        String(item._id) === String(id) &&
                        (item.size || "").toLowerCase() === (size || "").toLowerCase() &&
                        (item.color || "").toLowerCase() === (color || "").toLowerCase()
                            ? { ...item, quantity: item.quantity + 1 } 
                            : item
                    ),
                });
            },

            decreaseQty: (id, size, color) => {
                set({
                    cart: get().cart.map((item) => 
                        String(item._id) === String(id) &&
                        (item.size || "").toLowerCase() === (size || "").toLowerCase() &&
                        (item.color || "").toLowerCase() === (color || "").toLowerCase()
                            ? { ...item, quantity: Math.max(1, item.quantity - 1) }
                            : item
                    )
                });
            },

            removeItem: (id, size, color) => {
                set({
                    cart: get().cart.filter((item) => 
                        !(
                            String(item._id) === String(id) && 
                            (item.size || "").toLowerCase() === (size || "").toLowerCase() && 
                            (item.color || "").toLowerCase() === (color || "").toLowerCase()
                        )
                    ),
                });
            },

            clearCart: () => set({ cart: [] }),

            getTotal: () => {
                return get().cart.reduce((total, item) => total + item.price * item.quantity, 0);
            },
        }),
        {
            name: "cart-storage", 
        }
    )
);

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
    persist((set, get)=>({
        cart: [],

        addToCart: (product, size, color)=>{
            const existing = get().cart.find((item)=> 
            item._id === product._id &&
            item.size === size &&
            item.color === color
        );

        if (existing) {
            set({
                cart: get().cart.map((item)=> 
                item._id === product._id &&
                item.size === size &&
                item.color === color
                 ? { ...item, quantity: item.quantity + 1 }
                : item
                ),
            });
        }else{
            set({
                cart: [...get().cart, 
                    {
                        _id: product._id,
                        name: product.name,
                        price: product.price,
                        image: product.image?.[0],
                        size,
                        color,
                        quantity: 1,
                    },
                ],
            });
        }
        },

        increaseQty: (id, size, color)=>{
            set({
                cart: get().cart.map((item)=>
                item._id === id &&
                item.size === size &&
                item.color === color 
                ? {...item, quantity: item.quantity + 1} 
                : item
                ),
            });
        },

        decreaseQty: (id, size, color)=>{
            set({
                cart: get().cart.map((item)=> 
                item._id === id &&
                item.size === size &&
                item.color === color 
                ? { ...item, quantity: Math.max(1, item.quantity - 1) }
                : item
                )
                .filter((item)=> item.quantity > 0)
            });
        },

        removeItem: (id, size, color)=>{
            set({
                cart: get().cart.filter((item)=> 
               !( item._id === id &&
                item.size === size &&
                item.color === color )
                
                ),
            });
        },

        clearCart: ()=> set({cart: []}),

        getTotal: () => {
            return get().cart.reduce((total, item)=> total + item.price * item.quantity, 
            0
        );
        },

    }),
{
     name: "cart-storage", // localStorage key
}
)
)
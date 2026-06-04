// "use client";

// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// import BrandFeatures from "@/components/home/BrandFeatures";
// import { apiFetch } from "@/lib/tokenApi";
// import { useAuthStore } from "@/store/authStore";
// import { useCartStore } from "@/store/useCartStore";

// const PlaceOrder = () => {
//   const router = useRouter();

//   const [method, setMethod] = useState("cod");
//   const [mounted, setMounted] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const [shipping, setShipping] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     street: "",
//     city: "",
//     state: "",
//     zipcode: "",
//     country: "",
//     phone: "",
//   });

//   const token = useAuthStore((state) => state.token);

//   const getTotal = useCartStore((state) => state.getTotal);
//   const cart = useCartStore((state) => state.cart);
//   const clearCart = useCartStore((state) => state.clearCart);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   useEffect(() => {
//     if (!mounted) return; // 👈 Skip checking on initial server load
    
//     if (!token) {
//       toast.error("Please login first");

//       setTimeout(() => {
//         router.push("/login");
//       }, 1500);
//     }
//   }, [token, router, mounted]);

//   const handleChange = (e) => {
//     setShipping({
//       ...shipping,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const validateForm = () => {
//     if (cart.length === 0) {
//       toast.error("Your cart is empty");
//       return false;
//     }

//     if (
//       !shipping.firstName ||
//       !shipping.lastName ||
//       !shipping.email ||
//       !shipping.street ||
//       !shipping.city ||
//       !shipping.state ||
//       !shipping.country ||
//       !shipping.phone
//     ) {
//       toast.error("Please fill all required fields");
//       return false;
//     }

//     return true;
//   };

//   const placeOrder = async () => {
//     if (!validateForm()) return;

//     try {
//       setLoading(true);

//       const orderItems = cart
//         .map((item) => {
//           if (!item || !item._id) return null;

//           return {
//             product: item._id,        // Matches your store's '_id'
//             quantity: item.quantity || 1,
//             size: item.size || "",
//             color: item.color || "",
//             price: item.price || 0,   // Matches your store's 'price'
//           };
//         })
//         .filter(Boolean);

//       // Safety check in case something goes sideways
//       if (orderItems.length === 0) {
//         toast.error("Failed to parse cart items");
//         return;
//       }

//       const orderData = {
//         shippingAddress: shipping,
//         items: orderItems,
//         totalAmount: getTotal() + 10000,
//         paymentMethod: method,
//       };

//       const response = await apiFetch(
//         "http://localhost:4001/api/v1/order/create",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(orderData),
//         },
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         toast.error(data.message || "Failed to place order");
//         return;
//       }

//       toast.success("Order placed successfully 🎉");

//       clearCart();

//       setTimeout(() => {
//         router.push("/my-orders");
//       }, 1500);
//     } catch (error) {
//       console.error(error);
//       toast.error("Server error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="pt-28 pb-20 px-6 max-w-7xl mx-auto">
//       <ToastContainer position="top-right" autoClose={1500} />

//       {/* PAGE TITLE */}
//       <div className="flex items-center gap-4 mb-12">
//         <h1 className="text-2xl md:text-3xl font-bold font-prata uppercase">
//           Delivery{" "}
//           <span className="text-indigo-600 italic font-light">Information</span>
//         </h1>
//       </div>

//       <div className="flex flex-col lg:flex-row gap-16">
//         {/* LEFT SIDE */}
//         <div className="flex-1 flex flex-col gap-6">
//           <div className="grid grid-cols-2 gap-4">
//             <input
//               type="text"
//               name="firstName"
//               value={shipping.firstName}
//               onChange={handleChange}
//               placeholder="First name"
//               className="border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-600 transition-all"
//             />

//             <input
//               type="text"
//               name="lastName"
//               value={shipping.lastName}
//               onChange={handleChange}
//               placeholder="Last name"
//               className="border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-600 transition-all"
//             />
//           </div>

//           <input
//             type="email"
//             name="email"
//             value={shipping.email}
//             onChange={handleChange}
//             placeholder="Email address"
//             className="border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-600 transition-all"
//           />

//           <input
//             type="text"
//             name="street"
//             value={shipping.street}
//             onChange={handleChange}
//             placeholder="Street"
//             className="border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-600 transition-all"
//           />

//           <div className="grid grid-cols-2 gap-4">
//             <input
//               type="text"
//               name="city"
//               value={shipping.city}
//               onChange={handleChange}
//               placeholder="City"
//               className="border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-600 transition-all"
//             />

//             <input
//               type="text"
//               name="state"
//               value={shipping.state}
//               onChange={handleChange}
//               placeholder="State"
//               className="border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-600 transition-all"
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <input
//               type="text"
//               name="zipcode"
//               value={shipping.zipcode}
//               onChange={handleChange}
//               placeholder="Zipcode"
//               className="border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-600 transition-all"
//             />

//             <input
//               type="text"
//               name="country"
//               value={shipping.country}
//               onChange={handleChange}
//               placeholder="Country"
//               className="border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-600 transition-all"
//             />
//           </div>

//           <input
//             type="tel"
//             name="phone"
//             value={shipping.phone}
//             onChange={handleChange}
//             placeholder="Phone"
//             className="border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-600 transition-all"
//           />
//         </div>

//         {/* RIGHT SIDE */}
//         <div className="w-full lg:w-112.5">
//           {/* TOTALS */}
//           <div className="bg-gray-50 p-8 rounded-sm mb-8">
//             <h2 className="text-lg font-bold font-prata uppercase mb-6">
//               Cart Totals
//             </h2>

//             <div className="flex flex-col gap-3 text-sm">
//               <div className="flex justify-between text-gray-600">
//                 <span>Subtotal</span>
//                 <span>₦{mounted ? getTotal().toLocaleString() : 0}</span>
//               </div>

//               <div className="flex justify-between text-gray-600">
//                 <span>Shipping Fee</span>
//                 <span>₦10,000</span>
//               </div>

//               <div className="h-px bg-gray-200 my-2"></div>

//               <div className="flex justify-between text-lg font-bold text-gray-900">
//                 <span>Total</span>

//                 <span>
//                   ₦{mounted ? (getTotal() + 10000).toLocaleString() : 0}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* PAYMENT */}
//           <div className="mt-12">
//             <h2 className="text-sm font-bold uppercase tracking-widest mb-6">
//               Payment Method
//             </h2>

//             <div className="flex flex-col gap-3">
//               {/* PAYSTACK */}
//               <div
//                 onClick={() => setMethod("card")}
//                 className={`flex items-center gap-4 border px-4 py-3 cursor-pointer transition-all ${
//                   method === "card"
//                     ? "border-indigo-600 bg-indigo-50"
//                     : "border-gray-200"
//                 }`}
//               >
//                 <div
//                   className={`w-3 h-3 border rounded-full ${
//                     method === "card"
//                       ? "bg-indigo-600 border-indigo-600"
//                       : "border-gray-300"
//                   }`}
//                 ></div>

//                 <span className="text-xs font-bold uppercase text-gray-600 tracking-wider">
//                   Paystack (Card)
//                 </span>
//               </div>

//               {/* RAZORPAY */}
//               <div
//                 onClick={() => setMethod("razorpay")}
//                 className={`flex items-center gap-4 border px-4 py-3 cursor-pointer transition-all ${
//                   method === "razorpay"
//                     ? "border-indigo-600 bg-indigo-50"
//                     : "border-gray-200"
//                 }`}
//               >
//                 <div
//                   className={`w-3 h-3 border rounded-full ${
//                     method === "razorpay"
//                       ? "bg-indigo-600 border-indigo-600"
//                       : "border-gray-300"
//                   }`}
//                 ></div>

//                 <span className="text-xs font-bold uppercase text-gray-600 tracking-wider">
//                   Razorpay
//                 </span>
//               </div>

//               {/* COD */}
//               <div
//                 onClick={() => setMethod("cod")}
//                 className={`flex items-center gap-4 border px-4 py-3 cursor-pointer transition-all ${
//                   method === "cod"
//                     ? "border-indigo-600 bg-indigo-50"
//                     : "border-gray-200"
//                 }`}
//               >
//                 <div
//                   className={`w-3 h-3 border rounded-full ${
//                     method === "cod"
//                       ? "bg-indigo-600 border-indigo-600"
//                       : "border-gray-300"
//                   }`}
//                 ></div>

//                 <span className="text-xs font-bold uppercase text-gray-600 tracking-wider">
//                   Cash on Delivery
//                 </span>
//               </div>
//             </div>

//             <button
//               disabled={loading}
//               onClick={placeOrder}
//               className="w-full bg-black text-white py-4 mt-10 text-xs font-bold uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? "Processing..." : "Place Order"}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* TRUST FOOTER */}
//       <div className="mt-24">
//         <BrandFeatures />
//       </div>
//     </div>
//   );
// };

// export default PlaceOrder;


"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import BrandFeatures from "@/components/home/BrandFeatures";
import { apiFetch } from "@/lib/tokenApi";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/useCartStore";

const PlaceOrder = () => {
  const router = useRouter();

  const [method, setMethod] = useState("cod");
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [shipping, setShipping] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const token = useAuthStore((state) => state.token);

  const getTotal = useCartStore((state) => state.getTotal);
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return; // Skip checking on initial server load
    
    if (!token) {
      toast.error("Please login first");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    }
  }, [token, router, mounted]);

  const handleChange = (e) => {
    setShipping({
      ...shipping,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return false;
    }

    if (
      !shipping.firstName ||
      !shipping.lastName ||
      !shipping.email ||
      !shipping.street ||
      !shipping.city ||
      !shipping.state ||
      !shipping.country ||
      !shipping.phone
    ) {
      toast.error("Please fill all required fields");
      return false;
    }

    return true;
  };

  const placeOrder = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const orderItems = cart
        .map((item) => {
          if (!item || !item._id) return null;

          return {
            product: item._id,       // Matches your store's '_id'
            quantity: item.quantity || 1,
            price: item.price || 0,   // Matches your store's 'price'
            size: item.size || "",    // Standard singular syntax
            color: item.color || "",  // Standard singular syntax
            sizes: item.size || "",   // Fallback configuration for old backend validation
            colors: item.color || "", // Fallback configuration for old backend validation
          };
        })
        .filter(Boolean);

      // Safety check in case something goes sideways
      if (orderItems.length === 0) {
        toast.error("Failed to parse cart items");
        return;
      }

      const orderData = {
        shippingAddress: shipping,
        items: orderItems,
        totalAmount: getTotal() + 10000,
        paymentMethod: method,
      };

      const response = await apiFetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/order/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orderData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to place order");
        return;
      }

      toast.success("Order placed successfully 🎉");

      clearCart();

      setTimeout(() => {
        router.push("/my-orders");
      }, 1500);
    } catch (error) {
      console.error(error);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-20 px-6 max-w-7xl mx-auto">
      <ToastContainer position="top-right" autoClose={1500} />

      {/* PAGE TITLE */}
      <div className="flex items-center gap-4 mb-12">
        <h1 className="text-2xl md:text-3xl font-bold font-prata uppercase">
          Delivery{" "}
          <span className="text-indigo-600 italic font-light">Information</span>
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-16">
        {/* LEFT SIDE */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              value={shipping.firstName}
              onChange={handleChange}
              placeholder="First name"
              className="border border-gray-200 px-4 py-3 text-base md:text-lg outline-none focus:border-indigo-600 transition-all"
            />

            <input
              type="text"
              name="lastName"
              value={shipping.lastName}
              onChange={handleChange}
              placeholder="Last name"
              className="border border-gray-200 px-4 py-3 text-base md:text-lg outline-none focus:border-indigo-600 transition-all"
            />
          </div>

          <input
            type="email"
            name="email"
            value={shipping.email}
            onChange={handleChange}
            placeholder="Email address"
            className="border border-gray-200 px-4 py-3 text-base md:text-lg outline-none focus:border-indigo-600 transition-all"
          />

          <input
            type="text"
            name="street"
            value={shipping.street}
            onChange={handleChange}
            placeholder="Street"
            className="border border-gray-200 px-4 py-3 text-base md:text-lg outline-none focus:border-indigo-600 transition-all"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="city"
              value={shipping.city}
              onChange={handleChange}
              placeholder="City"
              className="border border-gray-200 px-4 py-3 text-base md:text-lg outline-none focus:border-indigo-600 transition-all"
            />

            <input
              type="text"
              name="state"
              value={shipping.state}
              onChange={handleChange}
              placeholder="State"
              className="border border-gray-200 px-4 py-3 text-base md:text-lg outline-none focus:border-indigo-600 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="zipcode"
              value={shipping.zipcode}
              onChange={handleChange}
              placeholder="Zipcode"
              className="border border-gray-200 px-4 py-3 text-base md:text-lg outline-none focus:border-indigo-600 transition-all"
            />

            <input
              type="text"
              name="country"
              value={shipping.country}
              onChange={handleChange}
              placeholder="Country"
              className="border border-gray-200 px-4 py-3 text-base md:text-lg outline-none focus:border-indigo-600 transition-all"
            />
          </div>

          <input
            type="tel"
            name="phone"
            value={shipping.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="border border-gray-200 px-4 py-3 text-base md:text-lg outline-none focus:border-indigo-600 transition-all"
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full lg:w-112.5">
          {/* TOTALS */}
          <div className="bg-gray-50 p-8 rounded-sm mb-8">
            <h2 className="text-lg font-bold font-prata uppercase mb-6">
              Cart Totals
            </h2>

            <div className="flex flex-col gap-3 text-base md:text-lg">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₦{mounted ? getTotal().toLocaleString() : 0}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Shipping Fee</span>
                <span>₦10,000</span>
              </div>

              <div className="h-px bg-gray-200 my-2"></div>

              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>
                  ₦{mounted ? (getTotal() + 10000).toLocaleString() : 0}
                </span>
              </div>
            </div>
          </div>

          {/* PAYMENT */}
          <div className="mt-12">
            <h2 className="text-base md:text-lg font-bold uppercase tracking-widest mb-6">
              Payment Method
            </h2>

            <div className="flex flex-col gap-3">
              {/* PAYSTACK */}
              <div
                onClick={() => setMethod("card")}
                className={`flex items-center gap-4 border px-4 py-3 cursor-pointer transition-all ${
                  method === "card"
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-200"
                }`}
              >
                <div
                  className={`w-3 h-3 border rounded-full ${
                    method === "card"
                      ? "bg-indigo-600 border-indigo-600"
                      : "border-gray-300"
                  }`}
                ></div>

                <span className="text-sm md:text-base font-bold uppercase text-gray-600 tracking-wider">
                  Paystack (Card)
                </span>
              </div>

              {/* RAZORPAY */}
              <div
                onClick={() => setMethod("razorpay")}
                className={`flex items-center gap-4 border px-4 py-3 cursor-pointer transition-all ${
                  method === "razorpay"
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-200"
                }`}
              >
                <div
                  className={`w-3 h-3 border rounded-full ${
                    method === "razorpay"
                      ? "bg-indigo-600 border-indigo-600"
                      : "border-gray-300"
                  }`}
                ></div>

                <span className="text-sm md:text-base font-bold uppercase text-gray-600 tracking-wider">
                  Razorpay
                </span>
              </div>

              {/* COD */}
              <div
                onClick={() => setMethod("cod")}
                className={`flex items-center gap-4 border px-4 py-3 cursor-pointer transition-all ${
                  method === "cod"
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-200"
                }`}
              >
                <div
                  className={`w-3 h-3 border rounded-full ${
                    method === "cod"
                      ? "bg-indigo-600 border-indigo-600"
                      : "border-gray-300"
                  }`}
                ></div>

                <span className="text-sm md:text-base font-bold uppercase text-gray-600 tracking-wider">
                  Cash on Delivery
                </span>
              </div>
            </div>

            <button
              disabled={loading}
              onClick={placeOrder}
              className="w-full bg-black text-white py-4 mt-10 text-sm md:text-base font-bold uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>

      {/* TRUST FOOTER */}
      <div className="mt-24">
        <BrandFeatures />
      </div>
    </div>
  );
};

export default PlaceOrder;
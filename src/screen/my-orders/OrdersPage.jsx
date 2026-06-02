/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { toast } from "react-toastify";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/tokenApi";

const OrdersPage = () => {
  const { token } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  const router = useRouter();

  // 1. Fetch Orders from Backend
  const fetchOrders = async () => {
    console.log(token);
    try {
      const response = await apiFetch(
        "http://localhost:4001/api/v1/order/my-orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await response.json();
      if (data) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil((orders?.length || 0) / ordersPerPage);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;

  const currentOrders = (orders || [])
    .slice()
    .reverse()
    .slice(indexOfFirstOrder, indexOfLastOrder);

  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  useEffect(() => {
    setCurrentPage(1);
  }, [orders]);

  if (loading)
    return (
      <div className="pt-40 text-center font-prata italic">
        Loading your wardrobe...
      </div>
    );

  return (
    <div className="pt-28 pb-20 px-6 max-w-6xl mx-auto min-h-screen">
      <div className="border-b border-gray-100 pb-10 mb-12">
        <h1 className="text-3xl font-bold font-prata uppercase leading-tight">
          My <span className="text-indigo-600 italic font-light">Orders</span>
        </h1>
        <p className="text-[10px] font-bold text-gray-400 tracking-[0.3em] mt-2 uppercase">
          Track your purchases and order history
        </p>
      </div>

      {orders?.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-prata italic text-gray-400 mb-6">
            You haven&apos;t placed any orders yet.
          </p>
          <button
            onClick={() => router.push("/shop")}
            className="bg-black text-white px-10 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-600 transition-all"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {currentOrders.map((order) => (
            <div
              key={order._id}
              className="border border-gray-100 p-6 md:p-8 hover:shadow-sm transition-shadow bg-white"
            >
              {/* Order Header */}
              <div className="flex flex-col md:flex-row justify-between mb-8 pb-6 border-b border-gray-50 gap-4">
                <div className="flex gap-8">
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                      Order ID
                    </p>
                    <p className="text-xs font-bold text-gray-900">
                      #{order._id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                      Date
                    </p>
                    <p className="text-xs font-bold text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                      Total
                    </p>
                    <p className="text-xs font-bold text-indigo-600">
                      ₦{order.totalAmount.toLocaleString()}
                    </p>
                  </div>
                  {/* Added Payment Method */}
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                      Method
                    </p>
                    <p className="text-xs font-bold text-gray-900 uppercase">
                      {order.paymentMethod || "COD"}
                    </p>
                  </div>
                  {/* Added Payment Status */}
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                      Payment
                    </p>
                    <p className="text-xs font-bold text-gray-900 uppercase">
                      {order.paymentStatus || "Pending"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`w-2 h-2 rounded-full ${order.status === "delivered" ? "bg-green-500" : order.status === "shipped" ? "bg-blue-500" : order.status === "cancelled" ? "bg-red-500" : "bg-orange-400"}`}
                  ></span>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-700">
                    {order.status}
                  </p>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-6">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-20 bg-gray-50 overflow-hidden">
                        <Image
                          src={item.product.image[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover grayscale hover:grayscale-0 transition-all"
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wide text-gray-900">
                          {item.product.name}
                        </h4>
                        <p className="text-[10px] text-gray-400 mt-1">
                          Size: {item.size} | Qty: {item.quantity}{" "}
                        </p>
                        {item.color ? (
                          <p className="text-[10px] text-gray-400 mt-1">
                            Color: {item.color}
                          </p>
                        ) : null}
                      </div>
                    </div>
                    <p className="text-xs font-bold text-gray-900">
                      ₦{item.price.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Order Footer / Actions */}
              {/* <div className="mt-8 pt-6 border-t border-gray-50 flex justify-end gap-4">
                <button className="text-[9px] font-bold uppercase tracking-widest border border-gray-900 px-6 py-3 hover:bg-black hover:text-white transition-all">
                  View Details
                </button>
                <button 
                  onClick={fetchOrders}
                  className="text-[9px] font-bold uppercase tracking-widest bg-indigo-600 text-white px-6 py-3 hover:bg-black transition-all"
                >
                  Track Order
                </button>
              </div> */}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-200 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:border-indigo-500 transition"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`w-10 h-10 border text-sm font-semibold transition ${
                currentPage === index + 1
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white border-gray-200 hover:border-indigo-500"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-200 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:border-indigo-500 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;

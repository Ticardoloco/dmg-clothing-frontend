"use client";
import {
  getOrders,
  updateOrderStatus,
  updatePaymentStatus,
  deleteOrder,
} from "@/lib/orderApi";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";

const OrderColorPreview = ({ colorName }) => {
  if (!colorName) return null;
  const colorMap = {
    black: "#000000",
    white: "#FFFFFF",
    grey: "#808080",
    gray: "#808080",
    navy: "#1E3A8A",
    beige: "#F5F5DC",
    cream: "#FDF6E2",
    brown: "#78350F",
    olive: "#374151",
    gold: "#D97706",
    blue: "#2563EB",
  };
  const normalized = colorName.toLowerCase().trim();
  const hex = colorMap[normalized];

  return (
    <span className="inline-flex items-center gap-1">
      {hex && (
        <span
          className="w-2 h-2 rounded-full border border-gray-300 inline-block"
          style={{ backgroundColor: hex }}
        />
      )}
      <span className="text-gray-500 capitalize">{colorName}</span>
    </span>
  );
};

const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders();
      setOrders(data.orders || []);
    } catch (error) {
      toast.error("Failed to load orders");
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // --- ORDER FULFILLMENT STATUS HANDLER ---
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order,
        ),
      );

      if (typeof updateOrderStatus === "function") {
        await updateOrderStatus(orderId, newStatus);
        toast.success(`Fulfillment updated to: ${newStatus}`);
      } else {
        throw new Error("Missing updateOrderStatus function");
      }
    } catch (error) {
      toast.error("Could not update fulfillment status");
      console.error(error);
      fetchOrders();
    }
  };

  // --- PAYMENT STATUS CHANGE HANDLER ---
  const handlePaymentStatusChange = async (orderId, newPaymentStatus) => {
    try {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? { ...order, paymentStatus: newPaymentStatus }
            : order,
        ),
      );

      if (typeof updatePaymentStatus === "function") {
        await updatePaymentStatus(orderId, newPaymentStatus);
        toast.success(`Payment updated to: ${newPaymentStatus}`);
      } else {
        throw new Error("Missing updatePaymentStatus function");
      }
    } catch (error) {
      toast.error("Could not update payment status");
      console.error(error);
      fetchOrders();
    }
  };

  // --- DELETE ORDER HANDLER ---
  const handleDeleteOrder = async (orderId) => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this order? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId),
      );

      if (typeof deleteOrder === "function") {
        await deleteOrder(orderId);
        toast.success("Order deleted successfully");
      } else {
        throw new Error("Missing deleteOrder function");
      }
    } catch (error) {
      toast.error("Could not delete order from backend database");
      console.error(error);
      fetchOrders();
    }
  };

  // Style helper for fulfillment statuses
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return {
          badge: "bg-green-50 text-green-700 border-green-200",
          dot: "bg-green-500",
        };
      case "shipped":
        return {
          badge: "bg-blue-50 text-blue-700 border-blue-200",
          dot: "bg-blue-500",
        };
      case "processing":
        return {
          badge: "bg-indigo-50 text-indigo-700 border-indigo-200",
          dot: "bg-indigo-500",
        };
      case "cancelled":
        return {
          badge: "bg-red-50 text-red-700 border-red-200",
          dot: "bg-red-500",
        };
      case "pending":
      default:
        return {
          badge: "bg-amber-50 text-amber-700 border-amber-200",
          dot: "bg-amber-500",
        };
    }
  };

  // Style helper for payment statuses (Styled cleanly just like Order Status)
  const getPaymentStatusStyle = (paymentStatus) => {
    switch (paymentStatus?.toLowerCase()) {
      case "paid":
        return {
          badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
          dot: "bg-emerald-500",
        };
      case "failed":
        return {
          badge: "bg-rose-50 text-rose-700 border-rose-200",
          dot: "bg-rose-500",
        };
      case "refunded":
        return {
          badge: "bg-purple-50 text-purple-700 border-purple-200",
          dot: "bg-purple-500",
        };
      case "pending":
      default:
        return {
          badge: "bg-orange-50 text-orange-700 border-orange-200",
          dot: "bg-orange-500",
        };
    }
  };

  const filteredOrders = orders.filter((order) => {
    const address = order.shippingAddress || {};
    const firstName = address.firstName || "";
    const lastName = address.lastName || "";
    const nameToSearch = `${firstName} ${lastName}`.trim();
    const idToSearch = order._id || "";

    return (
      nameToSearch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idToSearch.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  if (loading)
    return (
      <div className="pt-40 text-center font-prata">
        Loading customer orders...
      </div>
    );

  return (
    <div className="w-full max-w-5xl mx-auto space-y-10">
      <ToastContainer position="top-right" autoClose={1500} />

      {/* --- TOP HEADER BAR --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end pb-4 gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-prata uppercase tracking-tight">
            Customer{" "}
            <span className="text-indigo-600 italic font-light">Orders</span>
          </h1>
          <p className="text-[10px] font-bold text-gray-400 tracking-[0.2em] mt-1.5 uppercase">
            Track customer payments and package delivery status
          </p>
        </div>

        <div className="w-full lg:w-auto">
          <input
            type="text"
            placeholder="Search by Name or Order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-200 px-4 py-3 text-base sm:text-[10px] font-bold tracking-widest uppercase outline-none focus:border-indigo-600 text-gray-900 bg-white h-11 w-full lg:w-64 transition-all"
          />
        </div>
      </div>

      {/* --- ORDERS CONTAINER --- */}
      <div className="space-y-6">
        {filteredOrders.length === 0 ? (
          <div className="border border-gray-100 p-12 text-center text-gray-400 italic bg-white shadow-sm">
            No matching orders found.
          </div>
        ) : (
          filteredOrders.map((order) => {
            const styles = getStatusStyle(order.status);
            const paymentStyles = getPaymentStatusStyle(
              order.paymentStatus || order.payment,
            );
            const address = order.shippingAddress || {};

            return (
              <div
                key={order._id}
                className="border border-gray-100 bg-white shadow-sm hover:border-gray-200 transition-all overflow-hidden"
              >
                {/* Order Top Summary Line */}
                <div className="bg-gray-50/70 px-4 py-3 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="font-mono text-gray-400 font-bold uppercase">
                      {order._id}
                    </span>
                    <span className="text-gray-300 hidden sm:inline">|</span>
                    <span className="text-gray-500 font-medium">
                      Placed on:{" "}
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "Recent"}
                    </span>
                  </div>

                  {/* Action Controllers Container */}
                  <div className="flex items-center flex-wrap gap-2">
                    {/* Payment Status Dropdown Controller */}
                    <div
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 border ${paymentStyles.badge}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${paymentStyles.dot}`}
                      />
                      <select
                        value={order.paymentStatus?.toLowerCase() || "pending"}
                        onChange={(e) =>
                          handlePaymentStatusChange(order._id, e.target.value)
                        }
                        className="bg-transparent border-none text-[9px] font-bold uppercase tracking-widest outline-none cursor-pointer text-current pr-2"
                      >
                        <option
                          value="pending"
                          className="bg-white text-gray-900"
                        >
                          Payment: Pending
                        </option>
                        <option value="paid" className="bg-white text-gray-900">
                          Payment: Paid
                        </option>
                        <option
                          value="failed"
                          className="bg-white text-gray-900"
                        >
                          Payment: Failed
                        </option>
                        <option
                          value="refunded"
                          className="bg-white text-gray-900"
                        >
                          Payment: Refunded
                        </option>
                      </select>
                    </div>

                    {/* Order Fulfillment Status Dropdown Controller */}
                    <div
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 border ${styles.badge}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${styles.dot}`}
                      />
                      <select
                        value={order.status?.toLowerCase() || "pending"}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        className="bg-transparent border-none text-[9px] font-bold uppercase tracking-widest outline-none cursor-pointer text-current pr-2"
                      >
                        <option
                          value="pending"
                          className="bg-white text-gray-900"
                        >
                          Pending
                        </option>
                        <option
                          value="processing"
                          className="bg-white text-gray-900"
                        >
                          Processing
                        </option>
                        <option
                          value="shipped"
                          className="bg-white text-gray-900"
                        >
                          Shipped
                        </option>
                        <option
                          value="delivered"
                          className="bg-white text-gray-900"
                        >
                          Delivered
                        </option>
                        <option
                          value="cancelled"
                          className="bg-white text-gray-900"
                        >
                          Cancelled
                        </option>
                      </select>
                    </div>

                    {/* Minimalist Delete Action Button */}

                    <button
                      onClick={() => handleDeleteOrder(order._id)}
                      className="ml-2 border border-gray-200 hover:border-red-200 bg-white hover:bg-red-50 p-1.5 transition-all outline-none flex items-center justify-center"
                      style={{ width: "28px", height: "28px" }} // Explicitly defines the button canvas size
                      title="Delete Order Record"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        style={{
                          width: "14px",
                          height: "14px",
                          display: "block",
                        }} // Hardcoded fallback sizes
                        className="w-3.5 h-3.5 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        {/* Clean, simplified trash basket outline */}
                        <path
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6"
                          stroke="#9ca3af"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {/* Trash can lid */}
                        <path
                          d="M4 7h16M10 4h4"
                          stroke="#9ca3af"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Main Order Content Structure */}
                <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-6 text-xs items-start">
                  {/* Column 1: Customer Contact Info */}
                  <div className="space-y-1 border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0 md:pr-2">
                    <span className="text-[8px] uppercase tracking-wider text-gray-400 font-bold block mb-1">
                      Customer Details
                    </span>
                    <h4 className="font-bold text-gray-900 text-sm">
                      {address.firstName || ""} {address.lastName || ""}
                    </h4>
                    <p className="text-gray-500 font-medium">
                      {address.email || "No Email Provided"}
                    </p>

                     <p className="text-gray-500 font-medium mt-0.5">
                      {order.user.username || "No Phone Registered"}
                    </p>
                    
                    <p className="text-gray-500 font-medium mt-0.5">
                      {address.phone || "No Phone Registered"}
                    </p>
                    
                   
                  </div>

                  {/* Column 2: Shipping Address Area */}
                  <div className="border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0 md:pr-2">
                    <span className="text-[8px] uppercase tracking-wider text-gray-400 font-bold block mb-1">
                      Shipping Address
                    </span>
                    <p className="text-gray-700 font-medium leading-relaxed bg-gray-50 p-2.5 border border-gray-100 rounded-sm">
                      {address.street || ""}, {address.city || ""},{" "}
                      {address.state || ""}, {address.country || ""},{" "}
                      {address.zipcode || ""}
                    </p>
                  </div>

                  {/* Column 3: Bought Clothing Items */}
                  <div className="space-y-2 border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0 md:pr-2">
                    <span className="text-[8px] uppercase tracking-wider text-gray-400 font-bold block mb-1">
                      Purchased Clothes
                    </span>
                    <div className="space-y-2">
                      {(order.items || []).map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-gray-50/60 p-2.5 border border-gray-100 flex justify-between items-start gap-4"
                        >
                          <div className="w-full">
                            <div className="font-bold text-gray-900 leading-tight">
                              {item.product?.name || "Product Item"}
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 text-[10px] text-gray-400 mt-1">
                              <span className="font-bold text-gray-700 bg-white border border-gray-200 px-1 text-[8px]">
                                {item.size || "Free"}
                              </span>
                              {item.color && <div>
                                <span>•</span>
                              <OrderColorPreview colorName={item.color} />
                                </div>}
                              <span>•</span>
                              <span className="italic">
                                {item.product?.subCategory || "Streetwear"}
                              </span>
                            </div>
                          </div>

                          <div className="w-full text-right md:text-left self-center">
                            <p className="text-[9px] text-gray-400 uppercase tracking-wider">
                              Price
                            </p>
                            <p className="text-gray-900 font-bold text-xs">
                              ₦{(item.price || 0).toLocaleString()}
                            </p>
                          </div>

                          <span className="font-mono font-bold text-gray-600 whitespace-nowrap bg-white border border-gray-200 px-1.5 py-0.5 text-[9px]">
                            Qty: {item.quantity || 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Column 4: Total Price & Payment Method */}
                  <div className="flex flex-col justify-end items-start md:items-end pt-2 md:pt-0 space-y-3">
                    <div className="text-left md:text-right">
                      <span className="text-[8px] uppercase tracking-wider text-gray-400 font-bold block mb-0.5">
                        Method of Payment
                      </span>
                      <span className="inline-block bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold tracking-wider uppercase font-mono text-[9px] px-2 py-0.5 rounded-none">
                        {order.paymentMethod || order.paymentMode || "Paystack"}
                      </span>
                    </div>

                    <div className="text-left md:text-right">
                      <span className="text-[8px] uppercase tracking-wider text-gray-400 font-bold block mb-0.5">
                        Total Payment Received
                      </span>
                      <h3 className="text-lg font-bold text-gray-900 font-mono">
                        ₦{(order.totalAmount || 0).toLocaleString()}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CustomerOrders;

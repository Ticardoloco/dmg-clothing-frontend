"use client";
import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { toast, ToastContainer } from "react-toastify";
import { getOrders } from "@/lib/orderApi";
import { getUsers } from "@/lib/userApi";

// Helper component to render clean, visual color indicators safely
const ColorIndicator = ({ colorName }) => {
  if (!colorName) return null;
  
  // Simple mapping for common streetwear/fashion colors
  const colorMap = {
    black: "#000000",
    white: "#FFFFFF",
    grey: "#808080",
    gray: "#808080",
    red: "#EF4444",
    blue: "#3B82F6",
    green: "#10B981",
    cream: "#FDF6E2",
    beige: "#F5F5DC",
    brown: "#78350F"
  };

  const normalized = colorName.toLowerCase().trim();
  const hex = colorMap[normalized];

  return (
    <span className="inline-flex items-center gap-1">
      {hex ? (
        <span 
          className="w-2.5 h-2.5 rounded-full border border-gray-300 inline-block" 
          style={{ backgroundColor: hex }} 
        />
      ) : null}
      <span className="text-gray-500 capitalize">{colorName}</span>
    </span>
  );
};

const AdminDashboard = () => {
  const { token } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, totalUsers: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const data = await getOrders();
        const totalRevenue = data.orders.reduce((sum, order) => sum + order.totalAmount, 0);
        const totalOrders = data.count;
      
        
        setStats({ totalRevenue, totalOrders, totalUsers });
        setRecentOrders(data.orders);
      } catch (err) {
        toast.error("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();

    const fetchUsers = async ()=>{
      try {
        const data = await getUsers();
        const totalUsers = data.count;
        setTotalUsers(totalUsers);
      } catch (error) {
        toast.error("Failed to load user data.");
      }
    }
    fetchUsers();
  }, [token]);

  if (!token) {
    return <div className="pt-40 text-center font-prata text-gray-900">Access Denied. Please Login.</div>;
  }

  if (loading) return <div className="pt-40 text-center font-prata">Loading dashboard metrics...</div>;

  const filteredOrders = recentOrders.filter((order) =>
    (order.user?.username || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (order._id || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Status Style Helper Configuration Matrix
  const getStatusStyles = (status) => {
    switch(status) {
      case "delivered":
        return { badge: "bg-green-50 text-green-700 border-green-200", dot: "bg-green-500" };
      case "shipped":
        return { badge: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500" };
      default:
        return { badge: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" };
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-10">
      <ToastContainer position="top-right" autoClose={1500} />

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end pb-4 gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-prata uppercase tracking-tight">
            Control <span className="text-indigo-600 italic font-light">Console</span>
          </h1>
          <p className="text-sm md:text-base font-bold text-gray-400 tracking-[0.2em] mt-1.5 uppercase">
            Storefront Overview
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <input 
            type="text" 
            placeholder="Search orders by username..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-200 px-4 py-3 text-base md:text-lg sm:text-[10px] font-bold tracking-widest  outline-none focus:border-indigo-600 text-gray-900 bg-white h-11 w-full lg:w-56 rounded-none transition-all"
          />
          <button className="bg-indigo-600 text-white px-6 py-3 text-sm md:text-base font-bold uppercase tracking-widest hover:bg-black transition-all h-11 active:scale-[0.99]">
            Add New
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border border-gray-100 p-6 bg-white shadow-sm hover:border-gray-300 transition-all">
          <p className="text-sm md:text-base font-bold text-gray-400 uppercase tracking-widest mb-1">Total Revenue</p>
          <h3 className="text-xl md:text-2xl font-bold font-prata text-gray-900">₦{stats.totalRevenue.toLocaleString()}</h3>
        </div>
        <div className="border border-gray-100 p-6 bg-white shadow-sm hover:border-gray-300 transition-all">
          <p className="text-sm md:text-base font-bold text-gray-400 uppercase tracking-widest mb-1">Total Orders</p>
          <h3 className="text-xl md:text-2xl font-bold font-prata text-gray-900">{stats.totalOrders}</h3>
        </div>
        <div className="border border-gray-100 p-6 bg-white shadow-sm hover:border-gray-300 transition-all">
          <p className="text-sm md:text-base font-bold text-gray-400 uppercase tracking-widest mb-1">Total Users</p>
          <h3 className="text-xl md:text-2xl font-bold font-prata text-gray-900">{totalUsers}</h3>
        </div>
      </div>

      {/* Order Log Feed */}
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-gray-100 pb-2.5">
          <h3 className="text-sm md:text-base font-bold uppercase tracking-[0.3em] text-gray-400">Recent Activity</h3>
          <span className="text-sm md:text-base font-mono text-gray-500 bg-gray-100 px-2 py-0.5 font-bold">Count: {filteredOrders.length}</span>
        </div>

        {/* Desktop Interactive Table Layout */}
        <div className="hidden md:block border border-gray-100 bg-white overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse text-sm md:text-base">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 text-xs  font-bold uppercase tracking-widest">
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Manifest Line Items</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4 text-right">Status State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-400 italic">No matching orders found.</td>
                </tr>
              ) : (
                filteredOrders.toReversed().slice(0, 5).map((order) => {
                  const styles = getStatusStyles(order.status);
                  return (
                    <tr key={order._id} className="hover:bg-gray-50/70 transition-colors align-top group">
                      <td className="p-4 font-mono text-gray-400 pt-5 group-hover:text-indigo-600 transition-colors">{order._id}</td>
                      <td className="p-4 font-bold text-gray-900 pt-5">{order.user?.username || "Unknown"}</td>
                      
                      {/* Products Stack Column */}
                      <td className="p-4 space-y-2">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="bg-gray-50/60 p-2 border border-gray-100 flex items-center justify-between gap-4 max-w-md">
                            <div>
                              <div className="font-bold text-gray-900 text-sm md:text-base">{item.product?.name || "Unknown Item"}</div>
                              <div className="flex items-center gap-3 text-sm md:text-base mt-0.5 text-gray-500">
                                <span className="font-bold text-gray-700">Size: {item.size || "OS"}</span>
                                <span>•</span>
                                <ColorIndicator colorName={item.color} />
                              </div>
                            </div>
                            <span className="bg-white border border-gray-200 px-2 py-0.5 font-mono font-bold text-sm md:text-base text-gray-600">
                              qty: {item.quantity || 1}
                            </span>
                          </div>
                        ))}
                      </td>

                      <td className="p-4 font-bold text-gray-900 pt-5 text-sm md:text-base">₦{order.totalAmount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}</td>
                      <td className="p-4 text-right pt-5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs md:text-sm font-bold uppercase tracking-widest border ${styles.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
                          {order.status || "Pending"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Interactive Feed Stack Layout */}
        <div className="block md:hidden space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="border border-gray-100 p-8 text-center text-gray-400 italic bg-white">
              No matching orders found.
            </div>
          ) : (
            filteredOrders.toReversed().slice(0, 5).map((order) => {
              const styles = getStatusStyles(order.status);
              return (
                <div key={order._id} className="border border-gray-100 p-4 bg-white shadow-sm space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs text-gray-400 font-bold">{order._id}</span>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs  font-bold uppercase tracking-widest border ${styles.badge}`}>
                      <span className={`w-1 h-1 rounded-full ${styles.dot}`} />
                      {order.status || "Pending"}
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-sm md:text-base uppercase tracking-wider text-gray-400 block font-bold mb-0.5">Customer account</span>
                    <h4 className="font-bold text-gray-900 text-sm ">{order.user?.username || "Unknown Customer"}</h4>
                    
                    {/* Organized Product Content blocks */}
                    <div className="mt-3 space-y-2">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="bg-gray-50 p-2.5 border border-gray-100 flex justify-between items-start gap-2">
                          <div>
                            <div className="font-bold text-gray-800 text-sm md:text-base leading-tight">{item.product?.name || "Unknown Product"}</div>
                            <div className="flex items-center gap-2 mt-1.5 text-xs">
                              <span className="bg-white px-1.5 py-0.5 border border-gray-200 font-black text-gray-700 text-sm md:text-base">
                                {item.size || "OS"}
                              </span>
                              <ColorIndicator colorName={item.color} />
                            </div>
                          </div>
                          <span className="text-gray-400 text-sm font-bold whitespace-nowrap">
                            × {item.quantity || 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-sm md:text-base text-gray-400 uppercase tracking-widest font-bold">Total Statement Amount</span>
                    <span className="font-bold text-indigo-600 text-sm md:text-base">₦{order.totalAmount?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || "0.00"}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
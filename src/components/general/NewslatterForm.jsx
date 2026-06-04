"use client";

import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';

export default function NewsletterForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "" });


  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/mailinglist/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        toast.error(data.message || "Failed to subscribe to mailing list");
        return; // 🔥 This stops the function from showing the success toast!
      }

      toast.success("Subscribed to mailing list successfully");
      setFormData({ email: "" });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast.error("An error occurred while subscribing to the mailing list");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <ToastContainer position='top-right' autoClose={1500} />
      <p className="text-base md:text-lg font-bold uppercase tracking-widest text-gray-900">Join our mailing list</p>
      <form onSubmit={handleSubmit} className="flex w-full max-w-md">
        <input 
          type="email" 
          placeholder="Enter your email" 
          value={formData.email}
          onChange={handleChange}
          name='email'
          className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-base md:text-lg focus:outline-none focus:border-indigo-600 transition-colors"
        />
        <button type='submit' disabled={loading} className="bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-indigo-600 transition-colors">
          {loading ? "Subscribing..." : "Subscribe"}
        </button>
      </form>
    </div>
  );
}
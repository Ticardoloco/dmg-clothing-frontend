"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAuthStore } from "@/store/authStore";
import { toast, ToastContainer } from "react-toastify"; // Optional: for premium notifications
import BrandFeatures from "@/components/home/BrandFeatures";

const ProfilePage = () => {
  const { user, token, setUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // 1. Initial State matching your backend requirements
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    avatar: "",
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
    },
  });

  // 2. Sync Global User Data to Local Form
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        avatar:
          user.avatar ||
          "https://res.cloudinary.com/dyo0bdgnf/image/upload/v1778246491/avatar_dno6bq.png",
        address: {
          street: user.address?.street || "",
          city: user.address?.city || "",
          state: user.address?.state || "",
          country: user.address?.country || "",
        },
      });
    }
  }, [user]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const base64Image = reader.result;

      setLoading(true); // Start loading spinner
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64Image }),
        });

        const data = await res.json();

        if (data.url) {
          // Update the form with the actual Cloudinary URL
          setFormData((prev) => ({ ...prev, avatar: data.url }));
          toast.success("Image uploaded to cloud!");
        }
      } catch (err) {
        toast.error("Image upload failed");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  };

  // 3. Handlers for Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value },
    }));
  };

  // 4. Post Data to API
  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:4001/api/v1/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Or 'Authorization': `Bearer ${token}` based on your middleware
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 401) {
        toast.error("Session expired. Please login again.");

        // Clear Zustand auth
        setUser(null);

        // Remove token from localStorage
        localStorage.removeItem("token");

        // Redirect
        window.location.href = "/login";

        return;
      }

      if (response.status === 413) {
        toast.error("Image size too large. Please use a smaller photo.");
        return;
      }

      const text = await response.text();
      let result;

      try {
        result = JSON.parse(text);
      } catch (err) {
        console.error("Server returned non-JSON:", text);
        toast.error("Server returned invalid response");
        return;
      }

      if (!response.ok) {
        toast.error(result.message || "Update failed");
        return;
      }

      if (result.success) {
        console.log("Updated", result);
        setUser(result.updatedUser);

        toast.success("Profile updated successfully");

        setIsEditing(false);
      } else {
        toast.error(result.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Profile Update Error:", error);
      toast.error("An error occurred during update.");
    } finally {
      setLoading(false);
    }
  };

  if (!token)
    return (
      <div className="pt-40 text-center font-prata italic">
        Access Denied. Please Login.
      </div>
    );

  return (
    <div className="pt-28 pb-20 px-6 max-w-6xl mx-auto">
      <ToastContainer position="top-right" autoClose={1500} />
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-100 pb-10 lg:mb-12 gap-6">
        <div className="flex items-center gap-6">
          <div className="relative w-20 h-20 md:w-28 md:h-28 rounded-full flex overflow-hidden border-2 border-indigo-600 ">
            {isEditing ? (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="self-center hidden"
                  id="profileImageUpload"
                />

                <label
                  htmlFor="profileImageUpload"
                  className="cursor-pointer bg-indigo-600 w-full h-full rounded-full text-white px-4 py-2 text-2xl inline-flex justify-center items-center hover:bg-black transition-all"
                >
                  Edit
                </label>
              </>
            ) : (
              <Image
                src={
                  formData.avatar ||
                  "https://res.cloudinary.com/dyo0bdgnf/image/upload/v1778246491/avatar_dno6bq.png"
                }
                alt="Avatar"
                fill
                className="rounded-full object-cover opacity-90"
              />
            )}
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold font-prata uppercase leading-tight">
              {formData.username || "Member"}{" "}
              <span className="text-indigo-600 italic font-light">Profile</span>
            </h1>
            <p className="text-xs font-bold text-gray-400 tracking-widest mt-1">
              {formData.email}
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-red-500"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateProfile}
                disabled={loading}
                className="bg-indigo-600 text-white px-8 py-3 text-[10px] font-bold uppercase tracking-widest shadow-lg hover:bg-black transition-all"
              >
                {loading ? "Updating..." : "Save Changes"}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="border border-gray-900 px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* --- BASIC INFO SECTION --- */}
        <div className="space-y-10">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-300">
            Account Credentials
          </h3>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Username
            </label>
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              disabled={!isEditing}
              className={`py-3 border-b outline-none transition-all ${isEditing ? "border-indigo-600 text-gray-900" : "border-gray-100 text-gray-400"}`}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Phone Number
            </label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing}
              className={`py-3 border-b outline-none transition-all ${isEditing ? "border-indigo-600 text-gray-900" : "border-gray-100 text-gray-400"}`}
            />
          </div>
        </div>

        {/* --- ADDRESS SECTION --- */}
        <div className="space-y-10">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-300">
            Shipping Details
          </h3>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Street Address
            </label>
            <input
              name="street"
              value={formData.address.street}
              onChange={handleAddressChange}
              disabled={!isEditing}
              className={`py-3 border-b outline-none transition-all ${isEditing ? "border-indigo-600 text-gray-900" : "border-gray-100 text-gray-400"}`}
            />
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                City
              </label>
              <input
                name="city"
                value={formData.address.city}
                onChange={handleAddressChange}
                disabled={!isEditing}
                className={`py-3 border-b outline-none transition-all ${isEditing ? "border-indigo-600 text-gray-900" : "border-gray-100 text-gray-400"}`}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                State
              </label>
              <input
                name="state"
                value={formData.address.state}
                onChange={handleAddressChange}
                disabled={!isEditing}
                className={`py-3 border-b outline-none transition-all ${isEditing ? "border-indigo-600 text-gray-900" : "border-gray-100 text-gray-400"}`}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Country
            </label>
            <input
              name="country"
              value={formData.address.country}
              onChange={handleAddressChange}
              disabled={!isEditing}
              className={`py-3 border-b outline-none transition-all ${isEditing ? "border-indigo-600 text-gray-900" : "border-gray-100 text-gray-400"}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

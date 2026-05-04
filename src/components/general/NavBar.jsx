/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useSearchStore } from "@/store/useSearchStore";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/authStore";

const NavBar = () => {
  const [slide, setSlide] = useState("Home");
  const [visible, setVisible] = useState(false); // Sidebar toggle
  const [mobileShopOpen, setMobileShopOpen] = useState(false); // Mobile dropdown toggle
  const [mounted, setMounted] = useState(false);

  const { setOpen } = useSearchStore();
  const cart = useCartStore((state) => state.cart);
  const totalItems = useCartStore((state) =>
    state.cart.reduce((total, item) => total + item.quantity, 0),
  );

  const router = useRouter();

  const { token, user, logOut } = useAuthStore();

  const handleLogout = () => {
    logOut();
    router.push("/login");
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed top-0 left-0 w-full z-40 bg-white/90 backdrop-blur-md px-6 py-5 flex items-center justify-between font-medium border-b border-gray-100">
      {/* Logo */}
      <Link href="/" onClick={() => setSlide("Home")}>
        <h2 className="font-bold text-2xl sm:text-3xl text-black font-prata">
          DMG
          <span className="text-sm sm:text-base font-semibold text-indigo-600">
            Clothing
          </span>
        </h2>
      </Link>

      {/* Desktop Menu */}
      <ul className="hidden sm:flex gap-5 text-sm uppercase tracking-widest text-gray-700">
        <li
          onClick={() => setSlide("Home")}
          className={`cursor-pointer ${slide === "Home" ? "border-b-2 border-indigo-600 text-indigo-600" : ""}`}
        >
          <Link href="/">Home</Link>
        </li>

        <li
          onClick={() => setSlide("Shop")}
          className={`relative group cursor-pointer ${slide === "Shop" ? "border-b-2 border-indigo-600 text-indigo-600" : ""}`}
        >
          <Link href="/shop">Shop</Link>
          <div className="hidden z-10 absolute top-6 -left-10 shadow-lg group-hover:block transition-all">
            <ul className="w-40 bg-white py-3 flex flex-col gap-1 border-t-2 border-indigo-600">
              {[
                "Agbada",
                "Kaftan",
                "Jalabiya",
                "Vintage",
                "Jacket",
                "Cargo Pant",
              ].map((item) => (
                <li
                  key={item}
                  className="text-xs text-gray-800 hover:bg-gray-100 px-5 py-2 whitespace-nowrap"
                >
                  <Link href={`/shop/${item.toLowerCase().replace(" ", "-")}`}>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </li>

        <li
          onClick={() => setSlide("About")}
          className={`cursor-pointer ${slide === "About" ? "border-b-2 border-indigo-600 text-indigo-600" : ""}`}
        >
          <Link href="/about">About</Link>
        </li>

        <li
          onClick={() => setSlide("Contact")}
          className={`cursor-pointer ${slide === "Contact" ? "border-b-2 border-indigo-600 text-indigo-600" : ""}`}
        >
          <Link href="/contact">Contact</Link>
        </li>
      </ul>

      {/* Icons */}
      <div className="flex items-center gap-4 sm:gap-6">
        <Image
          onClick={() => setOpen(true)}
          width={20}
          height={20}
          src="/search.png"
          alt="search"
          className="w-5 cursor-pointer opacity-80"
        />
        <div className="relative group hidden md:block">
          <Link href={token ? "/proflie" : "/login"} className="">
            <Image
              width={20}
              height={20}
              src="/user.png"
              alt="user"
              className="w-5 cursor-pointer opacity-80 "
            />
          </Link>

          {token && (
            <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4 z-50">
              <div className="flex flex-col gap-2 w-40 py-3 px-5 bg-white shadow-xl text-gray-700 border-t-2 border-indigo-600">
                <p className="text-xs font-bold text-indigo-600 truncate">
                  Hi, {user?.username || "User"}
                </p>
                <hr className="border-gray-100" />
                <Link
                  href="/my-orders"
                  className="cursor-pointer hover:text-indigo-600 text-xs transition-colors"
                >
                  My Orders
                </Link>
                <Link
                  href="/profile"
                  className="cursor-pointer hover:text-indigo-600 text-xs transition-colors"
                >
                  My Profile
                </Link>
                <p
                  onClick={handleLogout}
                  className="cursor-pointer hover:text-red-500 text-xs font-semibold transition-colors"
                >
                  Logout
                </p>
              </div>
            </div>
          )}
        </div>
        {/* Cart Icon */}
        <Link href="/cart" className="relative group">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-gray-800 group-hover:text-indigo-600 transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          {cart.length > 0 && (
            <p className="absolute -right-1 -bottom-1 w-4 h-4 text-center leading-4 bg-indigo-600 text-white rounded-full text-[8px] font-bold">
              {totalItems}
            </p>
          )}
        </Link>

        {/* Hamburger Icon */}
        <Image
          onClick={() => setVisible(true)}
          width={24}
          height={24}
          src="/menu.png"
          alt="menu"
          className="w-6 block sm:hidden cursor-pointer"
        />
      </div>

      {/* --- MOBILE SIDEBAR MENU --- */}
      <div
        className={`fixed h-screen top-0 right-0 bottom-0 bg-white z-50 transition-all duration-300 shadow-2xl overflow-hidden ${visible ? "w-full" : "w-0"}`}
      >
        <div className="flex flex-col text-gray-700 h-full">
          {/* Close Area */}

          <div className="flex items-center justify-between  border-b border-gray-100">
            <div
              onClick={() => {
                setVisible(false);
                setMobileShopOpen(false);
              }}
              className="flex items-center gap-4 p-6 cursor-pointer border-b border-gray-100"
            >
              <span className="text-xl">✕</span>
            </div>

            {/* Mobile User Greeting */}
            {token && (
              <p className="text-[10px] font-bold uppercase tracking-widest pr-6 text-indigo-600">
                Hi, {user?.username}
              </p>
            )}
          </div>

          {/* Links Container */}
          <div className="flex flex-col h-full bg-white">
            <Link
              onClick={() => setVisible(false)}
              className="py-5 px-6 border-b border-gray-50 text-sm font-bold uppercase"
              href="/"
            >
              Home
            </Link>

            {/* Mobile Shop Dropdown */}
            <div className="flex flex-col border-b border-gray-50">
              <div
                onClick={() => setMobileShopOpen(!mobileShopOpen)}
                className="py-5 px-6 flex justify-between items-center cursor-pointer text-sm font-bold uppercase"
              >
                <span onClick={() => setVisible(false)}>
                  <Link href="/shop">Shop</Link>
                </span>
                <span
                  className={`transition-transform duration-300 ${mobileShopOpen ? "rotate-180" : ""}`}
                >
                  ▼
                </span>
              </div>

              {/* Sub-menu items */}
              <div
                className={`bg-gray-50 transition-all duration-300 overflow-hidden ${mobileShopOpen ? "max-h-96" : "max-h-0"}`}
              >
                {[
                  "Agbada",
                  "Kaftan",
                  "Jalabiya",
                  "Vintage",
                  "Jacket",
                  "Cargo Pant",
                ].map((item) => (
                  <Link
                    key={item}
                    onClick={() => setVisible(false)}
                    className="block py-4 px-14 text-xs font-semibold uppercase text-gray-500 hover:text-indigo-600"
                    href={`/shop/${item.toLowerCase().replace(" ", "-")}`}
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              onClick={() => setVisible(false)}
              className="py-5 px-6 border-b border-gray-50 text-sm font-bold uppercase"
              href="/about"
            >
              About
            </Link>
            <Link
              onClick={() => setVisible(false)}
              className="py-5 px-6 border-b border-gray-50 text-sm font-bold uppercase"
              href="/contact"
            >
              Contact
            </Link>

            {/* --- USER SPECIFIC MOBILE LINKS --- */}
            {token ? (
              <>
                <Link
                  onClick={() => setVisible(false)}
                  className="py-5 px-6 border-b border-gray-50 text-sm font-bold uppercase text-gray-500"
                  href="/my-orders"
                >
                  My Orders
                </Link>
                <Link
                  onClick={() => setVisible(false)}
                  className="py-5 px-6 border-b border-gray-50 text-sm font-bold uppercase text-gray-500"
                  href="/profile"
                >
                  My Profile
                </Link>
                <div
                  onClick={() => {
                    handleLogout();
                    setVisible(false);
                  }}
                  className="py-8 px-6 text-sm font-bold uppercase text-red-500 cursor-pointer mt-auto border-t border-gray-100 bg-gray-50"
                >
                  Logout
                </div>
              </>
            ) : (
              <Link
                onClick={() => setVisible(false)}
                className="py-5 px-6 border-b border-gray-50 text-sm font-bold uppercase bg-indigo-600 text-white"
                href="/login"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;

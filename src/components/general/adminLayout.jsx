// "use client";
// import { useEffect, useState } from "react";
// import { useAuthStore } from "@/store/authStore";
// import { useRouter, usePathname } from "next/navigation";
// import Link from "next/link";

// export default function AdminLayout({ children }) {
//   const user = useAuthStore((state) => state.user);
//   const token = useAuthStore((state) => state.token);
//   const hydrated = useAuthStore((state) => state.hydrated);
//   const logOut = useAuthStore((state) => state.logOut);
//   const router = useRouter();
//   const pathname = usePathname(); // Highlights active route automatically

//   // State to handle mobile responsive drawer
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   useEffect(() => {
//     // 1. Wait until Zustand reads from localStorage completely
//     if (!hydrated) return;

//     // 2. Kick them out if they aren't authenticated or aren't an admin
//     if (!token || !user || !user.isAdmin) {
//       router.push("/login");
//     }
//   }, [user, token, hydrated, router]);

//   // Prevent UI flashing while redirecting
//   if (!hydrated || !user || !user.isAdmin) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-white text-xs uppercase tracking-widest text-gray-400">
//         Verifying Security Credentials...
//       </div>
//     );
//   }

//   // Active style helper for layout navigation
//   const isActive = (path) =>
//     pathname === path
//       ? "text-indigo-600 font-bold"
//       : "text-gray-500 hover:text-black";

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row text-gray-800 antialiased">
//       {/* --- MOBILE ACCESSIBLE HEADER BAR --- */}
//       <div className="flex items-center justify-between md:hidden bg-white border-b border-gray-200 px-5 py-4 w-full fixed top-0 left-0 z-40 h-16">
//         <button
//           onClick={() => setIsSidebarOpen(true)}
//           className="text-gray-900 p-1.5 rounded-md hover:bg-gray-50 active:scale-95 transition-all"
//         >
//           <svg
//             className="w-6 h-6"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M4 6h16M4 12h16M4 18h16"
//             />
//           </svg>
//         </button>
//         <span className="font-prata text-base uppercase tracking-wider text-indigo-600">
//           DMG Studio
//         </span>
//         <div className="w-6 h-6 opacity-0" /> {/* Balancing Spacer */}
//       </div>

//       {/* --- RESPONSIVE SIDEBAR MOBILE BACKGROUND OVERLAY --- */}
//       {isSidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden transition-opacity"
//           onClick={() => setIsSidebarOpen(false)}
//         />
//       )}

//       {/* --- ADMIN DRAWER SIDEBAR PANEL --- */}
//       <aside
//         className={`
//         fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 p-6 flex flex-col justify-between 
//         transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen md:sticky md:top-0
//         ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
//       `}
//       >
//         <div className="space-y-10">
//           {/* Sidebar Top: Branding & Close Button */}
//           <div className="flex items-center justify-between mt-2 md:mt-0">
//             <div className="text-xl font-prata tracking-wide text-gray-900 uppercase">
//               DMG Admin
//             </div>
//             <button
//               onClick={() => setIsSidebarOpen(false)}
//               className="md:hidden text-gray-400 hover:text-black p-1 active:scale-95"
//             >
//               <svg
//                 className="w-5 h-5"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             </button>
//           </div>

//           {/* Structured Navigation Elements */}
//           <nav className="flex flex-col space-y-4 text-xs font-bold uppercase tracking-widest">
//             <Link
//               href="/admin"
//               onClick={() => setIsSidebarOpen(false)}
//               className={`transition-colors py-1 ${isActive("/admin")}`}
//             >
//               Dashboard Overview
//             </Link>
//             <Link
//               href="/admin/products"
//               onClick={() => setIsSidebarOpen(false)}
//               className={`transition-colors py-1 ${isActive("/admin/products")}`}
//             >
//               Manage Products
//             </Link>
//             <Link
//               href="/admin/orders"
//               onClick={() => setIsSidebarOpen(false)}
//               className={`transition-colors py-1 ${isActive("/admin/orders")}`}
//             >
//               Customer Orders
//             </Link>
//           </nav>
//         </div>

//         {/* Sidebar Footer Action */}
//         <button
//           onClick={() => {
//             setIsSidebarOpen(false);
//             logOut();
//           }}
//           className="text-left text-[10px] uppercase tracking-widest text-red-600 hover:text-red-800 font-bold transition-colors pt-6 border-t border-gray-100"
//         >
//           Logout Admin Panel
//         </button>
//       </aside>

//       {/* --- CONTENT MATRIX CONTAINER --- */}
//       {/* Note: pt-16 ensures the elements don't hide beneath the mobile top header panel */}
//       <main className="flex-1 p-5 sm:p-8 lg:p-12 pt-24 md:pt-10 min-w-0">
//         {children}
//       </main>
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({ children }) {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const hydrated = useAuthStore((state) => state.hydrated);
  const logOut = useAuthStore((state) => state.logOut);
  const router = useRouter();
  const pathname = usePathname(); // Highlights active route automatically

  // State to handle mobile responsive drawer
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // 1. Wait until Zustand reads from localStorage completely
    if (!hydrated) return;

    // 2. Kick them out if they aren't authenticated or aren't an admin
    if (!token || !user || !user.isAdmin) {
      router.push("/login");
    }
  }, [user, token, hydrated, router]);

  // Prevent UI flashing while redirecting
  if (!hydrated || !user || !user.isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-xs uppercase tracking-widest text-gray-400">
        Verifying Security Credentials...
      </div>
    );
  }

  // Active style helper for layout navigation
  const isActive = (path) =>
    pathname === path
      ? "text-indigo-600 font-bold"
      : "text-gray-500 hover:text-black";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row text-gray-800 antialiased">
      {/* --- MOBILE ACCESSIBLE HEADER BAR --- */}
      <div className="flex items-center justify-between md:hidden bg-white border-b border-gray-200 px-5 py-4 w-full fixed top-0 left-0 z-40 h-16">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="text-gray-900 p-1.5 rounded-md hover:bg-gray-50 active:scale-95 transition-all"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <span className="font-prata text-base uppercase tracking-wider text-indigo-600">
          DMG Studio
        </span>
        <div className="w-6 h-6 opacity-0" /> {/* Balancing Spacer */}
      </div>

      {/* --- RESPONSIVE SIDEBAR MOBILE BACKGROUND OVERLAY --- */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* --- ADMIN DRAWER SIDEBAR PANEL --- */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 p-6 flex flex-col justify-between 
        transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen md:sticky md:top-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="space-y-10">
          {/* Sidebar Top: Branding & Close Button */}
          <div className="flex items-center justify-between mt-2 md:mt-0">
            <div className="text-xl font-prata tracking-wide text-gray-900 uppercase">
              DMG Admin
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden text-gray-400 hover:text-black p-1 active:scale-95"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Structured Navigation Elements */}
          <nav className="flex flex-col space-y-4 text-xs font-bold uppercase tracking-widest">
            <Link
              href="/admin"
              onClick={() => setIsSidebarOpen(false)}
              className={`transition-colors py-1 ${isActive("/admin")}`}
            >
              Dashboard Overview
            </Link>
            
            <Link
              href="/admin/products"
              onClick={() => setIsSidebarOpen(false)}
              className={`transition-colors py-1 ${isActive("/admin/products")}`}
            >
              Manage Products
            </Link>
            
            <Link
              href="/admin/orders"
              onClick={() => setIsSidebarOpen(false)}
              className={`transition-colors py-1 ${isActive("/admin/orders")}`}
            >
              Customer Orders
            </Link>

            <Link
              href="/admin/users"
              onClick={() => setIsSidebarOpen(false)}
              className={`transition-colors py-1 ${isActive("/admin/users")}`}
            >
              User Management
            </Link>

            <Link
              href="/admin/contacts"
              onClick={() => setIsSidebarOpen(false)}
              className={`transition-colors py-1 ${isActive("/admin/contacts")}`}
            >
              Contact Messages
            </Link>
          </nav>
        </div>

        {/* Sidebar Footer Action */}
        <button
          onClick={() => {
            setIsSidebarOpen(false);
            logOut();
          }}
          className="text-left text-[10px] uppercase tracking-widest text-red-600 hover:text-red-800 font-bold transition-colors pt-6 border-t border-gray-100"
        >
          Logout Admin Panel
        </button>
      </aside>

      {/* --- CONTENT MATRIX CONTAINER --- */}
      {/* Note: pt-16 ensures the elements don't hide beneath the mobile top header panel */}
      <main className="flex-1 p-5 sm:p-8 lg:p-12 pt-24 md:pt-10 min-w-0">
        {children}
      </main>
    </div>
  );
}

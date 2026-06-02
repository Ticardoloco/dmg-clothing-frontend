"use client"
import React, { use } from 'react'
import Header from './Header'
import Footer from './Footer'
import { usePathname } from 'next/navigation'

export default function RootLayoutShell({children}) {
    const pathname = usePathname();

    // Check if the current path starts with "/admin"
    const isAdminRoute = pathname.startsWith("/admin");
  return (
    <div>
        {!isAdminRoute && <Header/>}
      {children}
        {!isAdminRoute && <Footer/>}
    </div>
  )
}

"use client";

import React from "react";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center justify-center px-4 relative">
      <div className="text-center max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-6xl font-bold font-prata text-zinc-900">404</h1>
          <h2 className="text-lg font-medium text-zinc-900">Page not found</h2>
        </div>

        {/* Description */}
        <p className="text-zinc-600 text-sm md:text-base leading-relaxed">
          We couldn&rsquo;t find the page you were looking for. Please check the URL for errors or return to the homepage to continue browsing.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="bg-indigo-600 text-white px-6 py-2.5 text-sm font-semibold hover:bg-indigo-700 transition-colors w-full sm:w-auto"
          >
            Go to Homepage
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="border border-zinc-200 text-zinc-700 px-6 py-2.5 text-sm font-semibold hover:bg-zinc-50 transition-colors w-full sm:w-auto"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
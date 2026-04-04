"use client";
import React, { useState } from "react";
import HallCard from "@/components/HallCard";
import Navbar from "@/components/Navbar";

export default function HallsClient({ initialHalls }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredHalls = initialHalls.filter((hall) => {
    const nameMatch = hall.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const locationMatch = hall.location?.toLowerCase().includes(searchTerm.toLowerCase());
    return nameMatch || locationMatch;
  });

  return (
    <div className="min-h-screen bg-[#dacfa3] relative font-sans" dir="rtl">
      <Navbar activePage="halls" />
      
      <div className="pt-44 pb-20 container max-w-7xl mx-auto px-4">
        
        {/* Search Bar Focus Wrapper */}
        <div className="w-full max-w-xl mx-auto mb-16 relative">
          <input 
            type="text" 
            placeholder="ابحث باسم القاعة أو الموقع..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-6 pr-14 py-4 bg-white/70 backdrop-blur-md border border-white/50 rounded-2xl shadow-md focus:outline-none focus:ring-4 focus:ring-[#C8A97E]/40 text-gray-800 placeholder-gray-500 font-bold text-lg transition-all"
          />
          {/* Search Icon */}
          <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Halls Grid Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-y-14 gap-x-8 justify-items-center">
          {filteredHalls.map((hall) => (
            <HallCard 
              key={hall.id || hall.name}
              image={hall.image || `https://via.placeholder.com/400x300/e2e8f0/384252?text=${encodeURIComponent(hall.name || 'Hall')}`}
              name={hall.name || "قاعة غير معروفة"}
              capacity={hall.capacity || 500}
              location={hall.location || "المكلا"}
              price={hall.price || "10,000"}
              isFeatured={hall.is_featured ?? hall.isFeatured ?? false}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredHalls.length === 0 && (
          <div className="text-center text-gray-700 font-bold text-xl mt-20 border border-gray-300/30 bg-white/30 backdrop-blur-sm p-10 rounded-2xl max-w-lg mx-auto shadow-sm">
            لا توجد قاعات مطابقة لبحثك.
          </div>
        )}
        
      </div>
    </div>
  );
}

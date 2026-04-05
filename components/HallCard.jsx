"use client";
import React from "react";
import { Users, MapPin, BadgeDollarSign } from "lucide-react";
import Link from "next/link";

export default function HallCard({ id, image, name, capacity, location, price, isFeatured }) {
  return (
    <div className="bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden flex flex-col items-center transition-transform hover:scale-[1.02]">
      <div className="w-full relative">
        <img src="/hall.jpg" alt={name} className="w-full h-48 object-cover" />
        {isFeatured && (
          <span className="absolute top-3 right-3 bg-gray-600/60 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-semibold">
            الأكثر حجزاً
          </span>
        )}
      </div>
      <div className="p-6 flex flex-col items-center flex-grow w-full text-center">
        <h3 className="text-xl font-bold text-ewan-blue mb-4">{name}</h3>
        
        <div className="space-y-3 mb-6 flex flex-col items-start w-fit mx-auto pl-2 pr-6">
          <div className="flex items-center text-gray-700 text-sm font-medium w-full">
            <Users className="w-4 h-4 text-ewan-gold ml-2 flex-shrink-0" />
            <span>تتسع لـ {capacity} ضيف</span>
          </div>
          <div className="flex items-center text-gray-700 text-sm font-medium w-full">
            <MapPin className="w-4 h-4 text-ewan-gold ml-2 flex-shrink-0" />
            <span>المكلا - {location}</span>
          </div>
          <div className="flex items-center text-gray-700 text-sm font-medium w-full">
            <BadgeDollarSign className="w-4 h-4 text-ewan-gold ml-2 flex-shrink-0" />
            <span>ابتداء من {price} ر.س</span>
          </div>
        </div>
        
        <Link href={`/halls/${id || 1}`} passHref className="mt-auto w-full max-w-[220px]">
          <button className="w-full border-2 border-ewan-gold text-ewan-gold hover:bg-ewan-gold hover:text-white transition-colors py-2 rounded-md font-bold text-sm">
            عرض التفاصيل
          </button>
        </Link>
      </div>
    </div>
  );
}

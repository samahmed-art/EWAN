"use client"; // أضف هذا السطر في أول الملف لأننا سنستخدم hooks
import React, { useEffect, useRef } from "react";

export default function Hero() {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Autoplay was prevented:", error);
      });
    }
  }, []);

  return (
    <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden bg-gray-900">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute z-0 w-full h-full object-cover"
      >
        <source src="/hero.mp4" type="video/mp4" />
        متصفحك لا يدعم تشغيل الفيديو.
      </video>
      
      {/* الطبقة السوداء الشفافة */}
{/* استبدل الـ Overlay القديم بهذا */}
<div className="absolute inset-0 bg-[#0A1128]/60 mix-blend-multiply z-10"></div>
<div className="absolute inset-0 bg-gradient-to-t from-[#1A365D] via-transparent to-transparent opacity-80 z-10"></div>    </div>
  );
}
"use client";
import React from "react";
import { Headset, Handshake, Building2 } from "lucide-react";

export default function AboutUs() {
  return (
    <section className="py-20 bg-[#fafaf8] relative overflow-hidden">
      <div className="container max-w-6xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-14">
        
        {/* Image Side */}
        <div className="w-full lg:w-1/2">
          <div className="relative border-4 border-white shadow-xl rounded-xl overflow-hidden">
<img src="/hall.jpg" alt="قاعة إيوان" className="w-full h-48 object-cover" />          </div>
        </div>
        
        {/* Text Side */}
        <div className="w-full lg:w-1/2 flex flex-col items-start pt-6">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-ewan-blue mb-6 leading-tight">
            إيوان.. حيث تبدأ أجمل حكاياتكم في المكلا
          </h2>
          <p className="text-gray-600 mb-12 leading-relaxed font-medium text-lg text-justify">
            تؤمن أن اللحظات السعيدة تستحق مكاناً يليق بها. انطلاقاً من قلب المكلا لتكون خياركم الأول نحو قاعات تجمع بين الفخامة والراحة. موفرين عليكم عناء البحث التقليدي لنضع أفضل خيارات المدينة بين أيديكم بضغطة زر.
          </p>
          
          {/* Stats Indicators */}
          <div className="flex flex-wrap justify-center sm:justify-start gap-8 w-full">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-white rounded-full border-2 border-ewan-gold flex items-center justify-center mb-4 shadow-sm">
                <Building2 className="w-8 h-8 text-ewan-gold" />
              </div>
              <span className="text-ewan-blue font-bold text-base leading-snug">أكثر من 50<br/>قاعة</span>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-white rounded-full border-2 border-ewan-gold flex items-center justify-center mb-4 shadow-sm">
                <Handshake className="w-8 h-8 text-ewan-gold" />
              </div>
              <span className="text-ewan-blue font-bold text-base leading-snug">حجز لـ 1000<br/>مناسبة</span>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-white rounded-full border-2 border-ewan-gold flex items-center justify-center mb-4 shadow-sm">
                <Headset className="w-8 h-8 text-ewan-gold" />
              </div>
              <span className="text-ewan-blue font-bold text-base leading-snug">خدمة عملاء<br/>24/7</span>
            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
}

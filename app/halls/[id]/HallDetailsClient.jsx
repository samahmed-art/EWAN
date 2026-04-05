"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowRight, 
  ChevronRight, 
  ChevronLeft, 
  Star, 
  Users, 
  MapPin, 
  Tag, 
  Camera, 
  Flower2, 
  Utensils, 
  UserCheck,
  X
} from "lucide-react";

export default function HallDetailsClient({ hall }) {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock highly stylized images array assuming Supabase might only have one
  const images = [
    hall?.image || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2998&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=2938&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2969&auto=format&fit=crop"
  ];

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="min-h-screen bg-white font-sans text-[#1D2D50]" dir="rtl">
      
      {/* 1. Header */}
      <header className="bg-[#e4d193] py-5 px-6 md:px-12 flex items-center justify-between shadow-sm sticky top-0 z-40">
        <button 
          onClick={() => router.back()} 
          className="w-10 h-10 bg-[#1D2D50] hover:bg-[#2b4170] rounded-full flex items-center justify-center text-white transition-colors cursor-pointer shadow-md"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
        <h1 className="text-3xl font-extrabold text-[#1D2D50] tracking-tight">{hall?.name || 'قاعة ميرال'}</h1>
        <div className="flex items-center">
          <img src="/logo.png" alt="إيوان" className="h-10 w-auto object-contain brightness-0" />
        </div>
      </header>

      {/* 2. Slider */}
      <section className="relative w-full max-w-5xl mx-auto mt-8 px-4">
        <div className="relative h-[45vh] md:h-[65vh] w-full rounded-2xl overflow-hidden shadow-2xl">
          <img 
            src={images[currentImageIndex]} 
            alt={hall?.name || 'Hall Detail'} 
            className="w-full h-full object-cover transition-all duration-700 ease-in-out"
          />
          {/* Controls */}
          <button 
            onClick={nextImage} 
            className="absolute top-1/2 right-4 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all shadow-lg"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
          <button 
            onClick={prevImage} 
            className="absolute top-1/2 left-4 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all shadow-lg"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
        </div>
      </section>

      {/* 3. Info Bar */}
      <section className="w-full max-w-5xl mx-auto mt-6 px-4">
        <div className="bg-[#e7d896] rounded-2xl px-8 py-5 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-md">
          
          {/* Right Info */}
          <div className="flex flex-col lg:flex-row items-center gap-8 w-full lg:w-auto">
            <div className="text-center lg:text-right border-b pb-4 lg:border-b-0 lg:border-l lg:pb-0 border-[#c2b26c] lg:pl-8">
              <h2 className="text-2xl font-extrabold mb-1">{hall?.name || 'قاعة ميرال'}</h2>
              <div className="flex items-center justify-center lg:justify-start gap-1">
                <span className="font-extrabold text-lg ml-1">4.9</span>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-[#bc9658] fill-[#bc9658]" />
                ))}
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 font-bold text-sm text-[#34405a]">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#bc9658]" />
                <span>تتسع لـ {hall?.capacity || '500'} ضيف</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#bc9658]" />
                <span>المكلا - {hall?.location || 'الشرج'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#bc9658]" />
                <span>ابتداء من {hall?.price || '10,000'} ر.س</span>
              </div>
            </div>
          </div>

          {/* Left Action */}
          <div className="w-full lg:w-auto mt-2 lg:mt-0">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full lg:w-auto bg-[#1D2D50] hover:bg-[#111A30] text-white px-10 py-3 rounded-xl font-bold shadow-xl transition-transform hover:scale-105 active:scale-95 whitespace-nowrap text-lg"
            >
              حجز القاعة
            </button>
          </div>
        </div>
      </section>

      {/* 4. About */}
      <section className="w-full max-w-5xl mx-auto mt-14 px-4">
        <h3 className="text-2xl font-extrabold mb-6 border-r-4 border-[#C8A97E] pr-3 text-[#1D2D50]">لمحة عن القاعة</h3>
        <p className="text-[#1D2D50] leading-relaxed font-bold text-lg text-justify p-4">
          تعد {hall?.name || 'قاعة ميرال'} الوجهة الأمثل للاحتفالات التي تجمع بين عراقة الضيافة الحضرمية وفخامة التصميم العصري.
          تتميز القاعة بمساحاتها الواسعة، وإضاءتها الكريستالية، وتجهيزاتها التقنية المتقدمة التي تضمن خروج مناسبتكم بأبهى صورة
          ممكنة، وسط أجواء من الراحة والخصوصية التامة.
        </p>
      </section>

      {/* 5. Services */}
      <section className="w-full max-w-5xl mx-auto mt-12 mb-20 px-4">
        <h3 className="text-2xl font-extrabold mb-8 border-r-4 border-[#C8A97E] pr-3 text-[#1D2D50]">خدماتنا</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-[#fafaf9] rounded-3xl p-8 flex flex-col items-center text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-20 h-20 mb-6 flex items-center justify-center text-[#bc9658]">
              <UserCheck className="w-16 h-16 stroke-[1.5]" />
            </div>
            <h4 className="font-extrabold text-[#1D2D50] text-xl mb-3">الاستقبال</h4>
            <p className="text-[15px] font-bold text-[#445275] leading-snug">تنظيم دخول وخدمة ركن السيارات</p>
          </div>

          <div className="bg-[#fafaf9] rounded-3xl p-8 flex flex-col items-center text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-20 h-20 mb-6 flex items-center justify-center text-[#bc9658]">
              <Camera className="w-16 h-16 stroke-[1.5]" />
            </div>
            <h4 className="font-extrabold text-[#1D2D50] text-xl mb-3">التصوير</h4>
            <p className="text-[15px] font-bold text-[#445275] leading-snug">توثيق احترافي لأجمل اللحظات</p>
          </div>

          <div className="bg-[#fafaf9] rounded-3xl p-8 flex flex-col items-center text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-20 h-20 mb-6 flex items-center justify-center text-[#bc9658]">
              <Flower2 className="w-16 h-16 stroke-[1.5]" />
            </div>
            <h4 className="font-extrabold text-[#1D2D50] text-xl mb-3">التجهيزات</h4>
            <p className="text-[15px] font-bold text-[#445275] leading-snug">كوش حديثة وتنسيق زهور</p>
          </div>

          <div className="bg-[#fafaf9] rounded-3xl p-8 flex flex-col items-center text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-20 h-20 mb-6 flex items-center justify-center text-[#bc9658]">
              <Utensils className="w-16 h-16 stroke-[1.5]" />
            </div>
            <h4 className="font-extrabold text-[#1D2D50] text-xl mb-3">الضيافة</h4>
            <p className="text-[15px] font-bold text-[#445275] leading-snug">بوفيه ملكي بأشهى المأكولات</p>
          </div>

        </div>
      </section>

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-[#1D2D50]/60 backdrop-blur-md">
          <div className="bg-white rounded-[2rem] w-full max-w-lg p-10 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 left-6 text-gray-400 hover:text-red-500 transition-colors bg-gray-100 rounded-full p-2"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-3xl font-extrabold text-[#1D2D50] mb-8 text-center border-b border-gray-100 pb-5">طلب حجز {hall?.name || 'قاعة ميرال'}</h2>
            
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("سيتم تفعيل ميزة الحجز لاحقاً!"); setIsModalOpen(false); }}>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">تاريخ المناسبة</label>
                <input type="date" className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C8A97E] text-left font-bold text-gray-700" dir="ltr" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">عدد الضيوف المتوقع</label>
                <input type="number" placeholder="500" className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C8A97E] text-left font-bold text-gray-700" dir="ltr" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">ملاحظات إضافية</label>
                <textarea rows="3" placeholder="أي متطلبات خاصة..." className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C8A97E] resize-none font-medium text-gray-700"></textarea>
              </div>
              <button type="submit" className="w-full bg-[#1D2D50] hover:bg-[#111A30] text-white font-bold py-5 rounded-xl shadow-[0_10px_20px_rgba(29,45,80,0.3)] hover:shadow-none hover:scale-[0.98] transition-all text-xl mt-6">
                تأكيد طلب الحجز
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  isSameDay, 
  startOfWeek, 
  endOfWeek, 
  isBefore, 
  startOfDay 
} from 'date-fns';
import { ar } from 'date-fns/locale';
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
  X,
  ClipboardList
} from "lucide-react";

export default function HallDetailsClient({ hall }) {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Booking Modal States
  const [bookingStep, setBookingStep] = useState(0); 
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [existingBookings, setExistingBookings] = useState([]);
  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));

  // Mock highly stylized images array
  const images = [
    hall?.image || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2998&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=2938&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2969&auto=format&fit=crop"
  ];

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  // Fetch Bookings specifically when modal step 1 mounts
  useEffect(() => {
    if (bookingStep === 1 && hall?.id) {
      const fetchBookings = async () => {
        setIsChecking(true);
        const { data, error } = await supabase
          .from('bookings')
          .select('booking_date, time_slot')
          .eq('hall_id', hall.id);
          
        if (!error && data) {
           setExistingBookings(data);
        }
        setIsChecking(false);
      };
      fetchBookings();
    }
  }, [bookingStep, hall?.id]);

  // Pricing Logic
  const basePrice = parseInt(String(hall?.price || "10000").replace(/[^0-9]/g, '')) || 10000;
  const totalPrice = basePrice + (selectedServices.length * 500);

  // Confirmation Flow
  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      alert("يرجى تسجيل الدخول أولاً لإتمام الحجز");
      setIsSubmitting(false);
      return;
    }

    const dateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;

    const { error } = await supabase.from('bookings').insert([
      {
        hall_id: Number(hall.id),
        user_id: user.id,
        booking_date: dateStr, 
        time_slot: selectedSlot,
        services: selectedServices,
        total_price: Number(totalPrice),
        status: 'pending'
      }
    ]);

    setIsSubmitting(false);

    if (error) {
      console.error("Insert Error:", error);
      alert("حدث خطأ أثناء الحجز: " + error.message);
    } else {
      setBookingStep(3);
    }
  };

  // Calendar Helpers
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 6 }); // Starts Saturday
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 6 });
    
    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";
  
    while (day <= endDate) {
       for (let i = 0; i < 7; i++) {
          formattedDate = format(day, dateFormat);
          const cloneDay = day;
          
          const dateStr = format(cloneDay, 'yyyy-MM-dd');
          const dayBookings = existingBookings.filter(b => b.booking_date === dateStr);
          const hasMorning = dayBookings.some(b => b.time_slot === "صباحاً");
          const hasEvening = dayBookings.some(b => b.time_slot === "مساءً");
          const isFullyBooked = hasMorning && hasEvening;
          
          const isPast = isBefore(cloneDay, startOfDay(new Date()));
          const isDisabled = isPast || isFullyBooked;
          const isSelected = selectedDate && isSameDay(cloneDay, selectedDate);
          const isCurrentMonth = cloneDay.getMonth() === currentMonth.getMonth();
          
          days.push(
            <div 
               key={day.toString()}
               onClick={() => { if (!isDisabled) setSelectedDate(cloneDay); }}
               className={`p-2 flex items-center justify-center text-sm font-bold w-10 h-10 rounded-full mx-auto transition-all
                 ${!isCurrentMonth ? 'text-gray-300' : isDisabled ? 'text-gray-300 opacity-50 cursor-not-allowed' : 'text-[#1D2D50] cursor-pointer hover:bg-gray-200'}
                 ${isSelected ? 'ring-2 ring-offset-2 ring-[#C8A97E] !text-[#1D2D50] bg-white shadow-sm' : ''}
               `}
            >
               {formattedDate}
            </div>
          );
          day = new Date(day.setDate(day.getDate() + 1));
       }
       rows.push(
         <div className="grid grid-cols-7 gap-1 w-full text-center border-b border-gray-200/40 py-2" key={day.toString()}>
           {days}
         </div>
       );
       days = [];
    }
    
    return <div className="w-full text-center">{rows}</div>;
  };

  const dayNames = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

  const toggleService = (serviceName) => {
    setSelectedServices(prev => 
      prev.includes(serviceName) 
        ? prev.filter(s => s !== serviceName) 
        : [...prev, serviceName]
    );
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] font-sans text-[#1D2D50]" dir="rtl">
      
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

      {/* 2. Slider - Slightly compressed for breathing room */}
      <section className="relative w-full max-w-5xl mx-auto mt-8 px-4">
        <div className="relative h-[45vh] md:h-[65vh] w-full rounded-2xl overflow-hidden shadow-2xl">
          <img 
            src={images[currentImageIndex]} 
            alt={hall?.name || 'Hall Detail'} 
            className="w-full h-full object-cover transition-all duration-700 ease-in-out"
          />
          <button onClick={nextImage} className="absolute top-1/2 right-4 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all shadow-lg">
            <ChevronRight className="w-8 h-8" />
          </button>
          <button onClick={prevImage} className="absolute top-1/2 left-4 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all shadow-lg">
            <ChevronLeft className="w-8 h-8" />
          </button>
        </div>
      </section>

      {/* 3. Info Bar */}
      <section className="w-full max-w-5xl mx-auto mt-6 px-4">
        <div className="bg-[#e7d896] rounded-2xl px-8 py-5 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-md border-b-4 border-[#cda763]">
          <div className="flex flex-col lg:flex-row items-center gap-8 w-full lg:w-auto">
            <div className="text-center lg:text-right border-b pb-4 lg:border-b-0 lg:border-l lg:pb-0 border-[#c2b26c] lg:pl-8">
              <h2 className="text-2xl font-extrabold mb-1">{hall?.name || 'قاعة ميرال'}</h2>
              <div className="flex items-center justify-center lg:justify-start gap-1">
                <span className="font-extrabold text-lg ml-1">4.9</span>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-[#C8A97E] fill-[#C8A97E]" />
                ))}
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 font-bold text-sm text-[#34405a]">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#C8A97E]" />
                <span>تتسع لـ {hall?.capacity || '500'} ضيف</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#C8A97E]" />
                <span>المكلا - {hall?.location || 'الشرج'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#C8A97E]" />
                <span>ابتداء من {hall?.price || '10,000'} ر.س</span>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-auto mt-2 lg:mt-0">
            <button 
              onClick={() => setBookingStep(1)}
              className="w-full lg:w-auto bg-[#1D2D50] hover:bg-[#111A30] text-white px-10 py-3 rounded-xl font-bold shadow-xl transition-transform hover:scale-105 active:scale-95 whitespace-nowrap text-lg ring-offset-[#e7d896] focus:ring-4 focus:ring-[#1D2D50]"
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
          <div className="bg-white rounded-3xl p-8 flex flex-col items-center text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 hover:shadow-lg transition-transform duration-300">
            <div className="w-20 h-20 mb-6 flex items-center justify-center text-[#C8A97E] bg-[#C8A97E]/10 rounded-full">
              <UserCheck className="w-10 h-10 stroke-[2]" />
            </div>
            <h4 className="font-extrabold text-[#1D2D50] text-xl mb-3">الاستقبال</h4>
            <p className="text-[15px] font-bold text-[#445275] leading-snug">تنظيم دخول وخدمة ركن السيارات</p>
          </div>
          <div className="bg-white rounded-3xl p-8 flex flex-col items-center text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 hover:shadow-lg transition-transform duration-300">
            <div className="w-20 h-20 mb-6 flex items-center justify-center text-[#C8A97E] bg-[#C8A97E]/10 rounded-full">
              <Camera className="w-10 h-10 stroke-[2]" />
            </div>
            <h4 className="font-extrabold text-[#1D2D50] text-xl mb-3">التصوير</h4>
            <p className="text-[15px] font-bold text-[#445275] leading-snug">توثيق احترافي لأجمل اللحظات</p>
          </div>
          <div className="bg-white rounded-3xl p-8 flex flex-col items-center text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 hover:shadow-lg transition-transform duration-300">
            <div className="w-20 h-20 mb-6 flex items-center justify-center text-[#C8A97E] bg-[#C8A97E]/10 rounded-full">
              <Flower2 className="w-10 h-10 stroke-[2]" />
            </div>
            <h4 className="font-extrabold text-[#1D2D50] text-xl mb-3">التجهيزات</h4>
            <p className="text-[15px] font-bold text-[#445275] leading-snug">كوش حديثة وتنسيق زهور</p>
          </div>
          <div className="bg-white rounded-3xl p-8 flex flex-col items-center text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 hover:shadow-lg transition-transform duration-300">
            <div className="w-20 h-20 mb-6 flex items-center justify-center text-[#C8A97E] bg-[#C8A97E]/10 rounded-full">
              <Utensils className="w-10 h-10 stroke-[2]" />
            </div>
            <h4 className="font-extrabold text-[#1D2D50] text-xl mb-3">الضيافة</h4>
            <p className="text-[15px] font-bold text-[#445275] leading-snug">بوفيه ملكي بأشهى المأكولات</p>
          </div>
        </div>
      </section>

      {/* Booking Modals Overview */}
      {bookingStep > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-[#1D2D50]/60 backdrop-blur-sm transition-opacity">
          
          {/* STEP 1: CALENDAR POP-UP */}
          {bookingStep === 1 && (
            <div className="bg-[#dcdcd8] rounded-xl w-full max-w-[26rem] p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
              <button onClick={() => setBookingStep(0)} className="absolute top-4 right-4 text-[#C8A97E] hover:text-[#a18764] transition-colors">
                <X className="w-8 h-8 stroke-[3]" />
              </button>
              
              <div className="flex items-center justify-between mb-8 mt-4 px-4">
                <button onClick={nextMonth}><ChevronRight className="w-7 h-7 text-[#C8A97E] stroke-[3]"/></button>
                <h2 className="text-2xl font-extrabold text-[#1D2D50]">{format(currentMonth, 'MMMM', { locale: ar })}</h2>
                <button onClick={prevMonth}><ChevronLeft className="w-7 h-7 text-[#C8A97E] stroke-[3]" /></button>
              </div>

              <div className="grid grid-cols-7 gap-1 w-full text-center text-[#1D2D50] font-extrabold text-sm mb-3 border-b border-[#1D2D50]/10 pb-2">
                {dayNames.map(d => (
                  <div key={d} className="flex items-center justify-center">{d}</div>
                ))}
              </div>

              {isChecking ? (
                <div className="py-20 text-center font-bold text-gray-500">جاري فحص المواعيد...</div>
              ) : (
                renderCalendar()
              )}

              <button 
                disabled={!selectedDate}
                onClick={() => setBookingStep(2)} 
                className="w-full bg-[#1D2D50] hover:bg-[#111A30] text-white font-extrabold py-3.5 rounded-lg shadow-lg hover:shadow-none hover:scale-[0.99] transition-all text-lg mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                تأكيد اليوم
              </button>
            </div>
          )}

          {/* STEP 2: SLOTS & SERVICES POP-UP */}
          {bookingStep === 2 && (() => {
            const dateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
            const dayBookings = existingBookings.filter(b => b.booking_date === dateStr);
            const morningBooked = dayBookings.some(b => b.time_slot === "صباحاً");
            const eveningBooked = dayBookings.some(b => b.time_slot === "مساءً");

            return (
              <div className="bg-[#dcdcd8] rounded-xl w-full max-w-[32rem] p-8 shadow-2xl relative animate-in slide-in-from-right-4 duration-300">
                <div className="flex justify-between items-center mb-6">
                  <div className="w-10 h-10 border-2 border-[#C8A97E] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#C8A97E]/20" onClick={() => setBookingStep(1)}>
                    <ArrowRight className="w-5 h-5 text-[#C8A97E] stroke-[3]" />
                  </div>
                  <h2 className="text-[1.35rem] font-extrabold text-[#1D2D50] flex items-center justify-center flex-grow text-center tracking-wide">
                    {format(selectedDate, 'EEEE, d MMMM yyyy', { locale: ar })}
                  </h2>
                  <ClipboardList className="w-8 h-8 text-[#C8A97E]" />
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-extrabold text-[#1D2D50] text-center mb-5">الساعات المتاحة</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      disabled={morningBooked}
                      onClick={() => setSelectedSlot("صباحاً")}
                      className={`py-4 px-6 border border-[#C8A97E]/50 rounded-xl font-extrabold flex flex-col items-center justify-center transition-all ${
                        morningBooked ? 'opacity-40 cursor-not-allowed bg-gray-100' :
                        selectedSlot === "صباحاً" ? 'bg-[#ffedc0] border-[#C8A97E] shadow-sm scale-[1.02]' : 'bg-[#efefeb] hover:bg-[#e4e4df]'
                      }`}
                    >
                      <span className="text-[#C8A97E] text-lg">صباحاً</span>
                      <span className="text-[#C8A97E] text-sm">من 9 الى 3</span>
                    </button>
                    <button 
                      disabled={eveningBooked}
                      onClick={() => setSelectedSlot("مساءً")}
                      className={`py-4 px-6 border border-[#C8A97E]/50 rounded-xl font-extrabold flex flex-col items-center justify-center transition-all ${
                        eveningBooked ? 'opacity-40 cursor-not-allowed bg-gray-100' :
                        selectedSlot === "مساءً" ? 'bg-[#ffedc0] border-[#C8A97E] shadow-sm scale-[1.02]' : 'bg-[#efefeb] hover:bg-[#e4e4df]'
                      }`}
                    >
                      <span className="text-[#C8A97E] text-lg">مساءً</span>
                      <span className="text-[#C8A97E] text-sm">من 6 الى 12</span>
                    </button>
                  </div>
                </div>

                <div className="mb-8 pl-1 pr-1">
                  <h3 className="text-xl font-extrabold text-[#1D2D50] text-center mb-5">الخدمات</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {['الاستقبال', 'التصوير', 'التجهيزات', 'الضيافة'].map(service => (
                       <label key={service} className="flex items-center justify-between bg-[#efefeb] rounded-lg px-3 py-2 border border-gray-200 cursor-pointer hover:bg-[#e4e4df] transition-colors">
                         <span className="text-sm font-extrabold text-[#1D2D50]">{service}</span>
                         <div className="relative">
                           <input type="checkbox" className="sr-only peer" checked={selectedServices.includes(service)} onChange={() => toggleService(service)} />
                           <div className="w-9 h-5 bg-white border border-gray-300 rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-[#C8A97E] peer-checked:after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#C8A97E]"></div>
                         </div>
                       </label>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-end border-t border-gray-300/50 pt-5 mt-2">
                  <span className="text-[#C8A97E] font-extrabold text-xl mb-1">سعر الحجز بالكامل</span>
                  <span className="text-[#C8A97E] font-extrabold text-3xl mb-6">{totalPrice.toLocaleString()} ر.س</span>
                  <button 
                    disabled={isSubmitting || !selectedSlot}
                    onClick={handleConfirmBooking}
                    className="w-full bg-[#cdb340] hover:bg-[#b09832] text-white font-extrabold py-4 rounded-xl shadow-[0_10px_20px_rgba(200,169,126,0.3)] hover:shadow-none hover:scale-[0.99] transition-all text-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'جاري التأكيد...' : 'تأكيد الحجز'}
                  </button>
                </div>
              </div>
            );
          })()}

          {/* STEP 3: SUCCESS STATE */}
          {bookingStep === 3 && (
            <div className="bg-[#dcdcd8] rounded-xl w-full max-w-[28rem] px-8 py-14 shadow-2xl relative animate-in fade-in zoom-in duration-300 flex flex-col items-center">
              <button onClick={() => setBookingStep(0)} className="absolute top-4 right-4 text-[#C8A97E]">
                <X className="w-8 h-8 stroke-[3]" />
              </button>
              <div className="w-20 h-20 bg-[#C8A97E] rounded-full flex items-center justify-center mb-6 shadow-lg shadow-[#C8A97E]/30 text-white">
                <ArrowRight className="w-10 h-10 rotate-180 stroke-[3]" /> {/* Checkmark replacement rotated */}
              </div>
              <h2 className="text-2xl font-extrabold text-[#1D2D50] mb-4 text-center">تم حجز الموعد المبدئي!</h2>
              <p className="text-[#1D2D50] text-center font-bold text-lg leading-relaxed px-4">
                تم إرسال رابط تأكيد إلى بريدك الإلكتروني. يرجى تفعيل الحجز خلال 24 ساعة.
              </p>
              <button 
                onClick={() => setBookingStep(0)}
                className="mt-8 bg-[#1D2D50] hover:bg-[#111A30] text-[#C8A97E] px-10 py-3 rounded-lg font-bold shadow-md transition-transform hover:scale-105 active:scale-95"
              >
                العودة للصفحة
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
}

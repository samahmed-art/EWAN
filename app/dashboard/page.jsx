"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, Calendar, Clock, CheckCircle, XCircle } from "lucide-react";

const BookingCard = ({ booking, onCancel, onEdit, profile }) => {
  const [timeLeft, setTimeLeft] = useState(""); 
  const [canAction, setCanAction] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  // State for Edit Module
  const [editDate, setEditDate] = useState(booking.booking_date || booking.date || "");
  const [editSlot, setEditSlot] = useState(booking.time_slot || booking.slot || "");
  const [isSaving, setIsSaving] = useState(false);

  // Status mapping
  const status = booking.status || 'pending';
  const isPending = status === 'pending';
  const isConfirmed = status === 'confirmed';
  const isCancelled = status === 'cancelled';

  useEffect(() => {
    if (!isPending) {
       setCanAction(false);
       if (isConfirmed) setTimeLeft("تم التأكيد 🎉");
       if (isCancelled) setTimeLeft("ملغي ❌");
       return;
    }

    const interval = setInterval(() => {
      const startTime = new Date(booking.created_at).getTime();
      const endTime = startTime + 60 * 60 * 1000; // 1 hour window constraint
      const now = new Date().getTime();
      const distance = endTime - now;

      if (distance <= 0) {
        clearInterval(interval);
        setTimeLeft("انتهت مهلة التعديل/الإلغاء");
        setCanAction(false);
      } else {
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`متبقي ${minutes} د ${seconds} ث`);
        setCanAction(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [booking.created_at, status]);

  const handleSaveEdit = async () => {
     setIsSaving(true);
     const { data: updateData, error } = await supabase.from('bookings').update({ 
       booking_date: editDate, 
       time_slot: editSlot 
     }).eq('id', booking.id).select();
     
     setIsSaving(false);

     if (error || !updateData || updateData.length === 0) {
       console.error("Database Update Error:", error || "No rows returned (RLS Issue)");
       alert("فشل الحفظ في قاعدة البيانات. هذه غالباً مشكلة في صلاحيات Supabase (RLS). تأكد أن لديك سياسة UPDATE للجدول.");
     } else {
        alert("Booking updated successfully");
        setIsEditing(false);
        if (onEdit) onEdit(booking.id, { booking_date: editDate, time_slot: editSlot });
     }
  };

  // Graceful handling of nested relationships if join succeeded vs failed
  const hallName = booking.halls?.name || booking.hall_name || `قاعة #${booking.hall_id}`;

  return (
    <div className="w-full bg-[#f4f4f5] rounded-[2rem] p-6 flex flex-col md:flex-row items-center justify-between shadow-xl mb-7 border-l-[10px] border-[#C8A97E] transition-all hover:shadow-2xl relative overflow-hidden">
      
      {/* Decorative background glow */}
      <div className="absolute -left-10 -top-10 w-32 h-32 bg-[#C8A97E]/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-14 w-full z-10">
        
        {/* Hall Detail Section */}
        <div className="flex flex-col items-center md:items-start text-center md:text-right w-full md:w-auto">
          <span className="text-[#4A628A] font-extrabold mb-1 flex items-center gap-2"><AlertCircle className="w-4 h-4 text-[#C8A97E]"/> اسم القاعة</span>
          <h2 className="text-[#1A365D] text-2xl md:text-3xl font-black truncate max-w-[200px] mb-2">{hallName}</h2>
          
          {/* Dynamic Status Badges */}
          {isPending && <span className="text-amber-800 text-xs font-bold bg-amber-100/80 px-3 py-1.5 rounded-full ring-1 ring-amber-400">⚠️ يرجى التأكيد عبر البريد خلال 1 ساعة</span>}
          {isConfirmed && <span className="text-green-800 text-xs font-bold bg-green-100/80 px-3 py-1.5 rounded-full flex items-center gap-1.5 w-fit ring-1 ring-green-400"><CheckCircle className="w-4 h-4"/> تم التأكيد</span>}
          {isCancelled && <span className="text-red-800 text-xs font-bold bg-red-100/80 px-3 py-1.5 rounded-full flex items-center gap-1.5 w-fit ring-1 ring-red-400"><XCircle className="w-4 h-4"/> ملغي تماماً</span>}
        </div>
        
        {/* Date Detail */}
        <div className="flex flex-col items-center md:items-start border-t md:border-t-0 md:border-r-2 border-gray-300 pt-6 md:pt-0 md:pr-10 w-full md:w-auto">
          <span className="text-[#4A628A] font-extrabold mb-1 flex items-center gap-2"><Calendar className="w-4 h-4 text-[#C8A97E]"/> تاريخ المناسبة</span>
          {isEditing ? (
             <input type="date" value={editDate} onChange={e => setEditDate(e.target.value)} className="rounded-xl border-2 border-[#C8A97E] px-3 py-2 text-[#1A365D] font-bold focus:outline-none focus:ring-2 focus:ring-[#C8A97E]/50" dir="ltr" />
          ) : (
             <p className="text-[#1A365D] font-extrabold text-xl mt-1 tracking-wide">{booking.booking_date || booking.date || "غير محدد"}</p>
          )}
        </div>

        {/* Slot Detail */}
        <div className="flex flex-col items-center md:items-start border-t md:border-t-0 md:border-r-2 border-gray-300 pt-6 md:pt-0 md:pr-10 w-full md:w-auto">
          <span className="text-[#4A628A] font-extrabold mb-1 flex items-center gap-2"><Clock className="w-4 h-4 text-[#C8A97E]"/> الفترة المحجوزة</span>
          {isEditing ? (
             <select value={editSlot} onChange={e => setEditSlot(e.target.value)} className="rounded-xl border-2 border-[#C8A97E] px-4 py-2 text-[#1A365D] font-bold focus:outline-none focus:ring-2 focus:ring-[#C8A97E]/50">
               <option value="صباحاً">صباحاً</option>
               <option value="مساءً">مساءً</option>
             </select>
          ) : (
             <p className="text-[#1A365D] font-extrabold text-xl mt-1">{booking.time_slot || booking.slot || "غير محدد"}</p>
          )}
        </div>

        {/* Dynamic Timer Component */}
        {isPending && canAction && (
          <div className="flex flex-col items-center w-full md:w-auto mr-auto md:pl-2">
             <div className="bg-[#1A365D] text-[#C8A97E] px-6 py-2.5 rounded-full font-black shadow-lg animate-pulse text-sm border border-[#C8A97E]/30 tracking-wider">
                {timeLeft}
             </div>
          </div>
        )}
      </div>
      
      {/* Action Controller Block */}
      <div className="flex flex-row md:flex-col gap-3 mt-8 md:mt-0 w-full md:w-auto justify-center md:items-stretch z-10 border-t md:border-t-0 border-gray-300 pt-6 md:pt-0 md:border-r-2 md:pr-10">
        {isEditing ? (
           <>
              <button disabled={isSaving} onClick={handleSaveEdit} className="px-6 py-2.5 rounded-xl font-bold bg-green-600 text-white hover:bg-green-700 shadow-md transition-all whitespace-nowrap active:scale-95">
                {isSaving ? "جاري الحفظ..." : "حفظ التعديل"}
              </button>
              <button onClick={() => setIsEditing(false)} className="px-6 py-2.5 rounded-xl font-bold bg-gray-500 text-white hover:bg-gray-600 shadow-md transition-all active:scale-95">
                تراجع
              </button>
           </>
        ) : (
           <>
              <button 
                disabled={!canAction || profile?.is_banned} 
                onClick={() => setIsEditing(true)}
                className={`px-10 py-2.5 rounded-xl font-black whitespace-nowrap transition-all shadow-md active:scale-95 ${canAction && !profile?.is_banned ? 'bg-[#C8A97E] text-[#1A365D] hover:bg-[#b0936b] hover:text-white hover:-translate-y-1' : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'}`}>
                تعديل الموعد
              </button>
              <button 
                disabled={!canAction || profile?.is_banned} 
                onClick={() => onCancel(booking)}
                className={`px-10 py-2.5 rounded-xl font-black whitespace-nowrap transition-all shadow-md active:scale-95 ${canAction && !profile?.is_banned ? 'bg-[#1A365D] text-white hover:bg-red-600 hover:-translate-y-1' : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'}`}>
                إلغاء الحجز
              </button>
           </>
        )}
      </div>

    </div>
  );
};


export default function UserDashboard() {
  const [bookings, setBookings] = useState([]);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getUserDataAndBookings();
  }, []);

  const getUserDataAndBookings = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      // Fetch Profile locally to evaluate banning constraints efficiently
      const { data: profData } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (profData) setProfile(profData);
      else setProfile({ is_banned: false, cancel_count: 0 });

      // Fetch Multiple Bookings array resolving foreign relationships dynamically
      const { data: bookData, error: bookError } = await supabase
        .from("bookings")
        .select(`*, halls (name)`)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (bookError) {
         console.error("خطأ في جلب الحجوزات:", bookError.message);
         return;
      }

      setBookings(bookData || []);

    } catch (err) {
      console.error("حدث خطأ غير متوقع:", err);
    } finally {
      setIsLoading(false);
    }
  };
  const handleCancelBooking = async (targetBooking) => {
    if (!window.confirm("هل أنت متأكد من إلغاء الحجز؟ سيؤدي ذلك لزيادة عداد الإلغاء لديك وتطبيق قيود الحظر تدريجياً.")) return;
    
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Optimistic UI Updates
    setBookings(prev => prev.filter(b => b.id !== targetBooking.id));
    
    const newCount = (profile?.cancel_count || 0) + 1;
    const isBanned = newCount >= 5;
    
    setProfile(prev => ({ ...prev, cancel_count: newCount, is_banned: isBanned }));

    // 2. Database Updates asynchronously
    const { data: updateData, error: updateError } = await supabase.from("bookings").update({ status: "cancelled" }).eq("id", targetBooking.id).select();
    
    if (updateError || !updateData || updateData.length === 0) {
      console.error("Database Update Error:", updateError || "No rows returned (RLS Issue)");
      alert("⚠️ فشل الإلغاء في قاعدة البيانات بسبب صلاحيات (RLS). يرجى تفعيل سياسة UPDATE للجدول في Supabase.");
      return; 
    }

    const { error: profileError } = await supabase.from("profiles").upsert({ 
      id: user.id,
      cancel_count: newCount,
      is_banned: isBanned 
    });

    if (isBanned) {
      alert("⚠️ تم بنجاح إلغاء الحجز، مع الأسف تم حظرك تلقائياً من المنصة لتكرار الإلغاء (5 مرات). يرجى التواصل مع الدعم.");
    } else {
      alert(`✅ تم إلغاء حجزك بنجاح. عداد الإلغاء لديك إرتفع وأصبح الآن: ${newCount}/5`);
    }
  };

  const handleEditBooking = (bookingId, updatedFields) => {
     setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, ...updatedFields } : b));
  };

  // Loading Screen Wrapper
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#4A628A] flex flex-col items-center justify-center text-white" dir="rtl">
        <div className="w-16 h-16 border-4 border-[#C8A97E] border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-2xl font-black tracking-wider animate-pulse">جاري تحميل لوحة التحكم...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#4A628A] flex flex-col items-center pt-8 pb-32 px-4 md:px-8 text-right relative overflow-x-hidden font-sans" dir="rtl">
      
      {/* Decorative Geometry Background */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none opacity-5">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full border-[60px] border-[#C8A97E]"></div>
        <div className="absolute top-1/2 -left-20 w-[400px] h-[400px] rounded-full border-[40px] border-[#C8A97E]"></div>
      </div>

      {/* Global Navigation - Return Control */}
      <button onClick={() => router.push("/")} className="absolute top-6 left-6 md:top-10 md:left-10 bg-[#C8A97E] w-14 h-14 flex items-center justify-center rounded-full text-[#1A365D] shadow-2xl hover:scale-110 active:scale-95 transition-transform z-50">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Strict Banning Alert Boundary (Safety Requirements) */}
      {profile?.is_banned && (
        <div className="w-full max-w-5xl bg-red-600/95 text-white p-6 rounded-2xl shadow-[0_10px_30px_rgba(220,38,38,0.4)] border-2 border-red-400 font-bold mb-10 flex flex-col md:flex-row items-center gap-5 justify-center z-20">
           <AlertCircle className="w-10 h-10 shrink-0"/> 
           <span className="text-xl md:text-2xl text-center md:text-right">⚠️ تم تقييد حسابك ومصادرة صلاحياتك لتجاوزك الحد الأقصى من الإلغاءات. يرجى التواصل مع خدمة العملاء لرفع الحظر.</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="w-full max-w-5xl mb-12 mt-6 flex flex-col md:flex-row justify-between items-center md:items-end border-b-2 border-[#C8A97E]/30 pb-6 z-20 gap-6">
         <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-md">إدارة حجوزاتك</h1>
         
         <div className="bg-[#1A365D] border-2 border-[#C8A97E] text-white px-6 py-2.5 rounded-2xl font-bold shadow-lg flex items-center gap-3">
            <XCircle className="w-5 h-5 text-[#C8A97E]" />
            <span>عداد الإلغاءات الآمنة:</span>
            <span className={`text-2xl font-black px-2 py-0.5 rounded-lg ${profile?.cancel_count >= 4 ? 'bg-red-500' : 'bg-transparent text-[#C8A97E]'}`}>
              {profile?.cancel_count || 0}/5
            </span>
         </div>
      </div>

      {/* Empty State vs Mapped Dashboard Logic View */}
      {bookings.length === 0 ? (
        <div className="w-full max-w-4xl bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center mt-4 shadow-2xl border border-white/10 relative overflow-hidden z-20">
           <div className="w-32 h-32 bg-[#C8A97E]/20 rounded-full flex items-center justify-center mb-8 shadow-inner">
              <Calendar className="w-16 h-16 text-[#C8A97E]" />
           </div>
           
           <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6 tracking-wide">لا توجد حجوزات حالية</h2>
           <p className="text-gray-300 text-lg md:text-xl font-semibold mb-12 max-w-lg leading-relaxed">
             لم تقم بحجز أي قاعات حتى الآن. ابدأ بتصفح قاعاتنا واحجز مناسبتك القادمة بكل سهولة واحترافية!
           </p>
           
           <Link href="/halls" className={profile?.is_banned ? 'pointer-events-none' : ''}>
             <button disabled={profile?.is_banned} className="group relative bg-[#D9A13B] text-[#1A365D] text-2xl font-black px-12 py-5 rounded-3xl shadow-[0_12px_20px_rgba(0,0,0,0.3),_0_12px_0_#b07d2e] hover:translate-y-2 hover:shadow-[0_4px_10px_rgba(0,0,0,0.2),_0_6px_0_#b07d2e] active:translate-y-4 active:shadow-none transition-all disabled:opacity-50 disabled:translate-y-0 disabled:shadow-[0_12px_0_#b07d2e] disabled:cursor-not-allowed">
                احجز قاعتك الأولى الآن
                <span className="absolute -inset-1 rounded-3xl opacity-0 bg-white blur-lg group-hover:opacity-20 transition-opacity"></span>
             </button>
           </Link>
        </div>
      ) : (
        <div className="w-full max-w-5xl z-20 flex flex-col gap-2">
           {bookings.map(booking => (
             <BookingCard 
               key={booking.id} 
               booking={booking} 
               onCancel={handleCancelBooking} 
               onEdit={handleEditBooking} 
               profile={profile} 
             />
           ))}

           {/* Grand Add New Booking Bottom Button Array */}
           <div className="flex justify-center mt-12 py-8 relative">
             <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#C8A97E]/50 to-transparent -translate-y-1/2"></div>
             <Link href="/halls" className={profile?.is_banned ? 'pointer-events-none' : ''}>
               <button disabled={profile?.is_banned} className="relative z-10 bg-[#D9A13B] text-[#1A365D] text-2xl md:text-3xl font-black px-12 md:px-16 py-5 md:py-6 rounded-3xl shadow-[0_14px_25px_rgba(0,0,0,0.4),_0_12px_0_#b07d2e] hover:translate-y-2 hover:shadow-[0_4px_10px_rgba(0,0,0,0.2),_0_6px_0_#b07d2e] active:translate-y-4 active:shadow-none transition-all duration-200 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-[0_12px_0_#b07d2e] disabled:cursor-not-allowed flex items-center gap-3">
                 <span className="text-4xl md:text-5xl font-black leading-none drop-shadow-md">+</span> إضافة حجز جديد
               </button>
             </Link>
           </div>
        </div>
      )}

    </div>
  );
}
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UserDashboard() {
  const [booking, setBooking] = useState(null);
  const [timeLeft, setTimeLeft] = useState(""); 
  const [canAction, setCanAction] = useState(true); // للتحكم في أزرار التعديل والإلغاء
  const router = useRouter();

  useEffect(() => {
    getLatestBooking();
  }, []);

  const getLatestBooking = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.push("/login");

    // جلب آخر حجز للمستخدم
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (data) {
      setBooking(data);
      startTimer(data.created_at);
    }
  };

  const startTimer = (createdAt) => {
    const interval = setInterval(() => {
      const startTime = new Date(createdAt).getTime();
      const endTime = startTime + 60 * 60 * 1000; // مهلة ساعة واحدة
      const now = new Date().getTime();
      const distance = endTime - now;

      if (distance <= 0) {
        clearInterval(interval);
        setTimeLeft("انتهت مهلة التعديل/الإلغاء");
        setCanAction(false);
      } else {
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`متبقي ${minutes} دقيقة و ${seconds} ثانية للتعديل أو الإلغاء`);
      }
    }, 1000);
  };

  // --- دالة إلغاء الحجز ونظام الحظر ---
  const handleCancel = async () => {
    if (!window.confirm("هل أنت متأكد من إلغاء الحجز؟ سيؤدي ذلك لزيادة عداد الإلغاء لديك.")) return;

    const { data: { user } } = await supabase.auth.getUser();

    // 1. تحديث حالة الحجز إلى 'cancelled'
    await supabase.from("bookings").update({ status: "cancelled" }).eq("id", booking.id);

    // 2. جلب العداد الحالي للمستخدم
    const { data: profile } = await supabase.from("profiles").select("cancel_count").eq("id", user.id).single();
    
    const newCount = (profile.cancel_count || 0) + 1;

    // 3. تحديث العداد وفحص الحظر
    const isBanned = newCount >= 5;
    await supabase.from("profiles").update({ 
      cancel_count: newCount,
      is_banned: isBanned 
    }).eq("id", user.id);

    if (isBanned) {
      alert("تم حظرك من الحجز لتكرار الإلغاء (5 مرات).");
    } else {
      alert(`تم الإلغاء. عداد الإلغاء لديك الآن: ${newCount}/5`);
    }
    
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#4A628A] flex flex-col items-center p-8 text-right" dir="rtl">
      {/* زر العودة */}
      <button onClick={() => router.push("/")} className="absolute top-8 left-8 bg-[#C8A97E] p-3 rounded-full text-white shadow-lg hover:scale-110 transition">
         ⬅️
      </button>

      {/* بطاقة الحجز */}
      <div className="w-full max-w-5xl bg-[#D9D9D9] rounded-3xl p-8 flex items-center justify-between shadow-2xl mt-20">
        <div className="flex flex-col items-center border-l border-gray-400 px-6">
          <span className="text-gray-500 font-bold">القاعة</span>
          <h2 className="text-[#1A365D] text-3xl font-black">{booking?.hall_name || "لا يوجد حجز"}</h2>
        </div>
        <div className="flex flex-col items-center border-l border-gray-400 px-6">
          <span className="text-gray-500 font-bold">اليوم</span>
          <p className="text-[#1A365D] font-bold">{booking?.date || "---"}</p>
        </div>
        <div className="flex flex-col items-center border-l border-gray-400 px-6">
          <span className="text-gray-500 font-bold">الموقع</span>
          <p className="text-[#1A365D] font-bold text-sm">المكلا_الشرج</p>
        </div>
        
        {/* أزرار الإجراءات */}
        <div className="flex flex-col gap-3">
          <button disabled={!canAction} onClick={() => alert("سيتم فتح صفحة التعديل")}
            className={`px-8 py-2 rounded-xl font-bold ${canAction ? 'bg-[#C8A97E] text-white hover:bg-[#b0936b]' : 'bg-gray-400 text-gray-200 cursor-not-allowed'}`}>
            تعديل
          </button>
          <button disabled={!canAction} onClick={handleCancel}
            className={`px-8 py-2 rounded-xl font-bold ${canAction ? 'bg-[#C8A97E] text-white hover:bg-red-600' : 'bg-gray-400 text-gray-200 cursor-not-allowed'}`}>
            إلغاء
          </button>
        </div>
      </div>

      {/* العداد التنازلي */}
      {booking && (
        <div className="mt-8 bg-[#1A365D] text-white px-10 py-3 rounded-full font-bold shadow-xl animate-pulse">
           {timeLeft}
        </div>
      )}

      {/* زر إضافة حجز جديد */}
      <Link href="/halls">
        <button className="mt-16 bg-[#D9A13B] text-white text-3xl font-black px-16 py-5 rounded-3xl shadow-[0_12px_0_#b07d2e] hover:translate-y-1 hover:shadow-[0_8px_0_#b07d2e] active:translate-y-3 active:shadow-none transition-all">
          إضافة حجز آخر
        </button>
      </Link>
    </div>
  );
}
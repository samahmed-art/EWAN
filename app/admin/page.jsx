"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Edit2, Trash2, PlusCircle, Send, CheckCircle, Image as ImageIcon, Users, BookOpen, Warehouse, ShieldAlert } from "lucide-react";
//dfldfdpf[]
export default function AdminDashboard() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // System states
  const [bookings, setBookings] = useState([]);
  const [halls, setHalls] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [todayStats, setTodayStats] = useState(0);

  // Broadcast state
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  // Hall Modal State
  const [showHallModal, setShowHallModal] = useState(false);
  const [editingHall, setEditingHall] = useState(null);

  const [hallName, setHallName] = useState("");
  const [hallLocation, setHallLocation] = useState("");
  const [hallDesc, setHallDesc] = useState("");
  const [hallPrice, setHallPrice] = useState("");
  const [hallCapacity, setHallCapacity] = useState("");
  const [hallFile, setHallFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      // Strict Access Control Guard
      if (error || !session || session.user.email !== 'jimmy@gmail.com') {
        router.push('/');
        return;
      }
      setIsAdmin(true);

      // Load System Entities
      await loadGlobalData();
    };

    checkAuthAndLoadData();
  }, [router]);

const loadGlobalData = async () => {
  setIsLoading(true);
  try {
    // 1. حساب التاريخ المحلي (بدون توقيت عالمي)
 // 1. تحديد بداية ونهاية يوم "اليوم" لعمل فحص نطاق (Range)
const now = new Date();
const startOfDay = new Date(now.setHours(0,0,0,0)).toISOString();
const endOfDay = new Date(now.setHours(23,59,59,999)).toISOString();

// 2. جلب العد بناءً على تاريخ إنشاء الحجز (created_at)
const { count, error: countError } = await supabase
  .from('bookings')
  .select('*', { count: 'exact', head: true })
  .eq('status', 'confirmed')
  .gte('created_at', startOfDay) // أكبر من أو يساوي بداية اليوم
  .lte('created_at', endOfDay);   // أصغر من أو يساوي نهاية اليوم

if (countError) {
  console.error("Stats Error:", countError);
} else {
  setTodayStats(count || 0);
}
    // 3. جلب الحجوزات (بدون ريليشن معقدة في البداية لتجنب الحذف)
// داخل دالة loadGlobalData
const { data: bData, error: bError } = await supabase
  .from('bookings')
  .select('*,halls(name),profiles(email)') // تأكدي من عدم وجود مسافات بين الجداول
  .order('created_at', { ascending: false });
    if (bError) {
      console.error("Bookings Error:", bError);
      // إذا فشل الربط، جلب البيانات الأساسية فقط كخطة بديلة
      const { data: basicData } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
      setBookings(basicData || []);
    } else {
      setBookings(bData || []);
    }

    // 4. جلب القاعات (تأكدي أن الترتيب حسب ID كما اتفقنا)
    const { data: hData } = await supabase.from('halls').select('*').order('id', { ascending: true });
    setHalls(hData || []);

  } catch (err) {
    console.error("Global Load Error:", err);
  } finally {
    setIsLoading(false);
  }
};

  // --- Halls CRUD Constraints ---
  const openHallModal = (hall = null) => {
    if (hall) {
      setEditingHall(hall);
      setHallName(hall.name || "");
      setHallLocation(hall.location || "");
      setHallDesc(hall.description || "");
      setHallPrice(hall.price || "");
      setHallCapacity(hall.capacity || "");
    } else {
      setEditingHall(null);
      setHallName("");
      setHallLocation("");
      setHallDesc("");
      setHallPrice("");
      setHallCapacity("");
    }
    setHallFile(null);
    setShowHallModal(true);
  };
  const saveHallDb = async () => {
    setIsUploading(true);

    // 1. تحديد الصورة (القديمة أو الجديدة المرفوعة)
    let imageUrl = editingHall?.image_urls?.[0] || "";

    if (hallFile) {
      const fileExt = hallFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from('hall-images')
        .upload(fileName, hallFile);

      if (!uploadErr) {
        const { data: publicUrlData } = supabase.storage.from('hall-images').getPublicUrl(fileName);
        imageUrl = publicUrlData.publicUrl;
      }
    }

    // 2. تجهيز البيانات بأسماء الأعمدة الصحيحة (كما في صورتك)
    const payload = {
      name: hallName,              // يطابق عمود name
      description: hallDesc,       // يطابق عمود description
      price_per_day: Number(hallPrice), // يطابق عمود price_per_day (حولناه لرقم)
      capacity: Number(hallCapacity),   // يطابق عمود capacity
      image_urls: [imageUrl]       // يطابق عمود image_urls (مصفوفة نصوص)
    };

    let dbError = null;

    if (editingHall) {
      const { error } = await supabase.from('halls').update(payload).eq('id', editingHall.id);
      dbError = error;
    } else {
      const { error } = await supabase.from('halls').insert([payload]);
      dbError = error;
    }

    if (dbError) {
      console.error("DB Save Error:", dbError);
      alert("فشل الحفظ: تأكد من تفعيل سياسة INSERT في Supabase للأدمن.");
    } else {
      setShowHallModal(false);
      loadGlobalData(); // لتحديث الجدول فوراً
    }
    setIsUploading(false);
  };
  const deleteHallSync = async (id) => {
    if (!window.confirm("تحذير إداري: هل أنت متأكد من الحذف النهائي للقاعة بالكامل من قاعدة البيانات؟")) return;
    await supabase.from('halls').delete().eq('id', id);
    setHalls(prev => prev.filter(h => h.id !== id));
  };


  // --- Resend Broadcast Engine ---
  const triggerBroadcastPing = async () => {
    if (!broadcastMessage.trim()) return alert("يرجى كتابة رسالة قبل الإرسال.");
    setIsBroadcasting(true);

    const validEmails = profiles.map(p => p.email).filter(Boolean);

    // Fallback if profiles is empty but we want to test Resend directly via local vars
    const testFallbackKey = process.env.NEXT_PUBLIC_RESEND_API_KEY;
    if (!testFallbackKey) {
      alert("مفتاح API الخاص بـ Resend مفقود في المتغيرات المحلية.");
      setIsBroadcasting(false);
      return;
    }

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${testFallbackKey}`
        },
        body: JSON.stringify({
          from: "Ewan Admin <onboarding@resend.dev>",
          to: ["delivered@resend.dev"], // Resend default safe test route preventing domain ban limits
          bcc: validEmails.length > 0 ? validEmails : ["jimmy@gmail.com"], // Fallback safe bounds
          subject: "إعلان إداري من منصة إيوان",
          html: `
              <div dir="rtl" style="font-family: tahoma, sans-serif; background-color: #f8f9fa; padding: 40px; text-align: center;">
                 <div style="background-color: #0A1128; padding: 30px; border-radius: 16px; border: 4px solid #C8A97E; max-width: 600px; margin: 0 auto; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
                    <h1 style="color: #C8A97E; margin-bottom: 20px;">رسالة إدارية هامة</h1>
                    <p style="color: white; font-size: 18px; line-height: 1.8;">${broadcastMessage.replace(/\n/g, '<br/>')}</p>
                 </div>
              </div>`
        })
      });

      if (response.ok) {
        alert("تم الإرسال لجميع الايميلات بنجاح!");
        setBroadcastMessage("");
      } else {
        const errData = await response.json();
        console.error(errData);
        alert("خطأ إداري: لم يتم الإرسال بسبب قيود Resend أو مساحة النطاق المجاني.");
      }
    } catch (err) {
      console.error(err);
      alert("فشل اتصال الشبكة بـ Resend API.");
    }
    setIsBroadcasting(false);
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#4A628A] flex flex-col justify-center items-center">
        <div className="w-16 h-16 border-4 border-[#C8A97E] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-white mt-4 font-bold text-xl drop-shadow-md">جاري استدعاء الأنظمة الإدارية...</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#4A628A] text-[#1A365D] font-sans rtl" dir="rtl">

      {/* Top Navbar */}
      <nav className="bg-[#1A365D] p-5 flex justify-between items-center shadow-2xl border-b-4 border-[#C8A97E]">
        <div className="flex items-center gap-4">
          <ShieldAlert className="w-8 h-8 text-[#C8A97E]" />
          <h1 className="text-white text-2xl font-black tracking-wide">الإدارة المركزية | إيوان</h1>
        </div>
        <button onClick={() => router.push('/')} className="bg-[#C8A97E] text-[#1A365D] font-bold px-6 py-2 rounded-lg hover:bg-white transition-colors shadow-md">
          عودة للموقع
        </button>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-10 space-y-12">

        {/* STATS CIRCLE SECTION */}
        <section className="flex flex-col items-center justify-center -mt-4 animate-in fade-in slide-in-from-top-10 duration-700">
          <div className="relative group">
            <div className="absolute -inset-1 bg-[#C8A97E] rounded-full blur-xl opacity-30 group-hover:opacity-60 transition duration-500"></div>
            <div className="relative bg-[#0A1128] w-48 h-48 md:w-56 md:h-56 rounded-full border-8 border-[#C8A97E] flex flex-col items-center justify-center shadow-2xl z-10 transform hover:scale-105 transition-transform duration-300">
              <span className="text-[#C8A97E] text-5xl md:text-7xl font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">{todayStats}</span>
              <span className="text-white font-bold text-sm md:text-lg mt-2 tracking-wider">حجوزات اليوم المؤكدة</span>
            </div>
          </div>
        </section>


        {/* BOOKINGS MANAGEMENT TABLE */}
        <section className="bg-[#D9D9D9] p-8 rounded-3xl shadow-2xl border border-white/20">
          <div className="flex items-center gap-3 mb-8 border-b-2 border-[#1A365D]/10 pb-4">
            <BookOpen className="w-8 h-8 text-[#1A365D]" />
            <h2 className="text-3xl font-black text-[#1A365D]">إدارة الحجوزات الشاملة</h2>
          </div>

          <div className="overflow-x-auto overflow-y-auto max-h-[400px] border border-gray-300 rounded-xl bg-white/50 shadow-inner custom-scrollbar">
            <table className="w-full text-right text-sm md:text-base border-collapse">
              <thead className="bg-[#1A365D] text-white sticky top-0 z-10">
                <tr>
                  <th className="p-4 rounded-tr-xl font-extrabold tracking-wide">معرف الحجز</th>
                  <th className="p-4 font-extrabold tracking-wide">العميل (البريد)</th>
                  <th className="p-4 font-extrabold tracking-wide">القاعة المعنية</th>
                  <th className="p-4 font-extrabold tracking-wide">التاريخ المحدد</th>
                  <th className="p-4 font-extrabold tracking-wide">الفترة الزمنية</th>
                  <th className="p-4 rounded-tl-xl font-extrabold tracking-wide text-center">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300 bg-white">
                {bookings.map((b, i) => (
                  <tr key={b.id} className={`hover:bg-gray-100 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="p-4 font-bold text-gray-500">#{String(b.id).slice(0, 6)}...</td>
                    <td className="p-4 font-bold text-[#1A365D]">{b.profiles?.email || b.customer_email || `User #${b.user_id.slice(0, 5)}`}</td>
                    <td className="p-4 font-black text-[#C8A97E]">{b.halls?.name || "قاعة محذوفة/مجهولة"}</td>
                    <td className="p-4 font-bold text-[#1A365D]">{b.booking_date}</td>
                    <td className="p-4 font-bold text-[#1A365D]">{b.time_slot}</td>
                    <td className="p-4 text-center">
                      {b.status === 'confirmed' ? <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold text-xs ring-1 ring-green-400">مؤكد</span> :
                        b.status === 'cancelled' ? <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-bold text-xs ring-1 ring-red-400">ملغي</span> :
                          <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-bold text-xs ring-1 ring-amber-400">معلق</span>}
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr><td colSpan="6" className="p-10 text-center text-gray-500 font-bold border-t">لا يوجد حجوزات مسجلة في قاعدة البيانات حالياً.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>


        {/* HALLS CRUD MANAGEMENT */}
        <section className="bg-[#D9D9D9] p-8 rounded-3xl shadow-2xl border border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b-2 border-[#1A365D]/10 pb-4 gap-4">
            <div className="flex items-center gap-3">
              <Warehouse className="w-8 h-8 text-[#1A365D]" />
              <h2 className="text-3xl font-black text-[#1A365D]">قواعد بيانات القاعات</h2>
            </div>
            <button onClick={() => openHallModal()} className="bg-[#C8A97E] hover:bg-[#b0936b] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-transform active:scale-95">
              <PlusCircle className="w-5 h-5" /> أضف قاعة جديدة
            </button>
          </div>

          <div className="overflow-x-auto border border-gray-300 rounded-xl bg-white shadow-inner">
            <table className="w-full text-right text-sm md:text-base border-collapse">
              <thead className="bg-[#1A365D] text-white">
                <tr>
                  <th className="p-4 rounded-tr-xl">صورة</th>
                  <th className="p-4">اسم القاعة</th>
                  <th className="p-4">الموقع</th>
                  <th className="p-4">السعر الأساسي</th>
                  <th className="p-4 text-center rounded-tl-xl">إجراءات إدارية</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {halls.map((h, i) => (
                  <tr key={h.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3">
                      {/* تعديل h.image إلى h.image_urls[0] */}
                      <img
                        src={h.image_urls?.[0] || 'https://via.placeholder.com/150'}
                        alt="hall"
                        className="w-14 h-14 object-cover rounded-lg border border-gray-300 shadow-sm"
                      />
                    </td>
                    <td className="p-4 font-black text-[#1A365D]">{h.name}</td>
                    <td className="p-4 font-bold text-gray-600">{h.location || "الموقع غير محدد"}</td>
                    {/* تعديل h.price إلى h.price_per_day */}
                    <td className="p-4 font-black text-[#C8A97E]">{h.price_per_day} ر.س</td>
                    <td className="p-4">
                      <div className="flex justify-center items-center gap-3">
                        <button onClick={() => openHallModal(h)} className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg transition-colors">
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button onClick={() => deleteHallSync(h.id)} className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {halls.length === 0 && (
                  <tr><td colSpan="5" className="p-10 text-center text-gray-500 font-bold border-t">لا توجد قاعات مضافة حالياً.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>


        {/* BROADCAST MESSAGING */}
        <section className="bg-[#D9D9D9] p-8 rounded-3xl shadow-2xl border border-white/20 pb-10">
          <div className="flex items-center gap-3 mb-6 border-b-2 border-[#1A365D]/10 pb-4">
            <Send className="w-8 h-8 text-[#1A365D]" />
            <h2 className="text-3xl font-black text-[#1A365D]">مركز البث العام للإيميلات</h2>
            <span className="bg-red-600 text-white text-xs px-3 py-1 rounded-lg ml-auto font-bold animate-pulse">Live</span>
          </div>

          <div className="flex flex-col gap-4">
            <textarea
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              placeholder="اكتب رسالة بريدية لترسلها مباشرة إلى جميع عملائك المسجلين..."
              className="w-full h-32 p-4 rounded-xl border-2 border-gray-300 focus:outline-none focus:border-[#C8A97E] resize-none font-bold text-[#1A365D] shadow-inner"
            ></textarea>

            <button
              disabled={isBroadcasting}
              onClick={triggerBroadcastPing}
              className="bg-[#1A365D] hover:bg-[#0A1128] text-white px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mx-auto md:mr-auto md:ml-0"
            >
              <Send className="w-5 h-5" />
              {isBroadcasting ? "جاري الإستدعاء والإرسال..." : "إرسال البريد للجميع"}
            </button>
          </div>
        </section>

      </main>

      {/* ----------- MODALS ----------- */}
      {showHallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#D9D9D9] w-full max-w-2xl rounded-3xl p-8 shadow-2xl relative animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
            <h3 className="text-3xl font-black text-[#1A365D] mb-6 border-b border-gray-400 pb-4">
              {editingHall ? "تعديل بيانات القاعة" : "إنشاء قاعة جديدة"}
            </h3>

            <div className="space-y-4 font-bold text-[#1A365D]">
              <div>
                <label className="block mb-1">اسم القاعة</label>
                <input type="text" value={hallName} onChange={e => setHallName(e.target.value)} className="w-full p-3 rounded-xl border-2 border-gray-300 focus:border-[#C8A97E] outline-none" placeholder="مثال: قاعة ميرال" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">المدينة / الموقع</label>
                  <input type="text" value={hallLocation} onChange={e => setHallLocation(e.target.value)} className="w-full p-3 rounded-xl border-2 border-gray-300 focus:border-[#C8A97E] outline-none" placeholder="الشرج..." />
                </div>
                <div>
                  <label className="block mb-1">السعر الأساسي</label>
                  <input type="text" value={hallPrice} onChange={e => setHallPrice(e.target.value)} className="w-full p-3 rounded-xl border-2 border-gray-300 focus:border-[#C8A97E] outline-none" placeholder="10,000 ر.س" />
                </div>
              </div>
              <div>
                <label className="block mb-1">الوصف التسويقي</label>
                <textarea value={hallDesc} onChange={e => setHallDesc(e.target.value)} className="w-full p-3 rounded-xl border-2 border-gray-300 focus:border-[#C8A97E] outline-none resize-none h-24" placeholder="وصف فاخر للقاعة..."></textarea>
              </div>
              <div>
                <label className="block mb-1">السعة (ضيوف)</label>
                <input type="text" value={hallCapacity} onChange={e => setHallCapacity(e.target.value)} className="w-full p-3 rounded-xl border-2 border-gray-300 focus:border-[#C8A97E] outline-none" placeholder="500" />
              </div>

              <div className="border border-dashed border-gray-500 rounded-xl p-6 flex flex-col items-center justify-center text-center mt-2 bg-white/50">
                <ImageIcon className="w-10 h-10 text-gray-400 mb-2" />
                <span className="text-gray-500 font-bold mb-2">ارفع صورة العرض للقاعة العلوية للـ Storage (jpg/png)</span>
                <input type="file" accept="image/*" onChange={(e) => setHallFile(e.target.files[0])} className="w-full max-w-xs block mx-auto text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#C8A97E]/20 file:text-[#1A365D] hover:file:bg-[#C8A97E]/30 cursor-pointer" />
                {editingHall?.image && !hallFile && <img src={editingHall.image} alt="current" className="mt-4 w-32 h-20 object-cover rounded-lg shadow-sm border border-gray-300" />}
              </div>
            </div>

            <div className="flex items-center gap-4 mt-8 pt-4 border-t border-gray-400">
              <button disabled={isUploading} onClick={saveHallDb} className="bg-[#1A365D] hover:bg-[#0A1128] text-white px-8 py-3 rounded-xl font-bold flex-1 shadow-lg disabled:opacity-50 transition-colors">
                {isUploading ? "جاري الرفع المتزامن..." : "حفظ قاعدة البيانات"}
              </button>
              <button disabled={isUploading} onClick={() => setShowHallModal(false)} className="bg-gray-400 hover:bg-gray-500 text-white px-8 py-3 rounded-xl font-bold transition-colors">
                إلغاء التعديل
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global CSS for scrollbars */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #888; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #555; }
      `}} />
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
export default function Navbar({ activePage = "home" }) {
  const [user, setUser] = useState(null);
const router = useRouter();

  const handleLogout = async () => {
    if (window.confirm("هل أنت متأكد أنك تريد تسجيل الخروج؟")) {
      await supabase.auth.signOut();
      router.push("/");
    }
  };
useEffect(() => {
  // 1. جلب الجلسة الحالية مرة واحدة فوراً (أخف من getUser)
  const session = supabase.auth.getSession();
  setUser(session?.user ?? null);

  // 2. مراقبة التغييرات (دخول، خروج، تحديث توكن)
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user ?? null);
  });

  return () => {
    subscription.unsubscribe();
  };
}, []);
  return (
    <nav className="fixed top-0 w-full z-50 pt-6 px-8">
      {/* المستطيل الكحلي العائم */}
      <div className="max-w-[2000px] mx-auto h-24 bg-[rgba(201, 179, 107, 0.6)]/85 backdrop-blur-md rounded-[20px] border border-white/10 shadow-[0_15px_35px_rgba(26, 54, 93, 0.4)] flex items-center justify-between px-10 flex-row-reverse">
     <div className="flex-shrink-0">
 {user ? (
  // جعلنا هذا القسم بالكامل عبارة عن رابط للداشبورد
  <div className="flex items-center gap-4 flex-row-reverse">
    
    {/* 1. صورة البروفايل (عند الضغط تنقل للداشبورد) */}
    <Link href="/dashboard">
      <div className="w-12 h-12 rounded-full border-2 border-[#C8A97E] overflow-hidden bg-gray-800 shadow-inner cursor-pointer hover:scale-110 transition-transform">
        <img 
          src={user.user_metadata?.avatar_url || "/default-avatar.png"} 
          alt="User" 
          className="w-full h-full object-cover"
        />
      </div>
    </Link>

    {/* 2. الاسم وزر الخروج */}
    <div className="text-right flex flex-col items-end">
      <Link href="/dashboard">
        <p className="text-[#C8A97E] font-bold text-sm cursor-pointer hover:underline">
          {user.user_metadata?.full_name || "مستخدم إيوان"}
        </p>
      </Link>
      
      <button 
        onClick={handleLogout}
        className="text-white/60 hover:text-red-400 text-[10px] font-medium transition-colors mt-1"
      >
        تسجيل الخروج
      </button>
    </div>
  </div>
) : (
    <Link href="/login">
      <button className="bg-[#C8A97E] hover:bg-[#b0936b] text-white px-8 py-2.5 rounded-xl font-bold text-lg shadow-lg">
        تسجيل دخول
      </button>
    </Link>
  )}
</div>
        

        {/* 2. القائمة (في المنتصف) */}
<ul className="hidden md:flex flex-row-reverse items-center space-x-12 space-x-reverse text-white text-xl font-bold">
 
  {/* الرئيسية ترجعنا لأعلى الصفحة */}
   <li>
    <a href="#contact" className="hover:text-[#C8A97E] transition-colors">دعم العملاء</a>
  </li>
  <li>
    <a href="#about" className="hover:text-[#C8A97E] transition-colors">نبذة عنا</a>
  </li>
   <li>
    <a href="#halls" className="hover:text-[#C8A97E] transition-colors">القاعات</a>
  </li>
  
  <li onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="cursor-pointer text-[#C8A97E]">الرئيسية</li>
  
  {/* الروابط الأخرى تشير للـ IDs التي وضعناها */}
 
 
</ul>
      {/* 1. اللوجو (أقصى اليمين) */}
        <div className="flex-shrink-0">
          <img src="/logo.png" alt="إيوان" className="h-25 w-auto object-contain brightness-125" />
        </div>
      </div>
    </nav>
  );
}
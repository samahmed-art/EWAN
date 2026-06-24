"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
export default function Navbar({ activePage = "home" }) {
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState("home");
  const router = useRouter();
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

useEffect(() => {
  const sections = ["home", "halls", "about", "contact"];
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    },
    {
      root: null,
      rootMargin: "-40% 0px -60% 0px",
      threshold: 0
    }
  );

  sections.forEach((id) => {
    const element = document.getElementById(id);
    if (element) observer.observe(element);
  });

  return () => {
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.unobserve(element);
    });
  };
}, []);
  return (
    <nav className="fixed top-0 w-full z-50 pt-6 px-8">
      {/* المستطيل الكحلي العائم */}
<div className="max-w-[2000px] mx-auto h-24 bg-[#0A1128] border border-[#C8A97E]/40 backdrop-blur-xl rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-between px-10 flex-row-reverse">     <div className="flex-shrink-0">
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

    {/* 2. الاسم */}
    <div className="text-right flex flex-col items-end">
      <Link href="/dashboard">
        <p className="text-[#C8A97E] font-bold text-sm cursor-pointer hover:underline mt-1.5">
          {user.user_metadata?.full_name || "مستخدم إيوان"}
        </p>
      </Link>
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
        <ul className="hidden md:flex flex-row-reverse items-center space-x-12 space-x-reverse text-xl font-bold">
          {[



                { id: "contact", label: "دعم العملاء" },
                                        { id: "about", label: "نبذة عنا" },

                                        { id: "halls", label: "القاعات" },

                    { id: "home", label: "الرئيسية" },

          ].map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`transition-colors duration-300 ${
                  activeSection === item.id ? "text-[#C8A97E]" : "text-white hover:text-[#C8A97E]"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.getElementById(item.id);
                  if (target) {
                    target.scrollIntoView({ behavior: "smooth" });
                  } else if (item.id === "home") {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  } else {
                    router.push(`/#${item.id}`);
                  }
                }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      {/* 1. اللوجو (أقصى اليمين) */}
        <div className="flex-shrink-0">
          <img src="/logo.png" alt="إيوان" className="h-25 w-auto object-contain brightness-125" />
        </div>
      </div>
    </nav>
  );
}
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setErrorMsg("الرجاء تعبئة جميع الحقول.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("كلمة المرور يجب أن لا تقل عن 6 أحرف.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    setLoading(false);

    if (error) {
      console.error("Signup error:", error.message);
      if (error.message.includes("already registered")) {
        setErrorMsg("البريد الإلكتروني مسجل بالفعل.");
      } else {
        setErrorMsg("حدث خطأ أثناء محاولة إنشاء الحساب.");
      }
    } else {
      setSuccessMsg("تم إنشاء الحساب! يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب.");
      setFullName("");
      setEmail("");
      setPassword("");
    }
  };

  return (
    <main className="min-h-screen bg-[#0A1128] flex items-center justify-center relative overflow-hidden" dir="rtl">
      {/* Decorative Blur Orbs */}
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-[#C8A97E]/15 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-[#1a2d5c]/50 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md px-6 z-10 py-12">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-[#C8A97E] mb-2 tracking-tight">إيوان</h1>
            <p className="text-gray-300 font-medium">إنشاء حساب جديد</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            {errorMsg && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-center font-bold text-sm">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-3 rounded-xl text-center font-bold text-sm leading-relaxed">
                {successMsg}
              </div>
            )}

            <div>
              <label className="block text-gray-200 text-sm font-semibold mb-2 ml-1">الاسم الكامل</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="أحمد محمد..."
                className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#C8A97E] focus:ring-1 focus:ring-[#C8A97E] text-white placeholder-gray-400 transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-gray-200 text-sm font-semibold mb-2 ml-1">البريد الإلكتروني</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                dir="ltr"
                className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#C8A97E] focus:ring-1 focus:ring-[#C8A97E] text-white placeholder-gray-400 transition-all text-left"
              />
            </div>

            <div>
              <label className="block text-gray-200 text-sm font-semibold mb-2 ml-1">كلمة المرور</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                dir="ltr"
                className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#C8A97E] focus:ring-1 focus:ring-[#C8A97E] text-white placeholder-gray-400 transition-all text-left tracking-widest"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !!successMsg}
              className="w-full bg-[#C8A97E] hover:bg-[#b0936b] text-white font-bold py-3.5 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none text-lg mt-6"
            >
              {loading ? "جاري الإنشاء..." : "إنشاء حساب"}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-white/10 pt-6">
            <p className="text-gray-400 text-sm">
              لديك حساب بالفعل؟{" "}
              <Link href="/login" className="text-[#C8A97E] hover:text-white transition-colors font-bold ml-1">
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

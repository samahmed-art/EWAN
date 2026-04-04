"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("الرجاء إدخال البريد الإلكتروني وكلمة المرور.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      console.error("Login error:", error.message);
      // Translate common error messages
      if (error.message.includes("Invalid login credentials")) {
        setErrorMsg("البريد الإلكتروني أو كلمة المرور غير صحيحة.");
      } else {
        setErrorMsg("حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة لاحقاً.");
      }
    } else {
      router.push("/");
    }
  };

  return (
    <main className="min-h-screen bg-[#0A1128] flex items-center justify-center relative overflow-hidden" dir="rtl">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 -right-20 w-72 h-72 bg-[#C8A97E]/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -left-20 w-72 h-72 bg-[#1a2d5c]/40 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md px-6 z-10">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-[#C8A97E] mb-2 tracking-tight">إيوان</h1>
            <p className="text-gray-300 font-medium">تسجيل الدخول إلى حسابك</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {errorMsg && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-center font-bold text-sm">
                {errorMsg}
              </div>
            )}

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
              disabled={loading}
              className="w-full bg-[#C8A97E] hover:bg-[#b0936b] text-white font-bold py-3.5 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none text-lg mt-4"
            >
              {loading ? "جاري التحقق..." : "تسجيل الدخول"}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-white/10 pt-6">
            <p className="text-gray-400 text-sm">
              ليس لديك حساب؟{" "}
              <Link href="/signup" className="text-[#C8A97E] hover:text-white transition-colors font-bold ml-1">
                سجل الآن
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

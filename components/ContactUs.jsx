"use client";
import React, { useState } from "react";
import { Phone, Mail, Camera } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ContactUs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setErrorMsg("الرجاء تعبئة جميع الحقول");
      return;
    }
    
    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    const { error } = await supabase
      .from('messages')
      .insert([{ name, email, message }]);

    setIsSubmitting(false);

    if (error) {
      console.error("Error inserting message:", error);
      setErrorMsg("حدث خطأ أثناء الإرسال، حاول مرة أخرى.");
    } else {
      setSuccessMsg("تم إرسال رسالتك بنجاح");
      setName("");
      setEmail("");
      setMessage("");
      setTimeout(() => setSuccessMsg(""), 5000);
    }
  };
  return (
    <section className="py-20 relative bg-white">
      {/* Subtle gold separator at top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-0.5 bg-gradient-to-r from-transparent via-ewan-gold to-transparent opacity-50"></div>
      
      <div className="container max-w-6xl mx-auto px-4 mt-8">
        <h2 className="text-2xl font-bold text-ewan-blue text-center mb-16">خدمة العملاء</h2>
        
        <div className="flex flex-col lg:flex-row justify-between gap-12 max-w-5xl mx-auto">
          
          {/* Contact Info (Right side) */}
          <div className="w-full lg:w-5/12 flex flex-col items-start pr-0 lg:pr-10 pt-4">
            <h3 className="text-xl font-bold text-ewan-blue mb-8">تواصل معنا مباشرة</h3>
            <div className="space-y-6 w-full">
              <div className="flex items-center text-gray-700 font-bold">
                <div className="w-12 h-12 bg-[#faebd4] rounded-md flex items-center justify-center ml-4">
                  <Phone className="w-5 h-5 text-ewan-gold" />
                </div>
                <span dir="ltr" className="text-lg tracking-wide">+967 781 579 082</span>
              </div>
              <div className="flex items-center text-gray-700 font-bold">
                <div className="w-12 h-12 bg-[#faebd4] rounded-md flex items-center justify-center ml-4">
                  <Mail className="w-5 h-5 text-ewan-gold" />
                </div>
                <span dir="ltr" className="text-base tracking-wide">samera84178@gmail.com</span>
              </div>
              <div className="flex items-center text-gray-700 font-bold">
                <div className="w-12 h-12 bg-[#faebd4] rounded-md flex items-center justify-center ml-4">
                  <Camera className="w-5 h-5 text-ewan-gold" />
                </div>
                <span dir="ltr" className="text-base tracking-wide">samdev_1</span>
              </div>
            </div>
          </div>

          {/* Contact Form (Left side) */}
          <div className="w-full lg:w-6/12 mt-8 lg:mt-0">
            <div className="bg-[#fcfcfc] p-8 lg:p-10 rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.05)] border border-gray-100">
              <h3 className="text-xl font-bold text-ewan-blue text-center mb-8">للاستفسارات والاقتراحات</h3>
              <form className="space-y-5" onSubmit={handleSubmit}>
                {successMsg && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative text-center font-bold">
                    {successMsg}
                  </div>
                )}
                {errorMsg && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center font-bold">
                    {errorMsg}
                  </div>
                )}
                <div>
                  <input 
                    type="text" 
                    placeholder="الاسم الكامل" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-5 py-3.5 bg-gray-100/80 rounded-md border-transparent focus:border-ewan-gold focus:ring-1 focus:ring-ewan-gold outline-none transition-colors text-gray-800 placeholder:text-gray-400 font-medium"
                  />
                </div>
                <div>
                  <input 
                    type="email" 
                    placeholder="الالكتروني البريد" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 py-3.5 bg-gray-100/80 rounded-md border-transparent focus:border-ewan-gold focus:ring-1 focus:ring-ewan-gold outline-none transition-colors text-gray-800 placeholder:text-gray-400 font-medium"
                    dir="rtl"
                  />
                </div>
                <div>
                  <textarea 
                    rows="4"
                    placeholder="الاستفسار" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-5 py-3.5 bg-gray-100/80 rounded-md border-transparent focus:border-ewan-gold focus:ring-1 focus:ring-ewan-gold outline-none transition-colors resize-none text-gray-800 placeholder:text-gray-400 font-medium"
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-ewan-gold text-white font-bold py-3.5 px-6 rounded-md hover:bg-[#b59837] shadow-sm transition-colors text-lg mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "جاري الإرسال..." : "ارسال الاستفسار"}
                </button>
              </form>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}

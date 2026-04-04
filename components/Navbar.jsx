import Link from "next/link";

export default function Navbar({ activePage = "home" }) {
  return (
    <nav className="fixed top-0 w-full z-50 pt-6 px-8">
      {/* المستطيل الكحلي العائم */}
      <div className="max-w-[2000px] mx-auto h-24 bg-[rgba(201, 179, 107, 0.6)]/85 backdrop-blur-md rounded-[20px] border border-white/10 shadow-[0_15px_35px_rgba(26, 54, 93, 0.4)] flex items-center justify-between px-10 flex-row-reverse">
          {/* 3. الزر (أقصى اليسار) */}
     <Link href="/login">
  <button className="bg-[#C8A97E] hover:bg-[#b0936b] text-white px-8 py-2.5 rounded-xl font-bold text-lg shadow-lg transition-all active:scale-95">
    تسجيل دخول
  </button>
</Link>
        

        {/* 2. القائمة (في المنتصف) */}
        <ul className="hidden md:flex flex-row-reverse items-center space-x-25 space-x-reverse text-white text-xl font-bold">
       
          <li className="hover:text-[#C8A97E] transition-colors cursor-pointer">دعم العملاء</li>
          <li className="hover:text-[#C8A97E] transition-colors cursor-pointer">نبذة عنا</li>

          <li className={`transition-colors cursor-pointer ${activePage === 'halls' ? 'text-[#C8A97E] relative group' : 'hover:text-[#C8A97E]'}`}>
            <Link href="/halls">القاعات</Link>
            {activePage === 'halls' && <div className="absolute -bottom-2 right-0 w-full h-1 bg-[#C8A97E] rounded-full shadow-[0_0_10px_#C8A97E]"></div>}
          </li>
          <li className={`transition-colors cursor-pointer ${activePage === 'home' ? 'text-[#C8A97E] relative group' : 'hover:text-[#C8A97E]'}`}>
            <Link href="/">الرئيسية</Link>
            {activePage === 'home' && <div className="absolute -bottom-2 right-0 w-full h-1 bg-[#C8A97E] rounded-full shadow-[0_0_10px_#C8A97E]"></div>}
          </li>
        </ul>

      {/* 1. اللوجو (أقصى اليمين) */}
        <div className="flex-shrink-0">
          <img src="/logo.png" alt="إيوان" className="h-25 w-auto object-contain brightness-125" />
        </div>
      </div>
    </nav>
  );
}
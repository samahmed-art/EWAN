import React from "react";

export default function Footer() {
  return (
    <footer className="bg-ewan-blue text-white py-6 text-center">
      <div className="container mx-auto px-4">
        <p className="opacity-80 text-sm">جميع الحقوق محفوظة &copy; {new Date().getFullYear()} - إيوان</p>
      </div>
    </footer>
  );
}

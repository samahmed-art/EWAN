import "./globals.css";

export const metadata = {
  title: "إيوان - قاعات المكلا",
  description: "منصة حجز واكتشاف أفضل القاعات في المكلا",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedHalls from "@/components/FeaturedHalls";
import AboutUs from "@/components/AboutUs";
import ContactUs from "@/components/ContactUs";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      {/* سكشن الهيرو */}
      <section id="home">
        <Hero />
      </section>

      {/* قسم القاعات */}
      <section id="halls">
        <FeaturedHalls />
      </section>

      {/* قسم نبذة عنا */}
      <section id="about">
        <AboutUs />
      </section>

      {/* قسم تواصل معنا */}
      <section id="contact">
        <ContactUs />
      </section>

      <Footer />
    </main>
  );
}
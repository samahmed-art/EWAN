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
      <Hero />
      <FeaturedHalls />
      <AboutUs />
      <ContactUs />
      <Footer />
    </main>
  );
}

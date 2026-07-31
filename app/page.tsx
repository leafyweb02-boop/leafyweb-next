import LeafywebBrandBackground from "@/components/LeafywebBrandBackground";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Features from "@/components/Features";
import Templates from "@/components/Templates";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="relative overflow-hidden bg-[#111111] text-white">
      <LeafywebBrandBackground stage="home" />
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <Templates />
      <Pricing />
      <Testimonials />
      <Footer />
    </main>
  );
}

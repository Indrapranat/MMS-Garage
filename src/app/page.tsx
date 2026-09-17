import React from "react";
import { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { StatsBar } from "@/components/landing/StatsBar";
import { BrandShowcase } from "@/components/landing/BrandShowcase";
import { AboutSection } from "@/components/landing/AboutSection";
import { ServicesAndParts } from "@/components/landing/ServicesAndParts";
import { WhyChooseUs } from "@/components/landing/WhyChooseUs";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Testimonials } from "@/components/landing/Testimonials";
import { Footer } from "@/components/landing/Footer";
import { FloatingWhatsApp } from "@/components/landing/FloatingWhatsApp";

export const metadata: Metadata = {
  title: "MMS Garage - Bengkel Sepeda Motor & Suku Cadang Resmi Yamaha, Honda, Suzuki",
  description:
    "Bengkel sepeda motor terpercaya dengan layanan servis berkala, tune-up injeksi, transmisi CVT matic, serta penyedia suku cadang 100% original Yamaha, Honda, dan Suzuki bergaransi resmi.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-orange-500 selection:text-white">
      {/* 1. Header & Navigation */}
      <Navbar />

      {/* 2. Hero Section with Interactive Service Estimator */}
      <HeroSection />

      {/* 3. 4 Key Stats Bar with Signature Orange Corners */}
      <StatsBar />

      {/* 4. Brand Showcase with Signature Curved Orange Banner */}
      <BrandShowcase />

      {/* 5. About Workshop Section (Since 2016) */}
      <AboutSection />

      {/* 6. Promotional Strips & Arch Cards Catalog */}
      <ServicesAndParts />

      {/* 7. Why Choose Us & Hotline Callout */}
      <WhyChooseUs />

      {/* 8. 4 Working Steps with Spareparts Showcase */}
      <HowItWorks />

      {/* 9. Customer Testimonials */}
      <Testimonials />

      {/* 10. Comprehensive Footer */}
      <Footer />

      {/* 11. Fixed Floating WhatsApp CTA Button */}
      <FloatingWhatsApp
        phoneNumber="6281234567890"
        defaultMessage="Halo MMS Garage, saya ingin konsultasi mengenai perawatan motor / ketersediaan sparepart resmi."
      />
    </div>
  );
}

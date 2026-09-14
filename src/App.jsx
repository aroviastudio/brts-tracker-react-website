import React from 'react';
import Navbar from './components/mehandi/Navbar';
import HeroSection from './components/mehandi/HeroSection';
import ServicesSection from './components/mehandi/ServicesSection';
import PortfolioSection from './components/mehandi/PortfolioSection';
import PackagesSection from './components/mehandi/PackagesSection';
import ReviewsSection from './components/mehandi/ReviewsSection';
import ContactSection from './components/mehandi/ContactSection';
import AdminDashboard from './components/mehandi/AdminDashboard';
import Footer from './components/mehandi/Footer';
import WhatsAppFloat from './components/mehandi/WhatsAppFloat';

export default function App() {
  return (
    <div className="min-h-screen bg-[#fdfbf7]">
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <PortfolioSection />
        <PackagesSection />
        <ReviewsSection />
        <ContactSection />
        <AdminDashboard />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}

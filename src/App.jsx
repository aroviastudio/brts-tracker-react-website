import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Calendar,
  Clock,
  ShieldCheck,
  Award,
  ChevronRight,
  Heart,
  Eye,
  X,
  Send,
  Upload,
  Trash2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Sliders,
  Layers,
  Flame,
  Star,
  Compass,
  ArrowUpRight,
  Menu,
  Phone
} from 'lucide-react';
import {
  createWhatsAppUrl,
  fetchDesigns,
  createDesign,
  deleteDesign,
  submitInquiry,
  fetchInquiries,
  updateInquiryStatus,
  testSupabaseConnection,
  SUPABASE_URL,
  WHATSAPP_PHONE
} from './lib/supabase';
import { INITIAL_SERVICES, INITIAL_REVIEWS } from './data/mockData';

// ─── STAIN TIMELINE DATA ──────────────────────────────────────────
const STAIN_STAGES = [
  {
    hours: '0 Hours',
    title: 'Fresh Botanical Application',
    colorHex: '#382C1E',
    badge: 'Wet Paste',
    description: 'Triple-sifted Sojat henna paste applied with 0.2mm micro-cone precision. Nilgiri and lavender essential oils start opening skin pores.',
    aftercareTip: 'Keep on skin for 6–8 hours. Wrap with medical tape or apply lemon-sugar glaze.'
  },
  {
    hours: '12 Hours',
    title: 'Warm Pumpkin Glow',
    colorHex: '#B85D26',
    badge: 'Initial Oxidation',
    description: 'Paste scraped off dry (never washed with water). Lawsone dye begins naturally oxidising with oxygen in the air.',
    aftercareTip: 'Scrape off using coconut or mustard oil. Avoid water contact completely for first 24 hours.'
  },
  {
    hours: '24 Hours',
    title: 'Deepening Ruby Auburn',
    colorHex: '#8C2B22',
    badge: 'Maturing Shade',
    description: 'Color intensifies as lawsone molecules bond permanently with skin keratin. Beautiful warmth begins radiating in photos.',
    aftercareTip: 'Expose hands to warm clove (laung) steam for 2 minutes to boost natural pigmentation.'
  },
  {
    hours: '48 Hours',
    title: 'Peak Royal Mahogany',
    colorHex: '#4A1116',
    badge: 'Grandeur Peak',
    description: 'Rich, luxurious dark mahogany-maroon shade achieved. Maximum contrast that stands out magnificently on your wedding day.',
    aftercareTip: 'Apply natural shea balm before bathing. Stain will maintain peak brilliance for 8–14 days.'
  }
];

export default function App() {
  // Navigation & UI states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeServiceTab, setActiveServiceTab] = useState('All');
  const [activeGalleryTab, setActiveGalleryTab] = useState('all');
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [stainStage, setStainStage] = useState(3); // default to 48h peak

  // Live Supabase & Local Designs
  const [designs, setDesigns] = useState([]);
  const [loadingDesigns, setLoadingDesigns] = useState(true);

  // Bespoke Henna Calculator State
  const [builderConfig, setBuilderConfig] = useState({
    handLength: 'elbow', // 'wrist', 'forearm', 'elbow', 'shoulder'
    feetLength: 'mid-calf', // 'none', 'anklet', 'mid-calf', 'knee'
    hasPortrait: true,
    hasHashtag: true,
    guestCount: 10
  });

  // Booking Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    eventDate: '',
    eventType: 'Royal Bridal Celebration',
    cityVenue: '',
    message: ''
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  // Studio Admin Drawer State
  const [adminOpen, setAdminOpen] = useState(false);
  const [inquiries, setInquiries] = useState([]);
  const [dbStatus, setDbStatus] = useState(null);
  const [adminLoading, setAdminLoading] = useState(false);
  const [newDesignForm, setNewDesignForm] = useState({
    title: '',
    category: 'bridal',
    imageUrl: '',
    description: '',
    priceRange: '₹5,000 - ₹9,000',
    tag: 'Signature'
  });
  const [addingDesign, setAddingDesign] = useState(false);

  // Load designs on mount
  useEffect(() => {
    loadPortfolioDesigns();
  }, []);

  const loadPortfolioDesigns = async () => {
    setLoadingDesigns(true);
    try {
      const data = await fetchDesigns();
      setDesigns(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDesigns(false);
    }
  };

  const loadAdminPortal = async () => {
    setAdminLoading(true);
    try {
      const [inq, status] = await Promise.all([
        fetchInquiries(),
        testSupabaseConnection()
      ]);
      setInquiries(inq);
      setDbStatus(status);
    } catch (err) {
      console.error(err);
    } finally {
      setAdminLoading(false);
    }
  };

  const handleOpenAdmin = () => {
    setAdminOpen(true);
    loadAdminPortal();
  };

  // Bespoke Price & Duration Calculation
  const calculation = useMemo(() => {
    let basePrice = 0;
    let baseHours = 0;
    let cones = 4;

    // Hand length pricing
    if (builderConfig.handLength === 'wrist') { basePrice += 2500; baseHours += 2; cones += 2; }
    else if (builderConfig.handLength === 'forearm') { basePrice += 4500; baseHours += 3.5; cones += 4; }
    else if (builderConfig.handLength === 'elbow') { basePrice += 7500; baseHours += 5; cones += 6; }
    else if (builderConfig.handLength === 'shoulder') { basePrice += 12000; baseHours += 7; cones += 9; }

    // Feet pricing
    if (builderConfig.feetLength === 'anklet') { basePrice += 1800; baseHours += 1; cones += 2; }
    else if (builderConfig.feetLength === 'mid-calf') { basePrice += 3500; baseHours += 2; cones += 3; }
    else if (builderConfig.feetLength === 'knee') { basePrice += 6000; baseHours += 3.5; cones += 5; }

    // Addons
    if (builderConfig.hasPortrait) { basePrice += 1500; baseHours += 0.75; }
    if (builderConfig.hasHashtag) { basePrice += 500; baseHours += 0.25; }

    // Guests
    const guestPrice = builderConfig.guestCount * 400;
    const totalEst = basePrice + guestPrice;

    return {
      price: totalEst,
      hours: baseHours,
      conesCount: cones + Math.ceil(builderConfig.guestCount * 0.75)
    };
  }, [builderConfig]);

  // Form submit handler
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.eventDate) return;
    setFormSubmitting(true);
    try {
      await submitInquiry(formData);
      setFormSuccess(true);
      // Auto open WhatsApp with customized quotation
      const waUrl = createWhatsAppUrl({
        name: formData.name,
        phone: formData.phone,
        eventDate: formData.eventDate,
        eventType: formData.eventType,
        cityVenue: formData.cityVenue,
        customNote: formData.message
      });
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error(err);
    } finally {
      setFormSubmitting(false);
    }
  };

  // Add new design in admin
  const handleCreateDesign = async (e) => {
    e.preventDefault();
    if (!newDesignForm.title || !newDesignForm.imageUrl) return;
    setAddingDesign(true);
    try {
      const res = await createDesign(newDesignForm);
      setDesigns(prev => [res.design, ...prev]);
      setNewDesignForm({
        title: '',
        category: 'bridal',
        imageUrl: '',
        description: '',
        priceRange: '₹5,000 - ₹9,000',
        tag: 'Signature'
      });
      alert('Design successfully uploaded to Supabase & local portfolio!');
    } catch (err) {
      alert('Failed: ' + err.message);
    } finally {
      setAddingDesign(false);
    }
  };

  const handleDeleteDesign = async (id) => {
    if (!confirm('Delete this design from portfolio?')) return;
    await deleteDesign(id);
    setDesigns(prev => prev.filter(d => d.id !== id));
  };

  const handleInquiryStatus = async (id, status) => {
    await updateInquiryStatus(id, status);
    setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status } : inq));
  };

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Filtered services
  const filteredServices = activeServiceTab === 'All'
    ? INITIAL_SERVICES
    : INITIAL_SERVICES.filter(s => s.category.toLowerCase().includes(activeServiceTab.toLowerCase()));

  // Filtered gallery designs
  const filteredDesigns = activeGalleryTab === 'all'
    ? designs
    : designs.filter(d => d.category.toLowerCase() === activeGalleryTab.toLowerCase());

  return (
    <div className="min-h-screen bg-[#0f0d0c] text-[#faf7f2] selection:bg-[#8b2635] selection:text-[#faf7f2]">
      
      {/* ─────────────────────────────────────────────────────────── */}
      {/* 1. HAUTE NAVIGATION BAR                                     */}
      {/* ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#0f0d0c]/90 backdrop-blur-xl border-b border-[#241d1a] transition-all">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 h-20 flex items-center justify-between">
          
          {/* Brand Monogram & Title */}
          <button
            onClick={() => scrollTo('hero')}
            className="flex items-center gap-3 text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full border border-[#c5a880]/40 flex items-center justify-center bg-[#171412] group-hover:border-[#c5a880] transition-colors">
              <span className="font-italiana text-lg text-[#c5a880]">BM</span>
            </div>
            <div>
              <span className="font-italiana text-2xl tracking-[0.15em] font-normal text-[#faf7f2] block leading-tight">
                BHUVI MEHANDI
              </span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-[#a3958c] font-outfit block">
                Haute Atelier • Organic Sojat
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-9 text-xs tracking-[0.2em] uppercase font-outfit text-[#a3958c]">
            <button onClick={() => scrollTo('services')} className="hover:text-[#c5a880] transition-colors cursor-pointer">
              Services & Events
            </button>
            <button onClick={() => scrollTo('builder')} className="hover:text-[#c5a880] transition-colors cursor-pointer text-[#e6d5b8] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#c5a880]" />
              Bespoke Builder
            </button>
            <button onClick={() => scrollTo('portfolio')} className="hover:text-[#c5a880] transition-colors cursor-pointer">
              Atelier Archive
            </button>
            <button onClick={() => scrollTo('stain')} className="hover:text-[#c5a880] transition-colors cursor-pointer">
              Stain Alchemy
            </button>
            <button onClick={() => scrollTo('about')} className="hover:text-[#c5a880] transition-colors cursor-pointer">
              Philosophy
            </button>
            <button onClick={() => scrollTo('inquire')} className="hover:text-[#c5a880] transition-colors cursor-pointer">
              Reservations
            </button>
          </nav>

          {/* WhatsApp Direct Concierge CTA */}
          <div className="hidden sm:flex items-center gap-4 font-outfit">
            <a
              href={createWhatsAppUrl({
                eventType: 'VIP Bridal Inquiry',
                customNote: 'Namaste Bhuvi, I would love to check date availability for my wedding celebrations.'
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#c5a880]/60 bg-[#171412] hover:bg-[#c5a880] hover:text-[#0f0d0c] text-xs uppercase tracking-[0.18em] text-[#c5a880] font-medium transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <span>WhatsApp Concierge</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#faf7f2] hover:text-[#c5a880] cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#171412] border-b border-[#241d1a] px-6 py-8 space-y-5 text-sm uppercase tracking-[0.2em] font-outfit">
            <button onClick={() => scrollTo('services')} className="block w-full text-left py-2 text-[#a3958c] hover:text-[#c5a880]">
              Event Services
            </button>
            <button onClick={() => scrollTo('builder')} className="block w-full text-left py-2 text-[#c5a880] flex items-center justify-between">
              <span>Bespoke Henna Builder</span>
              <Sparkles className="w-4 h-4" />
            </button>
            <button onClick={() => scrollTo('portfolio')} className="block w-full text-left py-2 text-[#a3958c] hover:text-[#c5a880]">
              Archive Gallery
            </button>
            <button onClick={() => scrollTo('stain')} className="block w-full text-left py-2 text-[#a3958c] hover:text-[#c5a880]">
              The 48h Stain Journey
            </button>
            <button onClick={() => scrollTo('about')} className="block w-full text-left py-2 text-[#a3958c] hover:text-[#c5a880]">
              The Organic Philosophy
            </button>
            <button onClick={() => scrollTo('inquire')} className="block w-full text-left py-2 text-[#a3958c] hover:text-[#c5a880]">
              Book Your Date
            </button>
            <div className="pt-4 border-t border-[#241d1a]">
              <a
                href={createWhatsAppUrl({ customNote: 'Hi Bhuvi! Reaching out from website mobile menu.' })}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center py-3 bg-[#c5a880] text-[#0f0d0c] font-semibold text-xs tracking-[0.2em] rounded-full inline-block"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        )}
      </header>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 2. THE GRAND LUXURY HERO                                    */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section id="hero" className="relative overflow-hidden pt-12 sm:pt-20 pb-24 sm:pb-36">
        
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[500px] bg-gradient-to-tr from-[#8b2635]/15 via-[#c5a880]/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -top-10 -right-20 w-80 h-80 bg-[#c5a880]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 sm:px-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#c5a880]/30 bg-[#171412]/80 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-[#c5a880] animate-pulse" />
                <span className="text-[11px] uppercase tracking-[0.22em] text-[#e6d5b8] font-outfit">
                  Premier Bridal & Event Henna Atelier
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="font-italiana text-5xl sm:text-7xl lg:text-8xl font-normal leading-[1.02] tracking-[-0.01em] text-[#faf7f2]">
                Haute Henna, <br />
                <span className="gold-gradient-text italic font-normal">heirloom</span> crafted <br />
                for life's vows.
              </h1>

              {/* Subtext */}
              <p className="text-base sm:text-lg text-[#a3958c] font-light leading-relaxed max-w-xl font-sans">
                Handcrafted with 100% triple-sifted organic Rajasthani Sojat leaf, Bulgarian lavender, and Nilgiri botanical oils. 
                Custom storytelling compositions with guaranteed 48-hour deep mahogany stains.
              </p>

              {/* Dual Action CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 font-outfit">
                <a
                  href={createWhatsAppUrl({
                    eventType: 'Royal Bridal Package',
                    customNote: 'Namaste Bhuvi! I want to check date availability and book my bridal mehandi.'
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-[#c5a880] via-[#e6d5b8] to-[#c5a880] text-[#0f0d0c] font-bold text-xs uppercase tracking-[0.2em] text-center hover:scale-[1.02] transition-transform duration-300 shadow-lg hover:shadow-xl"
                >
                  Book on WhatsApp Concierge
                </a>

                <button
                  onClick={() => scrollTo('builder')}
                  className="px-8 py-4 rounded-full border border-[#2d2420] bg-[#171412] hover:border-[#c5a880]/60 text-xs uppercase tracking-[0.2em] text-[#faf7f2] hover:text-[#c5a880] transition-colors duration-300 cursor-pointer text-center flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#c5a880]" />
                  Custom Henna Builder
                </button>
              </div>

              {/* Key Atelier Pillars */}
              <div className="pt-8 border-t border-[#241d1a] grid grid-cols-3 gap-6 max-w-lg font-outfit">
                <div>
                  <span className="font-italiana text-3xl sm:text-4xl text-[#c5a880] block">100%</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#a3958c] mt-1 block">Organic Sojat</span>
                </div>
                <div>
                  <span className="font-italiana text-3xl sm:text-4xl text-[#c5a880] block">1,200+</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#a3958c] mt-1 block">Brides Adorned</span>
                </div>
                <div>
                  <span className="font-italiana text-3xl sm:text-4xl text-[#c5a880] block">48h</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#a3958c] mt-1 block">Dark Stain Peak</span>
                </div>
              </div>

            </div>

            {/* Right Visual Composition */}
            <div className="lg:col-span-5 relative">
              
              {/* Outer decorative ring */}
              <div className="relative rounded-3xl p-3 border border-[#2d2420] bg-gradient-to-b from-[#171412] to-[#0f0d0c] shadow-2xl">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#171412]">
                  <img
                    src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85"
                    alt="Bhuvi Mehandi - Royal Bridal Artistry"
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0d0c] via-transparent to-transparent opacity-80" />
                  
                  {/* Floating Floating Info Capsule */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#171412]/90 backdrop-blur-md border border-[#2d2420] flex items-center justify-between">
                    <div>
                      <p className="font-italiana text-lg text-[#faf7f2]">The Royal Dulha-Dulhan Motif</p>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#c5a880] font-outfit">Signature Storyline Edition</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#c5a880]/20 flex items-center justify-center text-[#c5a880]">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 3. EVENT SERVICES & PACKAGES                                */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section id="services" className="py-24 sm:py-32 bg-[#171412] border-t border-b border-[#241d1a] relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-[#2d2420]">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#c5a880] font-outfit block mb-2">
                Celebration Services
              </span>
              <h2 className="font-italiana text-4xl sm:text-6xl text-[#faf7f2]">
                Services by Event
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 sm:gap-3 mt-6 md:mt-0 font-outfit text-xs uppercase tracking-[0.18em]">
              {['All', 'Bridal', 'Engagement', 'Arabic', 'Traditional', 'Baby Shower', 'Family & Guests'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveServiceTab(tab)}
                  className={`px-4 py-2 rounded-full transition-all cursor-pointer ${
                    activeServiceTab === tab
                      ? 'bg-[#c5a880] text-[#0f0d0c] font-bold shadow-md'
                      : 'bg-[#201a17] text-[#a3958c] hover:text-[#faf7f2] hover:bg-[#2a201d]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map(service => {
              const waUrl = createWhatsAppUrl({
                eventType: service.eventType,
                service: service.name,
                customNote: `Hi Bhuvi! I am inquiring about booking the "${service.name}" for my upcoming ${service.eventType}.`
              });

              return (
                <div
                  key={service.id}
                  className="group rounded-2xl bg-[#201a17] border border-[#2d2420] overflow-hidden flex flex-col justify-between hover:border-[#c5a880]/50 transition-all duration-500 hover:-translate-y-1.5 shadow-lg"
                >
                  <div>
                    {/* Card Media */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#171412]">
                      <img
                        src={service.imageUrl}
                        alt={service.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#201a17] via-transparent to-transparent opacity-80" />
                      
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#0f0d0c]/80 backdrop-blur-sm text-[10px] uppercase tracking-[0.2em] font-outfit text-[#c5a880] border border-[#c5a880]/30">
                        {service.eventType}
                      </div>

                      <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-[#0f0d0c]/90 text-xs font-outfit text-[#faf7f2] font-semibold">
                        From {service.priceStarting}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between text-xs text-[#a3958c] font-outfit">
                        <span className="text-[#c5a880] uppercase tracking-wider">{service.badge}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {service.duration}</span>
                      </div>

                      <h3 className="font-italiana text-2xl text-[#faf7f2] group-hover:text-[#c5a880] transition-colors leading-tight">
                        {service.name}
                      </h3>

                      <p className="text-xs text-[#a3958c] font-sans leading-relaxed line-clamp-3">
                        {service.description}
                      </p>

                      {/* Included Features List */}
                      <ul className="space-y-1.5 pt-2 border-t border-[#2d2420]">
                        {service.includes.slice(0, 3).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-[11px] text-[#e5d3c1] font-sans">
                            <span className="text-[#c5a880] mt-0.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Card Action Button */}
                  <div className="p-6 pt-0">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 rounded-xl bg-[#2a201d] hover:bg-[#c5a880] text-[#faf7f2] hover:text-[#0f0d0c] text-xs uppercase tracking-[0.18em] font-outfit font-semibold flex items-center justify-center gap-2 transition-all duration-300"
                    >
                      <span>Book on WhatsApp</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 4. INTERACTIVE BESPOKE HENNA BUILDER / ESTIMATOR            */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section id="builder" className="py-24 sm:py-32 bg-[#0f0d0c] relative overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-1/2 left-1/3 w-[600px] h-[600px] bg-[#c5a880]/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 sm:px-10 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-[#c5a880] font-outfit block mb-2">
              Interactive Atelier Studio
            </span>
            <h2 className="font-italiana text-4xl sm:text-6xl text-[#faf7f2] mb-4">
              Bespoke Henna Calculator
            </h2>
            <p className="text-sm text-[#a3958c] font-sans leading-relaxed">
              Tailor every element of your ceremony — from hand lengths to custom portraiture and guest party count. 
              Receive real-time duration and cone estimations instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Configuration Panel */}
            <div className="lg:col-span-7 bg-[#171412] p-8 sm:p-10 rounded-3xl border border-[#2d2420] space-y-8 shadow-xl">
              
              {/* Step 1: Hand Length */}
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-[#c5a880] font-outfit mb-3">
                  1. Bride Hand Coverage Length
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-outfit">
                  {[
                    { id: 'wrist', label: 'Wrist', time: '~2 hrs' },
                    { id: 'forearm', label: 'Mid-Forearm', time: '~3.5 hrs' },
                    { id: 'elbow', label: 'Elbow Length', time: '~5 hrs' },
                    { id: 'shoulder', label: 'Shoulder Bridal', time: '~7 hrs' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setBuilderConfig({ ...builderConfig, handLength: opt.id })}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        builderConfig.handLength === opt.id
                          ? 'border-[#c5a880] bg-[#c5a880]/15 text-[#faf7f2]'
                          : 'border-[#2d2420] bg-[#201a17] text-[#a3958c] hover:border-[#3d312c]'
                      }`}
                    >
                      <p className="text-xs font-semibold">{opt.label}</p>
                      <p className="text-[10px] text-[#a3958c] mt-0.5">{opt.time}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Feet Length */}
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-[#c5a880] font-outfit mb-3">
                  2. Bride Feet & Calves Coverage
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-outfit">
                  {[
                    { id: 'none', label: 'Hands Only', time: '0 hrs' },
                    { id: 'anklet', label: 'Anklet Payal', time: '~1 hr' },
                    { id: 'mid-calf', label: 'Mid-Calf Jaal', time: '~2 hrs' },
                    { id: 'knee', label: 'Full Knee Royal', time: '~3.5 hrs' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setBuilderConfig({ ...builderConfig, feetLength: opt.id })}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        builderConfig.feetLength === opt.id
                          ? 'border-[#c5a880] bg-[#c5a880]/15 text-[#faf7f2]'
                          : 'border-[#2d2420] bg-[#201a17] text-[#a3958c] hover:border-[#3d312c]'
                      }`}
                    >
                      <p className="text-xs font-semibold">{opt.label}</p>
                      <p className="text-[10px] text-[#a3958c] mt-0.5">{opt.time}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Signature Storyline Elements */}
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-[#c5a880] font-outfit mb-3">
                  3. Signature Storyline Add-ons
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-outfit">
                  <button
                    type="button"
                    onClick={() => setBuilderConfig({ ...builderConfig, hasPortrait: !builderConfig.hasPortrait })}
                    className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      builderConfig.hasPortrait
                        ? 'border-[#c5a880] bg-[#c5a880]/15 text-[#faf7f2]'
                        : 'border-[#2d2420] bg-[#201a17] text-[#a3958c]'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-semibold">Dulha-Dulhan Handdrawn Portrait</p>
                      <p className="text-[10px] text-[#a3958c]">Temple archway figurines (+₹1,500)</p>
                    </div>
                    <CheckCircle className={`w-4 h-4 ${builderConfig.hasPortrait ? 'text-[#c5a880]' : 'text-[#3d312c]'}`} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setBuilderConfig({ ...builderConfig, hasHashtag: !builderConfig.hasHashtag })}
                    className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      builderConfig.hasHashtag
                        ? 'border-[#c5a880] bg-[#c5a880]/15 text-[#faf7f2]'
                        : 'border-[#2d2420] bg-[#201a17] text-[#a3958c]'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-semibold">Wedding Hashtag & Date Weaving</p>
                      <p className="text-[10px] text-[#a3958c]">Hidden monogram typography (+₹500)</p>
                    </div>
                    <CheckCircle className={`w-4 h-4 ${builderConfig.hasHashtag ? 'text-[#c5a880]' : 'text-[#3d312c]'}`} />
                  </button>
                </div>
              </div>

              {/* Step 4: Guest / Bridesmaid Count Slider */}
              <div>
                <div className="flex justify-between items-center mb-2 font-outfit">
                  <label className="text-xs uppercase tracking-[0.2em] text-[#c5a880]">
                    4. Bridesmaids & Family Guests ({builderConfig.guestCount} Guests)
                  </label>
                  <span className="text-xs text-[#faf7f2] font-semibold">~₹{builderConfig.guestCount * 400}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="5"
                  value={builderConfig.guestCount}
                  onChange={(e) => setBuilderConfig({ ...builderConfig, guestCount: parseInt(e.target.value) })}
                  className="w-full accent-[#c5a880] bg-[#201a17] h-2 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#a3958c] font-outfit mt-1">
                  <span>Bride only (0)</span>
                  <span>Intimate (15)</span>
                  <span>Grand Sangeet (50+)</span>
                </div>
              </div>

            </div>

            {/* Right Live Estimate Summary Card */}
            <div className="lg:col-span-5 rounded-3xl bg-gradient-to-b from-[#201a17] to-[#171412] p-8 sm:p-10 border border-[#c5a880]/40 shadow-2xl relative">
              <div className="space-y-6">
                
                <div className="flex items-center justify-between border-b border-[#2d2420] pb-4">
                  <span className="text-xs uppercase tracking-[0.2em] text-[#c5a880] font-outfit">
                    Quotation Estimate
                  </span>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#c5a880]/20 text-[#c5a880] font-outfit">
                    Bespoke Atelier
                  </span>
                </div>

                <div>
                  <span className="text-xs text-[#a3958c] uppercase tracking-wider font-outfit block">Estimated Investment</span>
                  <span className="font-italiana text-4xl sm:text-5xl text-[#faf7f2] block mt-1">
                    ₹{calculation.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] text-[#a3958c] font-sans">*Includes organic cones, sealant spray & travel consult</span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#2d2420] font-outfit">
                  <div className="p-3.5 rounded-xl bg-[#171412] border border-[#2d2420]">
                    <span className="text-[10px] uppercase tracking-wider text-[#a3958c] block">Application Time</span>
                    <span className="text-sm font-semibold text-[#faf7f2] mt-0.5 block flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#c5a880]" />
                      ~{calculation.hours} Hours
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#171412] border border-[#2d2420]">
                    <span className="text-[10px] uppercase tracking-wider text-[#a3958c] block">Organic Cones</span>
                    <span className="text-sm font-semibold text-[#faf7f2] mt-0.5 block flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#c5a880]" />
                      {calculation.conesCount} Cones Fresh
                    </span>
                  </div>
                </div>

                {/* Direct WhatsApp Quote Button */}
                <div className="pt-4">
                  <a
                    href={createWhatsAppUrl({
                      eventType: 'Custom Henna Package Quote',
                      customNote: `Hi Bhuvi! I used your Bespoke Henna Calculator on the website:\n- Hand Length: ${builderConfig.handLength}\n- Feet Length: ${builderConfig.feetLength}\n- Portrait: ${builderConfig.hasPortrait ? 'Yes' : 'No'}\n- Hashtag: ${builderConfig.hasHashtag ? 'Yes' : 'No'}\n- Guests: ${builderConfig.guestCount}\n- Est. Investment: ₹${calculation.price.toLocaleString('en-IN')}\n\nPlease confirm date availability!`
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 rounded-full bg-[#c5a880] hover:bg-[#e6d5b8] text-[#0f0d0c] font-bold text-xs uppercase tracking-[0.2em] font-outfit text-center flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
                  >
                    <span>Send Custom Specs to WhatsApp</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 5. ARCHIVE PORTFOLIO GALLERY (WITH SUPABASE SYNC)           */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section id="portfolio" className="py-24 sm:py-32 bg-[#171412] border-t border-b border-[#241d1a]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-[#2d2420]">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#c5a880] font-outfit block mb-2">
                Curated Works
              </span>
              <h2 className="font-italiana text-4xl sm:text-6xl text-[#faf7f2]">
                Atelier Archive
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 font-outfit text-xs uppercase tracking-[0.18em] mt-6 md:mt-0">
              {['all', 'bridal', 'arabic', 'rajasthani', 'feet', 'engagement', 'minimalist'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveGalleryTab(cat)}
                  className={`px-4 py-2 rounded-full transition-all cursor-pointer ${
                    activeGalleryTab === cat
                      ? 'bg-[#c5a880] text-[#0f0d0c] font-bold'
                      : 'bg-[#201a17] text-[#a3958c] hover:text-[#faf7f2]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Designs */}
          {loadingDesigns ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-[3/4] rounded-2xl bg-[#201a17] animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredDesigns.map(design => (
                <div
                  key={design.id}
                  onClick={() => setSelectedDesign(design)}
                  className="group relative rounded-2xl overflow-hidden bg-[#201a17] border border-[#2d2420] cursor-pointer hover:border-[#c5a880]/60 transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={design.imageUrl}
                      alt={design.title}
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f0d0c] via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#0f0d0c]/80 backdrop-blur-sm text-[9px] uppercase tracking-[0.2em] font-outfit text-[#c5a880]">
                      {design.tag || design.category}
                    </div>

                    <div className="absolute bottom-3 left-3 right-3">
                      <h4 className="font-italiana text-lg text-[#faf7f2] group-hover:text-[#c5a880] transition-colors truncate">
                        {design.title}
                      </h4>
                      <p className="text-[11px] text-[#a3958c] font-outfit mt-0.5">
                        {design.priceRange || 'Custom Quote'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 6. THE 48-HOUR ORGANIC OXIDATION TIMELINE                   */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section id="stain" className="py-24 sm:py-32 bg-[#0f0d0c] relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-[#c5a880] font-outfit block mb-2">
              The Chemistry of Organic Henna
            </span>
            <h2 className="font-italiana text-4xl sm:text-6xl text-[#faf7f2] mb-4">
              The Stain Oxidation Journey
            </h2>
            <p className="text-sm text-[#a3958c] font-sans leading-relaxed">
              Pure Sojat henna contains natural lawsone molecules that react gently with air and body heat over 48 hours to create our signature deep mahogany stain.
            </p>
          </div>

          {/* Interactive Stepper Control */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10 font-outfit">
            {STAIN_STAGES.map((st, idx) => (
              <button
                key={idx}
                onClick={() => setStainStage(idx)}
                className={`p-4 rounded-2xl border transition-all text-center cursor-pointer ${
                  stainStage === idx
                    ? 'border-[#c5a880] bg-[#171412] shadow-lg'
                    : 'border-[#2d2420] bg-[#171412]/50 text-[#a3958c] hover:border-[#3d312c]'
                }`}
              >
                <div
                  className="w-6 h-6 rounded-full mx-auto mb-2 border border-white/20 shadow-inner"
                  style={{ backgroundColor: st.colorHex }}
                />
                <p className="text-xs font-semibold text-[#faf7f2]">{st.hours}</p>
                <p className="text-[10px] text-[#c5a880] mt-0.5">{st.badge}</p>
              </button>
            ))}
          </div>

          {/* Active Stage Showcase Card */}
          <div className="rounded-3xl bg-[#171412] border border-[#2d2420] p-8 sm:p-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-4 flex flex-col items-center text-center p-6 rounded-2xl bg-[#0f0d0c] border border-[#2d2420]">
              <div
                className="w-24 h-24 rounded-full border-4 border-[#c5a880]/30 shadow-2xl mb-4"
                style={{ backgroundColor: STAIN_STAGES[stainStage].colorHex }}
              />
              <span className="font-italiana text-2xl text-[#faf7f2]">{STAIN_STAGES[stainStage].title}</span>
              <span className="text-xs text-[#c5a880] font-outfit mt-1">{STAIN_STAGES[stainStage].badge}</span>
            </div>

            <div className="md:col-span-8 space-y-4">
              <h3 className="font-italiana text-3xl text-[#faf7f2]">
                {STAIN_STAGES[stainStage].title}
              </h3>
              <p className="text-sm text-[#a3958c] font-sans leading-relaxed">
                {STAIN_STAGES[stainStage].description}
              </p>

              <div className="p-4 rounded-xl bg-[#201a17] border border-[#2d2420]">
                <p className="text-xs font-semibold text-[#c5a880] uppercase tracking-wider font-outfit mb-1 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-[#c5a880]" />
                  Atelier Aftercare Ritual
                </p>
                <p className="text-xs text-[#e5d3c1] font-sans leading-relaxed">
                  {STAIN_STAGES[stainStage].aftercareTip}
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 7. PHILOSOPHY & ABOUT ATELIER                               */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section id="about" className="py-24 sm:py-32 bg-[#171412] border-t border-b border-[#241d1a]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-[#201a17] border border-[#2d2420]">
                <img
                  src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=85"
                  alt="Bhuvi Artist at work"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs uppercase tracking-[0.25em] text-[#c5a880] font-outfit block">
                The Atelier Heritage
              </span>

              <h2 className="font-italiana text-4xl sm:text-6xl text-[#faf7f2] leading-tight">
                Crafted with intention. <br />
                <span className="gold-gradient-text italic">Colored</span> by nature.
              </h2>

              <p className="text-sm sm:text-base text-[#a3958c] font-sans leading-relaxed">
                Henna is not merely an ornament; it is the physical anchoring of an auspicious milestone. 
                Bhuvi approaches every bride as an intimate canvas — sketching custom narratives that honor family traditions, 
                lehenga embroidery motifs, and personal love stories.
              </p>

              <div className="space-y-4 pt-4 border-t border-[#2d2420] font-sans text-xs">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-4 h-4 text-[#c5a880] mt-0.5 flex-shrink-0" />
                  <p className="text-[#a3958c] leading-relaxed">
                    <strong className="text-[#faf7f2]">100% Zero-Chemical Guarantee:</strong> No black henna, no PPD, no synthetic dyes. Formulated exclusively with tea tree, eucalyptus, and Bulgarian lavender essential oils.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <Award className="w-4 h-4 text-[#c5a880] mt-0.5 flex-shrink-0" />
                  <p className="text-[#a3958c] leading-relaxed">
                    <strong className="text-[#faf7f2]">Destination & Venue Travel:</strong> Based in Ahmedabad & Gandhinagar with full travel setup across Udaipur, Jaipur, Goa, Mumbai, and international venues.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 8. REAL BRIDE TESTIMONIALS                                  */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section className="py-24 sm:py-32 bg-[#0f0d0c]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-[#c5a880] font-outfit block mb-2">
              Client Testimonials
            </span>
            <h2 className="font-italiana text-4xl sm:text-6xl text-[#faf7f2]">
              Words from Real Brides
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {INITIAL_REVIEWS.map(rev => (
              <div
                key={rev.id}
                className="p-6 rounded-2xl bg-[#171412] border border-[#2d2420] flex flex-col justify-between space-y-4 shadow-lg"
              >
                <div className="space-y-3">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star key={i} className="w-4 h-4 fill-[#c5a880] text-[#c5a880]" />
                    ))}
                  </div>
                  <p className="text-xs text-[#a3958c] font-sans leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-3 border-t border-[#2d2420]">
                  <p className="font-italiana text-base text-[#faf7f2]">{rev.clientName}</p>
                  <p className="text-[10px] text-[#c5a880] font-outfit">{rev.eventType} • {rev.location}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 9. VIP RESERVATION & INQUIRY FORM                           */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section id="inquire" className="py-24 sm:py-32 bg-[#171412] border-t border-[#241d1a]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Left Info */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs uppercase tracking-[0.25em] text-[#c5a880] font-outfit block">
                Direct Booking
              </span>
              <h2 className="font-italiana text-4xl sm:text-6xl text-[#faf7f2]">
                Reserve Your Date
              </h2>
              <p className="text-sm text-[#a3958c] font-sans leading-relaxed">
                Due to the intimate, hand-sketched nature of our bridal work, we accept a limited number of weddings per season.
                Submit your celebration details below for immediate confirmation and custom quote.
              </p>

              <div className="p-6 rounded-2xl bg-[#0f0d0c] border border-[#2d2420] space-y-3 font-outfit text-xs">
                <div>
                  <span className="text-[#a3958c] uppercase tracking-wider block text-[10px]">Instant WhatsApp Line</span>
                  <span className="text-sm font-semibold text-[#c5a880]">+{WHATSAPP_PHONE}</span>
                </div>
                <div>
                  <span className="text-[#a3958c] uppercase tracking-wider block text-[10px]">Studio Location</span>
                  <span className="text-sm text-[#faf7f2]">Ahmedabad & Gandhinagar (Pan-India Travel)</span>
                </div>
              </div>
            </div>

            {/* Right Form */}
            <div className="lg:col-span-7 bg-[#201a17] p-8 sm:p-12 rounded-3xl border border-[#2d2420] shadow-2xl">
              {formSuccess ? (
                <div className="py-12 text-center space-y-4 font-outfit">
                  <CheckCircle className="w-12 h-12 text-[#c5a880] mx-auto" />
                  <h3 className="font-italiana text-3xl text-[#faf7f2]">Inquiry Received</h3>
                  <p className="text-xs text-[#a3958c] max-w-sm mx-auto">
                    Your date inquiry has been registered in the Atelier database. A WhatsApp chat has also opened to finalize your booking directly.
                  </p>
                  <button
                    onClick={() => setFormSuccess(false)}
                    className="text-xs uppercase tracking-widest text-[#c5a880] border-b border-[#c5a880] pb-1 cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-6 font-outfit">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#a3958c] mb-1.5">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Radhika Shah"
                        className="w-full px-4 py-3 rounded-xl bg-[#171412] border border-[#2d2420] focus:border-[#c5a880] text-sm text-[#faf7f2] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#a3958c] mb-1.5">Phone / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-3 rounded-xl bg-[#171412] border border-[#2d2420] focus:border-[#c5a880] text-sm text-[#faf7f2] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#a3958c] mb-1.5">Event Date *</label>
                      <input
                        type="date"
                        required
                        value={formData.eventDate}
                        onChange={e => setFormData({ ...formData, eventDate: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#171412] border border-[#2d2420] focus:border-[#c5a880] text-sm text-[#faf7f2] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#a3958c] mb-1.5">Event Type</label>
                      <select
                        value={formData.eventType}
                        onChange={e => setFormData({ ...formData, eventType: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#171412] border border-[#2d2420] focus:border-[#c5a880] text-sm text-[#faf7f2] outline-none cursor-pointer"
                      >
                        <option>Royal Bridal Celebration</option>
                        <option>Engagement & Roka Soirée</option>
                        <option>Sangeet & Bridesmaids Party</option>
                        <option>Contemporary Arabic</option>
                        <option>Mom-to-Be Godh Bharai</option>
                        <option>Destination Wedding</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#a3958c] mb-1.5">City & Venue Location</label>
                    <input
                      type="text"
                      value={formData.cityVenue}
                      onChange={e => setFormData({ ...formData, cityVenue: e.target.value })}
                      placeholder="e.g. Grand Hyatt / The Leela Palace"
                      className="w-full px-4 py-3 rounded-xl bg-[#171412] border border-[#2d2420] focus:border-[#c5a880] text-sm text-[#faf7f2] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#a3958c] mb-1.5">Special Requests or Design Vision</label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Share lehenga shades, customized story moments or guest count..."
                      className="w-full px-4 py-3 rounded-xl bg-[#171412] border border-[#2d2420] focus:border-[#c5a880] text-sm text-[#faf7f2] outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="w-full py-4 rounded-full bg-gradient-to-r from-[#c5a880] to-[#e6d5b8] text-[#0f0d0c] font-bold text-xs uppercase tracking-[0.2em] transition-all hover:scale-[1.01] disabled:opacity-50 cursor-pointer shadow-lg"
                  >
                    {formSubmitting ? 'Registering...' : 'Submit Inquiry & Open WhatsApp →'}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 10. LIGHTBOX PREVIEW MODAL                                  */}
      {/* ─────────────────────────────────────────────────────────── */}
      {selectedDesign && (
        <div
          className="fixed inset-0 z-50 bg-[#0f0d0c]/90 backdrop-blur-md flex items-center justify-center p-6"
          onClick={() => setSelectedDesign(null)}
        >
          <div
            className="bg-[#171412] border border-[#2d2420] rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="md:w-1/2 aspect-square md:aspect-auto bg-[#0f0d0c]">
              <img
                src={selectedDesign.imageUrl}
                alt={selectedDesign.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="md:w-1/2 p-8 flex flex-col justify-between overflow-y-auto font-outfit">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#c5a880] px-3 py-1 rounded-full bg-[#c5a880]/15">
                    {selectedDesign.category}
                  </span>
                  <button
                    onClick={() => setSelectedDesign(null)}
                    className="text-xs uppercase tracking-widest text-[#a3958c] hover:text-[#faf7f2] cursor-pointer"
                  >
                    Close [×]
                  </button>
                </div>

                <h3 className="font-italiana text-3xl text-[#faf7f2]">
                  {selectedDesign.title}
                </h3>

                <p className="text-xs text-[#a3958c] font-sans leading-relaxed">
                  {selectedDesign.description || 'Intricate bespoke henna composition handcrafted by Bhuvi.'}
                </p>

                {selectedDesign.priceRange && (
                  <div className="pt-2">
                    <span className="text-[10px] uppercase tracking-wider text-[#a3958c] block">Investment</span>
                    <span className="font-italiana text-2xl text-[#faf7f2]">{selectedDesign.priceRange}</span>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-[#2d2420]">
                <a
                  href={createWhatsAppUrl({
                    eventType: 'Archive Design Inquiry',
                    designCode: selectedDesign.title,
                    customNote: `Hi Bhuvi! I love the "${selectedDesign.title}" design from your portfolio archive. Can you share availability for this style?`
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-full bg-[#c5a880] text-[#0f0d0c] font-bold text-xs uppercase tracking-[0.2em] text-center inline-block hover:bg-[#e6d5b8]"
                >
                  Book This Design on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 11. STUDIO ACCESS / SUPABASE ADMIN DRAWER                   */}
      {/* ─────────────────────────────────────────────────────────── */}
      {adminOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end"
          onClick={() => setAdminOpen(false)}
        >
          <div
            className="bg-[#171412] border-l border-[#2d2420] w-full max-w-xl h-full p-8 overflow-y-auto font-outfit flex flex-col justify-between"
            onClick={e => e.stopPropagation()}
          >
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-[#2d2420] mb-6">
                <div>
                  <h3 className="font-italiana text-2xl text-[#faf7f2]">Studio Cloud Manager</h3>
                  <span className="text-[10px] uppercase tracking-widest text-[#c5a880]">
                    Supabase Portfolio & Inquiries Sync
                  </span>
                </div>
                <button
                  onClick={() => setAdminOpen(false)}
                  className="text-xs uppercase tracking-widest text-[#a3958c] hover:text-[#faf7f2] cursor-pointer"
                >
                  Close [×]
                </button>
              </div>

              {/* Status Banner */}
              <div className="p-4 rounded-xl bg-[#201a17] border border-[#2d2420] mb-8 text-xs space-y-1">
                <span className="text-[#c5a880] font-semibold block uppercase tracking-wider">
                  Supabase Cloud Status
                </span>
                <p className="text-[#a3958c]">
                  {dbStatus?.connected
                    ? (dbStatus.hasTables ? '🟢 Connected to Supabase mehandi tables' : '🟡 Supabase connected (run supabase-schema.sql for cloud tables)')
                    : '⚪ Local Storage Fallback Mode Active'}
                </p>
                <p className="text-[9px] text-[#666666] font-mono">{SUPABASE_URL}</p>
              </div>

              {/* Upload New Design Form */}
              <div className="mb-10 p-6 rounded-2xl bg-[#201a17] border border-[#2d2420]">
                <h4 className="text-xs uppercase tracking-widest text-[#faf7f2] font-semibold mb-4">
                  Upload Design to Portfolio
                </h4>
                <form onSubmit={handleCreateDesign} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#a3958c] mb-1">Title</label>
                    <input
                      type="text"
                      required
                      value={newDesignForm.title}
                      onChange={e => setNewDesignForm({ ...newDesignForm, title: e.target.value })}
                      placeholder="e.g. Royal Lotus Bridal Sleeves"
                      className="w-full p-2.5 rounded-lg bg-[#171412] border border-[#2d2420] text-[#faf7f2]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#a3958c] mb-1">Category</label>
                      <select
                        value={newDesignForm.category}
                        onChange={e => setNewDesignForm({ ...newDesignForm, category: e.target.value })}
                        className="w-full p-2.5 rounded-lg bg-[#171412] border border-[#2d2420] text-[#faf7f2]"
                      >
                        <option value="bridal">Bridal</option>
                        <option value="arabic">Arabic</option>
                        <option value="rajasthani">Rajasthani</option>
                        <option value="feet">Feet Art</option>
                        <option value="minimalist">Minimalist</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#a3958c] mb-1">Price Range</label>
                      <input
                        type="text"
                        value={newDesignForm.priceRange}
                        onChange={e => setNewDesignForm({ ...newDesignForm, priceRange: e.target.value })}
                        className="w-full p-2.5 rounded-lg bg-[#171412] border border-[#2d2420] text-[#faf7f2]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#a3958c] mb-1">Image URL</label>
                    <input
                      type="url"
                      required
                      value={newDesignForm.imageUrl}
                      onChange={e => setNewDesignForm({ ...newDesignForm, imageUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full p-2.5 rounded-lg bg-[#171412] border border-[#2d2420] text-[#faf7f2]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={addingDesign}
                    className="w-full py-3 rounded-xl bg-[#c5a880] text-[#0f0d0c] font-bold uppercase tracking-widest text-xs hover:bg-[#e6d5b8] cursor-pointer"
                  >
                    {addingDesign ? 'Saving...' : 'Add to Portfolio'}
                  </button>
                </form>
              </div>

              {/* Inquiry List */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xs uppercase tracking-widest text-[#faf7f2] font-semibold">
                    Client Inquiries ({inquiries.length})
                  </h4>
                  <button onClick={loadAdminPortal} className="text-xs text-[#c5a880] flex items-center gap-1 cursor-pointer">
                    <RefreshCw className="w-3.5 h-3.5" /> Refresh
                  </button>
                </div>

                {inquiries.length === 0 ? (
                  <p className="text-xs text-[#a3958c]">No inquiries registered yet.</p>
                ) : (
                  <div className="space-y-3">
                    {inquiries.map(inq => (
                      <div key={inq.id} className="p-4 rounded-xl bg-[#201a17] border border-[#2d2420] space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-sm text-[#faf7f2]">{inq.name}</span>
                          <span className="px-2 py-0.5 rounded-full bg-[#171412] text-[9px] uppercase tracking-wider text-[#c5a880]">
                            {inq.status || 'New'}
                          </span>
                        </div>
                        <p className="text-[#a3958c]">
                          📞 {inq.phone} • 📅 {inq.event_date} • {inq.event_type}
                        </p>
                        {inq.city_venue && <p className="text-[#888888]">📍 {inq.city_venue}</p>}
                        
                        <div className="pt-2 flex items-center justify-between">
                          <a
                            href={`https://wa.me/${inq.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${inq.name}! Thank you for inquiring with Bhuvi Mehandi Atelier.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 rounded-lg bg-[#25d366] text-white text-[10px] font-bold"
                          >
                            WhatsApp Reply
                          </a>
                          <select
                            value={inq.status || 'New'}
                            onChange={e => handleInquiryStatus(inq.id, e.target.value)}
                            className="p-1 rounded bg-[#171412] border border-[#2d2420] text-[10px] text-[#faf7f2]"
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Confirmed">Confirmed</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-[#2d2420] text-[10px] text-[#666666] text-center">
              BHUVI MEHANDI ATELIER • STUDIO CLOUD
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 12. LUXURY FOOTER                                           */}
      {/* ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-[#241d1a] bg-[#0f0d0c] py-16 font-outfit">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[#a3958c]">
          <div>
            <span className="font-italiana text-2xl text-[#faf7f2] tracking-widest block">
              BHUVI MEHANDI
            </span>
            <p className="text-[11px] text-[#777777] mt-1 font-sans">
              © {new Date().getFullYear()} Bhuvi Mehandi Atelier. Pure Organic Sojat Artistry.
            </p>
          </div>

          <div className="flex items-center space-x-6 tracking-[0.15em] uppercase text-[11px]">
            <a
              href={createWhatsAppUrl({ customNote: 'General inquiry for Bhuvi Mehandi.' })}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#c5a880] transition-colors"
            >
              WhatsApp
            </a>
            <button
              onClick={handleOpenAdmin}
              className="hover:text-[#c5a880] transition-colors cursor-pointer text-[#c5a880]"
            >
              Studio Access
            </button>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-[#c5a880] transition-colors cursor-pointer"
            >
              Top ↑
            </button>
          </div>
        </div>
      </footer>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 13. FLOATING WHATSAPP CONCIERGE BUTTON                      */}
      {/* ─────────────────────────────────────────────────────────── */}
      <a
        href={createWhatsAppUrl({ customNote: 'Hello Bhuvi! I am visiting your website and would love to ask a quick question.' })}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Bhuvi on WhatsApp"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#25d366] text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300"
      >
        <span className="absolute inset-0 rounded-full bg-[#25d366] animate-ping opacity-30 pointer-events-none" />
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>

    </div>
  );
}

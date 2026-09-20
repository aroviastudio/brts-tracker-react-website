import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Clock,
  ShieldCheck,
  Award,
  CheckCircle,
  Eye,
  X,
  RefreshCw,
  Flame,
  Star,
  ArrowUpRight,
  Menu,
  Phone,
  Plus,
  Edit2,
  Trash2,
  Lock,
  Unlock,
  Settings,
  Image,
  Users,
  MessageCircle,
  Database,
  Calendar,
  Check
} from 'lucide-react';
import {
  createWhatsAppUrl,
  fetchSettings,
  updateSettings,
  fetchServices,
  createService,
  updateService,
  deleteService,
  fetchDesigns,
  createDesign,
  deleteDesign,
  fetchReviews,
  submitReview,
  updateReview,
  deleteReview,
  fetchInquiries,
  submitInquiry,
  updateInquiryStatus,
  deleteInquiry,
  testSupabaseConnection,
  getOrCreateAuthorToken,
  SUPABASE_URL,
  DEFAULT_SETTINGS
} from './lib/supabase';

// ─── 4-STAGE OXIDATION TIMELINE DATA ──────────────────────────────
const STAIN_STAGES = [
  {
    hours: '0 Hours',
    title: 'Fresh Botanical Application',
    colorHex: '#382C1E',
    badge: 'Wet Paste',
    description: 'Triple-sifted Sojat henna paste applied with 0.2mm micro-cone precision. Nilgiri and lavender essential oils start opening skin pores.',
    aftercareTip: 'Keep paste on skin for 6–8 hours. Wrap with medical tape or apply lemon-sugar glaze.'
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
    description: 'Color intensifies as lawsone molecules bond permanently with skin keratin. Beautiful warmth begins radiating in wedding photos.',
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
  // ─── SITE DYNAMIC DATA STATES ───────────────────────────────────
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [services, setServices] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Author Token to identify user's own reviews
  const authorToken = useMemo(() => getOrCreateAuthorToken(), []);

  // UI Navigation & Filter States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeServiceTab, setActiveServiceTab] = useState('All');
  const [activeGalleryTab, setActiveGalleryTab] = useState('all');
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [stainStage, setStainStage] = useState(3);

  // ─── BESPOKE CALCULATOR STATE ───────────────────────────────────
  const [builderConfig, setBuilderConfig] = useState({
    handLength: 'elbow',
    feetLength: 'mid-calf',
    hasPortrait: true,
    hasHashtag: true,
    guestCount: 10
  });

  // ─── VIP INQUIRY FORM STATE ─────────────────────────────────────
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

  // ─── PUBLIC REVIEW MODAL STATES ─────────────────────────────────
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    client_name: '',
    rating: 5,
    event_type: 'Bridal Mehandi',
    location: '',
    comment: ''
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  // ─── ADMIN DASHBOARD & PIN AUTH STATES ──────────────────────────
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminTab, setAdminTab] = useState('settings'); // 'settings', 'services', 'designs', 'reviews', 'inquiries', 'supabase'
  const [dbStatus, setDbStatus] = useState(null);

  // Admin New Service Form
  const [newServiceForm, setNewServiceForm] = useState({
    name: '',
    category: 'Bridal',
    event_type: 'Wedding Day',
    price_starting: '₹6,500',
    duration: '3 - 5 Hours',
    description: '',
    image_url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
    badge: 'Signature',
    includes: 'Full hands to elbows, Feet jaali work, Organic Sojat cones'
  });

  // Admin New Design Form
  const [newDesignForm, setNewDesignForm] = useState({
    title: '',
    category: 'bridal',
    imageUrl: '',
    description: '',
    priceRange: '₹4,500 - ₹8,000',
    tag: 'Signature'
  });

  // Admin Settings Edit Form
  const [editSettingsForm, setEditSettingsForm] = useState(DEFAULT_SETTINGS);

  // Load all Supabase data on mount
  useEffect(() => {
    loadAllSiteData();
  }, []);

  const loadAllSiteData = async () => {
    setLoadingData(true);
    try {
      const [sett, serv, des, rev] = await Promise.all([
        fetchSettings(),
        fetchServices(),
        fetchDesigns(),
        fetchReviews()
      ]);
      setSettings(sett);
      setEditSettingsForm(sett);
      setServices(serv);
      setDesigns(des);
      setReviews(rev);
    } catch (err) {
      console.error('Error loading site data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const loadAdminInquiries = async () => {
    try {
      const [inq, stat] = await Promise.all([
        fetchInquiries(),
        testSupabaseConnection()
      ]);
      setInquiries(inq);
      setDbStatus(stat);
    } catch (e) {
      console.error(e);
    }
  };

  // ─── ADMIN PIN VERIFICATION ─────────────────────────────────────
  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (enteredPin === (settings.admin_pin || '1234')) {
      setPinModalOpen(false);
      setPinError(false);
      setEnteredPin('');
      setAdminOpen(true);
      loadAdminInquiries();
    } else {
      setPinError(true);
    }
  };

  // ─── BESPOKE CALCULATOR MATH ────────────────────────────────────
  const calculation = useMemo(() => {
    let basePrice = 0;
    let baseHours = 0;
    let cones = 4;

    if (builderConfig.handLength === 'wrist') { basePrice += 2500; baseHours += 2; cones += 2; }
    else if (builderConfig.handLength === 'forearm') { basePrice += 4500; baseHours += 3.5; cones += 4; }
    else if (builderConfig.handLength === 'elbow') { basePrice += 7500; baseHours += 5; cones += 6; }
    else if (builderConfig.handLength === 'shoulder') { basePrice += 12000; baseHours += 7; cones += 9; }

    if (builderConfig.feetLength === 'anklet') { basePrice += 1800; baseHours += 1; cones += 2; }
    else if (builderConfig.feetLength === 'mid-calf') { basePrice += 3500; baseHours += 2; cones += 3; }
    else if (builderConfig.feetLength === 'knee') { basePrice += 6000; baseHours += 3.5; cones += 5; }

    if (builderConfig.hasPortrait) { basePrice += 1500; baseHours += 0.75; }
    if (builderConfig.hasHashtag) { basePrice += 500; baseHours += 0.25; }

    const guestPrice = builderConfig.guestCount * 400;
    const totalEst = basePrice + guestPrice;

    return {
      price: totalEst,
      hours: baseHours,
      conesCount: cones + Math.ceil(builderConfig.guestCount * 0.75)
    };
  }, [builderConfig]);

  // ─── VIP INQUIRY HANDLER ────────────────────────────────────────
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.eventDate) return;
    setFormSubmitting(true);
    try {
      await submitInquiry(formData);
      setFormSuccess(true);
      const waUrl = createWhatsAppUrl({
        phone: settings.whatsapp_phone,
        name: formData.name,
        phone_user: formData.phone,
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

  // ─── REVIEW SUBMISSION & EDIT HANDLER ───────────────────────────
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.client_name || !reviewForm.comment) return;
    setSubmittingReview(true);
    try {
      if (editingReviewId) {
        await updateReview(editingReviewId, reviewForm);
        setReviews(prev => prev.map(r => r.id === editingReviewId ? { ...r, ...reviewForm } : r));
        alert('Your review has been updated!');
      } else {
        const newRev = await submitReview(reviewForm);
        setReviews(prev => [newRev, ...prev]);
        alert('Thank you for sharing your review!');
      }
      setReviewModalOpen(false);
      setEditingReviewId(null);
      setReviewForm({ client_name: '', rating: 5, event_type: 'Bridal Mehandi', location: '', comment: '' });
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleOpenEditReview = (rev) => {
    setEditingReviewId(rev.id);
    setReviewForm({
      client_name: rev.client_name,
      rating: rev.rating,
      event_type: rev.event_type,
      location: rev.location,
      comment: rev.comment
    });
    setReviewModalOpen(true);
  };

  const handleDeleteReview = async (id, isAdmin = false) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    await deleteReview(id, isAdmin);
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  // ─── ADMIN ACTIONS ──────────────────────────────────────────────
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    const updated = await updateSettings(editSettingsForm);
    setSettings(updated);
    alert('Site settings updated successfully!');
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    const includesArr = newServiceForm.includes.split(',').map(s => s.trim()).filter(Boolean);
    const created = await createService({ ...newServiceForm, includes: includesArr });
    setServices(prev => [created, ...prev]);
    setNewServiceForm({
      name: '',
      category: 'Bridal',
      event_type: 'Wedding Day',
      price_starting: '₹6,500',
      duration: '3 - 5 Hours',
      description: '',
      image_url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
      badge: 'Signature',
      includes: 'Full hands to elbows, Feet jaali work, Organic Sojat cones'
    });
    alert('Service added to live website!');
  };

  const handleDeleteService = async (id) => {
    if (!confirm('Delete this service package?')) return;
    await deleteService(id);
    setServices(prev => prev.filter(s => s.id !== id));
  };

  const handleCreateDesign = async (e) => {
    e.preventDefault();
    const res = await createDesign(newDesignForm);
    setDesigns(prev => [res.design, ...prev]);
    setNewDesignForm({
      title: '',
      category: 'bridal',
      imageUrl: '',
      description: '',
      priceRange: '₹4,500 - ₹8,000',
      tag: 'Signature'
    });
    alert('Design uploaded to portfolio!');
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

  const handleDeleteInquiry = async (id) => {
    if (!confirm('Delete this inquiry?')) return;
    setInquiries(prev => prev.filter(i => i.id !== id));
  };

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Filtered views
  const filteredServices = activeServiceTab === 'All'
    ? services
    : services.filter(s => s.category.toLowerCase().includes(activeServiceTab.toLowerCase()));

  const filteredDesigns = activeGalleryTab === 'all'
    ? designs
    : designs.filter(d => d.category.toLowerCase() === activeGalleryTab.toLowerCase());

  return (
    <div className="min-h-screen bg-[#F5EFEB] text-[#241E1A] antialiased selection:bg-[#A64B38] selection:text-[#FAF7F2]">
      
      {/* ─────────────────────────────────────────────────────────── */}
      {/* 1. TOP HAUTE NAVIGATION BAR                                 */}
      {/* ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#F5EFEB]/90 backdrop-blur-xl border-b border-[#D9CEC5] transition-colors">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 h-20 flex items-center justify-between">
          
          {/* Brand Monogram & Title */}
          <button
            onClick={() => scrollTo('hero')}
            className="flex items-center gap-3 text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full border border-[#A64B38]/40 bg-[#EDE4DC] flex items-center justify-center group-hover:border-[#A64B38] transition-colors shadow-sm">
              <span className="font-editorial text-xl font-bold text-[#A64B38]">BM</span>
            </div>
            <div>
              <span className="font-editorial text-2xl tracking-[0.14em] font-normal text-[#241E1A] block leading-tight">
                BHUVI MEHANDI
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#6E645D] font-sans block">
                Artisanal Sojat Atelier
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8 text-xs tracking-[0.18em] uppercase font-sans text-[#6E645D]">
            <button onClick={() => scrollTo('services')} className="hover:text-[#241E1A] transition-colors cursor-pointer">
              Services & Events
            </button>
            <button
              onClick={() => scrollTo('builder')}
              className="text-[#A64B38] hover:text-[#8A3B2A] transition-colors cursor-pointer flex items-center gap-1.5 font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Custom Calculator
            </button>
            <button onClick={() => scrollTo('portfolio')} className="hover:text-[#241E1A] transition-colors cursor-pointer">
              Portfolio Archive
            </button>
            <button onClick={() => scrollTo('stain')} className="hover:text-[#241E1A] transition-colors cursor-pointer">
              48h Stain Alchemy
            </button>
            <button onClick={() => scrollTo('reviews')} className="hover:text-[#241E1A] transition-colors cursor-pointer">
              Reviews
            </button>
            <button onClick={() => scrollTo('inquire')} className="hover:text-[#241E1A] transition-colors cursor-pointer">
              Reservations
            </button>
          </nav>

          {/* WhatsApp Direct Concierge CTA */}
          <div className="hidden sm:flex items-center gap-3 font-sans">
            <a
              href={createWhatsAppUrl({
                phone: settings.whatsapp_phone,
                eventType: 'VIP Bridal Inquiry',
                customNote: 'Namaste Bhuvi, I would love to check date availability for my wedding celebrations.'
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#A64B38] hover:bg-[#8A3B2A] text-[#FAF7F2] text-xs uppercase tracking-[0.16em] font-medium transition-all duration-300 shadow-md hover:scale-[1.02]"
            >
              <span>WhatsApp Concierge</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#241E1A] cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#EDE4DC] border-b border-[#D9CEC5] px-6 py-8 space-y-4 text-sm uppercase tracking-[0.18em] font-sans">
            <button onClick={() => scrollTo('services')} className="block w-full text-left py-1.5 text-[#241E1A]">
              Event Services
            </button>
            <button
              onClick={() => scrollTo('builder')}
              className="block w-full text-left py-1.5 text-[#A64B38] font-bold flex items-center justify-between"
            >
              <span>Bespoke Henna Calculator</span>
              <Sparkles className="w-4 h-4" />
            </button>
            <button onClick={() => scrollTo('portfolio')} className="block w-full text-left py-1.5 text-[#241E1A]">
              Archive Gallery
            </button>
            <button onClick={() => scrollTo('stain')} className="block w-full text-left py-1.5 text-[#241E1A]">
              48h Stain Alchemy
            </button>
            <button onClick={() => scrollTo('reviews')} className="block w-full text-left py-1.5 text-[#241E1A]">
              Bride Reviews
            </button>
            <button onClick={() => scrollTo('inquire')} className="block w-full text-left py-1.5 text-[#241E1A]">
              Book Your Date
            </button>
            <div className="pt-4 border-t border-[#D9CEC5]">
              <a
                href={createWhatsAppUrl({ phone: settings.whatsapp_phone, customNote: 'Hi Bhuvi! Reaching out from website mobile menu.' })}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center py-3 bg-[#A64B38] text-[#FAF7F2] font-semibold text-xs tracking-[0.18em] rounded-full inline-block shadow-md"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        )}
      </header>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 2. FULL-BLEED PHOTOGRAPHIC HERO (Option 1: Visual Proof)   */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section id="hero" className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden">
        
        {/* Full-bleed high-res background image */}
        <div className="absolute inset-0 z-0">
          <img
            src={settings.hero_image_url}
            alt="Bhuvi Mehandi Bridal Background"
            className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000"
          />
          {/* Multi-layer warm dark contrast overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#241E1A] via-[#241E1A]/65 to-[#241E1A]/40" />
        </div>

        {/* Hero Content Container */}
        <div className="max-w-5xl mx-auto px-6 sm:px-10 relative z-10 text-center text-[#FAF7F2] py-20 space-y-7">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/20 bg-black/40 backdrop-blur-md shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[#A64B38] animate-pulse" />
            <span className="text-[11px] uppercase tracking-[0.22em] text-[#EDE4DC] font-sans font-medium">
              Bespoke Bridal & Event Mehandi Artistry
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-editorial text-5xl sm:text-7xl lg:text-8xl font-normal leading-[1.04] tracking-[-0.01em] drop-shadow-md">
            {settings.headline}
          </h1>

          {/* Subtext */}
          <p className="text-base sm:text-lg text-[#EDE4DC] font-light max-w-2xl mx-auto leading-relaxed font-sans drop-shadow">
            {settings.subheadline}
          </p>

          {/* Dual Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 font-sans">
            <a
              href={createWhatsAppUrl({
                phone: settings.whatsapp_phone,
                eventType: 'Bridal Henna Inquiry',
                customNote: 'Namaste Bhuvi! I am inquiring from your website hero section. Please confirm date availability.'
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#A64B38] hover:bg-[#8A3B2A] text-[#FAF7F2] font-bold text-xs uppercase tracking-[0.18em] shadow-xl hover:scale-[1.02] transition-transform duration-300"
            >
              Check Date on WhatsApp Concierge
            </a>

            <button
              onClick={() => scrollTo('builder')}
              className="w-full sm:w-auto px-8 py-4 rounded-full border border-white/30 bg-black/30 backdrop-blur-md hover:bg-black/50 text-[#FAF7F2] text-xs uppercase tracking-[0.18em] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Custom Henna Calculator
            </button>
          </div>

          {/* Flat Lining Numerals Stats Strip */}
          <div className="pt-10 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto font-sans">
            <div>
              <span className="num-lining font-editorial text-3xl sm:text-4xl text-[#FAF7F2] font-bold block">100%</span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-[#D9CEC5] mt-0.5 block">Organic Sojat</span>
            </div>
            <div>
              <span className="num-lining font-editorial text-3xl sm:text-4xl text-[#FAF7F2] font-bold block">1,200+</span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-[#D9CEC5] mt-0.5 block">Brides Adorned</span>
            </div>
            <div>
              <span className="num-lining font-editorial text-3xl sm:text-4xl text-[#FAF7F2] font-bold block">48h</span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-[#D9CEC5] mt-0.5 block">Dark Stain Peak</span>
            </div>
            <div>
              <span className="num-lining font-editorial text-3xl sm:text-4xl text-[#FAF7F2] font-bold block">0%</span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-[#D9CEC5] mt-0.5 block">Chemicals / PPD</span>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 3. EVENT SERVICES & PACKAGES (Large Visual Cards)          */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section id="services" className="py-24 sm:py-32 bg-[#EDE4DC] border-t border-b border-[#D9CEC5]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 pb-6 border-b border-[#D9CEC5]">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#A64B38] font-sans font-bold block mb-2">
                Celebration Offerings
              </span>
              <h2 className="font-editorial text-4xl sm:text-6xl text-[#241E1A]">
                Services by Event
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mt-6 md:mt-0 font-sans text-xs uppercase tracking-[0.16em]">
              {['All', 'Bridal', 'Engagement', 'Arabic', 'Traditional', 'Baby Shower', 'Family & Guests'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveServiceTab(tab)}
                  className={`px-4 py-2 rounded-full border transition-all cursor-pointer shadow-sm ${
                    activeServiceTab === tab
                      ? 'bg-[#A64B38] text-[#FAF7F2] border-[#A64B38] font-bold'
                      : 'bg-[#F5EFEB] text-[#6E645D] border-[#D9CEC5] hover:text-[#241E1A]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Large Visual Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map(service => {
              const waUrl = createWhatsAppUrl({
                phone: settings.whatsapp_phone,
                eventType: service.event_type,
                service: service.name,
                customNote: `Hi Bhuvi! I would like to inquire about booking the "${service.name}" (${service.price_starting}) for my upcoming ${service.event_type}.`
              });

              return (
                <div
                  key={service.id}
                  className="group rounded-2xl bg-[#FFFFFF] border border-[#D9CEC5] overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all duration-400 hover:-translate-y-1 shadow-sm"
                >
                  <div>
                    {/* Visual Card Image */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-stone-900">
                      <img
                        src={service.image_url}
                        alt={service.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-75" />
                      
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-sm text-[10px] uppercase tracking-[0.18em] font-sans text-[#FAF7F2]">
                        {service.event_type}
                      </div>

                      <div className="num-lining absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-black/85 text-xs font-sans text-[#FAF7F2] font-semibold">
                        From {service.price_starting}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between text-xs font-sans text-[#6E645D]">
                        <span className="text-[#A64B38] font-semibold uppercase tracking-wider">{service.badge}</span>
                        <span className="num-lining flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {service.duration}</span>
                      </div>

                      <h3 className="font-editorial text-2xl text-[#241E1A] group-hover:text-[#A64B38] transition-colors leading-tight">
                        {service.name}
                      </h3>

                      <p className="text-xs font-sans text-[#6E645D] leading-relaxed line-clamp-3">
                        {service.description}
                      </p>

                      <ul className="space-y-1.5 pt-3 border-t border-[#D9CEC5]">
                        {(service.includes || []).slice(0, 3).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-[11px] font-sans text-[#241E1A]">
                            <span className="text-[#A64B38] mt-0.5">•</span>
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
                      className="w-full py-3 rounded-xl bg-[#EDE4DC] hover:bg-[#A64B38] text-[#241E1A] hover:text-[#FAF7F2] text-xs uppercase tracking-[0.16em] font-sans font-semibold flex items-center justify-center gap-2 transition-all duration-300"
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
      {/* 4. INTERACTIVE BESPOKE HENNA CALCULATOR / ESTIMATOR         */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section id="builder" className="py-24 sm:py-32 bg-[#F5EFEB] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-[#A64B38] font-sans font-bold block mb-2">
              Interactive Atelier Studio
            </span>
            <h2 className="font-editorial text-4xl sm:text-6xl text-[#241E1A] mb-4">
              Bespoke Henna Calculator
            </h2>
            <p className="text-sm text-[#6E645D] font-sans leading-relaxed">
              Tailor every element of your ceremony — from hand lengths to custom portraiture and guest party count. 
              Receive real-time duration and cone estimations instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Configuration Panel */}
            <div className="lg:col-span-7 bg-[#FFFFFF] p-8 sm:p-10 rounded-3xl border border-[#D9CEC5] space-y-8 shadow-lg">
              
              {/* Step 1: Hand Length */}
              <div>
                <label className="block text-xs uppercase tracking-[0.18em] text-[#A64B38] font-sans font-bold mb-3">
                  1. Bride Hand Coverage Length
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-sans">
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
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer shadow-sm ${
                        builderConfig.handLength === opt.id
                          ? 'border-[#A64B38] bg-[#EDE4DC] text-[#241E1A] font-bold'
                          : 'border-[#D9CEC5] bg-[#FFFFFF] text-[#6E645D] hover:border-[#A64B38]/50'
                      }`}
                    >
                      <p className="text-xs font-semibold">{opt.label}</p>
                      <p className="num-lining text-[10px] text-[#6E645D] mt-0.5">{opt.time}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Feet Length */}
              <div>
                <label className="block text-xs uppercase tracking-[0.18em] text-[#A64B38] font-sans font-bold mb-3">
                  2. Bride Feet & Calves Coverage
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-sans">
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
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer shadow-sm ${
                        builderConfig.feetLength === opt.id
                          ? 'border-[#A64B38] bg-[#EDE4DC] text-[#241E1A] font-bold'
                          : 'border-[#D9CEC5] bg-[#FFFFFF] text-[#6E645D] hover:border-[#A64B38]/50'
                      }`}
                    >
                      <p className="text-xs font-semibold">{opt.label}</p>
                      <p className="num-lining text-[10px] text-[#6E645D] mt-0.5">{opt.time}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Signature Storyline Elements */}
              <div>
                <label className="block text-xs uppercase tracking-[0.18em] text-[#A64B38] font-sans font-bold mb-3">
                  3. Signature Storyline Add-ons
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans">
                  <button
                    type="button"
                    onClick={() => setBuilderConfig({ ...builderConfig, hasPortrait: !builderConfig.hasPortrait })}
                    className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer shadow-sm ${
                      builderConfig.hasPortrait
                        ? 'border-[#A64B38] bg-[#EDE4DC] text-[#241E1A]'
                        : 'border-[#D9CEC5] bg-[#FFFFFF] text-[#6E645D]'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-semibold">Dulha-Dulhan Handdrawn Portrait</p>
                      <p className="num-lining text-[10px] text-[#6E645D]">Temple archway figurines (+₹1,500)</p>
                    </div>
                    <CheckCircle
                      className={`w-4 h-4 flex-shrink-0 ${builderConfig.hasPortrait ? 'text-[#A64B38]' : 'text-[#D9CEC5]'}`}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => setBuilderConfig({ ...builderConfig, hasHashtag: !builderConfig.hasHashtag })}
                    className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer shadow-sm ${
                      builderConfig.hasHashtag
                        ? 'border-[#A64B38] bg-[#EDE4DC] text-[#241E1A]'
                        : 'border-[#D9CEC5] bg-[#FFFFFF] text-[#6E645D]'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-semibold">Wedding Hashtag & Date Weaving</p>
                      <p className="num-lining text-[10px] text-[#6E645D]">Hidden monogram typography (+₹500)</p>
                    </div>
                    <CheckCircle
                      className={`w-4 h-4 flex-shrink-0 ${builderConfig.hasHashtag ? 'text-[#A64B38]' : 'text-[#D9CEC5]'}`}
                    />
                  </button>
                </div>
              </div>

              {/* Step 4: Guest / Bridesmaid Count Slider */}
              <div>
                <div className="flex justify-between items-center mb-2 font-sans">
                  <label className="text-xs uppercase tracking-[0.18em] text-[#A64B38] font-bold">
                    4. Bridesmaids & Family Guests ({builderConfig.guestCount} Guests)
                  </label>
                  <span className="num-lining text-xs font-semibold text-[#241E1A]">~₹{builderConfig.guestCount * 400}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="5"
                  value={builderConfig.guestCount}
                  onChange={(e) => setBuilderConfig({ ...builderConfig, guestCount: parseInt(e.target.value) })}
                  className="w-full accent-[#A64B38] h-2 rounded-lg cursor-pointer bg-[#EDE4DC]"
                />
                <div className="num-lining flex justify-between text-[10px] text-[#6E645D] font-sans mt-1">
                  <span>Bride only (0)</span>
                  <span>Intimate (15)</span>
                  <span>Grand Sangeet (50+)</span>
                </div>
              </div>

            </div>

            {/* Right Live Estimate Summary Card */}
            <div className="lg:col-span-5 rounded-3xl bg-[#FFFFFF] p-8 sm:p-10 border border-[#D9CEC5] shadow-2xl relative">
              <div className="space-y-6">
                
                <div className="flex items-center justify-between border-b border-[#D9CEC5] pb-4">
                  <span className="text-xs uppercase tracking-[0.18em] text-[#A64B38] font-sans font-bold">
                    Quotation Estimate
                  </span>
                  <span className="text-[11px] px-3 py-1 rounded-full bg-[#EDE4DC] text-[#A64B38] font-sans font-semibold">
                    Bespoke Atelier
                  </span>
                </div>

                <div>
                  <span className="text-xs uppercase tracking-wider text-[#6E645D] font-sans block">Estimated Investment</span>
                  <span className="num-lining font-editorial text-4xl sm:text-5xl text-[#241E1A] block mt-1 font-bold">
                    ₹{calculation.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] text-[#6E645D] font-sans">*Includes organic cones, sealant spray & travel consult</span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#D9CEC5] font-sans">
                  <div className="p-3.5 rounded-xl bg-[#EDE4DC] border border-[#D9CEC5]">
                    <span className="text-[10px] uppercase tracking-wider text-[#6E645D] block">Application Time</span>
                    <span className="num-lining text-sm font-semibold text-[#241E1A] mt-0.5 block flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#A64B38]" />
                      ~{calculation.hours} Hours
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#EDE4DC] border border-[#D9CEC5]">
                    <span className="text-[10px] uppercase tracking-wider text-[#6E645D] block">Organic Cones</span>
                    <span className="num-lining text-sm font-semibold text-[#241E1A] mt-0.5 block flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#A64B38]" />
                      {calculation.conesCount} Cones Fresh
                    </span>
                  </div>
                </div>

                {/* Direct WhatsApp Quote Button */}
                <div className="pt-4">
                  <a
                    href={createWhatsAppUrl({
                      phone: settings.whatsapp_phone,
                      eventType: 'Custom Henna Package Quote',
                      customNote: `Hi Bhuvi! I used your Bespoke Henna Calculator on the website:\n- Hand Length: ${builderConfig.handLength}\n- Feet Length: ${builderConfig.feetLength}\n- Portrait: ${builderConfig.hasPortrait ? 'Yes' : 'No'}\n- Hashtag: ${builderConfig.hasHashtag ? 'Yes' : 'No'}\n- Guests: ${builderConfig.guestCount}\n- Est. Investment: ₹${calculation.price.toLocaleString('en-IN')}\n\nPlease confirm date availability!`
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 rounded-full bg-[#A64B38] hover:bg-[#8A3B2A] text-[#FAF7F2] font-bold text-xs uppercase tracking-[0.18em] font-sans text-center flex items-center justify-center gap-2 shadow-lg hover:scale-[1.01] transition-all"
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
      {/* 5. PORTFOLIO ARCHIVE GALLERY (Dynamic Supabase Sync)        */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section id="portfolio" className="py-24 sm:py-32 bg-[#EDE4DC] border-t border-b border-[#D9CEC5]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-[#D9CEC5]">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#A64B38] font-sans font-bold block mb-2">
                Curated Works
              </span>
              <h2 className="font-editorial text-4xl sm:text-6xl text-[#241E1A]">
                Atelier Archive
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 font-sans text-xs uppercase tracking-[0.16em] mt-6 md:mt-0">
              {['all', 'bridal', 'arabic', 'rajasthani', 'feet', 'engagement', 'minimalist'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveGalleryTab(cat)}
                  className={`px-4 py-2 rounded-full border transition-all cursor-pointer shadow-sm ${
                    activeGalleryTab === cat
                      ? 'bg-[#A64B38] text-[#FAF7F2] border-[#A64B38] font-bold'
                      : 'bg-[#F5EFEB] text-[#6E645D] border-[#D9CEC5] hover:text-[#241E1A]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Designs */}
          {loadingData ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-[3/4] rounded-2xl bg-[#FFFFFF] animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredDesigns.map(design => (
                <div
                  key={design.id}
                  onClick={() => setSelectedDesign(design)}
                  className="group relative rounded-2xl overflow-hidden border border-[#D9CEC5] bg-[#FFFFFF] cursor-pointer hover:shadow-xl transition-all duration-400 hover:-translate-y-1 shadow-sm"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-stone-900">
                    <img
                      src={design.image_url}
                      alt={design.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-sm text-[9px] uppercase tracking-[0.18em] font-sans text-amber-200">
                      {design.tag || design.category}
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-[#FAF7F2]">
                      <h4 className="font-editorial text-lg truncate">
                        {design.title}
                      </h4>
                      <p className="num-lining text-[11px] font-sans text-[#EDE4DC] mt-0.5">
                        {design.price_range || 'Custom Quote'}
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
      {/* 6. THE 48-HOUR STAIN OXIDATION TIMELINE                     */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section id="stain" className="py-24 sm:py-32 bg-[#F5EFEB] relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-[#A64B38] font-sans font-bold block mb-2">
              The Chemistry of Organic Henna
            </span>
            <h2 className="font-editorial text-4xl sm:text-6xl text-[#241E1A] mb-4">
              The Stain Oxidation Journey
            </h2>
            <p className="text-sm text-[#6E645D] font-sans leading-relaxed">
              Pure Sojat henna contains natural lawsone molecules that react gently with air and body heat over 48 hours to create our signature deep mahogany stain.
            </p>
          </div>

          {/* Stepper Control */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10 font-sans">
            {STAIN_STAGES.map((st, idx) => (
              <button
                key={idx}
                onClick={() => setStainStage(idx)}
                className={`p-4 rounded-2xl border transition-all text-center cursor-pointer shadow-sm ${
                  stainStage === idx
                    ? 'border-[#A64B38] bg-[#FFFFFF] shadow-md'
                    : 'border-[#D9CEC5] bg-[#EDE4DC] text-[#6E645D] hover:border-[#A64B38]/50'
                }`}
              >
                <div
                  className="w-6 h-6 rounded-full mx-auto mb-2 border border-black/20 shadow-inner"
                  style={{ backgroundColor: st.colorHex }}
                />
                <p className="num-lining text-xs font-semibold text-[#241E1A]">{st.hours}</p>
                <p className="text-[10px] text-[#A64B38] mt-0.5 font-medium">{st.badge}</p>
              </button>
            ))}
          </div>

          {/* Active Stage Showcase Card */}
          <div className="rounded-3xl border border-[#D9CEC5] bg-[#FFFFFF] p-8 sm:p-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center shadow-lg">
            <div className="md:col-span-4 flex flex-col items-center text-center p-6 rounded-2xl bg-[#EDE4DC] border border-[#D9CEC5]">
              <div
                className="w-24 h-24 rounded-full border-4 border-[#A64B38]/30 shadow-2xl mb-4"
                style={{ backgroundColor: STAIN_STAGES[stainStage].colorHex }}
              />
              <span className="font-editorial text-2xl text-[#241E1A]">{STAIN_STAGES[stainStage].title}</span>
              <span className="text-xs text-[#A64B38] font-sans font-semibold mt-1">{STAIN_STAGES[stainStage].badge}</span>
            </div>

            <div className="md:col-span-8 space-y-4">
              <h3 className="font-editorial text-3xl text-[#241E1A]">
                {STAIN_STAGES[stainStage].title}
              </h3>
              <p className="text-sm text-[#6E645D] font-sans leading-relaxed">
                {STAIN_STAGES[stainStage].description}
              </p>

              <div className="p-4 rounded-xl bg-[#EDE4DC] border border-[#D9CEC5]">
                <p className="text-xs font-semibold text-[#A64B38] uppercase tracking-wider font-sans mb-1 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" />
                  Atelier Aftercare Ritual
                </p>
                <p className="text-xs text-[#241E1A] font-sans leading-relaxed">
                  {STAIN_STAGES[stainStage].aftercareTip}
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 7. REAL BRIDE REVIEWS (With User-Only Edit / Delete)        */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section id="reviews" className="py-24 sm:py-32 bg-[#EDE4DC] border-t border-b border-[#D9CEC5]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 pb-6 border-b border-[#D9CEC5]">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#A64B38] font-sans font-bold block mb-2">
                Client Testimonials
              </span>
              <h2 className="font-editorial text-4xl sm:text-6xl text-[#241E1A]">
                Words from Real Brides
              </h2>
            </div>

            {/* "+ Write a Review" Button */}
            <div className="mt-6 md:mt-0 font-sans">
              <button
                onClick={() => {
                  setEditingReviewId(null);
                  setReviewForm({ client_name: '', rating: 5, event_type: 'Bridal Mehandi', location: '', comment: '' });
                  setReviewModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#A64B38] hover:bg-[#8A3B2A] text-[#FAF7F2] text-xs font-bold uppercase tracking-wider shadow-md cursor-pointer transition-all hover:scale-[1.02]"
              >
                <Plus className="w-4 h-4" />
                <span>Write a Bride Review</span>
              </button>
            </div>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.map(rev => {
              const isOwner = rev.author_token === authorToken;

              return (
                <div
                  key={rev.id}
                  className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#D9CEC5] flex flex-col justify-between space-y-4 shadow-sm relative group"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(i => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i <= rev.rating ? 'fill-amber-500 text-amber-500' : 'text-stone-300'}`}
                          />
                        ))}
                      </div>

                      {/* Author Edit/Delete Controls (Only visible to review creator) */}
                      {isOwner && (
                        <div className="flex items-center gap-1.5 opacity-90">
                          <button
                            onClick={() => handleOpenEditReview(rev)}
                            className="p-1 text-stone-500 hover:text-[#A64B38] cursor-pointer"
                            title="Edit your review"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteReview(rev.id, false)}
                            className="p-1 text-stone-500 hover:text-red-600 cursor-pointer"
                            title="Delete your review"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    <p className="text-xs font-sans text-[#6E645D] leading-relaxed italic">
                      "{rev.comment}"
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#D9CEC5]">
                    <div className="flex justify-between items-baseline">
                      <p className="font-editorial text-lg text-[#241E1A] font-bold">{rev.client_name}</p>
                      {isOwner && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-sans font-semibold">
                          Your Review
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-[#A64B38] font-sans font-semibold mt-0.5">
                      {rev.event_type} • {rev.location}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 8. VIP DATE RESERVATION & INQUIRY FORM                      */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section id="inquire" className="py-24 sm:py-32 bg-[#F5EFEB]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Left Info */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs uppercase tracking-[0.25em] text-[#A64B38] font-sans font-bold block">
                Direct Booking
              </span>
              <h2 className="font-editorial text-4xl sm:text-6xl text-[#241E1A]">
                Reserve Your Date
              </h2>
              <p className="text-sm text-[#6E645D] font-sans leading-relaxed">
                Due to the intimate, hand-sketched nature of our bridal work, we accept a limited number of weddings per season.
                Submit your celebration details below for immediate confirmation and custom quote.
              </p>

              <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#D9CEC5] space-y-3 font-sans text-xs shadow-sm">
                <div>
                  <span className="text-[#6E645D] uppercase tracking-wider block text-[10px]">Instant WhatsApp Line</span>
                  <span className="num-lining text-sm font-semibold text-[#A64B38]">+{settings.whatsapp_phone}</span>
                </div>
                <div>
                  <span className="text-[#6E645D] uppercase tracking-wider block text-[10px]">Studio Location</span>
                  <span className="text-sm text-[#241E1A]">{settings.studio_location}</span>
                </div>
              </div>
            </div>

            {/* Right Form */}
            <div className="lg:col-span-7 bg-[#FFFFFF] p-8 sm:p-12 rounded-3xl border border-[#D9CEC5] shadow-xl">
              {formSuccess ? (
                <div className="py-12 text-center space-y-4 font-sans">
                  <CheckCircle className="w-12 h-12 text-[#A64B38] mx-auto" />
                  <h3 className="font-editorial text-3xl text-[#241E1A]">Inquiry Received</h3>
                  <p className="text-xs text-[#6E645D] max-w-sm mx-auto">
                    Your date inquiry has been registered in the Atelier database. A WhatsApp chat has also opened to finalize your booking directly.
                  </p>
                  <button
                    onClick={() => setFormSuccess(false)}
                    className="text-xs uppercase tracking-widest text-[#A64B38] border-b border-[#A64B38] pb-1 cursor-pointer font-semibold"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-6 font-sans">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#6E645D] mb-1.5 font-semibold">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Radhika Shah"
                        className="w-full px-4 py-3 rounded-xl bg-[#F5EFEB] border border-[#D9CEC5] text-sm text-[#241E1A] outline-none focus:border-[#A64B38]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#6E645D] mb-1.5 font-semibold">Phone / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="num-lining w-full px-4 py-3 rounded-xl bg-[#F5EFEB] border border-[#D9CEC5] text-sm text-[#241E1A] outline-none focus:border-[#A64B38]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#6E645D] mb-1.5 font-semibold">Event Date *</label>
                      <input
                        type="date"
                        required
                        value={formData.eventDate}
                        onChange={e => setFormData({ ...formData, eventDate: e.target.value })}
                        className="num-lining w-full px-4 py-3 rounded-xl bg-[#F5EFEB] border border-[#D9CEC5] text-sm text-[#241E1A] outline-none focus:border-[#A64B38]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#6E645D] mb-1.5 font-semibold">Event Type</label>
                      <select
                        value={formData.eventType}
                        onChange={e => setFormData({ ...formData, eventType: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#F5EFEB] border border-[#D9CEC5] text-sm text-[#241E1A] outline-none cursor-pointer focus:border-[#A64B38]"
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
                    <label className="block text-[10px] uppercase tracking-wider text-[#6E645D] mb-1.5 font-semibold">City & Venue Location</label>
                    <input
                      type="text"
                      value={formData.cityVenue}
                      onChange={e => setFormData({ ...formData, cityVenue: e.target.value })}
                      placeholder="e.g. Grand Hyatt / The Leela Palace"
                      className="w-full px-4 py-3 rounded-xl bg-[#F5EFEB] border border-[#D9CEC5] text-sm text-[#241E1A] outline-none focus:border-[#A64B38]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#6E645D] mb-1.5 font-semibold">Special Requests or Design Vision</label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Share lehenga shades, customized story moments or guest count..."
                      className="w-full px-4 py-3 rounded-xl bg-[#F5EFEB] border border-[#D9CEC5] text-sm text-[#241E1A] outline-none resize-none focus:border-[#A64B38]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="w-full py-4 rounded-full bg-[#A64B38] hover:bg-[#8A3B2A] text-[#FAF7F2] font-bold text-xs uppercase tracking-[0.18em] transition-all disabled:opacity-50 cursor-pointer shadow-lg hover:scale-[1.01]"
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
      {/* 9. LIGHTBOX PREVIEW MODAL                                   */}
      {/* ─────────────────────────────────────────────────────────── */}
      {selectedDesign && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
          onClick={() => setSelectedDesign(null)}
        >
          <div
            className="bg-[#FFFFFF] border border-[#D9CEC5] rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="md:w-1/2 aspect-square md:aspect-auto bg-stone-900">
              <img
                src={selectedDesign.image_url}
                alt={selectedDesign.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="md:w-1/2 p-8 flex flex-col justify-between overflow-y-auto font-sans">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] uppercase tracking-[0.18em] px-3 py-1 rounded-full bg-[#EDE4DC] text-[#A64B38] font-semibold">
                    {selectedDesign.category}
                  </span>
                  <button
                    onClick={() => setSelectedDesign(null)}
                    className="text-xs uppercase tracking-widest text-[#6E645D] hover:text-[#241E1A] cursor-pointer"
                  >
                    Close [×]
                  </button>
                </div>

                <h3 className="font-editorial text-3xl text-[#241E1A]">
                  {selectedDesign.title}
                </h3>

                <p className="text-xs font-sans text-[#6E645D] leading-relaxed">
                  {selectedDesign.description || 'Intricate bespoke henna composition handcrafted by Bhuvi.'}
                </p>

                {selectedDesign.price_range && (
                  <div className="pt-2">
                    <span className="text-[10px] uppercase tracking-wider text-[#6E645D] block">Investment</span>
                    <span className="num-lining font-editorial text-2xl text-[#241E1A] font-bold">{selectedDesign.price_range}</span>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-[#D9CEC5]">
                <a
                  href={createWhatsAppUrl({
                    phone: settings.whatsapp_phone,
                    eventType: 'Archive Design Inquiry',
                    designCode: selectedDesign.title,
                    customNote: `Hi Bhuvi! I love the "${selectedDesign.title}" design from your portfolio archive. Can you share availability for this style?`
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-full bg-[#A64B38] hover:bg-[#8A3B2A] text-[#FAF7F2] font-bold text-xs uppercase tracking-[0.18em] text-center inline-block shadow-md"
                >
                  Book This Design on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 10. WRITE / EDIT REVIEW MODAL                               */}
      {/* ─────────────────────────────────────────────────────────── */}
      {reviewModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
          onClick={() => setReviewModalOpen(false)}
        >
          <div
            className="bg-[#FFFFFF] border border-[#D9CEC5] rounded-3xl max-w-lg w-full p-8 font-sans shadow-2xl space-y-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-3 border-b border-[#D9CEC5]">
              <h3 className="font-editorial text-2xl text-[#241E1A]">
                {editingReviewId ? 'Edit Your Bride Review' : 'Share Your Bride Experience'}
              </h3>
              <button
                onClick={() => setReviewModalOpen(false)}
                className="text-xs uppercase tracking-widest text-[#6E645D] hover:text-[#241E1A] cursor-pointer"
              >
                Close [×]
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#6E645D] mb-1 font-semibold">Your Name *</label>
                <input
                  type="text"
                  required
                  value={reviewForm.client_name}
                  onChange={e => setReviewForm({ ...reviewForm, client_name: e.target.value })}
                  placeholder="e.g. Radhika Patel"
                  className="w-full p-2.5 rounded-lg bg-[#F5EFEB] border border-[#D9CEC5] text-[#241E1A] text-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#6E645D] mb-1 font-semibold">Rating (1 to 5 Stars)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${star <= reviewForm.rating ? 'fill-amber-500 text-amber-500' : 'text-stone-300'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#6E645D] mb-1 font-semibold">Event Type</label>
                  <input
                    type="text"
                    value={reviewForm.event_type}
                    onChange={e => setReviewForm({ ...reviewForm, event_type: e.target.value })}
                    placeholder="e.g. Bridal Mehandi"
                    className="w-full p-2.5 rounded-lg bg-[#F5EFEB] border border-[#D9CEC5] text-[#241E1A]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#6E645D] mb-1 font-semibold">City / Venue</label>
                  <input
                    type="text"
                    value={reviewForm.location}
                    onChange={e => setReviewForm({ ...reviewForm, location: e.target.value })}
                    placeholder="e.g. The Leela, Gandhinagar"
                    className="w-full p-2.5 rounded-lg bg-[#F5EFEB] border border-[#D9CEC5] text-[#241E1A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#6E645D] mb-1 font-semibold">Your Review / Feedback *</label>
                <textarea
                  rows={4}
                  required
                  value={reviewForm.comment}
                  onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="Share how the design looked, stain darkness, and overall experience..."
                  className="w-full p-2.5 rounded-lg bg-[#F5EFEB] border border-[#D9CEC5] text-[#241E1A] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="w-full py-3 rounded-full bg-[#A64B38] hover:bg-[#8A3B2A] text-[#FAF7F2] font-bold text-xs uppercase tracking-widest shadow-md cursor-pointer disabled:opacity-50"
              >
                {submittingReview ? 'Saving...' : (editingReviewId ? 'Update My Review' : 'Publish Review')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 11. ADMIN PIN UNLOCK MODAL                                  */}
      {/* ─────────────────────────────────────────────────────────── */}
      {pinModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
          onClick={() => setPinModalOpen(false)}
        >
          <div
            className="bg-[#FFFFFF] border border-[#D9CEC5] rounded-3xl max-w-sm w-full p-8 font-sans shadow-2xl text-center space-y-5"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-[#EDE4DC] flex items-center justify-center mx-auto text-[#A64B38]">
              <Lock className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-editorial text-2xl text-[#241E1A]">Studio Admin Access</h3>
              <p className="text-xs text-[#6E645D] mt-1">Enter your 4-digit Studio Passcode (Default: 1234)</p>
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-4">
              <input
                type="password"
                maxLength={6}
                autoFocus
                value={enteredPin}
                onChange={e => setEnteredPin(e.target.value)}
                placeholder="• • • •"
                className="num-lining w-full text-center tracking-[0.5em] text-2xl p-3 rounded-xl bg-[#F5EFEB] border border-[#D9CEC5] text-[#241E1A] outline-none focus:border-[#A64B38]"
              />

              {pinError && (
                <p className="text-xs text-red-600 font-semibold">Incorrect Passcode. Try 1234</p>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPinModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-full border border-[#D9CEC5] text-xs font-semibold text-[#6E645D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-full bg-[#A64B38] text-[#FAF7F2] text-xs font-bold uppercase tracking-wider"
                >
                  Unlock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 12. NON-TECHNICAL STUDIO ADMIN DRAWER                       */}
      {/* ─────────────────────────────────────────────────────────── */}
      {adminOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end"
          onClick={() => setAdminOpen(false)}
        >
          <div
            className="bg-[#FFFFFF] border-l border-[#D9CEC5] w-full max-w-2xl h-full p-6 sm:p-8 overflow-y-auto font-sans flex flex-col justify-between"
            onClick={e => e.stopPropagation()}
          >
            <div>
              {/* Drawer Top Bar */}
              <div className="flex justify-between items-center pb-4 border-b border-[#D9CEC5] mb-6">
                <div>
                  <h3 className="font-editorial text-3xl text-[#241E1A]">Studio Control Dashboard</h3>
                  <span className="text-[10px] uppercase tracking-widest text-[#A64B38] font-bold">
                    Easy Content & Booking Management
                  </span>
                </div>
                <button
                  onClick={() => setAdminOpen(false)}
                  className="text-xs uppercase tracking-widest text-[#6E645D] hover:text-[#241E1A] cursor-pointer"
                >
                  Close [×]
                </button>
              </div>

              {/* Navigation Tabs in Admin */}
              <div className="flex flex-wrap gap-2 mb-6 border-b border-[#D9CEC5] pb-3 text-xs uppercase tracking-wider font-semibold">
                {[
                  { id: 'settings', label: 'Site & Hero', icon: Settings },
                  { id: 'services', label: 'Services', icon: Image },
                  { id: 'designs', label: 'Portfolio', icon: Sparkles },
                  { id: 'reviews', label: 'Reviews', icon: Star },
                  { id: 'inquiries', label: `Bookings (${inquiries.length})`, icon: Calendar },
                  { id: 'supabase', label: 'Database', icon: Database }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setAdminTab(tab.id)}
                    className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer ${
                      adminTab === tab.id
                        ? 'bg-[#A64B38] text-[#FAF7F2]'
                        : 'bg-[#EDE4DC] text-[#6E645D] hover:text-[#241E1A]'
                    }`}
                  >
                    <tab.icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* ── TAB 1: HERO & SITE SETTINGS ── */}
              {adminTab === 'settings' && (
                <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                  <div className="p-4 rounded-xl bg-[#EDE4DC] space-y-3">
                    <h4 className="font-bold text-sm text-[#241E1A]">Hero Background Image & Headings</h4>
                    
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#6E645D] mb-1">Hero Image URL</label>
                      <input
                        type="url"
                        value={editSettingsForm.hero_image_url}
                        onChange={e => setEditSettingsForm({ ...editSettingsForm, hero_image_url: e.target.value })}
                        className="w-full p-2.5 rounded-lg bg-[#FFFFFF] border border-[#D9CEC5]"
                      />
                      {editSettingsForm.hero_image_url && (
                        <div className="mt-2 h-28 rounded-lg overflow-hidden border border-[#D9CEC5]">
                          <img src={editSettingsForm.hero_image_url} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#6E645D] mb-1">Main Headline</label>
                      <input
                        type="text"
                        value={editSettingsForm.headline}
                        onChange={e => setEditSettingsForm({ ...editSettingsForm, headline: e.target.value })}
                        className="w-full p-2.5 rounded-lg bg-[#FFFFFF] border border-[#D9CEC5]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#6E645D] mb-1">Subheadline</label>
                      <textarea
                        rows={2}
                        value={editSettingsForm.subheadline}
                        onChange={e => setEditSettingsForm({ ...editSettingsForm, subheadline: e.target.value })}
                        className="w-full p-2.5 rounded-lg bg-[#FFFFFF] border border-[#D9CEC5]"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#EDE4DC] space-y-3">
                    <h4 className="font-bold text-sm text-[#241E1A]">Business Contact & Security</h4>
                    
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#6E645D] mb-1">WhatsApp Phone Number</label>
                      <input
                        type="text"
                        value={editSettingsForm.whatsapp_phone}
                        onChange={e => setEditSettingsForm({ ...editSettingsForm, whatsapp_phone: e.target.value })}
                        className="num-lining w-full p-2.5 rounded-lg bg-[#FFFFFF] border border-[#D9CEC5]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#6E645D] mb-1">Studio Location</label>
                      <input
                        type="text"
                        value={editSettingsForm.studio_location}
                        onChange={e => setEditSettingsForm({ ...editSettingsForm, studio_location: e.target.value })}
                        className="w-full p-2.5 rounded-lg bg-[#FFFFFF] border border-[#D9CEC5]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#6E645D] mb-1">Admin Passcode / PIN</label>
                      <input
                        type="text"
                        value={editSettingsForm.admin_pin}
                        onChange={e => setEditSettingsForm({ ...editSettingsForm, admin_pin: e.target.value })}
                        className="num-lining w-full p-2.5 rounded-lg bg-[#FFFFFF] border border-[#D9CEC5]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-full bg-[#A64B38] text-[#FAF7F2] font-bold text-xs uppercase tracking-wider cursor-pointer shadow-md hover:bg-[#8A3B2A]"
                  >
                    Save All Settings to Supabase
                  </button>
                </form>
              )}

              {/* ── TAB 2: SERVICES MANAGER ── */}
              {adminTab === 'services' && (
                <div className="space-y-6 text-xs">
                  <div className="p-4 rounded-xl bg-[#EDE4DC] space-y-3">
                    <h4 className="font-bold text-sm text-[#241E1A]">Add New Celebration Package</h4>
                    <form onSubmit={handleCreateService} className="space-y-3">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-[#6E645D] mb-1">Service Name *</label>
                        <input
                          type="text"
                          required
                          value={newServiceForm.name}
                          onChange={e => setNewServiceForm({ ...newServiceForm, name: e.target.value })}
                          placeholder="e.g. Royal Destination Bridal"
                          className="w-full p-2 rounded bg-[#FFFFFF] border border-[#D9CEC5]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-[#6E645D] mb-1">Category</label>
                          <select
                            value={newServiceForm.category}
                            onChange={e => setNewServiceForm({ ...newServiceForm, category: e.target.value })}
                            className="w-full p-2 rounded bg-[#FFFFFF] border border-[#D9CEC5]"
                          >
                            <option>Bridal</option>
                            <option>Engagement</option>
                            <option>Arabic</option>
                            <option>Traditional</option>
                            <option>Baby Shower</option>
                            <option>Family & Guests</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-bold text-[#6E645D] mb-1">Starting Price</label>
                          <input
                            type="text"
                            value={newServiceForm.price_starting}
                            onChange={e => setNewServiceForm({ ...newServiceForm, price_starting: e.target.value })}
                            className="w-full p-2 rounded bg-[#FFFFFF] border border-[#D9CEC5]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-[#6E645D] mb-1">Cover Image URL</label>
                        <input
                          type="url"
                          required
                          value={newServiceForm.image_url}
                          onChange={e => setNewServiceForm({ ...newServiceForm, image_url: e.target.value })}
                          className="w-full p-2 rounded bg-[#FFFFFF] border border-[#D9CEC5]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-[#6E645D] mb-1">Inclusions (Comma Separated)</label>
                        <input
                          type="text"
                          value={newServiceForm.includes}
                          onChange={e => setNewServiceForm({ ...newServiceForm, includes: e.target.value })}
                          className="w-full p-2 rounded bg-[#FFFFFF] border border-[#D9CEC5]"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-full bg-[#A64B38] text-[#FAF7F2] font-bold uppercase tracking-wider"
                      >
                        Add Service to Website
                      </button>
                    </form>
                  </div>

                  {/* Existing Services List */}
                  <div>
                    <h4 className="font-bold text-sm text-[#241E1A] mb-3">Live Services ({services.length})</h4>
                    <div className="space-y-2">
                      {services.map(s => (
                        <div key={s.id} className="p-3 rounded-lg bg-[#EDE4DC] flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img src={s.image_url} alt={s.name} className="w-10 h-10 rounded object-cover" />
                            <div>
                              <p className="font-bold text-[#241E1A]">{s.name}</p>
                              <p className="text-[10px] text-[#6E645D]">{s.price_starting} • {s.duration}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteService(s.id)}
                            className="p-1.5 text-red-600 hover:bg-red-100 rounded cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── TAB 3: PORTFOLIO DESIGNS ── */}
              {adminTab === 'designs' && (
                <div className="space-y-6 text-xs">
                  <form onSubmit={handleCreateDesign} className="p-4 rounded-xl bg-[#EDE4DC] space-y-3">
                    <h4 className="font-bold text-sm text-[#241E1A]">Upload Design to Portfolio</h4>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#6E645D] mb-1">Title</label>
                      <input
                        type="text"
                        required
                        value={newDesignForm.title}
                        onChange={e => setNewDesignForm({ ...newDesignForm, title: e.target.value })}
                        className="w-full p-2 rounded bg-[#FFFFFF] border border-[#D9CEC5]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-[#6E645D] mb-1">Category</label>
                        <select
                          value={newDesignForm.category}
                          onChange={e => setNewDesignForm({ ...newDesignForm, category: e.target.value })}
                          className="w-full p-2 rounded bg-[#FFFFFF] border border-[#D9CEC5]"
                        >
                          <option value="bridal">Bridal</option>
                          <option value="arabic">Arabic</option>
                          <option value="rajasthani">Rajasthani</option>
                          <option value="feet">Feet Art</option>
                          <option value="minimalist">Minimalist</option>
                          <option value="engagement">Engagement</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-[#6E645D] mb-1">Price Range</label>
                        <input
                          type="text"
                          value={newDesignForm.priceRange}
                          onChange={e => setNewDesignForm({ ...newDesignForm, priceRange: e.target.value })}
                          className="w-full p-2 rounded bg-[#FFFFFF] border border-[#D9CEC5]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#6E645D] mb-1">Image URL</label>
                      <input
                        type="url"
                        required
                        value={newDesignForm.imageUrl}
                        onChange={e => setNewDesignForm({ ...newDesignForm, imageUrl: e.target.value })}
                        className="w-full p-2 rounded bg-[#FFFFFF] border border-[#D9CEC5]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-full bg-[#A64B38] text-[#FAF7F2] font-bold uppercase tracking-wider"
                    >
                      Add Photo to Gallery
                    </button>
                  </form>

                  <div>
                    <h4 className="font-bold text-sm text-[#241E1A] mb-3">Live Designs ({designs.length})</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {designs.map(d => (
                        <div key={d.id} className="relative rounded-lg overflow-hidden border border-[#D9CEC5] bg-[#EDE4DC]">
                          <img src={d.image_url} alt={d.title} className="w-full h-24 object-cover" />
                          <div className="p-2 flex justify-between items-center">
                            <p className="font-bold truncate text-[11px]">{d.title}</p>
                            <button
                              onClick={() => handleDeleteDesign(d.id)}
                              className="text-red-600 p-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── TAB 4: REVIEWS MODERATION ── */}
              {adminTab === 'reviews' && (
                <div className="space-y-4 text-xs">
                  <h4 className="font-bold text-sm text-[#241E1A]">All Bride Reviews ({reviews.length})</h4>
                  <div className="space-y-3">
                    {reviews.map(r => (
                      <div key={r.id} className="p-4 rounded-xl bg-[#EDE4DC] space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-sm text-[#241E1A]">{r.client_name} ({r.rating}★)</span>
                          <button
                            onClick={() => handleDeleteReview(r.id, true)}
                            className="text-red-600 text-[10px] font-bold hover:underline cursor-pointer"
                          >
                            Delete Review
                          </button>
                        </div>
                        <p className="text-[11px] text-[#6E645D]">"{r.comment}"</p>
                        <p className="text-[10px] text-[#A64B38] font-bold">{r.event_type} • {r.location}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── TAB 5: INQUIRIES & BOOKINGS ── */}
              {adminTab === 'inquiries' && (
                <div className="space-y-4 text-xs">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-sm text-[#241E1A]">Incoming Client Inquiries ({inquiries.length})</h4>
                    <button onClick={loadAdminInquiries} className="text-[#A64B38] flex items-center gap-1 cursor-pointer font-bold">
                      <RefreshCw className="w-3.5 h-3.5" /> Refresh
                    </button>
                  </div>

                  {inquiries.length === 0 ? (
                    <p className="text-[#6E645D] italic">No inquiries received yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {inquiries.map(inq => (
                        <div key={inq.id} className="p-4 rounded-xl bg-[#EDE4DC] border border-[#D9CEC5] space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-sm text-[#241E1A]">{inq.name}</span>
                            <span className="px-2 py-0.5 rounded-full bg-[#FFFFFF] text-[9px] uppercase tracking-wider font-bold text-[#A64B38]">
                              {inq.status || 'New'}
                            </span>
                          </div>

                          <p className="num-lining text-[#6E645D]">
                            📞 {inq.phone} • 📅 {inq.event_date} • {inq.event_type}
                          </p>
                          {inq.city_venue && <p className="text-[#241E1A]">📍 {inq.city_venue}</p>}
                          {inq.message && <p className="text-[#6E645D] italic">"{inq.message}"</p>}

                          <div className="pt-2 flex items-center justify-between border-t border-[#D9CEC5]">
                            <a
                              href={`https://wa.me/${inq.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${inq.name}! Thank you for inquiring with Bhuvi Mehandi Atelier for your ${inq.event_type}.`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 rounded-lg bg-[#25d366] text-white text-[10px] font-bold flex items-center gap-1"
                            >
                              <Phone className="w-3 h-3" />
                              <span>WhatsApp Reply</span>
                            </a>

                            <div className="flex items-center gap-2">
                              <select
                                value={inq.status || 'New'}
                                onChange={e => handleInquiryStatus(inq.id, e.target.value)}
                                className="p-1 rounded bg-[#FFFFFF] border border-[#D9CEC5] text-[10px]"
                              >
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Completed">Completed</option>
                              </select>
                              <button
                                onClick={() => handleDeleteInquiry(inq.id)}
                                className="text-red-600 p-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── TAB 6: DATABASE & CLOUD STATUS ── */}
              {adminTab === 'supabase' && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-xl bg-[#EDE4DC] space-y-2">
                    <span className="font-bold text-sm text-[#241E1A] block">Supabase Connection</span>
                    <p className="text-[#6E645D]">
                      {dbStatus?.connected
                        ? (dbStatus.hasTables ? '🟢 Connected to live Supabase cloud database' : '🟡 Connected (run supabase-schema.sql for cloud tables)')
                        : '⚪ Local Storage Fallback Mode Active'}
                    </p>
                    <p className="text-[9px] font-mono text-[#6E645D]">{SUPABASE_URL}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#EDE4DC] space-y-2">
                    <span className="font-bold text-sm text-[#241E1A] block">Database Setup Instructions</span>
                    <p className="text-[#6E645D] leading-relaxed">
                      To create all tables in your own Supabase project:
                    </p>
                    <ol className="list-decimal pl-4 space-y-1 text-[#6E645D]">
                      <li>Open your Supabase project dashboard at <a href="https://supabase.com" target="_blank" rel="noreferrer" className="underline font-bold">supabase.com</a>.</li>
                      <li>Go to <strong>SQL Editor</strong> on the left sidebar.</li>
                      <li>Copy the contents of <code className="bg-[#FFFFFF] px-1 rounded font-mono">supabase-schema.sql</code> and click <strong>Run</strong>.</li>
                    </ol>
                  </div>
                </div>
              )}

            </div>

            <div className="pt-6 border-t border-[#D9CEC5] text-[10px] text-[#6E645D] text-center font-sans">
              BHUVI MEHANDI ATELIER • STUDIO CLOUD
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 13. LUXURY FOOTER                                           */}
      {/* ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-[#D9CEC5] bg-[#F5EFEB] py-16 font-sans">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[#6E645D]">
          <div>
            <span className="font-editorial text-2xl text-[#241E1A] tracking-widest block font-bold">
              BHUVI MEHANDI
            </span>
            <p className="text-[11px] mt-1">
              © {new Date().getFullYear()} Bhuvi Mehandi Atelier. Pure Organic Sojat Artistry.
            </p>
          </div>

          <div className="flex items-center space-x-6 tracking-[0.15em] uppercase text-[11px]">
            <a
              href={createWhatsAppUrl({ phone: settings.whatsapp_phone, customNote: 'General inquiry for Bhuvi Mehandi.' })}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#241E1A] transition-colors"
            >
              WhatsApp
            </a>
            <button
              onClick={() => setPinModalOpen(true)}
              className="text-[#A64B38] font-bold cursor-pointer hover:underline flex items-center gap-1"
            >
              <Lock className="w-3 h-3" />
              <span>Studio Access</span>
            </button>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-[#241E1A] transition-colors cursor-pointer"
            >
              Top ↑
            </button>
          </div>
        </div>
      </footer>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 14. FLOATING WHATSAPP CONCIERGE BUTTON                      */}
      {/* ─────────────────────────────────────────────────────────── */}
      <a
        href={createWhatsAppUrl({ phone: settings.whatsapp_phone, customNote: 'Hello Bhuvi! I am visiting your website and would love to ask a quick question.' })}
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

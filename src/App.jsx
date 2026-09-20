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
  Palette,
  Check
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

// ─── 3 CURATED DESIGN & COLOR THEMES (From Design Engineering Skills) ───────────
export const THEMES = [
  {
    id: 'cashmere',
    num: '1',
    name: 'Cashmere & Raw Henna',
    vibe: 'Light Warm Luxury • Sabyasachi Editorial',
    bg: '#FAF7F2',
    surface: '#FFFFFF',
    surfaceSubtle: '#F4EFE6',
    border: '#E8E2D9',
    ink: '#1C1917',
    muted: '#78716A',
    accent: '#7A2021', // Deep Mahogany
    accentHover: '#611617',
    gold: '#C5A880',
    fontHeading: "'Italiana', 'Playfair Display', serif",
    fontBody: "'Plus Jakarta Sans', sans-serif",
    isDark: false,
    swatches: [
      { name: 'Canvas', hex: '#FAF7F2' },
      { name: 'Surface', hex: '#FFFFFF' },
      { name: 'Raw Henna', hex: '#7A2021' },
      { name: 'Champagne', hex: '#C5A880' },
      { name: 'Ink', hex: '#1C1917' }
    ]
  },
  {
    id: 'obsidian',
    num: '2',
    name: 'Obsidian & Antique Gold',
    vibe: 'Dark Candlelit Royal Night • Bottega / Haveli',
    bg: '#0F0D0C',
    surface: '#171412',
    surfaceSubtle: '#201A17',
    border: '#2D2420',
    ink: '#FAF7F2',
    muted: '#A3958C',
    accent: '#C5A880', // Antique Gold
    accentHover: '#E6D5B8',
    gold: '#8B2635', // Deep Crimson
    fontHeading: "'Playfair Display', Georgia, serif",
    fontBody: "'Outfit', sans-serif",
    isDark: true,
    swatches: [
      { name: 'Obsidian', hex: '#0F0D0C' },
      { name: 'Charcoal', hex: '#171412' },
      { name: 'Antique Gold', hex: '#C5A880' },
      { name: 'Crimson', hex: '#8B2635' },
      { name: 'Linen Ink', hex: '#FAF7F2' }
    ]
  },
  {
    id: 'terracotta',
    num: '3',
    name: 'Sojat Earth & Terracotta',
    vibe: 'Artisanal Botanical Chic • Aesop / Sun-baked Clay',
    bg: '#F5EFEB',
    surface: '#EDE4DC',
    surfaceSubtle: '#E4D8CE',
    border: '#D9CEC5',
    ink: '#241E1A',
    muted: '#6E645D',
    accent: '#A64B38', // Terracotta Henna
    accentHover: '#8A3B2A',
    gold: '#4A5D4E', // Olive Leaf
    fontHeading: "'Cormorant Garamond', Georgia, serif",
    fontBody: "'Plus Jakarta Sans', sans-serif",
    isDark: false,
    swatches: [
      { name: 'Raw Linen', hex: '#F5EFEB' },
      { name: 'Courtyard', hex: '#EDE4DC' },
      { name: 'Terracotta', hex: '#A64B38' },
      { name: 'Olive Leaf', hex: '#4A5D4E' },
      { name: 'Brunette', hex: '#241E1A' }
    ]
  }
];

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
  // Theme state: defaults to 'cashmere'
  const [currentThemeId, setCurrentThemeId] = useState('cashmere');
  const [paletteModalOpen, setPaletteModalOpen] = useState(false);

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
    handLength: 'elbow',
    feetLength: 'mid-calf',
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
  const [newDesignForm, setNewDesignForm] = useState({
    title: '',
    category: 'bridal',
    imageUrl: '',
    description: '',
    priceRange: '₹5,000 - ₹9,000',
    tag: 'Signature'
  });
  const [addingDesign, setAddingDesign] = useState(false);

  const currentTheme = useMemo(() => {
    return THEMES.find(t => t.id === currentThemeId) || THEMES[0];
  }, [currentThemeId]);

  // Apply theme data attribute to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentThemeId);
  }, [currentThemeId]);

  // Keyboard shortcut listener: 1, 2, 3 to switch themes instantly!
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['input', 'textarea', 'select'].includes(document.activeElement?.tagName?.toLowerCase())) return;
      if (e.key === '1') setCurrentThemeId('cashmere');
      if (e.key === '2') setCurrentThemeId('obsidian');
      if (e.key === '3') setCurrentThemeId('terracotta');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
    try {
      const [inq, status] = await Promise.all([
        fetchInquiries(),
        testSupabaseConnection()
      ]);
      setInquiries(inq);
      setDbStatus(status);
    } catch (err) {
      console.error(err);
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

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.eventDate) return;
    setFormSubmitting(true);
    try {
      await submitInquiry(formData);
      setFormSuccess(true);
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

  const filteredServices = activeServiceTab === 'All'
    ? INITIAL_SERVICES
    : INITIAL_SERVICES.filter(s => s.category.toLowerCase().includes(activeServiceTab.toLowerCase()));

  const filteredDesigns = activeGalleryTab === 'all'
    ? designs
    : designs.filter(d => d.category.toLowerCase() === activeGalleryTab.toLowerCase());

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-canvas)',
        color: 'var(--text-main)',
        fontFamily: 'var(--font-body)'
      }}
      className="min-h-screen antialiased transition-colors duration-400"
    >
      
      {/* ─────────────────────────────────────────────────────────── */}
      {/* 1. HAUTE NAVIGATION BAR                                     */}
      {/* ─────────────────────────────────────────────────────────── */}
      <header
        style={{
          backgroundColor: 'var(--bg-canvas)',
          borderColor: 'var(--border-subtle)'
        }}
        className="sticky top-0 z-40 bg-opacity-95 backdrop-blur-xl border-b transition-colors duration-400"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 h-20 flex items-center justify-between">
          
          {/* Brand Monogram & Title */}
          <button
            onClick={() => scrollTo('hero')}
            className="flex items-center gap-3 text-left group cursor-pointer"
          >
            <div
              style={{
                borderColor: 'var(--accent-primary)',
                backgroundColor: 'var(--bg-surface)'
              }}
              className="w-10 h-10 rounded-full border flex items-center justify-center transition-colors"
            >
              <span style={{ color: 'var(--accent-primary)' }} className="font-heading text-lg font-bold">
                BM
              </span>
            </div>
            <div>
              <span
                style={{ color: 'var(--text-main)' }}
                className="font-heading text-2xl tracking-[0.12em] font-normal block leading-tight"
              >
                BHUVI MEHANDI
              </span>
              <span
                style={{ color: 'var(--text-muted)' }}
                className="text-[9px] uppercase tracking-[0.25em] font-body block"
              >
                Haute Atelier • Organic Sojat
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav
            style={{ color: 'var(--text-muted)' }}
            className="hidden lg:flex items-center space-x-8 text-xs tracking-[0.18em] uppercase font-body"
          >
            <button onClick={() => scrollTo('services')} className="hover:opacity-100 transition-opacity cursor-pointer">
              Services & Events
            </button>
            <button
              onClick={() => scrollTo('builder')}
              style={{ color: 'var(--accent-primary)' }}
              className="hover:opacity-80 transition-opacity cursor-pointer flex items-center gap-1.5 font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Bespoke Builder
            </button>
            <button onClick={() => scrollTo('portfolio')} className="hover:opacity-100 transition-opacity cursor-pointer">
              Archive
            </button>
            <button onClick={() => scrollTo('stain')} className="hover:opacity-100 transition-opacity cursor-pointer">
              Stain Alchemy
            </button>
            <button onClick={() => scrollTo('about')} className="hover:opacity-100 transition-opacity cursor-pointer">
              Philosophy
            </button>
            <button onClick={() => scrollTo('inquire')} className="hover:opacity-100 transition-opacity cursor-pointer">
              Reservations
            </button>
          </nav>

          {/* Right Action: Palette Previewer Trigger & WhatsApp CTA */}
          <div className="hidden sm:flex items-center gap-3 font-body">
            
            {/* Live Palette Visualizer Button */}
            <button
              onClick={() => setPaletteModalOpen(true)}
              style={{
                borderColor: 'var(--border-subtle)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-main)'
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-xs tracking-wider uppercase font-medium hover:border-amber-700 transition-colors cursor-pointer shadow-sm"
              title="Inspect & compare color palettes"
            >
              <Palette className="w-3.5 h-3.5 text-amber-600" />
              <span>Palette Info</span>
            </button>

            {/* WhatsApp Concierge Button */}
            <a
              href={createWhatsAppUrl({
                eventType: 'VIP Bridal Inquiry',
                customNote: 'Namaste Bhuvi, I would love to check date availability for my wedding celebrations.'
              })}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: 'var(--accent-primary)',
                color: '#FAF7F2'
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs uppercase tracking-[0.16em] font-medium transition-transform duration-300 shadow-md hover:scale-[1.02]"
            >
              <span>WhatsApp Concierge</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)'
            }}
            className="lg:hidden border-b px-6 py-8 space-y-4 text-sm uppercase tracking-[0.18em] font-body"
          >
            <button onClick={() => scrollTo('services')} className="block w-full text-left py-1.5">
              Event Services
            </button>
            <button
              onClick={() => scrollTo('builder')}
              style={{ color: 'var(--accent-primary)' }}
              className="block w-full text-left py-1.5 font-bold flex items-center justify-between"
            >
              <span>Bespoke Henna Builder</span>
              <Sparkles className="w-4 h-4" />
            </button>
            <button onClick={() => scrollTo('portfolio')} className="block w-full text-left py-1.5">
              Archive Gallery
            </button>
            <button onClick={() => scrollTo('stain')} className="block w-full text-left py-1.5">
              48h Stain Alchemy
            </button>
            <button onClick={() => scrollTo('about')} className="block w-full text-left py-1.5">
              Philosophy
            </button>
            <button onClick={() => scrollTo('inquire')} className="block w-full text-left py-1.5">
              Book Your Date
            </button>
            <div className="pt-4 border-t border-stone-300/40 flex flex-col gap-2">
              <button
                onClick={() => setPaletteModalOpen(true)}
                className="w-full text-center py-2.5 border rounded-full text-xs font-semibold uppercase tracking-wider"
              >
                🎨 View Color Palettes
              </button>
              <a
                href={createWhatsAppUrl({ customNote: 'Hi Bhuvi! Reaching out from website mobile menu.' })}
                target="_blank"
                rel="noopener noreferrer"
                style={{ backgroundColor: 'var(--accent-primary)', color: '#FAF7F2' }}
                className="w-full text-center py-3 font-semibold text-xs tracking-[0.18em] rounded-full inline-block shadow-md"
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
      <section id="hero" className="relative overflow-hidden pt-12 sm:pt-20 pb-20 sm:pb-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-7">
              
              {/* Theme Badge */}
              <div
                style={{
                  borderColor: 'var(--border-subtle)',
                  backgroundColor: 'var(--bg-surface)'
                }}
                className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border shadow-sm"
              >
                <span style={{ backgroundColor: 'var(--accent-primary)' }} className="w-2 h-2 rounded-full animate-pulse" />
                <span style={{ color: 'var(--text-muted)' }} className="text-[11px] uppercase tracking-[0.2em] font-body">
                  {currentTheme.vibe}
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl font-normal leading-[1.03] tracking-[-0.01em]">
                Haute Henna, <br />
                <span style={{ color: 'var(--accent-primary)' }} className="italic font-normal">heirloom</span> crafted <br />
                for life's vows.
              </h1>

              {/* Subtext */}
              <p style={{ color: 'var(--text-muted)' }} className="text-base sm:text-lg font-light leading-relaxed max-w-xl font-body">
                Handcrafted with 100% triple-sifted organic Rajasthani Sojat leaf, Bulgarian lavender, and Nilgiri botanical oils. 
                Custom storytelling compositions with guaranteed 48-hour deep mahogany stains.
              </p>

              {/* Dual Action CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 font-body">
                <a
                  href={createWhatsAppUrl({
                    eventType: 'Royal Bridal Package',
                    customNote: 'Namaste Bhuvi! I want to check date availability and book my bridal mehandi.'
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: 'var(--accent-primary)',
                    color: '#FAF7F2'
                  }}
                  className="px-8 py-4 rounded-full font-bold text-xs uppercase tracking-[0.18em] text-center hover:opacity-90 transition-opacity shadow-lg"
                >
                  Book on WhatsApp Concierge
                </a>

                <button
                  onClick={() => scrollTo('builder')}
                  style={{
                    borderColor: 'var(--border-subtle)',
                    backgroundColor: 'var(--bg-surface)',
                    color: 'var(--text-main)'
                  }}
                  className="px-8 py-4 rounded-full border text-xs uppercase tracking-[0.18em] transition-colors cursor-pointer text-center flex items-center justify-center gap-2 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Custom Henna Builder
                </button>
              </div>

              {/* Key Atelier Pillars */}
              <div
                style={{ borderColor: 'var(--border-subtle)' }}
                className="pt-8 border-t grid grid-cols-3 gap-6 max-w-lg font-body"
              >
                <div>
                  <span style={{ color: 'var(--accent-primary)' }} className="font-heading text-3xl sm:text-4xl block">100%</span>
                  <span style={{ color: 'var(--text-muted)' }} className="text-[10px] uppercase tracking-[0.18em] mt-1 block">Organic Sojat</span>
                </div>
                <div>
                  <span style={{ color: 'var(--accent-primary)' }} className="font-heading text-3xl sm:text-4xl block">1,200+</span>
                  <span style={{ color: 'var(--text-muted)' }} className="text-[10px] uppercase tracking-[0.18em] mt-1 block">Brides Adorned</span>
                </div>
                <div>
                  <span style={{ color: 'var(--accent-primary)' }} className="font-heading text-3xl sm:text-4xl block">48h</span>
                  <span style={{ color: 'var(--text-muted)' }} className="text-[10px] uppercase tracking-[0.18em] mt-1 block">Dark Stain Peak</span>
                </div>
              </div>

            </div>

            {/* Right Visual Composition */}
            <div className="lg:col-span-5 relative">
              <div
                style={{
                  borderColor: 'var(--border-subtle)',
                  backgroundColor: 'var(--bg-surface)'
                }}
                className="relative rounded-3xl p-3 border shadow-2xl transition-colors duration-400"
              >
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-stone-900">
                  <img
                    src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85"
                    alt="Bhuvi Mehandi - Royal Bridal Artistry"
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
                  
                  {/* Floating Info Capsule */}
                  <div
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      borderColor: 'var(--border-subtle)'
                    }}
                    className="absolute bottom-4 left-4 right-4 p-4 rounded-xl backdrop-blur-md border flex items-center justify-between shadow-lg"
                  >
                    <div>
                      <p style={{ color: 'var(--text-main)' }} className="font-heading text-lg">The Royal Dulha-Dulhan Motif</p>
                      <p style={{ color: 'var(--accent-primary)' }} className="text-[10px] uppercase tracking-[0.18em] font-body font-semibold">Signature Storyline Edition</p>
                    </div>
                    <div
                      style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--accent-primary)' }}
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                    >
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
      <section
        id="services"
        style={{
          backgroundColor: 'var(--bg-subtle)',
          borderColor: 'var(--border-subtle)'
        }}
        className="py-24 sm:py-32 border-t border-b transition-colors duration-400"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          
          {/* Section Header */}
          <div
            style={{ borderColor: 'var(--border-subtle)' }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b"
          >
            <div>
              <span style={{ color: 'var(--accent-primary)' }} className="text-xs uppercase tracking-[0.25em] font-body block mb-2 font-semibold">
                Celebration Offerings
              </span>
              <h2 className="font-heading text-4xl sm:text-6xl">
                Services by Event
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 sm:gap-2.5 mt-6 md:mt-0 font-body text-xs uppercase tracking-[0.16em]">
              {['All', 'Bridal', 'Engagement', 'Arabic', 'Traditional', 'Baby Shower', 'Family & Guests'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveServiceTab(tab)}
                  style={{
                    backgroundColor: activeServiceTab === tab ? 'var(--accent-primary)' : 'var(--bg-surface)',
                    color: activeServiceTab === tab ? '#FAF7F2' : 'var(--text-muted)',
                    borderColor: 'var(--border-subtle)'
                  }}
                  className="px-4 py-2 rounded-full border transition-all cursor-pointer shadow-sm"
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
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-subtle)'
                  }}
                  className="group rounded-2xl border overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all duration-400 hover:-translate-y-1 shadow-sm"
                >
                  <div>
                    {/* Card Media */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-stone-900">
                      <img
                        src={service.imageUrl}
                        alt={service.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                      
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-sm text-[10px] uppercase tracking-[0.18em] font-body text-[#FAF7F2]">
                        {service.eventType}
                      </div>

                      <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-black/80 text-xs font-body text-[#FAF7F2] font-semibold">
                        From {service.priceStarting}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 space-y-4">
                      <div style={{ color: 'var(--text-muted)' }} className="flex items-center justify-between text-xs font-body">
                        <span style={{ color: 'var(--accent-primary)' }} className="font-semibold uppercase tracking-wider">{service.badge}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {service.duration}</span>
                      </div>

                      <h3 className="font-heading text-2xl group-hover:opacity-80 transition-opacity leading-tight">
                        {service.name}
                      </h3>

                      <p style={{ color: 'var(--text-muted)' }} className="text-xs font-body leading-relaxed line-clamp-3">
                        {service.description}
                      </p>

                      <ul style={{ borderColor: 'var(--border-subtle)' }} className="space-y-1.5 pt-3 border-t">
                        {service.includes.slice(0, 3).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-[11px] font-body">
                            <span style={{ color: 'var(--accent-primary)' }} className="mt-0.5">•</span>
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
                      style={{
                        backgroundColor: 'var(--bg-subtle)',
                        color: 'var(--text-main)',
                        borderColor: 'var(--border-subtle)'
                      }}
                      className="w-full py-3 rounded-xl border hover:opacity-85 text-xs uppercase tracking-[0.16em] font-body font-semibold flex items-center justify-center gap-2 transition-all"
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
      <section id="builder" className="py-24 sm:py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span style={{ color: 'var(--accent-primary)' }} className="text-xs uppercase tracking-[0.25em] font-body block mb-2 font-semibold">
              Interactive Atelier Studio
            </span>
            <h2 className="font-heading text-4xl sm:text-6xl mb-4">
              Bespoke Henna Calculator
            </h2>
            <p style={{ color: 'var(--text-muted)' }} className="text-sm font-body leading-relaxed">
              Tailor every element of your ceremony — from hand lengths to custom portraiture and guest party count. 
              Receive real-time duration and cone estimations instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Configuration Panel */}
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)'
              }}
              className="lg:col-span-7 p-8 sm:p-10 rounded-3xl border space-y-8 shadow-lg"
            >
              
              {/* Step 1: Hand Length */}
              <div>
                <label style={{ color: 'var(--accent-primary)' }} className="block text-xs uppercase tracking-[0.18em] font-body font-bold mb-3">
                  1. Bride Hand Coverage Length
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-body">
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
                      style={{
                        borderColor: builderConfig.handLength === opt.id ? 'var(--accent-primary)' : 'var(--border-subtle)',
                        backgroundColor: builderConfig.handLength === opt.id ? 'var(--bg-subtle)' : 'var(--bg-surface)'
                      }}
                      className="p-3 rounded-xl border text-center transition-all cursor-pointer shadow-sm"
                    >
                      <p className="text-xs font-semibold">{opt.label}</p>
                      <p style={{ color: 'var(--text-muted)' }} className="text-[10px] mt-0.5">{opt.time}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Feet Length */}
              <div>
                <label style={{ color: 'var(--accent-primary)' }} className="block text-xs uppercase tracking-[0.18em] font-body font-bold mb-3">
                  2. Bride Feet & Calves Coverage
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-body">
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
                      style={{
                        borderColor: builderConfig.feetLength === opt.id ? 'var(--accent-primary)' : 'var(--border-subtle)',
                        backgroundColor: builderConfig.feetLength === opt.id ? 'var(--bg-subtle)' : 'var(--bg-surface)'
                      }}
                      className="p-3 rounded-xl border text-center transition-all cursor-pointer shadow-sm"
                    >
                      <p className="text-xs font-semibold">{opt.label}</p>
                      <p style={{ color: 'var(--text-muted)' }} className="text-[10px] mt-0.5">{opt.time}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Signature Storyline Elements */}
              <div>
                <label style={{ color: 'var(--accent-primary)' }} className="block text-xs uppercase tracking-[0.18em] font-body font-bold mb-3">
                  3. Signature Storyline Add-ons
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-body">
                  <button
                    type="button"
                    onClick={() => setBuilderConfig({ ...builderConfig, hasPortrait: !builderConfig.hasPortrait })}
                    style={{
                      borderColor: builderConfig.hasPortrait ? 'var(--accent-primary)' : 'var(--border-subtle)',
                      backgroundColor: builderConfig.hasPortrait ? 'var(--bg-subtle)' : 'var(--bg-surface)'
                    }}
                    className="p-4 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer shadow-sm"
                  >
                    <div>
                      <p className="text-xs font-semibold">Dulha-Dulhan Handdrawn Portrait</p>
                      <p style={{ color: 'var(--text-muted)' }} className="text-[10px]">Temple archway figurines (+₹1,500)</p>
                    </div>
                    <CheckCircle
                      style={{ color: builderConfig.hasPortrait ? 'var(--accent-primary)' : 'var(--border-subtle)' }}
                      className="w-4 h-4 flex-shrink-0"
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => setBuilderConfig({ ...builderConfig, hasHashtag: !builderConfig.hasHashtag })}
                    style={{
                      borderColor: builderConfig.hasHashtag ? 'var(--accent-primary)' : 'var(--border-subtle)',
                      backgroundColor: builderConfig.hasHashtag ? 'var(--bg-subtle)' : 'var(--bg-surface)'
                    }}
                    className="p-4 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer shadow-sm"
                  >
                    <div>
                      <p className="text-xs font-semibold">Wedding Hashtag & Date Weaving</p>
                      <p style={{ color: 'var(--text-muted)' }} className="text-[10px]">Hidden monogram typography (+₹500)</p>
                    </div>
                    <CheckCircle
                      style={{ color: builderConfig.hasHashtag ? 'var(--accent-primary)' : 'var(--border-subtle)' }}
                      className="w-4 h-4 flex-shrink-0"
                    />
                  </button>
                </div>
              </div>

              {/* Step 4: Guest / Bridesmaid Count Slider */}
              <div>
                <div className="flex justify-between items-center mb-2 font-body">
                  <label style={{ color: 'var(--accent-primary)' }} className="text-xs uppercase tracking-[0.18em] font-bold">
                    4. Bridesmaids & Family Guests ({builderConfig.guestCount} Guests)
                  </label>
                  <span className="text-xs font-semibold">~₹{builderConfig.guestCount * 400}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="5"
                  value={builderConfig.guestCount}
                  onChange={(e) => setBuilderConfig({ ...builderConfig, guestCount: parseInt(e.target.value) })}
                  className="w-full accent-amber-800 h-2 rounded-lg cursor-pointer"
                />
                <div style={{ color: 'var(--text-muted)' }} className="flex justify-between text-[10px] font-body mt-1">
                  <span>Bride only (0)</span>
                  <span>Intimate (15)</span>
                  <span>Grand Sangeet (50+)</span>
                </div>
              </div>

            </div>

            {/* Right Live Estimate Summary Card */}
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)'
              }}
              className="lg:col-span-5 rounded-3xl p-8 sm:p-10 border shadow-2xl relative"
            >
              <div className="space-y-6">
                
                <div style={{ borderColor: 'var(--border-subtle)' }} className="flex items-center justify-between border-b pb-4">
                  <span style={{ color: 'var(--accent-primary)' }} className="text-xs uppercase tracking-[0.18em] font-body font-bold">
                    Quotation Estimate
                  </span>
                  <span
                    style={{
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--accent-primary)'
                    }}
                    className="text-[11px] px-3 py-1 rounded-full font-body font-semibold"
                  >
                    Bespoke Atelier
                  </span>
                </div>

                <div>
                  <span style={{ color: 'var(--text-muted)' }} className="text-xs uppercase tracking-wider font-body block">Estimated Investment</span>
                  <span className="font-heading text-4xl sm:text-5xl block mt-1">
                    ₹{calculation.price.toLocaleString('en-IN')}
                  </span>
                  <span style={{ color: 'var(--text-muted)' }} className="text-[11px] font-body">*Includes organic cones, sealant spray & travel consult</span>
                </div>

                <div style={{ borderColor: 'var(--border-subtle)' }} className="grid grid-cols-2 gap-4 pt-4 border-t font-body">
                  <div style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-subtle)' }} className="p-3.5 rounded-xl border">
                    <span style={{ color: 'var(--text-muted)' }} className="text-[10px] uppercase tracking-wider block">Application Time</span>
                    <span className="text-sm font-semibold mt-0.5 block flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-700" />
                      ~{calculation.hours} Hours
                    </span>
                  </div>

                  <div style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-subtle)' }} className="p-3.5 rounded-xl border">
                    <span style={{ color: 'var(--text-muted)' }} className="text-[10px] uppercase tracking-wider block">Organic Cones</span>
                    <span className="text-sm font-semibold mt-0.5 block flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
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
                    style={{
                      backgroundColor: 'var(--accent-primary)',
                      color: '#FAF7F2'
                    }}
                    className="w-full py-4 rounded-full font-bold text-xs uppercase tracking-[0.18em] font-body text-center flex items-center justify-center gap-2 shadow-lg hover:opacity-90 transition-opacity"
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
      <section
        id="portfolio"
        style={{
          backgroundColor: 'var(--bg-subtle)',
          borderColor: 'var(--border-subtle)'
        }}
        className="py-24 sm:py-32 border-t border-b"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          
          <div style={{ borderColor: 'var(--border-subtle)' }} className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b">
            <div>
              <span style={{ color: 'var(--accent-primary)' }} className="text-xs uppercase tracking-[0.25em] font-body block mb-2 font-semibold">
                Curated Works
              </span>
              <h2 className="font-heading text-4xl sm:text-6xl">
                Atelier Archive
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 font-body text-xs uppercase tracking-[0.16em] mt-6 md:mt-0">
              {['all', 'bridal', 'arabic', 'rajasthani', 'feet', 'engagement', 'minimalist'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveGalleryTab(cat)}
                  style={{
                    backgroundColor: activeGalleryTab === cat ? 'var(--accent-primary)' : 'var(--bg-surface)',
                    color: activeGalleryTab === cat ? '#FAF7F2' : 'var(--text-muted)',
                    borderColor: 'var(--border-subtle)'
                  }}
                  className="px-4 py-2 rounded-full border transition-all cursor-pointer shadow-sm"
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
                <div key={i} style={{ backgroundColor: 'var(--bg-surface)' }} className="aspect-[3/4] rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredDesigns.map(design => (
                <div
                  key={design.id}
                  onClick={() => setSelectedDesign(design)}
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-subtle)'
                  }}
                  className="group relative rounded-2xl overflow-hidden border cursor-pointer hover:shadow-xl transition-all duration-400 hover:-translate-y-1 shadow-sm"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-stone-900">
                    <img
                      src={design.imageUrl}
                      alt={design.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-sm text-[9px] uppercase tracking-[0.18em] font-body text-amber-200">
                      {design.tag || design.category}
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h4 className="font-heading text-lg truncate">
                        {design.title}
                      </h4>
                      <p className="text-[11px] font-body text-stone-300 mt-0.5">
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
      <section id="stain" className="py-24 sm:py-32 relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span style={{ color: 'var(--accent-primary)' }} className="text-xs uppercase tracking-[0.25em] font-body block mb-2 font-semibold">
              The Chemistry of Organic Henna
            </span>
            <h2 className="font-heading text-4xl sm:text-6xl mb-4">
              The Stain Oxidation Journey
            </h2>
            <p style={{ color: 'var(--text-muted)' }} className="text-sm font-body leading-relaxed">
              Pure Sojat henna contains natural lawsone molecules that react gently with air and body heat over 48 hours to create our signature deep mahogany stain.
            </p>
          </div>

          {/* Stepper Control */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10 font-body">
            {STAIN_STAGES.map((st, idx) => (
              <button
                key={idx}
                onClick={() => setStainStage(idx)}
                style={{
                  borderColor: stainStage === idx ? 'var(--accent-primary)' : 'var(--border-subtle)',
                  backgroundColor: stainStage === idx ? 'var(--bg-surface)' : 'var(--bg-subtle)'
                }}
                className="p-4 rounded-2xl border transition-all text-center cursor-pointer shadow-sm"
              >
                <div
                  className="w-6 h-6 rounded-full mx-auto mb-2 border border-black/20 shadow-inner"
                  style={{ backgroundColor: st.colorHex }}
                />
                <p className="text-xs font-semibold">{st.hours}</p>
                <p style={{ color: 'var(--accent-primary)' }} className="text-[10px] mt-0.5 font-medium">{st.badge}</p>
              </button>
            ))}
          </div>

          {/* Active Stage Showcase Card */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)'
            }}
            className="rounded-3xl border p-8 sm:p-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center shadow-lg"
          >
            <div
              style={{
                backgroundColor: 'var(--bg-subtle)',
                borderColor: 'var(--border-subtle)'
              }}
              className="md:col-span-4 flex flex-col items-center text-center p-6 rounded-2xl border"
            >
              <div
                className="w-24 h-24 rounded-full border-4 border-amber-800/30 shadow-2xl mb-4"
                style={{ backgroundColor: STAIN_STAGES[stainStage].colorHex }}
              />
              <span className="font-heading text-2xl">{STAIN_STAGES[stainStage].title}</span>
              <span style={{ color: 'var(--accent-primary)' }} className="text-xs font-body font-semibold mt-1">{STAIN_STAGES[stainStage].badge}</span>
            </div>

            <div className="md:col-span-8 space-y-4">
              <h3 className="font-heading text-3xl">
                {STAIN_STAGES[stainStage].title}
              </h3>
              <p style={{ color: 'var(--text-muted)' }} className="text-sm font-body leading-relaxed">
                {STAIN_STAGES[stainStage].description}
              </p>

              <div
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  borderColor: 'var(--border-subtle)'
                }}
                className="p-4 rounded-xl border"
              >
                <p style={{ color: 'var(--accent-primary)' }} className="text-xs font-semibold uppercase tracking-wider font-body mb-1 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" />
                  Atelier Aftercare Ritual
                </p>
                <p style={{ color: 'var(--text-main)' }} className="text-xs font-body leading-relaxed">
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
      <section
        id="about"
        style={{
          backgroundColor: 'var(--bg-subtle)',
          borderColor: 'var(--border-subtle)'
        }}
        className="py-24 sm:py-32 border-t border-b"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            <div className="lg:col-span-5">
              <div
                style={{ borderColor: 'var(--border-subtle)' }}
                className="relative aspect-[4/5] rounded-3xl overflow-hidden border shadow-xl bg-stone-900"
              >
                <img
                  src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=85"
                  alt="Bhuvi Artist at work"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <span style={{ color: 'var(--accent-primary)' }} className="text-xs uppercase tracking-[0.25em] font-body block font-semibold">
                The Atelier Heritage
              </span>

              <h2 className="font-heading text-4xl sm:text-6xl leading-tight">
                Crafted with intention. <br />
                <span style={{ color: 'var(--accent-primary)' }} className="italic">Colored</span> by nature.
              </h2>

              <p style={{ color: 'var(--text-muted)' }} className="text-sm sm:text-base font-body leading-relaxed">
                Henna is not merely an ornament; it is the physical anchoring of an auspicious milestone. 
                Bhuvi approaches every bride as an intimate canvas — sketching custom narratives that honor family traditions, 
                lehenga embroidery motifs, and personal love stories.
              </p>

              <div style={{ borderColor: 'var(--border-subtle)' }} className="space-y-4 pt-4 border-t font-body text-xs">
                <div className="flex items-start gap-3">
                  <ShieldCheck style={{ color: 'var(--accent-primary)' }} className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p style={{ color: 'var(--text-muted)' }} className="leading-relaxed">
                    <strong style={{ color: 'var(--text-main)' }}>100% Zero-Chemical Guarantee:</strong> No black henna, no PPD, no synthetic dyes. Formulated exclusively with tea tree, eucalyptus, and Bulgarian lavender essential oils.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <Award style={{ color: 'var(--accent-primary)' }} className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p style={{ color: 'var(--text-muted)' }} className="leading-relaxed">
                    <strong style={{ color: 'var(--text-main)' }}>Destination & Venue Travel:</strong> Based in Ahmedabad & Gandhinagar with full travel setup across Udaipur, Jaipur, Goa, Mumbai, and international venues.
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
      <section className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span style={{ color: 'var(--accent-primary)' }} className="text-xs uppercase tracking-[0.25em] font-body block mb-2 font-semibold">
              Client Testimonials
            </span>
            <h2 className="font-heading text-4xl sm:text-6xl">
              Words from Real Brides
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {INITIAL_REVIEWS.map(rev => (
              <div
                key={rev.id}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-subtle)'
                }}
                className="p-6 rounded-2xl border flex flex-col justify-between space-y-4 shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <p style={{ color: 'var(--text-muted)' }} className="text-xs font-body leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>

                <div style={{ borderColor: 'var(--border-subtle)' }} className="pt-3 border-t">
                  <p className="font-heading text-base">{rev.clientName}</p>
                  <p style={{ color: 'var(--accent-primary)' }} className="text-[10px] font-body font-semibold">{rev.eventType} • {rev.location}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 9. VIP RESERVATION & INQUIRY FORM                           */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section
        id="inquire"
        style={{
          backgroundColor: 'var(--bg-subtle)',
          borderColor: 'var(--border-subtle)'
        }}
        className="py-24 sm:py-32 border-t"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Left Info */}
            <div className="lg:col-span-5 space-y-6">
              <span style={{ color: 'var(--accent-primary)' }} className="text-xs uppercase tracking-[0.25em] font-body block font-semibold">
                Direct Booking
              </span>
              <h2 className="font-heading text-4xl sm:text-6xl">
                Reserve Your Date
              </h2>
              <p style={{ color: 'var(--text-muted)' }} className="text-sm font-body leading-relaxed">
                Due to the intimate, hand-sketched nature of our bridal work, we accept a limited number of weddings per season.
                Submit your celebration details below for immediate confirmation and custom quote.
              </p>

              <div
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-subtle)'
                }}
                className="p-6 rounded-2xl border space-y-3 font-body text-xs shadow-sm"
              >
                <div>
                  <span style={{ color: 'var(--text-muted)' }} className="uppercase tracking-wider block text-[10px]">Instant WhatsApp Line</span>
                  <span style={{ color: 'var(--accent-primary)' }} className="text-sm font-semibold">+{WHATSAPP_PHONE}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }} className="uppercase tracking-wider block text-[10px]">Studio Location</span>
                  <span className="text-sm">Ahmedabad & Gandhinagar (Pan-India Travel)</span>
                </div>
              </div>
            </div>

            {/* Right Form */}
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)'
              }}
              className="lg:col-span-7 p-8 sm:p-12 rounded-3xl border shadow-xl"
            >
              {formSuccess ? (
                <div className="py-12 text-center space-y-4 font-body">
                  <CheckCircle style={{ color: 'var(--accent-primary)' }} className="w-12 h-12 mx-auto" />
                  <h3 className="font-heading text-3xl">Inquiry Received</h3>
                  <p style={{ color: 'var(--text-muted)' }} className="text-xs max-w-sm mx-auto">
                    Your date inquiry has been registered in the Atelier database. A WhatsApp chat has also opened to finalize your booking directly.
                  </p>
                  <button
                    onClick={() => setFormSuccess(false)}
                    style={{ color: 'var(--accent-primary)', borderColor: 'var(--accent-primary)' }}
                    className="text-xs uppercase tracking-widest border-b pb-1 cursor-pointer font-semibold"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-6 font-body">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label style={{ color: 'var(--text-muted)' }} className="block text-[10px] uppercase tracking-wider mb-1.5 font-semibold">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Radhika Shah"
                        style={{
                          backgroundColor: 'var(--bg-subtle)',
                          borderColor: 'var(--border-subtle)'
                        }}
                        className="w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-1"
                      />
                    </div>

                    <div>
                      <label style={{ color: 'var(--text-muted)' }} className="block text-[10px] uppercase tracking-wider mb-1.5 font-semibold">Phone / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        style={{
                          backgroundColor: 'var(--bg-subtle)',
                          borderColor: 'var(--border-subtle)'
                        }}
                        className="w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label style={{ color: 'var(--text-muted)' }} className="block text-[10px] uppercase tracking-wider mb-1.5 font-semibold">Event Date *</label>
                      <input
                        type="date"
                        required
                        value={formData.eventDate}
                        onChange={e => setFormData({ ...formData, eventDate: e.target.value })}
                        style={{
                          backgroundColor: 'var(--bg-subtle)',
                          borderColor: 'var(--border-subtle)'
                        }}
                        className="w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-1"
                      />
                    </div>

                    <div>
                      <label style={{ color: 'var(--text-muted)' }} className="block text-[10px] uppercase tracking-wider mb-1.5 font-semibold">Event Type</label>
                      <select
                        value={formData.eventType}
                        onChange={e => setFormData({ ...formData, eventType: e.target.value })}
                        style={{
                          backgroundColor: 'var(--bg-subtle)',
                          borderColor: 'var(--border-subtle)'
                        }}
                        className="w-full px-4 py-3 rounded-xl border text-sm outline-none cursor-pointer"
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
                    <label style={{ color: 'var(--text-muted)' }} className="block text-[10px] uppercase tracking-wider mb-1.5 font-semibold">City & Venue Location</label>
                    <input
                      type="text"
                      value={formData.cityVenue}
                      onChange={e => setFormData({ ...formData, cityVenue: e.target.value })}
                      placeholder="e.g. Grand Hyatt / The Leela Palace"
                      style={{
                        backgroundColor: 'var(--bg-subtle)',
                        borderColor: 'var(--border-subtle)'
                      }}
                      className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                    />
                  </div>

                  <div>
                    <label style={{ color: 'var(--text-muted)' }} className="block text-[10px] uppercase tracking-wider mb-1.5 font-semibold">Special Requests or Design Vision</label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Share lehenga shades, customized story moments or guest count..."
                      style={{
                        backgroundColor: 'var(--bg-subtle)',
                        borderColor: 'var(--border-subtle)'
                      }}
                      className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={formSubmitting}
                    style={{
                      backgroundColor: 'var(--accent-primary)',
                      color: '#FAF7F2'
                    }}
                    className="w-full py-4 rounded-full font-bold text-xs uppercase tracking-[0.18em] transition-all hover:opacity-90 disabled:opacity-50 cursor-pointer shadow-lg"
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
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
          onClick={() => setSelectedDesign(null)}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)'
            }}
            className="border rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="md:w-1/2 aspect-square md:aspect-auto bg-stone-900">
              <img
                src={selectedDesign.imageUrl}
                alt={selectedDesign.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="md:w-1/2 p-8 flex flex-col justify-between overflow-y-auto font-body">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span
                    style={{
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--accent-primary)'
                    }}
                    className="text-[10px] uppercase tracking-[0.18em] px-3 py-1 rounded-full font-semibold"
                  >
                    {selectedDesign.category}
                  </span>
                  <button
                    onClick={() => setSelectedDesign(null)}
                    style={{ color: 'var(--text-muted)' }}
                    className="text-xs uppercase tracking-widest hover:opacity-100 cursor-pointer"
                  >
                    Close [×]
                  </button>
                </div>

                <h3 className="font-heading text-3xl">
                  {selectedDesign.title}
                </h3>

                <p style={{ color: 'var(--text-muted)' }} className="text-xs font-body leading-relaxed">
                  {selectedDesign.description || 'Intricate bespoke henna composition handcrafted by Bhuvi.'}
                </p>

                {selectedDesign.priceRange && (
                  <div className="pt-2">
                    <span style={{ color: 'var(--text-muted)' }} className="text-[10px] uppercase tracking-wider block">Investment</span>
                    <span className="font-heading text-2xl">{selectedDesign.priceRange}</span>
                  </div>
                )}
              </div>

              <div style={{ borderColor: 'var(--border-subtle)' }} className="pt-6 border-t">
                <a
                  href={createWhatsAppUrl({
                    eventType: 'Archive Design Inquiry',
                    designCode: selectedDesign.title,
                    customNote: `Hi Bhuvi! I love the "${selectedDesign.title}" design from your portfolio archive. Can you share availability for this style?`
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: 'var(--accent-primary)',
                    color: '#FAF7F2'
                  }}
                  className="w-full py-3.5 rounded-full font-bold text-xs uppercase tracking-[0.18em] text-center inline-block shadow-md hover:opacity-90"
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
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)'
            }}
            className="border-l w-full max-w-xl h-full p-8 overflow-y-auto font-body flex flex-col justify-between"
            onClick={e => e.stopPropagation()}
          >
            <div>
              <div style={{ borderColor: 'var(--border-subtle)' }} className="flex justify-between items-center pb-4 border-b mb-6">
                <div>
                  <h3 className="font-heading text-2xl">Studio Cloud Manager</h3>
                  <span style={{ color: 'var(--accent-primary)' }} className="text-[10px] uppercase tracking-widest font-semibold">
                    Supabase Portfolio & Inquiries Sync
                  </span>
                </div>
                <button
                  onClick={() => setAdminOpen(false)}
                  style={{ color: 'var(--text-muted)' }}
                  className="text-xs uppercase tracking-widest cursor-pointer"
                >
                  Close [×]
                </button>
              </div>

              {/* Status Banner */}
              <div
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  borderColor: 'var(--border-subtle)'
                }}
                className="p-4 rounded-xl border mb-8 text-xs space-y-1"
              >
                <span style={{ color: 'var(--accent-primary)' }} className="font-semibold block uppercase tracking-wider">
                  Supabase Cloud Status
                </span>
                <p style={{ color: 'var(--text-muted)' }}>
                  {dbStatus?.connected
                    ? (dbStatus.hasTables ? '🟢 Connected to Supabase mehandi tables' : '🟡 Supabase connected (run supabase-schema.sql for cloud tables)')
                    : '⚪ Local Storage Fallback Mode Active'}
                </p>
                <p className="text-[9px] text-stone-500 font-mono">{SUPABASE_URL}</p>
              </div>

              {/* Upload New Design Form */}
              <div
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  borderColor: 'var(--border-subtle)'
                }}
                className="mb-10 p-6 rounded-2xl border"
              >
                <h4 className="text-xs uppercase tracking-widest font-semibold mb-4">
                  Upload Design to Portfolio
                </h4>
                <form onSubmit={handleCreateDesign} className="space-y-4 text-xs">
                  <div>
                    <label style={{ color: 'var(--text-muted)' }} className="block text-[10px] uppercase tracking-wider mb-1">Title</label>
                    <input
                      type="text"
                      required
                      value={newDesignForm.title}
                      onChange={e => setNewDesignForm({ ...newDesignForm, title: e.target.value })}
                      placeholder="e.g. Royal Lotus Bridal Sleeves"
                      style={{
                        backgroundColor: 'var(--bg-surface)',
                        borderColor: 'var(--border-subtle)'
                      }}
                      className="w-full p-2.5 rounded-lg border text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label style={{ color: 'var(--text-muted)' }} className="block text-[10px] uppercase tracking-wider mb-1">Category</label>
                      <select
                        value={newDesignForm.category}
                        onChange={e => setNewDesignForm({ ...newDesignForm, category: e.target.value })}
                        style={{
                          backgroundColor: 'var(--bg-surface)',
                          borderColor: 'var(--border-subtle)'
                        }}
                        className="w-full p-2.5 rounded-lg border text-sm"
                      >
                        <option value="bridal">Bridal</option>
                        <option value="arabic">Arabic</option>
                        <option value="rajasthani">Rajasthani</option>
                        <option value="feet">Feet Art</option>
                        <option value="minimalist">Minimalist</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ color: 'var(--text-muted)' }} className="block text-[10px] uppercase tracking-wider mb-1">Price Range</label>
                      <input
                        type="text"
                        value={newDesignForm.priceRange}
                        onChange={e => setNewDesignForm({ ...newDesignForm, priceRange: e.target.value })}
                        style={{
                          backgroundColor: 'var(--bg-surface)',
                          borderColor: 'var(--border-subtle)'
                        }}
                        className="w-full p-2.5 rounded-lg border text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ color: 'var(--text-muted)' }} className="block text-[10px] uppercase tracking-wider mb-1">Image URL</label>
                    <input
                      type="url"
                      required
                      value={newDesignForm.imageUrl}
                      onChange={e => setNewDesignForm({ ...newDesignForm, imageUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      style={{
                        backgroundColor: 'var(--bg-surface)',
                        borderColor: 'var(--border-subtle)'
                      }}
                      className="w-full p-2.5 rounded-lg border text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={addingDesign}
                    style={{
                      backgroundColor: 'var(--accent-primary)',
                      color: '#FAF7F2'
                    }}
                    className="w-full py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:opacity-90 cursor-pointer shadow-md"
                  >
                    {addingDesign ? 'Saving...' : 'Add to Portfolio'}
                  </button>
                </form>
              </div>

              {/* Inquiry List */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xs uppercase tracking-widest font-semibold">
                    Client Inquiries ({inquiries.length})
                  </h4>
                  <button onClick={loadAdminPortal} style={{ color: 'var(--accent-primary)' }} className="text-xs flex items-center gap-1 cursor-pointer font-semibold">
                    <RefreshCw className="w-3.5 h-3.5" /> Refresh
                  </button>
                </div>

                {inquiries.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)' }} className="text-xs">No inquiries registered yet.</p>
                ) : (
                  <div className="space-y-3">
                    {inquiries.map(inq => (
                      <div
                        key={inq.id}
                        style={{
                          backgroundColor: 'var(--bg-subtle)',
                          borderColor: 'var(--border-subtle)'
                        }}
                        className="p-4 rounded-xl border space-y-2 text-xs"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-sm">{inq.name}</span>
                          <span
                            style={{
                              backgroundColor: 'var(--bg-surface)',
                              color: 'var(--accent-primary)'
                            }}
                            className="px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-semibold"
                          >
                            {inq.status || 'New'}
                          </span>
                        </div>
                        <p style={{ color: 'var(--text-muted)' }}>
                          📞 {inq.phone} • 📅 {inq.event_date} • {inq.event_type}
                        </p>
                        {inq.city_venue && <p style={{ color: 'var(--text-muted)' }}>📍 {inq.city_venue}</p>}
                        
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
                            style={{
                              backgroundColor: 'var(--bg-surface)',
                              borderColor: 'var(--border-subtle)'
                            }}
                            className="p-1 rounded border text-[10px]"
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

            <div style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }} className="pt-6 border-t text-[10px] text-center">
              BHUVI MEHANDI ATELIER • STUDIO CLOUD
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 12. LUXURY FOOTER                                           */}
      {/* ─────────────────────────────────────────────────────────── */}
      <footer
        style={{
          borderColor: 'var(--border-subtle)',
          backgroundColor: 'var(--bg-canvas)'
        }}
        className="border-t py-16 font-body"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs">
          <div>
            <span className="font-heading text-2xl tracking-widest block">
              BHUVI MEHANDI
            </span>
            <p style={{ color: 'var(--text-muted)' }} className="text-[11px] mt-1">
              © {new Date().getFullYear()} Bhuvi Mehandi Atelier. Pure Organic Sojat Artistry.
            </p>
          </div>

          <div style={{ color: 'var(--text-muted)' }} className="flex items-center space-x-6 tracking-[0.15em] uppercase text-[11px]">
            <a
              href={createWhatsAppUrl({ customNote: 'General inquiry for Bhuvi Mehandi.' })}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-100 transition-opacity"
            >
              WhatsApp
            </a>
            <button
              onClick={handleOpenAdmin}
              style={{ color: 'var(--accent-primary)' }}
              className="cursor-pointer font-bold"
            >
              Studio Access
            </button>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="cursor-pointer hover:opacity-100 transition-opacity"
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
        className="fixed bottom-20 sm:bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#25d366] text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300"
      >
        <span className="absolute inset-0 rounded-full bg-[#25d366] animate-ping opacity-30 pointer-events-none" />
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 14. FLOATING PROTOTYPE PICKER (Bottom Control Bar)          */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-[#12100E]/95 text-stone-100 backdrop-blur-2xl px-4 py-2.5 rounded-full border border-stone-700/80 shadow-2xl flex items-center gap-2 sm:gap-4 font-body text-xs">
        <span className="text-[10px] uppercase tracking-widest text-stone-400 hidden sm:inline-block font-semibold">
          Theme [Keys: 1, 2, 3]
        </span>

        <div className="flex items-center gap-1.5">
          {THEMES.map(theme => (
            <button
              key={theme.id}
              onClick={() => setCurrentThemeId(theme.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all cursor-pointer text-xs font-semibold ${
                currentThemeId === theme.id
                  ? 'bg-amber-100 text-stone-900 shadow-md ring-2 ring-amber-400/50'
                  : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700'
              }`}
            >
              <div
                className="w-3.5 h-3.5 rounded-full border border-stone-600 shadow-inner flex-shrink-0"
                style={{ backgroundColor: theme.accent }}
              />
              <span className="hidden md:inline">{theme.name}</span>
              <span className="md:hidden font-mono">#{theme.num}</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => setPaletteModalOpen(true)}
          className="p-1.5 rounded-full bg-stone-800 text-amber-300 hover:bg-stone-700 cursor-pointer transition-colors"
          title="Inspect All Swatches"
        >
          <Palette className="w-4 h-4" />
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 15. PALETTE & TYPOGRAPHY INSPECTOR MODAL                    */}
      {/* ─────────────────────────────────────────────────────────── */}
      {paletteModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
          onClick={() => setPaletteModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-main)'
            }}
            className="border rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8 font-body shadow-2xl space-y-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-4 border-b border-stone-300/30">
              <div>
                <h3 className="font-heading text-3xl">Color & Typography Architecture</h3>
                <p style={{ color: 'var(--text-muted)' }} className="text-xs mt-0.5">
                  Based on Design Engineering & Monochromatic OKLCH guidelines
                </p>
              </div>
              <button
                onClick={() => setPaletteModalOpen(false)}
                className="text-xs uppercase tracking-widest cursor-pointer hover:opacity-70"
              >
                Close [×]
              </button>
            </div>

            {/* 3 Directions Breakdown */}
            <div className="space-y-6">
              {THEMES.map(theme => (
                <div
                  key={theme.id}
                  style={{
                    backgroundColor: currentThemeId === theme.id ? 'var(--bg-subtle)' : 'transparent',
                    borderColor: currentThemeId === theme.id ? 'var(--accent-primary)' : 'var(--border-subtle)'
                  }}
                  className="p-5 rounded-2xl border transition-all space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-stone-200 dark:bg-stone-800">
                          Option {theme.num}
                        </span>
                        <h4 className="font-heading text-xl">{theme.name}</h4>
                        {currentThemeId === theme.id && (
                          <span style={{ color: 'var(--accent-primary)' }} className="text-[11px] font-bold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Active Live
                          </span>
                        )}
                      </div>
                      <p style={{ color: 'var(--text-muted)' }} className="text-xs mt-1">
                        {theme.vibe}
                      </p>
                    </div>

                    <button
                      onClick={() => setCurrentThemeId(theme.id)}
                      style={{
                        backgroundColor: currentThemeId === theme.id ? 'var(--accent-primary)' : 'var(--bg-surface)',
                        color: currentThemeId === theme.id ? '#FAF7F2' : 'var(--text-main)',
                        borderColor: 'var(--border-subtle)'
                      }}
                      className="px-4 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-wider cursor-pointer shadow-sm hover:opacity-90"
                    >
                      {currentThemeId === theme.id ? 'Applied' : 'Apply Theme'}
                    </button>
                  </div>

                  {/* Swatches strip */}
                  <div className="grid grid-cols-5 gap-2 pt-2">
                    {theme.swatches.map(sw => (
                      <div key={sw.name} className="space-y-1 text-center">
                        <div
                          className="h-10 rounded-lg border border-black/10 shadow-sm"
                          style={{ backgroundColor: sw.hex }}
                        />
                        <p className="text-[10px] font-semibold truncate">{sw.name}</p>
                        <p style={{ color: 'var(--text-muted)' }} className="text-[9px] font-mono">{sw.hex}</p>
                      </div>
                    ))}
                  </div>

                  {/* Font Specimen */}
                  <div style={{ color: 'var(--text-muted)' }} className="text-[11px] pt-2 border-t border-stone-300/20 flex justify-between">
                    <span><strong>Display:</strong> {theme.fontHeading.split(',')[0].replace(/'/g, '')}</span>
                    <span><strong>Body / UI:</strong> {theme.fontBody.split(',')[0].replace(/'/g, '')}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 text-center">
              <button
                onClick={() => setPaletteModalOpen(false)}
                style={{ backgroundColor: 'var(--accent-primary)', color: '#FAF7F2' }}
                className="px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest shadow-md hover:opacity-90 cursor-pointer"
              >
                Close & Return to Live Website
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

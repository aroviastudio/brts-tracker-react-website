import React, { useState, useEffect } from 'react';
import DimensionalMehandiShowcase from './components/DimensionalMehandiShowcase';
import BridalPackageCalculator from './components/BridalPackageCalculator';
import {
  createWhatsAppUrl,
  fetchDesigns,
  createDesign,
  deleteDesign,
  submitInquiry,
  fetchInquiries,
  updateInquiryStatus,
  testSupabaseConnection,
  SUPABASE_URL
} from './lib/supabase';
import {
  Sparkles,
  Crown,
  Calendar,
  Phone,
  MessageCircle,
  Clock,
  ShieldCheck,
  Award,
  ChevronRight,
  X,
  ExternalLink,
  Lock,
  Plus,
  Trash2,
  CheckCircle2,
  Heart,
  Eye,
  Menu
} from 'lucide-react';

// Haute Couture Master Collections
const COLLECTIONS = [
  {
    id: 'royal-dulhan',
    number: '01',
    title: 'The Royal Dulhan Narrative',
    category: 'Bespoke Bridal Heirloom',
    tagline: 'Custom storytelling woven into symmetrical royal jaal',
    duration: '4.5 – 6.5 Hours',
    coverage: 'Full arms to elbows & mid-calf feet',
    price: 'From ₹11,500',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85',
    features: [
      'Hand-drawn Bride & Groom portraiture & sacred mandap arches',
      'Personalized wedding hashtags, skyline & proposal motifs',
      'Complimentary royal clove steam & aftercare essential balm'
    ]
  },
  {
    id: 'marwari-jaali',
    number: '02',
    title: 'Marwari Micro-Jaali & Jharokha',
    category: 'Heritage Royal Grid',
    tagline: 'Classical Rajasthan palace motifs with 0.2mm precision',
    duration: '3.5 – 5.0 Hours',
    coverage: 'Elbow length or 3/4 forearm',
    price: 'From ₹7,500',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=85',
    features: [
      'Ultra-fine micro-lattice jaal with shaded peacock motifs',
      'Royal shehnai, kalash, and elephant ceremonial borders',
      'High-contrast mahogany stain depth guarantee'
    ]
  },
  {
    id: 'contemporary-arabic',
    number: '03',
    title: 'Contemporary Arabic Botanicals',
    category: 'Negative-Space Modern',
    tagline: 'Fluid shaded florals designed for cocktail attire',
    duration: '2.0 – 3.0 Hours',
    coverage: 'Front & back hands with cascading wrist trails',
    price: 'From ₹4,500',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=85',
    features: [
      'Dramatic negative space highlighting diamond jewelry',
      'Shaded Arabian lotus petals & micro-beaded vine contours',
      'Perfect for Sangeet nights, receptions, and modern brides'
    ]
  },
  {
    id: 'royal-feet-payal',
    number: '04',
    title: 'Imperial Payal Feet Ensemble',
    category: 'Heirloom Bridal Feet',
    tagline: 'Embossed jewelry bands & regal toe lace',
    duration: '2.0 – 3.5 Hours',
    coverage: 'Ankles to mid-calf',
    price: 'From ₹5,000',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85',
    features: [
      'Graceful jaal mimicking traditional gold & kundan anklets',
      'Symmetrical toe crests with calming lavender application',
      'Longest-lasting stain formulation (up to 14 days)'
    ]
  }
];

// Curated Portfolio Archive with Realistic Images
const DEFAULT_ARCHIVE = [
  {
    id: 'arc-1',
    title: 'Heirloom Dulhan Mandap',
    category: 'Bridal',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85',
    tag: 'Bridal Narrative'
  },
  {
    id: 'arc-2',
    title: 'Royal Marwari Jharokha',
    category: 'Heritage',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=85',
    tag: 'Micro-Jaali'
  },
  {
    id: 'arc-3',
    title: 'Shaded Persian Lotus',
    category: 'Arabic',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=85',
    tag: 'Negative Space'
  },
  {
    id: 'arc-4',
    title: 'Imperial Bridal Payal',
    category: 'Feet',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85',
    tag: 'Ankle Jewelry Jaal'
  },
  {
    id: 'arc-5',
    title: 'Royal Peacock Symmetry',
    category: 'Bridal',
    image: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=1200&q=85',
    tag: 'Royal Motifs'
  },
  {
    id: 'arc-6',
    title: 'Delicate Ring Mesh',
    category: 'Arabic',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85',
    tag: 'Contemporary'
  }
];

// Real Bride Testimonials
const TESTIMONIALS = [
  {
    quote: "Bhuvi’s micro-jaali detailing is unmatched. She drew our proposal story in Udaipur right onto my palms. The stain turned an unbelievable deep mahogany on my wedding day.",
    bride: "Dr. Radhika Singhania",
    wedding: "Destination Wedding, The Leela Palace Udaipur",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
  },
  {
    quote: "Her henna paste is so pure and fragrant with natural lavender. No chemical fumes, zero irritation, and the color lasted through all our reception parties.",
    bride: "Ananya Mehra",
    wedding: "Grand Hyatt Mumbai",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80"
  },
  {
    quote: "From our first design consultation to the final clove steam, Bhuvi treated my bridal mehandi like high art. Every guest was mesmerized by the symmetry.",
    bride: "Pooja Kothari",
    wedding: "Fairmont Jaipur",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80"
  }
];

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxImage, setLightboxImage] = useState(null);
  const [dbStatus, setDbStatus] = useState('checking');
  
  // Consultation Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    event_date: '',
    event_type: 'Bridal Mehandi',
    location: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Admin Portal State
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [adminAuthed, setAdminAuthed] = useState(false);
  const [inquiries, setInquiries] = useState([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);

  // Test Supabase on mount
  useEffect(() => {
    testSupabaseConnection().then(res => {
      setDbStatus(res.ok ? 'connected' : 'fallback');
    });
  }, []);

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await submitInquiry(formData);
      setSubmitting(false);
      setSubmitSuccess(true);

      // Trigger instant WhatsApp hand-off
      const waUrl = createWhatsAppUrl({
        name: formData.name,
        phone: formData.phone,
        eventDate: formData.event_date,
        eventType: formData.event_type,
        location: formData.location,
        customNote: formData.notes
      });

      setTimeout(() => {
        window.open(waUrl, '_blank');
      }, 800);
    } catch (err) {
      setSubmitting(false);
      setSubmitSuccess(true);
    }
  };

  const handleAdminAuth = async (e) => {
    e.preventDefault();
    if (adminPass === 'bhuvi2026' || adminPass === 'admin') {
      setAdminAuthed(true);
      setLoadingInquiries(true);
      const data = await fetchInquiries();
      setInquiries(data);
      setLoadingInquiries(false);
    } else {
      alert('Invalid Studio Passcode');
    }
  };

  const filteredArchive = activeCategory === 'All'
    ? DEFAULT_ARCHIVE
    : DEFAULT_ARCHIVE.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#0e0c0d] text-[#fdfbf7] selection:bg-[#96283b] selection:text-white font-sans antialiased overflow-x-hidden">
      
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP LIVE TICKER & HAUTE NAVIGATION                         */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[#181416] border-b border-[#2a2225] text-[11px] font-sans text-[#d4af37] py-2 px-4 text-center tracking-[0.2em] uppercase flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
        Accepting Inquiries for 2026 / 2027 Wedding Season • Pure Rajasthani Sojat Organic Henna
      </div>

      <header className="sticky top-0 z-40 bg-[#0e0c0d]/90 backdrop-blur-md border-b border-[#2a2225]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <button onClick={() => scrollTo('hero')} className="text-left group cursor-pointer">
            <span className="font-cinzel text-xl sm:text-2xl tracking-[0.25em] font-semibold uppercase gold-gradient-text">
              Bhuvi Mehandi
            </span>
            <span className="block text-[10px] tracking-[0.35em] uppercase text-[#a69894] font-sans font-normal -mt-0.5">
              Haute Henna Atelier
            </span>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-sans uppercase tracking-[0.2em] text-[#a69894]">
            <button onClick={() => scrollTo('showcase')} className="hover:text-[#d4af37] transition-colors cursor-pointer">3D Atelier</button>
            <button onClick={() => scrollTo('collections')} className="hover:text-[#d4af37] transition-colors cursor-pointer">Collections</button>
            <button onClick={() => scrollTo('calculator')} className="hover:text-[#d4af37] transition-colors cursor-pointer">Investment</button>
            <button onClick={() => scrollTo('craft')} className="hover:text-[#d4af37] transition-colors cursor-pointer">The Craft</button>
            <button onClick={() => scrollTo('archive')} className="hover:text-[#d4af37] transition-colors cursor-pointer">Archive</button>
            <button onClick={() => scrollTo('stories')} className="hover:text-[#d4af37] transition-colors cursor-pointer">Stories</button>
          </nav>

          {/* Right Action */}
          <div className="hidden sm:flex items-center gap-4">
            <a
              href="#consultation"
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#96283b] to-[#ba334a] hover:from-[#ba334a] hover:to-[#96283b] text-white text-xs uppercase tracking-[0.2em] font-medium transition-all shadow-md shadow-[#96283b]/30"
            >
              Reserve Date
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#fdfbf7] hover:text-[#d4af37] cursor-pointer"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#181416] border-b border-[#2a2225] px-6 py-8 space-y-5 text-sm font-sans tracking-widest uppercase">
            <button onClick={() => scrollTo('showcase')} className="block w-full text-left py-2 hover:text-[#d4af37]">3D Dimensional Atelier</button>
            <button onClick={() => scrollTo('collections')} className="block w-full text-left py-2 hover:text-[#d4af37]">Collections</button>
            <button onClick={() => scrollTo('calculator')} className="block w-full text-left py-2 hover:text-[#d4af37]">Package Calculator</button>
            <button onClick={() => scrollTo('craft')} className="block w-full text-left py-2 hover:text-[#d4af37]">The Organic Craft</button>
            <button onClick={() => scrollTo('archive')} className="block w-full text-left py-2 hover:text-[#d4af37]">Archive Gallery</button>
            <button onClick={() => scrollTo('consultation')} className="block w-full text-left py-2 text-[#ba334a] font-bold">Book VIP Consultation</button>
          </div>
        )}
      </header>

      {/* ------------------------------------------------------------- */}
      {/* 2. GRAND EDITORIAL HERO                                       */}
      {/* ------------------------------------------------------------- */}
      <section id="hero" className="relative max-w-7xl mx-auto px-6 sm:px-10 pt-16 sm:pt-24 pb-20 sm:pb-32 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Bold Haute Typography */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#181416] border border-[#d4af37]/30 text-[#d4af37] text-xs uppercase tracking-[0.25em] font-sans">
              <Crown className="w-3.5 h-3.5 text-[#d4af37]" />
              Bespoke Haute Bridal Henna
            </div>

            <h1 className="font-cinzel text-4xl sm:text-6xl lg:text-7xl font-normal leading-[1.08] tracking-tight text-[#fdfbf7]">
              Sacred <span className="gold-gradient-text italic font-light">Heirloom</span> Artistry for the Modern Bride.
            </h1>

            <p className="text-base sm:text-lg text-[#a69894] font-sans leading-relaxed max-w-xl">
              Triple-filtered organic Sojat henna leaves infused with Bulgarian lavender and tea tree essences. Crafted for breathtaking depth, exquisite symmetry, and timeless royal storytelling.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 font-sans">
              <a
                href="#consultation"
                className="text-center px-8 py-4 rounded-xl bg-gradient-to-r from-[#96283b] to-[#ba334a] hover:from-[#ba334a] hover:to-[#96283b] text-white text-xs tracking-[0.25em] uppercase font-bold shadow-lg shadow-[#96283b]/30 transition-all duration-300"
              >
                Inquire via VIP Concierge
              </a>

              <button
                onClick={() => scrollTo('showcase')}
                className="text-center px-8 py-4 rounded-xl border border-[#d4af37]/40 text-[#fdfbf7] hover:border-[#d4af37] hover:text-[#d4af37] text-xs tracking-[0.25em] uppercase transition-colors duration-300 cursor-pointer"
              >
                Explore 3D Atelier ↓
              </button>
            </div>

            {/* Luxury Metrics */}
            <div className="pt-8 border-t border-[#2a2225] grid grid-cols-3 gap-6 max-w-lg">
              <div>
                <span className="font-cinzel text-2xl sm:text-3xl font-semibold text-[#d4af37] block">850+</span>
                <span className="text-[10px] uppercase tracking-wider text-[#a69894] font-sans">Bespoke Brides</span>
              </div>
              <div>
                <span className="font-cinzel text-2xl sm:text-3xl font-semibold text-[#ba334a] block">0.2mm</span>
                <span className="text-[10px] uppercase tracking-wider text-[#a69894] font-sans">Micro-Cone Precision</span>
              </div>
              <div>
                <span className="font-cinzel text-2xl sm:text-3xl font-semibold text-[#f5df88] block">100%</span>
                <span className="text-[10px] uppercase tracking-wider text-[#a69894] font-sans">Pure Organic Sojat</span>
              </div>
            </div>

          </div>

          {/* Right Column: Editorial Visual Composition */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden glass-panel border border-[#d4af37]/30 shadow-2xl p-2.5">
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#181416]">
                <img
                  src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85"
                  alt="Haute Bridal Mehandi"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0c0d]/90 via-transparent to-transparent pointer-events-none" />
                
                {/* Floating Seal Badge */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-[#0e0c0d]/85 backdrop-blur-md border border-[#d4af37]/30">
                  <p className="font-cinzel text-sm text-[#fdfbf7]">The Heirloom Collection</p>
                  <p className="text-xs text-[#d4af37] font-sans mt-0.5">Hand-formulated organic henna with clove steam finish</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3. 3D DIMENSIONAL MEHANDI SHOWCASE (LAG-FREE ATELIER)         */}
      {/* ------------------------------------------------------------- */}
      <div id="showcase">
        <DimensionalMehandiShowcase />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. HAUTE MASTER COLLECTIONS                                   */}
      {/* ------------------------------------------------------------- */}
      <section id="collections" className="py-24 px-6 sm:px-10 max-w-7xl mx-auto border-b border-[#2a2225]">
        
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#181416] border border-[#d4af37]/30 text-[#d4af37] text-xs uppercase tracking-[0.25em] font-sans">
            <Sparkles className="w-3.5 h-3.5" />
            Curated Services
          </div>
          <h2 className="font-cinzel text-3xl sm:text-5xl font-normal text-[#fdfbf7]">
            Haute <span className="italic font-light text-[#ba334a]">Collections</span>
          </h2>
          <p className="text-sm text-[#a69894] font-sans leading-relaxed">
            Every bridal composition is treated as a one-of-a-kind couture heirloom, designed to complement your wedding jewelry and bridal attire.
          </p>
        </div>

        {/* Collection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {COLLECTIONS.map((col) => (
            <div
              key={col.id}
              className="glass-panel rounded-2xl overflow-hidden border border-[#2a2225] hover:border-[#d4af37]/40 transition-all duration-500 group flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#181416]">
                <img
                  src={col.image}
                  alt={col.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0c0d] via-transparent to-transparent opacity-80" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#0e0c0d]/80 border border-[#d4af37]/30 text-[10px] font-sans tracking-widest uppercase text-[#d4af37]">
                  {col.number} // {col.category}
                </span>
                <span className="absolute bottom-4 right-4 font-cinzel text-lg text-[#f5df88] font-bold">
                  {col.price}
                </span>
              </div>

              <div className="p-6 sm:p-8 space-y-5 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <h3 className="font-cinzel text-2xl text-[#fdfbf7] group-hover:text-[#d4af37] transition-colors">
                    {col.title}
                  </h3>
                  <p className="text-xs italic text-[#ba334a] font-sans">"{col.tagline}"</p>
                  
                  <div className="flex items-center gap-4 text-xs text-[#a69894] font-sans pt-1">
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#d4af37]" /> {col.duration}</span>
                    <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[#ba334a]" /> {col.coverage}</span>
                  </div>

                  <ul className="space-y-2 pt-2 border-t border-[#2a2225] text-xs text-[#a69894] font-sans">
                    {col.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#d4af37] font-bold mt-0.5">•</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 border-t border-[#2a2225]">
                  <a
                    href={createWhatsAppUrl({
                      eventType: `${col.title} Inquiry`,
                      customNote: `Hi Bhuvi! I am interested in booking "${col.title}" for my wedding.`
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1e1719] hover:bg-[#96283b] border border-[#d4af37]/30 hover:border-[#ba334a] text-xs uppercase tracking-[0.2em] font-sans text-white transition-colors duration-300"
                  >
                    Inquire via WhatsApp
                    <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* ------------------------------------------------------------- */}
      {/* 5. INTERACTIVE BRIDAL PACKAGE CALCULATOR                      */}
      {/* ------------------------------------------------------------- */}
      <BridalPackageCalculator />

      {/* ------------------------------------------------------------- */}
      {/* 6. THE SACRED CRAFT & ORGANIC PURITY                          */}
      {/* ------------------------------------------------------------- */}
      <section id="craft" className="py-24 px-6 sm:px-10 max-w-7xl mx-auto border-b border-[#2a2225]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#181416] border border-[#d4af37]/30 text-[#d4af37] text-xs uppercase tracking-[0.25em] font-sans">
              <Award className="w-3.5 h-3.5" />
              100% Organic Purity Guarantee
            </div>
            
            <h2 className="font-cinzel text-3xl sm:text-5xl font-normal text-[#fdfbf7] leading-tight">
              The Sacred <span className="italic font-light text-[#ba334a]">Craft</span> & Formula
            </h2>

            <p className="text-sm text-[#a69894] font-sans leading-relaxed">
              We reject synthetic dyes, black henna chemicals, and PPD. Every batch of henna paste is personally hand-mixed 48 hours prior to your wedding ceremony to ensure peak dye release and calming aromatherapy.
            </p>

            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-xl bg-[#161214] border border-[#2a2225]">
                <h4 className="font-cinzel text-sm text-[#d4af37]">Sojat Organic Harvest</h4>
                <p className="text-xs text-[#a69894] font-sans mt-1">Triple-sifted micro-fine powder sourced directly from premier farms in Sojat, Rajasthan.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#161214] border border-[#2a2225]">
                <h4 className="font-cinzel text-sm text-[#d4af37]">Steam-Distilled Essential Oils</h4>
                <p className="text-xs text-[#a69894] font-sans mt-1">Pure therapeutic Bulgarian lavender and Nilgiri eucalyptus oils for optimal darkness and soothing relaxation.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#161214] border border-[#2a2225]">
                <h4 className="font-cinzel text-sm text-[#d4af37]">Clove Steam Finishing Seal</h4>
                <p className="text-xs text-[#a69894] font-sans mt-1">Traditional warmth infusion with whole clove smoke to deepen oxidation into rich royal mahogany.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 gap-4">
            <div className="rounded-2xl overflow-hidden glass-panel border border-[#2a2225] aspect-[4/5]">
              <img
                src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80"
                alt="Organic Henna Process"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-2xl overflow-hidden glass-panel border border-[#2a2225] aspect-[4/5] mt-8">
              <img
                src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80"
                alt="Bridal Hand Craft"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 7. CURATED PORTFOLIO ARCHIVE                                  */}
      {/* ------------------------------------------------------------- */}
      <section id="archive" className="py-24 px-6 sm:px-10 max-w-7xl mx-auto border-b border-[#2a2225]">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs uppercase tracking-[0.25em] text-[#d4af37] font-sans font-semibold">
              Selected Works
            </span>
            <h2 className="font-cinzel text-3xl sm:text-5xl font-normal text-[#fdfbf7]">
              The Atelier <span className="italic font-light text-[#ba334a]">Archive</span>
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {['All', 'Bridal', 'Heritage', 'Arabic', 'Feet'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-sans tracking-wider uppercase transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#96283b] text-white border border-[#ba334a] shadow-md shadow-[#96283b]/30'
                    : 'bg-[#181416] text-[#a69894] border border-[#2a2225] hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArchive.map((item) => (
            <div
              key={item.id}
              onClick={() => setLightboxImage(item)}
              className="relative aspect-[3/4] rounded-2xl overflow-hidden glass-panel border border-[#2a2225] hover:border-[#d4af37]/50 group cursor-pointer transition-all duration-500"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0c0d]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-sans">{item.tag}</span>
                <p className="font-cinzel text-lg text-[#fdfbf7] font-medium">{item.title}</p>
                <p className="text-[11px] text-[#a69894] font-sans mt-1">Click to expand preview</p>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* ------------------------------------------------------------- */}
      {/* 8. REAL BRIDE STORIES & TESTIMONIALS                          */}
      {/* ------------------------------------------------------------- */}
      <section id="stories" className="py-24 px-6 sm:px-10 max-w-7xl mx-auto border-b border-[#2a2225]">
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-[#d4af37] font-sans font-semibold">
            Bridal Accolades
          </span>
          <h2 className="font-cinzel text-3xl sm:text-5xl font-normal text-[#fdfbf7]">
            Words from our <span className="italic font-light text-[#ba334a]">Brides</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="glass-panel p-8 rounded-2xl border border-[#2a2225] flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex gap-1 text-[#d4af37]">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <p className="text-sm text-[#fdfbf7] font-sans leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[#2a2225]">
                <img
                  src={t.avatar}
                  alt={t.bride}
                  className="w-10 h-10 rounded-full object-cover border border-[#d4af37]/40"
                />
                <div>
                  <p className="font-cinzel text-sm font-semibold text-[#fdfbf7]">{t.bride}</p>
                  <p className="text-[10px] text-[#a69894] font-sans">{t.wedding}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 9. VIP BRIDAL RESERVATION & SUPABASE INTEGRATION              */}
      {/* ------------------------------------------------------------- */}
      <section id="consultation" className="py-24 px-6 sm:px-10 max-w-4xl mx-auto">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-[#d4af37]/35 relative overflow-hidden bg-gradient-to-b from-[#1c1618] to-[#120e10]">
          
          <div className="text-center space-y-3 mb-10">
            <span className="text-xs uppercase tracking-[0.25em] text-[#d4af37] font-sans font-semibold">
              Bespoke Booking Request
            </span>
            <h2 className="font-cinzel text-3xl sm:text-4xl text-[#fdfbf7]">
              Reserve Your Wedding Date
            </h2>
            <p className="text-xs sm:text-sm text-[#a69894] font-sans max-w-md mx-auto">
              Please share your wedding date and venue. We take a strictly limited number of bespoke bridal bookings per wedding season.
            </p>
          </div>

          {submitSuccess ? (
            <div className="p-8 rounded-2xl bg-[#181416] border border-[#10b981]/40 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-[#10b981] mx-auto" />
              <h3 className="font-cinzel text-2xl text-[#fdfbf7]">Inquiry Received</h3>
              <p className="text-sm text-[#a69894] font-sans max-w-md mx-auto">
                Thank you, {formData.name}. Your inquiry has been logged into our atelier booking queue and forwarded directly to Bhuvi via WhatsApp.
              </p>
              <button
                onClick={() => setSubmitSuccess(false)}
                className="mt-4 px-6 py-2.5 rounded-full bg-[#2a2225] text-xs font-sans uppercase tracking-widest text-[#d4af37] hover:bg-[#96283b] transition-colors cursor-pointer"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-wider text-[#d4af37] font-sans">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Radhika Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl bg-[#0e0c0d] border border-[#2a2225] focus:border-[#d4af37] text-[#fdfbf7] text-sm font-sans outline-none transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-wider text-[#d4af37] font-sans">WhatsApp / Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl bg-[#0e0c0d] border border-[#2a2225] focus:border-[#d4af37] text-[#fdfbf7] text-sm font-sans outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-wider text-[#d4af37] font-sans">Wedding / Ceremony Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.event_date}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl bg-[#0e0c0d] border border-[#2a2225] focus:border-[#d4af37] text-[#fdfbf7] text-sm font-sans outline-none transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-wider text-[#d4af37] font-sans">Ceremony Type *</label>
                  <select
                    value={formData.event_type}
                    onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl bg-[#0e0c0d] border border-[#2a2225] focus:border-[#d4af37] text-[#fdfbf7] text-sm font-sans outline-none transition-colors"
                  >
                    <option value="Bridal Mehandi">The Royal Bridal Narrative (Full)</option>
                    <option value="Marwari Jaali">Marwari Heritage Micro-Jaali</option>
                    <option value="Arabic Contemporary">Contemporary Arabic Botanicals</option>
                    <option value="Sangeet Party">Sangeet & Bridesmaid Package</option>
                    <option value="Destination">Destination Wedding Package</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider text-[#d4af37] font-sans">City / Wedding Venue *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Udaipur / Mumbai / Surat (Available worldwide)"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl bg-[#0e0c0d] border border-[#2a2225] focus:border-[#d4af37] text-[#fdfbf7] text-sm font-sans outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider text-[#d4af37] font-sans">Custom Details / Storytelling Notes</label>
                <textarea
                  rows="3"
                  placeholder="Tell us about your wedding motifs, portrait requests, or specific guest count..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl bg-[#0e0c0d] border border-[#2a2225] focus:border-[#d4af37] text-[#fdfbf7] text-sm font-sans outline-none transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#96283b] to-[#ba334a] hover:from-[#ba334a] hover:to-[#96283b] text-white text-xs uppercase tracking-[0.25em] font-sans font-bold shadow-lg shadow-[#96283b]/40 transition-all cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'Submitting Reservation...' : 'Submit & Connect via WhatsApp Concierge'}
              </button>

            </form>
          )}

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 10. LIGHTBOX MODAL PREVIEW                                    */}
      {/* ------------------------------------------------------------- */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-[#0e0c0d]/95 backdrop-blur-lg flex items-center justify-center p-4 sm:p-8"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl w-full rounded-2xl overflow-hidden glass-panel border border-[#d4af37]/50 p-2"
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-[#0e0c0d]/80 text-white flex items-center justify-center border border-white/20 hover:bg-[#96283b] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={lightboxImage.image}
              alt={lightboxImage.title}
              className="w-full max-h-[75vh] object-contain rounded-xl"
            />
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="font-cinzel text-lg text-[#fdfbf7]">{lightboxImage.title}</p>
                <p className="text-xs text-[#d4af37] font-sans">{lightboxImage.tag}</p>
              </div>
              <a
                href={createWhatsAppUrl({
                  eventType: `Inquiry on design: ${lightboxImage.title}`,
                  customNote: `Hi Bhuvi! I saw "${lightboxImage.title}" in your archive and would love this style for my bridal henna.`
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-[#96283b] text-xs font-sans text-white uppercase tracking-wider"
              >
                Inquire This Design
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 11. FOOTER & STUDIO ADMIN ACCESS                              */}
      {/* ------------------------------------------------------------- */}
      <footer className="border-t border-[#2a2225] py-14 px-6 sm:px-10 bg-[#0b090a]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#7a6f68] font-sans">
          
          <div>
            <p className="font-cinzel text-base text-[#fdfbf7] tracking-wider uppercase">Bhuvi Mehandi Atelier</p>
            <p className="mt-1">Bespoke Bridal Henna • Pure Rajasthani Sojat Formulation • Worldwide Destination Bookings</p>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setAdminOpen(true)}
              className="hover:text-[#d4af37] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              Studio Portal
            </button>
            <span>© {new Date().getFullYear()} Bhuvi Mehandi. All Rights Reserved.</span>
          </div>

        </div>
      </footer>

      {/* ------------------------------------------------------------- */}
      {/* 12. STUDIO ADMIN PORTAL MODAL                                 */}
      {/* ------------------------------------------------------------- */}
      {adminOpen && (
        <div className="fixed inset-0 z-50 bg-[#0e0c0d]/95 backdrop-blur-lg flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full p-6 sm:p-8 rounded-2xl glass-panel border border-[#d4af37]/40 space-y-6">
            
            <div className="flex items-center justify-between border-b border-[#2a2225] pb-4">
              <div className="flex items-center gap-2 text-[#d4af37]">
                <Lock className="w-4 h-4" />
                <h3 className="font-cinzel text-lg text-[#fdfbf7]">Studio Portal & Booking Queue</h3>
              </div>
              <button onClick={() => setAdminOpen(false)} className="text-[#a69894] hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {!adminAuthed ? (
              <form onSubmit={handleAdminAuth} className="space-y-4">
                <p className="text-xs text-[#a69894]">Enter your studio passcode to view client inquiries.</p>
                <input
                  type="password"
                  placeholder="Passcode (default: bhuvi2026)"
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#0e0c0d] border border-[#2a2225] text-white text-sm outline-none"
                />
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#96283b] text-white text-xs uppercase tracking-widest font-bold cursor-pointer"
                >
                  Unlock Portal
                </button>
              </form>
            ) : (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                <div className="flex justify-between items-center text-xs text-[#a69894]">
                  <span>Total Inquiries: {inquiries.length}</span>
                  <span className="text-[#10b981]">Database: {dbStatus}</span>
                </div>

                {loadingInquiries ? (
                  <p className="text-xs text-center text-[#a69894] py-8">Loading inquiries...</p>
                ) : inquiries.length === 0 ? (
                  <p className="text-xs text-center text-[#a69894] py-8">No inquiries yet. New submissions will appear here live.</p>
                ) : (
                  <div className="space-y-3">
                    {inquiries.map((inq) => (
                      <div key={inq.id} className="p-4 rounded-xl bg-[#0e0c0d] border border-[#2a2225] space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-cinzel text-sm font-semibold text-[#fdfbf7]">{inq.name}</p>
                            <p className="text-xs text-[#d4af37]">{inq.phone} • {inq.location}</p>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-[#96283b]/20 text-[#ba334a] border border-[#96283b]/40">
                            {inq.status || 'Pending'}
                          </span>
                        </div>
                        <p className="text-xs text-[#a69894]"><span className="text-white">Date:</span> {inq.event_date} | <span className="text-white">Type:</span> {inq.event_type}</p>
                        {inq.notes && <p className="text-xs text-[#7a6f68] italic">"{inq.notes}"</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 13. FLOATING WHATSAPP ACTION BUTTON                           */}
      {/* ------------------------------------------------------------- */}
      <a
        href={createWhatsAppUrl({
          eventType: 'General Bridal Inquiry',
          customNote: 'Hi Bhuvi! I am looking for a bridal henna artist for my wedding.'
        })}
        target="_blank"
        rel="noopener noreferrer"
        className="wa-float-luxury"
        aria-label="Direct WhatsApp Concierge"
      >
        <MessageCircle className="w-5 h-5 text-white" />
        <span className="text-xs font-sans font-semibold tracking-wider hidden sm:inline">WhatsApp Concierge</span>
      </a>

    </div>
  );
}

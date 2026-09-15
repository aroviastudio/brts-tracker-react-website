import React, { useState, useEffect } from 'react';
import MehandiHeroHand from './components/MehandiHeroHand';
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

// Minimalist curated services with elevated titles
const SERVICES = [
  {
    id: 'bridal-narrative',
    number: '01',
    title: 'The Bridal Narrative',
    category: 'Bridal',
    tagline: 'Full-length bespoke heirloom henna',
    description: 'Custom storytelling hand-drawn up to the elbows and mid-calf. Incorporates personalized bride-groom portraiture, temple jharokhas, and meaningful motifs woven into intricate symmetry.',
    duration: '4 – 6 Hours',
    price: 'From ₹8,500',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85',
    details: ['Full arms to elbows & feet to mid-calf', 'Hand-drawn portraiture & hashtags', 'Clove steam & aftercare balm included']
  },
  {
    id: 'contemporary-arabic',
    number: '02',
    title: 'Contemporary Arabic',
    category: 'Arabic',
    tagline: 'Fluid botanicals & negative space',
    description: 'Striking shaded floral trails, cascading vines, and architectural wrist cuffs designed to pair effortlessly with modern reception lehengas and cocktail attire.',
    duration: '1.5 – 2.5 Hours',
    price: 'From ₹2,500',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=85',
    details: ['Front & back delicate botanical trails', 'Negative-space finger lace', 'Deep stain organic paste']
  },
  {
    id: 'rajasthani-heritage',
    number: '03',
    title: 'Rajasthani Heritage',
    category: 'Heritage',
    tagline: 'Classical Marwari micro-jaali',
    description: 'Time-honored Indian royal jaal, shehnai, peacocks, and micro-grid shading executed with ultra-fine cone precision for an unforgettable, rich mahogany stain.',
    duration: '3.5 – 5 Hours',
    price: 'From ₹5,500',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=85',
    details: ['Micro-line jaali detailing', 'Traditional royal peacocks & kalash', 'Rich mahogany stain guarantee']
  },
  {
    id: 'soiree-celebrations',
    number: '04',
    title: 'The Sangeet Soirée',
    category: 'Event',
    tagline: 'Bridal party & guest curation',
    description: 'Bespoke speed-artistry for bridesmaids, mothers, and guests during Sangeet nights or intimate mehandi parties. Fast, unique, and impeccably neat application.',
    duration: 'Custom (2 – 6 Hours)',
    price: 'Hourly or Per Hand',
    image: 'https://images.unsplash.com/photo-1516914943479-89db7d9ae7f2?auto=format&fit=crop&w=1200&q=85',
    details: ['Multiple artists team available', 'Curated quick designs (5-8 mins/hand)', 'All organic materials provided']
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('all');
  const [designs, setDesigns] = useState([]);
  const [loadingDesigns, setLoadingDesigns] = useState(true);
  const [selectedDesign, setSelectedDesign] = useState(null);

  // Inquiry Form State
  const [form, setForm] = useState({
    name: '',
    phone: '',
    eventDate: '',
    eventType: 'Bespoke Bridal',
    cityVenue: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Studio Admin Drawer State
  const [adminOpen, setAdminOpen] = useState(false);
  const [inquiries, setInquiries] = useState([]);
  const [dbStatus, setDbStatus] = useState(null);
  const [newDesign, setNewDesign] = useState({
    title: '',
    category: 'bridal',
    imageUrl: '',
    description: '',
    priceRange: ''
  });
  const [addingDesign, setAddingDesign] = useState(false);

  // Mobile navigation drawer
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadDesigns();
  }, []);

  const loadDesigns = async () => {
    setLoadingDesigns(true);
    try {
      const data = await fetchDesigns();
      setDesigns(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingDesigns(false);
    }
  };

  const loadAdminData = async () => {
    try {
      const [inqData, status] = await Promise.all([
        fetchInquiries(),
        testSupabaseConnection()
      ]);
      setInquiries(inqData);
      setDbStatus(status);
    } catch (e) {
      console.error(e);
    }
  };

  const openAdmin = () => {
    setAdminOpen(true);
    loadAdminData();
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    setSubmitting(true);
    try {
      await submitInquiry({
        name: form.name,
        phone: form.phone,
        event_date: form.eventDate,
        event_type: form.eventType,
        city_venue: form.cityVenue,
        message: form.message
      });
      setSubmitted(true);
      // Auto open WhatsApp with formatted message
      const url = createWhatsAppUrl({
        name: form.name,
        phone: form.phone,
        eventDate: form.eventDate,
        eventType: form.eventType,
        cityVenue: form.cityVenue,
        customNote: form.message
      });
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddDesignSubmit = async (e) => {
    e.preventDefault();
    if (!newDesign.title || !newDesign.imageUrl) return;
    setAddingDesign(true);
    try {
      const res = await createDesign(newDesign);
      setDesigns((prev) => [res.design, ...prev]);
      setNewDesign({ title: '', category: 'bridal', imageUrl: '', description: '', priceRange: '' });
      alert('Design added successfully!');
    } catch (err) {
      alert('Failed to add design: ' + err.message);
    } finally {
      setAddingDesign(false);
    }
  };

  const handleDeleteDesign = async (id) => {
    if (!confirm('Are you sure you want to delete this design?')) return;
    await deleteDesign(id);
    setDesigns((prev) => prev.filter((d) => d.id !== id));
  };

  const handleStatusUpdate = async (id, status) => {
    await updateInquiryStatus(id, status);
    setInquiries((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
  };

  const filteredDesigns = activeTab === 'all'
    ? designs
    : designs.filter((d) => d.category.toLowerCase() === activeTab.toLowerCase());

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#fafaf8] text-[#111111] antialiased selection:bg-[#8b1a2d] selection:text-white">
      {/* ------------------------------------------------------------- */}
      {/* MINIMALIST TOP NAVIGATION                                     */}
      {/* ------------------------------------------------------------- */}
      <header className="sticky top-0 z-40 bg-[#fafaf8]/90 backdrop-blur-md border-b border-[#e5e5e0] transition-colors">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 h-20 flex items-center justify-between">
          <button
            onClick={() => scrollTo('hero')}
            className="text-left group cursor-pointer"
          >
            <span className="display text-xl sm:text-2xl tracking-[0.2em] font-medium uppercase text-[#111111]">
              Bhuvi Mehandi
            </span>
            <span className="block text-[10px] tracking-[0.3em] uppercase text-[#777777] font-sans font-normal -mt-0.5">
              Artistry Studio
            </span>
          </button>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center space-x-10 text-xs tracking-[0.18em] uppercase font-sans text-[#444444]">
            <button onClick={() => scrollTo('services')} className="hover:text-[#111111] transition-colors cursor-pointer">
              Services
            </button>
            <button onClick={() => scrollTo('works')} className="hover:text-[#111111] transition-colors cursor-pointer">
              Selected Works
            </button>
            <button onClick={() => scrollTo('about')} className="hover:text-[#111111] transition-colors cursor-pointer">
              About
            </button>
            <button onClick={() => scrollTo('contact')} className="hover:text-[#111111] transition-colors cursor-pointer">
              Inquire
            </button>
          </nav>

          {/* WhatsApp Direct Link */}
          <div className="hidden sm:flex items-center">
            <a
              href={createWhatsAppUrl({ customNote: 'Hello Bhuvi, I would like to inquire about wedding mehandi dates.' })}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs tracking-[0.18em] uppercase font-sans px-5 py-2.5 border border-[#111111] hover:bg-[#111111] hover:text-[#fafaf8] transition-all duration-300"
            >
              WhatsApp
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-xs tracking-[0.2em] uppercase font-sans text-[#111111] py-2 cursor-pointer"
          >
            {mobileMenuOpen ? 'Close' : 'Menu'}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[#e5e5e0] bg-[#fafaf8] px-6 py-8 space-y-6 text-sm tracking-[0.2em] uppercase font-sans">
            <div>
              <button onClick={() => scrollTo('services')} className="block w-full text-left py-2 text-[#333333]">
                Services
              </button>
            </div>
            <div>
              <button onClick={() => scrollTo('works')} className="block w-full text-left py-2 text-[#333333]">
                Selected Works
              </button>
            </div>
            <div>
              <button onClick={() => scrollTo('about')} className="block w-full text-left py-2 text-[#333333]">
                About Bhuvi
              </button>
            </div>
            <div>
              <button onClick={() => scrollTo('contact')} className="block w-full text-left py-2 text-[#333333]">
                Inquire & Reserve
              </button>
            </div>
            <div className="pt-4 border-t border-[#e5e5e0]">
              <a
                href={createWhatsAppUrl({ customNote: 'Hello Bhuvi, I want to inquire about booking my mehandi.' })}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full text-center py-3 bg-[#111111] text-[#fafaf8] text-xs tracking-[0.2em] uppercase font-sans"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        )}
      </header>

      {/* ------------------------------------------------------------- */}
      {/* 3D INTERACTIVE MEHANDI HAND HERO (THREE.JS + GSAP)            */}
      {/* ------------------------------------------------------------- */}
      <MehandiHeroHand />

      {/* ------------------------------------------------------------- */}
      {/* HERO SECTION                                                  */}
      {/* ------------------------------------------------------------- */}
      <section id="hero" className="max-w-7xl mx-auto px-6 sm:px-10 pt-16 sm:pt-24 pb-20 sm:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Bold Editorial Typography */}
          <div className="lg:col-span-7 space-y-8">
            <p className="text-xs tracking-[0.25em] uppercase text-[#777777] font-sans">
              Bespoke Bridal & Event Henna
            </p>

            <h1 className="display text-5xl sm:text-7xl lg:text-8xl font-normal leading-[1.02] tracking-[-0.02em] text-[#111111]">
              Henna artistry, <br />
              <span className="italic font-light text-[#8b1a2d]">refined</span> for the <br />
              modern bride.
            </h1>

            <p className="text-base sm:text-lg text-[#555555] font-light max-w-xl leading-relaxed font-sans">
              Hand-formulated with 100% pure organic Rajasthani Sojat leaf and steam-distilled lavender oil.
              Thoughtful, intricate compositions tailored to your wedding story.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-5 font-sans">
              <a
                href={createWhatsAppUrl({
                  eventType: 'Bridal Henna Inquiry',
                  customNote: 'Hi Bhuvi! I am planning my wedding and would love to reserve my date.'
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto text-center px-8 py-4 bg-[#111111] text-[#fafaf8] text-xs tracking-[0.2em] uppercase hover:bg-[#8b1a2d] transition-colors duration-300"
              >
                Reserve via WhatsApp
              </a>

              <button
                onClick={() => scrollTo('services')}
                className="w-full sm:w-auto text-center px-8 py-4 border border-[#e5e5e0] text-[#333333] hover:border-[#111111] hover:text-[#111111] text-xs tracking-[0.2em] uppercase transition-colors duration-300 cursor-pointer"
              >
                Explore Services ↓
              </button>
            </div>

            {/* Subtle Editorial Metrics */}
            <div className="pt-10 border-t border-[#e5e5e0] grid grid-cols-3 gap-6 max-w-lg">
              <div>
                <span className="display text-2xl sm:text-3xl text-[#111111] font-normal">100%</span>
                <span className="block text-[10px] tracking-[0.2em] uppercase text-[#777777] mt-1 font-sans">Organic Henna</span>
              </div>
              <div>
                <span className="display text-2xl sm:text-3xl text-[#111111] font-normal">500+</span>
                <span className="block text-[10px] tracking-[0.2em] uppercase text-[#777777] mt-1 font-sans">Brides Adorned</span>
              </div>
              <div>
                <span className="display text-2xl sm:text-3xl text-[#111111] font-normal">48h</span>
                <span className="block text-[10px] tracking-[0.2em] uppercase text-[#777777] mt-1 font-sans">Dark Stain Peak</span>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Architectural Portrait */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[3/4] overflow-hidden bg-[#e5e5e0] img-zoom">
              <img
                src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85"
                alt="Bhuvi Mehandi - Bridal Henna Artistry"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-[#fafaf8]/90 backdrop-blur-sm px-4 py-2.5 text-[11px] tracking-[0.15em] uppercase text-[#333333] flex items-center justify-between border border-[#e5e5e0]">
                <span>Royal Dulha-Dulhan Storyline</span>
                <span className="text-[#8b1a2d]">Signature 2026</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* EDITORIAL SERVICES SECTION                                     */}
      {/* ------------------------------------------------------------- */}
      <section id="services" className="border-t border-[#e5e5e0] bg-[#ffffff] py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 pb-6 border-b border-[#e5e5e0]">
            <div>
              <span className="text-xs tracking-[0.25em] uppercase text-[#777777] font-sans block mb-2">
                01 / Offerings
              </span>
              <h2 className="display text-4xl sm:text-6xl font-normal text-[#111111]">
                Our Services
              </h2>
            </div>
            <p className="text-sm text-[#777777] font-light max-w-sm font-sans mt-4 sm:mt-0">
              Each package includes fresh chemical-free organic henna cones, personalized consultation, and clove-steam aftercare guidance.
            </p>
          </div>

          {/* Editorial Service Rows */}
          <div className="divide-y divide-[#e5e5e0]">
            {SERVICES.map((serv) => (
              <div
                key={serv.id}
                className="py-12 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center group"
              >
                {/* Number & Category */}
                <div className="lg:col-span-2">
                  <span className="display text-4xl sm:text-5xl font-light text-[#cccccc] group-hover:text-[#8b1a2d] transition-colors">
                    {serv.number}
                  </span>
                  <span className="block text-xs tracking-[0.2em] uppercase text-[#777777] font-sans mt-1">
                    {serv.category}
                  </span>
                </div>

                {/* Title & Description */}
                <div className="lg:col-span-5 space-y-3">
                  <h3 className="display text-2xl sm:text-3xl text-[#111111] font-normal">
                    {serv.title}
                  </h3>
                  <p className="text-xs tracking-[0.15em] uppercase text-[#8b1a2d] font-sans font-medium">
                    {serv.tagline}
                  </p>
                  <p className="text-sm text-[#555555] font-light leading-relaxed font-sans">
                    {serv.description}
                  </p>

                  <div className="pt-2 flex flex-wrap gap-2">
                    {serv.details.map((item, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] tracking-wide text-[#666666] bg-[#fafaf8] border border-[#e5e5e0] px-2.5 py-1 font-sans"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Duration & Price */}
                <div className="lg:col-span-2 space-y-1 font-sans">
                  <span className="block text-xs text-[#777777] uppercase tracking-[0.15em]">Investment</span>
                  <span className="display text-2xl text-[#111111] font-normal">{serv.price}</span>
                  <span className="block text-xs text-[#777777]">{serv.duration}</span>
                </div>

                {/* Action */}
                <div className="lg:col-span-3 flex lg:justify-end">
                  <a
                    href={createWhatsAppUrl({
                      eventType: serv.title,
                      service: serv.title,
                      customNote: `Hi Bhuvi, I am inquiring about the ${serv.title} (${serv.price}). Please share your upcoming date availability.`
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase px-6 py-3 border border-[#111111] hover:bg-[#111111] hover:text-[#ffffff] transition-all font-sans"
                  >
                    Inquire via WhatsApp →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SELECTED WORKS / PORTFOLIO                                    */}
      {/* ------------------------------------------------------------- */}
      <section id="works" className="py-24 sm:py-32 max-w-7xl mx-auto px-6 sm:px-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 pb-6 border-b border-[#e5e5e0]">
          <div>
            <span className="text-xs tracking-[0.25em] uppercase text-[#777777] font-sans block mb-2">
              02 / Archive
            </span>
            <h2 className="display text-4xl sm:text-6xl font-normal text-[#111111]">
              Selected Works
            </h2>
          </div>

          {/* Minimal Filter Tabs */}
          <div className="flex flex-wrap gap-4 text-xs tracking-[0.2em] uppercase font-sans mt-6 sm:mt-0">
            {['all', 'bridal', 'arabic', 'rajasthani', 'feet'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`pb-1 cursor-pointer transition-colors ${
                  activeTab === cat
                    ? 'border-b-2 border-[#111111] text-[#111111] font-medium'
                    : 'text-[#888888] hover:text-[#111111]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        {loadingDesigns ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-[3/4] bg-[#e5e5e0] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {filteredDesigns.map((design) => (
              <div
                key={design.id}
                onClick={() => setSelectedDesign(design)}
                className="group cursor-pointer block"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-[#e5e5e0] img-zoom">
                  <img
                    src={design.imageUrl}
                    alt={design.title}
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="pt-4 flex items-baseline justify-between font-sans">
                  <div>
                    <h3 className="display text-xl text-[#111111] group-hover:text-[#8b1a2d] transition-colors">
                      {design.title}
                    </h3>
                    <p className="text-[11px] tracking-[0.15em] uppercase text-[#777777] mt-0.5">
                      {design.tag || design.category}
                    </p>
                  </div>
                  <span className="text-xs text-[#555555] font-light">
                    {design.priceRange}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ------------------------------------------------------------- */}
      {/* ABOUT BHUVI SECTION                                          */}
      {/* ------------------------------------------------------------- */}
      <section id="about" className="bg-[#ffffff] border-t border-b border-[#e5e5e0] py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            {/* Left Column: Image */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/5] overflow-hidden bg-[#e5e5e0]">
                <img
                  src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=85"
                  alt="Bhuvi Artist at work"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>

            {/* Right Column: Editorial Text */}
            <div className="lg:col-span-7 space-y-8">
              <span className="text-xs tracking-[0.25em] uppercase text-[#777777] font-sans block">
                03 / Philosophy
              </span>

              <h2 className="display text-4xl sm:text-5xl lg:text-6xl font-normal leading-tight text-[#111111]">
                Crafted with intention. <br />
                <span className="italic text-[#8b1a2d]">Colored</span> solely by nature.
              </h2>

              <p className="text-base sm:text-lg text-[#555555] font-light leading-relaxed font-sans">
                Henna is not merely an ornament; it is the physical anchoring of an auspicious milestone.
                Bhuvi approaches every application as an intimate canvas — listening to the couple's history,
                lehenga textures, and personal aesthetic before sketching.
              </p>

              <div className="space-y-6 pt-4 border-t border-[#e5e5e0] font-sans">
                <div className="flex items-start gap-4">
                  <span className="text-xs tracking-widest text-[#8b1a2d] uppercase font-medium">01</span>
                  <div>
                    <h4 className="text-sm font-semibold text-[#111111] uppercase tracking-wider">
                      100% Certified Sojat Henna
                    </h4>
                    <p className="text-xs text-[#666666] leading-relaxed mt-1">
                      Freshly sifted Rajasthani leaves blended with tea tree, lavender, and nilgiri essential oils. No artificial colorants, no PPD, safe for pregnant mothers and delicate skin.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="text-xs tracking-widest text-[#8b1a2d] uppercase font-medium">02</span>
                  <div>
                    <h4 className="text-sm font-semibold text-[#111111] uppercase tracking-wider">
                      Guaranteed Deep Mahogany Stain
                    </h4>
                    <p className="text-xs text-[#666666] leading-relaxed mt-1">
                      Our custom slow-maturing recipe peaks at 48 hours post-application into an intense rich burgundy that commands presence in wedding photography.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="text-xs tracking-widest text-[#8b1a2d] uppercase font-medium">03</span>
                  <div>
                    <h4 className="text-sm font-semibold text-[#111111] uppercase tracking-wider">
                      Travel & Destination Ready
                    </h4>
                    <p className="text-xs text-[#666666] leading-relaxed mt-1">
                      Based in Ahmedabad & Gandhinagar. Available for destination ceremonies across Udaipur, Jaipur, Goa, and international venues.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* CONTACT & RESERVATION SECTION                                 */}
      {/* ------------------------------------------------------------- */}
      <section id="contact" className="py-24 sm:py-32 max-w-7xl mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left: Contact Info */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-xs tracking-[0.25em] uppercase text-[#777777] font-sans block mb-2">
                04 / Reservations
              </span>
              <h2 className="display text-4xl sm:text-6xl font-normal text-[#111111]">
                Inquire Date
              </h2>
            </div>

            <p className="text-sm sm:text-base text-[#555555] font-light leading-relaxed font-sans">
              Due to the bespoke nature of our bridal work, we book a limited number of dates per wedding season.
              Submit your date and event details below, or reach out instantly via WhatsApp.
            </p>

            <div className="space-y-4 pt-6 border-t border-[#e5e5e0] font-sans text-xs tracking-wider uppercase">
              <div>
                <span className="text-[#888888] block text-[10px]">Instant Booking</span>
                <a
                  href={createWhatsAppUrl({ customNote: 'Namaste Bhuvi, I would like to check availability for my wedding.' })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base text-[#111111] font-normal hover:text-[#8b1a2d] transition-colors"
                >
                  +91 98765 43210 (WhatsApp)
                </a>
              </div>

              <div>
                <span className="text-[#888888] block text-[10px]">Email Correspondence</span>
                <span className="text-base text-[#111111] font-normal">bhuvi.mehandi@gmail.com</span>
              </div>

              <div>
                <span className="text-[#888888] block text-[10px]">Studio & Coverage</span>
                <span className="text-base text-[#111111] font-normal">Ahmedabad, Gujarat & Worldwide</span>
              </div>
            </div>
          </div>

          {/* Right: Minimalist Form */}
          <div className="lg:col-span-7 bg-[#ffffff] p-8 sm:p-12 border border-[#e5e5e0]">
            {submitted ? (
              <div className="py-12 text-center space-y-4 font-sans">
                <span className="display text-3xl text-[#111111] block">Inquiry Received</span>
                <p className="text-sm text-[#555555] max-w-md mx-auto">
                  Thank you. Your reservation request has been registered. A WhatsApp window has opened to connect directly with Bhuvi.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs tracking-[0.2em] uppercase border-b border-[#111111] pb-1"
                  >
                    Send another inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6 font-sans">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] tracking-[0.15em] uppercase text-[#555555] mb-2">
                      Client Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Priya Shah"
                      className="w-full border-b border-[#cccccc] focus:border-[#111111] bg-transparent py-2.5 text-sm text-[#111111] outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] tracking-[0.15em] uppercase text-[#555555] mb-2">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full border-b border-[#cccccc] focus:border-[#111111] bg-transparent py-2.5 text-sm text-[#111111] outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] tracking-[0.15em] uppercase text-[#555555] mb-2">
                      Event Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={form.eventDate}
                      onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                      className="w-full border-b border-[#cccccc] focus:border-[#111111] bg-transparent py-2.5 text-sm text-[#111111] outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] tracking-[0.15em] uppercase text-[#555555] mb-2">
                      Service Package
                    </label>
                    <select
                      value={form.eventType}
                      onChange={(e) => setForm({ ...form, eventType: e.target.value })}
                      className="w-full border-b border-[#cccccc] focus:border-[#111111] bg-transparent py-2.5 text-sm text-[#111111] outline-none transition-colors cursor-pointer"
                    >
                      <option>The Bridal Narrative</option>
                      <option>Contemporary Arabic</option>
                      <option>Rajasthani Heritage</option>
                      <option>The Sangeet Soirée</option>
                      <option>Custom Bridal Composition</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] tracking-[0.15em] uppercase text-[#555555] mb-2">
                    Event City & Venue
                  </label>
                  <input
                    type="text"
                    value={form.cityVenue}
                    onChange={(e) => setForm({ ...form, cityVenue: e.target.value })}
                    placeholder="e.g. Ahmedabad, Hyatt Regency / Home"
                    className="w-full border-b border-[#cccccc] focus:border-[#111111] bg-transparent py-2.5 text-sm text-[#111111] outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] tracking-[0.15em] uppercase text-[#555555] mb-2">
                    Notes or Specific Inspirations
                  </label>
                  <textarea
                    rows={3}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us about your attire colors, specific ritual motifs, or bridal party size..."
                    className="w-full border-b border-[#cccccc] focus:border-[#111111] bg-transparent py-2.5 text-sm text-[#111111] outline-none transition-colors resize-none"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 bg-[#111111] text-[#fafaf8] text-xs tracking-[0.2em] uppercase hover:bg-[#8b1a2d] transition-colors duration-300 disabled:opacity-50 cursor-pointer"
                  >
                    {submitting ? 'Connecting...' : 'Submit Inquiry & Open WhatsApp →'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* MINIMAL FOOTER                                                */}
      {/* ------------------------------------------------------------- */}
      <footer className="border-t border-[#e5e5e0] bg-[#fafaf8] py-14">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-6 font-sans text-xs text-[#777777]">
          <div>
            <span className="display text-lg text-[#111111] tracking-widest font-normal">
              BHUVI MEHANDI
            </span>
            <p className="text-[11px] text-[#888888] mt-1">
              © {new Date().getFullYear()} Bhuvi Mehandi Artistry Studio. All rights reserved.
            </p>
          </div>

          <div className="flex items-center space-x-8 tracking-[0.15em] uppercase text-[11px]">
            <a
              href={createWhatsAppUrl({ customNote: 'Inquiring about Bhuvi Mehandi.' })}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#111111] transition-colors"
            >
              WhatsApp
            </a>
            <button
              onClick={openAdmin}
              className="hover:text-[#111111] transition-colors cursor-pointer"
            >
              Studio Access
            </button>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-[#111111] transition-colors cursor-pointer"
            >
              Back to Top ↑
            </button>
          </div>
        </div>
      </footer>

      {/* ------------------------------------------------------------- */}
      {/* MINIMAL FLOATING WHATSAPP BUTTON                              */}
      {/* ------------------------------------------------------------- */}
      <a
        href={createWhatsAppUrl({ customNote: 'Hello Bhuvi! I saw your website and would love to ask about booking my event.' })}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Bhuvi on WhatsApp"
        className="wa-float cursor-pointer"
      >
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>

      {/* ------------------------------------------------------------- */}
      {/* DESIGN PREVIEW MODAL                                          */}
      {/* ------------------------------------------------------------- */}
      {selectedDesign && (
        <div
          className="fixed inset-0 z-50 bg-[#111111]/80 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setSelectedDesign(null)}
        >
          <div
            className="bg-[#fafaf8] max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row border border-[#e5e5e0]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="md:w-1/2 bg-[#e5e5e0] aspect-square md:aspect-auto">
              <img
                src={selectedDesign.imageUrl}
                alt={selectedDesign.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:w-1/2 p-8 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[11px] tracking-[0.2em] uppercase text-[#8b1a2d] font-sans">
                    {selectedDesign.category}
                  </span>
                  <button
                    onClick={() => setSelectedDesign(null)}
                    className="text-xs uppercase tracking-widest text-[#777777] hover:text-[#111111] cursor-pointer"
                  >
                    Close [×]
                  </button>
                </div>
                <h3 className="display text-3xl text-[#111111] mb-3">
                  {selectedDesign.title}
                </h3>
                <p className="text-sm text-[#555555] font-light leading-relaxed font-sans mb-6">
                  {selectedDesign.description || 'Intricate bespoke henna composition handcrafted by Bhuvi.'}
                </p>
                {selectedDesign.priceRange && (
                  <div className="font-sans mb-6">
                    <span className="text-xs text-[#777777] block uppercase tracking-wider">Starting Price</span>
                    <span className="display text-2xl text-[#111111]">{selectedDesign.priceRange}</span>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-[#e5e5e0]">
                <a
                  href={createWhatsAppUrl({
                    eventType: 'Design Inquiry',
                    designCode: selectedDesign.title,
                    customNote: `Hi Bhuvi! I loved the "${selectedDesign.title}" design from your portfolio and would like to ask about booking it.`
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center py-3.5 bg-[#111111] text-[#fafaf8] text-xs tracking-[0.2em] uppercase hover:bg-[#8b1a2d] transition-colors font-sans"
                >
                  Inquire This Design on WhatsApp →
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STUDIO ACCESS / ADMIN SLIDE-OVER DRAWER                       */}
      {/* ------------------------------------------------------------- */}
      {adminOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end"
          onClick={() => setAdminOpen(false)}
        >
          <div
            className="bg-[#fafaf8] w-full max-w-xl h-full shadow-2xl p-8 overflow-y-auto font-sans flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-[#e5e5e0] mb-6">
                <div>
                  <h3 className="display text-2xl text-[#111111]">Studio Portal</h3>
                  <span className="text-[11px] uppercase tracking-widest text-[#777777]">
                    Content & Booking Management
                  </span>
                </div>
                <button
                  onClick={() => setAdminOpen(false)}
                  className="text-xs uppercase tracking-widest text-[#777777] hover:text-[#111111] cursor-pointer"
                >
                  Close [×]
                </button>
              </div>

              {/* Supabase Status */}
              <div className="p-4 bg-[#f0f0ee] border border-[#e5e5e0] mb-8 text-xs leading-relaxed">
                <span className="font-semibold block mb-1 uppercase tracking-wider text-[#111111]">
                  Supabase Connection
                </span>
                <p className="text-[#666666]">
                  {dbStatus?.connected
                    ? (dbStatus.hasTables ? '🟢 Active & Connected to Supabase Cloud' : '🟡 Connected to Supabase (run supabase-schema.sql for cloud tables)')
                    : '⚪ Local Storage Fallback Mode Active'}
                </p>
                <p className="text-[10px] text-[#888888] mt-1 font-mono">{SUPABASE_URL}</p>
              </div>

              {/* Add New Design Form */}
              <div className="mb-10">
                <h4 className="text-xs uppercase tracking-widest text-[#111111] font-semibold mb-4">
                  Add New Design to Portfolio
                </h4>
                <form onSubmit={handleAddDesignSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#555555] mb-1">Title</label>
                    <input
                      type="text"
                      required
                      value={newDesign.title}
                      onChange={(e) => setNewDesign({ ...newDesign, title: e.target.value })}
                      placeholder="e.g. Minimalist Lotus Ankle Cuff"
                      className="w-full border border-[#cccccc] p-2 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#555555] mb-1">Category</label>
                    <select
                      value={newDesign.category}
                      onChange={(e) => setNewDesign({ ...newDesign, category: e.target.value })}
                      className="w-full border border-[#cccccc] p-2 bg-white cursor-pointer"
                    >
                      <option value="bridal">Bridal</option>
                      <option value="arabic">Arabic</option>
                      <option value="rajasthani">Heritage Rajasthani</option>
                      <option value="feet">Feet Art</option>
                      <option value="minimalist">Minimalist</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#555555] mb-1">Image URL</label>
                    <input
                      type="url"
                      required
                      value={newDesign.imageUrl}
                      onChange={(e) => setNewDesign({ ...newDesign, imageUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full border border-[#cccccc] p-2 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#555555] mb-1">Price Estimate</label>
                    <input
                      type="text"
                      value={newDesign.priceRange}
                      onChange={(e) => setNewDesign({ ...newDesign, priceRange: e.target.value })}
                      placeholder="₹2,500 - ₹5,000"
                      className="w-full border border-[#cccccc] p-2 bg-white"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={addingDesign}
                    className="w-full py-3 bg-[#111111] text-[#fafaf8] text-xs uppercase tracking-widest hover:bg-[#8b1a2d] transition-colors cursor-pointer"
                  >
                    {addingDesign ? 'Saving...' : 'Add to Portfolio'}
                  </button>
                </form>
              </div>

              {/* Received Inquiries */}
              <div>
                <h4 className="text-xs uppercase tracking-widest text-[#111111] font-semibold mb-4">
                  Client Inquiries ({inquiries.length})
                </h4>
                {inquiries.length === 0 ? (
                  <p className="text-xs text-[#888888]">No inquiries yet.</p>
                ) : (
                  <div className="space-y-3">
                    {inquiries.map((inq) => (
                      <div key={inq.id} className="p-4 bg-white border border-[#e5e5e0] text-xs space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-sm text-[#111111]">{inq.name}</span>
                          <span className="px-2 py-0.5 bg-[#f0f0ee] text-[10px] uppercase tracking-wider">
                            {inq.status || 'New'}
                          </span>
                        </div>
                        <p className="text-[#555555]">
                          📞 {inq.phone} · 📅 {inq.event_date} · {inq.event_type}
                        </p>
                        {inq.city_venue && <p className="text-[#777777]">📍 {inq.city_venue}</p>}
                        {inq.message && <p className="text-[#888888] italic">"{inq.message}"</p>}

                        <div className="pt-2 flex items-center gap-3">
                          <a
                            href={`https://wa.me/${inq.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${inq.name}! Thank you for inquiring with Bhuvi Mehandi. We are delighted to confirm date availability for your ${inq.event_type}.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-[#25d366] text-white text-[10px] tracking-wider uppercase font-semibold"
                          >
                            WhatsApp Reply
                          </a>
                          <select
                            value={inq.status || 'New'}
                            onChange={(e) => handleStatusUpdate(inq.id, e.target.value)}
                            className="text-[10px] border border-[#cccccc] p-1 bg-white cursor-pointer"
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-[#e5e5e0] text-[10px] text-[#888888] text-center">
              Bhuvi Mehandi Artistry · Private Studio Portal
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

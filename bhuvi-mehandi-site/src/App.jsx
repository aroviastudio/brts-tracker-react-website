import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Sparkles,
  Compass,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Clock,
  ShieldCheck,
  Calendar,
  MessageCircle,
  Eye,
  X,
  Check,
  Flame,
  Award,
  Lock,
  Layers
} from 'lucide-react';
import {
  createWhatsAppUrl,
  submitInquiry,
  fetchInquiries,
  testSupabaseConnection
} from './lib/supabase';

// ─── CHAPTER DEFINITIONS ──────────────────────────────────────────
const CHAPTERS = [
  { id: 'prologue', number: '00', title: 'The Genesis', subtitle: 'Raw Botanical Purity & Philosophy' },
  { id: 'act-1', number: '01', title: 'Act I: The Sacred Hand', subtitle: '3D Dimensional Anatomy' },
  { id: 'act-2', number: '02', title: 'Act II: The Three Traditions', subtitle: 'Master Curated Styles' },
  { id: 'act-3', number: '03', title: 'Act III: Metamorphosis', subtitle: '48-Hour Stain Alchemy' },
  { id: 'act-4', number: '04', title: 'Act IV: The Living Archive', subtitle: 'Selected Works & Bridal Stories' },
  { id: 'epilogue', number: '05', title: 'Epilogue: Private Booking', subtitle: 'VIP Concierge & Investment' }
];

// ─── ACT I: PERSPECTIVES ──────────────────────────────────────────
const HAND_PERSPECTIVES = [
  {
    id: 'palm-heirloom',
    title: 'The Royal Dulhan Palm',
    category: 'Heirloom Narrative',
    perspective: 'Front Palm & Fingers',
    tagline: 'Custom hand-drawn bride & groom portraits woven into sacred jharokhas',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85',
    description: 'Applied with a bespoke 0.2mm micro-cone. Features personalized temple gateways, royal peacocks, and hidden vows inside the micro-jaal.',
    hotspots: [
      { x: '50%', y: '42%', label: 'Sacred Mandala', detail: 'Concentric lotus mandala symbolizing eternal prosperity' },
      { x: '35%', y: '70%', label: 'Marwari Cuff', detail: 'Royal Rajasthani palace arch with micro-grid shading' }
    ],
    time: '4.5 Hours',
    stain: '7–12 Days'
  },
  {
    id: 'backhand-jaali',
    title: 'Architectural Back-Hand',
    category: 'Marwari Heritage',
    perspective: 'Dorsal Hand & Forearm',
    tagline: 'Negative-space jaali mesh designed to accentuate bridal diamonds',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=85',
    description: 'High-contrast botanical flourishes that cascade gracefully up the wrist, leaving calculated breathing room for rings and bangles.',
    hotspots: [
      { x: '52%', y: '36%', label: 'Ring Accent Mesh', detail: 'Open-space mesh designed around bridal jewellery' }
    ],
    time: '2.5 Hours',
    stain: '7–10 Days'
  },
  {
    id: 'forearm-cuff',
    title: 'Contemporary Sangeet Trails',
    category: 'Contemporary Arabic',
    perspective: 'Forearm to Elbow',
    tagline: 'Fluid shaded lotus blossoms and dynamic geometric rhythm',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=85',
    description: 'Designed for high visual impact under reception chandeliers, combining bold botanical outlines with delicate shaded petals.',
    hotspots: [
      { x: '48%', y: '50%', label: 'Shaded Petals', detail: 'Gradient henna shading mimicking watercolor washes' }
    ],
    time: '3.0 Hours',
    stain: '8–12 Days'
  },
  {
    id: 'feet-payal',
    title: 'Imperial Payal Feet Jaal',
    category: 'Bridal Feet',
    perspective: 'Ankles & Feet',
    tagline: 'Embossed henna beads mirroring royal kundan anklets',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85',
    description: 'A regal ankle cuff with symmetrical toe crests formulated with calming lavender and soothing cold-pressed oils.',
    hotspots: [
      { x: '45%', y: '55%', label: 'Ankle Payal Band', detail: 'Embossed henna beads mimicking bridal anklets' }
    ],
    time: '2.0 Hours',
    stain: '10–14 Days'
  }
];

// ─── ACT II: THE THREE TRADITIONS ─────────────────────────────────
const TRADITIONS = [
  {
    number: '01',
    name: 'The Royal Marwari Jaal',
    origin: 'Rajasthan Imperial Palaces',
    tagline: 'The timeless geometry of kings & queens',
    desc: 'Characterized by impossibly fine 0.2mm micro-grids, sacred temple jharokhas, shehnai motifs, and royal peacocks executed with mathematical symmetry.',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=85',
    idealFor: 'Full-length traditional bridal ceremonies & heirloom photography',
    price: 'From ₹10,500'
  },
  {
    number: '02',
    name: 'Persian Botanical Trails',
    origin: 'Isfahan & Gulf Heritage',
    tagline: 'Fluid shaded lotus blossoms and negative space',
    desc: 'Bold graphic outlines filled with ultra-soft gradient shading. Leaves generous unpainted skin to highlight diamond jewelry and cocktail attire.',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=85',
    idealFor: 'Sangeet nights, modern reception lehengas & contemporary brides',
    price: 'From ₹5,500'
  },
  {
    number: '03',
    name: 'The Modernist Negative Lace',
    origin: 'Contemporary Haute Couture',
    tagline: 'Jewelry-inspired wristbands & architectural finger cuffs',
    desc: 'Minimalist restraint meets intricate micro-detailing. Delicate ring networks and wrist bracelet lines tailored for the bride who desires subtle luxury.',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85',
    idealFor: 'Intimate civil ceremonies, bridesmaids & minimalist brides',
    price: 'From ₹3,500'
  }
];

// ─── ACT III: STAIN METAMORPHOSIS ─────────────────────────────────
const STAIN_HOURS = [
  {
    hour: '00',
    title: 'Fresh Botanical Paste',
    color: '#281a14',
    accent: '#d9795d',
    note: 'Freshly piped Rajasthani Sojat leaf paste infused with pure Bulgarian lavender oil. Sits on skin for 6–8 hours to transfer dye deep into the stratum corneum.',
    filter: 'contrast(1.05) brightness(0.95)'
  },
  {
    hour: '24',
    title: 'Sunset Terracotta Oxidation',
    color: '#b84227',
    accent: '#e5d3c1',
    note: 'Paste removed without water. Clove steam infusion warms the skin, kickstarting natural lawsone tannin oxidation into a bright fiery terracotta hue.',
    filter: 'contrast(1.15) saturate(1.25) sepia(0.25)'
  },
  {
    hour: '48',
    title: 'Imperial Mahogany Noir',
    color: '#5c101c',
    accent: '#f5efe6',
    note: 'Peak wedding-day maturity. Deep, fragrant, rich espresso-mahogany stain that radiates under ceremony lights and lasts up to 12 days.',
    filter: 'contrast(1.25) saturate(1.35) sepia(0.4) hue-rotate(-12deg)'
  }
];

// ─── ACT IV: ARCHIVE & STORIES ────────────────────────────────────
const ARCHIVE_STORIES = [
  {
    id: 's-1',
    bride: 'Dr. Radhika Singhania',
    venue: 'The Leela Palace, Udaipur',
    title: 'The Royal Narrative Mandap',
    quote: 'Bhuvi drew our entire proposal story along the Ghats of Udaipur right into my palm jaal. The stain was dark and fragrant on my wedding morning.',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 's-2',
    bride: 'Ananya Mehra',
    venue: 'Grand Hyatt, Mumbai',
    title: 'Contemporary Lotus Shading',
    quote: 'Her organic lavender paste felt so soothing and luxurious. Not a single chemical trace, and the intricate negative space looked stunning with my jewelry.',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 's-3',
    bride: 'Pooja Kothari',
    venue: 'Fairmont, Jaipur',
    title: 'Imperial Micro-Jaali',
    quote: 'Her 0.2mm micro-cone precision is pure mastery. Every single line was mathematically symmetrical.',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80'
  }
];

export default function App() {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activePerspective, setActivePerspective] = useState(0);
  const [activeStainIdx, setActiveStainIdx] = useState(2);
  const [activeTradition, setActiveTradition] = useState(0);
  const [hotspotInfo, setHotspotInfo] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Package Calculator State
  const [coverage, setCoverage] = useState('elbow');
  const [hasPortraits, setHasPortraits] = useState(true);
  const [hasHashtags, setHasHashtags] = useState(true);
  const [guestCount, setGuestCount] = useState(4);

  // Form State
  const [form, setForm] = useState({
    name: '',
    phone: '',
    date: '',
    venue: '',
    notes: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const [hasInteracted, setHasInteracted] = useState(() => {
    try {
      return sessionStorage.getItem('bhuvi_onboarded') === 'true';
    } catch {
      return false;
    }
  });

  // Touch gesture support for horizontal slide swipe
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const markInteracted = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      try {
        sessionStorage.setItem('bhuvi_onboarded', 'true');
      } catch {}
    }
  };

  const handleTouchStart = (e) => {
    if (menuOpen) return;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (menuOpen) return;
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      markInteracted();
      nextChapter();
    }
    if (diff < -50) {
      markInteracted();
      prevChapter();
    }
  };

  // Lock background scroll when Index modal is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  const nextChapter = () => {
    markInteracted();
    if (currentChapter < CHAPTERS.length - 1) {
      setCurrentChapter(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevChapter = () => {
    markInteracted();
    if (currentChapter > 0) {
      setCurrentChapter(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Keyboard navigation & Wheel Scroll navigation with cooldown
  const lastScrollTime = useRef(0);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (menuOpen) {
        if (e.key === 'Escape') setMenuOpen(false);
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextChapter();
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prevChapter();
    };

    const handleWheel = (e) => {
      // Ignore wheel if modal/menu is open
      if (menuOpen) return;
      const now = Date.now();
      if (now - lastScrollTime.current < 800) return; // 800ms cooldown

      if (e.deltaY > 35) {
        lastScrollTime.current = now;
        nextChapter();
      } else if (e.deltaY < -35) {
        lastScrollTime.current = now;
        prevChapter();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [currentChapter, menuOpen]);

  // Investment calculation
  const getBasePrice = () => {
    switch (coverage) {
      case 'wrist': return 3500;
      case 'half': return 6500;
      case 'elbow': return 10500;
      case 'full': return 15500;
      default: return 10500;
    }
  };

  const calculateTotal = () => {
    let total = getBasePrice();
    if (hasPortraits) total += 2500;
    if (hasHashtags) total += 1200;
    total += guestCount * 600;
    return total;
  };

  const handleReservationSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitInquiry({
        name: form.name,
        phone: form.phone,
        event_date: form.date,
        event_type: `Story Deck: ${coverage} package`,
        location: form.venue,
        notes: `${form.notes} | Estimated: ₹${calculateTotal()}`
      });
    } catch (err) {
      // Offline fallback
    }

    setSubmitted(true);

    const waText = `Hi Bhuvi! I am inquiring via your Storytelling Deck:
- Name: ${form.name}
- Wedding Date: ${form.date}
- Venue: ${form.venue}
- Selected Package: ${coverage.toUpperCase()}
- Custom Portraits: ${hasPortraits ? 'Yes' : 'No'}
- Wedding Hashtags: ${hasHashtags ? 'Yes' : 'No'}
- Guests: ${guestCount} people
- Total Estimated Investment: ₹${calculateTotal().toLocaleString('en-IN')}

Custom Notes: ${form.notes || 'None'}`;

    const url = createWhatsAppUrl({
      eventType: 'Bespoke Story Deck Booking',
      customNote: waText
    });
    setTimeout(() => window.open(url, '_blank'), 600);
  };

  const currentHand = HAND_PERSPECTIVES[activePerspective];
  const currentStain = STAIN_HOURS[activeStainIdx];
  const currentTrad = TRADITIONS[activeTradition];

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="min-h-screen bg-[#140e0c] text-[#f5efe6] font-sans selection:bg-[#c46851] selection:text-[#140e0c] flex flex-col justify-between relative overflow-hidden"
    >
      
      {/* ─── 1. HAUTE MINIMAL TOP BAR ───────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#140e0c]/90 backdrop-blur-md border-b border-[#2a201d] px-6 sm:px-12 h-20 flex items-center justify-between">
        
        {/* Brand Monogram */}
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#c46851] animate-pulse" />
          <button 
            onClick={() => setCurrentChapter(0)} 
            className="text-left cursor-pointer group"
          >
            <span className="font-syne text-lg sm:text-xl font-bold tracking-[0.2em] uppercase text-[#f5efe6]">
              BHUVI <span className="text-[#c46851]">//</span> ATELIER
            </span>
          </button>
        </div>

        {/* Current Chapter Pill Indicator */}
        <div className="hidden md:flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#1d1614] border border-[#2a201d] text-xs uppercase tracking-[0.25em]">
          <span className="text-[#c46851] font-syne font-bold">{CHAPTERS[currentChapter].number}</span>
          <span className="text-[#8f817b]">/</span>
          <span className="text-[#e5d3c1] font-medium">{CHAPTERS[currentChapter].title}</span>
        </div>

        {/* Right Controls: Ambient Audio Sim + Chapter Menu */}
        <div className="flex items-center gap-4">
          
          {/* Audio Simulator Button */}
          <button
            onClick={() => setIsPlayingAudio(!isPlayingAudio)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1d1614] border border-[#2a201d] hover:border-[#c46851]/40 text-xs text-[#e5d3c1] cursor-pointer transition-all"
            title="Toggle Ambient Audio Experience"
          >
            {isPlayingAudio ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#c46851]" />
                <span className="flex items-center gap-0.5 h-3">
                  <span className="w-0.5 bg-[#c46851] soundwave-bar" style={{ animationDelay: '0.1s' }} />
                  <span className="w-0.5 bg-[#c46851] soundwave-bar" style={{ animationDelay: '0.3s' }} />
                  <span className="w-0.5 bg-[#c46851] soundwave-bar" style={{ animationDelay: '0.2s' }} />
                </span>
                <span className="text-[10px] hidden sm:inline uppercase tracking-widest text-[#c46851]">432Hz Ambient</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-[#8f817b]" />
                <span className="text-[10px] hidden sm:inline uppercase tracking-widest text-[#8f817b]">Sound Off</span>
              </>
            )}
          </button>

          {/* Chapter Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="px-4 py-1.5 rounded-full bg-[#c46851] text-[#140e0c] font-syne font-bold text-xs uppercase tracking-widest hover:bg-[#d9795d] transition-colors cursor-pointer"
          >
            {menuOpen ? 'Close' : 'Index'}
          </button>

        </div>
      </header>

      {/* Chapter Dropdown Index Modal */}
      {menuOpen && (
        <div
          onTouchStart={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
          className="fixed inset-0 top-20 z-40 bg-[#140e0c]/98 backdrop-blur-2xl p-6 sm:p-16 flex flex-col justify-between overflow-y-auto overscroll-contain h-[calc(100vh-80px)]"
        >
          <div className="max-w-4xl mx-auto w-full space-y-8">
            <span className="text-xs uppercase tracking-[0.3em] text-[#c46851] font-syne font-semibold">
              The Journey Index
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CHAPTERS.map((ch, idx) => (
                <button
                  key={ch.id}
                  onClick={() => {
                    setCurrentChapter(idx);
                    setMenuOpen(false);
                  }}
                  className={`p-6 rounded-2xl text-left border transition-all cursor-pointer flex items-start justify-between ${
                    currentChapter === idx
                      ? 'bg-[#1d1614] border-[#c46851] text-[#f5efe6]'
                      : 'bg-transparent border-[#2a201d] text-[#8f817b] hover:border-[#c46851]/40 hover:text-[#f5efe6]'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="font-syne text-xs uppercase tracking-widest text-[#c46851] font-bold">Chapter {ch.number}</span>
                    <h3 className="font-italiana text-2xl text-[#f5efe6]">{ch.title}</h3>
                    <p className="text-xs text-[#8f817b] font-sans">{ch.subtitle}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#c46851] mt-1" />
                </button>
              ))}
            </div>
          </div>
          <div className="text-center text-xs text-[#8f817b] uppercase tracking-[0.2em] pt-8">
            Use Keyboard Arrows (← / →) or Swipe to Navigate
          </div>
        </div>
      )}

      {/* ─── ONE-TIME FIRST-VISIT ONBOARDING AFFORDANCE ───────── */}
      {!hasInteracted && currentChapter === 0 && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30 pointer-events-none transition-all duration-700 animate-bounce">
          <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#1d1614]/95 border border-[#c46851]/70 backdrop-blur-xl shadow-2xl shadow-[#c46851]/25">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c46851] animate-ping" />
            <span className="text-[11px] sm:text-xs font-syne uppercase tracking-[0.2em] text-[#f5efe6] font-medium whitespace-nowrap">
              Swipe or Scroll to Explore →
            </span>
          </div>
        </div>
      )}

      {/* ─── 2. FULL-SCREEN CHAPTER ENGINE ───────────────────────── */}
      <main className="flex-1 flex flex-col justify-center px-6 sm:px-12 py-10 max-w-7xl mx-auto w-full">
        
        {/* ======================================================== */}
        {/* CHAPTER 00: PROLOGUE — THE GENESIS                       */}
        {/* ======================================================== */}
        {currentChapter === 0 && (
          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-6 animate-fadeIn rounded-3xl overflow-hidden">

            {/* Full-section flatlay background */}
            <div className="absolute inset-0 -z-10">
              <img
                src="/images/hero_flatlay_bg.webp"
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#140e0c]/92 via-[#140e0c]/75 to-[#140e0c]/40" />
            </div>
            
            <div className="lg:col-span-7 space-y-8 relative z-10 px-2 sm:px-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1d1614]/80 border border-[#2a201d] text-xs text-[#c46851] uppercase tracking-[0.25em] font-syne backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5" />
                Prologue • The Philosophy
              </div>

              <h1 className="font-italiana text-5xl sm:text-7xl lg:text-8xl leading-[0.98] text-[#f5efe6]">
                The Sacred <br />
                <span className="clay-gradient-text italic">Ephemeral</span> Art.
              </h1>

              <p className="text-base sm:text-lg text-[#e5d3c1] font-sans leading-relaxed max-w-xl">
                Henna is not decoration; it is a living ritual of devotion. We harvest premier organic Sojat leaves, cold-blend them with Bulgarian lavender essences, and execute bespoke bridal storytelling with mathematical symmetry.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  onClick={nextChapter}
                  className="px-8 py-4 rounded-xl bg-[#c46851] hover:bg-[#d9795d] text-[#140e0c] font-syne font-bold text-xs uppercase tracking-[0.25em] transition-all flex items-center justify-center gap-3 cursor-pointer shadow-lg shadow-[#c46851]/20"
                >
                  Begin Journey (Act I)
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setCurrentChapter(5)}
                  className="px-8 py-4 rounded-xl border border-[#2a201d] hover:border-[#c46851] text-[#e5d3c1] font-syne text-xs uppercase tracking-[0.25em] transition-colors cursor-pointer backdrop-blur-sm"
                >
                  Direct VIP Booking
                </button>
              </div>

              {/* Minimalist Metrics */}
              <div className="pt-8 border-t border-[#2a201d]/60 grid grid-cols-3 gap-6 max-w-lg">
                <div>
                  <span className="font-syne text-3xl font-bold text-[#c46851]">850+</span>
                  <span className="text-[10px] uppercase tracking-wider text-[#8f817b] block mt-0.5">Bespoke Brides</span>
                </div>
                <div>
                  <span className="font-syne text-3xl font-bold text-[#d9795d]">0.2mm</span>
                  <span className="text-[10px] uppercase tracking-wider text-[#8f817b] block mt-0.5">Micro-Cone Precision</span>
                </div>
                <div>
                  <span className="font-syne text-3xl font-bold text-[#e5d3c1]">100%</span>
                  <span className="text-[10px] uppercase tracking-wider text-[#8f817b] block mt-0.5">Organic Sojat</span>
                </div>
              </div>
            </div>

            {/* Right column — olive hand portrait */}
            <div className="lg:col-span-5 relative z-10">
              {/* Mobile: show as centered card; Desktop: full portrait card */}
              <div className="relative aspect-[3/4] sm:aspect-[4/5] rounded-3xl overflow-hidden border border-[#c46851]/25 shadow-2xl shadow-[#140e0c]/60 mx-auto max-w-xs lg:max-w-none">
                <img
                  src="/images/hero_hand_olive.webp"
                  alt="Elegant Bridal Mehndi — Olive Tones"
                  className="w-full h-full object-cover object-top"
                />
                {/* Subtle vignette at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#140e0c]/80 via-transparent to-transparent" />
                {/* Caption card */}
                <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-2xl bg-[#140e0c]/85 backdrop-blur-md border border-[#2a201d]">
                  <p className="font-syne text-[10px] uppercase tracking-widest text-[#c46851]">Heirloom Standard</p>
                  <p className="font-italiana text-base text-[#f5efe6] mt-0.5">Natural 48-Hour Deep Mahogany Stain</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* CHAPTER 01: ACT I — THE SACRED HAND                      */}
        {/* ======================================================== */}
        {currentChapter === 1 && (
          <div className="space-y-8 animate-fadeIn">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#2a201d] pb-6">
              <div>
                <span className="text-xs uppercase tracking-[0.25em] text-[#c46851] font-syne font-semibold">
                  Act I • Dimensional Anatomy
                </span>
                <h2 className="font-italiana text-4xl sm:text-6xl text-[#f5efe6] mt-1">
                  The Hand as a <span className="clay-gradient-text italic">Sacred</span> Canvas
                </h2>
              </div>

              {/* Perspective Selector Pills */}
              <div className="flex flex-wrap gap-2">
                {HAND_PERSPECTIVES.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setActivePerspective(idx);
                      setHotspotInfo(null);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-syne tracking-wider uppercase transition-all cursor-pointer ${
                      activePerspective === idx
                        ? 'bg-[#c46851] text-[#140e0c] font-bold shadow-md'
                        : 'bg-[#1d1614] text-[#8f817b] border border-[#2a201d] hover:border-[#c46851]/40 hover:text-white'
                    }`}
                  >
                    {p.title.split(' ')[1] || p.title.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Perspective Canvas */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-7 relative">
                <div className="relative aspect-[4/3] sm:aspect-[16/10] rounded-3xl overflow-hidden border border-[#2a201d] bg-[#1d1614]">
                  <img
                    src={currentHand.image}
                    alt={currentHand.title}
                    className="w-full h-full object-cover transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#140e0c]/90 via-transparent to-transparent pointer-events-none" />

                  {/* Hotspots */}
                  {currentHand.hotspots.map((spot, idx) => (
                    <div
                      key={idx}
                      style={{ top: spot.y, left: spot.x }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                    >
                      <button
                        onClick={() => setHotspotInfo(hotspotInfo === idx ? null : idx)}
                        className="w-8 h-8 rounded-full bg-[#140e0c]/90 border border-[#c46851] text-[#c46851] flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
                      >
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c46851] opacity-40" />
                        <span className="w-2 h-2 rounded-full bg-[#c46851]" />
                      </button>

                      {hotspotInfo === idx && (
                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-48 p-3 rounded-xl bg-[#1d1614]/95 border border-[#c46851] shadow-2xl text-left z-30">
                          <p className="font-syne text-xs font-bold text-[#c46851] uppercase">{spot.label}</p>
                          <p className="text-[11px] text-[#e5d3c1] mt-0.5 leading-snug">{spot.detail}</p>
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="absolute top-4 left-4 px-3.5 py-1 rounded-full bg-[#140e0c]/85 border border-[#2a201d] text-[10px] font-syne tracking-widest text-[#c46851] uppercase">
                    {currentHand.perspective}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-6">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#c46851] font-syne">{currentHand.category}</span>
                  <h3 className="font-italiana text-3xl text-[#f5efe6] mt-1">{currentHand.title}</h3>
                  <p className="text-sm italic text-[#d9795d] font-sans mt-1">"{currentHand.tagline}"</p>
                  <p className="text-sm text-[#e5d3c1] font-sans mt-3 leading-relaxed">{currentHand.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-[#1d1614] border border-[#2a201d]">
                    <span className="text-[10px] uppercase tracking-widest text-[#8f817b] block">Execution Duration</span>
                    <span className="font-syne text-base text-[#f5efe6] font-bold mt-0.5 block">{currentHand.time}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#1d1614] border border-[#2a201d]">
                    <span className="text-[10px] uppercase tracking-widest text-[#8f817b] block">Stain Longevity</span>
                    <span className="font-syne text-base text-[#c46851] font-bold mt-0.5 block">{currentHand.stain}</span>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentChapter(5)}
                  className="w-full py-4 rounded-xl bg-[#c46851] hover:bg-[#d9795d] text-[#140e0c] font-syne font-bold text-xs uppercase tracking-widest transition-all cursor-pointer"
                >
                  Reserve This Specific Perspective
                </button>
              </div>

            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* CHAPTER 02: ACT II — THE THREE TRADITIONS                 */}
        {/* ======================================================== */}
        {currentChapter === 2 && (
          <div className="space-y-8 animate-fadeIn">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#2a201d] pb-6">
              <div>
                <span className="text-xs uppercase tracking-[0.25em] text-[#c46851] font-syne font-semibold">
                  Act II • Master Curations
                </span>
                <h2 className="font-italiana text-4xl sm:text-6xl text-[#f5efe6] mt-1">
                  The Three <span className="clay-gradient-text italic">Traditions</span>
                </h2>
              </div>

              {/* Tradition Tabs */}
              <div className="flex gap-2">
                {TRADITIONS.map((trad, idx) => (
                  <button
                    key={trad.number}
                    onClick={() => setActiveTradition(idx)}
                    className={`px-4 py-2 rounded-xl text-xs font-syne tracking-wider uppercase transition-all cursor-pointer ${
                      activeTradition === idx
                        ? 'bg-[#c46851] text-[#140e0c] font-bold shadow-md'
                        : 'bg-[#1d1614] text-[#8f817b] border border-[#2a201d] hover:border-[#c46851]/40'
                    }`}
                  >
                    {trad.number}
                  </button>
                ))}
              </div>
            </div>

            {/* Tradition Narrative Presentation */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#8f817b] font-syne">Heritage: {currentTrad.origin}</span>
                  <h3 className="font-italiana text-3xl sm:text-4xl text-[#f5efe6] mt-1">{currentTrad.name}</h3>
                  <p className="text-sm italic text-[#c46851] font-sans mt-1">"{currentTrad.tagline}"</p>
                  <p className="text-sm text-[#e5d3c1] font-sans mt-4 leading-relaxed">{currentTrad.desc}</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#1d1614] border border-[#2a201d] space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-[#8f817b]">Recommended Setting</span>
                  <p className="text-xs font-sans text-[#f5efe6]">{currentTrad.idealFor}</p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#8f817b]">Curated Investment</span>
                    <p className="font-syne text-2xl font-bold text-[#c46851]">{currentTrad.price}</p>
                  </div>
                  <button
                    onClick={() => setCurrentChapter(5)}
                    className="px-6 py-3.5 rounded-xl bg-[#c46851] text-[#140e0c] font-syne text-xs uppercase tracking-widest font-bold hover:bg-[#d9795d] cursor-pointer"
                  >
                    Select Tradition
                  </button>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-[#2a201d] bg-[#1d1614]">
                  <img
                    src={currentTrad.image}
                    alt={currentTrad.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#140e0c] via-transparent to-transparent opacity-60" />
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* CHAPTER 03: ACT III — 48-HOUR METAMORPHOSIS               */}
        {/* ======================================================== */}
        {currentChapter === 3 && (
          <div className="space-y-8 animate-fadeIn">
            
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs uppercase tracking-[0.25em] text-[#c46851] font-syne font-semibold">
                Act III • Stain Alchemy
              </span>
              <h2 className="font-italiana text-4xl sm:text-6xl text-[#f5efe6]">
                The 48-Hour <span className="clay-gradient-text italic">Metamorphosis</span>
              </h2>
              <p className="text-sm text-[#8f817b] font-sans">
                Henna is a living plant dye. Tap the stages below to witness the organic lawsone oxidation from raw harvest paste to deep mahogany noir.
              </p>
            </div>

            {/* Metamorphosis Stage Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {STAIN_HOURS.map((stage, idx) => (
                <button
                  key={stage.hour}
                  onClick={() => setActiveStainIdx(idx)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    activeStainIdx === idx
                      ? 'bg-[#1d1614] border-[#c46851] text-white shadow-xl shadow-[#c46851]/10'
                      : 'bg-[#140e0c] border-[#2a201d] text-[#8f817b] hover:border-[#c46851]/30'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span 
                      className="w-3 h-3 rounded-full border border-white/20"
                      style={{ backgroundColor: stage.color }}
                    />
                    <span className="font-syne text-xs font-bold uppercase tracking-widest text-[#c46851]">Hour {stage.hour}</span>
                  </div>
                  <p className="font-italiana text-xl text-[#f5efe6]">{stage.title}</p>
                </button>
              ))}
            </div>

            {/* Metamorphosis Interactive Display */}
            <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-[#1d1614] border border-[#2a201d] grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-5 relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#140e0c]">
                <img
                  src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=85"
                  alt={currentStain.title}
                  style={{ filter: currentStain.filter }}
                  className="w-full h-full object-cover transition-all duration-700"
                />
              </div>

              <div className="md:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#140e0c] border border-[#2a201d] text-[10px] font-syne tracking-widest text-[#c46851] uppercase">
                  <Flame className="w-3 h-3" />
                  Oxidation Stage • Hour {currentStain.hour}
                </div>

                <h3 className="font-italiana text-3xl text-[#f5efe6]">{currentStain.title}</h3>
                <p className="text-sm text-[#e5d3c1] font-sans leading-relaxed">{currentStain.note}</p>

                <div className="p-4 rounded-2xl bg-[#140e0c] border border-[#2a201d] text-xs text-[#8f817b] space-y-1">
                  <span className="text-[#c46851] font-syne font-bold uppercase tracking-wider">Organic Aftercare Ritual:</span>
                  <p>Apply our complimentary clove balm 2 hours after removal. Avoid water for 12 hours for maximum mahogany saturation.</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* CHAPTER 04: ACT IV — THE LIVING ARCHIVE                   */}
        {/* ======================================================== */}
        {currentChapter === 4 && (
          <div className="space-y-8 animate-fadeIn">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#2a201d] pb-6">
              <div>
                <span className="text-xs uppercase tracking-[0.25em] text-[#c46851] font-syne font-semibold">
                  Act IV • Selected Testimonies
                </span>
                <h2 className="font-italiana text-4xl sm:text-6xl text-[#f5efe6] mt-1">
                  The Living <span className="clay-gradient-text italic">Archive</span>
                </h2>
              </div>
              <p className="text-xs text-[#8f817b] uppercase tracking-widest font-syne">Real Destination Weddings</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {ARCHIVE_STORIES.map((story) => (
                <div
                  key={story.id}
                  className="rounded-3xl p-6 bg-[#1d1614] border border-[#2a201d] flex flex-col justify-between space-y-6 hover:border-[#c46851]/40 transition-colors"
                >
                  <div className="space-y-4">
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#140e0c]">
                      <img
                        src={story.image}
                        alt={story.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-[#c46851] font-syne block">{story.venue}</span>
                    <h3 className="font-italiana text-2xl text-[#f5efe6]">{story.title}</h3>
                    <p className="text-xs text-[#e5d3c1] font-sans italic leading-relaxed">"{story.quote}"</p>
                  </div>

                  <div className="pt-4 border-t border-[#2a201d]">
                    <p className="font-syne text-xs font-bold text-[#f5efe6] uppercase">{story.bride}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* CHAPTER 05: EPILOGUE — PRIVATE BOOKING & CALCULATOR      */}
        {/* ======================================================== */}
        {currentChapter === 5 && (
          <div className="space-y-10 animate-fadeIn py-4">
            
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs uppercase tracking-[0.25em] text-[#c46851] font-syne font-semibold">
                Epilogue • Private Reservation
              </span>
              <h2 className="font-italiana text-4xl sm:text-6xl text-[#f5efe6]">
                Reserve Your <span className="clay-gradient-text italic">Date</span>
              </h2>
              <p className="text-sm text-[#8f817b] font-sans">
                Configure your bridal package below for an instant transparent invoice, and lock in your wedding date with our VIP studio concierge.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
              
              {/* Left: Package Configurator */}
              <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-[#1d1614] border border-[#2a201d] space-y-6">
                
                <div className="space-y-3">
                  <label className="block text-xs uppercase tracking-widest text-[#c46851] font-syne font-semibold">
                    1. Select Bridal Coverage
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'wrist', label: 'Wrist & Palms', price: '₹3,500' },
                      { id: 'half', label: 'Mid-Forearm', price: '₹6,500' },
                      { id: 'elbow', label: 'Elbows (Full)', price: '₹10,500' },
                      { id: 'full', label: 'Elbows + Feet', price: '₹15,500' }
                    ].map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setCoverage(opt.id)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          coverage === opt.id
                            ? 'bg-[#2a201d] border-[#c46851] text-white'
                            : 'bg-[#140e0c] border-[#2a201d] text-[#8f817b]'
                        }`}
                      >
                        <p className="font-syne text-xs font-bold">{opt.label}</p>
                        <p className="text-[11px] text-[#c46851] mt-0.5">{opt.price}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Motifs */}
                <div className="space-y-3">
                  <label className="block text-xs uppercase tracking-widest text-[#c46851] font-syne font-semibold">
                    2. Bespoke Motifs
                  </label>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setHasPortraits(!hasPortraits)}
                      className={`w-full p-3 rounded-xl border flex items-center justify-between cursor-pointer ${
                        hasPortraits ? 'bg-[#2a201d] border-[#c46851] text-white' : 'bg-[#140e0c] border-[#2a201d] text-[#8f817b]'
                      }`}
                    >
                      <span className="text-xs font-sans">Bride & Groom Portraiture</span>
                      <span className="font-syne text-xs text-[#c46851]">+ ₹2,500</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setHasHashtags(!hasHashtags)}
                      className={`w-full p-3 rounded-xl border flex items-center justify-between cursor-pointer ${
                        hasHashtags ? 'bg-[#2a201d] border-[#c46851] text-white' : 'bg-[#140e0c] border-[#2a201d] text-[#8f817b]'
                      }`}
                    >
                      <span className="text-xs font-sans">Wedding Hashtag & Skyline</span>
                      <span className="font-syne text-xs text-[#c46851]">+ ₹1,200</span>
                    </button>
                  </div>
                </div>

                {/* Guest Counter */}
                <div className="p-4 rounded-2xl bg-[#140e0c] border border-[#2a201d] flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#f5efe6] font-syne font-bold uppercase">Bridesmaids / Guests</p>
                    <p className="text-[10px] text-[#8f817b]">₹600 per person</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setGuestCount(Math.max(0, guestCount - 1))}
                      className="w-7 h-7 rounded-lg bg-[#2a201d] text-white flex items-center justify-center font-bold hover:bg-[#c46851]"
                    >
                      -
                    </button>
                    <span className="font-syne text-sm font-bold text-[#c46851] w-4 text-center">{guestCount}</span>
                    <button
                      type="button"
                      onClick={() => setGuestCount(guestCount + 1)}
                      className="w-7 h-7 rounded-lg bg-[#2a201d] text-white flex items-center justify-center font-bold hover:bg-[#c46851]"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Invoice Total */}
                <div className="pt-4 border-t border-[#2a201d] flex justify-between items-baseline">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#8f817b]">Estimated Investment</span>
                    <p className="text-[10px] text-[#c46851]">Organic aftercare balm kit included</p>
                  </div>
                  <span className="font-syne text-3xl font-bold text-[#f5efe6]">
                    ₹{calculateTotal().toLocaleString('en-IN')}
                  </span>
                </div>

              </div>

              {/* Right: Reservation Form */}
              <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-[#1d1614] border border-[#2a201d]">
                {submitted ? (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-12 h-12 rounded-full bg-[#10b981]/20 text-[#10b981] flex items-center justify-center mx-auto">
                      <Check className="w-6 h-6" />
                    </div>
                    <h3 className="font-italiana text-3xl text-[#f5efe6]">Date Inquiry Logged</h3>
                    <p className="text-xs text-[#e5d3c1] font-sans max-w-sm mx-auto">
                      Thank you, {form.name}. Your details have been submitted and forwarded directly to Bhuvi via WhatsApp.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-4 px-6 py-2 rounded-full bg-[#2a201d] text-xs uppercase tracking-widest text-[#c46851] hover:bg-[#c46851] hover:text-[#140e0c] transition-colors"
                    >
                      Submit Another
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleReservationSubmit} className="space-y-4">
                    <span className="text-xs uppercase tracking-widest text-[#c46851] font-syne font-semibold block mb-2">
                      Client Coordinates
                    </span>

                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Your Full Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#140e0c] border border-[#2a201d] text-xs text-[#f5efe6] outline-none focus:border-[#c46851]"
                      />
                    </div>

                    <div>
                      <input
                        type="tel"
                        required
                        placeholder="WhatsApp / Phone Number"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#140e0c] border border-[#2a201d] text-xs text-[#f5efe6] outline-none focus:border-[#c46851]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="date"
                        required
                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#140e0c] border border-[#2a201d] text-xs text-[#f5efe6] outline-none focus:border-[#c46851]"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Wedding Venue / City"
                        value={form.venue}
                        onChange={(e) => setForm({ ...form, venue: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#140e0c] border border-[#2a201d] text-xs text-[#f5efe6] outline-none focus:border-[#c46851]"
                      />
                    </div>

                    <div>
                      <textarea
                        rows="2"
                        placeholder="Special storytelling motifs or questions..."
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#140e0c] border border-[#2a201d] text-xs text-[#f5efe6] outline-none focus:border-[#c46851] resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 rounded-xl bg-[#c46851] hover:bg-[#d9795d] text-[#140e0c] font-syne font-bold text-xs uppercase tracking-[0.25em] transition-all cursor-pointer shadow-lg shadow-[#c46851]/30 flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Lock In Date via WhatsApp Concierge
                    </button>
                  </form>
                )}
              </div>

            </div>

          </div>
        )}

      </main>

      {/* ─── 3. BOTTOM CHAPTER NAVIGATION DECK CONTROLS ─────────── */}
      <footer className="sticky bottom-0 z-40 bg-[#140e0c]/95 backdrop-blur-md border-t border-[#2a201d] px-6 sm:px-12 py-4 flex items-center justify-between">
        
        {/* Previous Chapter Button */}
        <button
          onClick={prevChapter}
          disabled={currentChapter === 0}
          className="flex items-center gap-2 text-xs font-syne uppercase tracking-widest text-[#8f817b] hover:text-[#f5efe6] disabled:opacity-30 disabled:hover:text-[#8f817b] cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous Chapter</span>
        </button>

        {/* Chapter Progress Indicator Dots */}
        <div className="flex items-center gap-2">
          {CHAPTERS.map((ch, idx) => (
            <button
              key={ch.id}
              onClick={() => setCurrentChapter(idx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                currentChapter === idx
                  ? 'w-8 bg-[#c46851]'
                  : 'w-2 bg-[#2a201d] hover:bg-[#8f817b]'
              }`}
              title={`Go to Chapter ${ch.number}: ${ch.title}`}
            />
          ))}
        </div>

        {/* Next Chapter Button */}
        <button
          onClick={nextChapter}
          disabled={currentChapter === CHAPTERS.length - 1}
          className="flex items-center gap-2 text-xs font-syne uppercase tracking-widest text-[#c46851] hover:text-[#d9795d] disabled:opacity-30 disabled:hover:text-[#c46851] cursor-pointer transition-colors font-bold"
        >
          <span className="hidden sm:inline">Next Chapter</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </footer>

    </div>
  );
}

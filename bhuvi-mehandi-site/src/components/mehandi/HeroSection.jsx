import React, { useState, useEffect } from 'react';
import { createWhatsAppUrl } from '../../lib/supabase';
import { ChevronDown, Star, Sparkles, Phone } from 'lucide-react';

const HERO_STATS = [
  { value: '500+', label: 'Happy Brides' },
  { value: '6+', label: 'Years Experience' },
  { value: '100%', label: 'Natural Organic' },
  { value: '4.9★', label: 'Average Rating' },
];

const ROTATING_WORDS = ['Bridal', 'Engagement', 'Sangeet', 'Reception', 'Festival'];

export default function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setWordIndex(i => (i + 1) % ROTATING_WORDS.length);
        setVisible(true);
      }, 400);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  const bookNowLink = createWhatsAppUrl({
    eventType: 'Bridal Mehandi',
    customNote: 'I want to book Mehandi for my special event! Please share availability and pricing.'
  });

  const portfolioScrollLink = () => {
    const el = document.getElementById('portfolio');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1920&q=90"
          alt="Bhuvi Mehandi Artistry - Bridal Henna"
          className="w-full h-full object-cover object-center"
        />
        {/* Gradient overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-rose-950/85 via-rose-950/60 to-rose-900/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
      </div>

      {/* Decorative Mandala Ring */}
      <div className="absolute top-1/2 right-[10%] -translate-y-1/2 w-[420px] h-[420px] hidden xl:flex items-center justify-center z-10 pointer-events-none">
        <div className="absolute inset-0 rounded-full border border-amber-300/20 animate-[spin_30s_linear_infinite]" />
        <div className="absolute inset-6 rounded-full border border-amber-400/15 animate-[spin_20s_linear_infinite_reverse]" />
        <div className="absolute inset-14 rounded-full border border-rose-300/20" />
        {/* Floating petals */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-amber-400/40 rounded-full"
            style={{
              transform: `rotate(${deg}deg) translateX(190px)`,
              animation: `float-slow ${3 + i * 0.3}s ease-in-out infinite ${i * 0.2}s`
            }}
          />
        ))}
        <div className="w-32 h-32 rounded-full bg-amber-400/10 backdrop-blur-sm border border-amber-300/30 flex items-center justify-center">
          <span className="font-playfair text-amber-200/80 text-4xl font-bold">🌸</span>
        </div>
      </div>

      {/* Main Hero Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="max-w-2xl">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/20 border border-amber-300/40 backdrop-blur-sm mb-6">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-amber-200 text-xs font-semibold uppercase tracking-[0.18em] font-sans-clean">
              Gujarat's Trusted Mehandi Artist
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-playfair text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-4">
            Enchanting
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">
              Henna Art
            </span>
            <br />
            for Every{' '}
            <span
              className={`italic text-rose-200 transition-all duration-300 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
              }`}
              style={{ display: 'inline-block' }}
            >
              {ROTATING_WORDS[wordIndex]}
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-white/70 text-lg lg:text-xl leading-relaxed mb-8 font-sans-clean font-light max-w-xl">
            Bhuvi crafts timeless, deeply personal Mehandi stories using 100% 
            <strong className="font-semibold text-white/90"> organic chemical-free henna</strong>. 
            From royal bridal portraits to chic Arabic trails — every design is a 
            <em className="text-amber-200"> masterpiece</em>.
          </p>

          {/* Rating Stars */}
          <div className="flex items-center gap-2 mb-8">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-white/80 text-sm font-sans-clean">
              <strong className="text-white">4.9 / 5.0</strong> — Trusted by 500+ Brides
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={bookNowLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-3 px-7 py-4 rounded-full bg-green-500 hover:bg-green-600 text-white font-bold text-base transition-all duration-300 shadow-xl hover:shadow-green-500/30 hover:-translate-y-1 font-sans-clean"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current flex-shrink-0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Book Now on WhatsApp
            </a>

            <button
              onClick={portfolioScrollLink}
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full border-2 border-white/40 hover:border-white/70 text-white font-semibold text-base transition-all duration-300 backdrop-blur-sm hover:bg-white/10 font-sans-clean"
            >
              View Portfolio
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Trust Stats */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {HERO_STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-playfair text-2xl font-bold text-amber-300">{stat.value}</div>
                <div className="text-white/60 text-xs mt-0.5 font-sans-clean tracking-wide uppercase">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-white/50 text-xs font-sans-clean tracking-widest uppercase">Scroll</span>
        <ChevronDown className="w-5 h-5 text-amber-300/70" />
      </div>
    </section>
  );
}

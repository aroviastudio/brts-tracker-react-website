import React from 'react';
import { createWhatsAppUrl } from '../../lib/supabase';
import { Flower, MapPin, Phone, Mail, Heart } from 'lucide-react';

// Inline social SVG icons (lucide-react doesn't include branded icons)
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export default function Footer() {
  const links = {
    Services: ['Bridal Mehandi', 'Engagement Henna', 'Arabic Designs', 'Rajasthani Heritage', 'Baby Shower', 'Sangeet Party'],
    Explore: ['Design Gallery', 'Packages & Pricing', 'Bride Reviews', 'FAQ', 'Admin Panel'],
    Cities: ['Ahmedabad', 'Gandhinagar', 'Vadodara', 'Surat', 'Rajkot', 'Pan India Travel'],
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-rose-950 text-white relative overflow-hidden">
      {/* Top gradient line */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-full bg-amber-400/20 border border-amber-400/30 flex items-center justify-center">
                <Flower className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <p className="font-playfair font-bold text-lg text-white tracking-wide">Bhuvi Mehandi</p>
                <p className="text-amber-400/70 text-[10px] uppercase tracking-[0.2em] font-sans-clean">Artistry Studio</p>
              </div>
            </div>
            <p className="text-rose-200/60 text-sm leading-relaxed font-sans-clean mb-6 max-w-xs">
              Crafting timeless henna stories across Gujarat and India. 100% organic, deeply personal, and unforgettable artistry for every milestone.
            </p>

            {/* Contact Info */}
            <div className="space-y-2.5 mb-6">
              <a
                href={createWhatsAppUrl({ customNote: 'Hello Bhuvi! I would like to inquire about Mehandi services.' })}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-rose-200/70 hover:text-green-400 transition-colors text-sm font-sans-clean group"
              >
                <Phone className="w-4 h-4 group-hover:text-green-400" />
                +91 98765 43210 (WhatsApp)
              </a>
              <div className="flex items-center gap-2.5 text-rose-200/70 text-sm font-sans-clean">
                <Mail className="w-4 h-4" />
                bhuvi.mehandi@gmail.com
              </div>
              <div className="flex items-center gap-2.5 text-rose-200/70 text-sm font-sans-clean">
                <MapPin className="w-4 h-4" />
                Ahmedabad, Gujarat — Pan India
              </div>
            </div>

            {/* Social */}
            <div className="flex gap-3">
              {[
                { icon: <InstagramIcon />, href: '#', label: 'Instagram' },
                { icon: <FacebookIcon />, href: '#', label: 'Facebook' },
                { icon: <YoutubeIcon />, href: '#', label: 'YouTube' },
              ].map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-amber-400/20 border border-white/10 hover:border-amber-400/30 flex items-center justify-center text-rose-200/70 hover:text-amber-300 transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(links).map(([heading, items]) => (
            <div key={heading}>
              <h4 className="font-bold text-amber-300 text-xs uppercase tracking-widest mb-4 font-sans-clean">
                {heading}
              </h4>
              <ul className="space-y-2.5">
                {items.map(item => (
                  <li key={item}>
                    <button
                      onClick={() => scrollTo(
                        item === 'Design Gallery' ? 'portfolio' :
                        item === 'Packages & Pricing' ? 'packages' :
                        item === 'Bride Reviews' ? 'reviews' :
                        item === 'FAQ' || item === 'Admin Panel' ? 'admin' :
                        'services'
                      )}
                      className="text-rose-200/60 hover:text-white text-sm font-sans-clean transition-colors text-left"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-rose-200/40 text-xs font-sans-clean">
            © {new Date().getFullYear()} Bhuvi Mehandi Artistry. All rights reserved.
          </p>
          <p className="text-rose-200/40 text-xs font-sans-clean flex items-center gap-1.5">
            Made with <Heart className="w-3 h-3 text-rose-400 fill-current" /> for every bride's special day
          </p>
        </div>
      </div>
    </footer>
  );
}

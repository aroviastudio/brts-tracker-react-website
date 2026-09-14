import React, { useState, useEffect } from 'react';
import { createWhatsAppUrl } from '../../lib/supabase';
import { Menu, X, Flower, Phone } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home', href: '#hero' },
  { label: 'Services', href: '#services' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Packages', href: '#packages' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Contact', href: '#contact' },
  { label: 'Admin', href: '#admin' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);

      // Track active section
      const sections = NAV_LINKS.map(l => l.href.replace('#', ''));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 100) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const whatsAppLink = createWhatsAppUrl({ eventType: 'Bridal Mehandi Inquiry', customNote: 'Reached out from website header.' });

  const handleNavClick = (href) => {
    setMenuOpen(false);
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-rose-100'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <button
              onClick={() => handleNavClick('#hero')}
              className="flex items-center gap-2.5 group"
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                scrolled ? 'bg-rose-900' : 'bg-white/20 backdrop-blur-sm border border-white/40'
              }`}>
                <Flower className={`w-5 h-5 ${scrolled ? 'text-amber-300' : 'text-white'}`} />
              </div>
              <div className="flex flex-col leading-tight">
                <span className={`font-playfair font-bold text-lg tracking-wide transition-colors ${
                  scrolled ? 'text-rose-900' : 'text-white'
                }`}>Bhuvi Mehandi</span>
                <span className={`text-[10px] uppercase tracking-[0.2em] font-sans-clean font-medium transition-colors ${
                  scrolled ? 'text-amber-600' : 'text-amber-200'
                }`}>Artistry Studio</span>
              </div>
            </button>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map(link => {
                const isActive = activeSection === link.href.replace('#', '');
                const isAdmin = link.label === 'Admin';
                return (
                  <button
                    key={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 font-sans-clean ${
                      isAdmin
                        ? 'text-rose-600 border border-rose-200 hover:bg-rose-50 ml-1'
                        : isActive
                        ? scrolled
                          ? 'bg-rose-50 text-rose-900 font-semibold'
                          : 'text-white font-semibold bg-white/15'
                        : scrolled
                        ? 'text-stone-600 hover:text-rose-900 hover:bg-rose-50'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </div>

            {/* WhatsApp CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <a
                href={whatsAppLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-green-500 hover:bg-green-600 text-white transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-px font-sans-clean"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Book Now
              </a>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                scrolled ? 'text-stone-700 hover:bg-rose-50' : 'text-white hover:bg-white/10'
              }`}
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
          menuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-white border-t border-rose-100 px-4 pb-4 pt-2 shadow-xl">
            {NAV_LINKS.map(link => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="flex w-full items-center px-4 py-3 rounded-xl text-sm font-medium text-stone-700 hover:bg-rose-50 hover:text-rose-900 transition-colors font-sans-clean"
              >
                {link.label}
              </button>
            ))}
            <a
              href={whatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold bg-green-500 hover:bg-green-600 text-white transition-colors font-sans-clean"
            >
              <Phone className="w-4 h-4" />
              Book on WhatsApp
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}

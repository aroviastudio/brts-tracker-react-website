import React, { useState, useEffect, useRef } from 'react';
import { fetchDesigns } from '../../lib/supabase';
import { createWhatsAppUrl } from '../../lib/supabase';
import { Heart, Eye, ImagePlus, Search, ChevronRight, Flower } from 'lucide-react';

const CATEGORIES = [
  { key: 'all', label: 'All Designs' },
  { key: 'bridal', label: '👰 Bridal' },
  { key: 'arabic', label: '🌹 Arabic' },
  { key: 'rajasthani', label: '🦚 Rajasthani' },
  { key: 'feet', label: '🌺 Feet Art' },
  { key: 'engagement', label: '💍 Engagement' },
  { key: 'minimalist', label: '✨ Minimalist' },
];

function DesignCard({ design, onView }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(design.likesCount || 24);

  const handleLike = (e) => {
    e.stopPropagation();
    setLiked(prev => {
      const next = !prev;
      setLikes(l => l + (next ? 1 : -1));
      return next;
    });
  };

  const whatsAppLink = createWhatsAppUrl({
    eventType: 'Mehandi Design Inquiry',
    designCode: design.title,
    customNote: `I love the "${design.title}" design! Please share availability and pricing for this design.`
  });

  return (
    <div
      className="group relative cursor-pointer rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
      onClick={() => onView(design)}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
        <img
          src={design.imageUrl}
          alt={design.title}
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Tags */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-bold text-rose-800 shadow-sm">
            {design.tag}
          </span>
        </div>

        {/* Featured Crown */}
        {design.featured && (
          <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center shadow-md">
            <span className="text-xs">👑</span>
          </div>
        )}

        {/* Quick Actions on hover */}
        <div className="absolute inset-x-3 bottom-3 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={handleLike}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 backdrop-blur-sm ${
              liked
                ? 'bg-rose-500 text-white'
                : 'bg-white/90 text-rose-700 hover:bg-rose-50'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-current' : ''}`} />
            {likes}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onView(design); }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold bg-white/90 text-rose-700 hover:bg-rose-50 backdrop-blur-sm transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            View
          </button>
        </div>
      </div>

      {/* Card Bottom */}
      <div className="bg-white px-4 py-3 border-t border-rose-50">
        <h3 className="font-playfair font-bold text-rose-950 text-sm leading-tight truncate mb-0.5">
          {design.title}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-xs text-amber-700 font-semibold font-sans-clean">
            {design.priceRange || 'Custom Quote'}
          </span>
          <span className="text-xs text-stone-400 capitalize font-sans-clean">
            {design.category}
          </span>
        </div>
      </div>
    </div>
  );
}

function DesignModal({ design, onClose }) {
  const whatsAppLink = createWhatsAppUrl({
    eventType: 'Mehandi Design Inquiry',
    designCode: design.title,
    customNote: `I love the "${design.title}" design! Please share availability and pricing.`
  });

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl overflow-hidden max-w-3xl w-full shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Image */}
        <div className="md:w-1/2 flex-shrink-0 h-72 md:h-auto">
          <img
            src={design.imageUrl}
            alt={design.title}
            className="w-full h-full object-cover"
          />
        </div>
        {/* Info */}
        <div className="md:w-1/2 p-6 flex flex-col overflow-y-auto">
          <button
            onClick={onClose}
            className="self-end mb-4 text-stone-400 hover:text-stone-700 transition-colors text-2xl leading-none"
          >
            ×
          </button>
          <span className="text-xs text-rose-600 font-bold uppercase tracking-widest font-sans-clean mb-2">
            {design.category}
          </span>
          <h2 className="font-playfair text-2xl font-bold text-rose-950 mb-3 leading-tight">
            {design.title}
          </h2>
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200">
              {design.tag}
            </span>
            {design.featured && (
              <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold border border-rose-200">
                👑 Featured
              </span>
            )}
          </div>
          {design.description && (
            <p className="text-stone-600 text-sm leading-relaxed mb-4 font-sans-clean">
              {design.description}
            </p>
          )}
          {design.priceRange && (
            <div className="flex items-center gap-2 mb-6">
              <span className="text-stone-500 text-sm font-sans-clean">Starting Price:</span>
              <span className="font-bold text-rose-900 font-sans-clean">{design.priceRange}</span>
            </div>
          )}
          <div className="mt-auto flex gap-3">
            <a
              href={whatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-sm transition-colors font-sans-clean"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Book This Design
            </a>
            <button
              onClick={onClose}
              className="px-4 py-3 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-sm font-medium transition-colors font-sans-clean"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PortfolioSection() {
  const [designs, setDesigns] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [viewDesign, setViewDesign] = useState(null);
  const [search, setSearch] = useState('');
  const [showAll, setShowAll] = useState(false);
  const LIMIT = 6;

  useEffect(() => {
    fetchDesigns().then(data => {
      setDesigns(data);
      setFiltered(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let list = designs;
    if (activeCategory !== 'all') {
      list = list.filter(d => d.category.toLowerCase() === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(d =>
        d.title.toLowerCase().includes(q) ||
        (d.description || '').toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q)
      );
    }
    setFiltered(list);
    setShowAll(false);
  }, [activeCategory, search, designs]);

  const displayed = showAll ? filtered : filtered.slice(0, LIMIT);

  return (
    <section id="portfolio" className="py-20 lg:py-28 bg-gradient-to-b from-white to-rose-50/30 relative overflow-hidden">
      <div className="absolute top-20 left-10 text-rose-100/60 text-[160px] font-playfair select-none pointer-events-none leading-none">
        🌸
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-100 mb-4">
            <Flower className="w-3.5 h-3.5 text-rose-600" />
            <span className="text-rose-600 text-xs font-bold uppercase tracking-widest font-sans-clean">
              Our Portfolio
            </span>
          </div>
          <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-rose-950 mb-4">
            Our Design Gallery
          </h2>
          <p className="text-stone-500 text-lg max-w-xl mx-auto font-sans-clean leading-relaxed">
            Browse through hundreds of handcrafted designs. Click any design to view details and book directly.
          </p>
        </div>

        {/* Search + Category Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-center mb-10">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search designs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 focus:border-rose-300 focus:ring-2 focus:ring-rose-100 outline-none text-sm font-sans-clean transition-all"
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-nowrap max-w-full">
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`flex-shrink-0 px-3.5 py-2 rounded-full text-xs font-bold transition-all duration-200 font-sans-clean whitespace-nowrap ${
                  activeCategory === cat.key
                    ? 'bg-rose-900 text-white shadow-md'
                    : 'bg-white border border-stone-200 text-stone-600 hover:border-rose-200 hover:text-rose-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-stone-100 animate-pulse aspect-[3/4]" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-stone-400 text-lg font-sans-clean">No designs found for this filter.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {displayed.map(design => (
                <DesignCard key={design.id} design={design} onView={setViewDesign} />
              ))}
            </div>

            {filtered.length > LIMIT && (
              <div className="mt-10 text-center">
                <button
                  onClick={() => setShowAll(v => !v)}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-rose-800 text-rose-800 hover:bg-rose-800 hover:text-white font-bold text-sm transition-all duration-300 font-sans-clean"
                >
                  {showAll ? 'Show Less' : `Show All ${filtered.length} Designs`}
                  <ChevronRight className={`w-4 h-4 transition-transform ${showAll ? 'rotate-90' : ''}`} />
                </button>
              </div>
            )}
          </>
        )}

        {/* CTA Banner */}
        <div className="mt-16 rounded-3xl bg-gradient-to-r from-rose-900 to-rose-700 p-8 lg:p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 text-white text-[200px] font-playfair leading-none flex items-center justify-center select-none">
            🌸
          </div>
          <div className="relative">
            <h3 className="font-playfair text-3xl font-bold text-white mb-3">
              Don't see your dream design?
            </h3>
            <p className="text-rose-200 text-base mb-6 font-sans-clean max-w-lg mx-auto">
              Every design is 100% customized to your bridal attire, theme, and personality. Share reference photos and we'll create your perfect henna story.
            </p>
            <a
              href={createWhatsAppUrl({ customNote: 'I want a custom mehandi design. Let me share my reference images and vision!' })}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-white text-rose-900 font-bold text-sm hover:bg-amber-50 transition-all duration-200 shadow-lg font-sans-clean"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-green-600">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Request a Custom Design
            </a>
          </div>
        </div>
      </div>

      {/* Design Modal */}
      {viewDesign && <DesignModal design={viewDesign} onClose={() => setViewDesign(null)} />}
    </section>
  );
}

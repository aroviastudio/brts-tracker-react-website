import React, { useState } from 'react';
import { INITIAL_REVIEWS } from '../../data/mockData';
import { Star, Quote, CheckCircle, ChevronLeft, ChevronRight, Flower } from 'lucide-react';

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className={`w-4 h-4 ${i <= rating ? 'fill-amber-400 text-amber-400' : 'text-stone-200'}`}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review, active }) {
  return (
    <div
      className={`bg-white rounded-2xl p-6 lg:p-8 shadow-md border border-rose-50 flex flex-col gap-5 transition-all duration-300 ${
        active ? 'ring-2 ring-rose-200 shadow-xl scale-[1.01]' : ''
      }`}
    >
      {/* Quote Icon */}
      <div className="flex items-start justify-between">
        <Quote className="w-8 h-8 text-rose-200 fill-rose-100" />
        <div className="flex items-center gap-1.5">
          <StarRating rating={review.rating} />
          <span className="text-amber-600 font-bold text-sm font-sans-clean">{review.rating}.0</span>
        </div>
      </div>

      {/* Comment */}
      <p className="text-stone-700 leading-relaxed text-[0.92rem] font-sans-clean flex-1 italic">
        "{review.comment}"
      </p>

      {/* Client Info */}
      <div className="flex items-center gap-3 pt-2 border-t border-rose-50">
        {review.avatar ? (
          <img
            src={review.avatar}
            alt={review.clientName}
            className="w-11 h-11 rounded-full object-cover border-2 border-rose-100"
          />
        ) : (
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-rose-400 to-rose-700 flex items-center justify-center text-white font-bold font-playfair text-lg flex-shrink-0">
            {review.clientName.charAt(0)}
          </div>
        )}
        <div>
          <div className="flex items-center gap-1.5">
            <p className="font-bold text-rose-950 text-sm font-sans-clean">{review.clientName}</p>
            {review.verified && (
              <CheckCircle className="w-3.5 h-3.5 text-green-500 fill-green-100" />
            )}
          </div>
          <p className="text-xs text-stone-500 font-sans-clean">{review.eventType}</p>
          {review.location && (
            <p className="text-xs text-amber-600 font-sans-clean">📍 {review.location}</p>
          )}
        </div>
        {review.date && (
          <span className="ml-auto text-xs text-stone-400 font-sans-clean">{review.date}</span>
        )}
      </div>
    </div>
  );
}

export default function ReviewsSection() {
  const [currentIdx, setCurrentIdx] = useState(0);

  const prev = () => setCurrentIdx(i => (i - 1 + INITIAL_REVIEWS.length) % INITIAL_REVIEWS.length);
  const next = () => setCurrentIdx(i => (i + 1) % INITIAL_REVIEWS.length);

  return (
    <section id="reviews" className="py-20 lg:py-28 bg-[#fdfbf7] relative overflow-hidden">
      {/* Background deco */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-rose-50 rounded-full blur-3xl opacity-70" />
        <div className="absolute top-10 left-0 w-64 h-64 bg-amber-50 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-100 mb-4">
            <Flower className="w-3.5 h-3.5 text-rose-600" />
            <span className="text-rose-600 text-xs font-bold uppercase tracking-widest font-sans-clean">
              Real Brides Love Us
            </span>
          </div>
          <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-rose-950 mb-4">
            Stories from Happy Brides
          </h2>

          {/* Overall Rating */}
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-amber-50 border border-amber-100">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <div className="w-px h-5 bg-amber-200" />
            <span className="font-bold text-amber-800 font-sans-clean">4.9 / 5.0</span>
            <span className="text-amber-600/70 text-sm font-sans-clean">— 500+ Verified Brides</span>
          </div>
        </div>

        {/* Desktop: All cards in a grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-2 gap-6 mb-12">
          {INITIAL_REVIEWS.map((review, idx) => (
            <ReviewCard key={review.id} review={review} active={idx === 0} />
          ))}
        </div>

        {/* Mobile: Carousel */}
        <div className="md:hidden mb-8">
          <ReviewCard review={INITIAL_REVIEWS[currentIdx]} active />

          {/* Nav */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-rose-200 flex items-center justify-center text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-1.5">
              {INITIAL_REVIEWS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIdx(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === currentIdx ? 'w-6 bg-rose-700' : 'w-1.5 bg-rose-200'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-rose-200 flex items-center justify-center text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Trust Badges Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10">
          {[
            { icon: '🌿', title: '100% Organic', subtitle: 'Pure Natural Henna' },
            { icon: '🎨', title: '500+ Designs', subtitle: 'Unique Portfolio' },
            { icon: '📍', title: 'Pan Gujarat', subtitle: '+ All India Travel' },
            { icon: '⚡', title: 'Same Day', subtitle: 'WhatsApp Confirmation' },
          ].map(badge => (
            <div
              key={badge.title}
              className="flex flex-col items-center text-center p-4 rounded-2xl bg-white border border-rose-50 shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="text-2xl mb-2">{badge.icon}</span>
              <p className="font-bold text-rose-900 text-sm font-sans-clean">{badge.title}</p>
              <p className="text-stone-500 text-xs mt-0.5 font-sans-clean">{badge.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

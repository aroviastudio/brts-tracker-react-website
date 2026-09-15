import React from 'react';
import { createWhatsAppUrl } from '../../lib/supabase';
import { INITIAL_SERVICES } from '../../data/mockData';
import { Clock, CheckCircle2, ArrowRight, Flower } from 'lucide-react';

const CATEGORY_COLORS = {
  'Bridal': 'from-rose-900 to-rose-700',
  'Engagement': 'from-pink-800 to-rose-600',
  'Arabic': 'from-amber-800 to-orange-600',
  'Traditional': 'from-orange-900 to-amber-700',
  'Baby Shower': 'from-violet-800 to-purple-600',
  'Family & Guests': 'from-emerald-800 to-teal-600',
};

const BADGE_COLORS = {
  'Most Cherished': 'bg-amber-100 text-amber-800 border-amber-200',
  'Modern Chic': 'bg-rose-100 text-rose-800 border-rose-200',
  'Bold & Trendy': 'bg-orange-100 text-orange-800 border-orange-200',
  'Heritage Classic': 'bg-stone-100 text-stone-800 border-stone-200',
  'Skin-Safe Organic': 'bg-green-100 text-green-800 border-green-200',
  'Party Favorite': 'bg-purple-100 text-purple-800 border-purple-200',
};

function ServiceCard({ service }) {
  const gradientClass = CATEGORY_COLORS[service.category] || 'from-rose-900 to-rose-700';
  const badgeClass = BADGE_COLORS[service.badge] || 'bg-rose-100 text-rose-800 border-rose-200';

  const whatsAppLink = createWhatsAppUrl({
    eventType: service.eventType,
    service: service.name,
    customNote: `I'm interested in the "${service.name}" package (starting ${service.priceStarting}). Please share availability!`
  });

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-rose-50 hover:border-rose-100 hover:-translate-y-1.5 flex flex-col">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={service.imageUrl}
          alt={service.name}
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${gradientClass} opacity-50`} />

        {/* Category Tag */}
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-bold text-stone-700 shadow-sm">
          {service.category}
        </div>

        {/* Popular badge */}
        {service.popular && (
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-bold shadow-sm animate-pulse">
            ✦ Most Booked
          </div>
        )}

        {/* Price on image */}
        <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-sm shadow-md">
          <span className="text-rose-900 font-bold text-sm font-sans-clean">
            From {service.priceStarting}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {/* Badge + Duration */}
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${badgeClass}`}>
            {service.badge}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-stone-500 font-sans-clean">
            <Clock className="w-3.5 h-3.5" />
            {service.duration}
          </span>
        </div>

        {/* Name */}
        <h3 className="font-playfair text-xl font-bold text-rose-950 mb-2 leading-tight">
          {service.name}
        </h3>

        {/* Event Type */}
        <p className="text-xs text-amber-700 font-semibold uppercase tracking-wide mb-3 font-sans-clean">
          {service.eventType}
        </p>

        {/* Description */}
        <p className="text-stone-600 text-sm leading-relaxed mb-4 font-sans-clean line-clamp-2">
          {service.description}
        </p>

        {/* Includes List */}
        <ul className="flex flex-col gap-1.5 mb-5 flex-1">
          {service.includes.slice(0, 4).map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-xs text-stone-600 font-sans-clean leading-snug">{item}</span>
            </li>
          ))}
          {service.includes.length > 4 && (
            <li className="text-xs text-rose-600 font-semibold pl-5.5 font-sans-clean">
              + {service.includes.length - 4} more inclusions
            </li>
          )}
        </ul>

        {/* CTA */}
        <a
          href={whatsAppLink}
          target="_blank"
          rel="noopener noreferrer"
          className="group/btn flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-sm transition-all duration-200 shadow-md hover:shadow-lg font-sans-clean"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current flex-shrink-0">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Book This Service
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
        </a>
      </div>
    </div>
  );
}

export default function ServicesSection() {
  return (
    <section id="services" className="py-20 lg:py-28 bg-[#fdfbf7] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-100 mb-4">
            <Flower className="w-3.5 h-3.5 text-rose-600" />
            <span className="text-rose-600 text-xs font-bold uppercase tracking-widest font-sans-clean">
              What We Offer
            </span>
          </div>
          <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-rose-950 mb-4">
            Our Mehandi Services
          </h2>
          <p className="text-stone-500 text-lg max-w-2xl mx-auto leading-relaxed font-sans-clean">
            Tailored henna experiences for every milestone — from intimate rokas to grand 
            destination weddings. Each service is designed to make you <em className="text-rose-700">unforgettable</em>.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {INITIAL_SERVICES.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          <p className="text-stone-500 mb-4 font-sans-clean">
            Not sure which service suits you best?
          </p>
          <a
            href={createWhatsAppUrl({ customNote: 'I need help choosing the right mehandi package for my event.' })}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-rose-800 text-rose-800 hover:bg-rose-800 hover:text-white font-bold text-sm transition-all duration-300 font-sans-clean"
          >
            Chat With Us on WhatsApp
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

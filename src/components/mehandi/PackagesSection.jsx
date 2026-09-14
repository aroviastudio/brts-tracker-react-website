import React from 'react';
import { createWhatsAppUrl } from '../../lib/supabase';
import { PACKAGES_DATA } from '../../data/mockData';
import { CheckCircle2, Star, Flower, Crown, Gem } from 'lucide-react';

const PKG_ICONS = {
  'pkg-classic': <Star className="w-6 h-6" />,
  'pkg-royal': <Crown className="w-6 h-6" />,
  'pkg-destination': <Gem className="w-6 h-6" />,
};

export default function PackagesSection() {
  return (
    <section id="packages" className="py-20 lg:py-28 bg-gradient-to-b from-rose-950 via-rose-900 to-rose-950 relative overflow-hidden">
      {/* Decorative Mandala Background */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 text-white/5 text-[500px] font-playfair leading-none">
          ❈
        </div>
      </div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/30 mb-4">
            <Flower className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-amber-300 text-xs font-bold uppercase tracking-widest font-sans-clean">
              Bridal Packages
            </span>
          </div>
          <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-white mb-4">
            Choose Your Perfect Package
          </h2>
          <p className="text-rose-200/70 text-lg max-w-xl mx-auto font-sans-clean leading-relaxed">
            Transparent, all-inclusive bridal packages designed with brides in mind. No hidden charges, 
            only breathtaking artistry.
          </p>
        </div>

        {/* Package Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 lg:gap-8 items-start">
          {PACKAGES_DATA.map((pkg, idx) => {
            const isPopular = pkg.popular;
            const whatsAppLink = createWhatsAppUrl({
              eventType: 'Bridal Mehandi Package Inquiry',
              service: pkg.name,
              customNote: `I am interested in the "${pkg.name}" package (${pkg.price}). Please confirm availability and booking process.`
            });

            return (
              <div
                key={pkg.id}
                className={`relative rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 ${
                  isPopular
                    ? 'ring-2 ring-amber-400 shadow-2xl shadow-amber-400/20'
                    : 'ring-1 ring-white/10 shadow-xl'
                }`}
              >
                {/* Popular Banner */}
                {isPopular && (
                  <div className="absolute top-0 left-0 right-0 bg-amber-400 py-1.5 text-center z-10">
                    <span className="text-rose-950 text-xs font-bold uppercase tracking-widest font-sans-clean">
                      ✦ Most Popular Choice ✦
                    </span>
                  </div>
                )}

                {/* Card Background */}
                <div className={`bg-gradient-to-b ${pkg.color} ${isPopular ? 'pt-10' : 'pt-0'}`}>
                  <div className="p-7">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 mb-5">
                      <span className="text-amber-300">{PKG_ICONS[pkg.id]}</span>
                      <span className="text-white text-xs font-bold tracking-wider font-sans-clean">{pkg.badge}</span>
                    </div>

                    {/* Name & Tagline */}
                    <h3 className="font-playfair text-2xl font-bold text-white mb-2 leading-tight">
                      {pkg.name}
                    </h3>
                    <p className="text-white/60 text-sm mb-6 font-sans-clean leading-relaxed">
                      {pkg.tagline}
                    </p>

                    {/* Price */}
                    <div className="flex items-end gap-2 mb-7">
                      <span className="font-playfair text-4xl font-bold text-amber-300">
                        {pkg.price}
                      </span>
                      <span className="text-white/50 text-sm pb-1.5 font-sans-clean">onwards</span>
                    </div>

                    {/* Divider */}
                    <div className="w-full h-px bg-white/10 mb-6" />

                    {/* Features */}
                    <ul className="flex flex-col gap-3 mb-8">
                      {pkg.features.map((feat, fi) => (
                        <li key={fi} className="flex items-start gap-3">
                          <CheckCircle2 className="w-4 h-4 text-amber-300 mt-0.5 flex-shrink-0" />
                          <span className="text-white/80 text-sm font-sans-clean leading-snug">{feat}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <a
                      href={whatsAppLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl font-bold text-sm transition-all duration-200 shadow-lg font-sans-clean ${
                        isPopular
                          ? 'bg-amber-400 hover:bg-amber-300 text-rose-950 hover:-translate-y-0.5'
                          : 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
                      }`}
                    >
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current flex-shrink-0">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Book This Package
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Note */}
        <p className="mt-10 text-center text-rose-200/50 text-sm font-sans-clean">
          * All packages include 100% natural organic henna. Final pricing based on design complexity, venue, and artist travel. 
          <br className="hidden sm:block" />
          Contact us for a custom quotation!
        </p>
      </div>
    </section>
  );
}

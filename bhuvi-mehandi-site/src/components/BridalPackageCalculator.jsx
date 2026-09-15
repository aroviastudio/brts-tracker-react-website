import React, { useState } from 'react';
import { Calculator, Check, MessageCircle } from 'lucide-react';
import { createWhatsAppUrl } from '../lib/supabase';

const COVERAGE_OPTIONS = [
  { id: 'wrist', label: 'Wrist & Palms', desc: 'Minimalist heirloom mandalas', price: 3500 },
  { id: 'mid-arm', label: 'Mid-Forearm (Half Arm)', desc: 'Intricate jaali & botanical trails', price: 6500 },
  { id: 'elbow', label: 'Full Arms to Elbows', desc: 'Complete royal dulhan narrative', price: 10500, popular: true },
  { id: 'full-length', label: 'Elbows + Mid-Calf Feet', desc: 'Full imperial bridal ensemble', price: 15500 }
];

const ADDONS = [
  { id: 'portraits', label: 'Hand-Drawn Bride & Groom Portraits', price: 2500 },
  { id: 'hashtags', label: 'Custom Wedding Hashtags & Skyline', price: 1200 },
  { id: 'aftercare', label: 'VIP Aftercare Kit (Clove Balm + Seal)', price: 800, included: true },
  { id: 'guests', label: 'Bridesmaids / Family (Per Person)', price: 600 }
];

export default function BridalPackageCalculator() {
  const [selectedCoverage, setSelectedCoverage] = useState('elbow');
  const [selectedAddons, setSelectedAddons] = useState(['portraits', 'aftercare']);
  const [guestCount, setGuestCount] = useState(4);

  const currentCoverage = COVERAGE_OPTIONS.find(c => c.id === selectedCoverage) || COVERAGE_OPTIONS[2];

  const toggleAddon = (id) => {
    if (id === 'aftercare') return; // Always included free
    if (selectedAddons.includes(id)) {
      setSelectedAddons(selectedAddons.filter(a => a !== id));
    } else {
      setSelectedAddons([...selectedAddons, id]);
    }
  };

  // Compute total estimate
  const basePrice = currentCoverage.price;
  const addonsTotal = selectedAddons.reduce((sum, addonId) => {
    const item = ADDONS.find(a => a.id === addonId);
    if (!item) return sum;
    if (item.id === 'aftercare') return sum;
    if (item.id === 'guests') return sum + (item.price * guestCount);
    return sum + item.price;
  }, 0);

  const totalEstimate = basePrice + addonsTotal;

  const handleWhatsAppBooking = () => {
    const summary = `Hi Bhuvi! I used your Bespoke Package Builder:
- Coverage: ${currentCoverage.label} (₹${currentCoverage.price.toLocaleString('en-IN')})
- Customizations: ${selectedAddons.map(id => ADDONS.find(a => a.id === id)?.label).filter(Boolean).join(', ')}
${selectedAddons.includes('guests') ? `- Bridesmaids/Guests: ${guestCount} people` : ''}
- Total Estimated Investment: ₹${totalEstimate.toLocaleString('en-IN')}

I would love to check availability for my wedding date!`;

    const url = createWhatsAppUrl({
      eventType: 'Bespoke Package Builder Inquiry',
      customNote: summary
    });
    window.open(url, '_blank');
  };

  return (
    <section id="calculator" className="relative w-full bg-[#120e10] py-20 sm:py-28 px-4 sm:px-8 border-b border-[#2a2225] overflow-hidden">
      <div className="max-w-6xl mx-auto">
        
        {/* Title */}
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1e1719] border border-[#d4af37]/30 text-[#d4af37] text-xs uppercase tracking-[0.25em] font-sans">
            <Calculator className="w-3.5 h-3.5" />
            Transparent Investment Estimator
          </div>
          <h2 className="font-cinzel text-3xl sm:text-5xl font-normal text-[#fdfbf7]">
            Build Your <span className="italic font-light text-[#ba334a]">Bespoke</span> Bridal Package
          </h2>
          <p className="text-sm text-[#a69894] font-sans leading-relaxed">
            Customize your coverage, personalized portraiture, and guest requirements for an instant transparent estimate.
          </p>
        </div>

        {/* Builder Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Options Selection */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* 1. Select Coverage */}
            <div className="space-y-3">
              <label className="block text-xs uppercase tracking-[0.2em] text-[#d4af37] font-sans font-semibold">
                Step 1: Select Bridal Coverage
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {COVERAGE_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedCoverage(opt.id)}
                    className={`p-4 rounded-xl text-left border transition-all cursor-pointer relative ${
                      selectedCoverage === opt.id
                        ? 'bg-[#22181b] border-[#d4af37] text-white shadow-lg shadow-[#96283b]/20'
                        : 'bg-[#181416] border-[#2a2225] text-[#a69894] hover:border-white/20'
                    }`}
                  >
                    {opt.popular && (
                      <span className="absolute top-3 right-3 text-[10px] uppercase tracking-wider text-[#d4af37] bg-[#d4af37]/15 px-2 py-0.5 rounded-full border border-[#d4af37]/30">
                        Most Loved
                      </span>
                    )}
                    <p className="font-cinzel text-base text-[#fdfbf7] font-medium">{opt.label}</p>
                    <p className="text-xs text-[#a69894] font-sans mt-1">{opt.desc}</p>
                    <p className="font-cinzel text-sm text-[#d4af37] font-semibold mt-3">
                      ₹{opt.price.toLocaleString('en-IN')}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Select Addons */}
            <div className="space-y-3">
              <label className="block text-xs uppercase tracking-[0.2em] text-[#d4af37] font-sans font-semibold">
                Step 2: Custom Storytelling & Add-ons
              </label>
              <div className="space-y-2.5">
                {ADDONS.map((addon) => {
                  const isChecked = selectedAddons.includes(addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-[#1e171a] border-[#ba334a]/60 text-white'
                          : 'bg-[#181416] border-[#2a2225] text-[#a69894] hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                          isChecked ? 'bg-[#96283b] border-[#ba334a]' : 'border-[#44383c]'
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <div>
                          <p className="text-sm font-sans font-medium text-[#fdfbf7]">{addon.label}</p>
                          {addon.included && (
                            <span className="text-[10px] text-[#d4af37] uppercase tracking-wider">Complimentary with all bridal bookings</span>
                          )}
                        </div>
                      </div>
                      <span className="font-cinzel text-xs text-[#d4af37] font-semibold whitespace-nowrap">
                        {addon.included ? 'FREE' : `+ ₹${addon.price.toLocaleString('en-IN')}`}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Guest counter if guests selected */}
              {selectedAddons.includes('guests') && (
                <div className="p-4 rounded-xl bg-[#1a1417] border border-[#2a2225] flex items-center justify-between mt-3">
                  <div>
                    <p className="text-xs text-[#fdfbf7] font-sans font-medium">Number of Bridesmaids / Family</p>
                    <p className="text-[11px] text-[#a69894] font-sans">Speed bespoke application (both hands front)</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); setGuestCount(Math.max(1, guestCount - 1)); }}
                      className="w-8 h-8 rounded-lg bg-[#2a2225] text-white flex items-center justify-center font-bold hover:bg-[#96283b] cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-cinzel text-base text-[#d4af37] font-bold w-6 text-center">{guestCount}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); setGuestCount(guestCount + 1); }}
                      className="w-8 h-8 rounded-lg bg-[#2a2225] text-white flex items-center justify-center font-bold hover:bg-[#96283b] cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right: Real-time Summary Card */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-[#d4af37]/35 space-y-6 bg-gradient-to-b from-[#1a1417] to-[#120e10]">
              
              <div className="border-b border-[#2a2225] pb-4">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#d4af37] font-sans font-semibold">
                  Curated Investment
                </span>
                <h3 className="font-cinzel text-2xl text-[#fdfbf7] mt-1">
                  Package Summary
                </h3>
              </div>

              {/* Line Items */}
              <div className="space-y-3 text-sm font-sans">
                <div className="flex justify-between items-center text-[#fdfbf7]">
                  <span>{currentCoverage.label}</span>
                  <span className="font-cinzel text-[#d4af37]">₹{currentCoverage.price.toLocaleString('en-IN')}</span>
                </div>

                {selectedAddons.map(id => {
                  const item = ADDONS.find(a => a.id === id);
                  if (!item) return null;
                  const itemPrice = item.id === 'guests' ? item.price * guestCount : item.price;
                  return (
                    <div key={id} className="flex justify-between items-center text-xs text-[#a69894]">
                      <span>{item.label} {item.id === 'guests' ? `(${guestCount} guests)` : ''}</span>
                      <span className="font-cinzel text-[#d4af37]">
                        {item.included ? 'FREE' : `₹${itemPrice.toLocaleString('en-IN')}`}
                      </span>
                    </div>
                  );
                })}

                <div className="border-t border-[#2a2225] pt-4 mt-2 flex justify-between items-baseline">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-[#a69894] font-sans">Total Estimated</span>
                    <p className="text-[10px] text-[#7a6f68]">Organic paste & aftercare included</p>
                  </div>
                  <span className="font-cinzel text-3xl font-bold text-[#f5df88]">
                    ₹{totalEstimate.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Perks */}
              <div className="space-y-2 bg-[#0e0c0d]/60 p-3.5 rounded-xl border border-[#2a2225] text-[11px] text-[#a69894] font-sans">
                <p className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#d4af37]" /> 100% Organic Sojat Harvest paste guarantee
                </p>
                <p className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#d4af37]" /> Clove steam session & eucalyptus balm kit
                </p>
                <p className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#d4af37]" /> Free in-studio bridal design consultation
                </p>
              </div>

              {/* Reserve CTA */}
              <button
                onClick={handleWhatsAppBooking}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-[#96283b] to-[#ba334a] hover:from-[#ba334a] hover:to-[#96283b] text-white text-xs uppercase tracking-[0.25em] font-sans font-bold shadow-lg shadow-[#96283b]/40 cursor-pointer transition-transform duration-200"
              >
                <MessageCircle className="w-4 h-4" />
                Reserve This Custom Quote
              </button>

              <p className="text-[10px] text-center text-[#7a6f68] font-sans">
                No advance needed to inquire. Dates locked on confirmation.
              </p>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

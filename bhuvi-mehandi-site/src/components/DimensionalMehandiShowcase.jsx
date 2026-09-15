import React, { useState, useRef, useEffect } from 'react';
import { Eye, Sparkles, Layers, Compass, ArrowRight, ShieldCheck, Clock, Flame } from 'lucide-react';

// Curated realistic editorial bridal mehandi perspectives
const ANGLES = [
  {
    id: 'palm-heirloom',
    title: 'The Royal Dulhan Palm',
    category: 'Bridal Narrative',
    perspective: 'Front Palm & Fingers',
    tagline: 'Custom heirloom storytelling with bride-groom portraiture',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1400&q=90',
    description: 'Executed with a 0.2mm precision cone. Features personalized sacred temple arches, symmetrical royal peacocks, and bespoke wedding vows hidden within the micro-jaal.',
    hotspots: [
      { x: '48%', y: '42%', label: 'Sacred Mandala', detail: 'Concentric lotus mandala symbolizing eternal prosperity' },
      { x: '35%', y: '68%', label: 'Royal Wrist Cuff', detail: 'Architectural Marwari jharokha with micro-shading' },
      { x: '65%', y: '25%', label: 'Negative Lace', detail: 'Intricate finger mesh tailored to reception jewelry' }
    ],
    timeEstimate: '4.5 Hours',
    stainGuarantee: '7–12 Days'
  },
  {
    id: 'backhand-jaali',
    title: 'Architectural Back-Hand',
    category: 'Marwari Heritage',
    perspective: 'Dorsal Hand & Forearm',
    tagline: 'Flowing negative-space jaali & cascading vines',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1400&q=90',
    description: 'Designed specifically to accentuate diamond engagement rings and bridal bangles. Intricate botanical flourishes cascade seamlessly up the forearm.',
    hotspots: [
      { x: '52%', y: '36%', label: 'Ring Accent Mesh', detail: 'Open-space mesh designed around bridal jewellery' },
      { x: '40%', y: '62%', label: 'Botanical Trail', detail: 'Shaded Arabian lotus petals with micro-dot borders' }
    ],
    timeEstimate: '2.5 Hours',
    stainGuarantee: '7–10 Days'
  },
  {
    id: 'cuff-forearm',
    title: 'The Sangeet Forearm Cuffs',
    category: 'Contemporary Arabic',
    perspective: 'Forearm to Elbow',
    tagline: 'Bespoke shaded petals & modern geometric rhythm',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1400&q=90',
    description: 'A bold, high-contrast composition combining geometric rhythms with lush Arabic florals that create a dramatic impact from across the wedding mandap.',
    hotspots: [
      { x: '50%', y: '50%', label: 'Crown Gateway', detail: 'Royal shehnai & kalash motifs woven into border' }
    ],
    timeEstimate: '3.0 Hours',
    stainGuarantee: '8–12 Days'
  },
  {
    id: 'feet-payal',
    title: 'Royal Bridal Feet & Payal',
    category: 'Heirloom Feet',
    perspective: 'Feet & Ankles',
    tagline: 'Symmetrical ankle cuffs & delicate toe lace',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1400&q=90',
    description: 'Graceful ankle jaal that mimics the weight and luster of a royal gold payal, paired with clean toe crests and soothing organic lavender oils.',
    hotspots: [
      { x: '45%', y: '55%', label: 'Ankle Payal Band', detail: 'Embossed henna beads mimicking bridal anklets' }
    ],
    timeEstimate: '2.0 Hours',
    stainGuarantee: '10–14 Days'
  }
];

const STAIN_STAGES = [
  {
    stage: 'Hour 00',
    title: 'Fresh Paste Application',
    color: '#34241d',
    textColor: '#e8c9a0',
    note: 'Rich, aromatic paste infused with lavender & tea tree oil.',
    filter: 'contrast(1.08) brightness(0.96) saturate(0.9)'
  },
  {
    stage: 'Hour 24',
    title: 'Warm Terracotta Oxidation',
    color: '#b84227',
    textColor: '#ffbca8',
    note: 'Paste removed. Clove steam locks deep natural tannins.',
    filter: 'contrast(1.15) brightness(1.02) saturate(1.25) sepia(0.2)'
  },
  {
    stage: 'Hour 48',
    title: 'Deep Mahogany Noir',
    color: '#5c101c',
    textColor: '#f8d4dc',
    note: 'Peak wedding-day stain. Rich, dark, fragrant heirloom finish.',
    filter: 'contrast(1.22) brightness(0.92) saturate(1.35) sepia(0.35) hue-rotate(-10deg)'
  }
];

export default function DimensionalMehandiShowcase() {
  const [activeAngleIndex, setActiveAngleIndex] = useState(0);
  const [activeStainStage, setActiveStainStage] = useState(2); // Default to deep mahogany
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [rotateValues, setRotateValues] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const currentAngle = ANGLES[activeAngleIndex];
  const currentStain = STAIN_STAGES[activeStainStage];

  // 3D smooth tilt effect for desktop & touch
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Dampened tilt angles (-8deg to +8deg)
    setRotateValues({
      x: (-y / (rect.height / 2)) * 7,
      y: (x / (rect.width / 2)) * 7
    });
  };

  const handleMouseLeave = () => {
    setRotateValues({ x: 0, y: 0 });
    setActiveHotspot(null);
  };

  return (
    <section className="relative w-full bg-[#0e0c0d] text-[#fdfbf7] py-20 sm:py-28 px-4 sm:px-8 overflow-hidden border-b border-[#2a2225]">
      {/* Ambient background glow layers */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#96283b]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-[#d4af37]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Header Badge & Title */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1e1719] border border-[#d4af37]/30 text-[#d4af37] text-xs uppercase tracking-[0.25em] font-sans">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            Dimensional Artistry Atelier
          </div>
          <h2 className="font-cinzel text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#fdfbf7]">
            Explore the <span className="italic font-light text-[#ba334a]">Heirloom</span> in 360°
          </h2>
          <p className="text-sm sm:text-base text-[#a69894] font-sans max-w-2xl mx-auto leading-relaxed">
            Interact with our master bridal portfolio. Switch angles, inspect micro-jaali precision hotspots, and simulate natural 48-hour botanical oxidation.
          </p>
        </div>

        {/* Main Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Interactive 3D Perspective Card */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div 
              style={{ perspective: '1200px' }}
              className="w-full max-w-lg cursor-grab active:cursor-grabbing"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div
                ref={cardRef}
                style={{
                  transform: `rotateX(${rotateValues.x}deg) rotateY(${rotateValues.y}deg)`,
                  transition: 'transform 0.15s ease-out',
                  transformStyle: 'preserve-3d'
                }}
                className="relative rounded-2xl overflow-hidden glass-panel border border-[#d4af37]/30 shadow-2xl p-3 bg-gradient-to-b from-[#1c1618] to-[#120e10]"
              >
                {/* Image Container with Stain Filter */}
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#181416]">
                  <img
                    src={currentAngle.image}
                    alt={currentAngle.title}
                    style={{ filter: currentStain.filter }}
                    className="w-full h-full object-cover object-center transition-all duration-700 ease-out"
                    loading="lazy"
                  />

                  {/* Subtle Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e0c0d]/80 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute inset-0 bg-radial from-transparent via-transparent to-[#0e0c0d]/40 pointer-events-none" />

                  {/* Interactive Hotspots */}
                  {currentAngle.hotspots.map((spot, idx) => (
                    <div
                      key={idx}
                      style={{ top: spot.y, left: spot.x }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
                    >
                      <button
                        onClick={() => setActiveHotspot(activeHotspot === idx ? null : idx)}
                        className="relative w-8 h-8 rounded-full flex items-center justify-center bg-[#0e0c0d]/80 border border-[#d4af37] text-[#d4af37] shadow-lg hover:scale-110 transition-transform cursor-pointer"
                        aria-label={spot.label}
                      >
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4af37] opacity-40" />
                        <span className="w-2 h-2 rounded-full bg-[#d4af37]" />
                      </button>

                      {/* Hotspot Tooltip */}
                      {(activeHotspot === idx) && (
                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-48 sm:w-56 p-3 rounded-lg bg-[#181416]/95 border border-[#d4af37]/50 backdrop-blur-md text-left z-30 shadow-xl pointer-events-auto">
                          <p className="font-cinzel text-xs font-semibold text-[#d4af37]">{spot.label}</p>
                          <p className="text-[11px] text-[#fdfbf7] font-sans mt-1 leading-snug">{spot.detail}</p>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Top Perspective Badge */}
                  <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-[#0e0c0d]/85 backdrop-blur-md border border-[#d4af37]/30 text-[11px] font-sans tracking-widest text-[#fdfbf7] uppercase">
                    {currentAngle.perspective}
                  </div>

                  {/* Active Stain Pill */}
                  <div className="absolute bottom-4 left-4 right-4 z-10 p-3 rounded-xl bg-[#0e0c0d]/90 backdrop-blur-md border border-[#2a2225] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3.5 h-3.5 rounded-full border border-white/30"
                        style={{ backgroundColor: currentStain.color }}
                      />
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-[#a69894] font-sans">{currentStain.stage}</p>
                        <p className="text-xs font-medium text-[#fdfbf7] font-sans">{currentStain.title}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#d4af37] tracking-wider uppercase font-sans font-medium px-2 py-0.5 rounded bg-[#d4af37]/10 border border-[#d4af37]/30">
                      Live Sim
                    </span>
                  </div>
                </div>

                {/* Micro Drag Hint */}
                <div className="py-2 text-center text-[10px] tracking-[0.2em] uppercase text-[#7a6f68] font-sans">
                  Hover / Drag to inspect dimensional depth
                </div>
              </div>
            </div>

            {/* Angle Selection Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6 w-full max-w-lg">
              {ANGLES.map((angle, idx) => (
                <button
                  key={angle.id}
                  onClick={() => {
                    setActiveAngleIndex(idx);
                    setActiveHotspot(null);
                  }}
                  className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl text-xs font-sans tracking-wider transition-all duration-300 cursor-pointer text-center border ${
                    activeAngleIndex === idx
                      ? 'bg-[#96283b] border-[#ba334a] text-white shadow-lg shadow-[#96283b]/30 font-medium'
                      : 'bg-[#181416] border-[#2a2225] text-[#a69894] hover:border-[#d4af37]/40 hover:text-white'
                  }`}
                >
                  {angle.title.split(' ')[0]} {angle.title.split(' ')[1]}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Angle Deep Details & Stain Oxidation Simulator */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Perspective Editorial Overview */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-sans text-[#d4af37] tracking-[0.2em] uppercase">
                <Compass className="w-3.5 h-3.5" />
                <span>{currentAngle.category}</span>
              </div>

              <h3 className="font-cinzel text-2xl sm:text-3xl font-normal text-[#fdfbf7]">
                {currentAngle.title}
              </h3>

              <p className="text-sm font-sans italic text-[#ba334a]">
                "{currentAngle.tagline}"
              </p>

              <p className="text-sm text-[#a69894] font-sans leading-relaxed">
                {currentAngle.description}
              </p>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-[#181416] border border-[#2a2225]">
                  <div className="flex items-center gap-2 text-[11px] text-[#a69894] font-sans uppercase tracking-wider">
                    <Clock className="w-3.5 h-3.5 text-[#d4af37]" /> Application Time
                  </div>
                  <p className="font-cinzel text-base text-[#fdfbf7] mt-1">{currentAngle.timeEstimate}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#181416] border border-[#2a2225]">
                  <div className="flex items-center gap-2 text-[11px] text-[#a69894] font-sans uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#ba334a]" /> Stain Longevity
                  </div>
                  <p className="font-cinzel text-base text-[#fdfbf7] mt-1">{currentAngle.stainGuarantee}</p>
                </div>
              </div>
            </div>

            {/* Stain Maturation Simulator */}
            <div className="p-5 rounded-2xl bg-[#161214] border border-[#d4af37]/25 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#ba334a]" />
                  <h4 className="font-cinzel text-sm text-[#fdfbf7] tracking-wider uppercase">
                    Botanical Oxidation Simulator
                  </h4>
                </div>
                <span className="text-[10px] text-[#a69894] font-sans">Tap stage to preview</span>
              </div>

              {/* Stage Buttons */}
              <div className="grid grid-cols-3 gap-2">
                {STAIN_STAGES.map((stain, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveStainStage(idx)}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      activeStainStage === idx
                        ? 'bg-[#221a1d] border-[#d4af37] text-white shadow-md'
                        : 'bg-[#120e10] border-[#2a2225] text-[#7a6f68] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <div 
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: stain.color }}
                      />
                      <span className="text-[10px] font-sans uppercase tracking-wider text-[#d4af37]">{stain.stage}</span>
                    </div>
                    <p className="text-[11px] font-medium font-sans truncate text-[#fdfbf7]">{stain.title.split(' ')[0]}</p>
                  </button>
                ))}
              </div>

              <p className="text-xs text-[#a69894] font-sans italic bg-[#0e0c0d] p-3 rounded-lg border border-[#2a2225]">
                <span className="text-[#d4af37] font-semibold">Master Tip: </span>
                {currentStain.note}
              </p>
            </div>

            {/* Direct Consultation Action */}
            <div className="pt-2">
              <a
                href="#consultation"
                className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-[#96283b] to-[#ba334a] hover:from-[#ba334a] hover:to-[#96283b] text-white text-xs uppercase tracking-[0.25em] font-sans font-semibold transition-all duration-300 shadow-lg shadow-[#96283b]/30"
              >
                Inquire For This Composition
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

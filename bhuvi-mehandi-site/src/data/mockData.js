// Initial curated portfolio and services for Bhuvi Mehandi
export const INITIAL_SERVICES = [
  {
    id: "serv-bridal-royal",
    name: "Royal Luxury Bridal Mehandi",
    category: "Bridal",
    eventType: "Wedding Day",
    priceStarting: "₹7,500",
    duration: "4 - 6 Hours",
    description: "Our crowning jewel service for brides. Handcrafted royal storytelling featuring personalized bride-groom figures, wedding rituals, elephant baraat processions, and secret groom initials.",
    includes: [
      "Both full arms from palms to elbows (front & back)",
      "Both feet intricate artwork up to mid-calf",
      "Custom Dulha-Dulhan portrait or wedding story",
      "Symmetrical jaali work with lotus & peacock motifs",
      "100% Organic homemade henna cones with Nilgiri oil",
      "Complimentary clove-infused aftercare stain balm"
    ],
    imageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
    popular: true,
    badge: "Most Cherished"
  },
  {
    id: "serv-engagement-chic",
    name: "Engagement & Modern Roka Chic",
    category: "Engagement",
    eventType: "Roka / Ring Ceremony",
    priceStarting: "₹2,500",
    duration: "2 - 3 Hours",
    description: "Contemporary, photogenic henna tailored for diamond rings and modern pastel lehengas. Features spacious negative-space mandalas and delicate finger cuffs.",
    includes: [
      "Both hands palm & back from fingertips to mid-forearm",
      "Modern floral medallion and negative-space lace",
      "Delicate ring-accentuating finger detailing",
      "Fast-drying organic formulation",
      "Post-application sealant spray"
    ],
    imageUrl: "https://images.unsplash.com/photo-1516914943479-89db7d9ae7f2?auto=format&fit=crop&w=800&q=80",
    popular: false,
    badge: "Modern Chic"
  },
  {
    id: "serv-arabic-flow",
    name: "Arabic & Indo-Western Fusion",
    category: "Arabic",
    eventType: "Cocktail / Reception",
    priceStarting: "₹1,800",
    duration: "1.5 - 2 Hours",
    description: "Striking bold shaded Arabic roses, flowing vine trails, and geometric wrist bands. Designed for quick, bold aesthetic appeal that pops in photography.",
    includes: [
      "Front & back hands with bold shaded leaf & floral trails",
      "Exquisite negative-space contrast technique",
      "Custom wrist cuffs resembling antique jewelry",
      "Pure organic deep-stain henna cones"
    ],
    imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
    popular: true,
    badge: "Bold & Trendy"
  },
  {
    id: "serv-rajasthani-trad",
    name: "Traditional Marwari & Rajasthani Heritage",
    category: "Traditional",
    eventType: "Wedding / Karwa Chauth",
    priceStarting: "₹4,500",
    duration: "3 - 4.5 Hours",
    description: "Dense, hyper-intricate classical patterns inspired by royal Rajasthan palaces: Kalash, royal peacocks, shehnai, doli, and micro-grid jaali shading.",
    includes: [
      "Palms, full back of hands up to 3/4 forearm",
      "Palace arch jharokha and royal peacock motifs",
      "Micro-jaali shading with ultra-fine cone tip",
      "Rich mahogany-black stain guarantee"
    ],
    imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
    popular: false,
    badge: "Heritage Classic"
  },
  {
    id: "serv-baby-shower",
    name: "Mom-to-Be Godh Bharai / Baby Shower",
    category: "Baby Shower",
    eventType: "Godh Bharai / Seemantham",
    priceStarting: "₹2,200",
    duration: "1.5 - 2 Hours",
    description: "Gentle, non-toxic, skin-safe henna customized for mothers-to-be. Infused only with gentle Bulgarian lavender and tea tree oils, free from all synthetic colorants or chemical dyes.",
    includes: [
      "Mom-to-be hands with charming baby-themed motifs",
      "Optional belly henna artwork with blessing mandala",
      "100% tested organic triple-sifted Rajasthani henna",
      "Ergonomic relaxed posture application pace"
    ],
    imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    popular: false,
    badge: "Skin-Safe Organic"
  },
  {
    id: "serv-sangeet-party",
    name: "Sangeet & Family Guest Mehndi Party",
    category: "Family & Guests",
    eventType: "Sangeet Night / Mehndi Party",
    priceStarting: "₹1,200 / hr (or per hand)",
    duration: "Custom (2 - 6 Hours)",
    description: "Keep your wedding guests and bridesmaids enchanted! Fast-paced expert application delivering stunning party designs in just 5-8 minutes per person.",
    includes: [
      "Lead artist Bhuvi + assistant artists team available",
      "Choice of Arabic trails, palm mandalas, or wrist bands",
      "Organized guest queue flow & token management",
      "All organic cones and aftercare handouts provided"
    ],
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    popular: true,
    badge: "Party Favorite"
  }
];

export const INITIAL_DESIGNS = [
  {
    id: "des-1",
    title: "The Royal Dulha-Dulhan Storyline",
    category: "bridal",
    imageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
    description: "Custom bridal palms featuring hand-drawn portraits of the bride and groom under ornate royal palace archways.",
    priceRange: "₹9,000 - ₹15,000",
    tag: "Signature Bridal",
    featured: true,
    likesCount: 240
  },
  {
    id: "des-2",
    title: "Arabic Rose & Flowing Lacey Trails",
    category: "arabic",
    imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
    description: "Contemporary shaded roses spiraling from index finger through wrist with lace-patterned negative space.",
    priceRange: "₹1,800 - ₹3,500",
    tag: "Modern Arabic",
    featured: true,
    likesCount: 185
  },
  {
    id: "des-3",
    title: "Royal Peacock & Lotus Bridal Feet",
    category: "feet",
    imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    description: "Symmetrical royal ankle anklet design extending upwards with blooming lotus petals and dancing peacocks.",
    priceRange: "₹3,500 - ₹6,000",
    tag: "Bridal Feet",
    featured: true,
    likesCount: 194
  },
  {
    id: "des-4",
    title: "Marwari Heritage Micro-Jaali Art",
    category: "rajasthani",
    imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
    description: "Dense, geometric micro-jaali net work combined with shehnai, kalash, and elephant procession motifs.",
    priceRange: "₹6,000 - ₹11,000",
    tag: "Heritage Rajasthani",
    featured: false,
    likesCount: 132
  },
  {
    id: "des-5",
    title: "Negative Space Minimalist Cocktail Henna",
    category: "minimalist",
    imageUrl: "https://images.unsplash.com/photo-1516914943479-89db7d9ae7f2?auto=format&fit=crop&w=800&q=80",
    description: "Modern minimalist cuffs and airy botanical lines created for sangeet parties and western reception wear.",
    priceRange: "₹1,500 - ₹3,000",
    tag: "Minimalist",
    featured: false,
    likesCount: 98
  },
  {
    id: "des-6",
    title: "Symmetrical Mandala & Cuff Elegance",
    category: "engagement",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    description: "Geometric precision mandala centered on the palm with intricate finger rings and a bracelet cuff band.",
    priceRange: "₹2,500 - ₹4,500",
    tag: "Engagement Special",
    featured: true,
    likesCount: 156
  },
  {
    id: "des-7",
    title: "Destination Wedding Royal Bridal Sleeves",
    category: "bridal",
    imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    description: "Elbow-length bridal grandeur with symmetrical paisley, lotus ponds, and personalized initials.",
    priceRange: "₹8,500 - ₹14,000",
    tag: "Full Bridal",
    featured: true,
    likesCount: 210
  },
  {
    id: "des-8",
    title: "Delicate Anklet & Floral Toes Pattern",
    category: "feet",
    imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
    description: "Ethereal payal/anklet band with dangling droplet accents and individual floral toe caps.",
    priceRange: "₹2,500 - ₹4,500",
    tag: "Modern Feet",
    featured: false,
    likesCount: 118
  }
];

export const INITIAL_REVIEWS = [
  {
    id: "rev-1",
    clientName: "Priyanka & Rahul Sharma",
    eventType: "Bridal Mehandi",
    location: "Grand Bhagwati, Ahmedabad",
    rating: 5,
    comment: "Bhuvi is an absolute magician! She customized our bridal mehandi to include the skyline where we first met and our wedding logo. The color deepened into a dark rich mahogany on my pheras day! 100% natural and fragrant henna.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    verified: true,
    date: "August 2026"
  },
  {
    id: "rev-2",
    clientName: "Sneha Patel",
    eventType: "Engagement Ceremony",
    location: "Vadodara",
    rating: 5,
    comment: "I booked Bhuvi over WhatsApp on short notice. She was so calm, professional, and her speed was astounding. The arabic design was so modern and crisp that every guest was asking for her contact!",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    verified: true,
    date: "July 2026"
  },
  {
    id: "rev-3",
    clientName: "Ananya & Rohan Desai",
    eventType: "Sangeet & Family Guest Package",
    location: "Surat",
    rating: 5,
    comment: "We booked the guest package for 35 relatives. Bhuvi and her team managed the crowd so smoothly! Not a single person was kept waiting, and each design was unique and beautiful. Will always hire Bhuvi for family weddings!",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    verified: true,
    date: "June 2026"
  },
  {
    id: "rev-4",
    clientName: "Meera Trivedi",
    eventType: "Godh Bharai / Baby Shower",
    location: "Gandhinagar",
    rating: 5,
    comment: "I was very nervous about chemical reactions since my skin is very sensitive during pregnancy. Bhuvi prepared fresh chemical-free organic cones right in front of us with pure lavender oil. Safe, gentle, and the stain was breathtaking!",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    verified: true,
    date: "May 2026"
  }
];

export const PACKAGES_DATA = [
  {
    id: "pkg-classic",
    name: "Classic Bridal Elegance",
    tagline: "Intricate wrists & palms for traditional brides",
    price: "₹6,500",
    badge: "Budget Friendly",
    popular: false,
    features: [
      "Both hands front & back up to mid-forearm",
      "Feet design up to ankles",
      "Traditional floral & jaali motifs",
      "Secret groom initials placement",
      "Organic henna cones provided",
      "Application time: ~3.5 Hours"
    ],
    color: "from-amber-700/80 to-amber-900"
  },
  {
    id: "pkg-royal",
    name: "Royal Grandeur Bridal Signature",
    tagline: "Our most requested full-length wedding package",
    price: "₹10,500",
    badge: "Most Popular",
    popular: true,
    features: [
      "Full hands front & back to elbows",
      "Both feet intricate artwork to mid-calf",
      "Custom Bride & Groom portrait figurines",
      "Wedding ritual moments & customized hashtags",
      "Complimentary touch-up & clove steam guide",
      "Herbal aftercare stain sealant balm included",
      "Application time: ~5 - 6 Hours"
    ],
    color: "from-rose-800 to-rose-950"
  },
  {
    id: "pkg-destination",
    name: "Destination Luxury Diamond",
    tagline: "Exclusive VIP experience for destination weddings",
    price: "₹18,000",
    badge: "VIP Luxury",
    popular: false,
    features: [
      "Shoulder-length bridal arms front & back",
      "Feet & calves to knees full bridal jaali",
      "Hand-sketched custom design consultation",
      "Includes mehandi for Mother of Bride & Groom",
      "Artist travel to venue / resort suite",
      "Dedicated bridal care kit & stain guarantee",
      "Application time: ~6 - 7.5 Hours"
    ],
    color: "from-purple-900 to-rose-900"
  }
];

export const FAQS = [
  {
    q: "Are Bhuvi's mehandi cones 100% natural and organic?",
    a: "Yes! We strictly formulate our henna paste using 100% triple-sifted natural Rajasthani Sojat henna powder, distilled water, sugar, and pure grade-A Nilgiri, Tea Tree, and Bulgarian Lavender essential oils. We guarantee zero chemical dyes, zero PPD, and zero synthetic preservatives."
  },
  {
    q: "How many days before the wedding should bridal mehandi be applied?",
    a: "Natural henna requires 48 hours to mature to its deepest, richest mahogany-burgundy color. We recommend booking your mehandi ceremony 2 days prior to your primary wedding / reception day."
  },
  {
    q: "Do you travel to venues, hotels, and destination weddings?",
    a: "Yes! Bhuvi travels locally across Ahmedabad, Gandhinagar, Vadodara, Surat, and across India for destination weddings. Travel and stay arrangements are discussed transparently upon inquiry."
  },
  {
    q: "How do I secure my wedding date booking?",
    a: "You can click any of our 'Book on WhatsApp' buttons to send your event date, venue city, and chosen package. We confirm date availability immediately and lock your slot upon a nominal advance deposit."
  },
  {
    q: "What aftercare steps ensure the darkest possible henna stain?",
    a: "Keep the dry paste on for at least 6 to 8 hours (preferably overnight). Do NOT wash off with water; scrape off with mustard/coconut oil. Apply warm clove steam and avoid soap or water contact for the initial 24 hours."
  }
];

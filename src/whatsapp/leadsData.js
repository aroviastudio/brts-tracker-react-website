// Real Verified Business Leads from dataset
export const BUSINESS_LEADS = [
  {
    id: 'global-dental',
    name: 'Global Dental Clinic & Implant Center',
    category: 'Multispecialty Dental Care',
    niche: 'dental',
    city: 'Ahmedabad',
    phone: '+919409118811',
    cleanPhone: '919409118811',
    rating: 4.9,
    reviews: 320,
    score: 80,
    avatarBg: 'from-cyan-600 to-blue-700',
    avatarText: 'GD',
    avatarIcon: 'tooth',
    verified: true,
    address: '304, Titanium City Centre, Prahlad Nagar, Ahmedabad, Gujarat 380015',
    timings: 'Mon - Sat: 9:30 AM – 8:30 PM | Sun: 10:00 AM – 1:00 PM',
    doctor: 'Dr. Rohan Mehta, MDS (Implantology & Cosmetic Dentistry)',
    leadType: 'compliment_gap',
    flaw: 'no automated instant appointment replies on WhatsApp',
    opener: "Hi,\nCongratulations on 320+ reviews for Global Dental Clinic & Implant Center. How do you currently handle WhatsApp customer enquiries when your team is closed?\nReply STOP to opt out.",
    tagline: 'Precision painless dentistry with 3D digital smile design',
    services: [
      { id: 'dent-1', name: 'Dental Implants (Titanium & Zirconia)', price: '₹22,000 onwards', time: '45 mins', badge: 'Most Popular' },
      { id: 'dent-2', name: 'Laser Teeth Whitening (Single Session)', price: '₹6,500', time: '60 mins', badge: 'Same Day Glow' },
      { id: 'dent-3', name: 'Root Canal Treatment (Microscope-Assisted)', price: '₹4,500', time: '40 mins', badge: 'Single Sitting' },
      { id: 'dent-4', name: 'Clear Invisible Aligners (Digital Scan)', price: '₹45,000 - ₹95,000', time: '30 mins', badge: 'Free 3D Scan' },
      { id: 'dent-5', name: 'Emergency Toothache Consultation', price: '₹500', time: '20 mins', badge: 'Immediate' },
    ],
    initialMessages: [
      {
        id: 'msg-seed-1',
        sender: 'lead',
        text: "Hi,\nCongratulations on 320+ reviews for Global Dental Clinic & Implant Center. How do you currently handle WhatsApp customer enquiries when your team is closed?\nReply STOP to opt out.",
        timestamp: '10:14 AM',
        status: 'read'
      },
      {
        id: 'msg-seed-2',
        sender: 'user',
        text: "Hey! We get around 15-20 enquiries daily on WhatsApp after 8 PM, mostly patients asking about implant costs or booking appointments. Our clinic desk only answers the next morning so we lose many patients.",
        timestamp: '10:18 AM',
        status: 'read'
      },
      {
        id: 'msg-seed-3',
        sender: 'lead',
        text: "Namaste Dr. Mehta! 🙏 That's exactly why we built this 24/7 AI Receptionist for your clinic. It instantly greets patients, shares transparent pricing, collects patient symptoms, and locks doctor appointment slots into your calendar in under 30 seconds!\n\nTry sending a message below like 'I want to book an appointment' or tap any quick action:",
        timestamp: '10:19 AM',
        status: 'read',
        quickReplies: ['📅 Book Doctor Slot', '💰 Implant & Whitening Pricing', '📍 Clinic Location & Map', '🚨 Emergency Toothache']
      }
    ]
  },
  {
    id: 'detailing-mafia',
    name: 'The Detailing Mafia (HRBR Layout)',
    category: 'Automotive Ceramic & PPF Detailing',
    niche: 'automotive',
    city: 'Bangalore',
    phone: '+917483878205',
    cleanPhone: '917483878205',
    rating: 4.7,
    reviews: 410,
    score: 80,
    avatarBg: 'from-amber-600 to-red-700',
    avatarText: 'DM',
    avatarIcon: 'car',
    verified: true,
    address: '3rd Block, 100 Feet Road, HRBR Layout, Kalyan Nagar, Bangalore, Karnataka 560043',
    timings: 'Monday – Sunday: 9:00 AM – 8:30 PM',
    doctor: 'Vinay Kumar (Lead Auto Surface Specialist)',
    leadType: 'demo_offer',
    flaw: 'manual quote calculation for car models',
    opener: "Hi,\nI saw The Detailing Mafia (HRBR Layout) has a 4.7 rating in Bangalore. I made a short demo bot showing instant WhatsApp replies for your customer enquiries. Would you like to test it?\nReply STOP to opt out.",
    tagline: 'Exquisite vehicle surface protection, 9H ceramic & TPU self-healing PPF',
    services: [
      { id: 'car-1', name: 'Ultra 9H Ceramic Shield (3 Years Warranty)', price: '₹14,999 (Hatch) / ₹18,999 (Sedan/SUV)', time: '1 Day', badge: 'Best Seller' },
      { id: 'car-2', name: 'Self-Healing TPU Paint Protection Film (PPF)', price: '₹65,000 - ₹1,40,000', time: '2-3 Days', badge: '10 Yrs Warranty' },
      { id: 'car-3', name: '10H Graphene Coating Matrix', price: '₹24,999', time: '1 Day', badge: 'Super Hydrophobic' },
      { id: 'car-4', name: 'Complete Deep Interior Steam & Leather Spa', price: '₹3,999', time: '4 Hours', badge: 'Anti-Bacterial' }
    ],
    initialMessages: [
      {
        id: 'msg-seed-1',
        sender: 'lead',
        text: "Hi,\nI saw The Detailing Mafia (HRBR Layout) has a 4.7 rating in Bangalore. I made a short demo bot showing instant WhatsApp replies for your customer enquiries. Would you like to test it?\nReply STOP to opt out.",
        timestamp: '11:02 AM',
        status: 'read'
      },
      {
        id: 'msg-seed-2',
        sender: 'user',
        text: "Yes, show me how it calculates package quotes when customers ask for Creta, Harrier, or BMW 3-series.",
        timestamp: '11:05 AM',
        status: 'read'
      },
      {
        id: 'msg-seed-3',
        sender: 'lead',
        text: "Welcome to The Detailing Mafia Bangalore! 🚗✨ We protect your machine with world-class surface coatings.\n\nOur WhatsApp Bot automatically identifies car segment (Hatchback / Sedan / Compact SUV / Luxury SUV) and issues instant transparent quotation sheets with warranty terms.\n\nChoose an option to see it live:",
        timestamp: '11:06 AM',
        status: 'read',
        quickReplies: ['🛡️ Ceramic Coating Quote', '💎 TPU PPF Package Cost', '🧼 Interior Spa Booking', '📍 Studio Address & Directions']
      }
    ]
  },
  {
    id: 'clear-skin',
    name: 'Clear Skin Clinic',
    category: 'Aesthetic Dermatology & Lasers',
    niche: 'dermatology',
    city: 'Pune',
    phone: '+919584584111',
    cleanPhone: '919584584111',
    rating: 4.8,
    reviews: 520,
    score: 90,
    avatarBg: 'from-rose-500 to-pink-700',
    avatarText: 'CS',
    avatarIcon: 'sparkle',
    verified: true,
    address: '201, Fortaleza Commercial Complex, Central Avenue, Kalyani Nagar, Pune, Maharashtra 411006',
    timings: 'Tuesday – Sunday: 10:30 AM – 7:30 PM (Mondays Closed)',
    doctor: 'Dr. Ananya Kulkarni (MD Dermatology, Gold Medalist)',
    leadType: 'demo_offer',
    flaw: 'reception delay in booking after-hours consultation slots',
    opener: "Hi,\nI saw Clear Skin Clinic has a 4.8 rating in Pune. I made a short demo bot showing instant WhatsApp replies for your customer enquiries. Would you like to test it?\nReply STOP to opt out.",
    tagline: 'Evidence-based aesthetic skin transformations and pain-free diode lasers',
    services: [
      { id: 'skin-1', name: 'US-FDA Triple Wavelength Laser Hair Reduction', price: '₹3,499 / session', time: '45 mins', badge: 'Pain-Free' },
      { id: 'skin-2', name: 'HydraFacial MD 7-Step Medical Glow', price: '₹4,999', time: '60 mins', badge: 'Instant Radiance' },
      { id: 'skin-3', name: 'Acne Scar Subcision + Microneedling RF', price: '₹6,500', time: '60 mins', badge: 'High Success' },
      { id: 'skin-4', name: 'Doctor Dermatologist Consultation', price: '₹800', time: '25 mins', badge: 'Prescription Incl.' }
    ],
    initialMessages: [
      {
        id: 'msg-seed-1',
        sender: 'lead',
        text: "Hi,\nI saw Clear Skin Clinic has a 4.8 rating in Pune. I made a short demo bot showing instant WhatsApp replies for your customer enquiries. Would you like to test it?\nReply STOP to opt out.",
        timestamp: '09:30 AM',
        status: 'read'
      },
      {
        id: 'msg-seed-2',
        sender: 'user',
        text: "Yes, do you support photo evaluation on WhatsApp for acne/pigmentation and instant booking slots with Dr. Kulkarni?",
        timestamp: '09:34 AM',
        status: 'read'
      },
      {
        id: 'msg-seed-3',
        sender: 'lead',
        text: "Hello! Welcome to Clear Skin Clinic Pune. 🌸\n\nYes! Patients can securely share concerns, review treatment before/after guides, and reserve an in-clinic or video consultation with Dr. Ananya Kulkarni.\n\nHow can our clinic assist you today?",
        timestamp: '09:35 AM',
        status: 'read',
        quickReplies: ['✨ Doctor Consultation Slot', '💎 Laser Hair Removal Cost', '💧 HydraFacial Packages', '📍 Kalyani Nagar Clinic Map']
      }
    ]
  },
  {
    id: 'daffodils-patisserie',
    name: 'Daffodils Patisserie',
    category: 'Bespoke Custom Cakes & Patisserie',
    niche: 'bakery',
    city: 'Mumbai',
    phone: '+919867300454',
    cleanPhone: '919867300454',
    rating: 4.7,
    reviews: 280,
    score: 90,
    avatarBg: 'from-fuchsia-600 to-purple-800',
    avatarText: 'DP',
    avatarIcon: 'cake',
    verified: true,
    address: 'Shop 4, Pali Naka, Bandra West, Mumbai, Maharashtra 400050',
    timings: 'Everyday: 9:00 AM – 11:30 PM (Midnight delivery available)',
    doctor: 'Chef Natasha D’Souza (Le Cordon Bleu Paris Alum)',
    leadType: 'question',
    flaw: 'manual photo review and cake quotation backlog',
    opener: "Hi,\nI saw Daffodils Patisserie has a 4.7 rating in Mumbai. I made a short demo bot showing instant WhatsApp replies for your customer enquiries. Would you like to test it?\nReply STOP to opt out.",
    tagline: 'Artisanal French entremets, Belgian couverture wedding cakes, eggless luxuries',
    services: [
      { id: 'cake-1', name: 'Signature Belgian Chocolate Truffle (1 kg)', price: '₹1,250', time: 'Instant / Pre-order', badge: 'Chef Favorite' },
      { id: 'cake-2', name: 'Lotus Biscoff Baked Cheesecake (1 kg)', price: '₹1,550', time: 'Fresh Daily', badge: 'Bestseller' },
      { id: 'cake-3', name: 'Tiered Custom Theme Birthday Cake (2 kg+)', price: '₹2,200 / kg', time: '24 hr notice', badge: '100% Custom' },
      { id: 'cake-4', name: 'Parisian Macarons Box (8 Gourmet Assorted)', price: '₹680', time: 'Gift Packed', badge: 'Gluten-Free' }
    ],
    initialMessages: [
      {
        id: 'msg-seed-1',
        sender: 'lead',
        text: "Hi,\nI saw Daffodils Patisserie has a 4.7 rating in Mumbai. I made a short demo bot showing instant WhatsApp replies for your customer enquiries. Would you like to test it?\nReply STOP to opt out.",
        timestamp: '02:15 PM',
        status: 'read'
      },
      {
        id: 'msg-seed-2',
        sender: 'user',
        text: "Hey! We get over 40 cake picture requests daily on WhatsApp asking for quotes and delivery in Bandra/Juhu. Can customers order directly here?",
        timestamp: '02:20 PM',
        status: 'read'
      },
      {
        id: 'msg-seed-3',
        sender: 'lead',
        text: "Bonjour from Daffodils Patisserie, Bandra! 🎂🥐\n\nYes! Customers can browse our interactive visual catalog, customize flavors & weight, specify celebration dates, and receive UPI payment links right inside WhatsApp.\n\nTake a look at our quick options:",
        timestamp: '02:21 PM',
        status: 'read',
        quickReplies: ['🎂 View Cake Catalog', '🍰 Biscoff & Truffle Pricing', '🚚 Check Delivery to My Area', '💬 Custom Wedding Cake Enquiry']
      }
    ]
  },
  {
    id: 'stotram-boutique',
    name: 'Stotram Boutique',
    category: 'Designer Sarees & Bridal Wear',
    niche: 'boutique',
    city: 'Surat',
    phone: '+919825112345',
    cleanPhone: '919825112345',
    rating: 4.8,
    reviews: 150,
    score: 75,
    avatarBg: 'from-emerald-600 to-teal-800',
    avatarText: 'SB',
    avatarIcon: 'dress',
    verified: true,
    address: 'Shop 102, Millennium Textile Market 2, Ring Road, Surat, Gujarat 395002',
    timings: 'Monday – Saturday: 10:30 AM – 8:30 PM',
    doctor: 'Riddhi Patel (Bridal Stylist & Curator)',
    leadType: 'demo_offer',
    flaw: 'repetitive manual catalog and price sharing',
    opener: "Hi,\nI saw Stotram Boutique has a 4.8 rating in Surat. I made a short demo bot showing instant WhatsApp replies for your customer enquiries. Would you like to test it?\nReply STOP to opt out.",
    tagline: 'Authentic weaves from master artisans — Kanjivaram, Banarasi & Royal Lehengas',
    services: [
      { id: 'saree-1', name: 'Pure Mulberry Kanjivaram Zari Saree', price: '₹18,500', time: 'Silk Mark Certified', badge: 'Bridal Heritage' },
      { id: 'saree-2', name: 'Handloom Banarasi Katan Silk with Meenakari', price: '₹14,200', time: 'Dispatch in 24h', badge: 'Handwoven' },
      { id: 'saree-3', name: 'Bespoke Handcrafted Velvet Bridal Lehenga', price: '₹42,000 - ₹85,000', time: 'Custom Stitching', badge: 'Royal Edition' },
      { id: 'saree-4', name: 'Live Video Call Shopping Slot', price: 'Complimentary', time: '30 mins', badge: 'One-on-One' }
    ],
    initialMessages: [
      {
        id: 'msg-seed-1',
        sender: 'lead',
        text: "Hi,\nI saw Stotram Boutique has a 4.8 rating in Surat. I made a short demo bot showing instant WhatsApp replies for your customer enquiries. Would you like to test it?\nReply STOP to opt out.",
        timestamp: '12:40 PM',
        status: 'read'
      },
      {
        id: 'msg-seed-2',
        sender: 'user',
        text: "We constantly get NRI buyers from US/UK asking for video call appointments and saree pictures with blouse stitching.",
        timestamp: '12:45 PM',
        status: 'read'
      },
      {
        id: 'msg-seed-3',
        sender: 'lead',
        text: "Khamma Ghani & Welcome to Stotram Boutique Surat! 🥻✨\n\nOur WhatsApp Assistant sends high-definition curated saree collections with prices, calculates worldwide express shipping, and books 1-on-1 WhatsApp video shopping sessions automatically.\n\nExplore our collections:",
        timestamp: '12:46 PM',
        status: 'read',
        quickReplies: ['🥻 Pure Kanjivaram Collection', '👑 Bridal Lehenga Catalog', '📹 Book Video Call Shopping', '📦 Track Worldwide Delivery']
      }
    ]
  },
  {
    id: 'tuskers-dental',
    name: 'Tuskers Multispeciality Dental Clinic',
    category: 'Dental & Oral Healthcare',
    niche: 'dental',
    city: 'Ahmedabad',
    phone: '+918000097970',
    cleanPhone: '918000097970',
    rating: 4.9,
    reviews: 240,
    score: 80,
    avatarBg: 'from-blue-600 to-indigo-800',
    avatarText: 'TD',
    avatarIcon: 'tooth',
    verified: true,
    address: 'Near Pakwan Cross Roads, Bodakdev, SG Highway, Ahmedabad 380054',
    timings: 'Mon - Sat: 9:00 AM – 9:00 PM',
    doctor: 'Dr. Hardik Shah, MDS Orthodontics',
    leadType: 'demo_offer',
    flaw: 'missed emergency inquiries after clinic hours',
    opener: "Hi,\nI saw Tuskers Multispeciality Dental Clinic has a 4.9 rating in Ahmedabad. I made a short demo bot showing instant WhatsApp replies for your customer enquiries. Would you like to test it?\nReply STOP to opt out.",
    tagline: 'Gentle laser dental care with instant insurance claim assistance',
    services: [
      { id: 'td-1', name: 'Laser Painless Root Canal', price: '₹4,000', time: '35 mins', badge: 'Single Visit' },
      { id: 'td-2', name: 'Ceramic Dental Veneers', price: '₹9,500 / tooth', time: '1 hr', badge: 'Hollywood Smile' },
      { id: 'td-3', name: 'Teens & Adult Invisible Braces', price: '₹38,000', time: 'Consultation', badge: 'EMI Available' }
    ],
    initialMessages: [
      {
        id: 'msg-seed-1',
        sender: 'lead',
        text: "Hi,\nI saw Tuskers Multispeciality Dental Clinic has a 4.9 rating in Ahmedabad. I made a short demo bot showing instant WhatsApp replies for your customer enquiries. Would you like to test it?\nReply STOP to opt out.",
        timestamp: '03:10 PM',
        status: 'read'
      },
      {
        id: 'msg-seed-2',
        sender: 'user',
        text: "Yes, how do we stop losing late-night emergency queries?",
        timestamp: '03:12 PM',
        status: 'read'
      },
      {
        id: 'msg-seed-3',
        sender: 'lead',
        text: "Namaste from Tuskers Dental Clinic! 🦷 The bot triages toothache severity, shares immediate first-aid instructions, and prioritizes emergency morning slots for on-call doctors.",
        timestamp: '03:13 PM',
        status: 'read',
        quickReplies: ['📅 Book Checkup Slot', '⚡ Root Canal Costs', '📍 SG Highway Location', '💬 Speak to Doctor']
      }
    ]
  },
  {
    id: 'detailed-premium',
    name: 'Detailed Premium Studio',
    category: 'Car Detailing & Graphene Coatings',
    niche: 'automotive',
    city: 'Bangalore',
    phone: '+918095241221',
    cleanPhone: '918095241221',
    rating: 4.8,
    reviews: 110,
    score: 65,
    avatarBg: 'from-neutral-700 to-black',
    avatarText: 'DP',
    avatarIcon: 'car',
    verified: true,
    address: 'Sarjapur Main Road, Bellandur, Bangalore 560103',
    timings: 'Mon - Sun: 9:00 AM – 8:00 PM',
    doctor: 'Sandeep Varma (Master Detailer)',
    leadType: 'question',
    flaw: 'high enquiry volume for package prices',
    opener: "Hi,\nI saw Detailed Premium Studio has a 4.8 rating in Bangalore. I made a short demo bot showing instant WhatsApp replies for your customer enquiries. Would you like to test it?\nReply STOP to opt out.",
    tagline: 'Automotive paint enhancement, gloss restoration and dual-layer ceramic',
    services: [
      { id: 'dps-1', name: 'Dual Layer Ceramic Coating', price: '₹16,500', time: '1 Day', badge: 'Super Gloss' },
      { id: 'dps-2', name: 'Exterior Paint Correction (3-Stage Cut)', price: '₹6,500', time: '6 Hours', badge: 'Swirl Removal' }
    ],
    initialMessages: [
      {
        id: 'msg-seed-1',
        sender: 'lead',
        text: "Hi,\nI saw Detailed Premium Studio has a 4.8 rating in Bangalore. I made a short demo bot showing instant WhatsApp replies for your customer enquiries. Would you like to test it?\nReply STOP to opt out.",
        timestamp: '04:00 PM',
        status: 'read'
      },
      {
        id: 'msg-seed-2',
        sender: 'lead',
        text: "Hey Sandeep! Here is how our automated package calculator delivers instant PDF estimates to car owners in under 10 seconds.",
        timestamp: '04:01 PM',
        status: 'read',
        quickReplies: ['🛡️ Ceramic Coating Prices', '📅 Book Vehicle Inspection', '📍 Studio Location']
      }
    ]
  },
  {
    id: 'cake-walk-72',
    name: 'Cake Walk 72',
    category: 'Custom Birthday & Event Cakes',
    niche: 'bakery',
    city: 'Mumbai',
    phone: '+919820572772',
    cleanPhone: '919820572772',
    rating: 4.6,
    reviews: 160,
    score: 65,
    avatarBg: 'from-amber-500 to-orange-700',
    avatarText: 'CW',
    avatarIcon: 'cake',
    verified: true,
    address: 'Lokhandwala Complex, Andheri West, Mumbai 400053',
    timings: '10:00 AM – 12:00 Midnight',
    doctor: 'Pooja Chawla (Pastry Artist)',
    leadType: 'compliment_gap',
    flaw: 'no automated instant WhatsApp replies',
    opener: "Hi,\nCongratulations on 160+ reviews for Cake Walk 72. How do you currently handle WhatsApp customer enquiries when your team is closed?\nReply STOP to opt out.",
    tagline: 'Custom 3D fondant cakes, pinata celebration surprises, eggless gourmet desserts',
    services: [
      { id: 'cw-1', name: 'Pull Me Up Chocolate Cake', price: '₹1,100 / kg', time: 'Fresh', badge: 'Viral Trend' },
      { id: 'cw-2', name: 'Custom Fondant Birthday Cake', price: '₹1,800 / kg', time: '24h Notice', badge: 'Any Character' }
    ],
    initialMessages: [
      {
        id: 'msg-seed-1',
        sender: 'lead',
        text: "Hi,\nCongratulations on 160+ reviews for Cake Walk 72. How do you currently handle WhatsApp customer enquiries when your team is closed?\nReply STOP to opt out.",
        timestamp: '05:15 PM',
        status: 'read'
      },
      {
        id: 'msg-seed-2',
        sender: 'lead',
        text: "Hello from Cake Walk 72! 🎂 Looking for a birthday, anniversary, or midnight celebration cake? Pick a flavor or send us your inspiration photo!",
        timestamp: '05:16 PM',
        status: 'read',
        quickReplies: ['🎂 Birthday Cake Flavors', '📸 Upload Cake Reference', '🚚 Midnight Delivery Slots']
      }
    ]
  },
  {
    id: 'unique-designer-sarees',
    name: 'Unique Designer Sarees',
    category: 'Bridal & Silk Sarees',
    niche: 'boutique',
    city: 'Surat',
    phone: '+919824167890',
    cleanPhone: '919824167890',
    rating: 4.5,
    reviews: 85,
    score: 75,
    avatarBg: 'from-purple-600 to-pink-800',
    avatarText: 'UD',
    avatarIcon: 'dress',
    verified: true,
    address: 'Radha Raman Textile Market, Saroli, Surat 395010',
    timings: '10:00 AM – 8:00 PM',
    doctor: 'Ketan Sheth (Wholesale & Retail Curator)',
    leadType: 'demo_offer',
    flaw: 'repetitive manual catalog and price sharing',
    opener: "Hi,\nI saw Unique Designer Sarees has a 4.5 rating in Surat. I made a short demo bot showing instant WhatsApp replies for your customer enquiries. Would you like to test it?\nReply STOP to opt out.",
    tagline: 'Direct-from-loom silk, organza, and embroidered festive collections',
    services: [
      { id: 'uds-1', name: 'Pure Dola Silk Sarees with Zari', price: '₹5,800', time: 'Ready Stock', badge: 'Best Value' },
      { id: 'uds-2', name: 'Partywear Sequins Georgette Saree', price: '₹4,200', time: 'Fast Ship', badge: 'Trending' }
    ],
    initialMessages: [
      {
        id: 'msg-seed-1',
        sender: 'lead',
        text: "Hi,\nI saw Unique Designer Sarees has a 4.5 rating in Surat. I made a short demo bot showing instant WhatsApp replies for your customer enquiries. Would you like to test it?\nReply STOP to opt out.",
        timestamp: '06:00 PM',
        status: 'read'
      },
      {
        id: 'msg-seed-2',
        sender: 'lead',
        text: "Namaste! 🙏 Welcome to Unique Designer Sarees Surat. We dispatch genuine Surat textile sarees worldwide with secure payment.",
        timestamp: '06:01 PM',
        status: 'read',
        quickReplies: ['🥻 Daily New Arrivals', '📦 Wholesale Bulk Enquiry', '📹 Video Call Booking']
      }
    ]
  },
  {
    id: 'pune-aesthetic',
    name: 'Pune Aesthetic Skin and Hair Clinic',
    category: 'Cosmetic Dermatology & Hair Care',
    niche: 'dermatology',
    city: 'Pune',
    phone: '+919766034567',
    cleanPhone: '919766034567',
    rating: 4.6,
    reviews: 95,
    score: 75,
    avatarBg: 'from-teal-600 to-cyan-800',
    avatarText: 'PA',
    avatarIcon: 'sparkle',
    verified: true,
    address: 'FC Road, Shivaji Nagar, Pune 411005',
    timings: '11:00 AM – 8:00 PM (Sunday Closed)',
    doctor: 'Dr. Sameer Joshi (Cosmetologist & Trichologist)',
    leadType: 'demo_offer',
    flaw: 'reception delay in booking after-hours consultation slots',
    opener: "Hi,\nI saw Pune Aesthetic Skin and Hair Clinic has a 4.6 rating in Pune. I made a short demo bot showing instant WhatsApp replies for your customer enquiries. Would you like to test it?\nReply STOP to opt out.",
    tagline: 'Modern hair restoration PRP, GFC, and skin glow rejuvenation',
    services: [
      { id: 'pa-1', name: 'GFC / PRP Hair Regrowth Therapy', price: '₹4,500 / session', time: '45 mins', badge: 'High Density' },
      { id: 'pa-2', name: 'Carbon Laser Hollywood Peel', price: '₹3,500', time: '40 mins', badge: 'Pore Tightening' }
    ],
    initialMessages: [
      {
        id: 'msg-seed-1',
        sender: 'lead',
        text: "Hi,\nI saw Pune Aesthetic Skin and Hair Clinic has a 4.6 rating in Pune. I made a short demo bot showing instant WhatsApp replies for your customer enquiries. Would you like to test it?\nReply STOP to opt out.",
        timestamp: '07:20 PM',
        status: 'read'
      },
      {
        id: 'msg-seed-2',
        sender: 'lead',
        text: "Hello! Welcome to Pune Aesthetic Skin & Hair Clinic. Looking for hair fall control, skin brightening, or laser treatment?",
        timestamp: '07:21 PM',
        status: 'read',
        quickReplies: ['💆‍♂️ Hair Fall Treatment', '✨ Carbon Laser Peel', '📅 Book Dr. Joshi Slot']
      }
    ]
  }
];

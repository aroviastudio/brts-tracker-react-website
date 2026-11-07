// Vercel Serverless Function: /api/chat
// Multi-Lead AI Bot Engine powered by Google Gemini (gemini-3-flash-preview)

// Retrieve Gemini key from env or decode default token safely
const DEFAULT_KEY_B64 = 'QVEuQWI4Uk42S3VfOGFEX3NtUjQyc2dpZmJKSlVibTRJNVJPcEQ4cUFOSDNZeVc1ckhudEE=';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || Buffer.from(DEFAULT_KEY_B64, 'base64').toString('utf8');

const BUSINESS_REGISTRY = {
  'global-dental': {
    name: 'Global Dental Clinic & Implant Center',
    founder: 'Prof. Dr. Aatman Joshipura, MDS / Dr. Rohan Mehta',
    category: 'Multispecialty Dental Care',
    city: 'Ahmedabad',
    phone: '+91 94091 18811',
    address: '304, Titanium City Centre, Prahlad Nagar (and Bodakdev / C.G. Road), Ahmedabad, Gujarat 380015',
    timings: 'Monday – Saturday: 9:30 AM – 1:00 PM and 4:30 PM – 8:00 PM',
    services: [
      { name: 'Dental Implants (Titanium & Zirconia Nobel Biocare)', price: '₹22,000 onwards', time: '45 mins' },
      { name: 'Laser Teeth Whitening (Single Session)', price: '₹6,500', time: '60 mins' },
      { name: 'Root Canal Treatment (Microscope-Assisted Single Sitting)', price: '₹4,500', time: '40 mins' },
      { name: 'Clear Invisible Aligners (3D Digital Scan)', price: '₹45,000 – ₹95,000', time: '30 mins' },
      { name: 'Emergency Toothache Consultation', price: '₹500', time: '20 mins' }
    ],
    specialties: 'Painless Nobel Biocare dental implants, Invisalign & clear aligners, single-sitting root canals, laser gum therapy.'
  },

  'detailing-mafia': {
    name: 'The Detailing Mafia (HRBR Layout)',
    founder: 'Vinay Kumar (Lead Auto Surface Specialist)',
    category: 'Automotive Ceramic & PPF Detailing',
    city: 'Bangalore',
    phone: '+91 74838 78205',
    address: '3rd Block, 100 Feet Road, HRBR Layout, Kalyan Nagar, Bangalore, Karnataka 560043',
    timings: 'Monday – Sunday: 9:00 AM – 8:30 PM (All 7 Days Open)',
    services: [
      { name: 'Ultra 9H Ceramic Shield (3 Years Warranty)', price: '₹14,999 (Hatchback) / ₹18,999 (Sedan/SUV)', time: '1 Day' },
      { name: 'Self-Healing TPU Paint Protection Film (PPF)', price: '₹65,000 – ₹1,40,000 (5-8 Yrs Warranty)', time: '2 Days' },
      { name: '10H Graphene Coating Matrix (High Hydrophobic)', price: '₹24,999', time: '1 Day' },
      { name: 'Complete Deep Interior Steam & Leather Spa', price: '₹3,999', time: '4 Hours' }
    ],
    specialties: 'Labocosmetica certified ceramic coatings, computer-cut TPU self-healing PPF, paint correction & swirl removal, interior ozone sanitization.'
  },

  'clear-skin': {
    name: 'Clear Skin Clinic',
    founder: 'Dr. Ananya Kulkarni (MD Dermatology, Gold Medalist)',
    category: 'Aesthetic Dermatology & Lasers',
    city: 'Pune',
    phone: '+91 95845 84111',
    address: '201, Fortaleza Commercial Complex, Central Avenue, Kalyani Nagar, Pune, Maharashtra 411006',
    timings: 'Monday – Saturday: 10:00 AM – 8:00 PM',
    services: [
      { name: 'US-FDA Triple Wavelength Laser Hair Reduction', price: '₹3,499 / session', time: '45 mins' },
      { name: 'HydraFacial MD 7-Step Medical Glow', price: '₹4,999', time: '60 mins' },
      { name: 'Acne Scar Subcision + Microneedling RF', price: '₹6,500', time: '50 mins' },
      { name: 'Dermatologist Doctor Consultation', price: '₹800', time: '25 mins' }
    ],
    specialties: 'US-FDA laser treatments, hormonal acne management, medical-grade chemical peels, PRP hair regrowth therapy.'
  },

  'daffodils-patisserie': {
    name: 'Daffodils Patisserie',
    founder: 'Chef Natasha D’Souza (Le Cordon Bleu Paris Alum)',
    category: 'Bespoke Custom Cakes & Patisserie',
    city: 'Mumbai',
    phone: '+91 98673 00454',
    address: 'Shop 4, Pali Naka, Bandra West, Mumbai, Maharashtra 400050',
    timings: 'Monday – Sunday: 10:00 AM – 11:00 PM',
    services: [
      { name: 'Signature Belgian Chocolate Truffle (1 kg)', price: '₹1,250', time: 'Same-day delivery available' },
      { name: 'Lotus Biscoff Baked Cheesecake (1 kg)', price: '₹1,550', time: 'Same-day delivery available' },
      { name: 'Tiered Custom Theme Birthday Cake (2 kg+)', price: '₹2,200 / kg', time: '24-48 hrs advance order' },
      { name: 'Parisian Macarons Box (8 Gourmet Assorted)', price: '₹680', time: 'Fresh daily batch' }
    ],
    specialties: 'Bespoke wedding tiered cakes, eggless options, pure French couverture chocolate, fondant celebration designs.'
  },

  'tuskers-dental': {
    name: 'Tuskers Multispeciality Dental Clinic',
    founder: 'Dr. Hardik Shah, MDS Orthodontics',
    category: 'Dental & Oral Healthcare',
    city: 'Ahmedabad',
    phone: '+91 80000 97970',
    address: 'Near Pakwan Cross Roads, Bodakdev, SG Highway, Ahmedabad, Gujarat 380054',
    timings: 'Monday – Saturday: 9:30 AM – 8:30 PM | Sunday: 10:00 AM – 1:00 PM',
    services: [
      { name: 'Laser Painless Root Canal Treatment (RCT)', price: '₹4,000', time: 'Single Sitting' },
      { name: 'Ceramic Dental Veneers & Smile Makeover', price: '₹9,500 / tooth', time: '2 Sittings' },
      { name: 'Teens & Adult Invisible Braces', price: '₹38,000 onwards', time: 'Custom Plan' },
      { name: 'Wisdom Tooth Painless Extraction', price: '₹2,500', time: '30 mins' }
    ],
    specialties: 'Rotary painless root canals, adult aesthetic invisible braces, digital dental photography, porcelain crowns.'
  }
};

function generateFallbackReply(biz, userText) {
  const t = (userText || '').toLowerCase().trim();

  if (t.includes('book') || t.includes('appointment') || t.includes('slot') || t.includes('visit') || t.includes('consult')) {
    return `We would be pleased to schedule your visit at *${biz.name}*.\n\nHours: ${biz.timings}\nLocation: ${biz.address}\n\nPlease share your preferred date and time, or contact our desk directly at *${biz.phone}* for immediate confirmation.`;
  }

  if (t.includes('price') || t.includes('cost') || t.includes('fee') || t.includes('rate') || t.includes('charges') || t.includes('package')) {
    const list = biz.services.map((s) => `• *${s.name}*: ${s.price} (${s.time})`).join('\n');
    return `Here is our pricing for *${biz.name}*:\n\n${list}\n\nWould you like to schedule an appointment for any of these services?`;
  }

  if (t.includes('address') || t.includes('location') || t.includes('where') || t.includes('timing') || t.includes('hours') || t.includes('open')) {
    return `*${biz.name}*\nAddress: ${biz.address}\nHours: ${biz.timings}\nPhone: *${biz.phone}*`;
  }

  return `Thank you for contacting *${biz.name}* in ${biz.city}.\n\nWe specialize in ${biz.specialties}.\n\nPlease let me know if you would like service details, pricing, or to book an appointment. You can also call us directly at *${biz.phone}*.`;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(200).json({ status: 'ok', message: 'Multi-Lead AI Bot Engine active' });

  try {
    const { message, businessId, history } = req.body || {};
    const userMessage = (message || '').trim();
    const bizKey = businessId && BUSINESS_REGISTRY[businessId] ? businessId : 'global-dental';
    const biz = BUSINESS_REGISTRY[bizKey];

    if (!userMessage) return res.status(400).json({ error: 'Message is required' });

    // Call Google Gemini API (gemini-3-flash-preview)
    if (GEMINI_API_KEY) {
      try {
        const servicesText = biz.services.map(s => `- ${s.name}: ${s.price} (${s.time})`).join('\n');
        const systemPrompt = `You are the official WhatsApp assistant for "${biz.name}".
Location: ${biz.address}
Lead / Specialist: ${biz.founder}
Category: ${biz.category}
Phone: ${biz.phone}
Timings: ${biz.timings}
Key Services & Pricing:
${servicesText}
Specialties: ${biz.specialties}

Strict Guidelines:
1. Tone: Courteous, polite, and direct. Speak like a professional front-desk manager.
2. NO EMOJIS: Do NOT use any emojis under any circumstances. Keep responses 100% text-only.
3. Length: Keep responses concise (maximum 2 to 3 sentences). Avoid long paragraphs, filler, or over-explaining.
4. Directness: Answer the user's specific question immediately in the first sentence.
5. Formatting: Use standard WhatsApp formatting with *bold* for key terms, prices, or contact numbers. If listing prices or services, use simple short bullet points.
6. Closing: End with a single, polite question or offer to book/call ${biz.phone}.`;

        const payload = {
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\nUser Message: ${userMessage}` }]
            }
          ]
        };

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          }
        );

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            return res.status(200).json({ reply: candidateText, source: 'gemini-3-flash-preview', businessId: bizKey });
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini API call failed, falling back to local registry:', geminiErr);
      }
    }

    // Fallback rule-based response
    const localReply = generateFallbackReply(biz, userMessage);
    return res.status(200).json({ reply: localReply, source: 'local-registry-fallback', businessId: bizKey });
  } catch (err) {
    console.error('API Error:', err);
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
}

// Vercel Serverless Function: /api/chat
// Real Clinic Knowledge Base Scraped & Verified from drjoshipura.com

const REAL_CLINIC_DATA = {
  name: 'Global Dental Clinic & Implant Centre',
  founder: 'Prof. Dr. Aatman Joshipura, MDS',
  qualification: 'Orthodontist & Smile Architect | Trained in Nobel Biocare (Switzerland) | Member of ICOI',
  phone: '+91 94091 18811',
  branches: [
    {
      name: 'Sindhubhavan Road Branch (Bodakdev)',
      address: '208, Shilp Satved, Opposite Mango Restaurant, Besides Sindhubhavan Temple, Bodakdev, Ahmedabad, Gujarat'
    },
    {
      name: 'C.G. Road Branch (Navrangpura)',
      address: '311, Balaji Heights, Bodyline Cross Road, near IDBI Bank, Lal Bungalow, C.G. Road, Ahmedabad, Gujarat 380006'
    }
  ],
  timings: 'Monday to Saturday: 09:30 AM – 01:00 PM and 04:30 PM – 08:00 PM (Sunday closed for routine OPD; emergency on-call available)',
  treatments: [
    {
      name: 'Dental Implants & Full Mouth Rehabilitation',
      details: 'Nobel Biocare (Switzerland), Hiossen & DensahR systems. High-volume implant surgical centre with daily procedures and minimal discomfort.'
    },
    {
      name: 'Orthodontics & Clear Aligners',
      details: 'Invisalign certified provider, ultramodern low-friction painless fast braces, and ceramic aesthetic braces by Dr. Aatman Joshipura.'
    },
    {
      name: 'Single-Sitting Painless Root Canal (RCT)',
      details: 'Microscope-assisted endodontic therapy with 3D digital imaging to complete root canal in a single comfortable visit.'
    },
    {
      name: 'Smile Designing & Cosmetic Dentistry',
      details: 'Laser teeth whitening, porcelain veneers, cosmetic bonding, and teeth jewellery.'
    },
    {
      name: 'Laser Gum Surgery & Periodontics',
      details: 'Advanced dental diode laser treatment for gum contouring, bleeding gums, and pyorrhea treatment without cuts or sutures.'
    },
    {
      name: 'Child & Pediatric Dental Care',
      details: 'Cavity prevention, fluoride application, habit-breaking appliances, and kid-friendly gentle dentistry.'
    }
  ]
};

function generateLocalClinicReply(userText) {
  const t = (userText || '').toLowerCase().trim();

  if (t.includes('book') || t.includes('appointment') || t.includes('slot') || t.includes('visit') || t.includes('consult')) {
    return `Dr. Aatman Joshipura and our specialist team are available at both **C.G. Road** and **Bodakdev (Sindhubhavan)** branches:\n\n📅 **OPD Consultation Hours**:\n• Morning: 09:30 AM – 01:00 PM\n• Evening: 04:30 PM – 08:00 PM\n*(Monday to Saturday)*\n\nWhich branch and time slot would you prefer? Reply with your preferred date, or call our direct line at **${REAL_CLINIC_DATA.phone}** to confirm immediately.`;
  }

  if (t.includes('address') || t.includes('location') || t.includes('where') || t.includes('branch') || t.includes('center') || t.includes('centre')) {
    return `We have 2 prime locations in Ahmedabad:\n\n📍 **Sindhubhavan Branch (Bodakdev)**:\n208, Shilp Satved, Opp Mango Restaurant, Beside Sindhubhavan Temple, Bodakdev, Ahmedabad.\n\n📍 **C.G. Road Branch**:\n311, Balaji Heights, Bodyline Cross Road, Near IDBI Bank, Lal Bungalow, C.G. Road, Ahmedabad 380006.\n\n📞 Direct Desk & WhatsApp: **${REAL_CLINIC_DATA.phone}**`;
  }

  if (t.includes('implant') || t.includes('teeth replace') || t.includes('tooth replace') || t.includes('missing teeth')) {
    return `At **Global Dental Clinic & Implant Centre**, dental implants are our core specialty. We perform implant surgeries almost every single day using internationally certified systems (Nobel Biocare Switzerland, Hiossen, and DensahR osseodensification).\n\n• Single-tooth implants\n• All-on-4 / All-on-6 full-mouth rehabilitation\n• Painless digital guided surgery\n\nWould you like to book an implant consultation and digital OPG scan with Dr. Joshipura?`;
  }

  if (t.includes('brace') || t.includes('aligner') || t.includes('invisalign') || t.includes('straight') || t.includes('teeth gap') || t.includes('crooked')) {
    return `**Prof. Dr. Aatman Joshipura** is a leading Orthodontist (MDS) and Smile Architect in Ahmedabad.\n\nWe offer:\n• **Invisalign & Clear Aligners**: Nearly invisible, removable, digital 3D scans.\n• **Low-Friction Painless Braces**: High-speed tooth movement with minimal pressure.\n• **Ceramic & Metallic Braces**: Tooth-colored aesthetic brackets.\n\nWould you like to schedule a digital smile assessment?`;
  }

  if (t.includes('rct') || t.includes('root canal') || t.includes('tooth ache') || t.includes('pain') || t.includes('emergency')) {
    return `🚨 **Emergency & Pain Relief Assistance**\n\nWe offer **Single-Sitting Microscope-Assisted Root Canal (RCT)** that relieves toothache in one comfortable visit without multiple sittings.\n\nIf you are currently experiencing acute pain or swelling, call our clinic desk immediately at **${REAL_CLINIC_DATA.phone}** for priority emergency walk-in assistance.`;
  }

  if (t.includes('cost') || t.includes('price') || t.includes('fee') || t.includes('charges')) {
    return `At Global Dental Clinic, all pricing is completely transparent following a thorough clinical examination & digital X-ray:\n\n• **Dental Implants**: From ₹22,000 (options vary by Swiss / US implant brand)\n• **Single-Sitting Root Canal**: From ₹4,500\n• **Laser Teeth Whitening**: ₹6,500 per session\n• **Clear Aligners**: Custom digital plan based on 3Shape intraoral scan\n• **Consultation & Diagnosis**: ₹500\n\nWould you like to reserve a consultation slot?`;
  }

  return `Welcome to **${REAL_CLINIC_DATA.name}**!\n\nLed by **${REAL_CLINIC_DATA.founder}** (Nobel Biocare Switzerland trained), we provide painless, world-class dental healthcare across our Sindhubhavan Road & C.G. Road branches in Ahmedabad.\n\nHow can we assist you today?\n• Book a consultation with Dr. Joshipura\n• Learn about Dental Implants or Clear Aligners\n• Get clinic branch directions & timings\n• Emergency dental guidance`;
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(200).json({ status: 'ok', message: 'Global Dental Clinic AI Backend active' });
  }

  try {
    const { message, history } = req.body || {};
    const userMessage = (message || '').trim();

    if (!userMessage) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const geminiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    if (geminiKey) {
      try {
        const systemPrompt = `You are the official 24/7 AI Receptionist for Global Dental Clinic & Implant Centre in Ahmedabad, India.
Founder & Lead Doctor: Prof. Dr. Aatman Joshipura, MDS (Orthodontist & Smile Architect, Nobel Biocare Switzerland trained).
Phone: +91 94091 18811
Branches:
1) Sindhubhavan Road Branch: 208, Shilp Satved, Opp Mango Restaurant, Beside Sindhubhavan Temple, Bodakdev, Ahmedabad.
2) C.G. Road Branch: 311, Balaji Heights, Bodyline Cross Road, near IDBI Bank, Lal Bungalow, C.G. Road, Ahmedabad 380006.
Consultation Hours: Mon-Sat 09:30 AM - 01:00 PM and 04:30 PM - 08:00 PM.
Specialties: Nobel Biocare dental implants, Invisalign & clear aligners, single-sitting painless root canals, laser gum surgery, laser teeth whitening.
Tone: Warm, highly professional, empathetic, concise. Always offer to connect or book an appointment via +91 94091 18811. Format replies with clear bullet points where helpful.`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                { role: 'user', parts: [{ text: `${systemPrompt}\n\nPatient inquiry: ${userMessage}` }] }
              ]
            })
          }
        );

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            return res.status(200).json({ reply: candidateText, source: 'gemini' });
          }
        }
      } catch (llmErr) {
        console.warn('Gemini API call failed, falling back to local clinic engine:', llmErr);
      }
    }

    // Default high-precision clinic response engine using real scraped website data
    const localReply = generateLocalClinicReply(userMessage);
    return res.status(200).json({ reply: localReply, source: 'clinic-knowledge-base' });
  } catch (err) {
    console.error('Handler error:', err);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}

// Intelligent Rule-Based WhatsApp AI Bot Engine for Businesses

export function generateBotResponse(business, userMessage) {
  const text = (userMessage || '').toLowerCase().trim();
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 1. APPOINTMENT / BOOKING FLOW
  if (
    text.includes('book') ||
    text.includes('appointment') ||
    text.includes('slot') ||
    text.includes('schedule') ||
    text.includes('visit') ||
    text.includes('consultation')
  ) {
    const refId = 'WA-' + Math.floor(100000 + Math.random() * 900000);
    return {
      id: 'bot-' + Date.now(),
      sender: 'lead',
      timestamp: timeStr,
      status: 'delivered',
      text: `✅ *Appointment Slot Reserved for You!*\n\nHere are the details for your confirmation at *${business.name}*:\n\n📋 *Ref ID:* \`${refId}\`\n👨‍⚕️ *Consultant:* ${business.doctor}\n📍 *Location:* ${business.city} Clinic\n⏰ *Suggested Slot:* Tomorrow at 4:30 PM (or choose below)\n\nWould you like to lock this slot or request a different time?`,
      cardType: 'booking',
      bookingData: {
        refId,
        businessName: business.name,
        doctor: business.doctor,
        address: business.address,
        date: 'Tomorrow, 4:30 PM',
        status: 'Confirmed'
      },
      quickReplies: ['👍 Confirm Tomorrow 4:30 PM', '📅 Reschedule to Morning', '💳 Pay ₹500 Token Advance', '💬 Talk to Reception']
    };
  }

  // 2. PRICING & QUOTATION
  if (
    text.includes('price') ||
    text.includes('cost') ||
    text.includes('package') ||
    text.includes('charge') ||
    text.includes('rate') ||
    text.includes('quote') ||
    text.includes('how much')
  ) {
    let serviceListText = business.services
      .map((s, idx) => `*${idx + 1}. ${s.name}*\n   💵 *Fee:* ${s.price} • _(${s.time})_`)
      .join('\n\n');

    return {
      id: 'bot-' + Date.now(),
      sender: 'lead',
      timestamp: timeStr,
      status: 'delivered',
      text: `Here is the official transparent pricing sheet for *${business.name}*:\n\n${serviceListText}\n\n💡 *Special Offer:* 10% instant discount when booking via WhatsApp this week!`,
      cardType: 'pricing',
      quickReplies: ['📅 Book a Service Slot', '💳 Advance Payment Link', '📍 Visit Studio / Clinic', '💬 Ask Custom Question']
    };
  }

  // 3. CATALOG & IMAGES
  if (
    text.includes('catalog') ||
    text.includes('menu') ||
    text.includes('collection') ||
    text.includes('saree') ||
    text.includes('cake') ||
    text.includes('coating') ||
    text.includes('ceramic') ||
    text.includes('implant') ||
    text.includes('laser')
  ) {
    return {
      id: 'bot-' + Date.now(),
      sender: 'lead',
      timestamp: timeStr,
      status: 'delivered',
      text: `✨ *Explore our Featured Catalog for ${business.name}:*\n\nTap on any item below to view high-resolution details, warranty certification, and instant WhatsApp booking:`,
      cardType: 'catalog',
      catalogItems: business.services,
      quickReplies: ['🛒 Request Custom Quote', '📅 Reserve Appointment', '📍 View Location Map']
    };
  }

  // 4. LOCATION & DIRECTIONS
  if (
    text.includes('location') ||
    text.includes('address') ||
    text.includes('where') ||
    text.includes('direction') ||
    text.includes('map') ||
    text.includes('landmark')
  ) {
    return {
      id: 'bot-' + Date.now(),
      sender: 'lead',
      timestamp: timeStr,
      status: 'delivered',
      text: `📍 *Studio & Clinic Location:*\n\n*${business.name}*\n${business.address}\n\n⏰ *Operating Hours:* ${business.timings}\n⭐ *Google Verified:* ${business.rating} ★ (${business.reviews} reviews)\n\nNeed landmark assistance or free valet parking instructions?`,
      cardType: 'location',
      locationData: {
        name: business.name,
        address: business.address,
        timings: business.timings,
        city: business.city,
        rating: business.rating,
        reviews: business.reviews
      },
      quickReplies: ['🗺️ Open in Google Maps', '📅 Book Visit Time', '📞 Call Reception Desk']
    };
  }

  // 5. PAYMENT SIMULATION
  if (
    text.includes('pay') ||
    text.includes('payment') ||
    text.includes('advance') ||
    text.includes('token') ||
    text.includes('upi') ||
    text.includes('gpay')
  ) {
    const payId = 'PAY-' + Math.floor(10000 + Math.random() * 90000);
    return {
      id: 'bot-' + Date.now(),
      sender: 'lead',
      timestamp: timeStr,
      status: 'delivered',
      text: `💳 *Secure WhatsApp Payment Link*\n\n*Beneficiary:* ${business.name}\n*Amount:* ₹500.00 (Booking Token)\n*UPI ID:* ${business.cleanPhone}@upi\n*Order Ref:* \`${payId}\`\n\nClick the button below to simulate immediate payment confirmation:`,
      cardType: 'payment',
      paymentData: {
        payId,
        amount: '₹500.00',
        businessName: business.name,
        status: 'Pending',
        beneficiary: business.name
      },
      quickReplies: ['✅ Simulate Payment Paid', '📅 View Booking Details', '💬 Speak to Accounts']
    };
  }

  // 6. EMERGENCY / TOOTHACHE / URGENT
  if (
    text.includes('emergency') ||
    text.includes('pain') ||
    text.includes('urgent') ||
    text.includes('toothache') ||
    text.includes('swelling') ||
    text.includes('scratch')
  ) {
    return {
      id: 'bot-' + Date.now(),
      sender: 'lead',
      timestamp: timeStr,
      status: 'delivered',
      text: `🚨 *Immediate Priority Assistance:*\n\nWe understand this is urgent! We have prioritized your message with on-call duty specialist *${business.doctor}*.\n\n📞 Emergency Direct Line: *${business.phone}*\n\n1. Rinse with warm saline water (if dental) or apply cold compress.\n2. Do not apply direct heat.\n3. Our clinic doctor has been notified via WhatsApp SMS alert.`,
      quickReplies: ['📞 Call Emergency Doctor', '📅 Priority Slot (First Available)', '📍 Get Clinic GPS Directions']
    };
  }

  // 7. HUMAN HANDOVER / CALL
  if (
    text.includes('call') ||
    text.includes('human') ||
    text.includes('talk') ||
    text.includes('reception') ||
    text.includes('speak') ||
    text.includes('doctor')
  ) {
    return {
      id: 'bot-' + Date.now(),
      sender: 'lead',
      timestamp: timeStr,
      status: 'delivered',
      text: `👤 *Connecting with Human Staff*\n\nI have notified *${business.doctor}* and our front desk manager at ${business.name}. An executive will reply to you directly on this chat within 2-3 minutes.\n\nIn the meantime, you can also ring our direct helpline: *${business.phone}*.`,
      quickReplies: ['📅 Book Slot in Meantime', '💰 Check Price List', '📍 Studio Directions']
    };
  }

  // 8. GREETINGS
  if (
    text.includes('hi') ||
    text.includes('hello') ||
    text.includes('hey') ||
    text.includes('namaste') ||
    text.includes('morning') ||
    text.includes('evening')
  ) {
    return {
      id: 'bot-' + Date.now(),
      sender: 'lead',
      timestamp: timeStr,
      status: 'delivered',
      text: `Namaste! 🙏 Welcome to *${business.name}* (${business.city}).\n\n_${business.tagline}_\n\nI am your 24/7 AI WhatsApp assistant. How can I help you today?`,
      quickReplies: ['📅 Book an Appointment', '💰 Services & Pricing', '📍 Location & Working Hours', '💬 Speak to Human Staff']
    };
  }

  // 9. DEFAULT SMART RESPONSE
  return {
    id: 'bot-' + Date.now(),
    sender: 'lead',
    timestamp: timeStr,
    status: 'delivered',
    text: `Thank you for your message! At *${business.name}*, we are delighted to assist you with our services in ${business.city}.\n\nWould you like to check our pricing, book a consultation slot, or get directions to our studio?`,
    quickReplies: ['📅 Book Appointment Slot', '💰 View Service Packages', '📍 Clinic Address & Directions', '📞 Request Callback']
  };
}

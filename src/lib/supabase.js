import { createClient } from '@supabase/supabase-js';
import { INITIAL_DESIGNS, INITIAL_SERVICES, INITIAL_REVIEWS } from '../data/mockData';

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://itinnrnvjwwhstnwomki.supabase.co';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0aW5ucm52and3aHN0bndvbWtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzNTA1MDEsImV4cCI6MjEwNDkyNjUwMX0.FEphwrQL38rskt7t_-n4ZkippCDMPjlAMAoVllRryhM';

export const DEFAULT_WHATSAPP_PHONE = '919876543210';
export const BUSINESS_NAME = 'Bhuvi Mehandi Artistry';

let supabaseClient = null;

try {
  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
} catch (err) {
  console.warn('Supabase initialization error, falling back to local store:', err);
}

export const supabase = supabaseClient;

// Local storage storage keys for offline/fallback mode
const STORAGE_KEY_SETTINGS = 'bhuvi_mehandi_settings_v3';
const STORAGE_KEY_SERVICES = 'bhuvi_mehandi_services_v3';
const STORAGE_KEY_DESIGNS = 'bhuvi_mehandi_designs_v3';
const STORAGE_KEY_REVIEWS = 'bhuvi_mehandi_reviews_v3';
const STORAGE_KEY_INQUIRIES = 'bhuvi_mehandi_inquiries_v3';
const STORAGE_KEY_AUTHOR_TOKEN = 'bhuvi_mehandi_author_token';

// Unique client device token so only review creators can edit/delete their own reviews
export function getOrCreateAuthorToken() {
  try {
    let token = localStorage.getItem(STORAGE_KEY_AUTHOR_TOKEN);
    if (!token) {
      token = 'author_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now();
      localStorage.setItem(STORAGE_KEY_AUTHOR_TOKEN, token);
    }
    return token;
  } catch (e) {
    return 'fallback_author_token';
  }
}

// ─── 1. SETTINGS CRUD ─────────────────────────────────────────────
export const DEFAULT_SETTINGS = {
  id: 'bhuvi-main-config',
  headline: "Pure Sojat Henna. Handcrafted for Life's Sacred Vows.",
  subheadline: '100% Organic Sojat Leaf • Chemical-Free • Guaranteed 48-Hour Deep Mahogany Stain',
  hero_image_url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1920&q=85',
  whatsapp_phone: '919876543210',
  studio_location: 'Ahmedabad & Gandhinagar (Pan-India & Destination Travel)',
  admin_pin: '1234'
};

export async function fetchSettings() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('mehandi_settings')
        .select('*')
        .limit(1)
        .single();
      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase settings query error:', e);
    }
  }
  // Local fallback
  try {
    const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return DEFAULT_SETTINGS;
}

export async function updateSettings(newSettings) {
  const payload = { ...DEFAULT_SETTINGS, ...newSettings, updated_at: new Date().toISOString() };
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('mehandi_settings')
        .upsert(payload)
        .select()
        .single();
      if (!error && data) {
        localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(data));
        return data;
      }
    } catch (e) {
      console.warn('Supabase settings upsert error:', e);
    }
  }
  localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(payload));
  return payload;
}

// ─── 2. SERVICES CRUD ─────────────────────────────────────────────
export async function fetchServices() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('mehandi_services')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data;
    } catch (e) {
      console.warn('Supabase services query error:', e);
    }
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY_SERVICES);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return INITIAL_SERVICES;
}

export async function createService(serviceData) {
  const newServ = {
    id: 'serv_' + Date.now(),
    name: serviceData.name || 'Custom Mehandi Service',
    category: serviceData.category || 'Bridal',
    event_type: serviceData.event_type || 'Wedding Celebration',
    price_starting: serviceData.price_starting || '₹3,500',
    duration: serviceData.duration || '2 - 3 Hours',
    description: serviceData.description || '',
    includes: serviceData.includes || ['100% Organic Sojat Cones', 'Custom linework'],
    image_url: serviceData.image_url || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
    badge: serviceData.badge || 'Signature',
    is_active: true,
    created_at: new Date().toISOString()
  };

  if (supabase) {
    try {
      const { data, error } = await supabase.from('mehandi_services').insert([newServ]).select().single();
      if (!error && data) {
        const current = await fetchServices();
        localStorage.setItem(STORAGE_KEY_SERVICES, JSON.stringify([data, ...current.filter(s => s.id !== data.id)]));
        return data;
      }
    } catch (e) {
      console.warn('Supabase createService error:', e);
    }
  }
  const current = await fetchServices();
  const updated = [newServ, ...current];
  localStorage.setItem(STORAGE_KEY_SERVICES, JSON.stringify(updated));
  return newServ;
}

export async function updateService(id, serviceData) {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('mehandi_services').update(serviceData).eq('id', id).select().single();
      if (!error && data) return data;
    } catch (e) {}
  }
  const current = await fetchServices();
  const updated = current.map(s => s.id === id ? { ...s, ...serviceData } : s);
  localStorage.setItem(STORAGE_KEY_SERVICES, JSON.stringify(updated));
  return { id, ...serviceData };
}

export async function deleteService(id) {
  if (supabase) {
    try {
      await supabase.from('mehandi_services').delete().eq('id', id);
    } catch (e) {}
  }
  const current = await fetchServices();
  const updated = current.filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEY_SERVICES, JSON.stringify(updated));
  return true;
}

// ─── 3. PORTFOLIO DESIGNS CRUD ────────────────────────────────────
export async function fetchDesigns(category = 'all') {
  if (supabase) {
    try {
      let query = supabase.from('mehandi_designs').select('*').order('created_at', { ascending: false });
      if (category && category !== 'all') {
        query = query.ilike('category', `%${category}%`);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) return data;
    } catch (e) {
      console.warn('Supabase fetchDesigns error:', e);
    }
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY_DESIGNS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (category === 'all') return parsed;
      return parsed.filter(d => d.category.toLowerCase().includes(category.toLowerCase()));
    }
  } catch (e) {}
  return category === 'all' ? INITIAL_DESIGNS : INITIAL_DESIGNS.filter(d => d.category.toLowerCase().includes(category.toLowerCase()));
}

export async function createDesign(designData) {
  const newDesign = {
    id: 'design_' + Date.now(),
    title: designData.title || 'Haute Bridal Creation',
    category: designData.category || 'bridal',
    image_url: designData.image_url || designData.imageUrl || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
    description: designData.description || 'Intricate hand-sketched composition by Bhuvi.',
    price_range: designData.price_range || designData.priceRange || '₹4,500 - ₹8,000',
    tag: designData.tag || 'Signature',
    created_at: new Date().toISOString()
  };

  if (supabase) {
    try {
      const { data, error } = await supabase.from('mehandi_designs').insert([newDesign]).select().single();
      if (!error && data) {
        const current = await fetchDesigns('all');
        localStorage.setItem(STORAGE_KEY_DESIGNS, JSON.stringify([data, ...current.filter(d => d.id !== data.id)]));
        return { success: true, design: data };
      }
    } catch (e) {
      console.warn('Supabase createDesign error:', e);
    }
  }
  const current = await fetchDesigns('all');
  const updated = [newDesign, ...current];
  localStorage.setItem(STORAGE_KEY_DESIGNS, JSON.stringify(updated));
  return { success: true, design: newDesign };
}

export async function deleteDesign(id) {
  if (supabase) {
    try {
      await supabase.from('mehandi_designs').delete().eq('id', id);
    } catch (e) {}
  }
  const current = await fetchDesigns('all');
  const updated = current.filter(d => d.id !== id);
  localStorage.setItem(STORAGE_KEY_DESIGNS, JSON.stringify(updated));
  return true;
}

// ─── 4. REVIEWS CRUD (WITH USER AUTHOR-TOKEN SECURITY) ───────────
export async function fetchReviews() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('mehandi_reviews')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data;
    } catch (e) {
      console.warn('Supabase fetchReviews error:', e);
    }
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY_REVIEWS);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return INITIAL_REVIEWS;
}

export async function submitReview(reviewData) {
  const authorToken = getOrCreateAuthorToken();
  const newRev = {
    id: 'rev_' + Date.now(),
    client_name: reviewData.client_name || reviewData.clientName || 'Bride Client',
    rating: reviewData.rating || 5,
    event_type: reviewData.event_type || reviewData.eventType || 'Bridal Mehandi',
    location: reviewData.location || 'Ahmedabad',
    comment: reviewData.comment || 'Wonderful experience!',
    author_token: authorToken,
    created_at: new Date().toISOString()
  };

  if (supabase) {
    try {
      const { data, error } = await supabase.from('mehandi_reviews').insert([newRev]).select().single();
      if (!error && data) {
        const current = await fetchReviews();
        localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify([data, ...current.filter(r => r.id !== data.id)]));
        return data;
      }
    } catch (e) {
      console.warn('Supabase submitReview error:', e);
    }
  }
  const current = await fetchReviews();
  const updated = [newRev, ...current];
  localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(updated));
  return newRev;
}

export async function updateReview(id, updatedData) {
  const authorToken = getOrCreateAuthorToken();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('mehandi_reviews')
        .update(updatedData)
        .eq('id', id)
        .eq('author_token', authorToken)
        .select()
        .single();
      if (!error && data) return data;
    } catch (e) {}
  }
  const current = await fetchReviews();
  const updated = current.map(r => (r.id === id && r.author_token === authorToken) ? { ...r, ...updatedData } : r);
  localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(updated));
  return { id, ...updatedData };
}

export async function deleteReview(id, isAdmin = false) {
  const authorToken = getOrCreateAuthorToken();
  if (supabase) {
    try {
      let query = supabase.from('mehandi_reviews').delete().eq('id', id);
      if (!isAdmin) {
        query = query.eq('author_token', authorToken);
      }
      await query;
    } catch (e) {}
  }
  const current = await fetchReviews();
  const updated = current.filter(r => {
    if (r.id !== id) return true;
    if (isAdmin) return false;
    return r.author_token !== authorToken;
  });
  localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(updated));
  return true;
}

// ─── 5. INQUIRIES / BOOKINGS CRUD ────────────────────────────────
export async function fetchInquiries() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('mehandi_inquiries')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase fetchInquiries error:', e);
    }
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY_INQUIRIES);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return [];
}

export async function submitInquiry(inquiryData) {
  const payload = {
    id: 'inq_' + Date.now(),
    name: inquiryData.name,
    phone: inquiryData.phone,
    email: inquiryData.email || '',
    event_date: inquiryData.event_date || inquiryData.eventDate,
    event_type: inquiryData.event_type || inquiryData.eventType || 'Bridal Mehandi',
    city_venue: inquiryData.city_venue || inquiryData.cityVenue || '',
    message: inquiryData.message || '',
    status: 'New',
    created_at: new Date().toISOString()
  };

  if (supabase) {
    try {
      const { data, error } = await supabase.from('mehandi_inquiries').insert([payload]).select().single();
      if (!error && data) {
        const current = await fetchInquiries();
        localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify([data, ...current.filter(i => i.id !== data.id)]));
        return data;
      }
    } catch (e) {
      console.warn('Supabase submitInquiry error:', e);
    }
  }
  const current = await fetchInquiries();
  const updated = [payload, ...current];
  localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(updated));
  return payload;
}

export async function updateInquiryStatus(id, status) {
  if (supabase) {
    try {
      await supabase.from('mehandi_inquiries').update({ status }).eq('id', id);
    } catch (e) {}
  }
  const current = await fetchInquiries();
  const updated = current.map(i => i.id === id ? { ...i, status } : i);
  localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(updated));
  return true;
}

export async function deleteInquiry(id) {
  if (supabase) {
    try {
      await supabase.from('mehandi_inquiries').delete().eq('id', id);
    } catch (e) {}
  }
  const current = await fetchInquiries();
  const updated = current.filter(i => i.id !== id);
  localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(updated));
  return true;
}

// ─── 6. CLOUD CONNECTION HEALTH CHECK ─────────────────────────────
export async function testSupabaseConnection() {
  if (!supabase) {
    return { connected: false, hasTables: false, error: 'Supabase client not initialized' };
  }
  try {
    const { data, error } = await supabase.from('mehandi_settings').select('id').limit(1);
    if (!error) {
      return { connected: true, hasTables: true, message: 'Connected to Supabase live database' };
    }
    return { connected: true, hasTables: false, message: 'Connected to project (Run supabase-schema.sql to create tables)' };
  } catch (err) {
    return { connected: false, hasTables: false, error: err.message };
  }
}

// ─── 7. WHATSAPP LINK GENERATOR ───────────────────────────────────
export function createWhatsAppUrl(options = {}) {
  const phone = (options.phone || DEFAULT_WHATSAPP_PHONE).replace(/\D/g, '');
  let message = `Namaste Bhuvi!\n\nI am contacting you from the Bhuvi Mehandi website.`;

  if (options.name) message += `\n👤 Name: ${options.name}`;
  if (options.eventType) message += `\n💍 Event: ${options.eventType}`;
  if (options.eventDate) message += `\n📅 Event Date: ${options.eventDate}`;
  if (options.service) message += `\n✨ Service: ${options.service}`;
  if (options.cityVenue) message += `\n📍 Venue/City: ${options.cityVenue}`;
  if (options.designCode) message += `\n🎨 Selected Design: ${options.designCode}`;
  if (options.customNote) message += `\n\n📝 Details:\n${options.customNote}`;

  message += `\n\nPlease confirm date availability and share your quotation. Thank you!`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

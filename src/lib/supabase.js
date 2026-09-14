import { createClient } from '@supabase/supabase-js';
import { INITIAL_DESIGNS, INITIAL_SERVICES, INITIAL_REVIEWS } from '../data/mockData';

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://itinnrnvjwwhstnwomki.supabase.co';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0aW5ucm52and3aHN0bndvbWtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzNTA1MDEsImV4cCI6MjEwNDkyNjUwMX0.FEphwrQL38rskt7t_-n4ZkippCDMPjlAMAoVllRryhM';

export const WHATSAPP_PHONE = '919876543210'; // Default business contact phone
export const BUSINESS_NAME = 'Bhuvi Mehandi Artistry';

let supabaseClient = null;

try {
  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
} catch (err) {
  console.warn('Supabase initialization error, falling back to local storage store:', err);
}

export const supabase = supabaseClient;

// Storage keys for offline / fallback management
const STORAGE_KEY_DESIGNS = 'bhuvi_mehandi_designs';
const STORAGE_KEY_INQUIRIES = 'bhuvi_mehandi_inquiries';

// Helper to initialize local storage
function getLocalDesigns() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_DESIGNS);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_DESIGNS;
}

function saveLocalDesigns(designs) {
  try {
    localStorage.setItem(STORAGE_KEY_DESIGNS, JSON.stringify(designs));
  } catch (e) {
    console.error(e);
  }
}

function getLocalInquiries() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_INQUIRIES);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error(e);
  }
  return [
    {
      id: "demo-inq-1",
      name: "Rhea Singhania",
      phone: "+91 98250 11223",
      email: "rhea.singh@example.com",
      event_date: "2026-11-20",
      event_type: "Wedding / Bridal",
      service_name: "Royal Luxury Bridal Package",
      guests_count: 15,
      city_venue: "The Leela Palace, Gandhinagar",
      message: "Looking for traditional dulha-dulhan portrait and custom hashtag in bridal henna.",
      status: "Confirmed",
      created_at: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: "demo-inq-2",
      name: "Tanvi Parikh",
      phone: "+91 94280 88990",
      email: "tanvi.parikh@gmail.com",
      event_date: "2026-10-15",
      event_type: "Engagement Ceremony",
      service_name: "Engagement & Roka Chic",
      guests_count: 5,
      city_venue: "Club O7, Ahmedabad",
      message: "Need contemporary arabic henna for both hands up to mid-forearm.",
      status: "New",
      created_at: new Date(Date.now() - 3600000 * 6).toISOString()
    }
  ];
}

function saveLocalInquiries(inquiries) {
  try {
    localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(inquiries));
  } catch (e) {
    console.error(e);
  }
}

// -------------------------------------------------------------
// CONNECTION STATUS TESTER
// -------------------------------------------------------------
export async function testSupabaseConnection() {
  if (!supabase) {
    return {
      connected: false,
      message: 'Supabase client could not be initialized.',
      hasTables: false
    };
  }

  try {
    const { data, error } = await supabase.from('mehandi_designs').select('id').limit(1);
    if (error) {
      if (error.code === 'PGRST205' || error.message?.includes('schema cache')) {
        return {
          connected: true,
          hasTables: false,
          message: 'Connected to Supabase! However, the mehandi tables are not created yet. Please execute the provided SQL schema in your Supabase SQL Editor.'
        };
      }
      return {
        connected: false,
        hasTables: false,
        message: error.message
      };
    }
    return {
      connected: true,
      hasTables: true,
      message: 'Successfully connected to live Supabase database with all mehandi tables active!'
    };
  } catch (err) {
    return {
      connected: false,
      hasTables: false,
      message: err.message || 'Network error connecting to Supabase.'
    };
  }
}

// -------------------------------------------------------------
// DESIGNS API
// -------------------------------------------------------------
export async function fetchDesigns(categoryFilter = null) {
  // Try Supabase first
  if (supabase) {
    try {
      let query = supabase.from('mehandi_designs').select('*').order('created_at', { ascending: false });
      if (categoryFilter && categoryFilter !== 'all') {
        query = query.eq('category', categoryFilter);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        // Map database columns to camelCase
        return data.map(item => ({
          id: item.id,
          title: item.title,
          category: item.category,
          imageUrl: item.image_url,
          description: item.description,
          priceRange: item.price_range || 'Custom Quote',
          tag: item.tag || 'Popular',
          featured: item.featured ?? false,
          likesCount: item.likes_count || 24,
          createdAt: item.created_at
        }));
      }
    } catch (err) {
      console.warn('Supabase query failed, falling back to local data:', err);
    }
  }

  // Local fallback
  const localList = getLocalDesigns();
  if (categoryFilter && categoryFilter !== 'all') {
    return localList.filter(d => d.category.toLowerCase() === categoryFilter.toLowerCase());
  }
  return localList;
}

export async function createDesign(designData) {
  const newDesign = {
    id: 'des-' + Date.now(),
    title: designData.title || 'Untitled Mehandi Design',
    category: designData.category || 'bridal',
    image_url: designData.imageUrl || designData.image_url,
    description: designData.description || '',
    price_range: designData.priceRange || designData.price_range || '₹2,000 - ₹5,000',
    tag: designData.tag || 'New Art',
    featured: Boolean(designData.featured),
    likes_count: 10,
    created_at: new Date().toISOString()
  };

  let savedToCloud = false;

  if (supabase) {
    try {
      const { data, error } = await supabase.from('mehandi_designs').insert([newDesign]).select();
      if (!error && data) {
        savedToCloud = true;
      }
    } catch (e) {
      console.warn('Could not insert to Supabase table:', e);
    }
  }

  // Always keep local list updated too
  const localList = getLocalDesigns();
  const formatted = {
    id: newDesign.id,
    title: newDesign.title,
    category: newDesign.category,
    imageUrl: newDesign.image_url,
    description: newDesign.description,
    priceRange: newDesign.price_range,
    tag: newDesign.tag,
    featured: newDesign.featured,
    likesCount: newDesign.likes_count,
    createdAt: newDesign.created_at
  };
  saveLocalDesigns([formatted, ...localList]);

  return { success: true, design: formatted, savedToCloud };
}

export async function deleteDesign(designId) {
  if (supabase) {
    try {
      await supabase.from('mehandi_designs').delete().eq('id', designId);
    } catch (e) {
      console.warn('Delete in Supabase failed:', e);
    }
  }

  const localList = getLocalDesigns().filter(d => d.id !== designId);
  saveLocalDesigns(localList);
  return { success: true };
}

// -------------------------------------------------------------
// INQUIRIES & BOOKINGS API
// -------------------------------------------------------------
export async function submitInquiry(inquiryData) {
  const payload = {
    id: 'inq-' + Date.now(),
    name: inquiryData.name,
    phone: inquiryData.phone,
    email: inquiryData.email || '',
    event_date: inquiryData.eventDate || inquiryData.event_date || 'TBD',
    event_type: inquiryData.eventType || inquiryData.event_type || 'Wedding',
    service_name: inquiryData.serviceName || inquiryData.service_name || 'General Inquiry',
    guests_count: parseInt(inquiryData.guestsCount || inquiryData.guests_count || 1, 10),
    city_venue: inquiryData.cityVenue || inquiryData.city_venue || '',
    message: inquiryData.message || '',
    status: 'New',
    created_at: new Date().toISOString()
  };

  let savedToCloud = false;

  if (supabase) {
    try {
      const { data, error } = await supabase.from('mehandi_inquiries').insert([payload]).select();
      if (!error && data) {
        savedToCloud = true;
      }
    } catch (e) {
      console.warn('Supabase inquiry insert skipped:', e);
    }
  }

  // Save in local storage
  const currentInquiries = getLocalInquiries();
  saveLocalInquiries([payload, ...currentInquiries]);

  return { success: true, savedToCloud, inquiry: payload };
}

export async function fetchInquiries() {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('mehandi_inquiries').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (e) {
      console.warn('Supabase inquiries fetch error:', e);
    }
  }
  return getLocalInquiries();
}

export async function updateInquiryStatus(id, newStatus) {
  if (supabase) {
    try {
      await supabase.from('mehandi_inquiries').update({ status: newStatus }).eq('id', id);
    } catch (e) {
      console.warn('Failed to update status on Supabase:', e);
    }
  }

  const list = getLocalInquiries().map(item => {
    if (item.id === id) {
      return { ...item, status: newStatus };
    }
    return item;
  });
  saveLocalInquiries(list);
  return { success: true };
}

// -------------------------------------------------------------
// WHATSAPP URL GENERATOR
// -------------------------------------------------------------
export function createWhatsAppUrl({
  name = '',
  phone = '',
  eventDate = '',
  eventType = 'Bridal Mehandi',
  service = '',
  cityVenue = '',
  designCode = '',
  customNote = ''
} = {}) {
  let message = `🌸 *Namaste Bhuvi Mehandi Artistry!* 🌸\n\nI would like to inquire about booking Mehandi services for my upcoming celebration.`;

  if (name) message += `\n\n👤 *Client Name:* ${name}`;
  if (phone) message += `\n📞 *Phone:* ${phone}`;
  if (eventType) message += `\n🎉 *Event:* ${eventType}`;
  if (service) message += `\n✨ *Selected Service / Package:* ${service}`;
  if (eventDate) message += `\n📅 *Event Date:* ${eventDate}`;
  if (cityVenue) message += `\n📍 *Venue / City:* ${cityVenue}`;
  if (designCode) message += `\n🎨 *Interested Design:* ${designCode}`;
  if (customNote) message += `\n📝 *Special Request:* ${customNote}`;

  message += `\n\nPlease let me know your availability and customized quotation. Thank you!`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodedMessage}`;
}

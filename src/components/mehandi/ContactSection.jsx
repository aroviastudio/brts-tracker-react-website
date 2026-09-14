import React, { useState } from 'react';
import { FAQS } from '../../data/mockData';
import { createWhatsAppUrl } from '../../lib/supabase';
import { submitInquiry } from '../../lib/supabase';
import { ChevronDown, Send, Loader2, CheckCircle, Flower } from 'lucide-react';

function FAQItem({ item, idx }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-rose-100 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center justify-between w-full px-6 py-5 text-left gap-4"
      >
        <span className="font-semibold text-rose-950 text-sm leading-snug font-sans-clean pr-2">
          {item.q}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-rose-400 flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <p className="px-6 pb-5 text-stone-600 text-sm leading-relaxed font-sans-clean border-t border-rose-50 pt-4">
          {item.a}
        </p>
      </div>
    </div>
  );
}

const EVENT_TYPES = [
  'Bridal / Wedding Day',
  'Engagement / Roka',
  'Sangeet Night',
  'Cocktail / Reception',
  'Godh Bharai / Baby Shower',
  'Karwa Chauth',
  'Festival / Navratri',
  'Destination Wedding',
  'Other'
];

export default function ContactSection() {
  const [form, setForm] = useState({
    name: '', phone: '', email: '', eventDate: '',
    eventType: '', serviceName: '', guestsCount: 1,
    cityVenue: '', message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.eventType) {
      setError('Please fill in Name, Phone, and Event Type to proceed.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await submitInquiry(form);
      setSubmitted(true);
    } catch (err) {
      setError('Something went wrong. Please try WhatsApp instead!');
    } finally {
      setSubmitting(false);
    }
  };

  const whatsAppLink = createWhatsAppUrl({
    name: form.name,
    phone: form.phone,
    eventDate: form.eventDate,
    eventType: form.eventType || 'Mehandi Inquiry',
    service: form.serviceName,
    cityVenue: form.cityVenue,
    customNote: form.message
  });

  return (
    <section id="contact" className="py-20 lg:py-28 bg-white relative overflow-hidden">
      {/* Top wavy border */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-rose-200 via-amber-300 to-rose-200" />

      {/* Background decoration */}
      <div className="absolute right-0 top-0 w-80 h-80 bg-rose-50 rounded-full blur-3xl opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-100 mb-4">
            <Flower className="w-3.5 h-3.5 text-rose-600" />
            <span className="text-rose-600 text-xs font-bold uppercase tracking-widest font-sans-clean">
              Get In Touch
            </span>
          </div>
          <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-rose-950 mb-4">
            Book Your Mehandi Date
          </h2>
          <p className="text-stone-500 text-lg max-w-2xl mx-auto font-sans-clean leading-relaxed">
            Fill out the form below or click <span className="font-bold text-green-600">Book on WhatsApp</span> for instant confirmation.
            We typically respond within 1 hour!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          {/* FAQ Side */}
          <div className="lg:col-span-2">
            <h3 className="font-playfair text-2xl font-bold text-rose-950 mb-6">
              Frequently Asked Questions
            </h3>
            <div className="flex flex-col gap-3">
              {FAQS.map((item, idx) => (
                <FAQItem key={idx} item={item} idx={idx} />
              ))}
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-3">
            <div className="bg-[#fdfbf7] rounded-3xl p-8 border border-rose-100 shadow-sm">
              {submitted ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-playfair text-2xl font-bold text-rose-950 mb-2">
                    Booking Request Sent! 🌸
                  </h3>
                  <p className="text-stone-600 font-sans-clean mb-6 text-sm leading-relaxed">
                    We received your inquiry. Bhuvi will personally WhatsApp you within a few hours to confirm your date and share a custom quotation.
                  </p>
                  <a
                    href={whatsAppLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-500 hover:bg-green-600 text-white font-bold text-sm transition-colors font-sans-clean"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Continue on WhatsApp
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <h3 className="col-span-full font-playfair text-xl font-bold text-rose-950 mb-1">
                    Booking Inquiry Form
                  </h3>

                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1.5 font-sans-clean">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={set('name')}
                      placeholder="Your Name"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-rose-300 focus:ring-2 focus:ring-rose-100 outline-none text-sm font-sans-clean bg-white transition-all"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1.5 font-sans-clean">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={set('phone')}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-rose-300 focus:ring-2 focus:ring-rose-100 outline-none text-sm font-sans-clean bg-white transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1.5 font-sans-clean">Email (optional)</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={set('email')}
                      placeholder="yourname@email.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-rose-300 focus:ring-2 focus:ring-rose-100 outline-none text-sm font-sans-clean bg-white transition-all"
                    />
                  </div>

                  {/* Event Date */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1.5 font-sans-clean">Event Date *</label>
                    <input
                      type="date"
                      required
                      value={form.eventDate}
                      onChange={set('eventDate')}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-rose-300 focus:ring-2 focus:ring-rose-100 outline-none text-sm font-sans-clean bg-white transition-all"
                    />
                  </div>

                  {/* Event Type */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1.5 font-sans-clean">Event Type *</label>
                    <select
                      required
                      value={form.eventType}
                      onChange={set('eventType')}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-rose-300 focus:ring-2 focus:ring-rose-100 outline-none text-sm font-sans-clean bg-white transition-all"
                    >
                      <option value="">Select Event</option>
                      {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>

                  {/* Guests */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1.5 font-sans-clean">No. of Guests</label>
                    <input
                      type="number"
                      min={1}
                      value={form.guestsCount}
                      onChange={set('guestsCount')}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-rose-300 focus:ring-2 focus:ring-rose-100 outline-none text-sm font-sans-clean bg-white transition-all"
                    />
                  </div>

                  {/* Venue */}
                  <div className="col-span-full">
                    <label className="block text-xs font-semibold text-stone-600 mb-1.5 font-sans-clean">Venue & City</label>
                    <input
                      type="text"
                      value={form.cityVenue}
                      onChange={set('cityVenue')}
                      placeholder="e.g. Grand Bhagwati, Ahmedabad"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-rose-300 focus:ring-2 focus:ring-rose-100 outline-none text-sm font-sans-clean bg-white transition-all"
                    />
                  </div>

                  {/* Special Requests */}
                  <div className="col-span-full">
                    <label className="block text-xs font-semibold text-stone-600 mb-1.5 font-sans-clean">Special Requests</label>
                    <textarea
                      value={form.message}
                      onChange={set('message')}
                      rows={3}
                      placeholder="Tell us about your dream design, theme, attire color, inspirations..."
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-rose-300 focus:ring-2 focus:ring-rose-100 outline-none text-sm font-sans-clean bg-white transition-all resize-none"
                    />
                  </div>

                  {/* Error */}
                  {error && (
                    <p className="col-span-full text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2 font-sans-clean">
                      {error}
                    </p>
                  )}

                  {/* Buttons */}
                  <div className="col-span-full flex flex-col sm:flex-row gap-3 mt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-rose-800 hover:bg-rose-900 text-white font-bold text-sm transition-all duration-200 disabled:opacity-60 font-sans-clean"
                    >
                      {submitting
                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                        : <><Send className="w-4 h-4" /> Send Booking Request</>
                      }
                    </button>

                    <a
                      href={whatsAppLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-sm transition-all duration-200 font-sans-clean"
                    >
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current flex-shrink-0">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Book on WhatsApp
                    </a>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

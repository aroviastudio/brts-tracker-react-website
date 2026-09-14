# Bhuvi Mehandi — Minimalist Luxury Henna Artistry

A modern, high-end bridal & event henna website inspired by quiet luxury design principles (Aesop, Celine, Apple). Built with **React 19**, **Vite**, **Tailwind CSS**, and **Supabase**.

## 🌟 Design & Features

- **Minimalist Aesthetic**: Generous whitespace, refined editorial serif typography (`Cormorant Garamond`), crisp UI sans (`Inter`), and restrained crimson/charcoal palette.
- **Impactful Hero Section**: Clean editorial layout with high-resolution imagery and direct WhatsApp consultation booking.
- **Elevated Services Section**:
  - `01 / The Bridal Narrative` (Bespoke full-length storytelling)
  - `02 / Contemporary Arabic` (Fluid negative-space florals)
  - `03 / Rajasthani Heritage` (Classical Marwari micro-jaali)
  - `04 / The Sangeet Soirée` (Bespoke guest curation)
- **Selected Works / Archive**: Filterable gallery (`All`, `Bridal`, `Arabic`, `Heritage`, `Feet`) with lightbox modal preview.
- **The Philosophy (About)**: 100% organic Rajasthani Sojat leaf, chemical-free guarantee, lavender & nilgiri essential oils.
- **Inquiry & Reservation**:
  - Direct form that saves to Supabase database `mehandi_inquiries` table (with instant offline cache fallback).
  - Automatically formats and opens WhatsApp with client's details.
- **Studio Portal (Admin Access)**:
  - Accessible via "Studio Access" in the footer.
  - Review client inquiries, update booking statuses, and add new designs directly to the portfolio.
- **Subtle Floating WhatsApp Action**: Clean, non-intrusive floating contact button.

---

## 🚀 Instant Vercel Deployment

1. Go to **[vercel.com/new](https://vercel.com/new)**.
2. Select your repository: **`aroviastudio/brts-tracker-react-website`**
3. Framework Preset: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Add Environment Variables:
   - `VITE_SUPABASE_URL`: `https://itinnrnvjwwhstnwomki.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `your_supabase_anon_key`
7. Click **Deploy**.

---

## 🗄️ Supabase Database Setup

Run the included `supabase-schema.sql` script in your [Supabase SQL Editor](https://supabase.com/dashboard) to enable live database storage for designs and inquiries.

import React, { useState, useEffect } from 'react';
import initialData from './data/data_store.json';

export default function App() {
  // --- SITE STATES HYDRATED FROM DATA STORE ---
  const [settings, setSettings] = useState(initialData.settings || {
    whatsapp: '918094935632',
    phone: '+91 80949 35632',
    email: 'prajapatbhavna2003@gmail.com',
    address: 'Near Mohanlal Sukhadia University, Udaipur, Rajasthan 313001',
    instagram: 'bhuvi_mehandi_24',
    adminPassword: 'admin123'
  });

  const [heroBanners, setHeroBanners] = useState(
    initialData.heroBanners && initialData.heroBanners.length > 0
      ? initialData.heroBanners
      : [
          {
            id: 'banner-1',
            image: '/hero-banner.png',
            title: 'Bhuvi Mehandi - Professional Bridal Mehndi Artist Udaipur'
          },
          {
            id: 'banner-2',
            image: 'https://images.unsplash.com/photo-1599833975787-5f6b0e8d1b55?auto=format&fit=crop&w=2000&q=85',
            title: 'Royal Rajasthani Bridal Mehndi - Udaipur Heritage'
          },
          {
            id: 'banner-3',
            image: 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=2000&q=85',
            title: 'Exquisite Fine-Line Floral & Arabic Bridal Henna'
          }
        ]
  );

  const [gallery, setGallery] = useState(
    initialData.gallery && initialData.gallery.length > 0
      ? initialData.gallery
      : [
          {
            id: 'gal-1',
            title: 'Royal Bridal Full-Arm Mehndi',
            category: 'bridal',
            categoryLabel: 'BRIDAL COLLECTION',
            subtitle: 'Royal Bridal Henna',
            image: 'https://images.unsplash.com/photo-1599833975787-5f6b0e8d1b55?auto=format&fit=crop&w=900&q=80',
            isLarge: true
          },
          {
            id: 'gal-2',
            title: 'Modern Arabic Floral Trail',
            category: 'arabic',
            categoryLabel: 'ARABIC STYLE',
            subtitle: 'Floral Trail',
            image: 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=700&q=80'
          },
          {
            id: 'gal-3',
            title: 'Heritage Marwari Bharwa Mehndi',
            category: 'rajasthani',
            categoryLabel: 'RAJASTHANI',
            subtitle: 'Heritage Marwari',
            image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=700&q=80'
          },
          {
            id: 'gal-4',
            title: 'Delicate Ring Ceremony Mehndi',
            category: 'engagement',
            categoryLabel: 'ENGAGEMENT',
            subtitle: 'Delicate Mandala',
            image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=700&q=80'
          },
          {
            id: 'gal-5',
            title: 'Festive Teej & Karwa Chauth Henna',
            category: 'festival',
            categoryLabel: 'FESTIVALS',
            subtitle: 'Festive Grace',
            image: 'https://images.unsplash.com/photo-1609220136736-443140cffec6?auto=format&fit=crop&w=700&q=80'
          },
          {
            id: 'gal-6',
            title: 'Intricate Bridal Palms & Cuffs',
            category: 'bridal',
            categoryLabel: 'BRIDAL COLLECTION',
            subtitle: 'Palms & Cuffs',
            image: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=700&q=80'
          },
          {
            id: 'gal-7',
            title: 'Contemporary Negative-Space Arabic',
            category: 'arabic',
            categoryLabel: 'ARABIC DESIGNER',
            subtitle: 'Negative Space',
            image: 'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=700&q=80'
          },
          {
            id: 'gal-8',
            title: 'Traditional Jharokha & Peacock Art',
            category: 'rajasthani',
            categoryLabel: 'RAJASTHANI HERITAGE',
            subtitle: 'Jharokha & Peacock',
            image: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=700&q=80'
          }
        ]
  );

  const [reviews, setReviews] = useState(
    initialData.reviews && initialData.reviews.length > 0
      ? initialData.reviews
      : [
          {
            name: 'Pooja Rathore',
            role: 'Destination Bride • Jagmandir Palace, Udaipur',
            stars: 5,
            text: 'Bhuvi is an absolute magician! She drew our destination wedding story and hidden portraits so exquisitely on my hands. The stain on my wedding day was pitch dark and lasted for over 3 weeks. Highly recommend her to every Udaipur bride!'
          },
          {
            name: 'Ananya Singhal',
            role: 'Royal Wedding • The Oberoi Udaivilas, Udaipur',
            stars: 5,
            text: 'The patience and precision Bhuvi has is unmatched. She arrived on time at our resort, brought natural organic henna that smelled heavenly, and created the cleanest fine lines I\'ve ever seen. Every single wedding guest was mesmerized!'
          },
          {
            name: 'Sneha Sharma',
            role: 'Sangeet & Bridal • Aurika, Udaipur',
            stars: 5,
            text: 'Booked Bhuvi for my engagement and then again for my sister\'s wedding group. Her designs are super modern, chic, and the color payoff is extraordinary. She is polite, gentle, and a true artist!'
          }
        ]
  );

  // --- UI INTERACTIVE STATES ---
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightboxData, setLightboxData] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminTab, setAdminTab] = useState('inquiries');
  const [inquiriesList, setInquiriesList] = useState([]);
  const [activeFaq, setActiveFaq] = useState(null);

  // Booking Form State
  const [booking, setBooking] = useState({
    name: '',
    phone: '',
    email: '',
    event: 'Bridal',
    date: '',
    time: '',
    venue: '',
    people: '1',
    design: 'Bridal',
    notes: ''
  });
  const [bookingMessage, setBookingMessage] = useState(false);

  // New Review Modal Form State
  const [newReview, setNewReview] = useState({
    name: '',
    role: 'Bride • Udaipur Wedding',
    stars: 5,
    text: ''
  });

  // Admin New Design Form State
  const [newDesign, setNewDesign] = useState({
    title: '',
    category: 'bridal',
    categoryLabel: 'BRIDAL COLLECTION',
    image: '',
    isLarge: false
  });

  // --- 5s AUTO CAROUSEL ---
  useEffect(() => {
    if (heroBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % heroBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroBanners.length]);

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + heroBanners.length) % heroBanners.length);
  };

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % heroBanners.length);
  };

  // --- SERVICES LIST ---
  const servicesList = [
    { icon: '♕', title: 'Bridal Mehndi', styleKey: 'Bridal', desc: 'Intricate full arm and feet bridal patterns with personalized groom figures, portraits, and love stories.' },
    { icon: '✦', title: 'Arabic Mehndi', styleKey: 'Arabic', desc: 'Flowing diagonal trails with bold negative space, floral highlights, and chic modern elegance.' },
    { icon: '❈', title: 'Bharwa Rajasthani', styleKey: 'Rajasthani', desc: 'Heritage Marwari patterns featuring peacocks, jharokhas, doli-baraat, and royal palace motifs.' },
    { icon: '❋', title: 'Designer Mehndi', styleKey: 'Designer', desc: 'Modern geometric lace, Moroccan mandalas, and fusion designs crafted for contemporary brides.' },
    { icon: '♡', title: 'Engagement & Roka', styleKey: 'Engagement', desc: 'Delicate wrist cuffs, subtle palm mandalas, and graceful backhand motifs for ring ceremonies.' },
    { icon: '◈', title: 'Groom Mehndi', styleKey: 'Simple', desc: 'Subtle, classy patterns, bride\'s initials, and minimalistic sacred mandalas for the handsome groom.' },
    { icon: '✿', title: 'Baby Shower & Godh Bharai', styleKey: 'Simple', desc: 'Auspicious and charming symbols of motherhood, joy, and blessings for the mother-to-be.' },
    { icon: '☼', title: 'Festival Mehndi', styleKey: 'Simple', desc: 'Celebrate Karwa Chauth, Teej, Diwali, and Raksha Bandhan with festive and quick-drying designs.' },
    { icon: '♧', title: 'Sangeet & Family Groups', styleKey: 'Simple', desc: 'Professional multi-artist henna team for wedding guests, bridesmaids, and family gatherings.' },
    { icon: '❖', title: 'Inauguration & Corporate', styleKey: 'Simple', desc: 'Traditional auspicious henna for corporate festive celebrations and grand openings.' },
    { icon: '♡', title: 'Kids\' Mehndi', styleKey: 'Simple', desc: 'Playful, quick, and natural designs using 100% skin-safe organic henna for little hands.' },
    { icon: '✧', title: 'Custom Love Story', styleKey: 'Bridal', desc: 'Bring your unique story to life with custom skylines, proposal moments, and portrait artistry.' }
  ];

  // --- CATEGORY FILTERING ---
  const filteredGallery = activeFilter === 'all'
    ? gallery
    : gallery.filter((item) => (item.category || '').toLowerCase() === activeFilter.toLowerCase());

  const getCategoryCount = (cat) => {
    if (cat === 'all') return gallery.length;
    return gallery.filter((i) => (i.category || '').toLowerCase() === cat.toLowerCase()).length;
  };

  // --- BOOKING FORM SUBMISSION ---
  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setBookingMessage(true);

    const newInquiry = {
      id: 'inq-' + Date.now(),
      name: booking.name,
      phone: booking.phone,
      email: booking.email,
      event: booking.event,
      date: booking.date,
      time: booking.time,
      venue: booking.venue,
      people: booking.people,
      design: booking.design,
      notes: booking.notes,
      createdAt: new Date().toLocaleString(),
      status: 'pending'
    };

    setInquiriesList([newInquiry, ...inquiriesList]);

    // Build structured WhatsApp inquiry
    const msg = `🌿 *NEW BOOKING INQUIRY — BHUVI MEHANDI* 🌿\n\n` +
      `👤 *Name:* ${booking.name}\n` +
      `📞 *Phone:* ${booking.phone}\n` +
      `✨ *Event:* ${booking.event}\n` +
      `📅 *Date:* ${booking.date || 'TBD'}\n` +
      `⏰ *Time:* ${booking.time || 'Flexible'}\n` +
      `📍 *Venue:* ${booking.venue}\n` +
      `👥 *Guests:* ${booking.people || '1'}\n` +
      `🎨 *Style:* ${booking.design}\n` +
      `📝 *Notes:* ${booking.notes || 'None'}`;

    const waNum = settings.whatsapp || '918094935632';
    const waUrl = `https://wa.me/${waNum}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  };

  // --- REVIEW SUBMISSION ---
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    const createdRev = {
      name: newReview.name,
      role: newReview.role,
      stars: Number(newReview.stars),
      text: newReview.text
    };
    setReviews([createdRev, ...reviews]);
    setIsReviewModalOpen(false);
    setNewReview({ name: '', role: 'Bride • Udaipur Wedding', stars: 5, text: '' });
  };

  // --- ADMIN ACTIONS ---
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPasswordInput === 'admin123' || adminPasswordInput === settings.adminPassword) {
      setIsAdminLoggedIn(true);
    } else {
      alert('Incorrect admin password (default: admin123)');
    }
  };

  const handleAddDesign = (e) => {
    e.preventDefault();
    if (!newDesign.image) return;
    const added = {
      id: 'gal-' + Date.now(),
      title: newDesign.title || 'Mehndi Design',
      category: newDesign.category,
      categoryLabel: newDesign.category.toUpperCase(),
      subtitle: newDesign.title || 'Royal Henna',
      image: newDesign.image,
      isLarge: newDesign.isLarge
    };
    setGallery([added, ...gallery]);
    setNewDesign({ title: '', category: 'bridal', categoryLabel: 'BRIDAL COLLECTION', image: '', isLarge: false });
    alert('Design added to gallery successfully!');
  };

  const handleDeleteDesign = (id) => {
    if (confirm('Delete this design from gallery?')) {
      setGallery(gallery.filter((g) => g.id !== id));
    }
  };

  const getImageSrc = (item) => {
    if (!item) return '';
    return item.image || item.image_url || item.src || '';
  };

  return (
    <div className="bhuvi-container-wrapper">
      {/* ================= HEADER ================= */}
      <header id="header">
        <div className="container nav">
          <a href="#home" className="logo" aria-label="Bhuvi Mehandi Home">
            <img src="/logo.png" alt="Bhuvi Mehandi Luxury Bridal Henna Studio Udaipur" className="logo-img" width="52" height="52" />
            <div className="logo-text">
              <strong>Bhuvi Mehandi</strong>
              <span>Bridal Henna Studio • Udaipur</span>
            </div>
          </a>

          <nav aria-label="Main Navigation">
            <ul className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
              <li><a href="#home" className="nav-link active" onClick={() => setMobileMenuOpen(false)}>Home</a></li>
              <li><a href="#services" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Services</a></li>
              <li><a href="#portfolio" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Gallery</a></li>
              <li><a href="#about" className="nav-link" onClick={() => setMobileMenuOpen(false)}>About</a></li>
              <li><a href="#reviews" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Reviews</a></li>
              <li><a href="#faq" className="nav-link" onClick={() => setMobileMenuOpen(false)}>FAQ</a></li>
              <li><a href="#contact" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Contact</a></li>
              <li className="nav-mobile-book">
                <a href="#booking" className="btn btn-primary btn-mobile-nav" onClick={() => setMobileMenuOpen(false)}>
                  ✦ Book Appointment
                </a>
              </li>
              <li className="nav-mobile-insta">
                <a href={`https://instagram.com/${settings.instagram || 'bhuvi_mehandi_24'}`} target="_blank" rel="noopener" className="mobile-insta-item">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                    Follow on Instagram
                  </span>
                  <small style={{ color: 'var(--gold)', fontWeight: 700 }}>@{settings.instagram || 'bhuvi_mehandi_24'} ↗</small>
                </a>
              </li>
            </ul>
          </nav>

          <div className="nav-actions">
            <a href={`https://instagram.com/${settings.instagram || 'bhuvi_mehandi_24'}`} target="_blank" rel="noopener" className="nav-insta" aria-label="Follow on Instagram" title={`Follow @${settings.instagram || 'bhuvi_mehandi_24'}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>

            <a href="#booking" className="btn btn-primary nav-book">
              ✦ Book Appointment
            </a>

            <button className="menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle navigation menu" aria-expanded={mobileMenuOpen}>
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main>
        {/* ================= HERO CAROUSEL ================= */}
        <section className="hero" id="home">
          <div className="hero-carousel" id="heroCarousel">
            <div className="hero-carousel-track" id="heroCarouselTrack" style={{ transform: `translateX(-${currentSlideIndex * 100}%)`, display: 'flex', transition: 'transform 0.8s ease' }}>
              {heroBanners.map((slide, idx) => (
                <div key={slide.id || idx} className={`hero-slide ${currentSlideIndex === idx ? 'active' : ''}`} style={{ minWidth: '100%' }}>
                  <img
                    src={slide.image?.startsWith('hero-banner.png') ? '/hero-banner.png' : slide.image}
                    alt={slide.title || 'Bhuvi Mehandi Luxury Bridal Henna'}
                    loading={idx === 0 ? 'eager' : 'lazy'}
                  />
                </div>
              ))}
            </div>

            <button className="hero-carousel-arrow prev" onClick={prevSlide} aria-label="Previous Banner Slide">
              ‹
            </button>
            <button className="hero-carousel-arrow next" onClick={nextSlide} aria-label="Next Banner Slide">
              ›
            </button>

            <div className="hero-carousel-dots">
              {heroBanners.map((_, idx) => (
                <button
                  key={idx}
                  className={`hero-dot ${currentSlideIndex === idx ? 'active' : ''}`}
                  onClick={() => setCurrentSlideIndex(idx)}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ================= INTRO & TRUST METRICS ================= */}
        <section className="section intro">
          <div className="container">
            <span className="eyebrow">The Royal Art of Henna</span>
            <h2>Where tradition meets timeless beauty.</h2>
            <p>
              Bhuvi Mehandi is a professional henna artist based in Udaipur, Rajasthan, specializing in elegant bridal and festive mehndi designs.
              Every design is thoughtfully created to make your special moments even more beautiful and memorable.
            </p>

            <div className="intro-badges">
              <div className="intro-badge">
                <span className="badge-icon">🌿</span>
                <div>
                  <strong>100% Organic Henna</strong>
                  <span>Chemical-free, safe & dark stain</span>
                </div>
              </div>
              <div className="intro-badge">
                <span className="badge-icon">👑</span>
                <div>
                  <strong>500+ Happy Brides</strong>
                  <span>Udaipur & Destination Weddings</span>
                </div>
              </div>
              <div className="intro-badge">
                <span className="badge-icon">✨</span>
                <div>
                  <strong>Rich Dark Stain</strong>
                  <span>Deep mahogany color guaranteed</span>
                </div>
              </div>
              <div className="intro-badge">
                <span className="badge-icon">🎨</span>
                <div>
                  <strong>Custom Bridal Story</strong>
                  <span>Portraits, figures & couple motifs</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SERVICES ================= */}
        <section className="section" id="services">
          <div className="container">
            <div className="section-heading">
              <span className="eyebrow">Our Artistry Styles</span>
              <h2>Mehndi for Every Celebration</h2>
              <p>
                From elaborate royal bridal coverage to graceful minimalist designs,
                discover our specialized artistry tailored for your big day.
              </p>
            </div>

            <div className="services-grid">
              {servicesList.map((svc, idx) => (
                <div className="service-card" key={idx}>
                  <div className="service-icon">{svc.icon}</div>
                  <h3>{svc.title}</h3>
                  <p>{svc.desc}</p>
                  <a
                    href="#booking"
                    className="card-action"
                    onClick={() => {
                      setBooking((prev) => ({
                        ...prev,
                        design: svc.styleKey,
                        event: svc.styleKey === 'Bridal' ? 'Bridal' : prev.event
                      }));
                    }}
                  >
                    Book This Style →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= PORTFOLIO / GALLERY ================= */}
        <section className="section portfolio" id="portfolio">
          <div className="container">
            <div className="section-heading">
              <span className="eyebrow">Our Masterpieces</span>
              <h2>Mehndi Design Gallery</h2>
              <p>
                Browse our real bridal work and festive collections. Click any image to view in high definition or book that exact style.
              </p>
            </div>

            <div className="filters" id="galleryFilters">
              <button className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => setActiveFilter('all')}>
                All Designs ({getCategoryCount('all')})
              </button>
              <button className={`filter-btn ${activeFilter === 'bridal' ? 'active' : ''}`} onClick={() => setActiveFilter('bridal')}>
                Bridal ({getCategoryCount('bridal')})
              </button>
              <button className={`filter-btn ${activeFilter === 'arabic' ? 'active' : ''}`} onClick={() => setActiveFilter('arabic')}>
                Arabic ({getCategoryCount('arabic')})
              </button>
              <button className={`filter-btn ${activeFilter === 'rajasthani' ? 'active' : ''}`} onClick={() => setActiveFilter('rajasthani')}>
                Rajasthani ({getCategoryCount('rajasthani')})
              </button>
              <button className={`filter-btn ${activeFilter === 'engagement' ? 'active' : ''}`} onClick={() => setActiveFilter('engagement')}>
                Engagement ({getCategoryCount('engagement')})
              </button>
              <button className={`filter-btn ${activeFilter === 'festival' ? 'active' : ''}`} onClick={() => setActiveFilter('festival')}>
                Festival ({getCategoryCount('festival')})
              </button>
            </div>

            <div className="gallery" id="galleryGrid">
              {filteredGallery.map((item, idx) => {
                const isLarge = item.isLarge || item.is_large;
                const src = getImageSrc(item);
                return (
                  <div
                    key={item.id || idx}
                    className={`gallery-item ${isLarge ? 'large' : ''}`}
                    onClick={() => setLightboxData(item)}
                  >
                    <img src={src} alt={item.title || 'Mehndi Design'} loading="lazy" />
                    <div className="gallery-overlay">
                      <div>
                        <small>{item.categoryLabel || item.category_label || (item.category ? item.category.toUpperCase() : 'MEHNDI')}</small>
                        <span>{item.subtitle || item.title || 'Royal Henna'}</span>
                      </div>
                      <span className="zoom-btn">🔍 View</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= ABOUT ================= */}
        <section className="section about" id="about">
          <div className="container about-grid">
            <div className="about-image">
              <img
                src="https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?auto=format&fit=crop&w=900&q=85"
                alt="Bhuvi applying intricate bridal henna in Udaipur"
                loading="lazy"
              />
              <div className="about-exp-badge">
                <strong>8+</strong>
                <span>Years of Bridal Henna Artistry</span>
              </div>
            </div>

            <div className="about-content">
              <span className="eyebrow">Meet The Artist</span>
              <h2>Where Mewari Tradition Meets Fine Bridal Couture.</h2>
              <p>
                Hello, I am <strong>Bhuvi Prajapat</strong>, the artist behind Bhuvi Mehandi in Udaipur.
                Rooted in the royal city of lakes and palaces, my passion is creating breathtaking henna
                that honors ancient Indian customs while complementing modern bridal elegance.
              </p>
              <p>
                Every bridal design is drawn with patience, pure concentration, and organic Sojat henna freshly
                infused with pure essential oils. Whether you dream of a traditional Marwari Doli-Baraat story
                or contemporary fine-line lace, I am dedicated to making your bridal experience unforgettable.
              </p>

              <ul className="about-list">
                <li>
                  <span>✓</span>
                  <div><strong>Specialized Bridal Storyteller:</strong> Portraits, skylines, and bespoke couple motifs.</div>
                </li>
                <li>
                  <span>✓</span>
                  <div><strong>100% Skin-Safe Organic Henna:</strong> No chemicals, no PPD, only deep natural dark mahogany stain.</div>
                </li>
                <li>
                  <span>✓</span>
                  <div><strong>Destination Wedding Ready:</strong> Experienced in luxury Udaipur resort & palace weddings.</div>
                </li>
                <li>
                  <span>✓</span>
                  <div><strong>Punctual & Dedicated:</strong> Relaxed, attentive application without any rush on your special day.</div>
                </li>
              </ul>

              <a href="#booking" className="btn btn-primary">
                ✦ Book Your Session with Bhuvi
              </a>
            </div>
          </div>
        </section>

        {/* ================= REVIEWS & TESTIMONIALS ================= */}
        <section className="section testimonial" id="reviews">
          <div className="container">
            <div className="section-heading">
              <span className="eyebrow">Real Bride Love</span>
              <h2>Cherished by Brides Across Udaipur</h2>
              <p>
                Read what real brides have to say about their wedding day henna experience with Bhuvi Mehandi.
              </p>
            </div>

            <div className="reviews-grid" id="reviewsGrid">
              {reviews.map((rev, idx) => (
                <div className="testimonial-card" key={idx}>
                  <div className="stars">{'★'.repeat(rev.stars || 5)}</div>
                  <p>"{rev.text || rev.content}"</p>
                  <div className="review-author">
                    <strong>{rev.name || rev.author}</strong>
                    <span>{rev.role}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '36px' }}>
              <button className="btn btn-outline" onClick={() => setIsReviewModalOpen(true)}>
                ✦ Share Your Bride Experience
              </button>
            </div>
          </div>
        </section>

        {/* ================= BOOKING CONCIERGE ================= */}
        <section className="section booking" id="booking">
          <div className="container booking-grid">
            <div className="booking-intro">
              <span className="eyebrow">Book Your Appointment</span>
              <h2>Let's create your dream bridal henna.</h2>
              <p>
                Reserve your date in advance to guarantee availability during wedding season.
                Fill out the form below, and we will instantly connect with you on WhatsApp with
                custom design options and package quotes.
              </p>

              <div className="booking-perks">
                <div className="perk-item">
                  <span className="perk-icon">⚡</span>
                  <div>
                    <strong>Instant WhatsApp Confirmation</strong>
                    <span>Fast quotes & design consultations</span>
                  </div>
                </div>
                <div className="perk-item">
                  <span className="perk-icon">🌿</span>
                  <div>
                    <strong>Complimentary Aftercare Advice</strong>
                    <span>Lemon-sugar spray & balm recipe</span>
                  </div>
                </div>
                <div className="perk-item">
                  <span className="perk-icon">📍</span>
                  <div>
                    <strong>Studio & Doorstep Service</strong>
                    <span>Near MLSU, Udaipur & hotel travel</span>
                  </div>
                </div>
              </div>

              <div className="direct-contact-note">
                <p><strong>Prefer a direct phone call?</strong></p>
                <p>📞 Call Bhuvi: <a href={`tel:${settings.phone?.replace(/\s+/g, '') || '+918094935632'}`} style={{ color: 'var(--gold-light)', textDecoration: 'underline' }}>{settings.phone || '+91 8094935632'}</a></p>
              </div>
            </div>

            <form className="booking-form" id="bookingForm" onSubmit={handleBookingSubmit}>
              <div className="form-header">
                <h3>Appointment Inquiry Form</h3>
                <p>Fill details below to launch booking on WhatsApp</p>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">Your Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    required
                    placeholder="e.g. Radhika Sharma"
                    value={booking.name}
                    onChange={(e) => setBooking({ ...booking, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Mobile Number (10 Digits) *</label>
                  <input
                    type="tel"
                    id="phone"
                    required
                    maxLength={10}
                    pattern="[0-9]{10}"
                    inputMode="numeric"
                    placeholder="Enter 10-digit number"
                    value={booking.phone}
                    onChange={(e) => setBooking({ ...booking, phone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address (Optional)</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="your@email.com"
                    value={booking.email}
                    onChange={(e) => setBooking({ ...booking, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="event">Occasion / Event Type *</label>
                  <select
                    id="event"
                    required
                    value={booking.event}
                    onChange={(e) => setBooking({ ...booking, event: e.target.value })}
                  >
                    <option value="Bridal">Bridal Wedding</option>
                    <option value="Engagement">Engagement / Roka</option>
                    <option value="Baby Shower">Baby Shower / Godh Bharai</option>
                    <option value="Festival">Festival (Karwa Chauth, Teej)</option>
                    <option value="Group / Wedding">Sangeet / Family Group</option>
                    <option value="Function">Special Celebration</option>
                    <option value="Other">Other Occasion</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="date">Preferred Event Date *</label>
                  <input
                    type="date"
                    id="date"
                    required
                    value={booking.date}
                    onChange={(e) => setBooking({ ...booking, date: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="time">Preferred Time Slot</label>
                  <input
                    type="time"
                    id="time"
                    value={booking.time}
                    onChange={(e) => setBooking({ ...booking, time: e.target.value })}
                  />
                </div>

                <div className="form-group form-full">
                  <label htmlFor="venue">Event Venue & City *</label>
                  <input
                    type="text"
                    id="venue"
                    required
                    placeholder="e.g. Hotel / Resort Name, Area, Udaipur"
                    value={booking.venue}
                    onChange={(e) => setBooking({ ...booking, venue: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="people">Estimated People / Guests</label>
                  <input
                    type="number"
                    id="people"
                    min="1"
                    placeholder="e.g. 1 (Bride only) or 10"
                    value={booking.people}
                    onChange={(e) => setBooking({ ...booking, people: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="design">Preferred Design Style</label>
                  <select
                    id="design"
                    value={booking.design}
                    onChange={(e) => setBooking({ ...booking, design: e.target.value })}
                  >
                    <option value="Bridal">Royal Full Bridal</option>
                    <option value="Arabic">Modern Arabic Trail</option>
                    <option value="Rajasthani">Traditional Marwari Bharwa</option>
                    <option value="Designer">Contemporary Geometric / Lace</option>
                    <option value="Engagement">Delicate Mandala / Cuff</option>
                    <option value="Simple">Minimalist / Simple</option>
                    <option value="Not Sure">Need Artist Recommendation</option>
                  </select>
                </div>

                <div className="form-group form-full">
                  <label htmlFor="notes">Special Requests & Story Details</label>
                  <textarea
                    id="notes"
                    placeholder="Mention any custom story motifs (doli, baraat, portraits, initials) or specific requirements..."
                    value={booking.notes}
                    onChange={(e) => setBooking({ ...booking, notes: e.target.value })}
                  ></textarea>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-submit">
                <span>💬 Send Booking Inquiry on WhatsApp</span>
              </button>

              {bookingMessage && (
                <div className="form-message" id="formMessage" style={{ display: 'block' }}>
                  Opening WhatsApp with your appointment details...
                </div>
              )}
            </form>
          </div>
        </section>

        {/* ================= FAQ ================= */}
        <section className="section" id="faq">
          <div className="container">
            <div className="section-heading">
              <span className="eyebrow">Got Questions?</span>
              <h2>Frequently Asked Questions</h2>
              <p>Everything you need to know before booking your bridal henna appointment.</p>
            </div>

            <div className="faq-list">
              {[
                {
                  q: 'How far in advance should I book my wedding date?',
                  a: 'For winter wedding dates (November to February) and auspicious Saya dates, we recommend booking 2 to 4 months in advance to secure your preferred date and time slot. We only take limited brides per day to ensure undivided attention.'
                },
                {
                  q: 'Do you travel for destination weddings outside Udaipur?',
                  a: 'Yes! Bhuvi travels across Rajasthan (Jaipur, Jodhpur, Kumbhalgarh, Nathdwara) and across India for destination weddings. Travel and accommodation arrangements are coordinated transparently during booking.'
                },
                {
                  q: 'How long does a full royal bridal mehndi take?',
                  a: 'A full bridal application (both hands up to elbows, front and back, plus feet up to mid-calf) typically takes 4 to 6 hours depending on the intricacy and portrait details. We take planned mini-breaks so the bride remains comfortable.'
                },
                {
                  q: 'Is your henna 100% natural and safe for sensitive skin?',
                  a: 'Yes, absolutely! We prepare fresh, homemade henna cones using triple-sifted organic Sojat henna powder, eucalyptus oil, tea tree oil, and lemon juice. Zero chemicals, zero black dye, zero PPD. It is 100% skin-safe and produces a deep, rich mahogany color within 48 hours.'
                },
                {
                  q: 'What tips do you give to achieve the darkest stain?',
                  a: 'Keep the henna on for 6 to 8 hours (or overnight). Apply a warm lemon-sugar syrup dab once dry, and scrape off gently without water. Keep hands warm with clove steam or natural balm for the first 24 hours. We provide full complimentary aftercare guidelines!'
                }
              ].map((faq, idx) => (
                <div className={`faq ${activeFaq === idx ? 'active' : ''}`} key={idx}>
                  <button className="faq-question" onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}>
                    <span>{faq.q}</span>
                    <span className="faq-icon">{activeFaq === idx ? '−' : '+'}</span>
                  </button>
                  {activeFaq === idx && (
                    <div className="faq-answer" style={{ display: 'block' }}>
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= CONTACT ================= */}
        <section className="section contact" id="contact">
          <div className="container">
            <div className="section-heading">
              <span className="eyebrow">Direct Contact</span>
              <h2>Let's Discuss Your Mehndi</h2>
              <p>Have an immediate question or want to check date availability? Reach out directly.</p>
            </div>

            <div className="contact-grid">
              <a className="contact-card" href={`tel:${settings.phone?.replace(/\s+/g, '') || '+918094935632'}`}>
                <div className="contact-icon">📞</div>
                <div>
                  <small>Call Direct</small>
                  <strong>{settings.phone || '+91 8094935632'}</strong>
                </div>
              </a>

              <a className="contact-card" href={`https://wa.me/${settings.whatsapp || '918094935632'}?text=Hello%20Bhuvi%20Mehandi,%20I%20would%20like%20to%20inquire%20about%20booking`} target="_blank" rel="noopener">
                <div className="contact-icon">💬</div>
                <div>
                  <small>WhatsApp Chat</small>
                  <strong>+{settings.whatsapp || '918094935632'}</strong>
                </div>
              </a>

              <a className="contact-card" href={`mailto:${settings.email || 'prajapatbhavna2003@gmail.com'}`}>
                <div className="contact-icon">✉️</div>
                <div>
                  <small>Email Inquiries</small>
                  <strong>{settings.email || 'prajapatbhavna2003@gmail.com'}</strong>
                </div>
              </a>

              <div className="contact-card">
                <div className="contact-icon">📍</div>
                <div>
                  <small>Studio Location</small>
                  <strong>{settings.address || 'Near MLSU, Udaipur, Rajasthan'}</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FINAL CTA ================= */}
        <section className="final-cta">
          <div className="container">
            <span className="eyebrow">Your Big Day Deserves Regal Artistry</span>
            <h2>Ready to book your bridal mehndi?</h2>
            <p>
              Dates for the upcoming wedding season fill up quickly.
              Connect with Bhuvi today and let's create something extraordinary together.
            </p>
            <a href="#booking" className="btn btn-primary">
              ✦ Reserve Your Date on WhatsApp
            </a>
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer>
        <div className="container footer-grid">
          <div>
            <h3>Bhuvi Mehandi</h3>
            <p>
              Premier luxury bridal and designer henna artistry based in the royal city of Udaipur, Rajasthan.
              Dedicated to honoring your happiest celebrations with passion and pure organic henna.
            </p>
            <div className="socials">
              <a href={`https://instagram.com/${settings.instagram || 'bhuvi_mehandi_24'}`} target="_blank" rel="noopener" aria-label="Instagram" className="social-instagram" title={`Instagram @${settings.instagram || 'bhuvi_mehandi_24'}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href={`tel:${settings.phone?.replace(/\s+/g, '') || '+918094935632'}`} aria-label="Phone Call" title="Call Direct">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </a>
              <a href={`https://wa.me/${settings.whatsapp || '918094935632'}`} target="_blank" rel="noopener" aria-label="WhatsApp" className="social-whatsapp" title="WhatsApp Chat">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
              </a>
              <a href={`mailto:${settings.email || 'prajapatbhavna2003@gmail.com'}`} aria-label="Email" title="Email Inquiries">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3>Quick Navigation</h3>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#services">Artistry Styles</a></li>
              <li><a href="#portfolio">Design Gallery</a></li>
              <li><a href="#about">About Artist</a></li>
              <li><a href="#reviews">Bride Reviews</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3>Artistry Specialties</h3>
            <ul>
              <li><a href="#services">Royal Bridal Mehndi</a></li>
              <li><a href="#services">Mewari Heritage Bharwa</a></li>
              <li><a href="#services">Arabic Lace & Trails</a></li>
              <li><a href="#services">Engagement Mandalas</a></li>
              <li><a href="#services">Destination Wedding Groups</a></li>
              <li><a href="#services">Custom Couple Portraits</a></li>
            </ul>
          </div>
        </div>

        <div className="container copyright">
          <p>© {new Date().getFullYear()} Bhuvi Mehandi, Udaipur. All Rights Reserved. Crafted with care & love.</p>
          <button className="btn btn-outline" style={{ fontSize: '11px', padding: '4px 10px', marginTop: '10px', opacity: 0.7 }} onClick={() => setIsAdminModalOpen(true)}>
            🔒 Studio CMS Login
          </button>
        </div>
      </footer>

      {/* MOBILE STICKY BOTTOM BAR */}
      <div className="mobile-sticky-bar">
        <a href={`tel:${settings.phone?.replace(/\s+/g, '') || '+918094935632'}`} className="mobile-call-btn" id="mobileCallBtn" aria-label="Call Bhuvi">
          📞 Call
        </a>
        <a href="#booking" className="mobile-book-btn">
          ✦ Book Mehndi
        </a>
      </div>

      {/* ================= LIGHTBOX MODAL ================= */}
      {lightboxData && (
        <div className="lightbox active" onClick={() => setLightboxData(null)} role="dialog" aria-modal="true">
          <button className="close-lightbox" onClick={(e) => { e.stopPropagation(); setLightboxData(null); }} aria-label="Close image">×</button>

          <button className="lightbox-arrow lightbox-prev" onClick={(e) => {
            e.stopPropagation();
            const currentIdx = filteredGallery.findIndex(g => g.id === lightboxData.id);
            const prevIdx = (currentIdx - 1 + filteredGallery.length) % filteredGallery.length;
            setLightboxData(filteredGallery[prevIdx]);
          }} aria-label="Previous image">‹</button>

          <button className="lightbox-arrow lightbox-next" onClick={(e) => {
            e.stopPropagation();
            const currentIdx = filteredGallery.findIndex(g => g.id === lightboxData.id);
            const nextIdx = (currentIdx + 1) % filteredGallery.length;
            setLightboxData(filteredGallery[nextIdx]);
          }} aria-label="Next image">›</button>

          <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
            <img src={getImageSrc(lightboxData)} alt={lightboxData.title || 'Mehndi design preview'} />
            <div className="lightbox-footer">
              <div className="lightbox-caption">{lightboxData.title || 'Royal Bridal Design'}</div>
              <a
                href="#booking"
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setBooking((prev) => ({ ...prev, notes: `Inquiring about design: ${lightboxData.title}` }));
                  setLightboxData(null);
                }}
              >
                ✦ Book This Exact Design
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ================= CLIENT REVIEW MODAL ================= */}
      {isReviewModalOpen && (
        <div className="lightbox active" onClick={() => setIsReviewModalOpen(false)} role="dialog" aria-modal="true">
          <button className="close-lightbox" onClick={(e) => { e.stopPropagation(); setIsReviewModalOpen(false); }} aria-label="Close modal">×</button>
          <div className="lightbox-container review-modal-card" style={{ background: 'var(--white)', padding: 'clamp(22px, 5vw, 34px) clamp(18px, 4vw, 28px)', borderRadius: 'var(--radius-lg)', maxWidth: '520px', width: 'min(94vw, 520px)', textAlign: 'left', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--gold-border)', boxSizing: 'border-box' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--maroon)', fontSize: 'clamp(20px, 4.5vw, 24px)', marginBottom: '6px' }}>✦ Share Your Bride Experience</h3>
            <p style={{ color: 'var(--muted)', fontSize: '13.5px', marginBottom: '20px' }}>We'd love to hear how Bhuvi Mehandi made your royal celebration memorable.</p>

            <form onSubmit={handleReviewSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontWeight: 600, fontSize: '13px', color: 'var(--brown)', display: 'block', marginBottom: '6px' }}>Your Name *</label>
                <input type="text" className="form-control" placeholder="e.g. Priyanka Mehra" required value={newReview.name} onChange={(e) => setNewReview({ ...newReview, name: e.target.value })} style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '16px', fontFamily: 'inherit', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontWeight: 600, fontSize: '13px', color: 'var(--brown)', display: 'block', marginBottom: '6px' }}>Event & Venue / City *</label>
                <input type="text" className="form-control" placeholder="e.g. Royal Bridal • Taj Lake Palace, Udaipur" required value={newReview.role} onChange={(e) => setNewReview({ ...newReview, role: e.target.value })} style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '16px', fontFamily: 'inherit', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontWeight: 600, fontSize: '13px', color: 'var(--brown)', display: 'block', marginBottom: '6px' }}>Star Rating</label>
                <select value={newReview.stars} onChange={(e) => setNewReview({ ...newReview, stars: Number(e.target.value) })} style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '16px', background: '#fff', fontFamily: 'inherit', boxSizing: 'border-box' }}>
                  <option value={5}>★★★★★ (5 Stars - Exceptional)</option>
                  <option value={4}>★★★★☆ (4 Stars - Wonderful)</option>
                  <option value={3}>★★★☆☆ (3 Stars - Good)</option>
                </select>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontWeight: 600, fontSize: '13px', color: 'var(--brown)', display: 'block', marginBottom: '6px' }}>Your Review / Testimonial *</label>
                <textarea rows={4} required placeholder="Write a few lines about the henna design, dark stain, and your experience with Bhuvi..." value={newReview.text} onChange={(e) => setNewReview({ ...newReview, text: e.target.value })} style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '16px', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}></textarea>
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setIsReviewModalOpen(false)} style={{ flex: 1, minWidth: '110px' }}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ flex: 2, minWidth: '160px' }}>✦ Publish Review</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= ADMIN CMS PORTAL MODAL ================= */}
      {isAdminModalOpen && (
        <div className="lightbox active" onClick={() => setIsAdminModalOpen(false)} role="dialog" aria-modal="true">
          <button className="close-lightbox" onClick={(e) => { e.stopPropagation(); setIsAdminModalOpen(false); }} aria-label="Close modal">×</button>
          <div className="lightbox-container" style={{ background: 'var(--white)', padding: '24px', borderRadius: 'var(--radius-lg)', maxWidth: '800px', width: '90vw', maxHeight: '85vh', overflowY: 'auto', border: '1px solid var(--gold-border)' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--maroon)', margin: '0 0 16px 0' }}>👑 Bhuvi Mehandi — Studio Admin CMS</h3>

            {!isAdminLoggedIn ? (
              <form onSubmit={handleAdminLogin}>
                <p style={{ marginBottom: '16px', color: 'var(--muted)' }}>Enter Studio Admin Password to manage inquiries, gallery photos, and prices.</p>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ fontWeight: 600, fontSize: '13px', display: 'block', marginBottom: '6px' }}>Admin Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter password (default: admin123)"
                    value={adminPasswordInput}
                    onChange={(e) => setAdminPasswordInput(e.target.value)}
                    style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  Unlock Admin Portal
                </button>
              </form>
            ) : (
              <div>
                <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '20px' }}>
                  <button className={`filter-btn ${adminTab === 'inquiries' ? 'active' : ''}`} onClick={() => setAdminTab('inquiries')}>
                    📋 Inquiries ({inquiriesList.length})
                  </button>
                  <button className={`filter-btn ${adminTab === 'gallery' ? 'active' : ''}`} onClick={() => setAdminTab('gallery')}>
                    🖼️ Gallery ({gallery.length})
                  </button>
                  <button className={`filter-btn ${adminTab === 'reviews' ? 'active' : ''}`} onClick={() => setAdminTab('reviews')}>
                    ⭐ Reviews ({reviews.length})
                  </button>
                  <button className="btn btn-outline btn-sm" style={{ marginLeft: 'auto' }} onClick={() => setIsAdminLoggedIn(false)}>
                    Lock
                  </button>
                </div>

                {adminTab === 'inquiries' && (
                  <div>
                    <h4>Client Appointment Inquiries</h4>
                    {inquiriesList.length === 0 ? (
                      <p style={{ color: 'var(--muted)', marginTop: '12px' }}>No new inquiries yet.</p>
                    ) : (
                      <div style={{ display: 'grid', gap: '12px', marginTop: '12px' }}>
                        {inquiriesList.map((inq) => (
                          <div key={inq.id} style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '14px', background: 'var(--cream)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                              <strong>{inq.name} ({inq.phone})</strong>
                              <span style={{ padding: '2px 8px', borderRadius: '4px', background: inq.status === 'confirmed' ? '#4A5D4E' : 'var(--maroon)', color: '#fff', fontSize: '12px' }}>
                                {inq.status}
                              </span>
                            </div>
                            <p style={{ fontSize: '13px', margin: '4px 0' }}>📅 {inq.date} | 📍 {inq.venue} | 👥 {inq.people} guests | 🎨 {inq.design}</p>
                            {inq.notes && <p style={{ fontSize: '13px', color: 'var(--muted)' }}>"{inq.notes}"</p>}
                            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                              <a href={`https://wa.me/91${inq.phone}`} target="_blank" rel="noopener" className="btn btn-primary btn-sm">
                                Chat on WhatsApp
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {adminTab === 'gallery' && (
                  <div>
                    <h4>Add New Gallery Design</h4>
                    <form onSubmit={handleAddDesign} style={{ display: 'grid', gap: '10px', margin: '14px 0 24px' }}>
                      <input
                        type="text"
                        placeholder="Design Title (e.g. Royal Bridal Feet Mehndi)"
                        required
                        value={newDesign.title}
                        onChange={(e) => setNewDesign({ ...newDesign, title: e.target.value })}
                        style={{ padding: '10px', border: '1px solid var(--border)', borderRadius: '4px' }}
                      />
                      <input
                        type="url"
                        placeholder="Image URL (Unsplash or Cloud Image URL)"
                        required
                        value={newDesign.image}
                        onChange={(e) => setNewDesign({ ...newDesign, image: e.target.value })}
                        style={{ padding: '10px', border: '1px solid var(--border)', borderRadius: '4px' }}
                      />
                      <select
                        value={newDesign.category}
                        onChange={(e) => setNewDesign({ ...newDesign, category: e.target.value })}
                        style={{ padding: '10px', border: '1px solid var(--border)', borderRadius: '4px' }}
                      >
                        <option value="bridal">Bridal</option>
                        <option value="arabic">Arabic</option>
                        <option value="rajasthani">Rajasthani</option>
                        <option value="engagement">Engagement</option>
                        <option value="festival">Festival</option>
                      </select>
                      <button type="submit" className="btn btn-primary">
                        + Add Design to Gallery
                      </button>
                    </form>

                    <h4>Existing Gallery Designs ({gallery.length})</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px', marginTop: '12px' }}>
                      {gallery.map((g) => (
                        <div key={g.id} style={{ border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden' }}>
                          <img src={getImageSrc(g)} alt={g.title} style={{ width: '100%', height: '110px', objectFit: 'cover' }} />
                          <div style={{ padding: '6px' }}>
                            <p style={{ fontSize: '12px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.title}</p>
                            <button onClick={() => handleDeleteDesign(g.id)} style={{ color: '#c00', fontSize: '11px', border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}>
                              Delete ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {adminTab === 'reviews' && (
                  <div>
                    <h4>Bride Testimonials</h4>
                    <div style={{ display: 'grid', gap: '10px', marginTop: '12px' }}>
                      {reviews.map((r, idx) => (
                        <div key={idx} style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '10px' }}>
                          <strong>{r.name || r.author}</strong> - <span>{r.role}</span>
                          <p style={{ fontSize: '13px', margin: '4px 0' }}>"{r.text || r.content}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= FLOATING WHATSAPP BUTTON ================= */}
      <a
        href={`https://wa.me/${settings.whatsapp || '918094935632'}?text=Hello%20Bhuvi%20Mehandi,%20I%20would%20like%20to%20inquire%20about%20booking%20an%20appointment`}
        className="floating-whatsapp"
        id="floatingWhatsappBtn"
        target="_blank"
        rel="noopener"
        aria-label="Chat with Bhuvi on WhatsApp"
      >
        <svg viewBox="0 0 32 32" fill="currentColor">
          <path d="M16 2a14 14 0 0 0-12 21.2L2 30l7-1.8A14 14 0 1 0 16 2zm0 25.5a11.5 11.5 0 0 1-5.9-1.6l-.4-.3-4.3 1.1 1.2-4.2-.3-.5A11.5 11.5 0 1 1 16 27.5zm6.3-8.6c-.3-.2-2-.9-2.3-1-.3-.2-.5-.2-.7.2s-.8 1-1 1.2-.4.3-.7.1a9.2 9.2 0 0 1-5.1-4.5c-.2-.4 0-.6.1-.8l.5-.6.3-.5a.6.6 0 0 0 0-.6c-.1-.2-.7-1.7-1-2.3-.2-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.9.4 3.7 3.7 0 0 0-1.2 2.8 6.5 6.5 0 0 0 1.4 3.5 14.8 14.8 0 0 0 5.7 5 6.6 6.6 0 0 0 3.2.7 3.4 3.4 0 0 0 2.2-1.6 2.8 2.8 0 0 0 .2-1.6c-.1-.1-.3-.2-.6-.4z"/>
        </svg>
        <span className="wa-tooltip">Chat with Bhuvi</span>
      </a>
    </div>
  );
}

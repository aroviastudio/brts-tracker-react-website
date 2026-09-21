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

          <nav aria-label="Main Navigation" className={mobileMenuOpen ? 'nav-open' : ''}>
            <ul className="nav-links">
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
              ☰
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
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                Instagram
              </a>
              <a href={`https://wa.me/${settings.whatsapp || '918094935632'}`} target="_blank" rel="noopener" aria-label="WhatsApp" className="social-whatsapp" title={`WhatsApp +${settings.whatsapp || '918094935632'}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                WhatsApp
              </a>
            </div>
          </div>

          <div>
            <h4>Artistry Styles</h4>
            <ul className="footer-links">
              <li><a href="#services">Royal Bridal Mehndi</a></li>
              <li><a href="#services">Modern Arabic Henna</a></li>
              <li><a href="#services">Traditional Rajasthani</a></li>
              <li><a href="#services">Contemporary Designer</a></li>
              <li><a href="#services">Sangeet & Group Events</a></li>
            </ul>
          </div>

          <div>
            <h4>Navigation</h4>
            <ul className="footer-links">
              <li><a href="#home">Home</a></li>
              <li><a href="#portfolio">Design Gallery</a></li>
              <li><a href="#about">About Bhuvi</a></li>
              <li><a href="#reviews">Bride Reviews</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#booking">Book Appointment</a></li>
            </ul>
          </div>

          <div>
            <h4>Studio & Booking</h4>
            <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: 1.7, marginBottom: '14px' }}>
              📍 Near MLSU Campus, Udaipur, Rajasthan<br />
              📞 <a href={`tel:${settings.phone?.replace(/\s+/g, '') || '+918094935632'}`} style={{ color: 'var(--gold-deep)' }}>{settings.phone || '+91 8094935632'}</a><br />
              ✉️ <a href={`mailto:${settings.email || 'prajapatbhavna2003@gmail.com'}`} style={{ color: 'var(--gold-deep)' }}>{settings.email || 'prajapatbhavna2003@gmail.com'}</a>
            </p>
            <button className="btn btn-outline" style={{ fontSize: '12px', padding: '6px 14px' }} onClick={() => setIsAdminModalOpen(true)}>
              🔒 Studio CMS Login
            </button>
          </div>
        </div>

        <div className="container footer-bottom">
          <p>© {new Date().getFullYear()} Bhuvi Mehandi. All Rights Reserved. Crafted for Royal Brides.</p>
        </div>
      </footer>

      {/* ================= LIGHTBOX MODAL ================= */}
      {lightboxData && (
        <div className="lightbox active" onClick={() => setLightboxData(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightboxData(null)}>✕</button>
            <img src={getImageSrc(lightboxData)} alt={lightboxData.title} />
            <div className="lightbox-caption">
              <h3>{lightboxData.title}</h3>
              <p>{lightboxData.categoryLabel || lightboxData.category}</p>
              <a
                href="#booking"
                className="btn btn-primary"
                style={{ marginTop: '12px', display: 'inline-block' }}
                onClick={() => {
                  setBooking((prev) => ({ ...prev, notes: `Inquiring about design: ${lightboxData.title}` }));
                  setLightboxData(null);
                }}
              >
                Book This Exact Design →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ================= REVIEW SUBMISSION MODAL ================= */}
      {isReviewModalOpen && (
        <div className="modal-overlay active" onClick={() => setIsReviewModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>✦ Share Your Bridal Experience</h3>
              <button className="modal-close" onClick={() => setIsReviewModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleReviewSubmit} className="modal-form">
              <div className="form-group">
                <label>Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Radhika Mehta"
                  value={newReview.name}
                  onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Wedding Role / Location *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bride • The Leela Palace, Udaipur"
                  value={newReview.role}
                  onChange={(e) => setNewReview({ ...newReview, role: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Rating (Stars)</label>
                <select
                  value={newReview.stars}
                  onChange={(e) => setNewReview({ ...newReview, stars: Number(e.target.value) })}
                >
                  <option value={5}>★★★★★ (5 Stars - Outstanding)</option>
                  <option value={4}>★★★★☆ (4 Stars - Great)</option>
                  <option value={3}>★★★☆☆ (3 Stars - Good)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Your Testimonial Review *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your henna experience with Bhuvi, the stain darkness, punctuality, and guest feedback..."
                  value={newReview.text}
                  onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                Publish Bride Review
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= ADMIN CMS PORTAL MODAL ================= */}
      {isAdminModalOpen && (
        <div className="modal-overlay active" onClick={() => setIsAdminModalOpen(false)}>
          <div className="modal-content admin-modal-container" style={{ maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>👑 Bhuvi Mehandi — Studio Admin CMS</h3>
              <button className="modal-close" onClick={() => setIsAdminModalOpen(false)}>✕</button>
            </div>

            {!isAdminLoggedIn ? (
              <form onSubmit={handleAdminLogin} style={{ padding: '24px' }}>
                <p style={{ marginBottom: '16px', color: 'var(--muted)' }}>Enter Studio Admin Password to manage inquiries, gallery photos, and prices.</p>
                <div className="form-group">
                  <label>Admin Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter password (default: admin123)"
                    value={adminPasswordInput}
                    onChange={(e) => setAdminPasswordInput(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }}>
                  Unlock Admin Portal
                </button>
              </form>
            ) : (
              <div style={{ padding: '20px' }}>
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
                  <button className="btn btn-outline" style={{ marginLeft: 'auto' }} onClick={() => setIsAdminLoggedIn(false)}>
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
                              <a href={`https://wa.me/91${inq.phone}`} target="_blank" rel="noopener" className="btn btn-primary" style={{ fontSize: '12px', padding: '4px 8px' }}>
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
                      />
                      <input
                        type="url"
                        placeholder="Image URL (Unsplash or Cloud Image URL)"
                        required
                        value={newDesign.image}
                        onChange={(e) => setNewDesign({ ...newDesign, image: e.target.value })}
                      />
                      <select
                        value={newDesign.category}
                        onChange={(e) => setNewDesign({ ...newDesign, category: e.target.value })}
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
        href={`https://wa.me/${settings.whatsapp || '918094935632'}?text=Hello%20Bhuvi%20Mehandi,%20I%20would%20like%20to%20inquire%20about%20booking`}
        className="floating-whatsapp"
        target="_blank"
        rel="noopener"
        aria-label="Chat with Bhuvi on WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
        <span className="wa-tooltip">Chat with Bhuvi on WhatsApp</span>
      </a>
    </div>
  );
}

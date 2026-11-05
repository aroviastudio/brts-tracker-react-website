import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import MicroSlats from './MicroSlats';
import { soundManager } from './whatsapp/audioService';
import { 
  Send, 
  Sparkles, 
  MapPin, 
  Phone, 
  Calendar, 
  CheckCircle2, 
  Bot,
  ChevronDown
} from 'lucide-react';
import './BusinessChatbot.css';

// 5 Verified Target Leads with complete real datasets
export const BUSINESS_REGISTRY = {
  'global-dental': {
    id: 'global-dental',
    name: 'Global Dental Clinic & Implant Center',
    shortName: 'Global Dental Clinic',
    doctor: 'Prof. Dr. Aatman Joshipura, MDS / Dr. Rohan Mehta',
    category: 'Multispecialty Dental Care',
    city: 'Ahmedabad',
    phone: '+919409118811',
    cleanPhone: '919409118811',
    avatarText: 'GD',
    address: '304, Titanium City Centre, Prahlad Nagar, Ahmedabad',
    timings: 'Mon – Sat: 9:30 AM – 8:00 PM',
    prompts: [
      { label: 'Book Appointment', icon: Calendar, query: 'I want to book an appointment with Dr. Joshipura' },
      { label: 'Dental Implants Pricing', icon: Sparkles, query: 'What are your Dental Implants options and pricing?' },
      { label: 'Clear Aligners & Braces', icon: Sparkles, query: 'Tell me about Invisalign & Clear Aligners' },
      { label: 'Clinic Location & Timings', icon: MapPin, query: 'Where is your clinic located and what are your timings?' }
    ],
    welcomeMessage: `Hello! 👋 Welcome to **Global Dental Clinic & Implant Center** (Ahmedabad).\n\nI am your 24/7 AI Receptionist. I can help you check treatment pricing, book an appointment with **Dr. Joshipura**, or find directions to our clinic.\n\nHow can I help you today?`
  },

  'detailing-mafia': {
    id: 'detailing-mafia',
    name: 'The Detailing Mafia (HRBR Layout)',
    shortName: 'The Detailing Mafia',
    doctor: 'Vinay Kumar (Lead Auto Surface Specialist)',
    category: 'Automotive Ceramic & PPF Detailing',
    city: 'Bangalore',
    phone: '+917483878205',
    cleanPhone: '917483878205',
    avatarText: 'DM',
    address: '3rd Block, 100 Feet Road, HRBR Layout, Kalyan Nagar, Bangalore',
    timings: 'Mon – Sun: 9:00 AM – 8:30 PM (7 Days Open)',
    prompts: [
      { label: 'Book Bay Slot', icon: Calendar, query: 'I want to book an inspection and detailing slot for my car' },
      { label: 'Ceramic Coating Cost', icon: Sparkles, query: 'What are your 9H Ceramic Shield packages and prices?' },
      { label: 'TPU Paint Protection Film', icon: Sparkles, query: 'How much does TPU Self-Healing PPF cost?' },
      { label: 'Studio Location & Hours', icon: MapPin, query: 'Where is your HRBR Layout studio located?' }
    ],
    welcomeMessage: `Hello! 🚗 Welcome to **The Detailing Mafia (HRBR Layout, Bangalore)**.\n\nI am your 24/7 AI Assistant. I can quote you exact pricing for **9H/10H Ceramic Coating**, **Self-Healing PPF**, or book an inspection bay for your car.\n\nWhich vehicle do you drive?`
  },

  'clear-skin': {
    id: 'clear-skin',
    name: 'Clear Skin Clinic',
    shortName: 'Clear Skin Clinic',
    doctor: 'Dr. Ananya Kulkarni, MD Dermatology',
    category: 'Aesthetic Dermatology & Lasers',
    city: 'Pune',
    phone: '+919584584111',
    cleanPhone: '9584584111',
    avatarText: 'CS',
    address: '201, Fortaleza Commercial Complex, Kalyani Nagar, Pune',
    timings: 'Mon – Sat: 10:00 AM – 8:00 PM',
    prompts: [
      { label: 'Book Doctor Consultation', icon: Calendar, query: 'I want to book a skin consultation with Dr. Ananya Kulkarni' },
      { label: 'Laser Hair Reduction', icon: Sparkles, query: 'What are your US-FDA Laser Hair Reduction packages?' },
      { label: 'HydraFacial MD Price', icon: Sparkles, query: 'How much is HydraFacial MD medical glow treatment?' },
      { label: 'Acne Scar MN-RF', icon: Sparkles, query: 'What treatments do you have for acne scars and pigmentation?' }
    ],
    welcomeMessage: `Hello! 🌸 Welcome to **Clear Skin Clinic** (Pune).\n\nI am your 24/7 AI Assistant for **Dr. Ananya Kulkarni**'s dermatology practice. Ask me about laser hair removal, HydraFacial MD, acne scar treatments, or booking an appointment.\n\nHow may I help your skin today?`
  },

  'daffodils-patisserie': {
    id: 'daffodils-patisserie',
    name: 'Daffodils Patisserie',
    shortName: 'Daffodils Patisserie',
    doctor: 'Chef Natasha D’Souza (Le Cordon Bleu Paris)',
    category: 'Bespoke Custom Cakes & Patisserie',
    city: 'Mumbai',
    phone: '+919867300454',
    cleanPhone: '9867300454',
    avatarText: 'DP',
    address: 'Shop 4, Pali Naka, Bandra West, Mumbai',
    timings: 'Mon – Sun: 10:00 AM – 11:00 PM',
    prompts: [
      { label: 'Order Custom Cake', icon: Calendar, query: 'I want to order a custom tiered celebration cake' },
      { label: 'Cake Menu & Prices', icon: Sparkles, query: 'What cake flavours and per-kg prices do you have?' },
      { label: 'Biscoff & Cheesecakes', icon: Sparkles, query: 'Tell me about your Lotus Biscoff cheesecake & Belgian Truffle' },
      { label: 'Delivery & Advance Notice', icon: MapPin, query: 'What is your delivery coverage in Mumbai and lead time?' }
    ],
    welcomeMessage: `Hello! 🎂 Welcome to **Daffodils Patisserie** (Bandra, Mumbai).\n\nI am your 24/7 Cake Concierge! Looking for custom wedding tiered cakes, Belgian chocolate truffles, or gourmet cheesecake delivery? Tell me your event date or flavor preference!`
  },

  'tuskers-dental': {
    id: 'tuskers-dental',
    name: 'Tuskers Multispeciality Dental Clinic',
    shortName: 'Tuskers Dental Clinic',
    doctor: 'Dr. Hardik Shah, MDS Orthodontics',
    category: 'Dental & Oral Healthcare',
    city: 'Ahmedabad',
    phone: '+918000097970',
    cleanPhone: '918000097970',
    avatarText: 'TD',
    address: 'Near Pakwan Cross Roads, Bodakdev, SG Highway, Ahmedabad',
    timings: 'Mon – Sat: 9:30 AM – 8:30 PM | Sun: 10 AM – 1 PM',
    prompts: [
      { label: 'Book Appointment', icon: Calendar, query: 'I want to book an appointment with Dr. Hardik Shah' },
      { label: 'Painless Root Canal', icon: Sparkles, query: 'What are your Root Canal (RCT) charges and procedure?' },
      { label: 'Invisible Braces', icon: Sparkles, query: 'How much do Invisible Braces and veneers cost?' },
      { label: 'Clinic Address & SG Hwy', icon: MapPin, query: 'Where is Tuskers Dental located on SG Highway?' }
    ],
    welcomeMessage: `Hello! 👋 Welcome to **Tuskers Multispeciality Dental Clinic** (Bodakdev, Ahmedabad).\n\nI am your 24/7 AI Receptionist. I can assist with consultation bookings with **Dr. Hardik Shah**, painless root canals, or teeth alignment pricing.\n\nHow can we care for your smile today?`
  }
};

export default function BusinessChatbot() {
  // Read active business from query param `?b=<id>` or fallback to 'global-dental'
  const [activeBusinessId, setActiveBusinessId] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const b = params.get('b') || params.get('lead');
      if (b && BUSINESS_REGISTRY[b]) return b;
    }
    return 'global-dental';
  });

  const business = useMemo(() => {
    return BUSINESS_REGISTRY[activeBusinessId] || BUSINESS_REGISTRY['global-dental'];
  }, [activeBusinessId]);

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSelector, setShowSelector] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatScrollContainerRef = useRef(null);

  // Initialize messages on business change
  useEffect(() => {
    setMessages([
      {
        id: 'welcome-' + activeBusinessId,
        sender: 'bot',
        text: business.welcomeMessage,
        time: 'Just now'
      }
    ]);
  }, [activeBusinessId, business.welcomeMessage]);

  const scrollToBottom = useCallback((behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior, block: 'end' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const switchBusiness = (newId) => {
    setActiveBusinessId(newId);
    setShowSelector(false);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('b', newId);
      window.history.pushState({}, '', url.toString());
    }
  };

  const handleSend = useCallback(async (textToSend) => {
    const messageText = (textToSend || inputValue).trim();
    if (!messageText) return;

    const userMsg = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    try { soundManager.playSent?.(); } catch (e) {}

    setIsTyping(true);

    let botReplyText = '';
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: messageText,
          businessId: activeBusinessId,
          history: messages.slice(-4).map(m => ({ role: m.sender, content: m.text }))
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.reply) {
          botReplyText = data.reply;
        }
      }
    } catch (err) {
      console.log('Error reaching backend:', err);
    }

    if (!botReplyText) {
      botReplyText = `Thank you for contacting *${business.name}*!\n\nOur team in ${business.city} is available at *${business.phone}*.\n\nWe specialize in ${business.category}. Would you like to schedule an appointment or request details on our key services?`;
    }

    const replyDelay = Math.min(1100, 500 + messageText.length * 8);
    setTimeout(() => {
      const botMsg = {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        text: botReplyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
      try { soundManager.playReceived?.(); } catch (e) {}
    }, replyDelay);
  }, [inputValue, messages, activeBusinessId, business]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputFocus = () => {
    setTimeout(() => {
      scrollToBottom('smooth');
    }, 300);
  };

  return (
    <div className="chatbot-root">
      {/* Background Interactive MicroSlats in Brand Orange */}
      <div className="chatbot-bg-layer" aria-hidden="true">
        <MicroSlats
          preset="tide"
          color="#ed680b"
          glintColor="#ffffff"
          backgroundColor="#000000"
          slatWidth={10}
          slatHeight={25}
          gap={3}
          roundness={0.75}
          interactive
          cursorStrength={1}
          cursorSize={40}
          swirl={0}
          trail={1.4}
          lean={0}
          intro
          scale={1.3}
          speed={0.5}
          direction={262}
          chop={0.2}
          stretch={0.12}
          glint={0.45}
          contrast={1.1}
          perspective={0.5}
          fog={0.4}
        />
      </div>

      {/* Main Foreground Container */}
      <div className="chatbot-viewport-wrapper">
        <div className="chatbot-panel">

          {/* Business Header with Lead Switcher */}
          <header className="chatbot-header">
            <div className="header-brand">
              <div className="clinic-avatar">
                <span className="avatar-initials">{business.avatarText}</span>
                <span className="online-indicator" title="Online & ready"></span>
              </div>
              <div className="clinic-details">
                <div className="clinic-title-row">
                  <h1 className="clinic-name">{business.shortName}</h1>
                  <span className="verified-badge" title="Verified Business">
                    <CheckCircle2 size={15} />
                  </span>
                </div>
                <p className="clinic-subtitle">
                  {business.doctor} • {business.city}
                </p>
              </div>
            </div>

            <div className="header-meta">
              {/* Quick Switch Dropdown for Demoing all 5 leads */}
              <div className="lead-switcher-container">
                <button 
                  type="button" 
                  className="lead-switcher-btn"
                  onClick={() => setShowSelector(prev => !prev)}
                  title="Switch between 5 client demos"
                >
                  <span>Switch Lead</span>
                  <ChevronDown size={14} />
                </button>

                {showSelector && (
                  <div className="lead-switcher-dropdown">
                    <div className="dropdown-title">Select Client Demo:</div>
                    {Object.values(BUSINESS_REGISTRY).map(b => (
                      <button
                        key={b.id}
                        type="button"
                        className={`dropdown-item ${b.id === activeBusinessId ? 'active' : ''}`}
                        onClick={() => switchBusiness(b.id)}
                      >
                        <span className="item-name">{b.name}</span>
                        <span className="item-city">{b.city} • {b.category}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <a href={`tel:${business.phone}`} className="clinic-phone-pill" title="Call directly">
                <Phone size={13} />
                <span>{business.phone}</span>
              </a>
            </div>
          </header>

          {/* Chat Messages Stream */}
          <div className="chat-messages-container" ref={chatScrollContainerRef}>
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`chat-bubble-row ${msg.sender === 'user' ? 'bubble-user' : 'bubble-bot'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="bot-msg-avatar">
                    <Bot size={16} />
                  </div>
                )}
                <div className="bubble-card">
                  <div className="bubble-content">
                    {msg.text.split('\n').map((line, idx) => {
                      if (!line.trim()) return <div key={idx} className="bubble-spacer" />;
                      
                      const formatted = line.split(/(\*\*.*?\*\*|\*.*?\*)/g).map((part, pIdx) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return <strong key={pIdx}>{part.slice(2, -2)}</strong>;
                        }
                        if (part.startsWith('*') && part.endsWith('*')) {
                          return <strong key={pIdx}>{part.slice(1, -1)}</strong>;
                        }
                        return part;
                      });

                      return <p key={idx} className="bubble-line">{formatted}</p>;
                    })}
                  </div>
                  <span className="bubble-time">{msg.time}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="chat-bubble-row bubble-bot">
                <div className="bot-msg-avatar">
                  <Bot size={16} />
                </div>
                <div className="bubble-card typing-bubble">
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Official WhatsApp Quick Action Suggestion Chips for the active business */}
          <div className="quick-chips-wrapper">
            <div className="quick-chips-scroll">
              {business.prompts.map((prompt, idx) => {
                const IconComponent = prompt.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    className="quick-chip"
                    onClick={() => handleSend(prompt.query)}
                  >
                    <IconComponent size={14} className="chip-icon" />
                    <span>{prompt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chat Input Bar */}
          <div className="chat-input-container">
            <form 
              className="chat-input-form" 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            >
              <input
                ref={inputRef}
                type="text"
                className="chat-text-input"
                placeholder={`Ask about ${business.shortName} services, pricing, or bookings...`}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={handleInputFocus}
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
              />
              <button
                type="submit"
                className={`chat-send-btn ${inputValue.trim() ? 'btn-active' : ''}`}
                disabled={!inputValue.trim()}
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

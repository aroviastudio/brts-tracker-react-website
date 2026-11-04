import React, { useState, useRef, useEffect, useCallback } from 'react';
import MicroSlats from './MicroSlats';
import { soundManager } from './whatsapp/audioService';
import { 
  Send, 
  Sparkles, 
  MessageSquare, 
  Clock, 
  MapPin, 
  Phone, 
  Calendar, 
  CheckCircle2, 
  Bot,
  User,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import './BusinessChatbot.css';

const CLINIC_INFO = {
  name: 'Global Dental Clinic & Implant Center',
  city: 'Prahlad Nagar, Ahmedabad',
  doctor: 'Dr. Rohan Mehta, MDS',
  specialty: 'Implantology & Digital Smile Design',
  phone: '+91 94091 18811',
  timings: 'Mon – Sat: 9:30 AM – 8:30 PM | Sun: 10:00 AM – 1:00 PM',
  address: '304, Titanium City Centre, Prahlad Nagar, Ahmedabad 380015'
};

const QUICK_PROMPTS = [
  { label: 'Book Appointment', icon: Calendar, query: 'Book an appointment' },
  { label: 'Services & Pricing', icon: Sparkles, query: 'What are your dental services and pricing?' },
  { label: 'Clinic Address & Timings', icon: MapPin, query: 'Where is the clinic located and what are your timings?' },
  { label: 'Emergency Toothache', icon: Phone, query: 'I have severe dental pain. What should I do?' }
];

function getBotReply(userText) {
  const t = userText.toLowerCase();

  if (t.includes('book') || t.includes('appointment') || t.includes('slot') || t.includes('consult')) {
    return `Dr. Rohan Mehta and our team are available for appointments:\n\n📅 **Operating Hours**:\n• Monday – Saturday: 9:30 AM – 8:30 PM\n• Sunday: 10:00 AM – 1:00 PM\n\n💬 What day and approximate time works best for you? Reply with your preferred slot, or call **${CLINIC_INFO.phone}** to book instantly.`;
  }

  if (t.includes('price') || t.includes('cost') || t.includes('service') || t.includes('treatment') || t.includes('implant') || t.includes('rct') || t.includes('root canal') || t.includes('whitening') || t.includes('aligner')) {
    return `Here is our transparent pricing for our most popular procedures:\n\n✨ **Dental Implants (Titanium & Zirconia)**: From ₹22,000\n✨ **Laser Teeth Whitening (Single Session)**: ₹6,500\n✨ **Root Canal (Microscope-Assisted Single Sitting)**: ₹4,500\n✨ **Clear Invisible Aligners (Free 3D Scan)**: ₹45,000 – ₹95,000\n✨ **Emergency Consultation**: ₹500\n\nAll treatments use German sterilization protocols and 3D digital imaging. Would you like to schedule a consultation for any of these?`;
  }

  if (t.includes('address') || t.includes('location') || t.includes('where') || t.includes('timing') || t.includes('hours') || t.includes('open')) {
    return `📍 **Global Dental Clinic & Implant Center**\n${CLINIC_INFO.address}\n\n🕒 **Consultation Hours**:\n• Monday to Saturday: 9:30 AM – 8:30 PM\n• Sunday: 10:00 AM – 1:00 PM\n\n🚗 Dedicated patient parking is available at Titanium City Centre with lift access directly to the 3rd floor.`;
  }

  if (t.includes('emergency') || t.includes('pain') || t.includes('ache') || t.includes('broken') || t.includes('bleed') || t.includes('urgent')) {
    return `🚨 **Emergency Dental Support**\n\nIf you have acute pain, swelling, or a broken tooth:\n1. Rinse with lukewarm salt water (avoid hot/cold temperatures).\n2. Do NOT apply aspirin directly to the gum.\n3. Call or WhatsApp our on-duty clinic line right now:\n📞 **${CLINIC_INFO.phone}**\n\nWe prioritize emergency toothache cases with same-day walk-in slots.`;
  }

  return `Thank you for reaching out to **${CLINIC_INFO.name}**!\n\nOur team specializes in painless root canals, dental implants, and invisible aligners led by **${CLINIC_INFO.doctor}**.\n\nYou can ask about:\n• Booking an appointment\n• Treatment costs & options\n• Clinic directions & timings\n• Emergency assistance\n\nHow may we assist your smile today?`;
}

export default function BusinessChatbot() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: `Hello! 👋 Welcome to **Global Dental Clinic & Implant Center** (Ahmedabad).\n\nI am your 24/7 AI Receptionist. I can help you check treatment pricing, book an appointment with **Dr. Rohan Mehta**, or provide emergency dental guidance.\n\nHow can I help you today?`,
      time: 'Just now'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatScrollContainerRef = useRef(null);

  const scrollToBottom = useCallback((behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior, block: 'end' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const handleSend = useCallback((textToSend) => {
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

    const replyDelay = Math.min(1300, 700 + messageText.length * 15);
    setTimeout(() => {
      const reply = getBotReply(messageText);
      const botMsg = {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
      try { soundManager.playReceived?.(); } catch (e) {}
    }, replyDelay);
  }, [inputValue]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputFocus = () => {
    // Smoothly ensure input and latest message remain visible when mobile keyboard opens
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
          
          {/* Top WhatsApp Transition Pitch Banner */}
          <div className="whatsapp-banner">
            <div className="whatsapp-banner-content">
              <span className="whatsapp-pill-badge">
                <span className="pulse-dot"></span>
                Official WhatsApp Engine Ready
              </span>
              <p className="whatsapp-banner-text">
                <strong>Live AI Demo</strong>: This exact conversational agent, real-time booking, & instant pricing logic deploys directly to your official WhatsApp Business number upon completion.
              </p>
            </div>
          </div>

          {/* Business Header */}
          <header className="chatbot-header">
            <div className="header-brand">
              <div className="clinic-avatar">
                <span className="avatar-initials">GD</span>
                <span className="online-indicator" title="Online & ready"></span>
              </div>
              <div className="clinic-details">
                <div className="clinic-title-row">
                  <h1 className="clinic-name">{CLINIC_INFO.name}</h1>
                  <span className="verified-badge" title="Verified Medical Lead">
                    <CheckCircle2 size={15} />
                  </span>
                </div>
                <p className="clinic-subtitle">
                  {CLINIC_INFO.doctor} • {CLINIC_INFO.city}
                </p>
              </div>
            </div>

            <div className="header-meta">
              <span className="clinic-phone-pill">
                <Phone size={13} />
                <span>{CLINIC_INFO.phone}</span>
              </span>
            </div>
          </header>

          {/* Chat Messages Stream */}
          <div className="chat-messages-container" ref={chatScrollContainerRef}>
            <div className="security-notice">
              <ShieldCheck size={14} />
              <span>Direct Clinic Inquiry • Instant 24/7 AI Availability</span>
            </div>

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
                      
                      // Simple markdown-style bold formatter
                      const formatted = line.split(/(\*\*.*?\*\*)/g).map((part, pIdx) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return <strong key={pIdx}>{part.slice(2, -2)}</strong>;
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

          {/* Quick Action Suggestion Chips */}
          <div className="quick-chips-wrapper">
            <div className="quick-chips-scroll">
              {QUICK_PROMPTS.map((prompt, idx) => {
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

          {/* Chat Input Bar - Designed for zero keyboard layout breakage */}
          <div className="chat-input-container">
            <form 
              className="chat-input-form" 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            >
              <input
                ref={inputRef}
                type="text"
                className="chat-text-input"
                placeholder="Type a message or dental query..."
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

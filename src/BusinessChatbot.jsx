import React, { useState, useRef, useEffect, useCallback } from 'react';
import MicroSlats from './MicroSlats';
import { soundManager } from './whatsapp/audioService';
import { 
  Send, 
  Sparkles, 
  MapPin, 
  Phone, 
  Calendar, 
  CheckCircle2, 
  Bot 
} from 'lucide-react';
import './BusinessChatbot.css';

// Real Verified Clinic Data from official website (drjoshipura.com)
const CLINIC_INFO = {
  name: 'Global Dental Clinic & Implant Centre',
  city: 'Bodakdev & C.G. Road, Ahmedabad',
  doctor: 'Prof. Dr. Aatman Joshipura, MDS',
  specialty: 'Orthodontist & Smile Architect (Nobel Biocare Certified)',
  phone: '+91 94091 18811',
  timings: 'Mon – Sat: 9:30 AM – 1:00 PM & 4:30 PM – 8:00 PM',
  branches: [
    {
      name: 'Sindhubhavan Road (Bodakdev)',
      address: '208, Shilp Satved, Opp Mango Restaurant, Beside Sindhubhavan Temple, Bodakdev, Ahmedabad'
    },
    {
      name: 'C.G. Road Branch',
      address: '311, Balaji Heights, Bodyline Cross Road, near IDBI Bank, Lal Bungalow, C.G. Road, Ahmedabad 380006'
    }
  ]
};

const QUICK_PROMPTS = [
  { label: 'Book Appointment', icon: Calendar, query: 'I want to book an appointment with Dr. Aatman Joshipura' },
  { label: 'Dental Implants (Swiss)', icon: Sparkles, query: 'Tell me about Dental Implants and pricing at Global Dental Clinic' },
  { label: 'Invisalign & Braces', icon: Sparkles, query: 'What are your Clear Aligners and Invisalign options?' },
  { label: 'Clinic Locations & Hours', icon: MapPin, query: 'Where are your two Ahmedabad clinic branches located and what are your timings?' },
  { label: 'Emergency Tooth Pain', icon: Phone, query: 'I have severe dental pain. What should I do right now?' }
];

function getLocalClinicReply(userText) {
  const t = (userText || '').toLowerCase().trim();

  if (t.includes('book') || t.includes('appointment') || t.includes('slot') || t.includes('visit') || t.includes('consult')) {
    return `Prof. Dr. Aatman Joshipura and our specialist dental team are available across our two Ahmedabad branches:\n\n📅 **Consultation Hours**:\n• Morning Session: 09:30 AM – 01:00 PM\n• Evening Session: 04:30 PM – 08:00 PM\n*(Monday to Saturday)*\n\nWhich branch is most convenient for you?\n1. **Sindhubhavan Road (Bodakdev)**\n2. **C.G. Road (Navrangpura)**\n\nReply with your preferred date and time, or call **${CLINIC_INFO.phone}** to reserve immediately.`;
  }

  if (t.includes('address') || t.includes('location') || t.includes('where') || t.includes('branch') || t.includes('timing') || t.includes('hours')) {
    return `📍 **Global Dental Clinic & Implant Centre Locations**:\n\n1️⃣ **Bodakdev Branch**:\n208, Shilp Satved, Opp Mango Restaurant, Beside Sindhubhavan Temple, Bodakdev, Ahmedabad.\n\n2️⃣ **C.G. Road Branch**:\n311, Balaji Heights, Bodyline Cross Road, near IDBI Bank, Lal Bungalow, C.G. Road, Ahmedabad 380006.\n\n🕒 **Hours**: Mon – Sat: 9:30 AM – 1:00 PM & 4:30 PM – 8:00 PM.\n📞 Direct Line: **${CLINIC_INFO.phone}**`;
  }

  if (t.includes('implant') || t.includes('missing') || t.includes('teeth replace')) {
    return `✨ **Dental Implants at Global Dental Clinic**\n\nWe are an internationally trained implantology surgical team doing daily implant surgeries with one of the highest success rates in Gujarat.\n\n• **Certified Systems**: Nobel Biocare (Switzerland), Hiossen & DensahR osseodensification.\n• **Single-Day Implants** & All-on-4 / All-on-6 full mouth rehabilitation.\n• Starting from ₹22,000 depending on bone density and implant brand.\n\nWould you like to schedule an implant consultation with Dr. Joshipura?`;
  }

  if (t.includes('brace') || t.includes('aligner') || t.includes('invisalign') || t.includes('straight') || t.includes('gap')) {
    return `✨ **Orthodontics & Clear Aligners**\n\n**Prof. Dr. Aatman Joshipura** is an MDS Orthodontist and recognized smile architect.\n\n• **Invisalign & Clear Aligners**: 100% digital 3D intraoral scans (3Shape).\n• **Ultramodern Low-Friction Braces**: High-speed, gentle and comfortable tooth movement.\n• **Ceramic Aesthetic Braces**: Tooth-colored, discreet brackets.\n\nWould you like to book a 3D digital smile scan?`;
  }

  if (t.includes('rct') || t.includes('root canal') || t.includes('toothache') || t.includes('pain') || t.includes('emergency')) {
    return `🚨 **Emergency Dental & Root Canal Care**\n\nWe provide **Single-Sitting Microscope-Assisted Root Canal (RCT)** designed for immediate pain relief in a single 45-minute visit.\n\nIf you have acute pain, swelling, or a broken tooth:\n📞 Call or WhatsApp our priority emergency desk immediately at **${CLINIC_INFO.phone}** for a walk-in slot.`;
  }

  if (t.includes('price') || t.includes('cost') || t.includes('fee') || t.includes('package')) {
    return `Here is our transparent fee overview:\n\n• **Consultation & Diagnostic X-Ray**: ₹500\n• **Dental Implants**: From ₹22,000 (Swiss/US systems)\n• **Single-Sitting Root Canal**: From ₹4,500\n• **Laser Teeth Whitening**: ₹6,500 (Single-session instant brightness)\n• **Clear Aligners**: Custom digital package based on 3D scan\n\nAll treatments follow strict hospital-grade sterilization. Would you like to schedule an assessment?`;
  }

  return `Welcome to **${CLINIC_INFO.name}**!\n\nLed by **${CLINIC_INFO.doctor}**, we combine 10+ years of modern clinical dentistry with cutting-edge technology across our Bodakdev & C.G. Road branches.\n\nYou can ask about:\n• Booking an appointment with Dr. Joshipura\n• Dental Implants (Nobel Biocare Switzerland)\n• Invisalign & Clear Aligners\n• Clinic directions, timings, & pricing\n\nHow may we help your smile today?`;
}

export default function BusinessChatbot() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: `Hello! 👋 Welcome to **Global Dental Clinic & Implant Centre** (Ahmedabad).\n\nI am your 24/7 AI Receptionist for **Prof. Dr. Aatman Joshipura**'s clinic. I can help you book appointments, review treatment pricing, or find directions to our **Bodakdev** & **C.G. Road** branches.\n\nHow can I help you today?`,
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

    // Call serverless backend /api/chat with local clinic knowledge base fallback
    let botReplyText = '';
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: messageText,
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
      console.log('Using local verified clinic engine:', err);
    }

    if (!botReplyText) {
      botReplyText = getLocalClinicReply(messageText);
    }

    // Natural typing delay
    const replyDelay = Math.min(1200, 600 + messageText.length * 10);
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
  }, [inputValue, messages]);

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
                  <span className="verified-badge" title="Verified Specialist Clinic">
                    <CheckCircle2 size={15} />
                  </span>
                </div>
                <p className="clinic-subtitle">
                  {CLINIC_INFO.doctor} • {CLINIC_INFO.city}
                </p>
              </div>
            </div>

            <div className="header-meta">
              <a href={`tel:${CLINIC_INFO.phone}`} className="clinic-phone-pill">
                <Phone size={13} />
                <span>{CLINIC_INFO.phone}</span>
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
                placeholder="Ask about dental implants, aligners, pricing, or book..."
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

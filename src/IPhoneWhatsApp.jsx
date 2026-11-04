import { useState, useRef, useEffect, useCallback } from 'react';
import MicroSlats from './MicroSlats';
import { soundManager } from './whatsapp/audioService';
import './IPhoneWhatsApp.css';

const BUSINESS = {
  name: 'Global Dental Clinic',
  fullName: 'Global Dental Clinic & Implant Center',
  avatar: 'GD',
  phone: '+919409118811',
};

const QUICK_ACTIONS = [
  {
    label: 'Book Appointment',
    reply: `Hello! To book an appointment at Global Dental Clinic & Implant Center, we have slots available from Monday to Saturday, 9:30 AM to 8:30 PM.\n\nWhich date and time works best for you? Our team will confirm within minutes.`,
  },
  {
    label: 'Services and Pricing',
    reply: `Here are our key treatments:\n\nDental Implants: from \u20b922,000\nLaser Whitening: \u20b96,500\nRoot Canal (single sitting): \u20b94,500\nClear Aligners: from \u20b945,000\nEmergency Consultation: \u20b9500\n\nAll treatments are performed by Dr. Rohan Mehta, MDS. Would you like details on any specific procedure?`,
  },
  {
    label: 'Clinic Address',
    reply: `Global Dental Clinic and Implant Center\n304, Titanium City Centre\nPrahlad Nagar, Ahmedabad 380015\n\nTimings: Mon-Sat 9:30 AM to 8:30 PM\nSunday: 10:00 AM to 1:00 PM\n\nWe are on the ground floor near the main entrance. Parking is available.`,
  },
  {
    label: 'Emergency Contact',
    reply: `For dental emergencies, call or WhatsApp directly:\n+91 94091 18811\n\nOur on-call doctor handles urgent cases including toothache, broken teeth, and post-treatment issues. Please describe your situation and we will guide you immediately.`,
  },
];

function formatTime(date) {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function TypingIndicator() {
  return (
    <div className="wa-bubble wa-bubble--in wa-typing">
      <span className="wa-dot" />
      <span className="wa-dot" />
      <span className="wa-dot" />
    </div>
  );
}

function MessageBubble({ msg }) {
  const isOut = msg.from === 'user';
  return (
    <div className={`wa-bubble-wrap ${isOut ? 'wa-bubble-wrap--out' : 'wa-bubble-wrap--in'}`}>
      <div className={`wa-bubble ${isOut ? 'wa-bubble--out' : 'wa-bubble--in'}`}>
        <p className="wa-bubble-text">{msg.text}</p>
        <span className="wa-bubble-time">
          {formatTime(msg.time)}
          {isOut && (
            <svg className="wa-tick" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.071.5 4.5 7.071 1.5 4.071.5 5.071l4 4 7.5-7.5-1-1.07Z" fill="#53bdeb" />
              <path d="M15.071.5 8.5 7.071l-1-1 6.5-6.57 1.07 1Z" fill="#53bdeb" />
            </svg>
          )}
        </span>
      </div>
    </div>
  );
}

export default function IPhoneWhatsApp() {
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing]);

  const sendMessage = useCallback(async (text, replyText) => {
    const userMsg = { id: Date.now(), from: 'user', text, time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    soundManager.playSent?.();

    setTyping(true);
    const delay = 900 + Math.random() * 400;
    await new Promise(r => setTimeout(r, delay));
    setTyping(false);

    const botMsg = { id: Date.now() + 1, from: 'bot', text: replyText, time: new Date() };
    setMessages(prev => [...prev, botMsg]);
    soundManager.playReceived?.();
  }, []);

  const handleQuickAction = useCallback((action) => {
    sendMessage(action.label, action.reply);
  }, [sendMessage]);

  const handleInputSend = useCallback(() => {
    const text = inputVal.trim();
    if (!text) return;
    setInputVal('');
    sendMessage(text, 'Thank you for reaching out to Global Dental Clinic and Implant Center. Our team will get back to you shortly. You can also call us at +91 94091 18811 for immediate assistance.');
  }, [inputVal, sendMessage]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleInputSend();
    }
  }, [handleInputSend]);

  return (
    <div className="app-root">
      {/* WebGL background — full screen */}
      <div className="bg-layer">
        <MicroSlats
          preset="swell"
          color="#A855F7"
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
        />
      </div>

      {/* iPhone frame */}
      <div className="iphone-frame" aria-label="iPhone mockup">
        {/* Dynamic island */}
        <div className="dynamic-island" />

        {/* Screen */}
        <div className="iphone-screen">
          {/* Status bar */}
          <div className="status-bar">
            <span className="status-time">9:41</span>
            <div className="status-icons">
              {/* Signal */}
              <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor">
                <rect x="0" y="8" width="3" height="4" rx="0.5" />
                <rect x="4.5" y="5.5" width="3" height="6.5" rx="0.5" />
                <rect x="9" y="3" width="3" height="9" rx="0.5" />
                <rect x="13.5" y="0" width="3" height="12" rx="0.5" />
              </svg>
              {/* Wifi */}
              <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
                <path d="M8 9.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                <path d="M8 6C5.9 6 4 6.9 2.6 8.3l1.4 1.4A5 5 0 0 1 8 8a5 5 0 0 1 4 1.7l1.4-1.4A7 7 0 0 0 8 6Z" />
                <path d="M8 2C4.7 2 1.7 3.4 0 5.7l1.5 1.3A9 9 0 0 1 8 4a9 9 0 0 1 6.5 3l1.5-1.3A11 11 0 0 0 8 2Z" />
              </svg>
              {/* Battery */}
              <svg width="25" height="12" viewBox="0 0 25 12" fill="currentColor">
                <rect x="0" y="1" width="21" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.2" fill="none" />
                <rect x="1.5" y="2.5" width="17" height="7" rx="1.5" />
                <path d="M22.5 4.5v3c.8-.3 1.5-1 1.5-1.5s-.7-1.2-1.5-1.5Z" />
              </svg>
            </div>
          </div>

          {/* WhatsApp header */}
          <div className="wa-header">
            <button className="wa-back" aria-label="Back">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <div className="wa-avatar" aria-hidden="true">
              {BUSINESS.avatar}
            </div>
            <div className="wa-header-info">
              <div className="wa-header-name">
                {BUSINESS.name}
                <svg className="wa-verified" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="10" fill="#25D366" />
                  <path d="M6 10.5l3 3 5-5.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="wa-header-status">online</div>
            </div>
            <div className="wa-header-actions">
              <button className="wa-icon-btn" aria-label="Video call">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15 10l4.55-2.84A1 1 0 0 1 21 8v8a1 1 0 0 1-1.45.84L15 14v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2Z" />
                </svg>
              </button>
              <button className="wa-icon-btn" aria-label="Voice call">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8Z" />
                </svg>
              </button>
              <button className="wa-icon-btn" aria-label="Search">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>
              <button className="wa-icon-btn" aria-label="More options">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="5" r="1.5" />
                  <circle cx="12" cy="12" r="1.5" />
                  <circle cx="12" cy="19" r="1.5" />
                </svg>
              </button>
            </div>
          </div>

          {/* Chat area */}
          <div className="wa-chat-area">
            {/* Encryption notice */}
            <div className="wa-encrypt-notice">
              <svg viewBox="0 0 16 16" fill="currentColor" className="wa-lock-icon">
                <path d="M8 1a3 3 0 0 0-3 3v1H4a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-1V4a3 3 0 0 0-3-3Zm0 1.5A1.5 1.5 0 0 1 9.5 4v1h-3V4A1.5 1.5 0 0 1 8 2.5ZM8 8a1 1 0 0 1 .5 1.866V11h-1V9.866A1 1 0 0 1 8 8Z" />
              </svg>
              Messages are end-to-end encrypted. No one outside of this chat can read them.
            </div>

            {/* Messages */}
            {messages.map(msg => (
              <MessageBubble key={msg.id} msg={msg} />
            ))}
            {typing && <TypingIndicator />}
            <div ref={chatEndRef} />
          </div>

          {/* Quick action buttons */}
          <div className="wa-quick-actions" role="list" aria-label="Quick replies">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.label}
                className="wa-quick-btn"
                onClick={() => handleQuickAction(action)}
                role="listitem"
              >
                {action.label}
              </button>
            ))}
          </div>

          {/* Input bar */}
          <div className="wa-input-bar">
            <button className="wa-input-icon-btn" aria-label="Emoji">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2" />
                <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="2" />
              </svg>
            </button>
            <div className="wa-input-wrap">
              <input
                ref={inputRef}
                className="wa-input"
                type="text"
                placeholder="Message"
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{ fontSize: '16px' }}
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
              />
            </div>
            <button
              className="wa-send-btn"
              aria-label={inputVal.trim() ? 'Send' : 'Voice message'}
              onClick={inputVal.trim() ? handleInputSend : undefined}
            >
              {inputVal.trim() ? (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1a4 4 0 0 1 4 4v7a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4Zm6 11a6 6 0 0 1-12 0H4a8 8 0 0 0 7 7.93V23h2v-3.07A8 8 0 0 0 20 12h-2Z" />
                </svg>
              )}
            </button>
          </div>
        </div>
        {/* Home indicator */}
        <div className="iphone-home-bar" />
      </div>
    </div>
  );
}

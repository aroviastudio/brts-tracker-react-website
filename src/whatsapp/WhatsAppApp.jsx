import { useState, useRef, useEffect } from 'react';
import { BUSINESS_LEADS } from './leadsData';
import { generateBotResponse } from './whatsappBotEngine';
import { soundManager } from './audioService';
import { SidebarHeader } from './components/SidebarHeader';
import { ChatList } from './components/ChatList';
import { ChatHeader } from './components/ChatHeader';
import { MessageBubble } from './components/MessageBubble';
import { ChatInput } from './components/ChatInput';
import { BusinessInfoDrawer } from './components/BusinessInfoDrawer';
import { CallModal } from './components/CallModal';
import { Lock } from 'lucide-react';
import './whatsapp.css';

export default function WhatsAppApp() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeLeadId, setActiveLeadId] = useState('global-dental');
  const [showBusinessInfo, setShowBusinessInfo] = useState(false);
  const [activeCall, setActiveCall] = useState(null); // null | { business, callType }
  const [mobileView, setMobileView] = useState('chat'); // 'list' | 'chat'
  const [isTyping, setIsTyping] = useState(false);

  // Initialize chat histories for all 10 verified business leads
  const [chatHistories, setChatHistories] = useState(() => {
    const initial = {};
    BUSINESS_LEADS.forEach(lead => {
      initial[lead.id] = [...lead.initialMessages];
    });
    return initial;
  });

  const chatScrollRef = useRef(null);

  // Active business lead object
  const activeBusiness = BUSINESS_LEADS.find(l => l.id === activeLeadId) || BUSINESS_LEADS[0];
  const currentMessages = chatHistories[activeBusiness.id] || [];

  // Scroll conversation to bottom whenever messages or typing changes
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [currentMessages, isTyping, activeLeadId]);

  // Handle switching active lead
  const handleSelectLead = (leadId) => {
    setActiveLeadId(leadId);
    setMobileView('chat');
    setIsTyping(false);
  };

  // Send a user message (or quick reply click)
  const handleSendMessage = (text) => {
    if (!text || !text.trim()) return;

    soundManager.playSent();

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: text.trim(),
      timestamp: timeStr,
      status: 'read'
    };

    // Append user message immediately
    setChatHistories(prev => ({
      ...prev,
      [activeBusiness.id]: [...(prev[activeBusiness.id] || []), userMsg]
    }));

    // Trigger AI Bot response with realistic typing delay
    setIsTyping(true);

    const typingDelay = Math.floor(800 + Math.random() * 600);
    setTimeout(() => {
      const botResponse = generateBotResponse(activeBusiness, text);

      setIsTyping(false);
      soundManager.playReceived();

      setChatHistories(prev => ({
        ...prev,
        [activeBusiness.id]: [...(prev[activeBusiness.id] || []), botResponse]
      }));
    }, typingDelay);
  };

  // Reset / Clear Active Chat
  const handleClearChat = () => {
    setChatHistories(prev => ({
      ...prev,
      [activeBusiness.id]: [...activeBusiness.initialMessages]
    }));
  };

  return (
    <div className={`${darkMode ? 'dark' : ''} w-screen h-screen overflow-hidden flex flex-col bg-[#eae6df] dark:bg-[#0c1317]`}>
      {/* Top WhatsApp Emerald Green Header Bar (Signature WhatsApp Web strip on Desktop) */}
      <div className="hidden lg:block h-[127px] bg-[#00a884] dark:bg-[#202c33] w-full shrink-0 absolute top-0 inset-x-0 z-0"></div>

      {/* Main WhatsApp Window Container */}
      <div className="relative z-10 w-full h-full lg:max-w-[1600px] lg:h-[calc(100vh-38px)] lg:my-auto lg:mx-auto flex shadow-2xl rounded-none lg:rounded-xl overflow-hidden border border-[#d1d7db]/40 dark:border-[#222d34]">
        
        {/* LEFT SIDEBAR: Chat List & Navigation */}
        <div 
          className={`w-full md:w-[380px] lg:w-[420px] h-full flex flex-col bg-white dark:bg-[#111b21] border-r border-[#e9edef] dark:border-[#222d34] shrink-0 ${
            mobileView === 'chat' ? 'hidden md:flex' : 'flex'
          }`}
        >
          <SidebarHeader 
            darkMode={darkMode} 
            setDarkMode={setDarkMode} 
            onClearChat={handleClearChat}
            activeLead={activeBusiness}
          />
          <ChatList 
            leads={BUSINESS_LEADS} 
            activeLeadId={activeLeadId} 
            onSelectLead={handleSelectLead}
            chatHistories={chatHistories}
          />
        </div>

        {/* RIGHT AREA: Active Chat Conversation View */}
        <div 
          className={`flex-1 h-full flex flex-col min-w-0 bg-[#efeae2] dark:bg-[#0b141a] relative ${
            mobileView === 'list' ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* WhatsApp Chat Top Header */}
          <ChatHeader
            business={activeBusiness}
            onBack={() => setMobileView('list')}
            onOpenInfo={() => setShowBusinessInfo(!showBusinessInfo)}
            onStartCall={(callType) => setActiveCall({ business: activeBusiness, callType })}
            onClearChat={handleClearChat}
          />

          {/* Conversation Messages Stream with Authentic Wallpaper */}
          <div 
            ref={chatScrollRef}
            className={`flex-1 overflow-y-auto px-4 sm:px-8 md:px-12 py-4 select-text ${
              darkMode ? 'wa-chat-wallpaper-dark' : 'wa-chat-wallpaper-light'
            }`}
          >
            {/* End-to-End Encryption & Meta Business Notice Pill */}
            <div className="flex flex-col items-center my-3 space-y-2 select-none">
              <div className="px-3 py-1.5 rounded-lg bg-[#ffeecd] dark:bg-[#182229] border border-amber-500/20 shadow-xs max-w-md text-center">
                <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-[#54656f] dark:text-[#ffd279]">
                  <Lock size={12} className="shrink-0" />
                  <span>Messages are end-to-end encrypted. Meta Business Cloud API.</span>
                </div>
              </div>

              {/* Date Divider Pill */}
              <div className="px-3 py-1 rounded-md bg-white dark:bg-[#182229] shadow-xs border border-black/5 dark:border-white/5 text-[11px] font-semibold text-[#54656f] dark:text-[#8696a0]">
                TODAY
              </div>
            </div>

            {/* Inbound / Outbound Chat Stream */}
            {currentMessages.map(msg => (
              <MessageBubble
                key={msg.id}
                message={msg}
                business={activeBusiness}
                onQuickReplyClick={handleSendMessage}
              />
            ))}

            {/* Animated Typing Indicator */}
            {isTyping && (
              <div className="flex items-start my-1.5 animate-pop-in">
                <div className="bg-white dark:bg-[#202c33] rounded-lg rounded-tl-none px-4 py-2.5 shadow-xs flex items-center gap-1.5 text-xs text-[#54656f] dark:text-[#8696a0]">
                  <span className="italic font-medium">{activeBusiness.name} is typing</span>
                  <div className="flex items-center gap-1 ml-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00a884] wa-dot-1"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00a884] wa-dot-2"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00a884] wa-dot-3"></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <ChatInput 
            onSendMessage={handleSendMessage} 
            business={activeBusiness}
          />
        </div>

        {/* Slide-out Business Info Drawer */}
        {showBusinessInfo && (
          <BusinessInfoDrawer
            business={activeBusiness}
            onClose={() => setShowBusinessInfo(false)}
            onQuickReplyClick={handleSendMessage}
          />
        )}
      </div>

      {/* Video / Voice Call Modal */}
      {activeCall && (
        <CallModal
          business={activeCall.business}
          callType={activeCall.callType}
          onClose={() => setActiveCall(null)}
        />
      )}
    </div>
  );
}

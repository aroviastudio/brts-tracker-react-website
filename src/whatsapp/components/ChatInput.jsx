import { useState, useRef } from 'react';
import { 
  Smile, 
  Paperclip, 
  Mic, 
  Send, 
  Image, 
  FileText, 
  MapPin, 
  X,
  Sparkles
} from 'lucide-react';

export function ChatInput({ onSendMessage }) {
  const [inputText, setInputText] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showEmojiBar, setShowEmojiBar] = useState(false);
  const inputRef = useRef(null);

  const commonEmojis = ['👋', '🙏', '👍', '❤️', '📅', '✨', '🚗', '🦷', '🎂', '🥻', '📍', '💰'];

  // Quick prompt suggestions based on business niche
  const quickPrompts = [
    '📅 Can I book an appointment for tomorrow?',
    '💰 What are your package prices?',
    '📍 Where is your studio located?',
    '💬 Can I speak to a human receptionist?'
  ];

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
    setShowEmojiBar(false);
    setShowAttachMenu(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const addEmoji = (emoji) => {
    setInputText(prev => prev + emoji);
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <div className="bg-[#f0f2f5] dark:bg-[#202c33] border-t border-[#e9edef] dark:border-[#222d34] select-none shrink-0 relative">
      {/* Quick Prompt Suggestions Strip */}
      <div className="px-3 pt-2 pb-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-[#e9edef]/60 dark:border-[#222d34]/60">
        <span className="text-[11px] font-semibold text-[#00a884] dark:text-[#25d366] shrink-0 flex items-center gap-1">
          <Sparkles size={12} />
          <span>Quick Ask:</span>
        </span>
        {quickPrompts.map((prompt, pIdx) => (
          <button
            key={pIdx}
            onClick={() => onSendMessage(prompt)}
            className="px-2.5 py-1 bg-white dark:bg-[#111b21] hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-[11px] text-[#54656f] dark:text-[#aebac1] hover:text-[#00a884] dark:hover:text-[#25d366] border border-[#e9edef] dark:border-[#2a3942] rounded-full whitespace-nowrap transition-colors cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Emoji Bar Picker (Collapsible) */}
      {showEmojiBar && (
        <div className="px-3 py-1.5 bg-white dark:bg-[#111b21] border-b border-[#e9edef] dark:border-[#222d34] flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            {commonEmojis.map(emoji => (
              <button
                key={emoji}
                onClick={() => addEmoji(emoji)}
                className="text-lg hover:scale-125 transition-transform p-1 cursor-pointer"
              >
                {emoji}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setShowEmojiBar(false)}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* Attachment Menu Popup */}
      {showAttachMenu && (
        <>
          <div 
            className="fixed inset-0 z-30" 
            onClick={() => setShowAttachMenu(false)}
          />
          <div className="absolute left-10 bottom-16 bg-white dark:bg-[#233138] rounded-2xl shadow-2xl p-3 z-40 border border-gray-100 dark:border-[#2a3942] flex flex-col gap-2 animate-pop-in">
            <button
              onClick={() => {
                setShowAttachMenu(false);
                onSendMessage('📎 [Customer shared reference photo/document for quotation]');
              }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#f5f6f6] dark:hover:bg-[#182229] transition-colors text-xs font-medium text-[#111b21] dark:text-[#d1d7db]"
            >
              <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center">
                <Image size={16} />
              </div>
              <span>Photos & Videos</span>
            </button>
            <button
              onClick={() => {
                setShowAttachMenu(false);
                onSendMessage('📄 [Customer shared prescription / report PDF]');
              }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#f5f6f6] dark:hover:bg-[#182229] transition-colors text-xs font-medium text-[#111b21] dark:text-[#d1d7db]"
            >
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                <FileText size={16} />
              </div>
              <span>Medical Document / PDF</span>
            </button>
            <button
              onClick={() => {
                setShowAttachMenu(false);
                onSendMessage('📍 [Customer shared live GPS location]');
              }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#f5f6f6] dark:hover:bg-[#182229] transition-colors text-xs font-medium text-[#111b21] dark:text-[#d1d7db]"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                <MapPin size={16} />
              </div>
              <span>Location Coordinates</span>
            </button>
          </div>
        </>
      )}

      {/* Main Input Row */}
      <div className="px-3 py-2 flex items-center gap-2">
        {/* Emoji Button */}
        <button
          onClick={() => setShowEmojiBar(!showEmojiBar)}
          className={`p-2 rounded-full transition-colors cursor-pointer ${
            showEmojiBar 
              ? 'text-[#00a884] dark:text-[#25d366] bg-emerald-500/10' 
              : 'text-[#54656f] dark:text-[#8696a0] hover:text-black dark:hover:text-white'
          }`}
          title="Emojis"
        >
          <Smile size={22} />
        </button>

        {/* Attachment Clip Button */}
        <button
          onClick={() => setShowAttachMenu(!showAttachMenu)}
          className={`p-2 rounded-full transition-colors cursor-pointer ${
            showAttachMenu 
              ? 'text-[#00a884] dark:text-[#25d366] bg-emerald-500/10' 
              : 'text-[#54656f] dark:text-[#8696a0] hover:text-black dark:hover:text-white'
          }`}
          title="Attach"
        >
          <Paperclip size={21} />
        </button>

        {/* Text Input Box */}
        <div className="flex-1">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message"
            className="w-full h-10 px-3.5 bg-white dark:bg-[#2a3942] text-sm text-[#111b21] dark:text-[#d1d7db] rounded-lg outline-none placeholder-[#8696a0] focus:ring-1 focus:ring-[#00a884]/40"
          />
        </div>

        {/* Send Button or Voice Note Mic */}
        {inputText.trim() ? (
          <button
            onClick={handleSend}
            className="w-10 h-10 rounded-full bg-[#00a884] hover:bg-[#008f72] text-white flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
            title="Send"
          >
            <Send size={18} className="translate-x-0.5" />
          </button>
        ) : (
          <button
            onClick={() => onSendMessage('🎙️ [Voice Note: "Hi doctor, I wanted to enquire about the appointment slot tomorrow"]') }
            className="p-2 text-[#54656f] dark:text-[#8696a0] hover:text-black dark:hover:text-white rounded-full transition-colors cursor-pointer"
            title="Record Voice Note"
          >
            <Mic size={22} />
          </button>
        )}
      </div>
    </div>
  );
}

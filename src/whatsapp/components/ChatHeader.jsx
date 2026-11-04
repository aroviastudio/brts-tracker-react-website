import { useState } from 'react';
import { 
  ArrowLeft, 
  Video, 
  Phone, 
  Search, 
  MoreVertical, 
  Info, 
  RotateCcw, 
  ExternalLink
} from 'lucide-react';

export function ChatHeader({ 
  business, 
  onBack, 
  onOpenInfo, 
  onStartCall, 
  onClearChat 
}) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="h-15 px-3 sm:px-4 flex items-center justify-between bg-[#f0f2f5] dark:bg-[#202c33] border-b border-[#e9edef] dark:border-[#222d34] select-none z-10 shrink-0">
      {/* Left: Back button (Mobile only) + Avatar + Business Details */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 cursor-pointer" onClick={onOpenInfo}>
        {/* Mobile Back Button */}
        <button 
          onClick={(e) => { e.stopPropagation(); onBack(); }}
          className="p-1 -ml-1 text-[#54656f] dark:text-[#aebac1] hover:text-black dark:hover:text-white md:hidden cursor-pointer"
          title="Back to chats"
        >
          <ArrowLeft size={22} />
        </button>

        {/* Business Avatar */}
        <div className="relative shrink-0">
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${business.avatarBg} text-white font-semibold text-sm flex items-center justify-center shadow-xs`}>
            {business.avatarText}
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#25d366] border-2 border-white dark:border-[#202c33] rounded-full"></span>
        </div>

        {/* Business Name & Official Business Account subtitle */}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-sm text-[#111b21] dark:text-[#e9edef] truncate">
              {business.name}
            </span>
            {/* Verified Green Badge */}
            <svg className="w-4 h-4 text-[#25d366] shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <div className="text-[11px] text-[#667781] dark:text-[#8696a0] truncate flex items-center gap-1.5">
            <span>Official business account</span>
            <span>•</span>
            <span className="text-[#00a884] dark:text-[#25d366] font-medium">online</span>
          </div>
        </div>
      </div>

      {/* Right Action Buttons */}
      <div className="flex items-center gap-1 sm:gap-2 text-[#54656f] dark:text-[#aebac1]">
        {/* Video Call */}
        <button
          onClick={() => onStartCall('video')}
          title="Video call"
          className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
        >
          <Video size={20} />
        </button>

        {/* Voice Call */}
        <button
          onClick={() => onStartCall('voice')}
          title="Voice call"
          className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
        >
          <Phone size={19} />
        </button>

        {/* Search inside conversation */}
        <button
          title="Search in chat"
          className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer hidden sm:block"
        >
          <Search size={19} />
        </button>

        {/* 3-Dots Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            title="Menu"
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <MoreVertical size={20} />
          </button>

          {showMenu && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-11 w-56 bg-white dark:bg-[#233138] rounded-md shadow-xl py-2 z-50 border border-gray-100 dark:border-[#2a3942] text-sm text-[#111b21] dark:text-[#d1d7db] animate-pop-in">
                <button
                  onClick={() => { setShowMenu(false); onOpenInfo(); }}
                  className="w-full px-4 py-2.5 text-left hover:bg-[#f5f6f6] dark:hover:bg-[#182229] transition-colors flex items-center gap-2.5"
                >
                  <Info size={16} />
                  <span>Business info</span>
                </button>
                <a
                  href={`https://wa.me/${business.cleanPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-4 py-2.5 text-left hover:bg-[#f5f6f6] dark:hover:bg-[#182229] transition-colors flex items-center gap-2.5 text-[#00a884] dark:text-[#25d366]"
                >
                  <ExternalLink size={16} />
                  <span>Open real WhatsApp link</span>
                </a>
                <button
                  onClick={() => { setShowMenu(false); onClearChat(); }}
                  className="w-full px-4 py-2.5 text-left hover:bg-[#f5f6f6] dark:hover:bg-[#182229] transition-colors flex items-center gap-2.5 text-red-500"
                >
                  <RotateCcw size={16} />
                  <span>Clear messages</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

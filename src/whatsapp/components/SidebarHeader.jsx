import { useState } from 'react';
import { 
  CircleDashed, 
  MoreVertical, 
  Users, 
  Sparkles, 
  Sun, 
  Moon, 
  Volume2, 
  VolumeX,
  ShieldCheck,
  Check
} from 'lucide-react';
import { soundManager } from '../audioService';

export function SidebarHeader({ darkMode, setDarkMode, onClearChat, activeLead }) {
  const [showMenu, setShowMenu] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  const toggleSound = () => {
    const nextState = soundManager.toggleSound();
    setSoundOn(nextState);
  };

  return (
    <div className="h-15 px-4 flex items-center justify-between bg-[#f0f2f5] dark:bg-[#202c33] border-b border-[#e9edef] dark:border-[#222d34] select-none">
      {/* User Profile Avatar with Meta AI badge */}
      <div className="flex items-center gap-2.5">
        <div className="relative group cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-600 to-[#00a884] flex items-center justify-center text-white font-semibold text-sm shadow-sm ring-2 ring-emerald-500/30">
            WA
          </div>
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-[#202c33] rounded-full"></span>
        </div>
        <div className="hidden sm:block">
          <div className="text-xs font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-1">
            <span>WhatsApp AI</span>
            <span className="px-1.5 py-0.2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] rounded font-medium">Business</span>
          </div>
          <div className="text-[11px] text-gray-500 dark:text-gray-400">10 Verified Leads</div>
        </div>
      </div>

      {/* Top Action Icons */}
      <div className="flex items-center gap-1 sm:gap-2 text-[#54656f] dark:text-[#aebac1]">
        {/* Sound Toggle */}
        <button 
          onClick={toggleSound}
          title={soundOn ? 'Mute Sounds' : 'Unmute Sounds'}
          className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
        >
          {soundOn ? <Volume2 size={20} className="text-emerald-600 dark:text-emerald-400" /> : <VolumeX size={20} />}
        </button>

        {/* Dark / Light Mode Toggle */}
        <button 
          onClick={() => setDarkMode(!darkMode)}
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
        >
          {darkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} />}
        </button>

        {/* Status / Stories */}
        <button 
          title="Status" 
          className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer hidden md:block"
        >
          <CircleDashed size={20} />
        </button>

        {/* Communities */}
        <button 
          title="Communities" 
          className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer hidden md:block"
        >
          <Users size={20} />
        </button>

        {/* Meta AI Assistant */}
        <button 
          title="Meta AI Assistant" 
          className="p-2 rounded-full hover:bg-emerald-500/10 transition-colors cursor-pointer text-emerald-600 dark:text-emerald-400"
        >
          <Sparkles size={20} />
        </button>

        {/* 3-Dots Dropdown Menu */}
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
              <div className="absolute right-0 top-11 w-52 bg-white dark:bg-[#233138] rounded-md shadow-xl py-2 z-50 border border-gray-100 dark:border-[#2a3942] text-sm text-[#111b21] dark:text-[#d1d7db] animate-pop-in">
                <button 
                  onClick={() => { setShowMenu(false); onClearChat(); }}
                  className="w-full px-4 py-2.5 text-left hover:bg-[#f5f6f6] dark:hover:bg-[#182229] transition-colors flex items-center justify-between"
                >
                  <span>Reset Active Chat</span>
                </button>
                <button 
                  onClick={() => { setShowMenu(false); toggleSound(); }}
                  className="w-full px-4 py-2.5 text-left hover:bg-[#f5f6f6] dark:hover:bg-[#182229] transition-colors flex items-center justify-between"
                >
                  <span>Chat Audio Sounds</span>
                  {soundOn && <Check size={16} className="text-emerald-500" />}
                </button>
                <button 
                  onClick={() => { setShowMenu(false); setDarkMode(!darkMode); }}
                  className="w-full px-4 py-2.5 text-left hover:bg-[#f5f6f6] dark:hover:bg-[#182229] transition-colors flex items-center justify-between"
                >
                  <span>{darkMode ? 'Light Theme' : 'Dark Theme'}</span>
                </button>
                <div className="my-1 border-t border-gray-100 dark:border-[#2a3942]"></div>
                <div className="px-4 py-2 text-[11px] text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  <span>Meta Verified WhatsApp Demo</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

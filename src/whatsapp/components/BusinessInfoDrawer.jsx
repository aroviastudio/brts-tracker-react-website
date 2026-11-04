import { 
  X, 
  MapPin, 
  Clock, 
  Phone, 
  ExternalLink, 
  Zap, 
  Award, 
  Lock
} from 'lucide-react';

export function BusinessInfoDrawer({ business, onClose, onQuickReplyClick }) {
  return (
    <div className="w-full sm:w-96 bg-white dark:bg-[#111b21] border-l border-[#e9edef] dark:border-[#222d34] flex flex-col h-full overflow-y-auto select-none z-20 shrink-0">
      {/* Drawer Top Header */}
      <div className="h-15 px-4 bg-[#f0f2f5] dark:bg-[#202c33] flex items-center gap-4 border-b border-[#e9edef] dark:border-[#222d34]">
        <button
          onClick={onClose}
          className="p-1 rounded-full text-[#54656f] dark:text-[#8696a0] hover:text-black dark:hover:text-white cursor-pointer"
          title="Close drawer"
        >
          <X size={20} />
        </button>
        <span className="font-semibold text-sm text-[#111b21] dark:text-[#e9edef]">Business info</span>
      </div>

      <div className="p-4 space-y-4">
        {/* Business Hero Banner & Avatar */}
        <div className="flex flex-col items-center text-center pb-4 border-b border-[#e9edef] dark:border-[#222d34]">
          <div className="relative mb-3">
            <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${business.avatarBg} text-white font-bold text-3xl flex items-center justify-center shadow-md ring-4 ring-emerald-500/20`}>
              {business.avatarText}
            </div>
            <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-white dark:bg-[#111b21] flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-[#25d366]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
          </div>

          <h2 className="text-base font-bold text-[#111b21] dark:text-[#e9edef] flex items-center justify-center gap-1.5">
            <span>{business.name}</span>
          </h2>
          <p className="text-xs text-[#00a884] dark:text-[#25d366] font-medium mt-0.5">
            {business.category}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-[280px]">
            {business.tagline}
          </p>

          {/* Direct wa.me Button */}
          <div className="flex items-center gap-2 mt-4 w-full">
            <a
              href={`https://wa.me/${business.cleanPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 bg-[#00a884] hover:bg-[#008f72] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <ExternalLink size={14} />
              <span>Direct wa.me/{business.cleanPhone}</span>
            </a>
          </div>
        </div>

        {/* Lead Audit & AI Score Card */}
        <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
              <Zap size={14} className="fill-current" />
              <span>AI CHATBOT FIT SCORE</span>
            </div>
            <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
              {business.score} / 100
            </span>
          </div>
          <div className="text-[12px] text-gray-700 dark:text-gray-300 space-y-1.5">
            <div>
              <span className="text-gray-500">Google Reputation:</span>{' '}
              <strong className="text-amber-500">{business.rating} ★</strong> ({business.reviews} reviews)
            </div>
            <div>
              <span className="text-gray-500">Addressed Automation Gap:</span>{' '}
              <span className="italic text-rose-600 dark:text-rose-400 font-medium">"{business.flaw}"</span>
            </div>
            <div>
              <span className="text-gray-500">Opener Pitch Mode:</span>{' '}
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{business.leadType}</span>
            </div>
          </div>
        </div>

        {/* Business Details List */}
        <div className="space-y-3 text-xs text-[#111b21] dark:text-[#e9edef]">
          <div className="flex items-start gap-3">
            <Clock size={16} className="text-[#54656f] dark:text-[#8696a0] shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-gray-500 dark:text-gray-400">Business Hours</div>
              <div>{business.timings}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin size={16} className="text-[#54656f] dark:text-[#8696a0] shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-gray-500 dark:text-gray-400">Location</div>
              <div>{business.address}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone size={16} className="text-[#54656f] dark:text-[#8696a0] shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-gray-500 dark:text-gray-400">Official Contact</div>
              <div className="font-mono">{business.phone}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Award size={16} className="text-[#54656f] dark:text-[#8696a0] shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-gray-500 dark:text-gray-400">Supervising Specialist</div>
              <div>{business.doctor}</div>
            </div>
          </div>
        </div>

        {/* Catalog Preview */}
        <div className="pt-2 border-t border-[#e9edef] dark:border-[#222d34]">
          <div className="font-semibold text-xs text-[#54656f] dark:text-[#8696a0] mb-2 flex items-center justify-between">
            <span>OFFICIAL SERVICES & PRICING</span>
            <span>{business.services.length} items</span>
          </div>
          <div className="space-y-1.5">
            {business.services.map(s => (
              <div
                key={s.id}
                onClick={() => onQuickReplyClick(`Tell me more about ${s.name} pricing`)}
                className="p-2 rounded-lg bg-[#f0f2f5] dark:bg-[#202c33] hover:bg-emerald-50 dark:hover:bg-[#2a3942] transition-colors flex items-center justify-between cursor-pointer"
              >
                <div className="min-w-0 pr-2">
                  <div className="text-xs font-medium text-[#111b21] dark:text-[#e9edef] truncate">{s.name}</div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">{s.price}</div>
                </div>
                <span className="text-[10px] text-gray-400">Ask &gt;</span>
              </div>
            ))}
          </div>
        </div>

        {/* End-to-End Encryption Note */}
        <div className="pt-3 border-t border-[#e9edef] dark:border-[#222d34] flex items-center gap-2 text-[11px] text-[#54656f] dark:text-[#8696a0]">
          <Lock size={14} className="text-[#00a884] shrink-0" />
          <span>Messages and calls are end-to-end encrypted. Meta Business API integration.</span>
        </div>
      </div>
    </div>
  );
}

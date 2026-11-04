import { useState } from 'react';
import { Search, X, CheckCheck, Star } from 'lucide-react';

export function ChatList({ leads, activeLeadId, onSelectLead, chatHistories }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Unread', 'High Score', 'Dental', 'Detailing', 'Aesthetic', 'Bakery', 'Boutique'];

  const filteredLeads = leads.filter(lead => {
    // Search query
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      lead.name.toLowerCase().includes(query) ||
      lead.category.toLowerCase().includes(query) ||
      lead.city.toLowerCase().includes(query);

    if (!matchesSearch) return false;

    // Filter pill
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Unread') return lead.score >= 80;
    if (activeFilter === 'High Score') return lead.score >= 80;
    if (activeFilter === 'Dental') return lead.niche === 'dental';
    if (activeFilter === 'Detailing') return lead.niche === 'automotive';
    if (activeFilter === 'Aesthetic') return lead.niche === 'dermatology';
    if (activeFilter === 'Bakery') return lead.niche === 'bakery';
    if (activeFilter === 'Boutique') return lead.niche === 'boutique';
    return true;
  });

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-[#111b21]">
      {/* Search Bar & Filter Strip */}
      <div className="px-3 pt-2 pb-2 bg-white dark:bg-[#111b21] border-b border-[#e9edef] dark:border-[#222d34]">
        <div className="relative flex items-center">
          <div className="absolute left-3 text-[#54656f] dark:text-[#8696a0]">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search or start new chat"
            className="w-full h-9 pl-10 pr-8 bg-[#f0f2f5] dark:bg-[#202c33] text-sm text-[#111b21] dark:text-[#d1d7db] rounded-lg outline-none placeholder-[#8696a0] focus:ring-1 focus:ring-emerald-500/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 p-1 text-[#54656f] dark:text-[#8696a0] hover:text-black dark:hover:text-white"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto no-scrollbar pb-0.5">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeFilter === filter
                  ? 'bg-[#00a884] text-white shadow-xs'
                  : 'bg-[#f0f2f5] dark:bg-[#202c33] text-[#54656f] dark:text-[#8696a0] hover:bg-[#e9edef] dark:hover:bg-[#2a3942]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Conversation Items */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#e9edef] dark:divide-[#222d34]">
        {filteredLeads.length === 0 ? (
          <div className="p-8 text-center text-sm text-[#8696a0]">
            No business chats found matching "{searchQuery}"
          </div>
        ) : (
          filteredLeads.map(lead => {
            const isActive = lead.id === activeLeadId;
            const messages = chatHistories[lead.id] || lead.initialMessages;
            const lastMsg = messages[messages.length - 1];
            const lastText = lastMsg ? (lastMsg.text || 'Interactive card') : lead.category;

            return (
              <div
                key={lead.id}
                onClick={() => onSelectLead(lead.id)}
                className={`flex items-center gap-3 px-3 py-3 cursor-pointer transition-colors relative select-none ${
                  isActive
                    ? 'bg-[#f0f2f5] dark:bg-[#2a3942]'
                    : 'hover:bg-[#f5f6f6] dark:hover:bg-[#202c33]'
                }`}
              >
                {/* Avatar with Niche Badge */}
                <div className="relative shrink-0">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${lead.avatarBg} text-white font-semibold text-base flex items-center justify-center shadow-xs`}>
                    {lead.avatarText}
                  </div>
                  {/* Verified WhatsApp Business Badge */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-white dark:bg-[#111b21] flex items-center justify-center shadow-xs">
                    <svg className="w-3.5 h-3.5 text-[#25d366]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                </div>

                {/* Conversation Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="font-medium text-sm text-[#111b21] dark:text-[#e9edef] truncate">
                        {lead.name}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#667781] dark:text-[#8696a0] shrink-0 ml-2">
                      {lastMsg ? lastMsg.timestamp : '10:14 AM'}
                    </span>
                  </div>

                  {/* Subtitle / Last Message Snippet */}
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1 min-w-0 text-xs text-[#667781] dark:text-[#8696a0]">
                      {lastMsg && lastMsg.sender === 'user' && (
                        <CheckCheck size={14} className="text-[#53bdeb] shrink-0" />
                      )}
                      <span className="truncate">
                        {lastText.replace(/[\n*#_`]/g, ' ')}
                      </span>
                    </div>

                    {/* Rating / Score Pill */}
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] rounded font-semibold">
                        <Star size={10} fill="currentColor" />
                        <span>{lead.rating}</span>
                      </span>
                      {lead.score >= 80 && (
                        <span className="w-2 h-2 rounded-full bg-[#25d366]" title="High Chatbot Fit"></span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

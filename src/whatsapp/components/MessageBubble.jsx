import { useState } from 'react';
import { 
  CheckCheck, 
  MapPin, 
  CreditCard, 
  CheckCircle2, 
  ExternalLink, 
  ChevronRight
} from 'lucide-react';

export function MessageBubble({ message, onQuickReplyClick }) {
  const isUser = message.sender === 'user';
  const [paid, setPaid] = useState(false);

  // Parse simple WhatsApp markdown: *bold*, _italic_, `code`
  const renderFormattedText = (rawText) => {
    if (!rawText) return null;
    const lines = rawText.split('\n');

    return lines.map((line, lIdx) => {
      // Process formatting within line
      const parts = [];
      let cur = '';
      let i = 0;

      while (i < line.length) {
        if (line[i] === '*' && line.indexOf('*', i + 1) !== -1) {
          const end = line.indexOf('*', i + 1);
          parts.push(cur);
          parts.push(<strong key={`${lIdx}-${i}`} className="font-semibold">{line.slice(i + 1, end)}</strong>);
          cur = '';
          i = end + 1;
        } else if (line[i] === '_' && line.indexOf('_', i + 1) !== -1) {
          const end = line.indexOf('_', i + 1);
          parts.push(cur);
          parts.push(<em key={`${lIdx}-${i}`} className="italic">{line.slice(i + 1, end)}</em>);
          cur = '';
          i = end + 1;
        } else if (line[i] === '`' && line.indexOf('`', i + 1) !== -1) {
          const end = line.indexOf('`', i + 1);
          parts.push(cur);
          parts.push(
            <code key={`${lIdx}-${i}`} className="px-1 py-0.5 bg-black/5 dark:bg-white/10 rounded font-mono text-[12px]">
              {line.slice(i + 1, end)}
            </code>
          );
          cur = '';
          i = end + 1;
        } else {
          cur += line[i];
          i++;
        }
      }
      parts.push(cur);

      return (
        <div key={lIdx} className={lIdx > 0 ? 'mt-1' : ''}>
          {parts}
        </div>
      );
    });
  };

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} my-1.5 animate-pop-in`}>
      {/* Main Message Bubble */}
      <div
        className={`max-w-[85%] sm:max-w-[70%] md:max-w-[62%] rounded-lg px-3 py-2 text-sm shadow-xs relative select-text ${
          isUser
            ? 'bg-[#d9fdd3] dark:bg-[#005c4b] text-[#111b21] dark:text-[#e9edef] rounded-tr-none'
            : 'bg-white dark:bg-[#202c33] text-[#111b21] dark:text-[#e9edef] rounded-tl-none'
        }`}
      >
        {/* Text Body */}
        <div className="leading-relaxed text-[13.5px] whitespace-pre-wrap break-words">
          {renderFormattedText(message.text)}
        </div>

        {/* 1. INTERACTIVE BOOKING CARD */}
        {message.cardType === 'booking' && message.bookingData && (
          <div className="mt-2.5 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[#111b21] dark:text-[#e9edef]">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#00a884] dark:text-[#25d366] mb-1.5">
              <CheckCircle2 size={16} />
              <span>APPOINTMENT RESERVATION SLIP</span>
            </div>
            <div className="text-xs space-y-1 text-gray-700 dark:text-gray-300">
              <div className="flex justify-between">
                <span className="text-gray-500">Ref Code:</span>
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">{message.bookingData.refId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Center:</span>
                <span className="font-medium">{message.bookingData.businessName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Doctor / Lead:</span>
                <span className="font-medium">{message.bookingData.doctor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Proposed Slot:</span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">{message.bookingData.date}</span>
              </div>
            </div>
            <button 
              onClick={() => onQuickReplyClick(`Confirm appointment for slot ${message.bookingData.date}`)}
              className="mt-2.5 w-full py-1.5 bg-[#00a884] hover:bg-[#008f72] text-white text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>Instant WhatsApp 1-Click Confirm</span>
              <ChevronRight size={14} />
            </button>
          </div>
        )}

        {/* 2. INTERACTIVE CATALOG CAROUSEL / CARDS */}
        {message.cardType === 'catalog' && message.catalogItems && (
          <div className="mt-2.5 space-y-2">
            {message.catalogItems.map(item => (
              <div 
                key={item.id}
                className="p-2.5 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-xs text-[#111b21] dark:text-[#e9edef] truncate">{item.name}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] rounded font-medium shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">{item.price}</span> • {item.time}
                  </div>
                </div>
                <button
                  onClick={() => onQuickReplyClick(`I want to book/enquire about ${item.name}`)}
                  className="px-2.5 py-1 bg-[#00a884] hover:bg-[#008f72] text-white text-xs font-medium rounded transition-colors shrink-0 cursor-pointer"
                >
                  Book
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 3. INTERACTIVE LOCATION CARD */}
        {message.cardType === 'location' && message.locationData && (
          <div className="mt-2.5 rounded-lg overflow-hidden border border-emerald-500/20 bg-emerald-500/5">
            <div className="h-20 bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-800 p-3 flex flex-col justify-end text-white relative">
              <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/40 backdrop-blur-xs rounded text-[10px] flex items-center gap-1">
                <MapPin size={12} className="text-emerald-400" />
                <span>Google Maps Verified</span>
              </div>
              <div className="font-semibold text-xs truncate">{message.locationData.name}</div>
              <div className="text-[10px] opacity-90 truncate">{message.locationData.city} Center</div>
            </div>
            <div className="p-2.5 text-xs text-gray-700 dark:text-gray-300 space-y-1">
              <div className="font-medium">{message.locationData.address}</div>
              <div className="text-[11px] text-gray-500">{message.locationData.timings}</div>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(message.locationData.name + ' ' + message.locationData.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 w-full py-1.5 bg-[#00a884] hover:bg-[#008f72] text-white text-xs font-medium rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <ExternalLink size={13} />
                <span>Open in Google Maps GPS</span>
              </a>
            </div>
          </div>
        )}

        {/* 4. INTERACTIVE PAYMENT CARD */}
        {message.cardType === 'payment' && message.paymentData && (
          <div className="mt-2.5 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[#111b21] dark:text-[#e9edef]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <CreditCard size={16} />
                <span>WhatsApp UPI Payment</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${paid ? 'bg-emerald-500 text-white' : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'}`}>
                {paid ? 'PAID ✓' : 'PENDING'}
              </span>
            </div>
            <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              {message.paymentData.amount}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-2.5">
              Token for {message.paymentData.businessName}
            </div>
            {!paid ? (
              <button
                onClick={() => {
                  setPaid(true);
                  onQuickReplyClick(`Payment of ${message.paymentData.amount} completed via GPay/PhonePe! Reference: ${message.paymentData.payId}`);
                }}
                className="w-full py-1.5 bg-[#25d366] hover:bg-[#20ba59] text-black font-semibold text-xs rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Simulate UPI Payment Now</span>
                <CheckCircle2 size={14} />
              </button>
            ) : (
              <div className="text-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 py-1">
                ✓ Verified by NPCI / Bank Gateway
              </div>
            )}
          </div>
        )}

        {/* Footer: Timestamp & Read Status Tick */}
        <div className="flex items-center justify-end gap-1 mt-1 text-[11px] text-[#667781] dark:text-[#8696a0] select-none">
          <span>{message.timestamp}</span>
          {isUser && (
            <CheckCheck size={15} className="text-[#53bdeb]" />
          )}
        </div>
      </div>

      {/* Quick Reply Chips (Action Pills) */}
      {!isUser && message.quickReplies && message.quickReplies.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-1.5 max-w-[85%] sm:max-w-[70%]">
          {message.quickReplies.map((reply, rIdx) => (
            <button
              key={rIdx}
              onClick={() => onQuickReplyClick(reply)}
              className="px-3 py-1.5 bg-white dark:bg-[#202c33] hover:bg-[#f0f2f5] dark:hover:bg-[#2a3942] text-[#00a884] dark:text-[#25d366] border border-[#e9edef] dark:border-[#222d34] rounded-full text-xs font-medium shadow-xs transition-colors flex items-center gap-1 cursor-pointer active:scale-95"
            >
              <span>{reply}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

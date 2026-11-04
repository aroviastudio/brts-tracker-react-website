import { useState, useEffect } from 'react';
import { PhoneOff, Mic, MicOff, Video, VideoOff } from 'lucide-react';

export function CallModal({ business, callType, onClose }) {
  const [callDuration, setCallDuration] = useState(0);
  const [callStatus, setCallStatus] = useState('Ringing...');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  useEffect(() => {
    // Transition from Ringing to Connected after 2.5s
    const connectTimer = setTimeout(() => {
      setCallStatus('Connected (WhatsApp AI Voice Assistant)');
    }, 2400);

    // Duration timer once connected
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => {
      clearTimeout(connectTimer);
      clearInterval(interval);
    };
  }, []);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0c1317]/90 backdrop-blur-md flex items-center justify-center p-4 animate-pop-in select-none">
      <div className="w-full max-w-sm bg-[#111b21] rounded-3xl p-6 text-white flex flex-col items-center justify-between min-h-[460px] shadow-2xl border border-white/10 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-emerald-500/20 to-transparent pointer-events-none"></div>

        {/* Top Header */}
        <div className="text-center z-10">
          <div className="text-xs uppercase tracking-wider text-emerald-400 font-semibold mb-1">
            WhatsApp {callType === 'video' ? 'Video' : 'Voice'} Call
          </div>
          <h3 className="text-lg font-bold truncate max-w-[280px]">
            {business.name}
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            {callStatus === 'Ringing...' ? 'Calling 24/7 AI Desk...' : formatDuration(callDuration)}
          </p>
        </div>

        {/* Pulsating Business Avatar */}
        <div className="relative my-8 z-10">
          <div className="absolute -inset-4 rounded-full bg-emerald-500/20 animate-ping"></div>
          <div className="absolute -inset-2 rounded-full bg-emerald-500/30"></div>
          <div className={`w-28 h-28 rounded-full bg-gradient-to-br ${business.avatarBg} text-white font-bold text-4xl flex items-center justify-center shadow-xl ring-4 ring-emerald-500/50`}>
            {business.avatarText}
          </div>
        </div>

        {/* Interactive Simulated Voice AI Waveform note */}
        <div className="text-center px-4 py-2 rounded-xl bg-white/5 border border-white/10 z-10 text-[11px] text-gray-300 max-w-[260px]">
          🤖 <em>"Hello! You've reached {business.name}. How can we assist your appointment today?"</em>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-4 mt-6 z-10">
          {/* Mute */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
              isMuted ? 'bg-rose-600 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          {/* End Call (Red) */}
          <button
            onClick={onClose}
            className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            title="End Call"
          >
            <PhoneOff size={28} />
          </button>

          {/* Video Toggle */}
          <button
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
              isVideoOff ? 'bg-rose-600 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}

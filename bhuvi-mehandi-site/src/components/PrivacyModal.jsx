import React from 'react';
import { X, ShieldCheck, MapPin, Clock } from 'lucide-react';

export function PrivacyModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-green-600" />
            <h2 className="font-bold text-gray-900">Privacy Policy</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3">
          {[
            { icon: <ShieldCheck className="w-4 h-4 text-green-500" />, title: 'Zero Login', desc: 'No account, name, email or phone number needed. Ever.' },
            { icon: <MapPin className="w-4 h-4 text-blue-500" />, title: 'Location Auto-Stops', desc: 'GPS tracking stops automatically when you leave a BRTS station area.' },
            { icon: <Clock className="w-4 h-4 text-amber-500" />, title: 'Ephemeral Sessions', desc: 'Your location is never stored. Sessions exist only while you are on the bus.' },
          ].map((item, i) => (
            <div key={i} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="shrink-0 mt-0.5">{item.icon}</div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="mt-4 w-full py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition">
          Got it
        </button>
      </div>
    </div>
  );
}

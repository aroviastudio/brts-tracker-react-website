import React from 'react';
import { ShieldCheck, Lock, EyeOff, MapPinOff, X } from 'lucide-react';

export function PrivacyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">Privacy & Trust by Design</h3>
            <p className="text-xs text-slate-400">Zero Personal Data • Full Geofenced Protection</p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-slate-300">
          <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/60 flex items-start gap-3">
            <Lock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-white text-sm mb-0.5">1. Zero Login / Zero Accounts</h4>
              <p className="text-slate-400">
                You never provide a name, email, phone number, or password. We do not know who you are. Sessions use an ephemeral random token in memory that vanishes when you close the tab.
              </p>
            </div>
          </div>

          <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/60 flex items-start gap-3">
            <MapPinOff className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-white text-sm mb-0.5">2. Geofenced Auto-Stop</h4>
              <p className="text-slate-400">
                Our engine automatically stops reading your phone's GPS the moment you arrive at your destination BRTS station and step outside the corridor boundary. We never track your personal life.
              </p>
            </div>
          </div>

          <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/60 flex items-start gap-3">
            <EyeOff className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-white text-sm mb-0.5">3. Crowdsourced Anonymization</h4>
              <p className="text-slate-400">
                GPS telemetry is fused into anonymized transit clusters purely to help other commuters see live bus positions.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs px-5 py-2.5 rounded-xl transition cursor-pointer"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
}

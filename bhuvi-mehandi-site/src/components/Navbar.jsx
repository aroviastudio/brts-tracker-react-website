import React from 'react';
import { Bus, Info } from 'lucide-react';

export function Navbar({ onOpenPrivacy }) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Bus className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-bold text-gray-900 text-base leading-none">Where Is My BRTS</span>
            <span className="block text-[11px] text-gray-500 leading-none mt-0.5">Surat Sitilink</span>
          </div>
        </div>
        <button
          onClick={onOpenPrivacy}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-600 transition px-2 py-1.5 rounded-lg hover:bg-gray-50"
        >
          <Info className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Privacy</span>
        </button>
      </div>
    </header>
  );
}

import React, { useState, useEffect } from 'react';
import { narrator, SubtitleState } from '../utils/audioNarrator';
import { Mic, X } from 'lucide-react';

export const SubtitleBanner: React.FC = () => {
  const [subState, setSubState] = useState<SubtitleState>({
    visible: false,
    title: '',
    text: '',
    isPlaying: false,
    activeId: null,
  });

  useEffect(() => {
    return narrator.subscribe(setSubState);
  }, []);

  if (!subState.visible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-4xl bg-[#1a140a]/95 border-2 border-[#d97706] rounded-2xl px-4 py-3 shadow-2xl shadow-black/60 z-50 flex items-center gap-3 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#d97706] to-[#7f1d1d] text-white flex items-center justify-center shrink-0 shadow-lg">
        <Mic className="w-6 h-6 animate-pulse" />
      </div>

      <div className="flex-1 min-w-0 text-[#fef3c7]">
        <div className="flex items-center gap-2 text-xs font-bold text-[#f59e0b] uppercase tracking-wider mb-0.5">
          <span>{subState.title || 'CÔ QUYÊN THUYẾT MINH (GIỌNG NỮ MIỀN BẮC HÀ NỘI)'}</span>
          <span className="inline-flex items-center gap-0.5 h-3">
            <span className="w-0.5 h-2 bg-amber-400 rounded wave-bar-1" />
            <span className="w-0.5 h-3 bg-amber-400 rounded wave-bar-2" />
            <span className="w-0.5 h-2 bg-amber-400 rounded wave-bar-3" />
            <span className="w-0.5 h-3.5 bg-amber-400 rounded wave-bar-4" />
          </span>
        </div>
        <p className="text-sm md:text-base leading-relaxed line-clamp-3 text-amber-50 font-normal">
          {subState.text}
        </p>
      </div>

      <button
        onClick={() => narrator.stop()}
        className="shrink-0 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg px-3 py-1.5 text-xs font-semibold inline-flex items-center gap-1 transition"
        title="Dừng đọc"
      >
        <X className="w-4 h-4" />
        <span>Dừng</span>
      </button>
    </div>
  );
};

import React from 'react';
import { Lock, Unlock } from 'lucide-react';
import { soundFx } from '../utils/sound';

interface PodiumVisualProps {
  unlockedLocks: boolean[];
  currentLock: number;
  onSelectUnlockedLock: (lockIndex: number) => void;
}

export const PodiumVisual: React.FC<PodiumVisualProps> = ({
  unlockedLocks,
  currentLock,
  onSelectUnlockedLock,
}) => {
  const unlockedCount = unlockedLocks.filter(Boolean).length;

  // Visual status text
  const getCaption = () => {
    if (unlockedCount === 0) return 'Micro đang tối (0/4)';
    if (unlockedCount < 4) return `Micro sáng dần (${unlockedCount}/4)`;
    return 'Micro đã thắp sáng hoàn toàn! (4/4)';
  };

  // SVG grill fill color and glow based on stage
  const getGrillFill = () => {
    switch (unlockedCount) {
      case 0:
        return '#475569';
      case 1:
        return '#78716c';
      case 2:
        return '#b45309';
      case 3:
        return '#f59e0b';
      case 4:
      default:
        return '#fef08a';
    }
  };

  const getGlowStyle = () => {
    switch (unlockedCount) {
      case 0:
        return { opacity: 0 };
      case 1:
        return { opacity: 0.35, background: 'radial-gradient(circle, rgba(245, 158, 11, 0.45) 0%, transparent 70%)' };
      case 2:
        return { opacity: 0.55, background: 'radial-gradient(circle, rgba(245, 158, 11, 0.55) 15%, transparent 75%)' };
      case 3:
        return { opacity: 0.75, background: 'radial-gradient(circle, rgba(245, 158, 11, 0.7) 35%, transparent 80%)' };
      case 4:
      default:
        return {
          opacity: 1,
          background: 'radial-gradient(circle, rgba(251, 191, 36, 0.9) 30%, rgba(245, 158, 11, 0.5) 60%, transparent 85%)',
          boxShadow: '0 0 50px rgba(245, 158, 11, 0.8)',
        };
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#fffdfa] via-[#fbf7ee] to-[#f4ecdc] border-2 border-[#d7caa8] rounded-2xl p-4 text-center shadow-lg flex flex-col items-center">
      <div className="font-serif-title text-base font-bold text-[#7f1d1d] tracking-wide">
        TIẾNG NÓI DIỄN VĂN
      </div>
      <div className="text-xs text-[#57534e] mb-2 font-medium">
        Thắp sáng qua từng ổ khóa
      </div>

      {/* Mic Graphic Container */}
      <div className="w-44 h-52 my-2 relative flex items-center justify-center">
        {/* Glow halo */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none transition-all duration-700"
          style={getGlowStyle()}
        />

        {/* Vintage Microphone SVG */}
        <svg
          className="w-36 h-48 drop-shadow-md transition-all duration-500"
          viewBox="0 0 100 160"
        >
          {/* Base */}
          <ellipse cx="50" cy="148" rx="38" ry="8" fill="#3e2723" stroke="#271510" strokeWidth="2" />
          <ellipse cx="50" cy="146" rx="28" ry="5" fill="#5d4037" />
          <rect x="47" y="110" width="6" height="36" fill="#78716c" />
          <rect x="44" y="105" width="12" height="6" rx="2" fill="#475569" />

          {/* Mount Frame */}
          <path d="M30 45 C30 20, 70 20, 70 45 L70 75 C70 95, 30 95, 30 75 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="3" />
          <path d="M22 55 C22 102, 78 102, 78 55" fill="none" stroke="#78716c" strokeWidth="4" strokeLinecap="round" />
          <circle cx="21" cy="55" r="4" fill="#a8a29e" />
          <circle cx="79" cy="55" r="4" fill="#a8a29e" />
          <line x1="50" y1="102" x2="50" y2="108" stroke="#78716c" strokeWidth="4" />

          {/* Inner Grill with reactive fill */}
          <path
            d="M34 46 C34 26, 66 26, 66 46 L66 74 C66 90, 34 90, 34 74 Z"
            fill={getGrillFill()}
            className="transition-colors duration-500"
            filter={unlockedCount === 4 ? 'drop-shadow(0 0 8px #f59e0b)' : undefined}
          />

          {/* Grill Lines */}
          <line x1="35" y1="42" x2="65" y2="42" stroke="#1c1917" strokeWidth="1.2" opacity="0.6" />
          <line x1="35" y1="52" x2="65" y2="52" stroke="#1c1917" strokeWidth="1.2" opacity="0.6" />
          <line x1="35" y1="62" x2="65" y2="62" stroke="#1c1917" strokeWidth="1.2" opacity="0.6" />
          <line x1="35" y1="72" x2="65" y2="72" stroke="#1c1917" strokeWidth="1.2" opacity="0.6" />
          <line x1="50" y1="30" x2="50" y2="84" stroke="#1c1917" strokeWidth="1.5" opacity="0.6" />
        </svg>
      </div>

      <div className="text-xs font-bold text-[#7f1d1d] mt-1">
        {getCaption()}
      </div>

      {/* 4 Lock Badges */}
      <div className="grid grid-cols-4 gap-2 w-full mt-3">
        {[1, 2, 3, 4].map((lockNum) => {
          const isUnlocked = unlockedLocks[lockNum - 1];
          const isCurrent = currentLock === lockNum;

          return (
            <button
              key={lockNum}
              type="button"
              disabled={!isUnlocked && !isCurrent}
              onClick={() => {
                if (isUnlocked) {
                  soundFx.playClick();
                  onSelectUnlockedLock(lockNum - 1);
                }
              }}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-bold transition-all ${
                isUnlocked
                  ? 'bg-[#fef3c7] border-2 border-[#d97706] text-[#7f1d1d] shadow-sm hover:scale-105 cursor-pointer'
                  : isCurrent
                  ? 'bg-[#f1ebd9] border-2 border-[#7f1d1d] text-[#7f1d1d] ring-2 ring-[#7f1d1d]/20'
                  : 'bg-[#f1ebd9] border border-[#d7caa8] text-[#78716c] opacity-60 cursor-not-allowed'
              }`}
              title={isUnlocked ? `Đã mở khóa ${lockNum} - Bấm để xem thông điệp` : `Khóa ${lockNum}`}
            >
              {isUnlocked ? (
                <Unlock className="w-4 h-4 mb-1 text-[#d97706]" />
              ) : (
                <Lock className="w-4 h-4 mb-1" />
              )}
              <span className="text-[11px]">Khóa {lockNum}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

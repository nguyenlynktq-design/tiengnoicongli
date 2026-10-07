import React from 'react';
import { CIPHER_PIECES } from '../constants/data';
import { Mail, Unlock } from 'lucide-react';

interface CipherTrackProps {
  unlockedLocks: boolean[];
}

export const CipherTrack: React.FC<CipherTrackProps> = ({ unlockedLocks }) => {
  return (
    <div className="bg-[#f5eedf] border-2 border-[#d7caa8] rounded-xl p-3 md:p-3.5 mb-4 shadow-inner">
      <div className="flex justify-between items-center mb-2.5 flex-wrap gap-2">
        <div className="font-serif-title font-bold text-xs md:text-sm text-[#7f1d1d] flex items-center gap-1.5">
          <Mail className="w-4 h-4 text-[#7f1d1d]" />
          <span>MẬT MÃ CÔNG LÍ (Bốn phong thư chờ giải mã):</span>
        </div>
        <span className="text-[11px] text-[#57534e] italic">
          Hoàn thành đúng từng thử thách để nhận mảnh mật mã
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {CIPHER_PIECES.map((piece, idx) => {
          const isUnlocked = unlockedLocks[idx];

          if (isUnlocked) {
            return (
              <div
                key={piece.id}
                className="bg-[#fffefb] border-2 border-[#d97706] rounded-xl p-2.5 text-center min-h-[96px] flex flex-col justify-center items-center shadow-md -translate-y-0.5 transition-all animate-in zoom-in-95 duration-300"
              >
                <div className="text-[11px] font-bold text-[#d97706] flex items-center gap-1">
                  <Unlock className="w-3 h-3" />
                  <span>Mảnh {piece.id}</span>
                </div>
                <div className="font-serif-title font-extrabold text-base md:text-lg text-[#7f1d1d] tracking-wider my-0.5">
                  {piece.word}
                </div>
                <div className="text-[10px] text-[#57534e] italic leading-tight">
                  {piece.context}
                </div>
              </div>
            );
          }

          return (
            <div
              key={piece.id}
              className="bg-gradient-to-br from-[#f7efe1] to-[#ece0ca] border border-[#cdbfa6] rounded-xl p-2.5 text-center min-h-[96px] flex flex-col justify-center items-center opacity-85 shadow-sm transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-[#991b1b] text-[#fef3c7] flex items-center justify-center text-xs font-bold shadow border border-[#7f1d1d] mb-1">
                {piece.id}
              </div>
              <div className="text-[11px] font-bold text-[#57534e] uppercase tracking-wide">
                Phong thư {piece.id}
              </div>
              <div className="text-[10px] text-[#78716c] italic">[Chưa mở]</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React from 'react';
import { Trophy } from 'lucide-react';
import { Team } from '../types';

interface ScoreboardProps {
  teams: Team[];
}

export const Scoreboard: React.FC<ScoreboardProps> = ({ teams }) => {
  return (
    <aside className="bg-[#fbf7ee] border-2 border-[#d7caa8] rounded-2xl p-4 shadow-md">
      <div className="font-serif-title text-base font-bold text-[#7f1d1d] mb-3 text-center flex items-center justify-center gap-1.5 border-b border-dashed border-[#d7caa8] pb-2">
        <Trophy className="w-4 h-4 text-[#d97706]" />
        <span>Bảng điểm thi đua</span>
      </div>

      <div className="flex flex-col gap-2">
        {teams.map((t) => (
          <div
            key={t.id}
            className="flex justify-between items-center bg-[#fffdfa] border border-[#ded5c2] rounded-xl px-3 py-2 shadow-xs hover:border-[#d97706] transition"
          >
            <span className="font-bold text-sm text-[#27272a] truncate mr-2">
              {t.name}
            </span>
            <span className="font-serif-title font-extrabold text-base md:text-lg text-[#d97706] bg-[#fef3c7] px-2.5 py-0.5 rounded-lg min-w-[48px] text-center shrink-0">
              {t.score}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3.5 text-[11px] text-[#57534e] text-center italic leading-tight">
        Điểm đúng: +10đ | Giải thích sâu: +5đ
      </div>
    </aside>
  );
};

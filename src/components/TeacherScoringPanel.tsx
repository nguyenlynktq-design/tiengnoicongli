import React from 'react';
import { Team, ScoreRecord } from '../types';
import { Award, Check, Edit2, Unlock } from 'lucide-react';
import { soundFx } from '../utils/sound';

interface TeacherScoringPanelProps {
  teams: Team[];
  currentRecords: Record<number, ScoreRecord>;
  isLocked: boolean;
  onRecordChange: (teamId: number, field: 'correct' | 'bonus', value: boolean) => void;
  onConfirmScores: () => void;
  onEditScores: () => void;
  canUnlockStep: boolean;
  onUnlockStep: () => void;
}

export const TeacherScoringPanel: React.FC<TeacherScoringPanelProps> = ({
  teams,
  currentRecords,
  isLocked,
  onRecordChange,
  onConfirmScores,
  onEditScores,
  canUnlockStep,
  onUnlockStep,
}) => {
  return (
    <div className="bg-[#f6efe1] border-2 border-[#ded3bd] rounded-2xl p-4 mt-5">
      <div className="font-serif-title text-sm md:text-base font-bold text-[#7f1d1d] mb-2.5 flex items-center gap-2">
        <Award className="w-5 h-5 text-[#d97706]" />
        <span>Bàn điều khiển Giáo viên (Cô Quyên): Chấm điểm & Mở khóa</span>
      </div>

      {/* Grid of 4 teams */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mb-3.5">
        {teams.map((team) => {
          const rec = currentRecords[team.id] || { correct: false, bonus: false };

          return (
            <div
              key={team.id}
              className="bg-[#fffdfa] border border-[#ded5c2] rounded-xl p-2.5 shadow-xs"
            >
              <div className="font-bold text-xs md:text-sm text-[#27272a] mb-1.5 truncate">
                {team.name}
              </div>

              <div className="flex flex-col gap-1 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rec.correct}
                    disabled={isLocked}
                    onChange={(e) => onRecordChange(team.id, 'correct', e.target.checked)}
                    className="accent-[#7f1d1d] rounded"
                  />
                  <span>Đáp án đúng (+10đ)</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rec.bonus}
                    disabled={isLocked}
                    onChange={(e) => onRecordChange(team.id, 'bonus', e.target.checked)}
                    className="accent-[#d97706] rounded"
                  />
                  <span>Giải thích tốt (+5đ)</span>
                </label>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {!isLocked ? (
          <button
            onClick={() => {
              soundFx.playClick();
              onConfirmScores();
            }}
            className="px-4 py-2 rounded-xl text-xs md:text-sm font-semibold bg-[#7f1d1d] text-white hover:bg-[#991b1b] shadow-sm inline-flex items-center gap-1.5 transition"
          >
            <Check className="w-4 h-4" />
            <span>Xác nhận điểm</span>
          </button>
        ) : (
          <button
            onClick={() => {
              soundFx.playClick();
              onEditScores();
            }}
            className="px-4 py-2 rounded-xl text-xs md:text-sm font-semibold bg-white border border-[#d7caa8] text-[#27272a] hover:bg-[#f9f5ec] inline-flex items-center gap-1.5 transition"
          >
            <Edit2 className="w-4 h-4" />
            <span>Sửa điểm</span>
          </button>
        )}

        <button
          onClick={() => {
            soundFx.playClick();
            onUnlockStep();
          }}
          disabled={!canUnlockStep}
          className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold text-white inline-flex items-center gap-2 transition shadow-md ${
            canUnlockStep
              ? 'bg-[#15803d] hover:bg-[#166534] shadow-emerald-900/30 cursor-pointer'
              : 'bg-zinc-400 opacity-60 cursor-not-allowed shadow-none'
          }`}
        >
          <Unlock className="w-4 h-4" />
          <span>Hoàn thành thử thách & Mở khóa</span>
        </button>
      </div>
    </div>
  );
};

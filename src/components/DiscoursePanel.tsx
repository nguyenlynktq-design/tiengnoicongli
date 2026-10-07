import React from 'react';
import { DISCOURSE_MESSAGES } from '../constants/data';
import { Volume2, Sparkles, Mic } from 'lucide-react';
import { narrator } from '../utils/audioNarrator';
import { soundFx } from '../utils/sound';

interface DiscoursePanelProps {
  unlockedLocks: boolean[];
  activeViewIndex: number | null;
  onSelectIndex: (index: number) => void;
  speakingId: string | null;
}

export const DiscoursePanel: React.FC<DiscoursePanelProps> = ({
  unlockedLocks,
  activeViewIndex,
  onSelectIndex,
  speakingId,
}) => {
  const unlockedCount = unlockedLocks.filter(Boolean).length;

  if (unlockedCount === 0) {
    return (
      <div className="w-full mt-3.5 bg-[#f3ecdc] border-2 border-dashed border-[#cfc2aa] rounded-xl p-3.5 text-center">
        <div className="text-xs font-bold text-[#57534e] mb-1 flex items-center justify-center gap-1.5">
          <Mic className="w-3.5 h-3.5 text-[#d97706]" />
          <span>THÔNG ĐIỆP DIỄN VĂN</span>
        </div>
        <p className="text-xs text-[#78716c] italic">
          Mở từng ổ khóa để đón nhận thông điệp ý nghĩa từ chiếc micro diễn văn.
        </p>
      </div>
    );
  }

  // Find target index to display
  let targetIndex = activeViewIndex !== null ? activeViewIndex : 0;
  if (!unlockedLocks[targetIndex]) {
    for (let i = 3; i >= 0; i--) {
      if (unlockedLocks[i]) {
        targetIndex = i;
        break;
      }
    }
  }

  const msg = DISCOURSE_MESSAGES[targetIndex];
  const isPlaying = speakingId === msg.audioId;

  const handlePlayVoice = () => {
    soundFx.playClick();
    narrator.speak(msg.audioScript, {
      audioId: msg.audioId,
      title: `🎙️ THÔNG ĐIỆP DIỄN VĂN (${msg.badge})`,
      promptGuidance:
        'Truyền đạt thông điệp nhân văn với giọng nữ Hà Nội đĩnh đạc, trầm ấm, truyền cảm hứng sâu sắc đến học sinh',
    });
  };

  return (
    <div className="w-full mt-3.5 bg-gradient-to-br from-[#fffefb] to-[#f7f0df] border-2 border-[#d97706] rounded-xl p-3.5 text-left shadow-md transition-all">
      <div className="flex justify-between items-center mb-1.5">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-[#7f1d1d] uppercase tracking-wide bg-[#fef3c7] border border-[#fde68a] px-2 py-0.5 rounded-md">
          <Sparkles className="w-3 h-3 text-[#d97706]" />
          {msg.badge}
        </span>
        <span className="text-xs font-bold text-[#7f1d1d]">{targetIndex + 1}/4</span>
      </div>

      <div className="font-bold text-xs text-[#7f1d1d] mb-1">
        {msg.title}
      </div>

      <blockquote className="font-serif-title italic text-xs md:text-sm text-[#27272a] border-l-2 border-[#d97706] pl-2.5 my-1.5 leading-relaxed">
        {msg.quote}
      </blockquote>

      <div className="text-[11px] text-[#57534e] leading-snug mb-2">
        💡 <strong>Bài học:</strong> {msg.lesson}
      </div>

      <div className="flex justify-between items-center pt-2 border-t border-dashed border-[#e5d8be]">
        <button
          onClick={handlePlayVoice}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border transition ${
            isPlaying
              ? 'bg-[#fef3c7] border-[#d97706] text-[#92400e] reading-pulse'
              : 'bg-[#fdf6e7] border-[#d97706] text-[#7f1d1d] hover:bg-[#fef3c7]'
          }`}
          title="Nghe cô giáo truyền đạt thông điệp ý nghĩa này bằng giọng nữ miền Bắc"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>{isPlaying ? 'Đang đọc...' : 'Nghe thông điệp'}</span>
        </button>

        {/* Quick Nav for Unlocked messages */}
        <div className="flex gap-1">
          {DISCOURSE_MESSAGES.map((_, idx) => {
            const unlocked = unlockedLocks[idx];
            const isSelected = idx === targetIndex;
            return (
              <button
                key={idx}
                type="button"
                disabled={!unlocked}
                onClick={() => {
                  if (unlocked) {
                    soundFx.playClick();
                    onSelectIndex(idx);
                  }
                }}
                className={`w-5 h-5 text-[10px] font-bold rounded flex items-center justify-center border transition ${
                  isSelected
                    ? 'bg-[#7f1d1d] text-white border-[#7f1d1d]'
                    : unlocked
                    ? 'bg-white text-[#7f1d1d] border-[#d7caa8] hover:border-[#d97706]'
                    : 'bg-[#f0e9dc] text-[#a8a29e] border-[#e2d7c3] cursor-not-allowed opacity-50'
                }`}
                title={unlocked ? `Xem thông điệp khóa ${idx + 1}` : `Khóa ${idx + 1} chưa mở`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

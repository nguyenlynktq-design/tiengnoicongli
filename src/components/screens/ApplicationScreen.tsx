import React, { useState } from 'react';
import { CONCLUDING_SPEECH } from '../../constants/data';
import { Play, Square, RotateCcw, Volume2, Sparkles, MessageSquare, Info, ArrowRight } from 'lucide-react';
import { soundFx } from '../../utils/sound';
import { narrator } from '../../utils/audioNarrator';

interface ApplicationScreenProps {
  response: string;
  onResponseChange: (val: string) => void;
  onFinish: () => void;
  speakingId: string | null;
}

export const ApplicationScreen: React.FC<ApplicationScreenProps> = ({
  response,
  onResponseChange,
  onFinish,
  speakingId,
}) => {
  const [showHint, setShowHint] = useState<boolean>(false);
  const isConclusionPlaying = speakingId === CONCLUDING_SPEECH.audioId;
  const isCustomPlaying = speakingId === 'custom-student-response';

  const handlePlayConclusion = () => {
    soundFx.playClick();
    narrator.speak(CONCLUDING_SPEECH.text, {
      audioId: CONCLUDING_SPEECH.audioId,
      title: 'LỜI ĐÚC KẾT BÀI HỌC CỦA CÔ QUYÊN (GIỌNG NỮ HÀ NỘI)',
      promptGuidance:
        'Đọc lời đúc kết bài học với giọng nữ Hà Nội trầm ấm, trang trọng, giàu cảm xúc lắng đọng',
    });
  };

  const handleStopConclusion = () => {
    soundFx.playClick();
    narrator.stop();
  };

  const handleReplayConclusion = () => {
    soundFx.playClick();
    narrator.stop();
    handlePlayConclusion();
  };

  const handleSpeakStudentResponse = () => {
    soundFx.playClick();
    if (!response.trim()) return;

    narrator.speak(
      `Ý kiến đóng góp của lớp: ${response.trim()}`,
      {
        audioId: 'custom-student-response',
        title: 'TIẾNG NÓI HỌC SINH (CÔ QUYÊN ĐỌC LẠI)',
        promptGuidance:
          'Đọc lời chia sẻ chân thành, ấm áp, giàu tinh thần tôn trọng và thấu hiểu của học sinh',
      }
    );
  };

  return (
    <div className="parchment-card p-6 md:p-10 max-w-4xl mx-auto shadow-2xl animate-in fade-in duration-300">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2 flex-wrap">
          <span className="inline-block bg-[#fef3c7] text-[#d97706] border border-[#fcd34d] text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider">
            Giai đoạn Vận dụng
          </span>
          <span className="bg-[#7f1d1d] text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs">
            👩‍🏫 Hướng dẫn: Cô Quyên
          </span>
        </div>
        <h2 className="font-serif-title text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#7f1d1d] mb-1.5">
          MICRO DÀNH CHO EM
        </h2>
        <p className="text-sm md:text-base text-[#57534e]">
          “Lời nói có sức thuyết phục khi có lí lẽ, bằng chứng và tinh thần nhân văn.”
        </p>
      </div>

      {/* GRAND CIPHER BANNER */}
      <div className="bg-gradient-to-br from-[#fffcf6] to-[#fef3c7] border-2 border-[#f59e0b] rounded-2xl p-5 md:p-6 text-center mb-6 shadow-xl grand-cipher-glow">
        <div className="text-xs font-extrabold text-[#d97706] uppercase tracking-widest flex items-center justify-center gap-1.5 mb-1.5">
          <Sparkles className="w-4 h-4 text-[#f59e0b]" />
          <span>THÔNG ĐIỆP ĐÃ ĐƯỢC GIẢI MÃ ĐẦY ĐỦ TỪ 4 PHONG THƯ</span>
          <Sparkles className="w-4 h-4 text-[#f59e0b]" />
        </div>
        <div className="font-serif-title text-2xl sm:text-3xl md:text-4xl font-black text-[#7f1d1d] tracking-wide uppercase my-2 drop-shadow-xs">
          “AI CŨNG XỨNG ĐÁNG ĐƯỢC TÔN TRỌNG”
        </div>
        <div className="text-xs md:text-sm text-[#78350f] italic">
          (Mọi con người đều bình đẳng và có quyền thụ hưởng sự tôn trọng)
        </div>
      </div>

      {/* CONCLUDING SPEECH CARD */}
      <div className="bg-[#fffdf9] border border-[#dfd3be] border-l-4 border-l-[#d97706] rounded-r-2xl p-5 md:p-6 mb-6 shadow-xs">
        <div className="text-xs font-bold text-[#d97706] uppercase tracking-wider mb-1.5">
          Lời đúc kết bài học của Cô Quyên:
        </div>
        <blockquote className="font-serif-title text-sm md:text-base leading-relaxed text-[#27272a] italic mb-3">
          “{CONCLUDING_SPEECH.text}”
        </blockquote>
        <div className="text-[11px] text-[#78716c] pt-2 border-t border-dashed border-[#e2d7c3]">
          * Chú thích: Lời đúc kết do Cô Quyên biên soạn để định hướng bài học, không phải trích dẫn nguyên văn của tác giả Mác-tin Lu-thơ Kinh.
        </div>

        {/* Audio Controls cluster */}
        <div className="flex flex-wrap items-center gap-2 mt-3.5 pt-3 border-t border-[#ebe2d0]">
          <button
            onClick={handlePlayConclusion}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg border transition inline-flex items-center gap-1.5 cursor-pointer ${
              isConclusionPlaying
                ? 'bg-[#fef3c7] border-[#d97706] text-[#92400e] reading-pulse'
                : 'bg-[#fbf5e8] border-[#d97706] text-[#7f1d1d] hover:bg-[#fef3c7]'
            }`}
            title="Nghe Cô Quyên đọc lời đúc kết bài học bằng giọng nữ Hà Nội"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isConclusionPlaying ? 'Đang đọc...' : 'Nghe Cô Quyên đúc kết'}</span>
          </button>

          <button
            onClick={handleStopConclusion}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border bg-white border-[#d7caa8] text-[#27272a] hover:bg-[#f9f5ec] inline-flex items-center gap-1 cursor-pointer"
            title="Dừng đọc"
          >
            <Square className="w-3 h-3 fill-current" />
            <span>Dừng</span>
          </button>

          <button
            onClick={handleReplayConclusion}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border bg-white border-[#d7caa8] text-[#27272a] hover:bg-[#f9f5ec] inline-flex items-center gap-1 cursor-pointer"
            title="Nghe lại từ đầu"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Nghe lại</span>
          </button>
        </div>
      </div>

      {/* SCHOOL SITUATION BOX */}
      <div className="bg-[#fbf7ee] border-l-4 border-[#d97706] rounded-r-2xl p-5 mb-5 shadow-xs">
        <div className="font-bold text-sm md:text-base text-[#7f1d1d] mb-1.5 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[#d97706]" />
          <span>Tình huống thực tế học đường:</span>
        </div>
        <p className="text-sm md:text-base text-[#27272a] font-medium leading-relaxed">
          “Một bạn trong nhóm chat lớp bị chế giễu vì giọng nói vùng miền. Em sẽ nói điều gì để bảo
          vệ bạn một cách tôn trọng?”
        </p>
        <p className="text-xs text-[#57534e] mt-2 italic">
          * Hướng dẫn: Nêu một quan điểm có lí do và một hành động cụ thể để ngăn chặn hành vi trêu chọc.
        </p>
      </div>

      {/* TEXTAREA INPUT */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1.5">
          <label className="text-xs md:text-sm font-bold text-[#7f1d1d]">
            Ý kiến đóng góp chung của lớp (Ghi lại quan điểm & giải pháp):
          </label>
          {response.trim() && (
            <button
              onClick={handleSpeakStudentResponse}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition inline-flex items-center gap-1 cursor-pointer ${
                isCustomPlaying
                  ? 'bg-[#fef3c7] border-[#d97706] text-[#92400e] reading-pulse'
                  : 'bg-[#fdf6e7] border-[#d97706] text-[#7f1d1d] hover:bg-[#fef3c7]'
              }`}
              title="Nghe giọng AI đọc ý kiến của lớp"
            >
              <Volume2 className="w-3.5 h-3.5 text-[#d97706]" />
              <span>{isCustomPlaying ? 'Đang đọc...' : 'Cô Quyên đọc lại ý kiến này'}</span>
            </button>
          )}
        </div>

        <textarea
          value={response}
          onChange={(e) => onResponseChange(e.target.value)}
          placeholder="Nhập ý kiến thảo luận, quan điểm và hành động cụ thể của lớp vào đây..."
          className="w-full h-32 p-3.5 text-sm md:text-base bg-[#fffdfa] border-2 border-[#d7caa8] rounded-xl text-[#27272a] focus:outline-none focus:border-[#d97706] focus:ring-1 focus:ring-[#d97706] leading-relaxed resize-y"
        />
      </div>

      {/* COLLAPSIBLE HINT DRAWER */}
      {showHint && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 text-xs md:text-sm text-amber-950 mb-4 animate-in fade-in duration-200">
          <strong>Gợi ý tham khảo:</strong> “Giọng nói khác nhau không làm giảm giá trị của một người.
          Chúng ta hãy dừng lời chế giễu và đối xử với bạn bằng sự tôn trọng.”
        </div>
      )}

      {/* FOOTER ACTIONS */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <button
          onClick={() => {
            soundFx.playClick();
            setShowHint(!showHint);
          }}
          className="px-4 py-2 text-xs md:text-sm font-semibold rounded-xl bg-[#f1ebd9] border border-[#d7caa8] hover:bg-[#e6ddc5] text-[#27272a] inline-flex items-center gap-1.5 transition cursor-pointer"
        >
          <Info className="w-4 h-4 text-[#d97706]" />
          <span>{showHint ? 'Ẩn gợi ý' : 'Xem gợi ý tham khảo'}</span>
        </button>

        <button
          onClick={() => {
            soundFx.playClick();
            narrator.stop();
            onFinish();
          }}
          className="px-6 py-3 rounded-xl font-serif-title font-bold text-sm md:text-base text-white bg-gradient-to-r from-[#7f1d1d] to-[#991b1b] hover:from-[#991b1b] hover:to-[#b91c1c] shadow-md flex items-center gap-2 cursor-pointer transition"
        >
          <span>Hoàn thành bài học & Xem tổng kết</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

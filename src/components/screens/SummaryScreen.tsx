import React from 'react';
import { Team } from '../../types';
import { CORE_TAKEAWAYS } from '../../constants/data';
import { Trophy, Volume2, Printer, Home, RotateCcw, CheckCircle2, BookOpen, Quote } from 'lucide-react';
import { soundFx } from '../../utils/sound';
import { narrator } from '../../utils/audioNarrator';

interface SummaryScreenProps {
  teams: Team[];
  applicationResponse: string;
  onHome: () => void;
  onRestart: () => void;
  speakingId: string | null;
}

export const SummaryScreen: React.FC<SummaryScreenProps> = ({
  teams,
  applicationResponse,
  onHome,
  onRestart,
  speakingId,
}) => {
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
  const isCelebratePlaying = speakingId === 'celebrate';

  const handleCelebrateVoice = () => {
    soundFx.playClick();
    const script =
      'Xin nhiệt liệt chúc mừng cả lớp chúng ta! Cả bốn ổ khóa kiến thức đã được mở trọn vẹn! Chiếc micro công lí đã bừng sáng rực rỡ! Xin nồng nhiệt biểu dương các đội chơi đã xuất sắc hoàn thành thử thách. Và thông điệp quý giá nhất chúng ta cùng khắc ghi hôm nay chính là: Ai cũng xứng đáng được tôn trọng!';

    narrator.speak(script, {
      audioId: 'celebrate',
      title: '🎉 VINH DANH THI ĐUA & KẾT QUẢ - CÔ QUYÊN',
      promptGuidance:
        'Xướng tên các đội và chúc mừng bằng giọng nữ Hà Nội hào hứng, reo vui, phấn khởi và nhiệt liệt',
    });
  };

  const handlePrint = () => {
    soundFx.playClick();
    window.print();
  };

  return (
    <div className="parchment-card p-6 md:p-10 max-w-4xl mx-auto shadow-2xl animate-in fade-in duration-300">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2 flex-wrap">
          <span className="inline-block bg-[#fef3c7] text-[#d97706] border border-[#fcd34d] text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider">
            Tổng kết tiết học 1
          </span>
          <span className="bg-[#7f1d1d] text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs">
            👩‍🏫 Giáo viên bộ môn: Cô Quyên
          </span>
        </div>
        <h2 className="font-serif-title text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#7f1d1d] mb-1.5">
          BẢN TỔNG KẾT BÀI HỌC VÀ THI ĐUA
        </h2>
        <p className="text-sm md:text-base text-[#57534e]">
          Đã hoàn thành xuất sắc mở 4/4 ổ khóa kiến thức
        </p>

        {/* Celebratory Audio Announcement */}
        <div className="mt-4 flex justify-center no-print">
          <button
            onClick={handleCelebrateVoice}
            className={`px-5 py-2.5 rounded-xl font-serif-title font-bold text-sm md:text-base border transition flex items-center gap-2 cursor-pointer shadow-md ${
              isCelebratePlaying
                ? 'bg-amber-100 border-amber-500 text-amber-950 reading-pulse'
                : 'bg-gradient-to-r from-[#b45309] to-[#d97706] text-white hover:from-[#92400e] hover:to-[#b45309] border-transparent'
            }`}
            title="Nghe Cô Quyên công bố kết quả và chúc mừng các đội thi đua"
          >
            <Volume2 className="w-5 h-5" />
            <span>{isCelebratePlaying ? 'Đang công bố kết quả...' : '🎉 Nghe Cô Quyên công bố kết quả'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        {/* Ranked Leaderboard */}
        <div className="bg-[#fffdfa] border-2 border-[#d7caa8] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="font-serif-title text-base font-bold text-[#7f1d1d] mb-3 border-b border-[#ece4d4] pb-2 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#d97706]" />
              <span>Bảng xếp hạng 4 đội chơi</span>
            </div>

            <div className="space-y-2">
              {sortedTeams.map((team, idx) => {
                let rank = idx + 1;
                if (idx > 0 && team.score === sortedTeams[idx - 1].score) {
                  rank = idx;
                }
                const isTop = rank === 1;

                return (
                  <div
                    key={team.id}
                    className={`flex justify-between items-center px-3.5 py-2 rounded-xl border transition ${
                      isTop
                        ? 'bg-[#fef3c7] border-[#f59e0b] shadow-xs'
                        : 'bg-[#fbf7ee] border-[#ded5c2]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-extrabold px-2 py-0.5 rounded-md ${
                          isTop ? 'bg-[#7f1d1d] text-white' : 'bg-[#e7dfcf] text-[#57534e]'
                        }`}
                      >
                        Hạng {rank}
                      </span>
                      <span className="font-bold text-sm text-[#27272a]">{team.name}</span>
                    </div>
                    <span className="font-serif-title font-extrabold text-base text-[#d97706]">
                      {team.score} điểm
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 bg-[#fef3c7] border border-[#f59e0b] rounded-xl p-3 text-center">
            <div className="text-[11px] font-extrabold text-[#b45309] uppercase tracking-wider">
              Mật mã công lí đã mở:
            </div>
            <div className="font-serif-title font-black text-sm md:text-base text-[#7f1d1d] mt-0.5">
              “AI CŨNG XỨNG ĐÁNG ĐƯỢC TÔN TRỌNG”
            </div>
          </div>
        </div>

        {/* 4 Core Takeaways */}
        <div className="bg-[#fffdfa] border-2 border-[#d7caa8] rounded-2xl p-5 shadow-xs">
          <div className="font-serif-title text-base font-bold text-[#7f1d1d] mb-3 border-b border-[#ece4d4] pb-2 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#d97706]" />
            <span>4 Kiến thức cốt lõi (Tiết 1)</span>
          </div>

          <ul className="space-y-2.5">
            {CORE_TAKEAWAYS.map((item) => (
              <li key={item.num} className="flex items-start gap-2.5 text-xs md:text-sm">
                <span className="w-6 h-6 rounded-full bg-[#7f1d1d] text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs shadow-xs">
                  {item.num}
                </span>
                <span className="leading-snug text-[#27272a]">
                  <strong>{item.title}:</strong> {item.desc}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Student Reflection View */}
      <div className="bg-[#fffdfa] border-2 border-[#d7caa8] rounded-2xl p-5 mb-6 shadow-xs">
        <div className="font-serif-title text-base font-bold text-[#7f1d1d] mb-2 border-b border-[#ece4d4] pb-2 flex items-center gap-2">
          <Quote className="w-5 h-5 text-[#d97706]" />
          <span>Tiếng nói công lí trong lớp học (Ý kiến vận dụng):</span>
        </div>
        <div className="bg-[#f4ecdc] border border-[#d7caa8] rounded-xl p-3.5 text-xs md:text-sm italic text-[#27272a] leading-relaxed">
          {applicationResponse
            ? `“${applicationResponse}”`
            : 'Lớp đã trao đổi sôi nổi trực tiếp trên lớp và cùng nhau đúc kết thông điệp tôn trọng danh dự, phẩm giá của mỗi cá nhân.'}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex flex-wrap justify-center items-center gap-3 no-print">
        <button
          onClick={handlePrint}
          className="px-4 py-2.5 text-xs md:text-sm font-semibold rounded-xl bg-[#f1ebd9] border border-[#d7caa8] hover:bg-[#e6ddc5] text-[#27272a] inline-flex items-center gap-1.5 transition cursor-pointer"
        >
          <Printer className="w-4 h-4 text-[#57534e]" />
          <span>In kết quả / Lưu PDF</span>
        </button>

        <button
          onClick={() => {
            soundFx.playClick();
            narrator.stop();
            onHome();
          }}
          className="px-4 py-2.5 text-xs md:text-sm font-semibold rounded-xl bg-[#f1ebd9] border border-[#d7caa8] hover:bg-[#e6ddc5] text-[#27272a] inline-flex items-center gap-1.5 transition cursor-pointer"
        >
          <Home className="w-4 h-4 text-[#57534e]" />
          <span>Trang chủ</span>
        </button>

        <button
          onClick={() => {
            soundFx.playClick();
            narrator.stop();
            onRestart();
          }}
          className="px-6 py-2.5 text-xs md:text-sm font-serif-title font-bold rounded-xl text-white bg-gradient-to-r from-[#7f1d1d] to-[#991b1b] hover:from-[#991b1b] hover:to-[#b91c1c] shadow-md inline-flex items-center gap-1.5 transition cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Chơi lại từ đầu</span>
        </button>
      </div>
    </div>
  );
};

import React from 'react';
import { Play, Volume2, HelpCircle, Users } from 'lucide-react';
import { soundFx } from '../../utils/sound';
import { narrator } from '../../utils/audioNarrator';

interface HomeScreenProps {
  teamNames: string[];
  onTeamNameChange: (index: number, name: string) => void;
  onStartGame: () => void;
  onOpenGuide: () => void;
  speakingId: string | null;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  teamNames,
  onTeamNameChange,
  onStartGame,
  onOpenGuide,
  speakingId,
}) => {
  const isIntroPlaying = speakingId === 'intro';

  const handlePlayIntro = () => {
    soundFx.playClick();
    const script =
      'Xin kính chào các thầy cô giáo và các em học sinh thân mến! Chào mừng các em đến với hoạt động luyện tập và vận dụng: Mở khóa tiếng nói công lí, bài diễn văn Tôi có một ước mơ của Mác-tin Lu-thơ Kinh. Trước mắt chúng ta là chiếc micro đang chờ được thắp sáng. Bốn đội chơi sẽ cùng nhau vượt qua bốn ổ khóa kiến thức, mở bốn phong thư mật mã và hoàn thành thông điệp công lí đầy ý nghĩa. Xin mời các đội hãy cùng chuẩn bị và bắt đầu mở khóa!';

    narrator.speak(script, {
      audioId: 'intro',
      title: 'LỜI GIỚI THIỆU MỞ ĐẦU (GIỌNG NỮ MIỀN BẮC HÀ NỘI)',
      promptGuidance:
        'Nói lời chào đón khai mạc hoạt động học tập bằng chất giọng nữ Hà Nội nhẹ nhàng, thanh tao, ấm áp, truyền cảm hứng',
    });
  };

  return (
    <div className="parchment-card p-6 md:p-10 max-w-4xl mx-auto shadow-2xl animate-in fade-in duration-300">
      <div className="text-center max-w-3xl mx-auto">
        <span className="inline-block bg-[#fef3c7] text-[#d97706] border border-[#fcd34d] text-xs md:text-sm font-bold px-3.5 py-1 rounded-full uppercase tracking-wider mb-3.5">
          Hoạt động Luyện tập & Vận dụng (4–5 phút)
        </span>

        <h1 className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#7f1d1d] mb-3.5 leading-tight">
          MỞ KHÓA TIẾNG NÓI CÔNG LÍ
        </h1>

        <div className="font-serif-title italic text-base md:text-lg text-[#27272a] bg-[#f3ece0] border-l-4 border-[#d97706] px-5 py-4 rounded-r-xl my-4 text-left leading-relaxed shadow-inner">
          “Bốn ổ khóa đang chờ được mở. Hãy dùng kiến thức, lí lẽ và bằng chứng để thắp sáng chiếc micro của bài diễn văn.”
        </div>

        <p className="text-sm md:text-base text-[#57534e] my-4 leading-relaxed">
          Hành trình khám phá nghệ thuật lập luận trong Tiết 1 bài diễn văn{' '}
          <strong className="text-[#27272a]">“Tôi có một ước mơ”</strong> (Mác-tin Lu-thơ Kinh):
          làm sáng tỏ luận đề chống phân biệt chủng tộc, đối chiếu lời hứa - hiện thực và khẳng
          định tính cấp thiết của hành động vì bình đẳng.
        </p>

        {/* 4 Teams Setup */}
        <div className="bg-[#f2ebd9] border border-[#d7caa8] rounded-xl p-5 my-6 text-left shadow-xs">
          <div className="text-sm font-bold text-[#7f1d1d] mb-3 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#d97706]" />
            <span>Danh sách 4 đội thi đua (Có thể chỉnh sửa tên đội bên dưới):</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {teamNames.map((name, idx) => (
              <div key={idx} className="flex flex-col">
                <label className="text-[11px] font-bold text-[#57534e] uppercase mb-1">
                  Đội {idx + 1}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => onTeamNameChange(idx, e.target.value)}
                  className="w-full px-3 py-2 text-sm font-semibold bg-[#fffdfa] border border-[#d6caa8] rounded-lg text-[#27272a] focus:outline-none focus:border-[#d97706] focus:ring-1 focus:ring-[#d97706]"
                  placeholder={`Đội ${idx + 1}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center items-center gap-3.5 mt-5">
          <button
            onClick={() => {
              soundFx.playClick();
              narrator.stop();
              onStartGame();
            }}
            className="px-8 py-3.5 rounded-xl font-serif-title font-bold text-lg md:text-xl text-white bg-gradient-to-r from-[#7f1d1d] to-[#991b1b] hover:from-[#991b1b] hover:to-[#b91c1c] shadow-lg shadow-red-950/30 hover:-translate-y-0.5 transition flex items-center gap-2 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Bắt đầu mở khóa</span>
          </button>

          <button
            onClick={handlePlayIntro}
            className={`px-5 py-3 rounded-xl font-bold text-sm md:text-base border transition flex items-center gap-2 cursor-pointer ${
              isIntroPlaying
                ? 'bg-[#fef3c7] border-[#d97706] text-[#92400e] reading-pulse'
                : 'bg-[#f1ebd9] border-[#d7caa8] text-[#7f1d1d] hover:bg-[#e6ddc5]'
            }`}
            title="Nghe lời giới thiệu mở đầu từ cô giáo trợ lí ảo (Giọng nữ miền Bắc Hà Nội)"
          >
            <Volume2 className="w-5 h-5 text-[#d97706]" />
            <span>{isIntroPlaying ? 'Đang đọc...' : '🎙️ Nghe giới thiệu (Giọng nữ Hà Nội)'}</span>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              onOpenGuide();
            }}
            className="px-5 py-3 rounded-xl font-semibold text-sm md:text-base bg-[#f1ebd9] border border-[#d7caa8] text-[#27272a] hover:bg-[#e6ddc5] transition flex items-center gap-2 cursor-pointer"
          >
            <HelpCircle className="w-5 h-5 text-[#57534e]" />
            <span>Xem hướng dẫn chi tiết</span>
          </button>
        </div>
      </div>
    </div>
  );
};

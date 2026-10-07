import React from 'react';
import { Volume2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { soundFx } from '../../utils/sound';
import { narrator } from '../../utils/audioNarrator';

interface GuideScreenProps {
  onBack: () => void;
  speakingId: string | null;
}

export const GuideScreen: React.FC<GuideScreenProps> = ({ onBack, speakingId }) => {
  const isGuidePlaying = speakingId === 'guide';

  const handlePlayGuide = () => {
    soundFx.playClick();
    const script =
      'Sau đây là quy tắc hoạt động của lớp học: Lớp chia thành bốn đội chơi. Chúng ta sẽ cùng nhau mở bốn ổ khóa kiến thức trọng tâm của Tiết một. Mỗi câu trả lời đúng được cộng mười điểm. Giải thích sâu sắc có căn cứ văn bản được thầy cô cộng thêm năm điểm. Mỗi ổ khóa mở ra sẽ trao một phong thư mật mã và thắp sáng thêm chiếc micro diễn văn. Chúc các em thi đua sôi nổi và giành chiến thắng!';

    narrator.speak(script, {
      audioId: 'guide',
      title: 'HƯỚNG DẪN THỂ LỆ (GIỌNG NỮ MIỀN BẮC HÀ NỘI)',
      promptGuidance:
        'Đọc quy chế trò chơi rõ ràng, khúc chiết, chuẩn mực ngữ điệu giáo viên Hà Nội',
    });
  };

  return (
    <div className="parchment-card p-6 md:p-10 max-w-4xl mx-auto shadow-2xl animate-in fade-in duration-300">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2 border-b border-[#ded3bd] pb-3">
          <h2 className="font-serif-title text-2xl md:text-3xl font-bold text-[#7f1d1d]">
            Hướng dẫn tổ chức hoạt động lớp học
          </h2>
          <span className="bg-[#fef3c7] text-[#7f1d1d] border border-[#fde68a] text-xs font-bold px-3 py-1 rounded-full shadow-xs">
            👩‍🏫 Giáo viên hướng dẫn: Cô Quyên
          </span>
        </div>

        <div className="flex flex-col gap-4 text-sm md:text-base text-[#27272a] leading-relaxed">
          <div className="bg-white border border-[#d7caa8] rounded-xl p-4 shadow-xs">
            <strong className="text-[#7f1d1d] block mb-1 font-bold">
              1. Phân chia đội & Trả lời:
            </strong>
            <p className="text-[#57534e]">
              Lớp chia thành 4 đội chơi. Giáo viên điều khiển hệ thống trên màn chiếu trung tâm. Mỗi
              đội chuẩn bị bảng phụ để giơ đáp án trắc nghiệm hoặc báo cáo thứ tự ghép thẻ.
            </p>
          </div>

          <div className="bg-white border border-[#d7caa8] rounded-xl p-4 shadow-xs">
            <strong className="text-[#7f1d1d] block mb-1 font-bold">
              2. Thời gian suy nghĩ & Chấm điểm:
            </strong>
            <p className="text-[#57534e]">
              Mỗi thử thách có đồng hồ gợi ý 20 giây (có thể tạm dừng hoặc tắt). Hết giờ không tự động
              chuyển câu hay hiện đáp án.
            </p>
            <ul className="list-disc ml-5 mt-2 space-y-1 text-[#57534e]">
              <li>
                <strong className="text-[#27272a]">10 điểm:</strong> Đáp án chính xác.
              </li>
              <li>
                <strong className="text-[#27272a]">Thêm 5 điểm:</strong> Đội có phần giải thích
                thuyết phục, nêu đúng căn cứ văn bản theo quyết định của giáo viên.
              </li>
              <li>
                Giáo viên bấm “Xác nhận điểm” (chỉ cộng một lần cho mỗi ổ khóa; có nút “Sửa điểm” nếu
                cần sửa). Sai không bị trừ điểm.
              </li>
            </ul>
          </div>

          <div className="bg-white border border-[#d7caa8] rounded-xl p-4 shadow-xs">
            <strong className="text-[#7f1d1d] block mb-1 font-bold">
              3. Chiếc Micro, 4 Phong thư & 4 Ổ Khóa:
            </strong>
            <p className="text-[#57534e]">
              Sau khi xác nhận lời giải và bấm “Hoàn thành thử thách & Mở khóa”, ổ khóa sẽ mở, trao
              một mảnh mật mã công lí và thắp sáng thêm một phần chiếc micro. Khi mở đủ 4 ổ khóa, đại
              thông điệp được giải mã và chuyển sang phần vận dụng.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-center items-center gap-3">
          <button
            onClick={handlePlayGuide}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold border transition flex items-center gap-2 cursor-pointer ${
              isGuidePlaying
                ? 'bg-[#fef3c7] border-[#d97706] text-[#92400e] reading-pulse'
                : 'bg-[#f1ebd9] border-[#d7caa8] text-[#7f1d1d] hover:bg-[#e6ddc5]'
            }`}
            title="Nghe đọc quy tắc chơi bằng giọng nữ Hà Nội"
          >
            <Volume2 className="w-4 h-4 text-[#d97706]" />
            <span>{isGuidePlaying ? 'Đang đọc thể lệ...' : '🎙️ Nghe Cô Quyên đọc thể lệ'}</span>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              narrator.stop();
              onBack();
            }}
            className="px-6 py-2.5 rounded-xl font-serif-title font-bold text-sm md:text-base text-white bg-gradient-to-r from-[#7f1d1d] to-[#991b1b] hover:from-[#991b1b] hover:to-[#b91c1c] shadow-md flex items-center gap-2 cursor-pointer transition"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Đã hiểu, quay lại</span>
          </button>
        </div>
      </div>
    </div>
  );
};

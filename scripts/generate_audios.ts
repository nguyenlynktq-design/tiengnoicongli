import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

const AUDIO_ITEMS = [
  {
    id: "intro",
    text: "Xin kính chào các thầy cô giáo và các em học sinh thân mến! Chào mừng các em đến với hoạt động luyện tập và vận dụng: Mở khóa tiếng nói công lí, bài diễn văn Tôi có một ước mơ của Mác-tin Lu-thơ Kinh. Trước mắt chúng ta là chiếc micro đang chờ được thắp sáng. Bốn đội chơi sẽ cùng nhau vượt qua bốn ổ khóa kiến thức, mở bốn phong thư mật mã và hoàn thành thông điệp công lí đầy ý nghĩa. Xin mời các đội hãy cùng chuẩn bị và bắt đầu mở khóa!",
    style: "Đọc bằng giọng nữ miền Bắc Hà Nội thanh lịch, tròn vành rõ chữ, chuẩn mực sư phạm, tự nhiên và giàu cảm xúc",
    voice: "Aoede"
  },
  {
    id: "guide",
    text: "Sau đây là quy tắc hoạt động của lớp học: Lớp chia thành bốn đội chơi. Chúng ta sẽ cùng nhau mở bốn ổ khóa kiến thức trọng tâm của Tiết một. Mỗi câu trả lời đúng được cộng mười điểm. Giải thích sâu sắc có căn cứ văn bản được thầy cô cộng thêm năm điểm. Mỗi ổ khóa mở ra sẽ trao một phong thư mật mã và thắp sáng thêm chiếc micro diễn văn. Chúc các em thi đua sôi nổi và giành chiến thắng!",
    style: "Đọc rõ ràng, khúc chiết, chuẩn mực ngữ điệu giáo viên Hà Nội",
    voice: "Aoede"
  },
  {
    id: "q1",
    text: "Ổ khóa một: Vấn đề trọng tâm. Vấn đề trọng tâm của bài diễn văn Tôi có một ước mơ là gì? Phương án A: Giới thiệu cảnh quan nước Mỹ. Phương án B: Chống phân biệt chủng tộc, đòi quyền tự do và bình đẳng. Phương án C: Kể lại tuổi thơ của tác giả. Phương án D: Giới thiệu một chuyến đi.",
    style: "Đọc đề bài rõ ràng, phát âm từng phương án rành mạch, tốc độ vừa phải cho học sinh lắng nghe",
    voice: "Aoede"
  },
  {
    id: "a1",
    text: "Đáp án chính xác là phương án B: Chống phân biệt chủng tộc, đòi quyền tự do và bình đẳng. Lời giải thích: Các luận điểm của bài diễn văn đều hướng tới việc lên án sự phân biệt đối xử và kiên quyết đòi lại quyền tự do, bình đẳng thiêng liêng cho người da đen. Đây chính là luận đề bao trùm toàn bộ văn bản.",
    style: "Giảng giải đáp án bằng giọng nữ miền Bắc Hà Nội ân cần, sâu sắc, nhấn mạnh luận điểm văn học",
    voice: "Aoede"
  },
  {
    id: "discourse1",
    text: "Thông điệp từ Ổ khóa một: Mọi con người sinh ra đều có quyền tự do và bình đẳng. Khát vọng công lí là phẩm giá thiêng liêng nhất, không một thế lực nào có thể dập tắt.",
    style: "Truyền đạt thông điệp nhân văn với giọng nữ Hà Nội đĩnh đạc, trầm ấm, truyền cảm hứng sâu sắc đến học sinh",
    voice: "Aoede"
  },
  {
    id: "q2",
    text: "Ổ khóa hai: Lời hứa và hiện thực. Hãy ghép hai thẻ nội dung vào hai vị trí đối chiếu tương ứng: Vị trí một: Lời hứa giải phóng. Vị trí hai: Thực trạng sau một trăm năm. Thẻ A: Văn kiện giải phóng mở ra hi vọng tự do cho người nô lệ da đen. Thẻ B: Người da đen vẫn chịu phân biệt, nghèo đói và bị đẩy ra bên lề xã hội.",
    style: "Đọc rành mạch, rõ ràng các thẻ và vị trí đối chiếu",
    voice: "Aoede"
  },
  {
    id: "a2",
    text: "Đáp án chính xác: Vị trí một ghép với Thẻ A: Văn kiện giải phóng mở ra hi vọng tự do cho người nô lệ da đen. Vị trí hai ghép với Thẻ B: Người da đen vẫn chịu phân biệt, nghèo đói và bị đẩy ra bên lề xã hội. Lời giải thích: Tác giả đặt cạnh nhau giữa lời hứa trong lịch sử và thực trạng đau đớn sau một thế kỉ, tạo cơ sở thực tế vững chắc cho lời kêu gọi hành động.",
    style: "Giảng giải rành mạch, đối chiếu sắc bén bằng giọng nữ miền Bắc Hà Nội",
    voice: "Aoede"
  },
  {
    id: "discourse2",
    text: "Thông điệp từ Ổ khóa hai: Một lời hứa công lí chỉ có ý nghĩa khi nó được thắp sáng trong cuộc sống hàng ngày. Chúng ta phải dám nhìn thẳng vào thực tế để cùng nhau thay đổi.",
    style: "Trang trọng, ý nghĩa, giọng nữ Hà Nội truyền cảm",
    voice: "Aoede"
  },
  {
    id: "q3",
    text: "Ổ khóa ba: Điệp ngữ Đây là lúc. Điệp ngữ Đây là lúc trong văn bản thể hiện điều gì? Phương án A: Mong muốn trì hoãn việc thực hiện quyền bình đẳng. Phương án B: Sự hài lòng với thực trạng hiện tại. Phương án C: Tính cấp thiết của việc hành động vì công lí, bình đẳng. Phương án D: Sự do dự của tác giả.",
    style: "Đọc câu hỏi và các phương án rành mạch, nhịp nhàng",
    voice: "Aoede"
  },
  {
    id: "a3",
    text: "Đáp án chính xác là phương án C: Tính cấp thiết của việc hành động vì công lí, bình đẳng. Lời giải thích: Điệp ngữ Đây là lúc tạo nên âm hưởng dồn dập, đanh thép, thúc giục biến lời hứa dân chủ thành hiện thực ngay lập tức và khẳng định không thể tiếp tục chần chừ hay trì hoãn.",
    style: "Phân tích nghệ thuật điệp ngữ sâu sắc, ngữ điệu dứt khoát, thuyết phục",
    voice: "Aoede"
  },
  {
    id: "discourse3",
    text: "Thông điệp từ Ổ khóa ba: Thời điểm tốt nhất để đứng lên vì lẽ phải và lòng nhân ái luôn là ngay bây giờ. Không thể tiếp tục trì hoãn khi sự bất công vẫn còn tồn tại quanh ta.",
    style: "Giọng nữ miền Bắc sâu lắng, tha thiết và kiên định",
    voice: "Aoede"
  },
  {
    id: "q4",
    text: "Ổ khóa bốn: Cây cầu lập luận. Hãy sắp xếp ba thẻ theo đúng tiến trình lập luận từ thực trạng đến lời kêu gọi: Thẻ A: Vì vậy, không thể tiếp tục trì hoãn hành động vì công lí và bình đẳng. Thẻ B: Sau một trăm năm, người da đen vẫn chịu bất công. Thẻ C: Quyền tự do, bình đẳng chưa được bảo đảm trong thực tế.",
    style: "Đọc đề bài và các bước lập luận rõ ràng",
    voice: "Aoede"
  },
  {
    id: "a4",
    text: "Trình tự sắp xếp chính xác trên cây cầu lập luận là Thẻ B, đến Thẻ C, rồi đến Thẻ A. Bước một: Sau một trăm năm, người da đen vẫn chịu bất công. Bước hai: Quyền tự do, bình đẳng chưa được bảo đảm trong thực tế. Bước ba: Vì vậy, không thể tiếp tục trì hoãn hành động vì công lí và bình đẳng. Mạch lập luận đi từ sự thật hiển nhiên đến kết luận tất yếu.",
    style: "Giảng giải tính logic của mạch lập luận chặt chẽ",
    voice: "Aoede"
  },
  {
    id: "discourse4",
    text: "Thông điệp từ Ổ khóa bốn: Lí lẽ sắc bén bắt nguồn từ sự thật, và sẽ chạm đến trái tim khi gắn liền với tình yêu thương và lòng tôn trọng con người.",
    style: "Giọng đọc truyền cảm, ấm áp, đậm chất nhân văn",
    voice: "Aoede"
  },
  {
    id: "conclusion",
    text: "Một trăm năm sau, tiếng nói đòi công lí vẫn khiến chúng ta suy ngẫm. Không ai nên bị xem nhẹ vì màu da, giọng nói hay nơi mình sinh ra. Một thế giới công bằng bắt đầu từ cách chúng ta đối xử với người bên cạnh. Và ngay hôm nay, em có thể bắt đầu bằng một lời nói tôn trọng, một hành động tử tế.",
    style: "Đọc lời đúc kết bài học với giọng nữ Hà Nội trầm ấm, trang trọng, giàu cảm xúc lắng đọng",
    voice: "Aoede"
  },
  {
    id: "celebrate",
    text: "Xin nhiệt liệt chúc mừng cả lớp chúng ta! Cả bốn ổ khóa kiến thức đã được mở trọn vẹn! Chiếc micro công lí đã bừng sáng rực rỡ! Xin nồng nhiệt biểu dương các đội chơi đã xuất sắc hoàn thành thử thách. Và thông điệp quý giá nhất chúng ta cùng khắc ghi hôm nay chính là: Ai cũng xứng đáng được tôn trọng!",
    style: "Xướng tên và chúc mừng bằng giọng nữ Hà Nội hào hứng, reo vui, phấn khởi và nhiệt liệt",
    voice: "Aoede"
  }
];

async function generateAll() {
  const outputDir = path.resolve("./public/audio");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`Starting audio generation for ${AUDIO_ITEMS.length} tracks...`);

  for (let i = 0; i < AUDIO_ITEMS.length; i++) {
    const item = AUDIO_ITEMS[i];
    const filePath = path.join(outputDir, `${item.id}.wav`);

    if (fs.existsSync(filePath) && fs.statSync(filePath).size > 1000) {
      console.log(`[${i + 1}/${AUDIO_ITEMS.length}] Already exists: ${item.id}.wav (${fs.statSync(filePath).size} bytes)`);
      continue;
    }

    console.log(`[${i + 1}/${AUDIO_ITEMS.length}] Generating ${item.id}.wav...`);

    let success = false;
    let attempts = 0;
    while (!success && attempts < 5) {
      attempts++;
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash-lite-tts",
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: item.text,
                  speechMetadata: {
                    style: item.style,
                  },
                },
              ],
            },
          ],
          config: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: item.voice || "Aoede" },
              },
            },
          },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
          const buffer = Buffer.from(base64Audio, "base64");
          fs.writeFileSync(filePath, buffer);
          console.log(`  -> Saved ${item.id}.wav (${buffer.length} bytes)`);
          success = true;
        } else {
          console.warn(`  -> No audio data returned for ${item.id}`);
          break;
        }
      } catch (err: any) {
        if (err?.status === 429 || err?.message?.includes("429") || err?.message?.includes("quota")) {
          console.log(`  -> Rate limited (429). Waiting 35 seconds before retry (attempt ${attempts}/6)...`);
          await new Promise((r) => setTimeout(r, 35000));
        } else {
          console.error(`  -> Failed generating ${item.id}:`, err?.message || err);
          break;
        }
      }
    }

    // Delay between successful requests to stay within 3 RPM
    await new Promise((r) => setTimeout(r, 26000));
  }

  console.log("Audio generation completed!");
}

generateAll();

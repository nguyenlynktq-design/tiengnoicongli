import { Challenge, DiscourseMessage, CipherPiece } from '../types';

export const GAME_CONFIG = {
  totalLocks: 4,
  defaultTimer: 20,
};

export const CHALLENGES: Challenge[] = [
  {
    id: 1,
    title: "Ổ KHÓA 1: VẤN ĐỀ TRỌNG TÂM",
    prompt: "Vấn đề trọng tâm của bài diễn văn 'Tôi có một ước mơ' là gì?",
    type: "mcq",
    options: [
      { id: "A", text: "A. Giới thiệu cảnh quan nước Mỹ." },
      { id: "B", text: "B. Chống phân biệt chủng tộc, đòi quyền tự do và bình đẳng." },
      { id: "C", text: "C. Kể lại tuổi thơ của tác giả." },
      { id: "D", text: "D. Giới thiệu một chuyến đi." },
    ],
    correctAnswer: "B",
    explanation: "Các luận điểm của bài diễn văn hướng tới việc chống phân biệt chủng tộc và thực hiện quyền tự do, bình đẳng.",
    discussion: "Câu hỏi suy ngẫm: Vì sao đây là luận đề của toàn bộ văn bản?",
    hint: "Hãy nhớ lại mục tiêu lớn nhất mà Mác-tin Lu-thơ Kinh hướng tới trong cuộc tuần hành lịch sử năm 1963.",
    audioQuestionId: "q1",
    audioAnswerId: "a1",
  },
  {
    id: 2,
    title: "Ổ KHÓA 2: LỜI HỨA VÀ HIỆN THỰC",
    prompt: "Ghép hai thẻ nội dung vào hai vị trí đối chiếu tương ứng:",
    type: "matching",
    slots: [
      { id: "slot1", title: "Vị trí 1: LỜI HỨA GIẢI PHÓNG" },
      { id: "slot2", title: "Vị trí 2: THỰC TRẠNG SAU MỘT TRĂM NĂM" },
    ],
    cards: [
      { id: "cardA", code: "Thẻ A", text: "Văn kiện giải phóng mở ra hi vọng tự do cho người nô lệ da đen." },
      { id: "cardB", code: "Thẻ B", text: "Người da đen vẫn chịu phân biệt, nghèo đói và bị đẩy ra bên lề xã hội." },
    ],
    explanation: "Tác giả chỉ ra khoảng cách giữa lời hứa tự do và thực trạng bất công, tạo cơ sở vững chắc cho lời kêu gọi hành động.",
    discussion: "Câu hỏi suy ngẫm: Sự đối chiếu sắc bén này giúp tác giả làm rõ điều gì?",
    hint: "Hãy đối chiếu giữa văn kiện mang tính lịch sử trong quá khứ và cuộc sống thực tế sau một thế kỉ.",
    audioQuestionId: "q2",
    audioAnswerId: "a2",
  },
  {
    id: 3,
    title: "Ổ KHÓA 3: ĐÂY LÀ LÚC",
    prompt: "Điệp ngữ 'Đây là lúc' trong văn bản thể hiện điều gì?",
    type: "mcq",
    options: [
      { id: "A", text: "A. Mong muốn trì hoãn việc thực hiện quyền bình đẳng." },
      { id: "B", text: "B. Sự hài lòng với thực trạng hiện tại." },
      { id: "C", text: "C. Tính cấp thiết của việc hành động vì công lí, bình đẳng." },
      { id: "D", text: "D. Sự do dự của tác giả." },
    ],
    correctAnswer: "C",
    explanation: "Điệp ngữ tạo nhịp điệu dồn dập, thúc giục biến lời hứa dân chủ thành hiện thực và nhấn mạnh rằng không thể tiếp tục trì hoãn.",
    discussion: "Câu hỏi suy ngẫm: Chi tiết nào trong đoạn văn giúp em bác bỏ ý kiến 'chỉ cần chờ đợi, mọi việc sẽ tự thay đổi'?",
    hint: "Cụm từ 'đây là lúc' nhấn mạnh sự khẩn trương, không được chậm trễ.",
    audioQuestionId: "q3",
    audioAnswerId: "a3",
  },
  {
    id: 4,
    title: "Ổ KHÓA 4: CÂY CẦU LẬP LUẬN",
    prompt: "Sắp xếp 3 thẻ theo đúng tiến trình lập luận hợp lí từ thực trạng đến lời kêu gọi:",
    type: "ordering",
    cards: [
      { id: "cardA", code: "Thẻ A", text: "Vì vậy, không thể tiếp tục trì hoãn hành động vì công lí và bình đẳng." },
      { id: "cardB", code: "Thẻ B", text: "Sau một trăm năm, người da đen vẫn chịu bất công." },
      { id: "cardC", code: "Thẻ C", text: "Quyền tự do, bình đẳng chưa được bảo đảm trong thực tế." },
    ],
    correctOrder: ["cardB", "cardC", "cardA"],
    explanation: "Luận điểm 1 chỉ ra thực trạng bất công. Thực trạng ấy tạo cơ sở vững chắc để luận điểm 2 khẳng định tính cấp thiết của hành động (B ➔ C ➔ A).",
    discussion: "Câu hỏi suy ngẫm: Vì sao tác giả cần nêu thực trạng trước khi kêu gọi hành động quyết liệt?",
    hint: "Trật tự: Nêu thực tế mắt thấy tai nghe trước, chỉ rõ bản chất, rồi mới kết luận kêu gọi hành động.",
    audioQuestionId: "q4",
    audioAnswerId: "a4",
  },
];

export const DISCOURSE_MESSAGES: DiscourseMessage[] = [
  {
    lock: 1,
    badge: "KHÁT VỌNG BÌNH ĐẲNG",
    title: "Tiếng nói về phẩm giá con người",
    quote: "“Mọi con người sinh ra đều có quyền tự do và bình đẳng. Khát vọng công lí không bao giờ tắt.”",
    lesson: "Lên án sự phân biệt, khẳng định ai cũng có quyền được tôn trọng và đối xử công bằng.",
    audioScript: "Thông điệp từ Ổ khóa một: Mọi con người sinh ra đều có quyền tự do và bình đẳng. Khát vọng công lí là phẩm giá thiêng liêng nhất, không một thế lực nào có thể dập tắt.",
    audioId: "discourse1",
  },
  {
    lock: 2,
    badge: "LỜI HỨA & HIỆN THỰC",
    title: "Sức mạnh của sự thật",
    quote: "“Một lời hứa công lí chỉ có ý nghĩa khi nó được thắp sáng trong cuộc sống hàng ngày.”",
    lesson: "Dám nhìn thẳng vào khoảng cách giữa lời hứa và thực tế để thúc đẩy sự thay đổi tiến bộ.",
    audioScript: "Thông điệp từ Ổ khóa hai: Một lời hứa công lí chỉ có ý nghĩa khi được chuyển hóa thành hiện thực. Chúng ta phải dám nhìn thẳng vào thực trạng bất công để chung tay thay đổi.",
    audioId: "discourse2",
  },
  {
    lock: 3,
    badge: "ĐÂY LÀ LÚC",
    title: "Hành động vì lẽ phải",
    quote: "“Thời điểm tốt nhất để đứng lên vì lẽ phải và lòng nhân ái luôn là ngay bây giờ.”",
    lesson: "Không thể trì hoãn sự tử tế và lẽ công bằng. Hãy hành động ngay từ hôm nay.",
    audioScript: "Thông điệp từ Ổ khóa ba: Thời điểm tốt nhất để đứng lên bảo vệ lẽ phải luôn là ngay bây giờ. Không thể tiếp tục trì hoãn khi sự bất công vẫn còn tồn tại quanh ta.",
    audioId: "discourse3",
  },
  {
    lock: 4,
    badge: "CÂY CẦU LẬP LUẬN",
    title: "Lí lẽ gắn với trái tim",
    quote: "“Lí lẽ sắc bén bắt nguồn từ sự thật, và sẽ chạm đến trái tim khi gắn liền với tình yêu thương con người.”",
    lesson: "Lập luận thuyết phục là ngọn đuốc dẫn đường cho tinh thần nhân văn và công lí.",
    audioScript: "Thông điệp từ Ổ khóa bốn: Lí lẽ sắc bén bắt nguồn từ sự thật, và sức thuyết phục lớn nhất sẽ chạm tới muôn triệu trái tim khi bắt nguồn từ tình yêu thương và lòng tôn trọng con người.",
    audioId: "discourse4",
  },
];

export const CIPHER_PIECES: CipherPiece[] = [
  { id: 1, word: "AI CŨNG", context: "(Đại từ nhân xưng)" },
  { id: 2, word: "XỨNG ĐÁNG", context: "(Quyền bình đẳng)" },
  { id: 3, word: "ĐƯỢC", context: "(Được thụ hưởng)" },
  { id: 4, word: "TÔN TRỌNG", context: "(Giá trị con người)" },
];

export const CONCLUDING_SPEECH = {
  text: "Một trăm năm sau, tiếng nói đòi công lí vẫn khiến chúng ta suy ngẫm. Không ai nên bị xem nhẹ vì màu da, giọng nói hay nơi mình sinh ra. Một thế giới công bằng bắt đầu từ cách chúng ta đối xử với người bên cạnh. Và ngay hôm nay, em có thể bắt đầu bằng một lời nói tôn trọng, một hành động tử tế.",
  authorNote: "* Chú thích: Đây là lời đúc kết do giáo viên biên soạn để định hướng bài học, không phải trích dẫn nguyên văn của tác giả Mác-tin Lu-thơ Kinh.",
  audioId: "conclusion",
};

export const CORE_TAKEAWAYS = [
  {
    num: 1,
    title: "Luận đề toàn văn bản",
    desc: "Lên án nạn phân biệt chủng tộc, kiên quyết đòi quyền tự do và bình đẳng.",
  },
  {
    num: 2,
    title: "Nghệ thuật đối chiếu",
    desc: "Đặt cạnh nhau giữa lời hứa giải phóng (quá khứ) và thực trạng bất công (hiện thực).",
  },
  {
    num: 3,
    title: "Điệp ngữ “Đây là lúc”",
    desc: "Nhấn mạnh tính cấp thiết của hành động vì công lí, không thể tiếp tục trì hoãn.",
  },
  {
    num: 4,
    title: "Mạch lập luận chặt chẽ",
    desc: "Thực trạng bất công là cơ sở vững chắc để khẳng định yêu cầu hành động ngay.",
  },
];

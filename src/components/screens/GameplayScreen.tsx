import React, { useState, useEffect } from 'react';
import { CHALLENGES, GAME_CONFIG } from '../../constants/data';
import { Team, ScoreRecord } from '../../types';
import { Scoreboard } from '../Scoreboard';
import { PodiumVisual } from '../PodiumVisual';
import { DiscoursePanel } from '../DiscoursePanel';
import { CipherTrack } from '../CipherTrack';
import { Timer } from '../Timer';
import { TeacherScoringPanel } from '../TeacherScoringPanel';
import { soundFx } from '../../utils/sound';
import { narrator } from '../../utils/audioNarrator';
import {
  Lock,
  Volume2,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Eye,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';

interface GameplayScreenProps {
  teams: Team[];
  unlockedLocks: boolean[];
  currentLock: number;
  scoreRecords: Record<number, Record<number, ScoreRecord>>;
  scoresLockedForCurrentStep: boolean;
  activeDiscourseViewIndex: number | null;
  speakingId: string | null;
  onUpdateScoreRecord: (teamId: number, field: 'correct' | 'bonus', value: boolean) => void;
  onConfirmScores: () => void;
  onEditScores: () => void;
  onUnlockCurrentStep: () => void;
  onNextStep: () => void;
  onSelectUnlockedDiscourse: (index: number) => void;
}

export const GameplayScreen: React.FC<GameplayScreenProps> = ({
  teams,
  unlockedLocks,
  currentLock,
  scoreRecords,
  scoresLockedForCurrentStep,
  activeDiscourseViewIndex,
  speakingId,
  onUpdateScoreRecord,
  onConfirmScores,
  onEditScores,
  onUnlockCurrentStep,
  onNextStep,
  onSelectUnlockedDiscourse,
}) => {
  const challenge = CHALLENGES[currentLock - 1];

  // Local state for interactive challenge inputs
  const [mcqSelection, setMcqSelection] = useState<string | null>(null);
  const [matchingPlacements, setMatchingPlacements] = useState<{ slot1: string | null; slot2: string | null }>({
    slot1: null,
    slot2: null,
  });
  const [bridgePlacements, setBridgePlacements] = useState<(string | null)[]>([null, null, null]);
  const [selectedCardForPlacement, setSelectedCardForPlacement] = useState<string | null>(null);

  // Feedback state
  const [feedback, setFeedback] = useState<{
    type: 'correct' | 'incorrect' | 'hint' | 'warning';
    message: string;
    discussion?: string;
  } | null>(null);

  const [verifiedSuccess, setVerifiedSuccess] = useState<boolean>(unlockedLocks[currentLock - 1]);

  // Reset challenge inputs on currentLock change
  useEffect(() => {
    setMcqSelection(null);
    setMatchingPlacements({ slot1: null, slot2: null });
    setBridgePlacements([null, null, null]);
    setSelectedCardForPlacement(null);
    setFeedback(null);
    setVerifiedSuccess(unlockedLocks[currentLock - 1]);
  }, [currentLock, unlockedLocks]);

  // Handle Voice for Question
  const handleReadQuestion = () => {
    soundFx.playClick();
    let script = `${challenge.title}. ${challenge.prompt} `;
    if (challenge.type === 'mcq' && challenge.options) {
      challenge.options.forEach((opt) => {
        script += `${opt.text}. `;
      });
    } else if (challenge.type === 'matching') {
      script +=
        'Vị trí một: Lời hứa giải phóng. Vị trí hai: Thực trạng sau một trăm năm. Thẻ A: Văn kiện giải phóng mở ra hi vọng tự do cho người nô lệ da đen. Thẻ B: Người da đen vẫn chịu phân biệt, nghèo đói và bị đẩy ra bên lề xã hội.';
    } else if (challenge.type === 'ordering') {
      script +=
        'Hãy sắp xếp ba thẻ theo đúng tiến trình lập luận từ thực trạng đến lời kêu gọi: Thẻ A: Vì vậy, không thể tiếp tục trì hoãn hành động vì công lí và bình đẳng. Thẻ B: Sau một trăm năm, người da đen vẫn chịu bất công. Thẻ C: Quyền tự do, bình đẳng chưa được bảo đảm trong thực tế.';
    }

    narrator.speak(script, {
      audioId: challenge.audioQuestionId,
      title: `${challenge.title} (CÔ QUYÊN ĐỌC)`,
      promptGuidance:
        'Đọc đề bài rõ ràng, phát âm từng phương án rành mạch, tốc độ vừa phải cho học sinh lắng nghe',
    });
  };

  // Handle Voice for Explanation
  const handleReadExplanation = () => {
    soundFx.playClick();
    let script = '';
    if (challenge.id === 1) {
      script =
        'Đáp án chính xác là phương án B: Chống phân biệt chủng tộc, đòi quyền tự do và bình đẳng. Lời giải thích: Các luận điểm của bài diễn văn đều hướng tới việc lên án sự phân biệt đối xử và kiên quyết đòi lại quyền tự do, bình đẳng thiêng liêng cho người da đen. Đây chính là luận đề bao trùm toàn bộ văn bản.';
    } else if (challenge.id === 2) {
      script =
        'Đáp án chính xác: Vị trí một ghép với Thẻ A: Văn kiện giải phóng mở ra hi vọng tự do cho người nô lệ da đen. Vị trí hai ghép với Thẻ B: Người da đen vẫn chịu phân biệt, nghèo đói và bị đẩy ra bên lề xã hội. Lời giải thích: Tác giả chỉ ra khoảng cách giữa lời hứa tự do và thực trạng bất công, tạo cơ sở thực tế vững chắc cho lời kêu gọi hành động.';
    } else if (challenge.id === 3) {
      script =
        'Đáp án chính xác là phương án C: Tính cấp thiết của việc hành động vì công lí, bình đẳng. Lời giải thích: Điệp ngữ Đây là lúc tạo nên âm hưởng dồn dập, đanh thép, thúc giục biến lời hứa dân chủ thành hiện thực ngay lập tức và khẳng định không thể tiếp tục chần chừ hay trì hoãn.';
    } else if (challenge.id === 4) {
      script =
        'Trình tự sắp xếp chính xác trên cây cầu lập luận là Thẻ B, đến Thẻ C, rồi đến Thẻ A. Bước một: Sau một trăm năm, người da đen vẫn chịu bất công. Bước hai: Quyền tự do, bình đẳng chưa được bảo đảm trong thực tế. Bước ba: Vì vậy, không thể tiếp tục trì hoãn hành động vì công lí và bình đẳng. Mạch lập luận đi từ sự thật hiển nhiên đến kết luận tất yếu.';
    }

    narrator.speak(script, {
      audioId: challenge.audioAnswerId,
      title: `ĐÁP ÁN & GIẢNG GIẢI CỦA CÔ QUYÊN (${challenge.title})`,
      promptGuidance:
        'Giảng giải đáp án bằng giọng nữ miền Bắc Hà Nội ân cần, sâu sắc, nhấn mạnh luận điểm văn học',
    });
  };

  // Verify answer
  const handleVerify = () => {
    soundFx.playClick();
    let isCorrect = false;

    if (challenge.type === 'mcq') {
      if (!mcqSelection) {
        setFeedback({
          type: 'warning',
          message: 'Vui lòng chọn một phương án trước khi kiểm tra.',
        });
        return;
      }
      isCorrect = mcqSelection === challenge.correctAnswer;
    } else if (challenge.type === 'matching') {
      if (!matchingPlacements.slot1 || !matchingPlacements.slot2) {
        setFeedback({
          type: 'warning',
          message: 'Vui lòng ghép đầy đủ thẻ vào cả hai vị trí.',
        });
        return;
      }
      isCorrect = matchingPlacements.slot1 === 'cardA' && matchingPlacements.slot2 === 'cardB';
    } else if (challenge.type === 'ordering') {
      if (bridgePlacements.some((c) => c === null)) {
        setFeedback({
          type: 'warning',
          message: 'Vui lòng đặt đủ 3 thẻ lên cây cầu lập luận.',
        });
        return;
      }
      isCorrect =
        bridgePlacements[0] === 'cardB' &&
        bridgePlacements[1] === 'cardC' &&
        bridgePlacements[2] === 'cardA';
    }

    if (isCorrect) {
      soundFx.playCorrectChime();
      setFeedback({
        type: 'correct',
        message: `<strong>Chính xác!</strong> ${challenge.explanation}`,
        discussion: challenge.discussion,
      });
      setVerifiedSuccess(true);
    } else {
      setFeedback({
        type: 'incorrect',
        message: `<strong>Chưa chính xác!</strong> Hãy xem lại văn bản hoặc bấm “Gợi ý” để suy ngẫm thêm.`,
      });
    }
  };

  // Hint
  const handleShowHint = () => {
    soundFx.playClick();
    setFeedback({
      type: 'hint',
      message: `<strong>Gợi ý:</strong> ${challenge.hint}`,
    });
  };

  // Reveal Solution
  const handleRevealSolution = () => {
    soundFx.playClick();
    if (challenge.type === 'mcq' && challenge.correctAnswer) {
      setMcqSelection(challenge.correctAnswer);
    } else if (challenge.type === 'matching') {
      setMatchingPlacements({ slot1: 'cardA', slot2: 'cardB' });
    } else if (challenge.type === 'ordering') {
      setBridgePlacements(['cardB', 'cardC', 'cardA']);
    }

    setFeedback({
      type: 'correct',
      message: `<strong>Đáp án & Lời giải:</strong> ${challenge.explanation}`,
      discussion: challenge.discussion,
    });
    setVerifiedSuccess(true);
  };

  // Matching helper
  const handlePlaceMatching = (cardId: string, slotId: 'slot1' | 'slot2') => {
    soundFx.playClick();
    const otherSlot = slotId === 'slot1' ? 'slot2' : 'slot1';
    setMatchingPlacements((prev) => {
      const next = { ...prev };
      if (next[otherSlot] === cardId) next[otherSlot] = null;
      next[slotId] = cardId;
      return next;
    });
    setSelectedCardForPlacement(null);
  };

  // Bridge Ordering helper
  const handlePlaceBridge = (cardId: string, stepIndex: number) => {
    soundFx.playClick();
    setBridgePlacements((prev) => {
      const next = [...prev];
      // remove from other index if present
      for (let i = 0; i < 3; i++) {
        if (next[i] === cardId) next[i] = null;
      }
      next[stepIndex] = cardId;
      return next;
    });
    setSelectedCardForPlacement(null);
  };

  const unlockedCount = unlockedLocks.filter(Boolean).length;
  const isQuestionPlaying = speakingId === challenge.audioQuestionId;
  const isAnswerPlaying = speakingId === challenge.audioAnswerId;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-5 items-start animate-in fade-in duration-300">
      {/* Left Column: Scoreboard */}
      <Scoreboard teams={teams} />

      {/* Center Column: Challenge Main Area */}
      <main className="bg-[#fffdfa] border-2 border-[#d7caa8] rounded-2xl p-5 md:p-6 shadow-md">
        {/* Step Header */}
        <div className="flex flex-wrap justify-between items-center pb-3 mb-3.5 border-b border-[#ece4d4] gap-2">
          <div className="font-serif-title font-bold text-lg md:text-xl text-[#7f1d1d] flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#7f1d1d]" />
            <span>{challenge.title}</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleReadQuestion}
              className={`px-3 py-1 text-xs font-semibold rounded-lg border transition inline-flex items-center gap-1.5 cursor-pointer ${
                isQuestionPlaying
                  ? 'bg-[#fef3c7] border-[#d97706] text-[#92400e] reading-pulse'
                  : 'bg-white border-[#d7caa8] text-[#27272a] hover:bg-[#f9f5ec]'
              }`}
              title="Nghe Cô Quyên đọc câu hỏi bằng giọng nữ Hà Nội"
            >
              <Volume2 className="w-3.5 h-3.5 text-[#d97706]" />
              <span>{isQuestionPlaying ? 'Đang đọc...' : 'Cô Quyên đọc câu hỏi'}</span>
            </button>

            {feedback && (
              <button
                onClick={handleReadExplanation}
                className={`px-3 py-1 text-xs font-semibold rounded-lg border transition inline-flex items-center gap-1.5 cursor-pointer ${
                  isAnswerPlaying
                    ? 'bg-[#fef3c7] border-[#d97706] text-[#92400e] reading-pulse'
                    : 'bg-white border-[#d7caa8] text-[#27272a] hover:bg-[#f9f5ec]'
                }`}
                title="Nghe Cô Quyên đọc đáp án và phân tích chi tiết"
              >
                <Volume2 className="w-3.5 h-3.5 text-[#d97706]" />
                <span>{isAnswerPlaying ? 'Đang giảng...' : 'Cô Quyên giảng giải'}</span>
              </button>
            )}

            <span className="bg-[#fef3c7] text-[#d97706] border border-[#fcd34d] font-bold text-xs px-2.5 py-1 rounded-full">
              Đã mở {unlockedCount}/4 ổ khóa
            </span>
          </div>
        </div>

        {/* 4 MẬT MÃ CÔNG LÍ Envelopes Track */}
        <CipherTrack unlockedLocks={unlockedLocks} />

        {/* 20s Classroom Timer */}
        <Timer initialSeconds={GAME_CONFIG.defaultTimer} />

        {/* Prompt */}
        <div className="text-base md:text-lg font-semibold text-[#27272a] mb-4 leading-relaxed">
          {challenge.prompt}
        </div>

        {/* Challenge Body - Dynamic based on type */}
        {challenge.type === 'mcq' && challenge.options && (
          <div className="grid grid-cols-1 gap-2.5 mb-4">
            {challenge.options.map((opt) => {
              const isSelected = mcqSelection === opt.id;
              const isCorrectAnswer = opt.id === challenge.correctAnswer;
              const showResult = feedback && feedback.type !== 'hint' && feedback.type !== 'warning';

              let btnStyle = 'bg-[#fbf7ee] border-[#e2d7c3] text-[#27272a] hover:border-[#d97706]';
              if (showResult && isCorrectAnswer) {
                btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold ring-1 ring-emerald-500';
              } else if (showResult && isSelected && !isCorrectAnswer) {
                btnStyle = 'bg-rose-50 border-rose-500 text-rose-950 font-semibold';
              } else if (isSelected) {
                btnStyle = 'bg-[#fef3c7] border-[#d97706] text-[#7f1d1d] font-semibold ring-1 ring-[#d97706]';
              }

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setMcqSelection(opt.id);
                  }}
                  className={`border-2 rounded-xl p-3.5 text-left text-sm md:text-base flex items-center gap-3 transition cursor-pointer ${btnStyle}`}
                >
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 border transition ${
                      showResult && isCorrectAnswer
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : isSelected
                        ? 'bg-[#7f1d1d] text-white border-[#7f1d1d]'
                        : 'bg-white text-[#7f1d1d] border-[#d7caa8]'
                    }`}
                  >
                    {opt.id}
                  </span>
                  <span>{opt.text.replace(/^[A-D]\.\s*/, '')}</span>
                </button>
              );
            })}
          </div>
        )}

        {challenge.type === 'matching' && challenge.slots && challenge.cards && (
          <div className="space-y-4 mb-4">
            <p className="text-xs italic text-[#57534e]">
              * Kéo thẻ vào ô hoặc bấm thẻ rồi bấm ô để ghép (hỗ trợ cả máy tính và màn hình cảm ứng).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {challenge.slots.map((slot) => {
                const placedCardId =
                  slot.id === 'slot1' ? matchingPlacements.slot1 : matchingPlacements.slot2;
                const placedCard = challenge.cards?.find((c) => c.id === placedCardId);

                return (
                  <div
                    key={slot.id}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const cardId = e.dataTransfer.getData('text/plain');
                      if (cardId) handlePlaceMatching(cardId, slot.id as 'slot1' | 'slot2');
                    }}
                    onClick={() => {
                      if (selectedCardForPlacement) {
                        handlePlaceMatching(selectedCardForPlacement, slot.id as 'slot1' | 'slot2');
                      }
                    }}
                    className={`bg-[#f7f2e7] border-2 border-dashed border-[#c9bea7] rounded-xl p-3.5 min-h-[140px] flex flex-col transition hover:border-[#d97706] cursor-pointer ${
                      selectedCardForPlacement ? 'ring-2 ring-[#d97706]/40' : ''
                    }`}
                  >
                    <div className="font-serif-title font-bold text-xs md:text-sm text-[#7f1d1d] uppercase tracking-wide mb-2">
                      {slot.title}
                    </div>

                    <div className="flex-1 bg-white border border-[#e5dccb] rounded-lg p-2.5 flex items-center justify-center min-h-[75px]">
                      {placedCard ? (
                        <div className="bg-[#fffdfa] border-2 border-[#d4c7b0] rounded-lg p-2 text-xs md:text-sm font-medium text-[#27272a] shadow-xs flex items-center gap-2 w-full">
                          <span className="font-bold text-xs bg-[#ece3cf] text-[#7f1d1d] px-2 py-0.5 rounded shrink-0">
                            {placedCard.code}
                          </span>
                          <span>{placedCard.text}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-[#78716c] italic">
                          [Đặt thẻ vào đây]
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Matching Pool */}
            <div className="bg-[#f4ecdc] border border-[#d7caa8] rounded-xl p-3.5">
              <div className="text-xs font-bold text-[#57534e] uppercase mb-2">
                Thẻ nội dung cần ghép:
              </div>
              <div className="flex flex-col gap-2">
                {challenge.cards.map((card) => {
                  const isPlaced =
                    matchingPlacements.slot1 === card.id ||
                    matchingPlacements.slot2 === card.id;
                  const isSelected = selectedCardForPlacement === card.id;

                  return (
                    <div
                      key={card.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', card.id);
                        soundFx.playClick();
                      }}
                      onClick={() => {
                        soundFx.playClick();
                        setSelectedCardForPlacement(isSelected ? null : card.id);
                      }}
                      className={`bg-[#fffdfa] border-2 rounded-lg p-2.5 text-xs md:text-sm font-medium flex items-center gap-2.5 shadow-xs transition cursor-grab active:cursor-grabbing ${
                        isSelected
                          ? 'border-[#d97706] bg-[#fef3c7] ring-2 ring-[#d97706]'
                          : isPlaced
                          ? 'border-emerald-500/50 bg-emerald-50/50 opacity-80'
                          : 'border-[#d4c7b0] text-[#27272a] hover:border-[#d97706]'
                      }`}
                    >
                      <span className="font-bold text-xs bg-[#ece3cf] text-[#7f1d1d] px-2 py-0.5 rounded shrink-0">
                        {card.code}
                      </span>
                      <span>{card.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {challenge.type === 'ordering' && challenge.cards && (
          <div className="space-y-4 mb-4">
            <p className="text-xs italic text-[#57534e]">
              * Sắp xếp 3 thẻ theo đúng tiến trình lập luận. Bấm vào thẻ rồi bấm vị trí trên cầu, hoặc kéo thả.
            </p>

            {/* Bridge visualization */}
            <div className="bg-gradient-to-b from-[#f8f3e8] to-[#ece2ce] border-2 border-[#d1c4aa] rounded-2xl p-4">
              <div className="font-serif-title font-bold text-sm md:text-base text-[#7f1d1d]">
                🌉 CÂY CẦU LẬP LUẬN (Luận điểm 1 ➔ Luận điểm 2)
              </div>
              <div className="h-1 bg-gradient-to-r from-[#991b1b] via-[#d97706] to-[#15803d] rounded my-2" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                {['Bước 1: Nêu thực trạng', 'Bước 2: Chỉ rõ bản chất', 'Bước 3: Thúc giục hành động'].map(
                  (label, idx) => {
                    const cardId = bridgePlacements[idx];
                    const placedCard = challenge.cards?.find((c) => c.id === cardId);

                    return (
                      <div
                        key={idx}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          const droppedCardId = e.dataTransfer.getData('text/plain');
                          if (droppedCardId) handlePlaceBridge(droppedCardId, idx);
                        }}
                        onClick={() => {
                          if (selectedCardForPlacement) {
                            handlePlaceBridge(selectedCardForPlacement, idx);
                          }
                        }}
                        className={`bg-[#fffdfa] border-2 border-dashed border-[#c4b69d] rounded-xl p-2.5 min-h-[115px] flex flex-col transition hover:border-[#d97706] cursor-pointer ${
                          selectedCardForPlacement ? 'ring-2 ring-[#d97706]/30' : ''
                        }`}
                      >
                        <div className="text-xs font-bold text-[#7f1d1d] mb-1.5">{label}</div>
                        <div className="flex-1 bg-[#fffdfa] border border-[#e5dccb] rounded-lg p-2 flex items-center justify-center">
                          {placedCard ? (
                            <div className="text-xs font-medium text-[#27272a] flex items-center gap-1.5 w-full">
                              <span className="font-bold text-[11px] bg-[#ece3cf] text-[#7f1d1d] px-1.5 py-0.5 rounded shrink-0">
                                {placedCard.code}
                              </span>
                              <span className="line-clamp-3">{placedCard.text}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-[#78716c] italic">[Đặt thẻ vào đây]</span>
                          )}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            {/* Ordering Pool */}
            <div className="bg-[#f4ecdc] border border-[#d7caa8] rounded-xl p-3.5">
              <div className="flex justify-between items-center mb-2">
                <div className="text-xs font-bold text-[#57534e] uppercase">
                  Thẻ lập luận cần sắp xếp:
                </div>
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setBridgePlacements([null, null, null]);
                  }}
                  className="px-2.5 py-1 text-xs font-semibold rounded bg-white border border-[#d7caa8] text-[#27272a] hover:bg-[#f9f5ec] inline-flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Làm lại</span>
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {challenge.cards.map((card) => {
                  const isPlaced = bridgePlacements.includes(card.id);
                  const isSelected = selectedCardForPlacement === card.id;

                  return (
                    <div
                      key={card.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', card.id);
                        soundFx.playClick();
                      }}
                      onClick={() => {
                        soundFx.playClick();
                        setSelectedCardForPlacement(isSelected ? null : card.id);
                      }}
                      className={`bg-[#fffdfa] border-2 rounded-lg p-2.5 text-xs md:text-sm font-medium flex items-center gap-2.5 shadow-xs transition cursor-grab active:cursor-grabbing ${
                        isSelected
                          ? 'border-[#d97706] bg-[#fef3c7] ring-2 ring-[#d97706]'
                          : isPlaced
                          ? 'border-emerald-500/50 bg-emerald-50/50 opacity-80'
                          : 'border-[#d4c7b0] text-[#27272a] hover:border-[#d97706]'
                      }`}
                    >
                      <span className="font-bold text-xs bg-[#ece3cf] text-[#7f1d1d] px-2 py-0.5 rounded shrink-0">
                        {card.code}
                      </span>
                      <span>{card.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Feedback Box */}
        {feedback && (
          <div
            className={`p-4 rounded-xl text-xs md:text-sm leading-relaxed mb-4 transition-all animate-in fade-in duration-200 ${
              feedback.type === 'correct'
                ? 'bg-emerald-50 border-2 border-emerald-300 text-emerald-950'
                : feedback.type === 'incorrect'
                ? 'bg-rose-50 border-2 border-rose-300 text-rose-950'
                : feedback.type === 'hint'
                ? 'bg-amber-50 border-2 border-amber-300 text-amber-950'
                : 'bg-amber-50 border border-amber-200 text-amber-900'
            }`}
          >
            <div className="flex justify-between items-start gap-3 flex-wrap">
              <div
                className="flex-1"
                dangerouslySetInnerHTML={{ __html: feedback.message }}
              />
              <button
                onClick={handleReadExplanation}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition shrink-0 inline-flex items-center gap-1.5 cursor-pointer ${
                  isAnswerPlaying
                    ? 'bg-[#fef3c7] border-[#d97706] text-[#92400e] reading-pulse'
                    : 'bg-white border-[#d7caa8] text-[#7f1d1d] hover:bg-[#fef3c7]'
                }`}
                title="Nghe cô đọc đáp án và phân tích chi tiết"
              >
                <Volume2 className="w-3.5 h-3.5 text-[#d97706]" />
                <span>{isAnswerPlaying ? 'Đang giảng...' : 'Nghe Cô Quyên giảng giải'}</span>
              </button>
            </div>

            {feedback.discussion && (
              <div className="mt-2.5 pt-2 border-t border-black/10 italic font-semibold text-[#7f1d1d]">
                {feedback.discussion}
              </div>
            )}
          </div>
        )}

        {/* Teacher Scoring Panel */}
        <TeacherScoringPanel
          teams={teams}
          currentRecords={scoreRecords[currentLock] || {}}
          isLocked={scoresLockedForCurrentStep}
          onRecordChange={onUpdateScoreRecord}
          onConfirmScores={onConfirmScores}
          onEditScores={onEditScores}
          canUnlockStep={verifiedSuccess}
          onUnlockStep={onUnlockCurrentStep}
        />

        {/* Action Row */}
        <div className="flex flex-wrap items-center gap-2.5 mt-4 pt-3 border-t border-[#ece4d4]">
          <button
            onClick={handleVerify}
            className="px-4 py-2 rounded-xl text-xs md:text-sm font-semibold bg-[#d97706] hover:bg-[#b45309] text-white shadow-sm inline-flex items-center gap-1.5 transition cursor-pointer"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Kiểm tra đáp án</span>
          </button>

          <button
            onClick={handleShowHint}
            className="px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold bg-[#fbf7ee] border border-[#d7caa8] hover:bg-[#f0e6d2] text-[#27272a] inline-flex items-center gap-1.5 transition cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-[#d97706]" />
            <span>Gợi ý</span>
          </button>

          <button
            onClick={handleRevealSolution}
            className="px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold bg-[#fbf7ee] border border-[#d7caa8] hover:bg-[#f0e6d2] text-[#27272a] inline-flex items-center gap-1.5 transition cursor-pointer"
          >
            <Eye className="w-4 h-4 text-[#57534e]" />
            <span>Hiện lời giải</span>
          </button>

          {unlockedLocks[currentLock - 1] && (
            <button
              onClick={() => {
                soundFx.playClick();
                narrator.stop();
                onNextStep();
              }}
              className="ml-auto px-5 py-2 rounded-xl text-xs md:text-sm font-bold bg-[#7f1d1d] hover:bg-[#991b1b] text-white shadow-md inline-flex items-center gap-1.5 transition cursor-pointer animate-in fade-in"
            >
              <span>{currentLock < 4 ? 'Thử thách tiếp theo' : 'Tiến tới phần Vận dụng'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </main>

      {/* Right Column: Microphone Podium & Discourse Panel */}
      <aside className="flex flex-col gap-4">
        <PodiumVisual
          unlockedLocks={unlockedLocks}
          currentLock={currentLock}
          onSelectUnlockedLock={onSelectUnlockedDiscourse}
        />

        <DiscoursePanel
          unlockedLocks={unlockedLocks}
          activeViewIndex={activeDiscourseViewIndex}
          onSelectIndex={onSelectUnlockedDiscourse}
          speakingId={speakingId}
        />
      </aside>
    </div>
  );
};

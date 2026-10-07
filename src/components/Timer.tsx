import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { soundFx } from '../utils/sound';

interface TimerProps {
  initialSeconds?: number;
}

export const Timer: React.FC<TimerProps> = ({ initialSeconds = 20 }) => {
  const [seconds, setSeconds] = useState<number>(initialSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          if (prev <= 4) {
            soundFx.playTimerBeep();
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, seconds]);

  const toggleRun = () => {
    soundFx.playClick();
    if (seconds <= 0) {
      setSeconds(initialSeconds);
      setIsRunning(true);
    } else {
      setIsRunning(!isRunning);
    }
  };

  const handleReset = () => {
    soundFx.playClick();
    setIsRunning(false);
    setSeconds(initialSeconds);
  };

  const toggleVisibility = () => {
    soundFx.playClick();
    setIsVisible(!isVisible);
  };

  return (
    <div
      className={`flex items-center justify-between bg-[#f4ecdc] border border-[#d7caa8] rounded-xl px-3.5 py-2 mb-4 transition-opacity ${
        isVisible ? 'opacity-100' : 'opacity-35'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <Clock className="w-5 h-5 text-[#7f1d1d]" />
        <span className="font-bold text-xs md:text-sm text-[#27272a]">
          Thời gian suy nghĩ gợi ý:
        </span>
        <div
          className={`font-serif-title text-xl md:text-2xl font-extrabold min-w-[50px] ${
            seconds <= 5 && seconds > 0 ? 'timer-ending' : 'text-[#7f1d1d]'
          }`}
        >
          {seconds}s
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={toggleRun}
          className="px-2.5 py-1 text-xs font-semibold rounded-md border border-[#d7caa8] bg-white hover:bg-[#f9f5ec] text-[#27272a] inline-flex items-center gap-1 transition"
          title={isRunning ? 'Tạm dừng đồng hồ' : 'Tiếp tục đếm'}
        >
          {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isRunning ? 'Tạm dừng' : 'Tiếp tục'}</span>
        </button>

        <button
          onClick={handleReset}
          className="px-2.5 py-1 text-xs font-semibold rounded-md border border-[#d7caa8] bg-white hover:bg-[#f9f5ec] text-[#27272a] inline-flex items-center gap-1 transition"
          title="Đặt lại về 20 giây"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Đặt lại</span>
        </button>

        <button
          onClick={toggleVisibility}
          className="px-2.5 py-1 text-xs font-semibold rounded-md border border-[#d7caa8] bg-white hover:bg-[#f9f5ec] text-[#27272a] inline-flex items-center gap-1 transition"
          title={isVisible ? 'Ẩn mờ đồng hồ' : 'Hiện rõ đồng hồ'}
        >
          {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{isVisible ? 'Ẩn' : 'Hiện'}</span>
        </button>
      </div>
    </div>
  );
};

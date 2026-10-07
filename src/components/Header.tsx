import React, { useState, useEffect } from 'react';
import { Home, HelpCircle, Volume2, VolumeX, Maximize2, Minimize2, Mic, Gauge } from 'lucide-react';
import { soundFx } from '../utils/sound';
import { narrator } from '../utils/audioNarrator';

interface HeaderProps {
  currentScreen: string;
  onNavigate: (screen: 'home' | 'guide' | 'gameplay' | 'application' | 'summary') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentScreen, onNavigate }) => {
  const [isMuted, setIsMuted] = useState<boolean>(soundFx.isMuted());
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(narrator.getPlaybackRate());

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleToggleSound = () => {
    soundFx.init();
    const nextMuted = !isMuted;
    soundFx.setMuted(nextMuted);
    setIsMuted(nextMuted);
    if (nextMuted) {
      narrator.stop();
    } else {
      soundFx.playClick();
    }
  };

  const handleToggleFullscreen = () => {
    soundFx.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const handleRateCycle = () => {
    soundFx.playClick();
    const nextRate = playbackRate === 1.0 ? 1.15 : playbackRate === 1.15 ? 0.85 : 1.0;
    setPlaybackRate(nextRate);
    narrator.setPlaybackRate(nextRate);
  };

  return (
    <header className="flex flex-wrap justify-between items-center bg-[#f9f5ec]/95 border-2 border-[#d7caa8] rounded-xl px-5 py-3 shadow-xl mb-5 gap-3">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 bg-[#7f1d1d] rounded-xl flex items-center justify-center text-white shadow-md shadow-[#7f1d1d]/30">
          <Mic className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-serif-title text-xl md:text-2xl font-bold text-[#7f1d1d] tracking-wide">
            MỞ KHÓA TIẾNG NÓI CÔNG LÍ
          </h1>
          <p className="text-xs md:text-sm text-[#57534e] font-medium">
            Luyện tập Tiết 1: "Tôi có một ước mơ" - M.L. King (Ngữ văn 11)
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => {
            soundFx.playClick();
            onNavigate('home');
          }}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold border transition ${
            currentScreen === 'home'
              ? 'bg-[#fef3c7] border-[#d97706] text-[#7f1d1d]'
              : 'bg-[#f5f0e6] border-[#d7caa8] text-[#27272a] hover:bg-[#ebe3d3]'
          }`}
          title="Về trang chủ"
        >
          <Home className="w-4 h-4" />
          <span>Trang chủ</span>
        </button>

        <button
          onClick={() => {
            soundFx.playClick();
            onNavigate('guide');
          }}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold border transition ${
            currentScreen === 'guide'
              ? 'bg-[#fef3c7] border-[#d97706] text-[#7f1d1d]'
              : 'bg-[#f5f0e6] border-[#d7caa8] text-[#27272a] hover:bg-[#ebe3d3]'
          }`}
          title="Xem hướng dẫn chơi"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Hướng dẫn</span>
        </button>

        <button
          onClick={handleRateCycle}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold border bg-[#f5f0e6] border-[#d7caa8] text-[#27272a] hover:bg-[#ebe3d3] transition"
          title="Tốc độ giọng đọc AI (0.85x, 1.0x, 1.15x)"
        >
          <Gauge className="w-4 h-4 text-[#d97706]" />
          <span>{playbackRate}x</span>
        </button>

        <button
          onClick={handleToggleSound}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold border transition ${
            isMuted
              ? 'bg-rose-100 border-rose-300 text-rose-800'
              : 'bg-[#f5f0e6] border-[#d7caa8] text-[#27272a] hover:bg-[#ebe3d3]'
          }`}
          title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          <span>{isMuted ? 'Bật âm' : 'Tắt âm'}</span>
        </button>

        <button
          onClick={handleToggleFullscreen}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold border bg-[#f5f0e6] border-[#d7caa8] text-[#27272a] hover:bg-[#ebe3d3] transition"
          title="Toàn màn hình trình chiếu"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          <span className="hidden sm:inline">{isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}</span>
        </button>
      </div>
    </header>
  );
};

import React, { useState } from 'react';
import { Pause, Play, RotateCcw, LogOut, X } from 'lucide-react';
import { AppLanguage } from '../../types';
import { getT } from '../../utils/i18n';

interface FloatingGameControlProps {
  onExit: () => void;
  onRestart?: () => void;
  gameTitle?: string;
  language?: AppLanguage;
}

export const FloatingGameControl: React.FC<FloatingGameControlProps> = ({
  onExit,
  onRestart,
  gameTitle,
  language = 'es',
}) => {
  const [showPauseModal, setShowPauseModal] = useState(false);
  const t = getT(language);

  return (
    <>
      {/* Floating Retro Button */}
      <button
        onClick={() => setShowPauseModal(true)}
        type="button"
        title="Pausa / Opciones"
        className="fixed top-3 right-3 z-50 bg-[#1c1b1b] hover:bg-[#a62b2b] text-[#ffdeac] p-2.5 rounded-[4px] border-2 border-[#fabc4c] [box-shadow:inset_2px_2px_0px_#ffdeac,_inset_-2px_-2px_0px_#604100,_0px_4px_12px_rgba(0,0,0,0.9)] flex items-center gap-1.5 cursor-pointer font-press-start text-[9px] active:translate-y-0.5 transition select-none"
      >
        <Pause className="w-3.5 h-3.5 text-[#fabc4c]" />
        <span className="hidden sm:inline">PAUSA</span>
      </button>

      {/* Retro Pause & Exit Modal */}
      {showPauseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm select-none font-silkscreen animate-in fade-in duration-150">
          <div className="w-full max-w-[340px] bg-[#1c1b1b] [border:2px_solid_#fabc4c] [box-shadow:inset_2px_2px_0px_#ffdeac,_inset_-2px_-2px_0px_#604100,_6px_6px_0px_#000000] p-4 flex flex-col gap-3 relative">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-[#353535]">
              <div className="flex items-center gap-2">
                <span className="text-xl">⏸️</span>
                <div>
                  <h3 className="text-[10px]/[13px] text-[#ffdeac] font-press-start tracking-[0.5px]">
                    {t.pauseTitle}
                  </h3>
                  {gameTitle && (
                    <span className="text-[8px]/[11px] text-[#76d4e4] block font-press-start truncate max-w-[200px]">
                      {gameTitle}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setShowPauseModal(false)}
                className="w-6 h-6 bg-[#0e0e0e] hover:bg-[#a62b2b] text-[#ffdeac] flex items-center justify-center rounded-[2px] border border-[#353535] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowPauseModal(false)}
                className="w-full h-10 bg-[#15803d] hover:bg-[#16a34a] text-[#dcfce7] font-press-start text-[9px] rounded-[3px] border-2 border-[#86efac] [box-shadow:inset_2px_2px_0px_#bbf7d0,_inset_-2px_-2px_0px_#14532d] flex items-center justify-center gap-2 cursor-pointer transition active:translate-y-0.5"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{t.resumeGame}</span>
              </button>

              {onRestart && (
                <button
                  type="button"
                  onClick={() => {
                    setShowPauseModal(false);
                    onRestart();
                  }}
                  className="w-full h-10 bg-[#155e75] hover:bg-[#0e7490] text-[#cffafe] font-press-start text-[9px] rounded-[3px] border-2 border-[#67e8f9] [box-shadow:inset_2px_2px_0px_#a5f3fc,_inset_-2px_-2px_0px_#164e63] flex items-center justify-center gap-2 cursor-pointer transition active:translate-y-0.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{t.restartGame}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setShowPauseModal(false);
                  onExit();
                }}
                className="w-full h-10 bg-[#a62b2b] hover:bg-[#b91c1c] text-[#fee2e2] font-press-start text-[9px] rounded-[3px] border-2 border-[#fca5a5] [box-shadow:inset_2px_2px_0px_#fecaca,_inset_-2px_-2px_0px_#7f1d1d] flex items-center justify-center gap-2 cursor-pointer transition active:translate-y-0.5"
              >
                <LogOut className="w-4 h-4" />
                <span>{t.exitGame}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

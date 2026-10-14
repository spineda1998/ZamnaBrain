import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, RefreshCw, Trophy, Sparkles, Scale, Check, AlertCircle } from 'lucide-react';
import { GrecaBar } from '../GrecaBar';

interface BalanzaSagradaProps {
  onClose: () => void;
  onReward?: (coins: number) => void;
}

export const BalanzaSagrada: React.FC<BalanzaSagradaProps> = ({ onClose, onReward }) => {
  // Targets to match
  const TARGETS = [
    { target: 14, label: 'Tributo de Pakal (14)', time: 30 },
    { target: 19, label: 'Ofrenda Solar (19)', time: 25 },
    { target: 25, label: 'Cuenta Vigesimal (25)', time: 25 },
    { target: 33, label: 'Ritual de Kukulcán (33)', time: 20 },
    { target: 48, label: 'Corona de Jade (48)', time: 20 },
  ];

  const [levelIdx, setLevelIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TARGETS[0].time);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [streak, setStreak] = useState(0);

  // Player's offering on the scale
  // weights: 1 (punto), 5 (barra), 20 (bolsa vigesimal)
  const [puntoCount, setPuntoCount] = useState(0);
  const [barraCount, setBarraCount] = useState(0);
  const [vigesimalCount, setVigesimalCount] = useState(0);

  const currentTarget = TARGETS[levelIdx] || TARGETS[TARGETS.length - 1];
  const playerTotal = puntoCount * 1 + barraCount * 5 + vigesimalCount * 20;
  const diff = playerTotal - currentTarget.target;

  // Calculate tilt angle (-15 to 15 deg)
  const tiltAngle = Math.max(-14, Math.min(14, diff * 2));

  // Timer
  useEffect(() => {
    if (isGameOver || isWon) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isGameOver, isWon]);

  const handleAdd = (val: 1 | 5 | 20) => {
    if (isGameOver || isWon) return;
    if (val === 1) setPuntoCount((p) => p + 1);
    if (val === 5) setBarraCount((b) => b + 1);
    if (val === 20) setVigesimalCount((v) => v + 1);
  };

  const handleResetBowl = () => {
    setPuntoCount(0);
    setBarraCount(0);
    setVigesimalCount(0);
  };

  const handleConfirmTribute = () => {
    if (isGameOver || isWon) return;

    if (playerTotal === currentTarget.target) {
      // Correct!
      const pointsWon = 500 + timeLeft * 10 + streak * 100;
      setScore((s) => s + pointsWon);
      setStreak((s) => s + 1);
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });

      if (levelIdx + 1 < TARGETS.length) {
        setLevelIdx((l) => l + 1);
        setTimeLeft(TARGETS[levelIdx + 1].time);
        handleResetBowl();
      } else {
        setIsWon(true);
        if (onReward) onReward(150);
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
      }
    } else {
      // Incorrect penalty
      setStreak(0);
      setTimeLeft((t) => Math.max(1, t - 3));
    }
  };

  const restartGame = () => {
    setLevelIdx(0);
    setScore(0);
    setTimeLeft(TARGETS[0].time);
    setIsGameOver(false);
    setIsWon(false);
    setStreak(0);
    handleResetBowl();
  };

  // Helper to render Mayan Glyphs for a number
  const renderMayanGlyphs = (num: number) => {
    const twenties = Math.floor(num / 20);
    const units = num % 20;
    const bars = Math.floor(units / 5);
    const dots = units % 5;

    return (
      <div className="flex flex-col items-center justify-center p-2 bg-[#0e0e0e] border border-[#fabc4c] rounded [box-shadow:inset_1px_1px_0px_#ffffff22]">
        {twenties > 0 && (
          <div className="flex flex-col items-center mb-1 pb-1 border-b border-[#fabc4c]/40">
            <span className="text-[7px] text-[#76d4e4] font-press-start">NIVEL 20 (x{twenties})</span>
            <div className="flex gap-1 mt-0.5">
              {Array.from({ length: twenties }).map((_, i) => (
                <div key={i} className="w-2.5 h-2.5 rounded-full bg-[#76d4e4] border border-white" />
              ))}
            </div>
          </div>
        )}
        {dots > 0 && (
          <div className="flex gap-1.5 mb-1.5">
            {Array.from({ length: dots }).map((_, i) => (
              <div key={i} className="w-3 h-3 rounded-full bg-[#fabc4c] border border-black shadow" />
            ))}
          </div>
        )}
        {bars > 0 && (
          <div className="flex flex-col gap-1 w-full items-center">
            {Array.from({ length: bars }).map((_, i) => (
              <div key={i} className="w-12 h-2 rounded-[2px] bg-[#fabc4c] border border-black shadow" />
            ))}
          </div>
        )}
        {num === 0 && (
          <span className="text-xl">🐚</span>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto px-2 py-3 pb-24 font-silkscreen select-none text-[#f4efe6]">
      {/* Top Bar */}
      <div className="w-full flex items-center justify-between pb-2">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-[9px] text-[#ffdeac] hover:text-[#fabc4c] font-press-start bg-[#20201f] hover:bg-[#2a2a2a] px-3 py-1.5 rounded-[2px] border border-[#353535] [box-shadow:0px_0px_0px_#0e0e0e,_inset_1.5px_1.5px_0px_#ffffff33,_inset_-1.5px_-1.5px_0px_#00000099] cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>SALIR</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="font-press-start text-[8px] text-[#3ca276] bg-[#0e0e0e] px-2 py-1 border border-[#1e6b4b]">
            PTS: {score}
          </span>
          <span className={`font-press-start text-[8px] px-2 py-1 border ${timeLeft <= 5 ? 'text-[#ff5449] border-[#ba1a1a] animate-pulse' : 'text-[#fabc4c] border-[#7a5009]'}`}>
            ⏳ {timeLeft}s
          </span>
        </div>
      </div>

      {/* Main Arcade Frame */}
      <div className="w-full bg-[#211719] border-2 border-[#7a5009] [box-shadow:3px_3px_0px_#0a0607,_inset_1px_1px_0px_#f5ebd226,_inset_-1px_-1px_0px_#00000099] p-3 rounded-[2px] flex flex-col gap-3">
        {/* Banner */}
        <div className="border-b border-[#a62b2b] pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[7.5px] font-press-start text-[#f4b238] bg-[#281e20] border border-[#a62b2b] px-2 py-0.5">
              CÁLCULO & PESO
            </span>
            <span className="text-[8px] font-press-start text-[#fabc4c]">
              RONDA {levelIdx + 1}/{TARGETS.length}
            </span>
          </div>
          {streak > 1 && (
            <span className="text-[7.5px] font-press-start text-[#76d4e4] animate-bounce">
              RACHA x{streak}!
            </span>
          )}
        </div>

        {/* Challenge Header */}
        <div className="text-center">
          <h2 className="text-[12px] font-press-start text-[#f5ebd2] tracking-wide">
            BALANZA DE JADE
          </h2>
          <p className="text-[10px] text-[#8a7e66] mt-0.5">
            {currentTarget.label}
          </p>
        </div>

        {/* The Animated Physical Scale */}
        <div className="relative w-full h-[160px] bg-[#120d0e] border border-[#a62b2b] rounded p-2 flex flex-col items-center justify-between overflow-hidden">
          {/* Fulcrum and Pivot */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#fabc4c] border-2 border-black z-10 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-black" />
          </div>
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[36px] border-b-[#58413f] z-0" />

          {/* Scale Beam */}
          <div
            className="w-full max-w-[280px] h-2 bg-[#d4af37] border border-black absolute top-5 transition-transform duration-300 ease-out origin-center flex justify-between items-center px-1"
            style={{ transform: `rotate(${tiltAngle}deg)` }}
          >
            {/* Left Pan: Gods' Target */}
            <div className="relative -bottom-16 -left-3 flex flex-col items-center">
              <div className="w-0.5 h-12 bg-[#fabc4c]/60" />
              <div className="w-24 bg-[#1b1a19] border-2 border-[#fabc4c] rounded p-1 text-center [box-shadow:0_4px_6px_rgba(0,0,0,0.5)]">
                <span className="text-[7px] font-press-start text-[#fabc4c] block mb-0.5">OBJETIVO</span>
                <div className="text-[14px] font-press-start text-white">{currentTarget.target}</div>
                {renderMayanGlyphs(currentTarget.target)}
              </div>
            </div>

            {/* Right Pan: Player Offering */}
            <div className="relative -bottom-16 -right-3 flex flex-col items-center">
              <div className="w-0.5 h-12 bg-[#76d4e4]/60" />
              <div className={`w-24 bg-[#1b1a19] border-2 ${diff === 0 ? 'border-[#3ca276] bg-[#0e2a1b]' : 'border-[#76d4e4]'} rounded p-1 text-center [box-shadow:0_4px_6px_rgba(0,0,0,0.5)] transition-colors`}>
                <span className="text-[7px] font-press-start text-[#76d4e4] block mb-0.5">TU OFRENDA</span>
                <div className={`text-[14px] font-press-start ${diff === 0 ? 'text-[#3ca276]' : 'text-[#76d4e4]'}`}>
                  {playerTotal}
                </div>
                {renderMayanGlyphs(playerTotal)}
              </div>
            </div>
          </div>

          {/* Indicator Status Message */}
          <div className="w-full text-center mt-auto z-10">
            {diff === 0 ? (
              <span className="inline-block text-[8px] font-press-start text-[#3ca276] bg-[#120d0e]/90 px-2 py-0.5 border border-[#1e6b4b] animate-pulse">
                ✓ EQUILIBRIO PERFECTO! CONFIRMA
              </span>
            ) : diff < 0 ? (
              <span className="inline-block text-[7.5px] font-press-start text-[#fabc4c] bg-[#120d0e]/90 px-2 py-0.5 border border-[#7a5009]">
                FALTAN {Math.abs(diff)} PUNTOS DE PESO
              </span>
            ) : (
              <span className="inline-block text-[7.5px] font-press-start text-[#ff5449] bg-[#120d0e]/90 px-2 py-0.5 border border-[#ba1a1a]">
                EXCEDIDO POR +{diff} PUNTOS
              </span>
            )}
          </div>
        </div>

        {/* Weights Buttons: Add Units */}
        <div className="flex flex-col gap-2 pt-1">
          <span className="text-[8px] font-press-start text-[#ffdeac] text-center">
            AGREGAR PESAS MAYAS A LA BALANZA
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleAdd(1)}
              className="p-2 bg-[#281e20] hover:bg-[#35272a] border border-[#a62b2b] rounded flex flex-col items-center gap-1 cursor-pointer active:scale-95 transition"
            >
              <div className="w-4 h-4 rounded-full bg-[#fabc4c] border border-black" />
              <span className="text-[8px] font-press-start text-[#fabc4c]">+1 PUNTO</span>
              <span className="text-[7px] text-[#8a7e66]">Unidad</span>
            </button>

            <button
              onClick={() => handleAdd(5)}
              className="p-2 bg-[#281e20] hover:bg-[#35272a] border border-[#a62b2b] rounded flex flex-col items-center gap-1 cursor-pointer active:scale-95 transition"
            >
              <div className="w-10 h-2.5 rounded-[2px] bg-[#fabc4c] border border-black mt-1" />
              <span className="text-[8px] font-press-start text-[#fabc4c] mt-0.5">+5 BARRA</span>
              <span className="text-[7px] text-[#8a7e66]">Quinquenio</span>
            </button>

            <button
              onClick={() => handleAdd(20)}
              className="p-2 bg-[#281e20] hover:bg-[#35272a] border border-[#a62b2b] rounded flex flex-col items-center gap-1 cursor-pointer active:scale-95 transition"
            >
              <div className="w-5 h-5 rounded bg-[#76d4e4] border border-black flex items-center justify-center font-press-start text-[7px] text-black font-bold">
                20
              </div>
              <span className="text-[8px] font-press-start text-[#76d4e4]">+20 K'AAN</span>
              <span className="text-[7px] text-[#8a7e66]">Base Vigesimal</span>
            </button>
          </div>
        </div>

        {/* Action Controls: Reset & Confirm */}
        <div className="flex gap-2 pt-1 border-t border-[#a62b2b]">
          <button
            onClick={handleResetBowl}
            className="flex-1 py-2 bg-[#1b1a19] hover:bg-[#2a2a2a] border border-[#58413f] text-[#ffdad7] font-press-start text-[8px] flex items-center justify-center gap-1 cursor-pointer active:scale-95"
          >
            <RefreshCw className="w-3 h-3" />
            <span>VACIAR</span>
          </button>

          <button
            onClick={handleConfirmTribute}
            className={`flex-2 py-2.5 font-press-start text-[9px] flex items-center justify-center gap-1.5 border cursor-pointer active:scale-95 transition ${
              diff === 0
                ? 'bg-[#1e6b4b] hover:bg-[#25825b] text-white border-[#3ca276] [box-shadow:0_0_8px_#3ca276]'
                : 'bg-[#281e20] hover:bg-[#382b2e] text-[#f4b238] border-[#a62b2b]'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>ENTREGAR TRIBUTO</span>
          </button>
        </div>
      </div>

      {/* Game Over / Victory Modal */}
      {(isGameOver || isWon) && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-xs bg-[#211719] border-2 border-[#fabc4c] p-4 text-center rounded flex flex-col gap-3 [box-shadow:4px_4px_0px_#000000]">
            <span className="text-3xl">{isWon ? '👑' : '⏳'}</span>
            <h3 className="font-press-start text-[12px] text-[#ffdeac]">
              {isWon ? '¡TRIBUTO ACEPTADO!' : '¡TIEMPO AGOTADO!'}
            </h3>
            <p className="font-silkscreen text-[10px] text-[#b8b09f]">
              {isWon
                ? `Has satisfecho a los Señores de Palenque con ${score} puntos.`
                : 'La balanza se ha desequilibrado. Vuelve a intentarlo.'}
            </p>
            <div className="flex gap-2 justify-center pt-2">
              <button
                onClick={restartGame}
                className="px-3 py-2 bg-[#d4af37] text-black font-press-start text-[8px] border border-black cursor-pointer"
              >
                REINTENTAR
              </button>
              <button
                onClick={onClose}
                className="px-3 py-2 bg-[#20201f] text-[#ffdeac] font-press-start text-[8px] border border-[#a62b2b] cursor-pointer"
              >
                VOLVER
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

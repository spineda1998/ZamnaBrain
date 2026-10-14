import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, RefreshCw, Zap, Target, Sparkles, Trophy } from 'lucide-react';

interface KukulcanOrbsProps {
  onClose: () => void;
  onReward?: (coins: number) => void;
}

interface SnakeOrb {
  id: string;
  value: number; // 1 to 19
  color: string;
}

const ORB_COLORS = [
  '#fabc4c', // Gold
  '#76d4e4', // Jade / Cyan
  '#e2725b', // Terracotta
  '#a62b2b', // Crimson
  '#b8bb26', // Lime
  '#d3869b', // Amethyst
];

export const KukulcanOrbs: React.FC<KukulcanOrbsProps> = ({ onClose, onReward }) => {
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [timeLeft, setTimeLeft] = useState(40);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWon, setIsWon] = useState(false);

  // The snake queue of orbs
  const [orbs, setOrbs] = useState<SnakeOrb[]>([]);
  // Player loaded orb (1 to 19)
  const [loadedOrb, setLoadedOrb] = useState<number>(8);
  const [reserveOrb, setReserveOrb] = useState<number>(12);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Initialize random orbs
  const generateRandomOrbs = (count: number = 8): SnakeOrb[] => {
    return Array.from({ length: count }).map((_, i) => {
      const val = Math.floor(Math.random() * 19) + 1;
      return {
        id: `orb-${Date.now()}-${i}-${Math.random()}`,
        value: val,
        color: ORB_COLORS[val % ORB_COLORS.length],
      };
    });
  };

  useEffect(() => {
    const initial = generateRandomOrbs(7);
    setOrbs(initial);
    // ensure loaded orb pairs with at least one in the snake
    const matching = 20 - initial[0].value;
    setLoadedOrb(matching > 0 && matching < 20 ? matching : 5);
    setReserveOrb(Math.floor(Math.random() * 19) + 1);
  }, []);

  // Timer
  useEffect(() => {
    if (isGameOver || isWon) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setIsGameOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isGameOver, isWon]);

  // Periodic new orb entering the snake
  useEffect(() => {
    if (isGameOver || isWon) return;
    const spawnTimer = setInterval(() => {
      setOrbs((prev) => {
        if (prev.length >= 10) {
          setIsGameOver(true);
          return prev;
        }
        const val = Math.floor(Math.random() * 19) + 1;
        return [
          ...prev,
          {
            id: `orb-${Date.now()}-${Math.random()}`,
            value: val,
            color: ORB_COLORS[val % ORB_COLORS.length],
          },
        ];
      });
    }, 4500);

    return () => clearInterval(spawnTimer);
  }, [isGameOver, isWon]);

  // Swap loaded and reserve
  const handleSwap = () => {
    const temp = loadedOrb;
    setLoadedOrb(reserveOrb);
    setReserveOrb(temp);
  };

  // Shoot at a specific target orb
  const handleShootAt = (targetOrb: SnakeOrb) => {
    if (isGameOver || isWon) return;

    const sum = loadedOrb + targetOrb.value;
    if (sum === 20) {
      // SUCCESS: exact 20!
      const points = 250 * combo;
      setScore((s) => s + points);
      setCombo((c) => Math.min(5, c + 1));
      setFeedback(`¡COLAPSO VIGESIMAL! ${loadedOrb} + ${targetOrb.value} = 20 (+${points} PTS)`);

      confetti({ particleCount: 25, spread: 50, origin: { y: 0.7 } });

      // Remove target orb
      setOrbs((prev) => {
        const next = prev.filter((o) => o.id !== targetOrb.id);
        if (next.length === 0) {
          setIsWon(true);
          if (onReward) onReward(120);
          confetti({ particleCount: 80, spread: 80, origin: { y: 0.5 } });
        }
        return next;
      });

      // Reload with new orb (prefer one that can pair with remaining)
      setLoadedOrb(reserveOrb);
      setReserveOrb(Math.floor(Math.random() * 19) + 1);
    } else {
      // MISMATCH
      setCombo(1);
      setFeedback(`FALLO: ${loadedOrb} + ${targetOrb.value} = ${sum} (Se requiere 20)`);
      setTimeLeft((t) => Math.max(1, t - 2));
    }

    setTimeout(() => {
      setFeedback(null);
    }, 1800);
  };

  const restart = () => {
    const initial = generateRandomOrbs(7);
    setOrbs(initial);
    const matching = 20 - initial[0].value;
    setLoadedOrb(matching > 0 && matching < 20 ? matching : 5);
    setReserveOrb(Math.floor(Math.random() * 19) + 1);
    setScore(0);
    setCombo(1);
    setTimeLeft(40);
    setIsGameOver(false);
    setIsWon(false);
    setFeedback(null);
  };

  return (
    <div className="w-full max-w-md mx-auto px-2 py-3 pb-24 font-silkscreen select-none text-[#f4efe6]">
      {/* Top Header */}
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
          <span className="text-[7.5px] font-press-start text-[#f4b238] bg-[#281e20] border border-[#a62b2b] px-2 py-0.5">
            VELOCIDAD & REFLEJO
          </span>
          {combo > 1 && (
            <span className="text-[8px] font-press-start text-[#3ca276] animate-pulse">
              COMBO x{combo}!
            </span>
          )}
        </div>

        {/* Title */}
        <div className="text-center">
          <h2 className="text-[11px] font-press-start text-[#f5ebd2]">
            SENDA DE KUKULKÁN
          </h2>
          <p className="text-[9px] text-[#8a7e66] mt-0.5">
            ¡Toca un orbe de la serpiente cuya suma con tu proyectil sea 20!
          </p>
        </div>

        {/* Feedback message */}
        {feedback && (
          <div className="w-full text-center py-1 bg-[#0e0e0e] border border-[#fabc4c] text-[8px] font-press-start text-[#fabc4c]">
            {feedback}
          </div>
        )}

        {/* Snake Serpent Track */}
        <div className="relative w-full min-h-[220px] bg-[#120d0e] border-2 border-[#a62b2b] rounded p-3 flex flex-col justify-between overflow-hidden">
          {/* Temple Shrine Target */}
          <div className="w-full flex items-center justify-between border-b border-[#353535] pb-1 mb-2">
            <span className="text-[7px] text-[#8a7e66]">SANTUARIO DEL CENOTE</span>
            <span className="text-[7px] font-press-start text-[#ff5449]">
              LONGITUD: {orbs.length}/10
            </span>
          </div>

          {/* Snake Orbs Body */}
          <div className="flex flex-wrap gap-2.5 items-center justify-center py-4">
            {orbs.map((orb, index) => {
              const isMatch = loadedOrb + orb.value === 20;
              return (
                <button
                  key={orb.id}
                  onClick={() => handleShootAt(orb)}
                  className={`relative group w-12 h-12 rounded-full flex flex-col items-center justify-center border-2 cursor-pointer transition-transform active:scale-90 [box-shadow:2px_2px_0px_#000000] ${
                    isMatch
                      ? 'border-[#3ca276] ring-2 ring-[#3ca276] animate-pulse'
                      : 'border-black hover:border-[#fabc4c]'
                  }`}
                  style={{ backgroundColor: orb.color }}
                >
                  <span className="text-black font-press-start text-[11px] font-bold drop-shadow">
                    {orb.value}
                  </span>
                  {/* Complement needed */}
                  <span className="text-[6.5px] font-press-start text-black/70">
                    +{20 - orb.value}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Serpent Head Icon */}
          <div className="text-center text-[10px] text-[#8a7e66]">
            🐍 La Serpiente de Jade avanza hacia el altar...
          </div>
        </div>

        {/* Player Archer / Shooter Console */}
        <div className="w-full bg-[#120d0e] border border-[#a62b2b] p-3 rounded flex items-center justify-between">
          {/* Loaded Orb */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center">
              <span className="text-[7px] font-press-start text-[#fabc4c] mb-1">PROYECTIL</span>
              <div
                className="w-14 h-14 rounded-full border-2 border-white flex flex-col items-center justify-center [box-shadow:0_0_10px_#fabc4c]"
                style={{ backgroundColor: ORB_COLORS[loadedOrb % ORB_COLORS.length] }}
              >
                <span className="text-black font-press-start text-[14px] font-bold">
                  {loadedOrb}
                </span>
                <span className="text-[6px] font-press-start text-black/80">
                  BUSCA: {20 - loadedOrb}
                </span>
              </div>
            </div>

            {/* Reserve Orb */}
            <div className="flex flex-col items-center opacity-80">
              <span className="text-[6.5px] font-press-start text-[#8a7e66] mb-1">RESERVA</span>
              <div
                onClick={handleSwap}
                className="w-9 h-9 rounded-full border border-white/60 flex items-center justify-center cursor-pointer hover:scale-105 transition"
                style={{ backgroundColor: ORB_COLORS[reserveOrb % ORB_COLORS.length] }}
              >
                <span className="text-black font-press-start text-[9px] font-bold">
                  {reserveOrb}
                </span>
              </div>
            </div>
          </div>

          {/* Swap & Tip Controls */}
          <div className="flex flex-col gap-1.5 items-end">
            <button
              onClick={handleSwap}
              className="px-3 py-1.5 bg-[#281e20] hover:bg-[#382b2e] border border-[#a62b2b] text-[8px] font-press-start text-[#ffdeac] cursor-pointer flex items-center gap-1 active:scale-95"
            >
              <RefreshCw className="w-3 h-3" />
              <span>CAMBIAR</span>
            </button>
            <span className="text-[6.5px] font-press-start text-[#76d4e4]">
              META: SUMA = 20
            </span>
          </div>
        </div>
      </div>

      {/* Modal Game Over / Won */}
      {(isGameOver || isWon) && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-xs bg-[#211719] border-2 border-[#fabc4c] p-4 text-center rounded flex flex-col gap-3 [box-shadow:4px_4px_0px_#000000]">
            <span className="text-3xl">{isWon ? '🐍' : '💀'}</span>
            <h3 className="font-press-start text-[12px] text-[#ffdeac]">
              {isWon ? '¡SERPIENTE DOMADA!' : '¡SERPIENTE DESBORDADA!'}
            </h3>
            <p className="font-silkscreen text-[10px] text-[#b8b09f]">
              {isWon
                ? `Has colapsado todos los eslabones con ${score} puntos.`
                : 'La serpiente ha penetrado el santuario. Vuelve a intentarlo.'}
            </p>
            <div className="flex gap-2 justify-center pt-2">
              <button
                onClick={restart}
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

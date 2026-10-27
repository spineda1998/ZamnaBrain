import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, RefreshCw } from 'lucide-react';

interface KukulcanOrbsProps {
  onClose: () => void;
  onReward?: (coins: number) => void;
}

interface SnakeOrb {
  id: string;
  value: number; // 1 to 19
  colorKey: 'gold' | 'jade' | 'terracotta' | 'ruby' | 'lime' | 'amethyst';
}

interface OrbColorConfig {
  base: string;
  light: string;
  dark: string;
  text: string;
}

const ORB_THEMES: Record<SnakeOrb['colorKey'], OrbColorConfig> = {
  gold: { base: '#fabc4c', light: '#fef08a', dark: '#b45309', text: '#3f1a02' },
  jade: { base: '#76d4e4', light: '#cffafe', dark: '#0e7490', text: '#083344' },
  terracotta: { base: '#e2725b', light: '#fed7aa', dark: '#9a3412', text: '#431407' },
  ruby: { base: '#ef4444', light: '#fca5a5', dark: '#991b1b', text: '#450a0a' },
  lime: { base: '#84cc16', light: '#d9f99d', dark: '#3f6212', text: '#1a2e05' },
  amethyst: { base: '#c084fc', light: '#f3e8ff', dark: '#6b21a8', text: '#2e1065' },
};

const COLOR_KEYS: SnakeOrb['colorKey'][] = ['gold', 'jade', 'terracotta', 'ruby', 'lime', 'amethyst'];

// SNES 32x32 Pixel Art Orb Component
const SnesPixelOrb: React.FC<{
  value: number;
  colorKey: SnakeOrb['colorKey'];
  size?: 'sm' | 'md' | 'lg';
  isMatch?: boolean;
  onClick?: () => void;
}> = ({ value, colorKey, size = 'md', isMatch = false, onClick }) => {
  const theme = ORB_THEMES[colorKey] || ORB_THEMES.gold;
  const dimClass = size === 'lg' ? 'w-14 h-14' : size === 'sm' ? 'w-9 h-9' : 'w-11 h-11';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative ${dimClass} cursor-pointer select-none transition-transform active:translate-y-0.5 focus:outline-none flex items-center justify-center`}
    >
      <svg
        viewBox="0 0 32 32"
        className="w-full h-full [image-rendering:pixelated]"
        shapeRendering="crispEdges"
      >
        {/* Outer Black Pixel Outline (Stepped Octagonal Circle) */}
        <rect x="6" y="2" width="20" height="2" fill="#000000" />
        <rect x="6" y="28" width="20" height="2" fill="#000000" />
        <rect x="2" y="6" width="2" height="20" fill="#000000" />
        <rect x="28" y="6" width="2" height="20" fill="#000000" />
        {/* Diagonal corners */}
        <rect x="4" y="4" width="2" height="2" fill="#000000" />
        <rect x="26" y="4" width="2" height="2" fill="#000000" />
        <rect x="4" y="26" width="2" height="2" fill="#000000" />
        <rect x="26" y="26" width="2" height="2" fill="#000000" />

        {/* Main Jewel Body */}
        <rect x="6" y="4" width="20" height="24" fill={theme.base} />
        <rect x="4" y="6" width="24" height="20" fill={theme.base} />

        {/* SNES Top-Left Light Specular Highlight Facet */}
        <rect x="6" y="4" width="18" height="2" fill={theme.light} />
        <rect x="4" y="6" width="2" height="18" fill={theme.light} />
        <rect x="6" y="6" width="6" height="4" fill={theme.light} />
        <rect x="6" y="6" width="4" height="6" fill={theme.light} />
        {/* Specular White Pixel Dot */}
        <rect x="6" y="6" width="3" height="3" fill="#ffffff" />

        {/* SNES Bottom-Right Deep Shadow Crescent */}
        <rect x="8" y="26" width="18" height="2" fill={theme.dark} />
        <rect x="26" y="8" width="2" height="18" fill={theme.dark} />
        <rect x="24" y="22" width="4" height="4" fill={theme.dark} />
        <rect x="20" y="24" width="6" height="3" fill={theme.dark} />

        {/* Matching Glow Bevel when valid combination */}
        {isMatch && (
          <>
            <rect x="2" y="2" width="28" height="2" fill="#3ca276" opacity="0.9" />
            <rect x="2" y="28" width="28" height="2" fill="#3ca276" opacity="0.9" />
            <rect x="2" y="2" width="2" height="28" fill="#3ca276" opacity="0.9" />
            <rect x="28" y="2" width="2" height="28" fill="#3ca276" opacity="0.9" />
          </>
        )}
      </svg>

      {/* Numerical Badge in center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span
          className="font-press-start font-bold leading-none text-center"
          style={{
            color: theme.text,
            fontSize: size === 'lg' ? '13px' : size === 'sm' ? '8px' : '10px',
            textShadow: '1px 1px 0px rgba(255,255,255,0.4)',
          }}
        >
          {value}
        </span>
        {size !== 'sm' && (
          <span
            className="font-press-start text-[6px] tracking-tight leading-none mt-0.5 opacity-80"
            style={{ color: theme.text }}
          >
            +{20 - value}
          </span>
        )}
      </div>
    </button>
  );
};

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
        colorKey: COLOR_KEYS[val % COLOR_KEYS.length],
      };
    });
  };

  useEffect(() => {
    const initial = generateRandomOrbs(7);
    setOrbs(initial);
    const matching = 20 - initial[0].value;
    setLoadedOrb(matching > 0 && matching < 20 ? matching : 5);
    setReserveOrb(Math.floor(Math.random() * 19) + 1);
  }, []);

  // Timer
  useEffect(() => {
    if (isGameOver || isWon) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setIsGameOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isGameOver, isWon]);

  // Swap loaded with reserve
  const handleSwap = () => {
    const temp = loadedOrb;
    setLoadedOrb(reserveOrb);
    setReserveOrb(temp);
  };

  // Shoot at an orb
  const handleShootAt = (targetOrb: SnakeOrb) => {
    if (isGameOver || isWon) return;
    const sum = loadedOrb + targetOrb.value;

    if (sum === 20) {
      // MATCH!
      const points = 100 * combo + timeLeft * 5;
      setScore((s) => s + points);
      setCombo((c) => c + 1);
      setTimeLeft((t) => Math.min(60, t + 4));
      setFeedback(`¡COLAPSO VIGESIMAL! +${points} pts (${loadedOrb} + ${targetOrb.value} = 20)`);

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

      // Reload
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
          className="flex items-center gap-1.5 text-[9px] text-[#ffdeac] hover:text-[#fabc4c] font-press-start bg-[#20201f] hover:bg-[#2a2a2a] px-3 py-1.5 border border-[#353535] [box-shadow:2px_2px_0px_#000,_inset_1.5px_1.5px_0px_#ffffff22] cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>SALIR</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="font-press-start text-[8px] text-[#3ca276] bg-[#0e0e0e] px-2 py-1 border border-[#1e6b4b] [box-shadow:1px_1px_0px_#000]">
            PTS: {score}
          </span>
          <span
            className={`font-press-start text-[8px] px-2 py-1 border [box-shadow:1px_1px_0px_#000] ${
              timeLeft <= 5 ? 'text-[#ff5449] border-[#ba1a1a] animate-pulse' : 'text-[#fabc4c] border-[#7a5009]'
            }`}
          >
            ⏳ {timeLeft}s
          </span>
        </div>
      </div>

      {/* Main Arcade Frame */}
      <div className="w-full bg-[#211719] border-2 border-[#7a5009] [box-shadow:3px_3px_0px_#000,_inset_2px_2px_0px_#ffffff18] p-3 flex flex-col gap-3">
        {/* Banner */}
        <div className="border-b-2 border-[#a62b2b] pb-2 flex items-center justify-between">
          <span className="text-[8.5px] font-press-start text-[#f4b238] bg-[#281e20] border border-[#a62b2b] px-2.5 py-1 [box-shadow:1px_1px_0px_#000]">
            VELOCIDAD & REFLEJO · SNES 32-BIT
          </span>
          {combo > 1 && (
            <span className="text-[9px] font-press-start text-[#3ca276] animate-pulse">
              COMBO x{combo}!
            </span>
          )}
        </div>

        {/* Title */}
        <div className="text-center">
          <h2 className="text-[12px] font-press-start text-[#f5ebd2]">
            SENDA DE KUKULKÁN
          </h2>
          <p className="text-[11px] text-[#f4efe6] font-['Space_Mono',monospace] mt-1">
            ¡Toca un orbe de la serpiente cuya suma con tu proyectil sea 20!
          </p>
        </div>

        {/* Feedback message */}
        {feedback && (
          <div className="w-full text-center py-1.5 bg-[#0e0e0e] border-2 border-[#fabc4c] text-[9px] font-press-start text-[#fabc4c] [box-shadow:2px_2px_0px_#000]">
            {feedback}
          </div>
        )}

        {/* Snake Serpent Track with SNES Stepped Scales */}
        <div className="relative w-full min-h-[220px] bg-[#120d0e] border-2 border-[#a62b2b] p-3 flex flex-col justify-between overflow-hidden [box-shadow:inset_2px_2px_0px_#000000aa]">
          {/* Temple Shrine Target */}
          <div className="w-full flex items-center justify-between border-b border-[#353535] pb-1.5 mb-2">
            <span className="text-[8.5px] text-[#cbd5e1] font-press-start">SANTUARIO DEL CENOTE</span>
            <span className="text-[8.5px] font-press-start text-[#ff6b6b]">
              LONGITUD: {orbs.length}/10
            </span>
          </div>

          {/* Snake Orbs Body with SNES 32x32 Spherical Pixel Sprites */}
          <div className="flex flex-wrap gap-3 items-center justify-center py-3">
            {orbs.map((orb) => {
              const isMatch = loadedOrb + orb.value === 20;
              return (
                <div key={orb.id} className="relative">
                  <SnesPixelOrb
                    value={orb.value}
                    colorKey={orb.colorKey}
                    size="md"
                    isMatch={isMatch}
                    onClick={() => handleShootAt(orb)}
                  />
                </div>
              );
            })}
          </div>

          {/* SNES Feathered Serpent Sprite */}
          <div className="flex items-center justify-center gap-2 pt-2 border-t border-[#353535]">
            <svg viewBox="0 0 32 16" className="w-8 h-4 [image-rendering:pixelated]" shapeRendering="crispEdges">
              <rect x="0" y="4" width="8" height="8" fill="#1e6b4b" stroke="#000" strokeWidth="0.5" />
              <rect x="8" y="2" width="12" height="12" fill="#3ca276" stroke="#000" strokeWidth="0.5" />
              <rect x="20" y="0" width="12" height="16" fill="#fabc4c" stroke="#000" strokeWidth="0.5" />
              <rect x="24" y="4" width="3" height="3" fill="#ef4444" />
              <rect x="25" y="5" width="1" height="1" fill="#fff" />
              <rect x="14" y="6" width="3" height="3" fill="#76d4e4" />
            </svg>
            <span className="text-[8px] text-[#8a7e66] font-silkscreen">
              La Serpiente de Jade avanza hacia el altar...
            </span>
          </div>
        </div>

        {/* Player Shooter Console */}
        <div className="w-full bg-[#120d0e] border-2 border-[#a62b2b] p-3 flex items-center justify-between [box-shadow:inset_1px_1px_0px_#ffffff18]">
          {/* Loaded Orb */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center">
              <span className="text-[7px] font-press-start text-[#fabc4c] mb-1">PROYECTIL</span>
              <div className="p-1 bg-[#1a1214] border-2 border-[#fabc4c] [box-shadow:2px_2px_0px_#000]">
                <SnesPixelOrb
                  value={loadedOrb}
                  colorKey={COLOR_KEYS[loadedOrb % COLOR_KEYS.length]}
                  size="lg"
                />
              </div>
            </div>

            {/* Reserve Orb */}
            <div className="flex flex-col items-center opacity-85">
              <span className="text-[6.5px] font-press-start text-[#8a7e66] mb-1">RESERVA</span>
              <div
                onClick={handleSwap}
                className="p-1 bg-[#1a1214] border border-[#58413f] hover:border-[#fabc4c] cursor-pointer [box-shadow:1px_1px_0px_#000]"
                title="Toca para intercambiar"
              >
                <SnesPixelOrb
                  value={reserveOrb}
                  colorKey={COLOR_KEYS[reserveOrb % COLOR_KEYS.length]}
                  size="sm"
                />
              </div>
            </div>
          </div>

          {/* Swap & Target Tip */}
          <div className="flex flex-col gap-1.5 items-end">
            <button
              onClick={handleSwap}
              className="px-3 py-1.5 bg-[#281e20] hover:bg-[#382b2e] border-2 border-[#a62b2b] text-[8px] font-press-start text-[#ffdeac] cursor-pointer flex items-center gap-1 active:translate-y-0.5 [box-shadow:2px_2px_0px_#000]"
            >
              <RefreshCw className="w-3 h-3" />
              <span>CAMBIAR</span>
            </button>
            <span className="text-[7px] font-press-start text-[#76d4e4]">
              META: SUMA = 20
            </span>
          </div>
        </div>
      </div>

      {/* Modal Game Over / Won with SNES Bevels */}
      {(isGameOver || isWon) && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-xs bg-[#211719] border-4 border-[#fabc4c] p-4 text-center flex flex-col gap-3 [box-shadow:4px_4px_0px_#000000]">
            <div className="w-12 h-12 mx-auto bg-[#fabc4c] border-2 border-black flex items-center justify-center font-press-start text-sm text-black [box-shadow:2px_2px_0px_#000]">
              {isWon ? '★' : '✕'}
            </div>
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
                className="px-3 py-2 bg-[#d4af37] text-black font-press-start text-[8px] border-2 border-black cursor-pointer [box-shadow:2px_2px_0px_#000]"
              >
                REINTENTAR
              </button>
              <button
                onClick={onClose}
                className="px-3 py-2 bg-[#20201f] text-[#ffdeac] font-press-start text-[8px] border-2 border-[#a62b2b] cursor-pointer [box-shadow:2px_2px_0px_#000]"
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

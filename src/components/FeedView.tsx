import React, { useState, useEffect } from 'react';
import { User, ProgressSummary } from '../types';
import { 
  Compass, 
  TrendingUp, 
  Swords, 
  Scale, 
  Medal, 
  Flame, 
  Grid, 
  Infinity as InfinityIcon, 
  Ear, 
  Gamepad2, 
  ChevronRight,
  Clock,
  Sparkles
} from 'lucide-react';

interface FeedViewProps {
  user: User;
  progress: ProgressSummary | null;
  onContinueSenda: () => void;
  onPlayTetris: () => void;
  onPlayZuma: () => void;
  onPlayMemorama: () => void;
  onOpenCodex: () => void;
}

export const FeedView: React.FC<FeedViewProps> = ({
  user,
  progress,
  onContinueSenda,
  onPlayTetris,
  onPlayZuma,
  onPlayMemorama,
  onOpenCodex,
}) => {
  // Live ticking countdown for daily challenges: e.g. 08:42:15
  const [secondsRemaining, setSecondsRemaining] = useState(31335); // 8h 42m 15s

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((s) => (s > 0 ? s - 1 : 86400));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatClock = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSec % 3600) / 60).toString().padStart(2, '0');
    const s = (totalSec % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const totalCacaos = 2450 + (progress?.jadeCoins ?? 0);
  const totalGems = 180 + (progress?.totalStars ?? 0) * 10;

  return (
    <div className="max-w-[480px] mx-auto py-4 px-3 font-silkscreen select-none text-[#f4efe6]">
      {/* Top Resource Bar & Status */}
      <div className="bg-[#181818] border-2 border-[#2b2520] p-3 rounded-lg mb-4 shadow-xl">
        <div className="flex items-center gap-3">
          {/* Cacaos / Gold Coin */}
          <div className="flex items-center gap-1.5 bg-[#1b170e] border border-[#d99b26] px-3 py-1 rounded text-xs text-[#fbbf24] font-press-start">
            <span className="text-sm">⊚</span>
            <span>{totalCacaos.toLocaleString()}</span>
          </div>

          {/* Diamonds / Gems */}
          <div className="flex items-center gap-1.5 bg-[#0a181c] border border-[#06b6d4] px-3 py-1 rounded text-xs text-[#06b6d4] font-press-start">
            <span className="text-xs">💎</span>
            <span>{totalGems}</span>
          </div>
        </div>

        {/* Status Tag */}
        <div className="mt-2.5">
          <span className="inline-block bg-[#1a170f] border border-[#d99b26] px-2.5 py-0.5 rounded text-[10px] text-[#fbbf24] font-press-start tracking-wider">
            ACTIVO
          </span>
        </div>
      </div>

      {/* Main Feature: SENDA SAGRADA (MUNDO 2: SELVAS DE PALENQUE) */}
      <div className="bg-[#1e1916] border-2 border-[#382b22] p-4 rounded-lg mb-5 shadow-2xl relative">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-[#06b6d4] text-xs font-press-start">
            <Compass className="w-4 h-4" />
            <span>SENDA SAGRADA</span>
          </div>
          <span className="bg-[#8b2020] text-white border border-[#dc2626] px-2 py-0.5 rounded text-[9px] font-press-start tracking-wide">
            MUNDO 2
          </span>
        </div>

        {/* Title & Subtitle */}
        <h2 className="font-press-start text-sm sm:text-base text-[#fbbf24] tracking-wide mt-1">
          SELVAS DE PALENQUE
        </h2>
        <p className="text-xs text-[#b8b09f] mt-0.5">
          Travesía astronómica de templos y estelas
        </p>

        {/* Visual Preview Box with Pixel Art Backdrop */}
        <div className="relative mt-3 h-32 rounded border border-[#44352a] overflow-hidden bg-[#111111] flex items-end p-2.5">
          {/* Pixelated Mayan Ruins Mosaic Graphic */}
          <div
            className="absolute inset-0 opacity-40 pixel-art"
            style={{
              backgroundImage: `
                linear-gradient(45deg, #222 25%, transparent 25%), 
                linear-gradient(-45deg, #222 25%, transparent 25%), 
                linear-gradient(45deg, transparent 75%, #222 75%), 
                linear-gradient(-45deg, transparent 75%, #222 75%)
              `,
              backgroundSize: '16px 16px',
              backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
            }}
          />

          {/* Mayan Temple Silhouette Backdrop */}
          <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
            <svg viewBox="0 0 160 80" className="w-48 h-24 fill-[#d99b26]">
              {/* Stepped pyramid pixel blocks */}
              <rect x="20" y="60" width="120" height="15" />
              <rect x="35" y="45" width="90" height="15" />
              <rect x="50" y="30" width="60" height="15" />
              <rect x="65" y="15" width="30" height="15" />
              <rect x="72" y="5" width="16" height="10" />
            </svg>
          </div>

          {/* Progress Badge */}
          <div className="relative z-10 bg-[#16120b] border border-[#d99b26] px-2.5 py-1 rounded text-[10px] text-[#fbbf24] font-press-start flex items-center gap-1.5 shadow">
            <span>🚩</span>
            <span>68% AVANCE</span>
          </div>
        </div>

        {/* PRÓXIMO RETO Box */}
        <div className="mt-3.5 bg-[#171310] border border-[#3d2f25] p-3 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#fbbf24] font-press-start">
              PRÓXIMO RETO
            </span>
            <span className="bg-[#6b1c1c] text-[#fca5a5] border border-[#b91c1c] px-2 py-0.5 rounded text-[9px] font-press-start">
              -15 ENERGÍA
            </span>
          </div>

          <h3 className="font-press-start text-xs text-[#f4efe6] leading-snug">
            Templo de los Glifos Vigesimales
          </h3>

          <p className="text-xs text-[#a39c8f] leading-relaxed">
            Descifra la lápida funeraria de Pakal mediante suma de barras y puntos.
          </p>

          <button
            onClick={onContinueSenda}
            className="w-full mt-2 py-3 bg-[#a62b2b] hover:bg-[#ba3232] text-white border-2 border-[#f87171] rounded font-press-start text-xs retro-button flex items-center justify-center gap-2 cursor-pointer shadow-lg tracking-wider"
          >
            <span>CONTINUAR SENDA</span>
            <span>→</span>
          </button>
        </div>
      </div>

      {/* ACTIVIDAD RECIENTE Section */}
      <div className="mb-5 space-y-2.5">
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-1.5 text-xs text-[#06b6d4] font-press-start">
            <TrendingUp className="w-4 h-4 text-[#06b6d4]" />
            <span className="text-[#f4efe6]">ACTIVIDAD RECIENTE</span>
          </div>
          <button
            onClick={onContinueSenda}
            className="bg-[#1f1a14] border border-[#523f2f] text-[#fbbf24] hover:bg-[#2b231a] px-2.5 py-0.5 rounded text-[10px] font-silkscreen cursor-pointer"
          >
            HISTORIAL
          </button>
        </div>

        {/* Activity Item 1: Balanza de Jade */}
        <div className="bg-[#191512] border border-[#33261c] p-3 rounded flex items-center justify-between gap-3 shadow">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#20180e] border border-[#d99b26] flex items-center justify-center text-base shrink-0 text-[#fbbf24]">
              <Scale className="w-5 h-5 text-[#fbbf24]" />
            </div>
            <div>
              <h4 className="font-press-start text-[11px] text-[#f4efe6] line-clamp-1">
                +120 Cacaos en Balanza de Jad
              </h4>
              <p className="text-[10px] text-[#8e8576] mt-0.5">
                Hace 25 min • Puntuación Perfecta
              </p>
            </div>
          </div>
          <span className="bg-[#241c0f] border border-[#d99b26] text-[#fbbf24] px-2 py-0.5 rounded text-[10px] font-press-start whitespace-nowrap">
            +120 ☼
          </span>
        </div>

        {/* Activity Item 2: Nodo 03 superado */}
        <div className="bg-[#191512] border border-[#33261c] p-3 rounded flex items-center justify-between gap-3 shadow">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#0a181c] border border-[#06b6d4] flex items-center justify-center text-base shrink-0 text-[#06b6d4]">
              <Medal className="w-5 h-5 text-[#06b6d4]" />
            </div>
            <div>
              <h4 className="font-press-start text-[11px] text-[#f4efe6] line-clamp-1">
                Nodo 03 superado en Senda
              </h4>
              <p className="text-[10px] text-[#8e8576] mt-0.5">
                3 Estrellas completas en Palenque
              </p>
            </div>
          </div>
          <span className="bg-[#0b1f24] border border-[#06b6d4] text-[#06b6d4] px-2 py-0.5 rounded text-[10px] font-press-start tracking-widest whitespace-nowrap">
            ★★★
          </span>
        </div>

        {/* Activity Item 3: Racha de 7 días */}
        <div className="bg-[#191512] border border-[#33261c] p-3 rounded flex items-center justify-between gap-3 shadow">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#240e0e] border border-[#ef4444] flex items-center justify-center text-base shrink-0 text-[#ef4444]">
              <Flame className="w-5 h-5 text-[#ef4444]" />
            </div>
            <div>
              <h4 className="font-press-start text-[11px] text-[#f4efe6] line-clamp-1">
                Racha de 7 días activa
              </h4>
              <p className="text-[10px] text-[#8e8576] mt-0.5">
                Bonificación solar x2 reclamada
              </p>
            </div>
          </div>
          <span className="bg-[#380e0e] border border-[#ef4444] text-[#ef4444] px-2 py-0.5 rounded text-[10px] font-press-start tracking-wider whitespace-nowrap">
            RACHA
          </span>
        </div>
      </div>

      {/* DESAFÍOS DIARIOS Section */}
      <div className="mb-5 space-y-2.5">
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-1.5 text-xs text-[#fbbf24] font-press-start">
            <Swords className="w-4 h-4 text-[#fbbf24]" />
            <span className="text-[#f4efe6]">DESAFÍOS DIARIOS</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-[#fbbf24] font-press-start">
            <span>RELOJ</span>
            <span className="font-mono">{formatClock(secondsRemaining)}</span>
          </div>
        </div>

        {/* Daily 1: Cálculo de Mazorcas (Tetris Maya) */}
        <div className="bg-[#191512] border border-[#33261c] p-3 rounded flex items-center justify-between gap-3 shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#20180e] border border-[#d99b26] flex items-center justify-center shrink-0 text-[#fbbf24]">
              <Grid className="w-5 h-5 text-[#fbbf24]" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[9px] text-[#fbbf24] font-press-start">
                  +40 MANÁ
                </span>
                <span className="text-[10px] text-[#7a7264]">
                  3H RESTANTE
                </span>
              </div>
              <h4 className="font-press-start text-[11px] text-[#f4efe6]">
                Cálculo de Mazorcas
              </h4>
              <p className="text-[10px] text-[#8e8576] mt-0.5">
                5 divisiones del tributo imperial
              </p>
            </div>
          </div>
          <button
            onClick={onPlayTetris}
            className="px-3.5 py-1.5 bg-[#d99b26] hover:bg-[#f59e0b] text-black font-press-start text-[10px] font-bold rounded retro-button cursor-pointer"
          >
            JUGAR
          </button>
        </div>

        {/* Daily 2: Reflejo Serpiente Zuma (Zuma Game) */}
        <div className="bg-[#191512] border border-[#33261c] p-3 rounded flex items-center justify-between gap-3 shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#0b1f1a] border border-[#10b981] flex items-center justify-center shrink-0 text-[#10b981]">
              <InfinityIcon className="w-5 h-5 text-[#10b981]" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[9px] text-[#22c55e] font-press-start">
                  +100 CACAOS
                </span>
                <span className="text-[10px] text-[#7a7264]">
                  1 INTENTO
                </span>
              </div>
              <h4 className="font-press-start text-[11px] text-[#f4efe6]">
                Reflejo Serpiente Zuma
              </h4>
              <p className="text-[10px] text-[#8e8576] mt-0.5">
                Alinea 3 jades en menos de 45s
              </p>
            </div>
          </div>
          <button
            onClick={onPlayZuma}
            className="px-3.5 py-1.5 bg-[#059669] hover:bg-[#10b981] text-white font-press-start text-[10px] font-bold rounded retro-button cursor-pointer"
          >
            ENTRAR
          </button>
        </div>

        {/* Daily 3: Glifos Sonoros & Memorama (Memorama Maya) */}
        <div className="bg-[#191512] border border-[#33261c] p-3 rounded flex items-center justify-between gap-3 shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#240e0e] border border-[#ef4444] flex items-center justify-center shrink-0 text-[#ef4444]">
              <Ear className="w-5 h-5 text-[#ef4444]" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[9px] text-[#f87171] font-press-start">
                  +80 XP
                </span>
                <span className="text-[10px] text-[#7a7264]">
                  CÓDICE
                </span>
              </div>
              <h4 className="font-press-start text-[11px] text-[#f4efe6]">
                Glifos Sonoros
              </h4>
              <p className="text-[10px] text-[#8e8576] mt-0.5">
                1 lección fonética náhuatl/maya
              </p>
            </div>
          </div>
          <button
            onClick={onPlayMemorama}
            className="px-3 py-1.5 bg-[#8b2020] hover:bg-[#b91c1c] text-white font-press-start text-[10px] font-bold rounded retro-button cursor-pointer"
          >
            ESTUDIAR
          </button>
        </div>
      </div>

      {/* Arcade Machine Footer Banner */}
      <div className="bg-[#121212] border-2 border-[#2b2520] p-2.5 rounded-lg flex items-center justify-between text-[10px] font-press-start text-[#fbbf24] shadow-inner">
        <div className="flex items-center gap-1.5 text-[#fbbf24]">
          <Gamepad2 className="w-3.5 h-3.5 text-[#d99b26]" />
          <span>CABINA: ITZAMNA #042</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#06b6d4]">
          <span className="w-2 h-2 rounded-full bg-[#06b6d4] animate-pulse" />
          <span>CRÉDITO 1P DISPONIBLE</span>
        </div>
      </div>
    </div>
  );
};

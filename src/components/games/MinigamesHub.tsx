import React, { useState, useEffect } from 'react';
import { MayaTetris } from './MayaTetris';
import { MayaMemorama } from './MayaMemorama';
import { BalanzaSagrada } from './BalanzaSagrada';
import { KukulcanOrbs } from './KukulcanOrbs';
import { FloatingGameControl } from './FloatingGameControl';
import { ArrowLeft } from 'lucide-react';
import { AppLanguage } from '../../types';

export type GameEngineType = 'tetris' | 'memorama' | 'balanza' | 'kukulcan' | null;

interface MinigamesHubProps {
  onBackToSendero?: () => void;
  onBackToFeed?: () => void;
  initialGame?: GameEngineType;
  onRewardCoins?: (coins: number) => void;
  onGameActiveChange?: (isActive: boolean) => void;
  language?: AppLanguage;
}

type FilterCategory = 'TODOS' | 'MEMORIA' | 'ANALISIS' | 'VELOCIDAD';

interface ArcadeGameItem {
  id: 'kukulcan' | 'tetris' | 'memorama' | 'balanza' | 'cero';
  engine: GameEngineType;
  category: 'MEMORIA' | 'ANALISIS' | 'VELOCIDAD';
  badge: string;
  record: string;
  title: string;
  desc: string;
  tags: [string, string];
  bannerIllustration: React.ReactNode;
}

export const MinigamesHub: React.FC<MinigamesHubProps> = ({
  onBackToSendero,
  onBackToFeed,
  initialGame = null,
  onRewardCoins,
  onGameActiveChange,
  language = 'es',
}) => {
  const [activeGame, setActiveGame] = useState<GameEngineType>(initialGame);
  const [selectedFilter, setSelectedFilter] = useState<FilterCategory>('TODOS');

  useEffect(() => {
    onGameActiveChange?.(activeGame !== null);
    return () => onGameActiveChange?.(false);
  }, [activeGame, onGameActiveChange]);

  // Render individual game engines if selected - In immersive full-screen phone mode
  if (activeGame) {
    const gameTitles: Record<string, string> = {
      tetris: 'TETRIS AZTECA',
      memorama: 'MÁSCARAS GEMELAS',
      balanza: 'BALANZA DE JADE',
      kukulcan: 'SENDA DE KUKULKÁN',
    };

    return (
      <div className="fixed inset-0 z-50 w-screen h-screen bg-[#141414] overflow-y-auto overflow-x-hidden flex flex-col justify-start items-center">
        <FloatingGameControl
          onExit={() => setActiveGame(null)}
          onRestart={() => {
            const current = activeGame;
            setActiveGame(null);
            setTimeout(() => setActiveGame(current), 50);
          }}
          gameTitle={gameTitles[activeGame] || 'MINIJUEGO ARCADE'}
          language={language}
        />

        {activeGame === 'tetris' && (
          <MayaTetris onClose={() => setActiveGame(null)} onReward={onRewardCoins} />
        )}
        {activeGame === 'memorama' && (
          <MayaMemorama onClose={() => setActiveGame(null)} onReward={onRewardCoins} />
        )}
        {activeGame === 'balanza' && (
          <BalanzaSagrada onClose={() => setActiveGame(null)} onReward={onRewardCoins} />
        )}
        {activeGame === 'kukulcan' && (
          <KukulcanOrbs onClose={() => setActiveGame(null)} onReward={onRewardCoins} />
        )}
      </div>
    );
  }

  // 5 Arcade Games in catalog using the new card component structure
  const ARCADE_GAMES: ArcadeGameItem[] = [
    {
      id: 'kukulcan',
      engine: 'kukulcan',
      category: 'VELOCIDAD',
      badge: 'VELOCIDAD & REFLEJOS',
      record: 'RÉCORD: 6,800',
      title: 'SENDA DE KUKULKÁN',
      desc: 'Dispara orbes sagrados que sumen exactamente 20 para colapsar los eslabones de la serpiente.',
      tags: ['VIGESIMAL', 'PUNTERÍA'],
      bannerIllustration: (
        <svg viewBox="0 0 374 144" className="w-full h-full bg-[#0c1410] preserve-3d">
          <defs>
            <linearGradient id="serpentGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e6b4b" />
              <stop offset="50%" stopColor="#3ca276" />
              <stop offset="100%" stopColor="#80d5ae" />
            </linearGradient>
            <radialGradient id="orbGlowGold" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffe27a" />
              <stop offset="100%" stopColor="#d99b26" />
            </radialGradient>
            <radialGradient id="orbGlowTeal" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#a5f3fc" />
              <stop offset="100%" stopColor="#0891b2" />
            </radialGradient>
            <radialGradient id="orbGlowRed" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fca5a5" />
              <stop offset="100%" stopColor="#dc2626" />
            </radialGradient>
          </defs>
          {/* Temple pyramid silhouette in background */}
          <polygon points="120,144 140,80 170,80 190,144" fill="#091a13" opacity="0.6" />
          <polygon points="180,144 205,65 245,65 270,144" fill="#091a13" opacity="0.8" />
          <polygon points="215,65 220,50 230,50 235,65" fill="#122c21" />

          {/* Serpent winding body */}
          <path
            d="M 20 120 Q 80 40 160 90 T 300 60 Q 340 70 355 100"
            fill="none"
            stroke="#0a2a1d"
            strokeWidth="28"
            strokeLinecap="round"
          />
          <path
            d="M 20 120 Q 80 40 160 90 T 300 60 Q 340 70 355 100"
            fill="none"
            stroke="url(#serpentGlow)"
            strokeWidth="18"
            strokeLinecap="round"
          />
          <path
            d="M 20 120 Q 80 40 160 90 T 300 60 Q 340 70 355 100"
            fill="none"
            stroke="#fabc4c"
            strokeWidth="2"
            strokeDasharray="4 6"
            strokeLinecap="round"
          />

          {/* Kukulkan Feathered Head */}
          <g transform="translate(340, 85)">
            <polygon points="0,0 26,10 12,25 -5,16" fill="#fabc4c" stroke="#000" strokeWidth="2" />
            <polygon points="-5,-8 10,-2 2,-12" fill="#e2725b" />
            <polygon points="5,-14 18,-6 10,-20" fill="#3ca276" />
            <circle cx="16" cy="8" r="3.5" fill="#a62b2b" stroke="#000" strokeWidth="1" />
            <circle cx="17" cy="7" r="1.2" fill="#fff" />
            {/* Forked tongue */}
            <path d="M 26 12 L 34 14 L 38 10 M 34 14 L 38 18" stroke="#ef4444" strokeWidth="2" fill="none" />
          </g>

          {/* Zuma Sacred Orbs along the track */}
          <circle cx="50" cy="98" r="11" fill="url(#orbGlowGold)" stroke="#000" strokeWidth="2" />
          <text x="50" y="102" fill="#452a00" fontSize="9" fontFamily="Press Start 2P" textAnchor="middle">5</text>

          <circle cx="85" cy="68" r="11" fill="url(#orbGlowTeal)" stroke="#000" strokeWidth="2" />
          <text x="85" y="72" fill="#003545" fontSize="9" fontFamily="Press Start 2P" textAnchor="middle">15</text>

          <circle cx="130" cy="72" r="11" fill="url(#orbGlowRed)" stroke="#000" strokeWidth="2" />
          <text x="130" y="76" fill="#fff" fontSize="9" fontFamily="Press Start 2P" textAnchor="middle">10</text>

          <circle cx="178" cy="94" r="11" fill="url(#orbGlowGold)" stroke="#000" strokeWidth="2" />
          <text x="178" y="98" fill="#452a00" fontSize="9" fontFamily="Press Start 2P" textAnchor="middle">10</text>

          <circle cx="230" cy="84" r="11" fill="url(#orbGlowTeal)" stroke="#000" strokeWidth="2" />
          <text x="230" y="88" fill="#003545" fontSize="9" fontFamily="Press Start 2P" textAnchor="middle">20</text>

          <circle cx="278" cy="65" r="11" fill="url(#orbGlowRed)" stroke="#000" strokeWidth="2" />
          <text x="278" y="69" fill="#fff" fontSize="9" fontFamily="Press Start 2P" textAnchor="middle">0</text>

          {/* Ancient Glyphs Floating */}
          <rect x="22" y="24" width="16" height="16" rx="2" fill="#091a13" stroke="#3ca276" strokeWidth="1" opacity="0.7" />
          <circle cx="30" cy="32" r="4" fill="#3ca276" opacity="0.6" />
        </svg>
      ),
    },
    {
      id: 'tetris',
      engine: 'tetris',
      category: 'ANALISIS',
      badge: 'PUZZLE & GRAVEDAD',
      record: 'RÉCORD: 14,200',
      title: 'TETRIS AZTECA',
      desc: 'Apila bloques tallados de estelas y glifos. Despeja líneas horizontales para recolectar ofrendas de jade.',
      tags: ['BASE 20', 'ESTELAS'],
      bannerIllustration: (
        <svg viewBox="0 0 374 144" className="w-full h-full bg-[#181113]">
          <defs>
            <linearGradient id="tetrisBg" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2a181c" />
              <stop offset="100%" stopColor="#120b0d" />
            </linearGradient>
            <pattern id="brickPattern" width="20" height="12" patternUnits="userSpaceOnUse">
              <rect width="20" height="12" fill="none" stroke="#2d1d20" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="374" height="144" fill="url(#tetrisBg)" />
          <rect width="374" height="144" fill="url(#brickPattern)" opacity="0.4" />

          {/* Stepped Pyramid outline */}
          <polygon points="30,144 80,45 294,45 344,144" fill="#1b1013" stroke="#58413f" strokeWidth="1.5" />
          <line x1="80" y1="45" x2="294" y2="45" stroke="#fabc4c" strokeWidth="2" />

          {/* Tetris Maya Blocks */}
          {/* L shape (Jade green) */}
          <g transform="translate(140, 20)">
            <rect x="0" y="0" width="22" height="22" fill="#3ca276" stroke="#000" strokeWidth="2" rx="2" />
            <circle cx="11" cy="11" r="4" fill="#fabc4c" />
            <rect x="0" y="22" width="22" height="22" fill="#3ca276" stroke="#000" strokeWidth="2" rx="2" />
            <circle cx="11" cy="33" r="4" fill="#fabc4c" />
            <rect x="22" y="22" width="22" height="22" fill="#3ca276" stroke="#000" strokeWidth="2" rx="2" />
            <rect x="28" y="31" width="10" height="4" fill="#fabc4c" />
          </g>

          {/* Stacked Base Blocks on bottom */}
          <g transform="translate(90, 84)">
            <rect x="0" y="0" width="24" height="24" fill="#d99b26" stroke="#000" strokeWidth="2" />
            <rect x="24" y="0" width="24" height="24" fill="#d99b26" stroke="#000" strokeWidth="2" />
            <rect x="48" y="0" width="24" height="24" fill="#d99b26" stroke="#000" strokeWidth="2" />
            <rect x="72" y="0" width="24" height="24" fill="#0891b2" stroke="#000" strokeWidth="2" />
            <rect x="96" y="0" width="24" height="24" fill="#0891b2" stroke="#000" strokeWidth="2" />
            <rect x="120" y="0" width="24" height="24" fill="#a62b2b" stroke="#000" strokeWidth="2" />
            <rect x="144" y="0" width="24" height="24" fill="#a62b2b" stroke="#000" strokeWidth="2" />
            <rect x="168" y="0" width="24" height="24" fill="#3ca276" stroke="#000" strokeWidth="2" />

            <rect x="24" y="24" width="24" height="24" fill="#a62b2b" stroke="#000" strokeWidth="2" />
            <rect x="48" y="24" width="24" height="24" fill="#a62b2b" stroke="#000" strokeWidth="2" />
            <rect x="72" y="24" width="24" height="24" fill="#3ca276" stroke="#000" strokeWidth="2" />
            <rect x="96" y="24" width="24" height="24" fill="#3ca276" stroke="#000" strokeWidth="2" />
            <rect x="120" y="24" width="24" height="24" fill="#d99b26" stroke="#000" strokeWidth="2" />
            <rect x="144" y="24" width="24" height="24" fill="#d99b26" stroke="#000" strokeWidth="2" />
          </g>

          {/* Falling particle sparks */}
          <circle cx="152" cy="74" r="2" fill="#fabc4c" />
          <circle cx="168" cy="68" r="1.5" fill="#76d4e4" />
          <circle cx="210" cy="55" r="2" fill="#fabc4c" />
        </svg>
      ),
    },
    {
      id: 'memorama',
      engine: 'memorama',
      category: 'MEMORIA',
      badge: 'MEMORIA ANCESTRAL',
      record: 'RÉCORD: 8,900',
      title: 'MÁSCARAS GEMELAS',
      desc: 'Voltea tablillas sagradas de arcilla y empareja glifos vigesimales con sus números equivalentes.',
      tags: ['GLIFOS', 'PAREJAS'],
      bannerIllustration: (
        <svg viewBox="0 0 374 144" className="w-full h-full bg-[#181116]">
          <defs>
            <radialGradient id="maskGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#432c00" />
              <stop offset="100%" stopColor="#181116" />
            </radialGradient>
          </defs>
          <rect width="374" height="144" fill="url(#maskGlow)" />

          {/* Radiant Sun disc behind masks */}
          <circle cx="187" cy="72" r="54" fill="#2d1e22" stroke="#fabc4c" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />

          {/* Left Tablet Card (Mayan Number) */}
          <g transform="translate(100, 22)">
            <rect x="0" y="0" width="68" height="96" rx="6" fill="#251b1d" stroke="#fabc4c" strokeWidth="2" />
            <rect x="4" y="4" width="60" height="88" rx="4" fill="#181113" stroke="#58413f" strokeWidth="1" />
            {/* Mayan Number 7 (2 dots + 1 bar) */}
            <circle cx="27" cy="38" r="4.5" fill="#fabc4c" stroke="#000" strokeWidth="1" />
            <circle cx="41" cy="38" r="4.5" fill="#fabc4c" stroke="#000" strokeWidth="1" />
            <rect x="18" y="52" width="32" height="7" rx="2" fill="#fabc4c" stroke="#000" strokeWidth="1" />
            <text x="34" y="80" fill="#a78a87" fontSize="8" fontFamily="Press Start 2P" textAnchor="middle">GLIFO</text>
          </g>

          {/* Right Tablet Card (Arabic Equivalent) */}
          <g transform="translate(206, 22)">
            <rect x="0" y="0" width="68" height="96" rx="6" fill="#251b1d" stroke="#3ca276" strokeWidth="2" />
            <rect x="4" y="4" width="60" height="88" rx="4" fill="#181113" stroke="#58413f" strokeWidth="1" />
            <text x="34" y="56" fill="#80d5ae" fontSize="28" fontFamily="Press Start 2P" textAnchor="middle">
              7
            </text>
            <text x="34" y="80" fill="#3ca276" fontSize="8" fontFamily="Press Start 2P" textAnchor="middle">NUM</text>
          </g>

          {/* Mayan Funerary Jade Mask Crown Center */}
          <polygon points="187,14 200,28 174,28" fill="#fabc4c" stroke="#000" strokeWidth="1" />
          <circle cx="187" cy="24" r="3" fill="#a62b2b" />
          {/* Sparkles */}
          <circle cx="70" cy="40" r="2" fill="#fabc4c" />
          <circle cx="304" cy="40" r="2" fill="#3ca276" />
          <circle cx="50" cy="110" r="1.5" fill="#fabc4c" />
          <circle cx="320" cy="110" r="1.5" fill="#80d5ae" />
        </svg>
      ),
    },
    {
      id: 'balanza',
      engine: 'balanza',
      category: 'ANALISIS',
      badge: 'CÁLCULO & PESO',
      record: 'RÉCORD: 7,200',
      title: 'BALANZA DE JADE',
      desc: 'Equilibra la balanza ceremonial colocando pesas mayas hasta igualar el tributo exigido por los sacerdotes.',
      tags: ['MATEMÁTICAS', 'EQUILIBRIO'],
      bannerIllustration: (
        <svg viewBox="0 0 374 144" className="w-full h-full bg-[#121015]">
          <defs>
            <linearGradient id="balanceGlow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1f1a26" />
              <stop offset="100%" stopColor="#0b0a0e" />
            </linearGradient>
          </defs>
          <rect width="374" height="144" fill="url(#balanceGlow)" />

          {/* Sacred Temple Altar Backdrop */}
          <polygon points="140,144 165,30 209,30 234,144" fill="#1b1722" stroke="#352e42" strokeWidth="1" />

          {/* Central Pillar */}
          <polygon points="187,35 180,120 194,120" fill="#58413f" stroke="#000" strokeWidth="1.5" />
          <rect x="170" y="120" width="34" height="10" fill="#d99b26" stroke="#000" strokeWidth="1.5" rx="2" />
          <circle cx="187" cy="35" r="7" fill="#fabc4c" stroke="#000" strokeWidth="2" />
          <circle cx="187" cy="35" r="2.5" fill="#a62b2b" />

          {/* Beam (slanted in dynamic balance) */}
          <line x1="80" y1="56" x2="294" y2="40" stroke="#fabc4c" strokeWidth="5" strokeLinecap="round" />
          <line x1="80" y1="56" x2="294" y2="40" stroke="#7a5009" strokeWidth="2" strokeLinecap="round" />

          {/* Left Pan (Lower, with jade weights) */}
          <line x1="85" y1="56" x2="85" y2="94" stroke="#a62b2b" strokeWidth="2" />
          <ellipse cx="85" cy="95" rx="36" ry="10" fill="#281e20" stroke="#fabc4c" strokeWidth="2" />
          {/* Weights */}
          <circle cx="75" cy="88" r="8" fill="#3ca276" stroke="#000" strokeWidth="1.5" />
          <rect x="85" y="82" width="16" height="8" rx="2" fill="#fabc4c" stroke="#000" strokeWidth="1.5" />

          {/* Right Pan (Higher, with target tribute) */}
          <line x1="289" y1="40" x2="289" y2="78" stroke="#a62b2b" strokeWidth="2" />
          <ellipse cx="289" cy="79" rx="36" ry="10" fill="#281e20" stroke="#fabc4c" strokeWidth="2" />
          {/* Gold Ingot / Bag */}
          <polygon points="280,72 298,72 294,62 284,62" fill="#d99b26" stroke="#000" strokeWidth="1.5" />
          <text x="289" y="70" fill="#3a2600" fontSize="7" fontFamily="Press Start 2P" textAnchor="middle">20</text>
        </svg>
      ),
    },
    {
      id: 'cero',
      engine: 'balanza',
      category: 'VELOCIDAD',
      badge: 'ARITMÉTICA VELOZ',
      record: 'RÉCORD: 9,400',
      title: 'EL CERO SAGRADO',
      desc: 'Identifica y resuelve rápidamente retos vigesimales con la concha del cero maya en rachas cronometradas.',
      tags: ['CUENTA LARGA', 'AGILIDAD'],
      bannerIllustration: (
        <svg viewBox="0 0 374 144" className="w-full h-full bg-[#100f1c]">
          <defs>
            <radialGradient id="conchGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#432559" />
              <stop offset="100%" stopColor="#0d0c18" />
            </radialGradient>
          </defs>
          <rect width="374" height="144" fill="url(#conchGlow)" />

          {/* Celestial Astrological Rings */}
          <circle cx="187" cy="72" r="58" fill="none" stroke="#6366f1" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
          <circle cx="187" cy="72" r="44" fill="none" stroke="#a855f7" strokeWidth="1.5" opacity="0.6" />

          {/* Sacred Maya Conch Zero Symbol (Large, glowing) */}
          <g transform="translate(187, 72)">
            {/* Outer shell contour */}
            <ellipse cx="0" cy="0" rx="46" ry="30" fill="#fabc4c" stroke="#000" strokeWidth="3" />
            <ellipse cx="0" cy="0" rx="41" ry="26" fill="#ffe27a" stroke="#d99b26" strokeWidth="1.5" />
            {/* Horizontal dividing groove */}
            <line x1="-38" y1="0" x2="38" y2="0" stroke="#3a2600" strokeWidth="3.5" />
            {/* Vertical shell segments */}
            <line x1="-20" y1="-20" x2="-20" y2="20" stroke="#3a2600" strokeWidth="2.5" />
            <line x1="0" y1="-26" x2="0" y2="26" stroke="#3a2600" strokeWidth="2.5" />
            <line x1="20" y1="-20" x2="20" y2="20" stroke="#3a2600" strokeWidth="2.5" />
          </g>

          {/* Floating Vigesimal Orbiters */}
          <circle cx="65" cy="40" r="9" fill="#06b6d4" stroke="#000" strokeWidth="1.5" />
          <text x="65" y="44" fill="#fff" fontSize="8" fontFamily="Press Start 2P" textAnchor="middle">0</text>

          <circle cx="305" cy="100" r="9" fill="#10b981" stroke="#000" strokeWidth="1.5" />
          <text x="305" y="104" fill="#000" fontSize="8" fontFamily="Press Start 2P" textAnchor="middle">20</text>

          {/* Stars */}
          <circle cx="45" cy="90" r="1.5" fill="#fff" />
          <circle cx="110" cy="120" r="1.5" fill="#ffe27a" />
          <circle cx="280" cy="30" r="2" fill="#ffe27a" />
          <circle cx="335" cy="50" r="1.5" fill="#fff" />
        </svg>
      ),
    },
  ];

  // Real-time filtering by category
  const filteredGames = ARCADE_GAMES.filter((game) => {
    if (selectedFilter === 'TODOS') return true;
    return game.category === selectedFilter;
  });

  return (
    <div className="w-full max-w-[400px] mx-auto px-2 py-3 pb-24 font-silkscreen select-none text-[#f4efe6]">
      {/* Return to Feed Bar */}
      {onBackToFeed && (
        <div className="w-full flex items-center justify-between pb-3">
          <button
            onClick={onBackToFeed}
            className="flex items-center gap-1.5 text-[9px] text-[#ffdeac] hover:text-[#fabc4c] font-press-start bg-[#20201f] hover:bg-[#2a2a2a] px-3 py-1.5 rounded-[2px] border border-[#353535] [box-shadow:0px_0px_0px_#0e0e0e,_inset_1.5px_1.5px_0px_#ffffff33,_inset_-1.5px_-1.5px_0px_#00000099] cursor-pointer transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← VOLVER AL FEED</span>
          </button>
          <span className="font-press-start text-[7.5px] text-[#fabc4c] bg-[#120d0e] px-2 py-1 border border-[#7a5009] rounded-[2px]">
            {filteredGames.length} CARTUCHOS
          </span>
        </div>
      )}

      {/* ── SECTION: FILTROS ARCADE ── */}
      <div className="w-full flex flex-col gap-[8px] pt-[2px] pb-3">
        {/* Title row */}
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            {/* Diamond Mayan Icon */}
            <svg viewBox="0 0 9.038 9.038" className="w-[9px] h-[9px] fill-[#d99b26]">
              <path d="M4.52148 0l2.01661 2.02148-2.01661 2.02148-2.02148-2.02148 2.02148-2.02148m0 5l2.01661 2.02148-2.01661 2.02148-2.02148-2.02148 2.02148-2.02148m2.5-2.5l2.01661 2.02148-2.01661 2.02148-2.02148-2.02148 2.02148-2.02148m-5 0l2.01661 2.02148-2.01661 2.02148-2.02148-2.02148 2.02148-2.02148" />
            </svg>
            <span className="text-[8.5px]/[12px] text-[#f9f6f0] font-press-start tracking-[0.4px]">
              Minijuegos
            </span>
          </div>

          <span className="text-[7.5px] text-[#a78a87] font-silkscreen">
            CATÁLOGO 32-BIT
          </span>
        </div>

        {/* Real-time Category Filter Buttons */}
        <div className="w-full flex flex-row gap-[5px] justify-between items-center">
          {(['TODOS', 'MEMORIA', 'ANALISIS', 'VELOCIDAD'] as FilterCategory[]).map((category) => {
            const isActive = selectedFilter === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedFilter(category)}
                className={`flex-1 py-[6px] px-[4px] flex justify-center items-center cursor-pointer transition active:scale-95 [border-width:1px] [border-style:solid] [box-shadow:2px_2px_0px_#000000] rounded-[2px] ${
                  isActive
                    ? 'bg-[#b8261e] border-[#a62b2b] text-[#f9f6f0]'
                    : 'bg-[#d4af37] hover:bg-[#e5c158] border-[#a62b2b] text-[#1a1a1a]'
                }`}
              >
                <span className="text-[7px] font-press-start leading-none tracking-tight">
                  {category}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── SECTION: CARDS DE JUEGOS (HERO BANNER 144px + JUGAR LIBRE) ── */}
      <div className="w-full flex flex-col gap-[16px] items-center">
        {filteredGames.map((game) => (
          <div
            key={game.id}
            data-pencil-name={`Article - ${game.title}`}
            className="box-border w-full h-fit shrink-0 flex flex-col gap-0 justify-start items-start bg-[#20201fff] rounded-[8px] overflow-hidden border border-[#353535] [box-shadow:0px_4px_10px_#00000080]"
          >
            {/* Top 144px Hero Background */}
            <div
              data-pencil-name="Background"
              className="box-border w-full h-[144px] shrink-0 flex flex-col gap-0 justify-center items-start bg-[#0e0e0eff] overflow-hidden relative"
            >
              {/* Graphic/Illustration layer */}
              <div className="box-border w-full [flex:1_1_0] overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-[inherit] [z-index:0]">
                  {game.bannerIllustration}
                </div>
              </div>

              {/* Gradient 0% to 100% overlay */}
              <div
                data-pencil-name="Gradient"
                className="box-border w-full h-[144px] absolute left-0 top-0 [background-image:linear-gradient(0deg,_#20201fff_0%,_#20201f4d_50%,_#20201f00_100%)] bg-no-repeat bg-[length:100%_100%] [z-index:1] pointer-events-none"
              />

              {/* Top-left Badge: Category */}
              <div
                data-pencil-name="Background"
                className="box-border w-fit h-fit absolute left-[8px] top-[8px] flex flex-col gap-0 p-[2px_8px] justify-start items-start bg-[#bd8717ff] rounded-[4px] [z-index:2]"
              >
                <div
                  data-pencil-name="Overlay+Shadow"
                  className="box-border w-full h-full [box-shadow:0px_0px_0px_#0e0e0e,_inset_2px_2px_0px_#ffffff33,_inset_-2px_-2px_0px_#00000099] absolute left-0 top-0 bg-[#ffffff00] rounded-[4px] [z-index:0] pointer-events-none"
                />
                <div
                  data-pencil-name="Text"
                  className="text-[7px]/[11px] box-border text-[#3a2600ff] font-['Press_Start_2P',system-ui,sans-serif] font-normal text-left [white-space:nowrap] relative [z-index:1]"
                >
                  {game.badge}
                </div>
              </div>

              {/* Top-right Badge: Record */}
              <div
                data-pencil-name="Background"
                className="box-border w-fit h-fit absolute right-[8px] top-[8px] flex flex-col gap-0 p-[2px_8px] justify-start items-start bg-[#1c2e26ff] rounded-[4px] [z-index:3]"
              >
                <div
                  data-pencil-name="Overlay+Shadow"
                  className="box-border w-full h-full [box-shadow:0px_0px_0px_#0e0e0e,_inset_2px_2px_0px_#ffffff33,_inset_-2px_-2px_0px_#00000099] absolute left-0 top-0 bg-[#ffffff00] rounded-[4px] [z-index:0] pointer-events-none"
                />
                <div
                  data-pencil-name="Text"
                  className="text-[7px]/[11px] box-border text-[#80d5aeff] font-['Press_Start_2P',system-ui,sans-serif] font-normal text-left [white-space:nowrap] relative [z-index:1]"
                >
                  {game.record}
                </div>
              </div>
            </div>

            {/* Lower Content Container */}
            <div className="box-border w-full flex flex-col gap-[10px] p-[12px] bg-[#20201fff] relative z-10">
              {/* Title & Description */}
              <div className="flex flex-col gap-[4px]">
                <h4 className="text-[11px]/[16px] text-[#f5ebd2] font-['Press_Start_2P',system-ui,sans-serif] tracking-tight">
                  {game.title}
                </h4>
                <p className="text-[9.5px]/[14px] text-[#a78a87] font-['Space_Mono',monospace]">
                  {game.desc}
                </p>
              </div>

              {/* Tags Row */}
              <div className="flex flex-row gap-[6px] items-center">
                {game.tags.map((tag) => (
                  <div
                    key={tag}
                    className="box-border w-fit h-fit flex flex-col gap-0 p-[2px_6px] justify-start items-start bg-[#141414] border border-[#3a3535] rounded-[3px]"
                  >
                    <span className="text-[7px]/[11px] text-[#ffdeac] font-['Press_Start_2P',system-ui,sans-serif]">
                      {tag}
                    </span>
                  </div>
                ))}
              </div>

              {/* Button: JUGAR LIBRE */}
              <div
                onClick={() => setActiveGame(game.engine)}
                data-pencil-name="Button - JUGAR LIBRE"
                className="box-border w-full h-fit shrink-0 cursor-pointer active:scale-[0.98] transition-transform select-none relative flex flex-row justify-center items-center p-[10px_0px] bg-[#bd8717ff] hover:bg-[#d49c25] rounded-[4px] mt-1"
              >
                <div
                  data-pencil-name="Overlay+Shadow"
                  className="box-border w-full h-full [box-shadow:0px_0px_0px_#0e0e0e,_inset_2px_2px_0px_#ffffff4d,_inset_-2px_-2px_0px_#00000099] absolute left-0 top-0 bg-[#ffffff00] rounded-[4px] [z-index:1] pointer-events-none"
                />
                <div
                  data-pencil-name="Text"
                  className="text-[10.5px]/[15px] box-border text-[#2a1a00] font-['Silkscreen',system-ui,sans-serif] font-bold text-center tracking-[0.8px] [white-space:nowrap] relative [z-index:2]"
                >
                  JUGAR LIBRE ▶
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredGames.length === 0 && (
          <div className="w-full text-center py-8 bg-[#120d0e] border border-[#a62b2b] p-4 text-[#8a7e66] rounded-[4px]">
            <span className="text-xl mb-1 block">🔍</span>
            <span className="text-[8px] font-press-start text-[#fabc4c]">
              No hay minijuegos en esta categoría.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

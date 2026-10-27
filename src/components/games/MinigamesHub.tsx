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
      tetris: 'TETRIS AZTECA · SNES 32-BIT',
      memorama: 'MÁSCARAS GEMELAS · SNES 32-BIT',
      balanza: 'BALANZA DE JADE · SNES 32-BIT',
      kukulcan: 'SENDA DE KUKULKÁN · SNES 32-BIT',
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

  // 5 Arcade Games in catalog with authentic SNES 32x32 pixel art scenes
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
        <svg viewBox="0 0 374 144" className="w-full h-full bg-[#0c1410] [image-rendering:pixelated]" shapeRendering="crispEdges">
          {/* SNES Stone Wall Background Grid */}
          <rect x="0" y="0" width="374" height="144" fill="#0d1813" />
          <line x1="0" y1="36" x2="374" y2="36" stroke="#07100c" strokeWidth="2" />
          <line x1="0" y1="72" x2="374" y2="72" stroke="#07100c" strokeWidth="2" />
          <line x1="0" y1="108" x2="374" y2="108" stroke="#07100c" strokeWidth="2" />

          {/* Stepped Pixel Pyramid in background */}
          <rect x="150" y="24" width="74" height="16" fill="#15261d" />
          <rect x="130" y="40" width="114" height="20" fill="#15261d" />
          <rect x="110" y="60" width="154" height="24" fill="#15261d" />
          <rect x="90" y="84" width="194" height="28" fill="#15261d" />
          <rect x="70" y="112" width="234" height="32" fill="#15261d" />

          {/* Kukulkan Serpent Pixel Spine Track */}
          <rect x="16" y="96" width="48" height="20" fill="#1e6b4b" stroke="#000" strokeWidth="1" />
          <rect x="56" y="68" width="48" height="20" fill="#1e6b4b" stroke="#000" strokeWidth="1" />
          <rect x="96" y="48" width="60" height="20" fill="#3ca276" stroke="#000" strokeWidth="1" />
          <rect x="148" y="72" width="60" height="20" fill="#3ca276" stroke="#000" strokeWidth="1" />
          <rect x="200" y="56" width="60" height="20" fill="#1e6b4b" stroke="#000" strokeWidth="1" />
          <rect x="252" y="80" width="56" height="20" fill="#3ca276" stroke="#000" strokeWidth="1" />

          {/* Feathered Serpent Head in 32x32 Pixel Art */}
          <g transform="translate(304, 70)">
            <rect x="0" y="4" width="28" height="24" fill="#fabc4c" stroke="#000" strokeWidth="1" />
            <rect x="4" y="0" width="8" height="8" fill="#e2725b" />
            <rect x="12" y="-4" width="10" height="8" fill="#3ca276" />
            <rect x="14" y="8" width="5" height="5" fill="#ef4444" stroke="#000" strokeWidth="0.5" />
            <rect x="16" y="9" width="2" height="2" fill="#ffffff" />
            {/* Forked tongue */}
            <rect x="28" y="16" width="8" height="2" fill="#ef4444" />
            <rect x="34" y="12" width="4" height="2" fill="#ef4444" />
            <rect x="34" y="20" width="4" height="2" fill="#ef4444" />
          </g>

          {/* SNES 32x32 Spherical Pixel Orbs along track */}
          {/* Orb 1: Gold 5 */}
          <g transform="translate(36, 88)">
            <rect x="2" y="0" width="16" height="20" fill="#fabc4c" stroke="#000" strokeWidth="1" />
            <rect x="0" y="2" width="20" height="16" fill="#fabc4c" stroke="#000" strokeWidth="1" />
            <rect x="3" y="3" width="4" height="4" fill="#ffffff" />
            <rect x="4" y="14" width="12" height="3" fill="#b45309" />
            <text x="10" y="14" fill="#3f1a02" fontSize="8" fontFamily="Press Start 2P" textAnchor="middle">5</text>
          </g>

          {/* Orb 2: Jade 15 */}
          <g transform="translate(116, 40)">
            <rect x="2" y="0" width="16" height="20" fill="#76d4e4" stroke="#000" strokeWidth="1" />
            <rect x="0" y="2" width="20" height="16" fill="#76d4e4" stroke="#000" strokeWidth="1" />
            <rect x="3" y="3" width="4" height="4" fill="#ffffff" />
            <rect x="4" y="14" width="12" height="3" fill="#0e7490" />
            <text x="10" y="14" fill="#083344" fontSize="7" fontFamily="Press Start 2P" textAnchor="middle">15</text>
          </g>

          {/* Orb 3: Ruby 10 */}
          <g transform="translate(220, 48)">
            <rect x="2" y="0" width="16" height="20" fill="#ef4444" stroke="#000" strokeWidth="1" />
            <rect x="0" y="2" width="20" height="16" fill="#ef4444" stroke="#000" strokeWidth="1" />
            <rect x="3" y="3" width="4" height="4" fill="#ffffff" />
            <rect x="4" y="14" width="12" height="3" fill="#991b1b" />
            <text x="10" y="14" fill="#ffffff" fontSize="7" fontFamily="Press Start 2P" textAnchor="middle">10</text>
          </g>
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
        <svg viewBox="0 0 374 144" className="w-full h-full bg-[#160d0f] [image-rendering:pixelated]" shapeRendering="crispEdges">
          {/* Temple Stone Wall */}
          <rect x="0" y="0" width="374" height="144" fill="#191013" />
          <line x1="0" y1="36" x2="374" y2="36" stroke="#0a0507" strokeWidth="2" />
          <line x1="0" y1="72" x2="374" y2="72" stroke="#0a0507" strokeWidth="2" />
          <line x1="0" y1="108" x2="374" y2="108" stroke="#0a0507" strokeWidth="2" />

          {/* Stepped Temple Silhouette */}
          <rect x="140" y="16" width="94" height="20" fill="#24171a" stroke="#000" strokeWidth="1" />
          <rect x="110" y="36" width="154" height="20" fill="#24171a" stroke="#000" strokeWidth="1" />
          <rect x="80" y="56" width="214" height="20" fill="#24171a" stroke="#000" strokeWidth="1" />

          {/* Falling and Stacked 32x32 Quad-Beveled SNES Tetrominoes */}
          {/* 1. Jade Bar (I-piece) */}
          <g transform="translate(60, 96)">
            {[0, 24, 48, 72].map((ox) => (
              <g key={ox} transform={`translate(${ox}, 0)`}>
                <rect x="0" y="0" width="24" height="24" fill="#10b981" stroke="#000" strokeWidth="1" />
                <rect x="1" y="1" width="22" height="2" fill="#6ee7b7" />
                <rect x="1" y="1" width="2" height="22" fill="#6ee7b7" />
                <rect x="1" y="21" width="22" height="2" fill="#047857" />
                <rect x="21" y="1" width="2" height="22" fill="#047857" />
                <rect x="9" y="9" width="6" height="6" fill="#022c22" />
              </g>
            ))}
          </g>

          {/* 2. Gold Block (O-piece) */}
          <g transform="translate(170, 72)">
            {[
              [0, 0], [24, 0],
              [0, 24], [24, 24]
            ].map(([ox, oy], idx) => (
              <g key={idx} transform={`translate(${ox}, ${oy})`}>
                <rect x="0" y="0" width="24" height="24" fill="#fbbf24" stroke="#000" strokeWidth="1" />
                <rect x="1" y="1" width="22" height="2" fill="#fef08a" />
                <rect x="1" y="1" width="2" height="22" fill="#fef08a" />
                <rect x="1" y="21" width="22" height="2" fill="#d97706" />
                <rect x="21" y="1" width="2" height="22" fill="#d97706" />
                <rect x="9" y="9" width="6" height="6" fill="#78350f" />
              </g>
            ))}
          </g>

          {/* 3. Ruby T-piece */}
          <g transform="translate(250, 48)">
            {[
              [24, 0],
              [0, 24], [24, 24], [48, 24]
            ].map(([ox, oy], idx) => (
              <g key={idx} transform={`translate(${ox}, ${oy})`}>
                <rect x="0" y="0" width="24" height="24" fill="#ef4444" stroke="#000" strokeWidth="1" />
                <rect x="1" y="1" width="22" height="2" fill="#fca5a5" />
                <rect x="1" y="1" width="2" height="22" fill="#fca5a5" />
                <rect x="1" y="21" width="22" height="2" fill="#b91c1c" />
                <rect x="21" y="1" width="2" height="22" fill="#b91c1c" />
                <rect x="9" y="9" width="6" height="6" fill="#450a0a" />
              </g>
            ))}
          </g>
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
        <svg viewBox="0 0 374 144" className="w-full h-full bg-[#181116] [image-rendering:pixelated]" shapeRendering="crispEdges">
          {/* Temple Chamber Masonry */}
          <rect x="0" y="0" width="374" height="144" fill="#1e141a" />
          <line x1="0" y1="48" x2="374" y2="48" stroke="#0e0a0d" strokeWidth="2" />
          <line x1="0" y1="96" x2="374" y2="96" stroke="#0e0a0d" strokeWidth="2" />

          {/* Left Stone Tablet (Mayan 7: 2 dots + 1 bar) */}
          <g transform="translate(68, 20)">
            <rect x="0" y="0" width="68" height="98" fill="#251a1d" stroke="#000" strokeWidth="2" />
            <rect x="2" y="2" width="64" height="2" fill="#7a5009" />
            <rect x="2" y="2" width="2" height="94" fill="#7a5009" />
            <rect x="2" y="94" width="64" height="2" fill="#100a08" />
            <rect x="64" y="2" width="2" height="94" fill="#100a08" />

            {/* 2 Spherical Dots */}
            <rect x="20" y="24" width="10" height="10" fill="#fabc4c" stroke="#000" strokeWidth="1" />
            <rect x="21" y="25" width="3" height="3" fill="#ffffff" />
            <rect x="38" y="24" width="10" height="10" fill="#fabc4c" stroke="#000" strokeWidth="1" />
            <rect x="39" y="25" width="3" height="3" fill="#ffffff" />

            {/* 1 Beveled Bar */}
            <rect x="14" y="44" width="40" height="10" fill="#d99b26" stroke="#000" strokeWidth="1" />
            <rect x="15" y="45" width="38" height="2" fill="#fef08a" />
            <rect x="15" y="51" width="38" height="2" fill="#78350f" />

            <text x="34" y="78" fill="#fabc4c" fontSize="8" fontFamily="Press Start 2P" textAnchor="middle">
              GLIFO
            </text>
          </g>

          {/* Central Carved Jade Mask */}
          <g transform="translate(162, 36)">
            <rect x="0" y="8" width="50" height="56" fill="#1e6b4b" stroke="#000" strokeWidth="2" />
            <rect x="4" y="0" width="42" height="10" fill="#fabc4c" stroke="#000" strokeWidth="1" />
            <rect x="18" y="-6" width="14" height="8" fill="#76d4e4" stroke="#000" strokeWidth="1" />
            {/* Mask Eyes */}
            <rect x="8" y="22" width="10" height="10" fill="#76d4e4" stroke="#000" strokeWidth="1" />
            <rect x="10" y="24" width="3" height="3" fill="#ffffff" />
            <rect x="32" y="22" width="10" height="10" fill="#76d4e4" stroke="#000" strokeWidth="1" />
            <rect x="34" y="24" width="3" height="3" fill="#ffffff" />
            {/* Nose */}
            <rect x="22" y="26" width="6" height="14" fill="#3ca276" stroke="#000" strokeWidth="1" />
            {/* Mouth */}
            <rect x="14" y="44" width="22" height="8" fill="#0c1d15" stroke="#000" strokeWidth="1" />
            <rect x="18" y="46" width="4" height="4" fill="#ffffff" />
            <rect x="28" y="46" width="4" height="4" fill="#ffffff" />
          </g>

          {/* Right Stone Tablet (Arabic 7) */}
          <g transform="translate(238, 20)">
            <rect x="0" y="0" width="68" height="98" fill="#251a1d" stroke="#000" strokeWidth="2" />
            <rect x="2" y="2" width="64" height="2" fill="#3ca276" />
            <rect x="2" y="2" width="2" height="94" fill="#3ca276" />
            <rect x="2" y="94" width="64" height="2" fill="#092014" />
            <rect x="64" y="2" width="2" height="94" fill="#092014" />

            <text x="34" y="52" fill="#80d5ae" fontSize="26" fontFamily="Press Start 2P" textAnchor="middle">
              7
            </text>
            <text x="34" y="78" fill="#3ca276" fontSize="8" fontFamily="Press Start 2P" textAnchor="middle">
              NUM
            </text>
          </g>
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
        <svg viewBox="0 0 374 144" className="w-full h-full bg-[#121015] [image-rendering:pixelated]" shapeRendering="crispEdges">
          {/* Temple Wall */}
          <rect x="0" y="0" width="374" height="144" fill="#18141d" />
          <line x1="0" y1="48" x2="374" y2="48" stroke="#09070c" strokeWidth="2" />
          <line x1="0" y1="96" x2="374" y2="96" stroke="#09070c" strokeWidth="2" />

          {/* Stepped Central Fulcrum Pyramid */}
          <rect x="175" y="44" width="24" height="14" fill="#7a5009" stroke="#000" strokeWidth="1" />
          <rect x="165" y="58" width="44" height="20" fill="#58413f" stroke="#000" strokeWidth="1" />
          <rect x="155" y="78" width="64" height="24" fill="#382928" stroke="#000" strokeWidth="1" />
          <rect x="145" y="102" width="84" height="26" fill="#201716" stroke="#000" strokeWidth="1" />

          {/* Pivot Jewel */}
          <rect x="181" y="38" width="12" height="12" fill="#fabc4c" stroke="#000" strokeWidth="1" />
          <rect x="183" y="40" width="3" height="3" fill="#ffffff" />

          {/* Tilted Balance Beam */}
          <g transform="rotate(-6 187 44)">
            <rect x="60" y="42" width="254" height="8" fill="#d4af37" stroke="#000" strokeWidth="1.5" />
            <rect x="60" y="42" width="254" height="2" fill="#fef08a" />
            <rect x="60" y="48" width="254" height="2" fill="#78350f" />

            {/* Left Pan (Jade weights) */}
            <g transform="translate(80, 50)">
              <rect x="0" y="0" width="2" height="42" fill="#fabc4c" />
              <rect x="-30" y="42" width="62" height="10" fill="#281e20" stroke="#fabc4c" strokeWidth="1.5" />
              {/* Weights: 1 + 5 */}
              <rect x="-22" y="34" width="8" height="8" fill="#fabc4c" stroke="#000" strokeWidth="1" />
              <rect x="-10" y="32" width="24" height="10" fill="#d99b26" stroke="#000" strokeWidth="1" />
            </g>

            {/* Right Pan (Tribute target 20) */}
            <g transform="translate(290, 50)">
              <rect x="0" y="0" width="2" height="42" fill="#76d4e4" />
              <rect x="-30" y="42" width="62" height="10" fill="#281e20" stroke="#76d4e4" strokeWidth="1.5" />
              {/* Gold sack tribute */}
              <rect x="-12" y="28" width="24" height="14" fill="#76d4e4" stroke="#000" strokeWidth="1" />
              <text x="0" y="38" fill="#083344" fontSize="7" fontFamily="Press Start 2P" textAnchor="middle">20</text>
            </g>
          </g>
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
        <svg viewBox="0 0 374 144" className="w-full h-full bg-[#0d0c18] [image-rendering:pixelated]" shapeRendering="crispEdges">
          {/* Maya Blue Cosmic Pixel Dither Background */}
          <rect x="0" y="0" width="374" height="144" fill="#120e24" />
          <line x1="0" y1="48" x2="374" y2="48" stroke="#080612" strokeWidth="2" />
          <line x1="0" y1="96" x2="374" y2="96" stroke="#080612" strokeWidth="2" />

          {/* Dithering stars in Maya Blue (#73c2fb) */}
          {[
            [30, 24], [60, 110], [90, 34], [130, 120], [180, 16],
            [230, 130], [270, 30], [310, 100], [340, 40]
          ].map(([sx, sy], i) => (
            <rect key={i} x={sx} y={sy} width="3" height="3" fill="#73c2fb" />
          ))}

          {/* Large SNES 32x32 Pixel Art Mayan Shell (Zero Symbol) */}
          <g transform="translate(142, 28)">
            {/* Shell Outer Contour in Black */}
            <rect x="12" y="4" width="66" height="80" fill="#000" />
            <rect x="4" y="12" width="82" height="64" fill="#000" />

            {/* Shell Body Gold */}
            <rect x="14" y="6" width="62" height="76" fill="#fabc4c" />
            <rect x="6" y="14" width="78" height="60" fill="#fabc4c" />

            {/* Light Rim Highlight */}
            <rect x="14" y="6" width="62" height="4" fill="#fef08a" />
            <rect x="6" y="14" width="4" height="60" fill="#fef08a" />

            {/* Dark Bottom Rim Shadow */}
            <rect x="14" y="78" width="62" height="4" fill="#b45309" />
            <rect x="80" y="14" width="4" height="60" fill="#b45309" />

            {/* Internal Conch Carved Grooves */}
            <rect x="14" y="40" width="62" height="6" fill="#78350f" />
            <rect x="30" y="14" width="6" height="58" fill="#78350f" />
            <rect x="54" y="14" width="6" height="58" fill="#78350f" />

            {/* Central Jade Seed Core */}
            <rect x="36" y="24" width="18" height="16" fill="#76d4e4" />
            <rect x="38" y="26" width="6" height="6" fill="#ffffff" />
            <rect x="36" y="46" width="18" height="16" fill="#76d4e4" />
          </g>

          {/* Orbiting Pixel Zero Badge */}
          <g transform="translate(50, 48)">
            <rect x="0" y="0" width="28" height="28" fill="#73c2fb" stroke="#000" strokeWidth="2" />
            <rect x="2" y="2" width="4" height="4" fill="#ffffff" />
            <text x="14" y="19" fill="#001830" fontSize="11" fontFamily="Press Start 2P" textAnchor="middle">0</text>
          </g>

          {/* Orbiting Pixel 20 Badge */}
          <g transform="translate(296, 68)">
            <rect x="0" y="0" width="34" height="28" fill="#3ca276" stroke="#000" strokeWidth="2" />
            <rect x="2" y="2" width="4" height="4" fill="#ffffff" />
            <text x="17" y="19" fill="#052414" fontSize="9" fontFamily="Press Start 2P" textAnchor="middle">20</text>
          </g>
        </svg>
      ),
    },
  ];

  // Real-time filtering by category
  const filteredGames = ARCADE_GAMES.filter((game) => {
    if (selectedFilter === 'TODOS') return true;
    return game.category === selectedFilter;
  });

  const SENDA_LEVEL_MAP: Record<string, { level: string; label: string }> = {
    kukulcan: { level: 'NIVEL 1', label: 'SENDA DE KUKULKÁN' },
    memorama: { level: 'NIVEL 2', label: 'MÁSCARAS GEMELAS' },
    balanza: { level: 'NIVEL 3', label: 'BALANZA DE JADE' },
    tetris: { level: 'NIVEL 4', label: 'TETRIS AZTECA' },
    cero: { level: 'NIVEL 5', label: 'DESAFÍO ARITMÉTICO' },
  };

  return (
    <div className="w-full max-w-[440px] mx-auto px-2.5 py-3 pb-36 font-silkscreen select-none text-[#FFFDF2]">
      {/* Return to Feed Bar */}
      {onBackToFeed && (
        <div className="w-full flex items-center justify-between pb-3">
          <button
            onClick={onBackToFeed}
            className="flex items-center gap-1.5 text-[9.5px] text-[#FFFDF2] hover:text-[#2A7B4C] font-press-start bg-[#180a0c] hover:bg-[#261013] px-3 py-2 border border-[#9E2A2B]/70 [box-shadow:2px_2px_0px_#000,_inset_1.5px_1.5px_0px_#ffffff22] cursor-pointer transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← VOLVER AL FEED</span>
          </button>
          <span className="font-press-start text-[8.5px] text-[#2A7B4C] bg-[#070203] px-2.5 py-1 border border-[#2A7B4C]/60 [box-shadow:1px_1px_0px_#000]">
            {filteredGames.length} CARTUCHOS
          </span>
        </div>
      )}

      {/* ── SECTION: FILTROS ARCADE SNES ── */}
      <div className="w-full flex flex-col gap-2 pt-[2px] pb-3">
        {/* Title row */}
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 10 10" className="w-3 h-3 fill-[#2A7B4C] [image-rendering:pixelated]" shapeRendering="crispEdges">
              <rect x="4" y="0" width="2" height="2" />
              <rect x="2" y="2" width="6" height="2" />
              <rect x="0" y="4" width="10" height="2" />
              <rect x="2" y="6" width="6" height="2" />
              <rect x="4" y="8" width="2" height="2" />
            </svg>
            <span className="text-[11px]/[16px] font-['Press_Start_2P',system-ui,sans-serif] text-[#FFFDF2] font-bold tracking-tight">
              SALA DE MAQUINITAS
            </span>
          </div>
          <span className="text-[8.5px] font-press-start text-[#2A7B4C]">
            SNES 32-BIT
          </span>
        </div>

        {/* Filter Pills / Tabs */}
        <div className="w-full flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {(['TODOS', 'MEMORIA', 'ANALISIS', 'VELOCIDAD'] as FilterCategory[]).map((cat) => {
            const isSelected = selectedFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                className={`px-3 py-1.5 text-[8.5px] font-press-start cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-[#2A7B4C] text-[#FFFDF2] border-black [box-shadow:2px_2px_0px_#000,_inset_1px_1px_0px_#ffffff44]'
                    : 'bg-[#180a0c] text-[#a89b88] hover:text-[#FFFDF2] border-[#381518] [box-shadow:1px_1px_0px_#000]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── SECTION: CARDS DE JUEGOS (SNES CARTRIDGES) ── */}
      <div className="w-full flex flex-col gap-4 items-center">
        {filteredGames.map((game) => (
          <div
            key={game.id}
            className="w-full flex flex-col bg-[#180a0c] border-2 border-[#2A7B4C] [box-shadow:3px_3px_0px_#000,_inset_1.5px_1.5px_0px_#ffffff18] overflow-hidden"
          >
            {/* Top 144px Hero SNES Pixel Art Banner */}
            <div className="w-full h-[144px] bg-[#070203] relative overflow-hidden border-b-2 border-[#2A7B4C]">
              <div className="w-full h-full">
                {game.bannerIllustration}
              </div>

              {/* Top-left Badge */}
              <div className="absolute left-2 top-2 px-2 py-1 bg-[#9E2A2B] border border-black [box-shadow:1px_1px_0px_#000] z-10">
                <span className="text-[8px] text-[#FFFDF2] font-press-start font-bold">
                  {game.badge}
                </span>
              </div>

              {/* Top-right Record */}
              <div className="absolute right-2 top-2 px-2 py-1 bg-[#06140c] border border-[#2A7B4C] [box-shadow:1px_1px_0px_#000] z-10">
                <span className="text-[8px] text-[#86efac] font-press-start font-bold">
                  {game.record}
                </span>
              </div>
            </div>

            {/* Lower Content Container */}
            <div className="w-full flex flex-col gap-3 p-3.5 bg-[#14080a]">
              {/* Senda Integration Badge */}
              {SENDA_LEVEL_MAP[game.id] && (
                <div className="flex items-center justify-between px-2.5 py-1.5 bg-[#06140c] border border-[#2A7B4C] [box-shadow:1px_1px_0px_#000]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#2A7B4C] animate-pulse" />
                    <span className="text-[8px] font-press-start text-[#86efac]">
                      JUGABLE EN SENDA
                    </span>
                  </div>
                  <span className="text-[8px] font-press-start text-[#FFFDF2]">
                    {SENDA_LEVEL_MAP[game.id].level}
                  </span>
                </div>
              )}

              {/* Title & Description with enhanced contrast */}
              <div className="flex flex-col gap-1.5">
                <h4 className="text-[12.5px] text-[#FFFDF2] font-press-start tracking-tight">
                  {game.title}
                </h4>
                <p className="text-[11px]/[17px] text-[#e0d6c4] font-['Space_Mono',monospace]">
                  {game.desc}
                </p>
              </div>

              {/* Tags Row */}
              <div className="flex flex-row gap-1.5 items-center flex-wrap">
                {game.tags.map((tag) => (
                  <div
                    key={tag}
                    className="px-2 py-1 bg-[#070203] border border-[#9E2A2B]/70"
                  >
                    <span className="text-[8px] text-[#FFFDF2] font-press-start font-medium">
                      {tag}
                    </span>
                  </div>
                ))}
              </div>

              {/* Button: JUGAR LIBRE */}
              <button
                type="button"
                onClick={() => setActiveGame(game.engine)}
                className="w-full py-3 bg-[#2A7B4C] hover:bg-[#34985e] text-[#FFFDF2] font-silkscreen font-bold text-[11px] tracking-wider border-2 border-black [box-shadow:2px_2px_0px_#000,_inset_1.5px_1.5px_0px_#ffffff66] cursor-pointer active:translate-y-0.5 transition"
              >
                JUGAR LIBRE ▶
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

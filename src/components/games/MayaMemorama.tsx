import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, RefreshCw, Star, Check } from 'lucide-react';
import { GameNode } from '../../types';
import { GrecaBar } from '../GrecaBar';

interface MayaMemoramaProps {
  node?: GameNode | null;
  onClose: () => void;
  onReward?: (coins: number) => void;
  onVictory?: (stars: number, coins: number) => void;
}

interface CardItem {
  id: string;
  pairId: number;
  type: 'glyph' | 'arabic';
  numberValue: number;
  label: string;
  subtitle: string;
}

const NUM_PAIRS_DATA = [
  { val: 0, title: 'Concha (Semilla)', subtitle: 'Cero en cuenta larga' },
  { val: 1, title: 'Un Punto', subtitle: 'Unidad Sagrada' },
  { val: 3, title: 'Tres Puntos', subtitle: 'Tríada Lunar' },
  { val: 5, title: 'Una Barra', subtitle: 'Quinquenio' },
  { val: 7, title: 'Una Barra + 2 Puntos', subtitle: 'Número Siete' },
  { val: 10, title: 'Dos Barras', subtitle: 'Doble Barra (5+5)' },
  { val: 13, title: 'Dos Barras + 3 Puntos', subtitle: 'Número Ritual Tzolkin' },
  { val: 15, title: 'Tres Barras', subtitle: 'Triple Barra (5+5+5)' },
];

export const MayaMemorama: React.FC<MayaMemoramaProps> = ({ node, onClose, onReward, onVictory }) => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isWon, setIsWon] = useState(false);

  // 8-bit sound generator
  const playBeep = useCallback((freq: number, type: OscillatorType = 'sine', dur = 0.08) => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + dur);
    } catch {
      // Audio fallback
    }
  }, []);

  // SNES 32x32 Pixel Art Shell (Mayan Zero)
  const renderPixelShell = () => (
    <svg viewBox="0 0 32 32" className="w-10 h-10 [image-rendering:pixelated]" shapeRendering="crispEdges">
      {/* Outer shell contour */}
      <rect x="6" y="8" width="20" height="16" fill="#1b120c" />
      <rect x="8" y="6" width="16" height="20" fill="#1b120c" />
      {/* Shell ridges in gold & jade */}
      <rect x="8" y="8" width="16" height="16" fill="#fabc4c" />
      <rect x="8" y="8" width="16" height="2" fill="#fef08a" />
      <rect x="8" y="8" width="2" height="16" fill="#fef08a" />
      <rect x="22" y="8" width="2" height="16" fill="#b45309" />
      <rect x="8" y="22" width="16" height="2" fill="#b45309" />
      {/* Internal spiral segments */}
      <rect x="11" y="11" width="10" height="10" fill="#78350f" />
      <rect x="13" y="13" width="6" height="6" fill="#76d4e4" />
      <rect x="14" y="14" width="4" height="4" fill="#a5f3fc" />
      <rect x="15" y="15" width="2" height="2" fill="#ffffff" />
      {/* Rib accents */}
      <rect x="6" y="15" width="2" height="2" fill="#fabc4c" />
      <rect x="24" y="15" width="2" height="2" fill="#fabc4c" />
    </svg>
  );

  // SNES 32x32 Pixel Art Card Back (Carved Mayan Deity Mask)
  const renderCardBack = () => (
    <div className="flex flex-col items-center justify-center gap-1 select-none">
      <svg viewBox="0 0 32 32" className="w-9 h-9 [image-rendering:pixelated]" shapeRendering="crispEdges">
        {/* Stone frame */}
        <rect x="2" y="2" width="28" height="28" fill="#191310" stroke="#000" strokeWidth="1" />
        <rect x="4" y="4" width="24" height="2" fill="#7a5009" />
        <rect x="4" y="4" width="2" height="24" fill="#7a5009" />
        <rect x="26" y="4" width="2" height="24" fill="#100a06" />
        <rect x="4" y="26" width="24" height="2" fill="#100a06" />
        {/* Mayan Mask Headdress */}
        <rect x="8" y="6" width="16" height="3" fill="#fabc4c" />
        <rect x="14" y="4" width="4" height="2" fill="#76d4e4" />
        {/* Forehead & Brows */}
        <rect x="9" y="10" width="14" height="2" fill="#e2725b" />
        {/* Eyes (Jade Spools) */}
        <rect x="10" y="13" width="3" height="3" fill="#76d4e4" />
        <rect x="11" y="14" width="1" height="1" fill="#ffffff" />
        <rect x="19" y="13" width="3" height="3" fill="#76d4e4" />
        <rect x="20" y="14" width="1" height="1" fill="#ffffff" />
        {/* Nose bridge */}
        <rect x="15" y="13" width="2" height="5" fill="#fabc4c" />
        {/* Mouth & Teeth */}
        <rect x="11" y="19" width="10" height="3" fill="#140c06" />
        <rect x="13" y="19" width="2" height="2" fill="#fffbeb" />
        <rect x="17" y="19" width="2" height="2" fill="#fffbeb" />
        {/* Ear Ornaments */}
        <rect x="6" y="14" width="2" height="4" fill="#fabc4c" />
        <rect x="24" y="14" width="2" height="4" fill="#fabc4c" />
        {/* Chin stone */}
        <rect x="13" y="23" width="6" height="2" fill="#7a5009" />
      </svg>
      <span className="font-silkscreen text-[7.5px] text-[#8e8576] tracking-tighter">
        ESTELA
      </span>
    </div>
  );

  // Render SNES 32-bit Mayan Glyph with Beveled Dots & Bars
  const renderMayaGlyph = (val: number) => {
    if (val === 0) {
      return (
        <div className="flex flex-col items-center">
          {renderPixelShell()}
          <span className="font-silkscreen text-[8px] text-[#fabc4c] mt-0.5">MIH (0)</span>
        </div>
      );
    }

    const bars = Math.floor(val / 5);
    const dots = val % 5;

    return (
      <div className="flex flex-col items-center gap-1.5 py-0.5">
        {/* SNES 32x32 Spherical Pixel Dots */}
        {dots > 0 && (
          <div className="flex gap-1.5 justify-center">
            {Array.from({ length: dots }).map((_, i) => (
              <div
                key={i}
                className="w-3.5 h-3.5 bg-[#fabc4c] border border-black [box-shadow:inset_1px_1px_0px_#ffffff,_inset_-1px_-1px_0px_#78350f,_1px_1px_0px_#000]"
              />
            ))}
          </div>
        )}

        {/* SNES Quad-Beveled Jade/Gold Bars */}
        {Array.from({ length: bars }).map((_, i) => (
          <div
            key={i}
            className="w-12 h-2.5 bg-[#d99b26] border border-black [box-shadow:inset_1px_1px_0px_#fef08a,_inset_-1px_-1px_0px_#78350f,_1px_1px_0px_#000000] relative"
          >
            {/* Center carved seam */}
            <div className="absolute inset-x-2 top-1 h-[1px] bg-[#78350f]" />
          </div>
        ))}
      </div>
    );
  };

  const setupGame = useCallback(() => {
    const deck: CardItem[] = [];
    NUM_PAIRS_DATA.forEach((item) => {
      deck.push({
        id: `glyph_${item.val}`,
        pairId: item.val,
        type: 'glyph',
        numberValue: item.val,
        label: `Glifo Maya`,
        subtitle: item.title,
      });
      deck.push({
        id: `arabic_${item.val}`,
        pairId: item.val,
        type: 'arabic',
        numberValue: item.val,
        label: `${item.val}`,
        subtitle: item.subtitle,
      });
    });

    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedIds([]);
    setMatchedPairs([]);
    setMoves(0);
    setSeconds(0);
    setIsWon(false);
  }, []);

  useEffect(() => {
    setupGame();
  }, [setupGame]);

  useEffect(() => {
    if (isWon) return;
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isWon]);

  const handleCardClick = (card: CardItem) => {
    if (flippedIds.length >= 2) return;
    if (flippedIds.includes(card.id)) return;
    if (matchedPairs.includes(card.pairId)) return;

    playBeep(330, 'triangle');
    const newFlipped = [...flippedIds, card.id];
    setFlippedIds(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const firstCard = cards.find((c) => c.id === newFlipped[0])!;
      const secondCard = card;

      if (firstCard.pairId === secondCard.pairId) {
        playBeep(660, 'sine', 0.2);
        setTimeout(() => {
          setMatchedPairs((mp) => {
            const nextMatches = [...mp, firstCard.pairId];
            if (nextMatches.length === NUM_PAIRS_DATA.length) {
              setIsWon(true);
              confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
              const earnedStars = moves <= 14 ? 3 : moves <= 20 ? 2 : 1;
              const earnedCoins = earnedStars * 40 + (node?.isBoss ? 80 : 30);
              if (onVictory) onVictory(earnedStars, earnedCoins);
              if (onReward) onReward(earnedCoins);
            }
            return nextMatches;
          });
          setFlippedIds([]);
        }, 500);
      } else {
        playBeep(200, 'sawtooth', 0.15);
        setTimeout(() => {
          setFlippedIds([]);
        }, 1100);
      }
    }
  };

  return (
    <div className="max-w-md sm:max-w-xl mx-auto px-2 py-3 space-y-3 pb-24">
      <GrecaBar />

      {/* Header Bar */}
      <div className="bg-[#1e1916] border-2 border-[#a62b2b] p-2.5 [box-shadow:3px_3px_0px_#000000,_inset_1.5px_1.5px_0px_#ffffff22] flex items-center justify-between">
        <button
          onClick={onClose}
          className="px-2.5 py-1 bg-[#2d2d2d] hover:bg-[#3d3d3d] text-[#d99b26] border border-[#444] font-silkscreen text-[11px] flex items-center gap-1 cursor-pointer [box-shadow:2px_2px_0px_#000]"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Salir
        </button>

        <div className="text-center">
          <h2 className="font-press-start text-[11px] sm:text-xs text-[#fbbf24]">
            {node ? node.title : 'MEMORAMA VIGESIMAL SNES'}
          </h2>
          <span className="font-silkscreen text-[10px] text-[#a39c8f]">
            Empareja glifos con números arábigos
          </span>
        </div>

        <button
          onClick={setupGame}
          className="p-1 bg-[#a62b2b] hover:bg-[#c0392b] text-white border border-[#d99b26] cursor-pointer [box-shadow:2px_2px_0px_#000]"
          title="Reiniciar"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-[#181818] border-2 border-[#33261c] p-2 text-center [box-shadow:2px_2px_0px_#000,_inset_1px_1px_0px_#ffffff18]">
          <span className="font-silkscreen text-[9px] text-[#8e8576] block">PAREJAS</span>
          <span className="font-press-start text-xs text-[#22c55e]">
            {matchedPairs.length}/{NUM_PAIRS_DATA.length}
          </span>
        </div>

        <div className="bg-[#181818] border-2 border-[#33261c] p-2 text-center [box-shadow:2px_2px_0px_#000,_inset_1px_1px_0px_#ffffff18]">
          <span className="font-silkscreen text-[9px] text-[#8e8576] block">INTENTOS</span>
          <span className="font-press-start text-xs text-[#fbbf24]">{moves}</span>
        </div>

        <div className="bg-[#181818] border-2 border-[#33261c] p-2 text-center [box-shadow:2px_2px_0px_#000,_inset_1px_1px_0px_#ffffff18]">
          <span className="font-silkscreen text-[9px] text-[#8e8576] block">TIEMPO</span>
          <span className="font-press-start text-xs text-[#06b6d4]">
            {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Cards Grid 4x4 with SNES Double-Beveled Stone Cartouches */}
      <div className="grid grid-cols-4 gap-2.5 p-3 bg-[#100d0c] border-2 border-[#58413f] [box-shadow:3px_3px_0px_#000,_inset_2px_2px_0px_#ffffff11]">
        {cards.map((card) => {
          const isFlipped = flippedIds.includes(card.id) || matchedPairs.includes(card.pairId);
          const isMatched = matchedPairs.includes(card.pairId);

          return (
            <div
              key={card.id}
              onClick={() => handleCardClick(card)}
              className={`h-24 sm:h-28 border-2 cursor-pointer transition-transform duration-100 select-none flex flex-col items-center justify-center p-1.5 text-center relative ${
                isMatched
                  ? 'bg-[#12281b] border-[#22c55e] [box-shadow:2px_2px_0px_#000,_inset_2px_2px_0px_#3ca27688,_inset_-2px_-2px_0px_#052011]'
                  : isFlipped
                  ? 'bg-[#2b1f11] border-[#fabc4c] [box-shadow:2px_2px_0px_#000,_inset_2px_2px_0px_#fef08a88,_inset_-2px_-2px_0px_#582d07]'
                  : 'bg-[#211714] border-[#4f362a] hover:border-[#fabc4c] [box-shadow:2px_2px_0px_#000,_inset_2px_2px_0px_#ffffff18,_inset_-2px_-2px_0px_#0c0705] active:translate-y-0.5'
              }`}
            >
              {isFlipped ? (
                <div className="w-full flex flex-col items-center justify-center">
                  {card.type === 'glyph' ? (
                    <div>
                      {renderMayaGlyph(card.numberValue)}
                      <span className="font-silkscreen text-[9px] text-[#fbbf24] block mt-1 tracking-tight">
                        GLIFO
                      </span>
                    </div>
                  ) : (
                    <div>
                      <span className="font-press-start text-xl sm:text-2xl text-[#fbbf24] block [text-shadow:2px_2px_0px_#000]">
                        {card.numberValue}
                      </span>
                      <span className="font-silkscreen text-[8.5px] text-[#fef08a] block line-clamp-1 mt-1">
                        {card.subtitle}
                      </span>
                    </div>
                  )}

                  {isMatched && (
                    <div className="absolute top-1 right-1 bg-[#22c55e] text-black border border-black p-0.5 [box-shadow:1px_1px_0px_#000]">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              ) : (
                renderCardBack()
              )}
            </div>
          );
        })}
      </div>

      {/* Win Modal */}
      {isWon && (
        <div className="p-4 bg-[#12281b] border-2 border-[#22c55e] text-center space-y-2 [box-shadow:4px_4px_0px_#000,_inset_2px_2px_0px_#3ca276]">
          <div className="w-10 h-10 mx-auto bg-[#22c55e] border-2 border-black flex items-center justify-center font-press-start text-sm text-black [box-shadow:2px_2px_0px_#000]">
            ★
          </div>
          <h3 className="font-press-start text-xs text-[#22c55e]">
            ¡MEMORIA DE SABIO DEMOSTRADA!
          </h3>
          <p className="font-silkscreen text-xs text-[#d1d5db]">
            Has emparejado todas las tablillas en {moves} intentos.
          </p>
          <div className="flex justify-center gap-1 text-[#fbbf24] py-1">
            <Star className="w-4 h-4 fill-[#fbbf24]" />
            <Star className="w-4 h-4 fill-[#fbbf24]" />
            <Star className="w-4 h-4 fill-[#fbbf24]" />
          </div>
          <div className="flex justify-center gap-2 pt-1">
            <button
              onClick={setupGame}
              className="px-3 py-1.5 bg-[#d99b26] hover:bg-[#f59e0b] text-black font-press-start text-[9px] retro-button cursor-pointer [box-shadow:2px_2px_0px_#000]"
            >
              JUGAR OTRA VEZ
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-[#2d2d2d] hover:bg-[#3d3d3d] text-white font-press-start text-[9px] border border-[#555] cursor-pointer [box-shadow:2px_2px_0px_#000]"
            >
              CONTINUAR
            </button>
          </div>
        </div>
      )}

      <GrecaBar />
    </div>
  );
};

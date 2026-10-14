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

  // Sound generator
  const playBeep = useCallback((freq: number, type: OscillatorType = 'sine', dur = 0.08) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
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

  const renderMayaGlyph = (val: number) => {
    if (val === 0) {
      return (
        <div className="flex flex-col items-center">
          <span className="text-2xl filter drop-shadow">🐚</span>
          <span className="font-silkscreen text-[8px] text-[#fbbf24] mt-0.5">Cero (0)</span>
        </div>
      );
    }

    const bars = Math.floor(val / 5);
    const dots = val % 5;

    return (
      <div className="flex flex-col items-center gap-1 py-0.5">
        {dots > 0 && (
          <div className="flex gap-1 justify-center">
            {Array.from({ length: dots }).map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full bg-[#fbbf24] border-2 border-[#b45309] shadow-sm"
              />
            ))}
          </div>
        )}
        {Array.from({ length: bars }).map((_, i) => (
          <div
            key={i}
            className="w-12 h-2 bg-[#d99b26] border border-[#78350f] rounded-xs shadow-sm"
          />
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
      <div className="bg-[#1e1916] border-2 border-[#a62b2b] p-2.5 rounded-lg flex items-center justify-between shadow-md">
        <button
          onClick={onClose}
          className="px-2.5 py-1 bg-[#2d2d2d] hover:bg-[#3d3d3d] text-[#d99b26] border border-[#444] rounded font-silkscreen text-[11px] flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Salir
        </button>

        <div className="text-center">
          <h2 className="font-press-start text-[11px] sm:text-xs text-[#fbbf24]">
            {node ? node.title : 'MEMORAMA VIGESIMAL MAYA'}
          </h2>
          <span className="font-silkscreen text-[10px] text-[#a39c8f]">
            Empareja glifos con números arábigos
          </span>
        </div>

        <button
          onClick={setupGame}
          className="p-1 bg-[#a62b2b] hover:bg-[#c0392b] text-white rounded border border-[#d99b26] cursor-pointer"
          title="Reiniciar"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-[#181818] border border-[#33261c] p-2 rounded text-center">
          <span className="font-silkscreen text-[9px] text-[#8e8576] block">PAREJAS</span>
          <span className="font-press-start text-xs text-[#22c55e]">
            {matchedPairs.length}/{NUM_PAIRS_DATA.length}
          </span>
        </div>

        <div className="bg-[#181818] border border-[#33261c] p-2 rounded text-center">
          <span className="font-silkscreen text-[9px] text-[#8e8576] block">INTENTOS</span>
          <span className="font-press-start text-xs text-[#fbbf24]">{moves}</span>
        </div>

        <div className="bg-[#181818] border border-[#33261c] p-2 rounded text-center">
          <span className="font-silkscreen text-[9px] text-[#8e8576] block">TIEMPO</span>
          <span className="font-press-start text-xs text-[#06b6d4]">
            {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Cards Grid 4x4 */}
      <div className="grid grid-cols-4 gap-2 p-2.5 bg-[#141414] border-2 border-[#33261c] rounded-lg">
        {cards.map((card) => {
          const isFlipped = flippedIds.includes(card.id) || matchedPairs.includes(card.pairId);
          const isMatched = matchedPairs.includes(card.pairId);

          return (
            <div
              key={card.id}
              onClick={() => handleCardClick(card)}
              className={`h-24 sm:h-28 rounded-md border cursor-pointer transition-all duration-200 select-none flex flex-col items-center justify-center p-1.5 text-center relative ${
                isMatched
                  ? 'bg-[#18261c] border-[#22c55e] opacity-90 shadow'
                  : isFlipped
                  ? 'bg-[#2b200b] border-[#d99b26] shadow-md scale-100'
                  : 'bg-[#241a15] border-[#44362b] hover:border-[#d99b26] shadow'
              }`}
            >
              {isFlipped ? (
                <div className="w-full flex flex-col items-center justify-center">
                  {card.type === 'glyph' ? (
                    <div>
                      {renderMayaGlyph(card.numberValue)}
                      <span className="font-silkscreen text-[8px] text-[#fbbf24] block mt-0.5">
                        GLIFO
                      </span>
                    </div>
                  ) : (
                    <div>
                      <span className="font-press-start text-2xl text-[#fbbf24] block">
                        {card.numberValue}
                      </span>
                      <span className="font-silkscreen text-[8px] text-[#b8b09f] block line-clamp-1">
                        {card.subtitle}
                      </span>
                    </div>
                  )}

                  {isMatched && (
                    <div className="absolute top-1 right-1 bg-[#22c55e] text-black rounded-full p-0.5">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-0.5">
                  <span className="text-xl">🗿</span>
                  <span className="font-silkscreen text-[8px] text-[#8e8576]">
                    TABLILLA
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Win Modal */}
      {isWon && (
        <div className="p-4 bg-[#18261c] border-2 border-[#22c55e] rounded-lg text-center space-y-2 shadow-xl">
          <div className="text-3xl">👑</div>
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
              className="px-3 py-1.5 bg-[#d99b26] hover:bg-[#f59e0b] text-black font-press-start text-[9px] rounded retro-button cursor-pointer"
            >
              JUGAR OTRA VEZ
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-[#2d2d2d] hover:bg-[#3d3d3d] text-white font-press-start text-[9px] rounded border border-[#555] cursor-pointer"
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

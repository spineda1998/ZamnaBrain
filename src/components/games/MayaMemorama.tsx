import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, RefreshCw, Trophy, Sparkles, Check, Clock, Zap } from 'lucide-react';
import { GrecaBar } from '../GrecaBar';

interface MayaMemoramaProps {
  onClose: () => void;
  onReward?: (coins: number) => void;
}

interface CardItem {
  id: string;
  pairId: number;
  type: 'glyph' | 'arabic';
  numberValue: number;
  label: string;
  subtitle: string;
}

// 8 Numerical Pairs for the current match
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

export const MayaMemorama: React.FC<MayaMemoramaProps> = ({ onClose, onReward }) => {
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

  // Render Maya Glyphs (Shell for 0, Dots and Bars)
  const renderMayaGlyph = (val: number) => {
    if (val === 0) {
      return (
        <div className="flex flex-col items-center">
          <span className="text-3xl filter drop-shadow">🐚</span>
          <span className="font-silkscreen text-[9px] text-[#fbbf24] mt-1">Concha (0)</span>
        </div>
      );
    }

    const bars = Math.floor(val / 5);
    const dots = val % 5;

    return (
      <div className="flex flex-col items-center gap-1.5 py-1">
        {dots > 0 && (
          <div className="flex gap-1.5 justify-center">
            {Array.from({ length: dots }).map((_, i) => (
              <div
                key={i}
                className="w-3.5 h-3.5 rounded-full bg-[#fbbf24] border-2 border-[#b45309] shadow-sm"
              />
            ))}
          </div>
        )}
        {Array.from({ length: bars }).map((_, i) => (
          <div
            key={i}
            className="w-16 h-2.5 bg-[#d99b26] border border-[#78350f] rounded-xs shadow-sm"
          />
        ))}
      </div>
    );
  };

  const setupGame = useCallback(() => {
    const deck: CardItem[] = [];

    NUM_PAIRS_DATA.forEach((item) => {
      // Glyph card
      deck.push({
        id: `glyph_${item.val}`,
        pairId: item.val,
        type: 'glyph',
        numberValue: item.val,
        label: `Glifo Maya`,
        subtitle: item.title,
      });

      // Arabic card
      deck.push({
        id: `arabic_${item.val}`,
        pairId: item.val,
        type: 'arabic',
        numberValue: item.val,
        label: `${item.val}`,
        subtitle: item.subtitle,
      });
    });

    // Shuffle deck
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

  // Timer
  useEffect(() => {
    if (isWon) return;
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isWon]);

  // Card click handler
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
        // Match!
        playBeep(660, 'sine', 0.2);
        setTimeout(() => {
          setMatchedPairs((mp) => {
            const nextMatches = [...mp, firstCard.pairId];
            if (nextMatches.length === NUM_PAIRS_DATA.length) {
              setIsWon(true);
              confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
              if (onReward) onReward(80);
            }
            return nextMatches;
          });
          setFlippedIds([]);
        }, 500);
      } else {
        // No match
        playBeep(200, 'sawtooth', 0.15);
        setTimeout(() => {
          setFlippedIds([]);
        }, 1100);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4 px-2 space-y-4">
      <GrecaBar />

      {/* Header Bar */}
      <div className="bg-[#1f1f1f] border-2 border-[#a62b2b] p-3 rounded-lg flex items-center justify-between shadow-lg">
        <button
          onClick={onClose}
          className="px-3 py-1.5 bg-[#2d2d2d] hover:bg-[#3d3d3d] text-[#d99b26] border border-[#444] rounded font-silkscreen text-xs flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al Templo
        </button>

        <div className="text-center">
          <h2 className="font-press-start text-xs sm:text-sm text-[#fbbf24]">
            MEMORAMA VIGESIMAL MAYA
          </h2>
          <span className="font-silkscreen text-[11px] text-[#9ca3af]">
            Empareja los glifos con su valor arábigo
          </span>
        </div>

        <button
          onClick={setupGame}
          className="p-1.5 bg-[#a62b2b] hover:bg-[#c0392b] text-[#f4efe6] rounded border border-[#d99b26] cursor-pointer"
          title="Reiniciar partida"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#1a1a1a] border border-[#333] p-2.5 rounded text-center">
          <span className="font-silkscreen text-[10px] text-[#9ca3af] block">PAREJAS</span>
          <span className="font-press-start text-xs text-[#22c55e]">
            {matchedPairs.length} / {NUM_PAIRS_DATA.length}
          </span>
        </div>

        <div className="bg-[#1a1a1a] border border-[#333] p-2.5 rounded text-center">
          <span className="font-silkscreen text-[10px] text-[#9ca3af] block">MOVIMIENTOS</span>
          <span className="font-press-start text-xs text-[#fbbf24]">{moves}</span>
        </div>

        <div className="bg-[#1a1a1a] border border-[#333] p-2.5 rounded text-center">
          <span className="font-silkscreen text-[10px] text-[#9ca3af] block">TIEMPO</span>
          <span className="font-press-start text-xs text-[#06b6d4]">
            {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#141414] border-4 border-[#333] rounded-lg">
        {cards.map((card) => {
          const isFlipped = flippedIds.includes(card.id) || matchedPairs.includes(card.pairId);
          const isMatched = matchedPairs.includes(card.pairId);

          return (
            <div
              key={card.id}
              onClick={() => handleCardClick(card)}
              className={`h-36 rounded-lg border-2 cursor-pointer transition-all duration-300 transform select-none flex flex-col items-center justify-center p-3 text-center relative ${
                isMatched
                  ? 'bg-[#18261c] border-[#22c55e] opacity-90 shadow-md scale-[0.98]'
                  : isFlipped
                  ? 'bg-[#2b220e] border-[#d99b26] shadow-xl scale-100'
                  : 'bg-[#261f1a] border-[#554336] hover:border-[#d99b26] hover:scale-[1.02] shadow-md'
              }`}
            >
              {isFlipped ? (
                <div className="w-full flex flex-col items-center justify-center space-y-1">
                  {card.type === 'glyph' ? (
                    <div>
                      {renderMayaGlyph(card.numberValue)}
                      <span className="font-silkscreen text-[10px] text-[#fbbf24] block mt-1">
                        GLIFO MAYA
                      </span>
                    </div>
                  ) : (
                    <div>
                      <span className="font-press-start text-3xl text-[#fbbf24] block mb-1">
                        {card.numberValue}
                      </span>
                      <span className="font-silkscreen text-[10px] text-[#e5e5e5] block line-clamp-1">
                        {card.subtitle}
                      </span>
                    </div>
                  )}

                  {isMatched && (
                    <div className="absolute top-1 right-1 bg-[#22c55e] text-black rounded-full p-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-1">
                  <span className="text-3xl filter drop-shadow">🗿</span>
                  <span className="font-silkscreen text-[9px] text-[#9ca3af]">
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
        <div className="p-6 bg-[#18261c] border-4 border-[#22c55e] rounded-lg text-center space-y-3 shadow-2xl">
          <div className="text-4xl">👑</div>
          <h3 className="font-press-start text-sm text-[#22c55e]">
            ¡MEMORIA DE SABIO MAYA DEMOSTRADA!
          </h3>
          <p className="font-silkscreen text-xs text-[#d1d5db]">
            Has emparejado todas las tablillas en {moves} movimientos y {seconds} segundos.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={setupGame}
              className="px-4 py-2 bg-[#d99b26] hover:bg-[#f59e0b] text-black font-press-start text-xs rounded retro-button cursor-pointer"
            >
              JUGAR OTRA VEZ
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#2d2d2d] hover:bg-[#3d3d3d] text-white font-press-start text-xs rounded border border-[#555] cursor-pointer"
            >
              VOLVER
            </button>
          </div>
        </div>
      )}

      <GrecaBar />
    </div>
  );
};

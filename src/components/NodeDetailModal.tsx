import React from 'react';
import { GameNode } from '../types';
import { Star, X, Flame, Sparkles, Grid, Layers } from 'lucide-react';
import { GrecaBar } from './GrecaBar';

interface NodeDetailModalProps {
  node: GameNode;
  onClose: () => void;
  onSelectGame: (node: GameNode, game: 'tetris' | 'memorama') => void;
}

export const NodeDetailModal: React.FC<NodeDetailModalProps> = ({
  node,
  onClose,
  onSelectGame,
}) => {
  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-md bg-[#1a1a1a] border-2 sm:border-4 border-[#d99b26] rounded-lg overflow-hidden shadow-2xl relative max-h-[92vh] flex flex-col">
        <GrecaBar />

        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="font-silkscreen text-[10px] text-[#fbbf24] bg-[#2a2015] px-2 py-0.5 rounded border border-[#d99b26]">
                  {node.category?.toUpperCase() || 'SABIDURÍA MAYA'}
                </span>
                {node.isBoss && (
                  <span className="font-press-start text-[8px] text-[#fca5a5] bg-[#7f1d1d] px-2 py-0.5 rounded border border-[#ef4444] flex items-center gap-1">
                    <Flame className="w-3 h-3 text-[#ef4444]" /> GUARDIÁN
                  </span>
                )}
              </div>
              <h3 className="font-press-start text-xs sm:text-sm text-[#f4efe6]">
                {node.title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[#888] hover:text-white rounded cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Description */}
          <div className="p-3 bg-[#141414] rounded border border-[#33261c] space-y-1">
            <p className="font-silkscreen text-xs text-[#d1d5db] leading-relaxed">
              {node.subtitle}
            </p>
            {node.requiredForUnlock && (
              <p className="font-silkscreen text-[10px] text-[#fbbf24]">
                ⚠️ Requisito ceremonial: {node.requiredForUnlock}
              </p>
            )}
          </div>

          {/* Stars & Reward */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 bg-[#14291c] border border-[#22c55e] rounded flex flex-col items-center justify-center text-center">
              <span className="font-silkscreen text-[9px] text-[#86efac]">
                MEJOR RESULTADO
              </span>
              <div className="flex items-center gap-1 mt-1">
                {[1, 2, 3].map((s) => (
                  <Star
                    key={s}
                    className={`w-3.5 h-3.5 ${
                      s <= node.stars
                        ? 'text-[#fbbf24] fill-[#fbbf24]'
                        : 'text-[#444]'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="p-2.5 bg-[#2b200b] border border-[#d99b26] rounded flex flex-col items-center justify-center text-center">
              <span className="font-silkscreen text-[9px] text-[#fde68a]">
                RECOMPENSA
              </span>
              <span className="font-press-start text-[9px] text-[#fbbf24] mt-1 line-clamp-1">
                {node.rewardLabel || 'Cuentas de Jade'}
              </span>
            </div>
          </div>

          {/* Game Selection Banner */}
          <div className="pt-1">
            <span className="font-press-start text-[9px] text-[#fbbf24] block mb-2 text-center">
              ELIGE TU PRUEBA PARA CONQUISTAR EL NODO:
            </span>

            <div className="grid grid-cols-1 gap-2.5">
              {/* Option 1: Tetris Maya */}
              <button
                onClick={() => onSelectGame(node, 'tetris')}
                className="w-full p-3 bg-[#241a15] hover:bg-[#34241d] border-2 border-[#d99b26] rounded-lg text-left flex items-center justify-between cursor-pointer retro-button transition group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded bg-[#15803d] border border-[#22c55e] flex items-center justify-center text-xl shrink-0">
                    🗿
                  </div>
                  <div>
                    <h4 className="font-press-start text-[10px] sm:text-xs text-[#fbbf24] group-hover:text-white">
                      TETRIS MAYA
                    </h4>
                    <p className="font-silkscreen text-[10px] text-[#a39c8f] mt-0.5">
                      Apila estelas de piedra y cálculo vigesimal
                    </p>
                  </div>
                </div>
                <span className="font-press-start text-[10px] text-[#22c55e] shrink-0 ml-2">
                  JUGAR →
                </span>
              </button>

              {/* Option 2: Memorama Maya */}
              <button
                onClick={() => onSelectGame(node, 'memorama')}
                className="w-full p-3 bg-[#191e24] hover:bg-[#202933] border-2 border-[#06b6d4] rounded-lg text-left flex items-center justify-between cursor-pointer retro-button transition group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded bg-[#0e7490] border border-[#06b6d4] flex items-center justify-center text-xl shrink-0">
                    🐚
                  </div>
                  <div>
                    <h4 className="font-press-start text-[10px] sm:text-xs text-[#06b6d4] group-hover:text-white">
                      MEMORAMA MAYA
                    </h4>
                    <p className="font-silkscreen text-[10px] text-[#a39c8f] mt-0.5">
                      Empareja glifos con números arábigos
                    </p>
                  </div>
                </div>
                <span className="font-press-start text-[10px] text-[#06b6d4] shrink-0 ml-2">
                  JUGAR →
                </span>
              </button>
            </div>
          </div>
        </div>

        <GrecaBar />
      </div>
    </div>
  );
};

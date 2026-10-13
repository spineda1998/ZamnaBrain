import React from 'react';
import { GameNode } from '../types';
import { Star, Play, X, Award, Flame, BookOpen } from 'lucide-react';
import { GrecaBar } from './GrecaBar';

interface NodeDetailModalProps {
  node: GameNode;
  onClose: () => void;
  onStartGame: (node: GameNode) => void;
}

export const NodeDetailModal: React.FC<NodeDetailModalProps> = ({
  node,
  onClose,
  onStartGame,
}) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#1a1a1a] border-4 border-[#d99b26] rounded-lg overflow-hidden shadow-2xl relative">
        <GrecaBar />

        <div className="p-6 space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-silkscreen text-[11px] text-[#d99b26] bg-[#31250b] px-2 py-0.5 rounded border border-[#d99b26]">
                  CATEGORÍA: {node.category?.toUpperCase() || 'SABIDURÍA MAYA'}
                </span>
                {node.isBoss && (
                  <span className="font-press-start text-[9px] text-[#ef4444] bg-[#7f1d1d] px-2 py-0.5 rounded border border-[#ef4444] flex items-center gap-1">
                    <Flame className="w-3 h-3" /> GUARDIÁN MAYOR
                  </span>
                )}
              </div>
              <h3 className="font-press-start text-base text-[#f4efe6]">
                {node.title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-[#888] hover:text-[#fff] rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Description */}
          <div className="p-4 bg-[#141414] rounded border border-[#333] space-y-2">
            <p className="font-silkscreen text-xs text-[#d1d5db] leading-relaxed">
              {node.subtitle}
            </p>
            {node.requiredForUnlock && (
              <p className="font-silkscreen text-[11px] text-[#fbbf24]">
                ⚠️ Requisito ceremonial: {node.requiredForUnlock}
              </p>
            )}
          </div>

          {/* Stars & Reward */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-[#18261c] border border-[#22c55e] rounded flex flex-col items-center justify-center">
              <span className="font-silkscreen text-[10px] text-[#86efac]">
                MEJOR RESULTADO
              </span>
              <div className="flex items-center gap-1 mt-1">
                {[1, 2, 3].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${
                      s <= node.stars
                        ? 'text-[#fbbf24] fill-[#fbbf24]'
                        : 'text-[#444]'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="p-3 bg-[#31250b] border border-[#d99b26] rounded flex flex-col items-center justify-center text-center">
              <span className="font-silkscreen text-[10px] text-[#fde68a]">
                RECOMPENSA
              </span>
              <span className="font-press-start text-[10px] text-[#fbbf24] mt-1 line-clamp-1">
                {node.rewardLabel || 'Cuentas de Jade'}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-[#262626] hover:bg-[#333] text-[#ccc] border border-[#555] rounded font-press-start text-xs cursor-pointer"
            >
              CERRAR
            </button>
            <button
              onClick={() => onStartGame(node)}
              className="flex-2 py-3 bg-[#a62b2b] hover:bg-[#c0392b] text-[#f4efe6] border-2 border-[#d99b26] rounded font-press-start text-xs retro-button flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <Play className="w-4 h-4 fill-current" />
              ENTRAR AL RETO (JUGAR)
            </button>
          </div>
        </div>

        <GrecaBar />
      </div>
    </div>
  );
};

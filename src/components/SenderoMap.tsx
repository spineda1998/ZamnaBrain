import React from 'react';
import { Section, GameNode } from '../types';
import { Sparkles, Lock, CheckCircle2, Play, Flame, Star } from 'lucide-react';

interface SenderoMapProps {
  sections: Section[];
  nodes: Record<string, GameNode[]>;
  onSelectNode: (node: GameNode) => void;
}

export const SenderoMap: React.FC<SenderoMapProps> = ({
  sections,
  nodes,
  onSelectNode,
}) => {
  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-10">
      {/* Introduction Hero */}
      <div className="bg-[#211d17] border-4 border-[#a62b2b] p-6 rounded-lg text-center relative overflow-hidden shadow-2xl">
        <div className="absolute top-2 left-2 text-2xl opacity-40">🪶</div>
        <div className="absolute top-2 right-2 text-2xl opacity-40">🪶</div>
        <span className="font-silkscreen text-xs text-[#d99b26] uppercase tracking-widest bg-[#31250b] px-3 py-1 rounded border border-[#d99b26]">
          Ruta Ceremonial de Conocimiento
        </span>
        <h2 className="font-press-start text-lg sm:text-xl text-[#f4efe6] mt-3">
          EL SENDERO SAGRADO
        </h2>
        <p className="font-silkscreen text-sm text-[#d4cfc5] max-w-xl mx-auto mt-2 leading-relaxed">
          Recorre las cámaras astronómicas de los sabios mayas. Resuelve retos de aritmética vigesimal, geometría sagrada y descifra glifos para obtener el favor de los dioses.
        </p>
      </div>

      {/* Sections List */}
      {sections.map((section, secIdx) => {
        const sectionNodes = nodes[section.id] || [];

        return (
          <div key={section.id} className="space-y-4">
            {/* Section Header */}
            <div className="flex items-center gap-3 border-b-2 border-[#444] pb-2">
              <span className="w-8 h-8 rounded bg-[#a62b2b] border border-[#d99b26] flex items-center justify-center font-press-start text-xs text-[#fbbf24]">
                {secIdx + 1}
              </span>
              <div>
                <h3 className="font-press-start text-sm text-[#fbbf24]">
                  {section.name}
                </h3>
                <p className="font-silkscreen text-xs text-[#9ca3af]">
                  {section.description}
                </p>
              </div>
            </div>

            {/* Nodes Chain */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
              {sectionNodes.map((node, nodeIdx) => {
                const isCompleted = node.status === 'completed';
                const isActive = node.status === 'active';
                const isLocked = node.status === 'locked';

                return (
                  <div
                    key={node.id}
                    onClick={() => {
                      if (!isLocked) onSelectNode(node);
                    }}
                    className={`relative rounded-lg p-5 border-4 transition-all duration-200 flex flex-col justify-between select-none ${
                      isCompleted
                        ? 'bg-[#18261c] border-[#22c55e] cursor-pointer hover:scale-[1.02] shadow-lg'
                        : isActive
                        ? 'bg-[#2b220e] border-[#d99b26] cursor-pointer hover:scale-[1.03] shadow-xl ring-2 ring-[#fbbf24] animate-pulse-border'
                        : 'bg-[#1c1c1c] border-[#383838] opacity-60 cursor-not-allowed'
                    }`}
                  >
                    {/* Status Top Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-press-start text-[10px] text-[#9ca3af]">
                        NODO {secIdx + 1}.{node.order}
                      </span>
                      {isCompleted ? (
                        <div className="flex items-center gap-1 bg-[#14291c] px-2 py-0.5 rounded border border-[#22c55e]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#22c55e]" />
                          <span className="font-silkscreen text-[10px] text-[#22c55e]">
                            Completado
                          </span>
                        </div>
                      ) : isActive ? (
                        <div className="flex items-center gap-1 bg-[#d99b26] px-2 py-0.5 rounded text-black font-press-start text-[9px] font-bold">
                          <Play className="w-3 h-3 fill-black" />
                          ACTIVO
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 bg-[#262626] px-2 py-0.5 rounded border border-[#444]">
                          <Lock className="w-3 h-3 text-[#777]" />
                          <span className="font-silkscreen text-[10px] text-[#777]">
                            Bloqueado
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Node Title & Category */}
                    <div>
                      {node.isBoss && (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 mb-2 bg-[#7f1d1d] text-[#fca5a5] border border-[#ef4444] rounded text-[9px] font-press-start">
                          <Flame className="w-3 h-3" /> GUARDIÁN MAYOR
                        </div>
                      )}
                      <h4 className="font-press-start text-xs text-[#f4efe6] leading-snug">
                        {node.title}
                      </h4>
                      <p className="font-silkscreen text-xs text-[#b8b09f] mt-1 line-clamp-2">
                        {node.subtitle}
                      </p>
                    </div>

                    {/* Stars and Reward Footer */}
                    <div className="mt-4 pt-3 border-t border-[#3a3a3a] flex items-center justify-between">
                      {/* Stars */}
                      <div className="flex items-center gap-1">
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

                      {/* Reward / Action */}
                      {isCompleted ? (
                        <span className="font-silkscreen text-[11px] text-[#22c55e] flex items-center gap-1">
                          🟢 +{node.jadeCoins}
                        </span>
                      ) : isActive ? (
                        <button className="px-3 py-1 bg-[#d99b26] hover:bg-[#f59e0b] text-black font-press-start text-[9px] rounded retro-button font-bold">
                          RETAR
                        </button>
                      ) : (
                        <span className="font-silkscreen text-[10px] text-[#666]">
                          Requiere anterior
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

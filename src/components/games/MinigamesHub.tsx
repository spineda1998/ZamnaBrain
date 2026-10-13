import React, { useState } from 'react';
import { ZumaGame } from '../ZumaGame';
import { MayaTetris } from './MayaTetris';
import { MayaMemorama } from './MayaMemorama';
import { Gamepad2, Play, Trophy, Sparkles } from 'lucide-react';

interface MinigamesHubProps {
  onBackToSendero?: () => void;
  initialGame?: 'zuma' | 'tetris' | 'memorama' | null;
}

export const MinigamesHub: React.FC<MinigamesHubProps> = ({
  initialGame = null,
}) => {
  const [activeGame, setActiveGame] = useState<'zuma' | 'tetris' | 'memorama' | null>(initialGame);

  if (activeGame === 'zuma') {
    return <ZumaGame onClose={() => setActiveGame(null)} />;
  }
  if (activeGame === 'tetris') {
    return <MayaTetris onClose={() => setActiveGame(null)} />;
  }
  if (activeGame === 'memorama') {
    return <MayaMemorama onClose={() => setActiveGame(null)} />;
  }

  const GAMES_LIST = [
    {
      id: 'zuma' as const,
      title: 'ZUMA SERPIENTE SAGRADA',
      category: 'ARCADE CLÁSICO · AGILIDAD',
      desc: 'Dispara esferas desde el ídolo central y alinea 3+ jades antes de que el rastro alcance el cráneo de Xibalba.',
      reward: '+100 Cacaos · Jade Solar',
      icon: '🐸',
      badgeColor: 'bg-[#a62b2b] text-white',
      borderColor: 'border-[#d99b26]',
    },
    {
      id: 'tetris' as const,
      title: 'TETRIS MAYA · CÁLCULO DE MAZORCAS',
      category: 'PUZZLE DE GRAVEDAD · BASE 20',
      desc: 'Apila bloques tallados de estelas y templos. Despeja líneas completas para ganar tributo imperial y multiplicadores de maná.',
      reward: '+40 Maná · 500 Pts',
      icon: '🗿',
      badgeColor: 'bg-[#15803d] text-[#86efac]',
      borderColor: 'border-[#22c55e]',
    },
    {
      id: 'memorama' as const,
      title: 'MEMORAMA VIGESIMAL MAYA',
      category: 'MEMORIA · DESCIFRADO DE GLIFOS',
      desc: 'Voltea tablillas sagradas y empareja los glifos de barras, puntos y conchas con sus números arábigos equivalentes.',
      reward: '+80 XP Códice · Cuentas Jade',
      icon: '🐚',
      badgeColor: 'bg-[#0e7490] text-[#a5f3fc]',
      borderColor: 'border-[#06b6d4]',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
      {/* Hero Header */}
      <div className="bg-[#211d17] border-4 border-[#a62b2b] p-6 rounded-lg text-center shadow-xl">
        <h2 className="font-press-start text-base sm:text-lg text-[#fbbf24] flex items-center justify-center gap-2">
          <Gamepad2 className="w-5 h-5 text-[#fbbf24]" />
          SALA DE MINIJUEGOS ARCADE MAYA
        </h2>
        <p className="font-silkscreen text-xs text-[#d1d5db] mt-2 max-w-lg mx-auto">
          Pon a prueba tus reflejos y sabiduría vigesimal en las cabinas arcade del templo. Cada partida otorga recompensas de jade y cacaos.
        </p>
      </div>

      {/* Cabinets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {GAMES_LIST.map((game) => (
          <div
            key={game.id}
            className={`bg-[#1c1c1c] border-4 ${game.borderColor} rounded-lg p-5 flex flex-col justify-between shadow-2xl hover:scale-[1.02] transition-all relative overflow-hidden`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">{game.icon}</span>
                <span className={`font-silkscreen text-[9px] px-2 py-0.5 rounded border border-white/20 ${game.badgeColor}`}>
                  CABINA ACTIVA
                </span>
              </div>

              <h3 className="font-press-start text-xs text-[#f4efe6] leading-relaxed">
                {game.title}
              </h3>
              <span className="font-silkscreen text-[10px] text-[#fbbf24] block mt-1">
                {game.category}
              </span>

              <p className="font-silkscreen text-xs text-[#b8b09f] mt-3 leading-relaxed">
                {game.desc}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-[#333] space-y-3">
              <span className="font-silkscreen text-[11px] text-[#22c55e] block">
                ⭐ {game.reward}
              </span>

              <button
                onClick={() => setActiveGame(game.id)}
                className="w-full py-2.5 bg-[#a62b2b] hover:bg-[#c0392b] text-[#f4efe6] border-2 border-[#d99b26] rounded font-press-start text-xs retro-button flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> JUGAR AHORA
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

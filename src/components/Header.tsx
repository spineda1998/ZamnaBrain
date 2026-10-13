import React from 'react';
import { User, ProgressSummary } from '../types';
import { Sparkles, Trophy, BookOpen, Map, Gamepad2, Users, LogOut, Shield } from 'lucide-react';

interface HeaderProps {
  user: User;
  progress: ProgressSummary | null;
  activeTab: 'feed' | 'sendero' | 'arcade' | 'codex' | 'leaderboard' | 'classrooms';
  setActiveTab: (tab: 'feed' | 'sendero' | 'arcade' | 'codex' | 'leaderboard' | 'classrooms') => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  progress,
  activeTab,
  setActiveTab,
  onLogout,
}) => {
  return (
    <header className="bg-[#1c1c1c] border-b-4 border-[#333] shadow-lg sticky top-0 z-40">
      {/* Top Banner with Stats */}
      <div className="max-w-6xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3">
        {/* Logo / Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#a62b2b] border-2 border-[#d99b26] flex items-center justify-center text-xl shadow-inner font-press-start">
            🐸
          </div>
          <div>
            <h1 className="font-press-start text-sm md:text-base text-[#d99b26] tracking-wider drop-shadow">
              ZUMABRAIN
            </h1>
            <p className="font-silkscreen text-[11px] text-[#9ca3af]">
              Santuario de Sabiduría Maya
            </p>
          </div>
        </div>

        {/* Player Badge & Stats */}
        <div className="flex items-center gap-3">
          {/* Jade Coins */}
          <div className="flex items-center gap-1.5 bg-[#14291c] border-2 border-[#22c55e] px-2.5 py-1 rounded text-xs font-press-start text-[#22c55e] shadow-sm">
            <span className="text-base">🟢</span>
            <span>{progress?.jadeCoins ?? 0}</span>
            <span className="text-[9px] text-[#86efac] hidden sm:inline">JADE</span>
          </div>

          {/* Stars */}
          <div className="flex items-center gap-1.5 bg-[#31250b] border-2 border-[#d99b26] px-2.5 py-1 rounded text-xs font-press-start text-[#fbbf24] shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#fbbf24]" />
            <span>{progress?.totalStars ?? 0}</span>
            <span className="text-[9px] text-[#fde68a] hidden sm:inline">ESTRELLAS</span>
          </div>

          {/* User & Role Badge */}
          <div className="flex items-center gap-2 bg-[#262626] border border-[#404040] px-3 py-1 rounded">
            <div className="flex flex-col text-right">
              <span className="font-press-start text-[11px] text-[#f4efe6]">
                {user.nickname}
              </span>
              <span className="font-silkscreen text-[10px] text-[#d99b26] flex items-center justify-end gap-1">
                {user.role === 'teacher' ? (
                  <>
                    <Shield className="w-2.5 h-2.5" /> Gran Ajau (Profesor)
                  </>
                ) : (
                  'Cazador de Templos'
                )}
              </span>
            </div>
            <button
              onClick={onLogout}
              title="Cerrar sesión"
              className="p-1.5 text-[#9ca3af] hover:text-[#ef4444] hover:bg-[#333] rounded transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="bg-[#171717] border-t border-[#2d2d2d]">
        <div className="max-w-6xl mx-auto px-2 flex overflow-x-auto scrollbar-none justify-start sm:justify-center gap-1 py-1">
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex items-center gap-2 px-3.5 py-2 font-press-start text-[11px] rounded transition-all whitespace-nowrap ${
              activeTab === 'feed'
                ? 'bg-[#a62b2b] text-[#fbbf24] border-2 border-[#d99b26] shadow-md'
                : 'text-[#9ca3af] hover:text-[#f4efe6] hover:bg-[#262626]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Feed & Retos
          </button>

          <button
            onClick={() => setActiveTab('sendero')}
            className={`flex items-center gap-2 px-3.5 py-2 font-press-start text-[11px] rounded transition-all whitespace-nowrap ${
              activeTab === 'sendero'
                ? 'bg-[#a62b2b] text-[#fbbf24] border-2 border-[#d99b26] shadow-md'
                : 'text-[#9ca3af] hover:text-[#f4efe6] hover:bg-[#262626]'
            }`}
          >
            <Map className="w-4 h-4" />
            Sendero Sagrado
          </button>

          <button
            onClick={() => setActiveTab('arcade')}
            className={`flex items-center gap-2 px-3.5 py-2 font-press-start text-[11px] rounded transition-all whitespace-nowrap ${
              activeTab === 'arcade'
                ? 'bg-[#a62b2b] text-[#fbbf24] border-2 border-[#d99b26] shadow-md'
                : 'text-[#9ca3af] hover:text-[#f4efe6] hover:bg-[#262626]'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            Minijuegos Arcade
          </button>

          <button
            onClick={() => setActiveTab('codex')}
            className={`flex items-center gap-2 px-3.5 py-2 font-press-start text-[11px] rounded transition-all whitespace-nowrap ${
              activeTab === 'codex'
                ? 'bg-[#a62b2b] text-[#fbbf24] border-2 border-[#d99b26] shadow-md'
                : 'text-[#9ca3af] hover:text-[#f4efe6] hover:bg-[#262626]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Códice & Glifos
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex items-center gap-2 px-3.5 py-2 font-press-start text-[11px] rounded transition-all whitespace-nowrap ${
              activeTab === 'leaderboard'
                ? 'bg-[#a62b2b] text-[#fbbf24] border-2 border-[#d99b26] shadow-md'
                : 'text-[#9ca3af] hover:text-[#f4efe6] hover:bg-[#262626]'
            }`}
          >
            <Trophy className="w-4 h-4" />
            Leaderboard
          </button>

          <button
            onClick={() => setActiveTab('classrooms')}
            className={`flex items-center gap-2 px-3.5 py-2 font-press-start text-[11px] rounded transition-all whitespace-nowrap ${
              activeTab === 'classrooms'
                ? 'bg-[#a62b2b] text-[#fbbf24] border-2 border-[#d99b26] shadow-md'
                : 'text-[#9ca3af] hover:text-[#f4efe6] hover:bg-[#262626]'
            }`}
          >
            <Users className="w-4 h-4" />
            {user.role === 'teacher' ? 'Mis Aulas' : 'Mi Aula'}
          </button>
        </div>
      </nav>
    </header>
  );
};

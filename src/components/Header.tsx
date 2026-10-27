import React from 'react';
import { User, ProgressSummary, AppLanguage } from '../types';
import { getT } from '../utils/i18n';
import { GrecaBar } from './GrecaBar';

interface HeaderProps {
  user: User;
  progress: ProgressSummary | null;
  jadeEnergy?: number;
  language?: AppLanguage;
  onLogout: () => void;
  onOpenSettings?: () => void;
  onGoToFeed?: () => void;
}

const AVATAR_MAP: Record<string, string> = {
  axolotl: '🦎',
  jaguar: '🐆',
  serpent: '🐍',
  quetzal: '🪶',
  monkey: '🐒',
};

export const Header: React.FC<HeaderProps> = ({
  user,
  progress,
  jadeEnergy = 10,
  language = 'es',
  onLogout,
  onOpenSettings,
  onGoToFeed,
}) => {
  const t = getT(language);
  const totalCacao = 1450 + (progress?.jadeCoins ?? 0);
  const userLevel = 14;
  const avatarEmoji = AVATAR_MAP[user.avatar || 'axolotl'] || '🦎';

  return (
    <header className="w-full bg-[#100506] border-b-2 border-[#9E2A2B]/70 shadow-md sticky top-0 z-40 select-none">
      <GrecaBar height="sm" animated={true} />
      <div className="box-border w-full max-w-[440px] mx-auto p-[10px_12px] flex flex-col gap-0 justify-start items-start relative">
        {/* Top Bar: Jugador y Nivel */}
        <div className="box-border w-full h-fit flex flex-row gap-[8px] justify-between items-center relative z-10">
          <div
            onClick={onGoToFeed}
            className="box-border w-fit shrink-0 h-fit flex flex-row gap-0 justify-start items-center cursor-pointer group"
            title="Ir al Feed Principal"
          >
            {/* Avatar Pixel Art 32-bit */}
            <div className="box-border w-[48px] shrink-0 h-[48px] flex flex-col gap-0 p-[2px] justify-center items-center bg-[#070203] relative rounded-[2px] border-2 border-[#9E2A2B] [box-shadow:inset_1.5px_1.5px_0px_#ffffff22,_2px_2px_0px_#000]">
              <div className="w-full h-full flex items-center justify-center text-2xl select-none group-hover:scale-110 transition-transform">
                {avatarEmoji}
              </div>
              {/* Level Badge */}
              <div className="box-border w-fit h-fit absolute right-[-4px] bottom-[-4px] flex flex-col p-[2px_5px] justify-center items-center bg-[#9E2A2B] border border-black rounded-[2px] [box-shadow:1px_1px_0px_#000] z-20">
                <span className="text-[8px]/[8px] text-[#FFFDF2] font-press-start font-bold">
                  {userLevel}
                </span>
              </div>
            </div>

            {/* Info del usuario */}
            <div className="box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[0px_0px_0px_10px] justify-start items-start">
              <div className="box-border w-[170px] h-fit shrink-0 flex flex-col gap-0 justify-start items-start">
                <div className="box-border w-full h-fit shrink-0 flex flex-row gap-1 justify-start items-center">
                  <span className="text-[11px]/[14px] text-[#FFFDF2] font-press-start font-bold tracking-[0.8px] truncate">
                    {user.nickname || 'ITZEL BALAM'}
                  </span>
                  {/* Verified Gold Badge Icon */}
                  <svg
                    viewBox="0 0 12.83 12.25"
                    className="w-[12px] h-[12px] shrink-0 overflow-visible fill-[#2A7B4C]"
                  >
                    <path d="M4.433 12.25L3.325 10.383L1.225 9.917L1.429 7.758L0 6.125L1.429 4.492L1.225 2.333L3.325 1.867L4.433 0L6.417 0.846L8.4 0L9.508 1.867L11.608 2.333L11.404 4.492L12.833 6.125L11.404 7.758L11.608 9.917L9.508 10.383L8.4 12.25L6.417 11.404L4.433 12.25M5.804 8.196L9.1 4.9L8.283 4.054L5.804 6.533L4.55 5.308L3.733 6.125L5.804 8.196Z" />
                  </svg>
                </div>

                <div className="box-border w-full h-fit shrink-0 flex flex-col gap-0 justify-start items-start overflow-hidden mt-0.5">
                  <span className="text-[9px]/[12px] text-[#2A7B4C] font-silkscreen font-bold tracking-[0.6px] truncate">
                    {user.role === 'teacher' ? 'GRAN AJAU • MAESTRO' : 'AXOLOTL • SACERDOTE II'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Controls: Settings Gear + Pixel Art Exit */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Gear Button */}
            <button
              onClick={onOpenSettings}
              title="Ajustes de Perfil y Audio"
              className="w-7 h-7 bg-[#180a0c] hover:bg-[#2a1014] text-[#FFFDF2] flex items-center justify-center rounded-[2px] border border-[#9E2A2B]/60 [box-shadow:inset_1px_1px_0px_#ffffff22,_1px_1px_0px_#000] cursor-pointer transition active:translate-y-0.5"
            >
              <svg viewBox="0 0 16 16" className="w-4 h-4 fill-current">
                <path d="M6 0h4v2H6V0zm0 14h4v2H6v-2zm-6-8h2v4H0V6zm14 0h2v4h-2V6zM2 2h2v2H2V2zm10 0h2v2h-2V2zM2 12h2v2H2v-2zm10 0h2v2h-2v-2zM5 5h6v6H5V5zm2 2h2v2H7V7z" />
              </svg>
            </button>

            {/* Pixel Art Exit / Salir Button */}
            <button
              onClick={onLogout}
              title="Cerrar sesión"
              className="w-7 h-7 bg-[#180a0c] hover:bg-[#9E2A2B] text-[#FFFDF2] flex items-center justify-center rounded-[2px] border border-[#9E2A2B]/60 [box-shadow:inset_1px_1px_0px_#ffffff22,_1px_1px_0px_#000] cursor-pointer transition active:translate-y-0.5"
            >
              <svg viewBox="0 0 16 16" className="w-4 h-4 fill-current">
                <path d="M1 1h7v14H1V1zm2 2v10h3V3H3zm7 4V5h2V3h2v2h-2v2h2v2h-2v2h2V9h-2V7h-2zm-3 2h2V7H7v2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Contadores Arcade (Cacao/Oro & Jade/Rayo) */}
        <div className="box-border w-full h-fit shrink-0 flex flex-col gap-0 p-[10px_0px_0px_0px] justify-start items-start relative z-10">
          <div className="box-border w-full h-fit shrink-0 flex flex-row gap-[8px] justify-center items-start">
            {/* Cacao / Oro Solar */}
            <div className="box-border flex-1 h-[34px] flex flex-row justify-between items-center p-[6px_8px] bg-[#070203] border border-[#9E2A2B]/50 relative rounded-[2px] [box-shadow:inset_1px_1px_0px_#ffffff15,_1px_1px_0px_#000]">
              <div className="flex flex-row items-center gap-1.5">
                <span className="text-xs">🪙</span>
                <span className="text-[9px]/[12px] text-[#e0d6c4] font-silkscreen font-bold tracking-[0.6px]">
                  CACAO
                </span>
              </div>
              <span className="text-[11px]/[14px] text-[#FFFDF2] font-press-start font-normal tracking-[0.4px]">
                {totalCacao.toLocaleString()}
              </span>
            </div>

            {/* Jade / Rayo Cósmico - Medido por Puntos (10 Pts) */}
            <div className="box-border flex-1 h-[34px] flex flex-row justify-between items-center p-[6px_8px] bg-[#070203] border border-[#2A7B4C]/50 relative rounded-[2px] [box-shadow:inset_1px_1px_0px_#ffffff15,_1px_1px_0px_#000]">
              <div className="flex flex-row items-center gap-1.5">
                <span className="text-xs">⚡</span>
                <span className="text-[9px]/[12px] text-[#2A7B4C] font-silkscreen font-bold tracking-[0.6px]">
                  JADE
                </span>
              </div>
              <div className="flex flex-row items-center gap-1.5">
                {/* 10 Mini Segmented Energy Bars */}
                <div className="flex flex-row gap-[1.5px] items-center">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-[2.5px] h-[10px] rounded-[0.5px] transition-colors ${
                        i < jadeEnergy ? 'bg-[#2A7B4C] shadow-[0_0_2px_#2A7B4C]' : 'bg-[#1e0a0d]'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px]/[12px] text-[#FFFDF2] font-press-start font-normal tracking-[0.2px]">
                  {jadeEnergy}/10
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

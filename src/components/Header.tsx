import React from 'react';
import { User, ProgressSummary, AppLanguage } from '../types';
import { getT } from '../utils/i18n';

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
    <header className="w-full bg-[#20201f] border-b-2 border-[#332a24] shadow-md sticky top-0 z-40 select-none">
      <div className="box-border w-full max-w-[390px] mx-auto p-[10px_12px] flex flex-col gap-0 justify-start items-start relative">
        {/* Top Bar: Jugador y Nivel */}
        <div className="box-border w-full h-fit flex flex-row gap-[8px] justify-between items-center relative z-10">
          <div
            onClick={onGoToFeed}
            className="box-border w-fit shrink-0 h-fit flex flex-row gap-0 justify-start items-center cursor-pointer group"
            title="Ir al Feed Principal"
          >
            {/* Avatar Pixel Art 32-bit */}
            <div className="box-border w-[48px] shrink-0 h-[48px] flex flex-col gap-0 p-[2px] justify-center items-center bg-[#0e0e0e] relative rounded-[2px] [box-shadow:0px_0px_0px_#0e0e0e,_inset_2px_2px_0px_#ffdeac,_inset_-2px_-2px_0px_#bd8717]">
              <div className="w-full h-full flex items-center justify-center text-2xl select-none group-hover:scale-110 transition-transform">
                {avatarEmoji}
              </div>
              {/* Level Badge */}
              <div className="box-border w-fit h-fit absolute right-[-4px] bottom-[-4px] flex flex-col p-[2px_5px] justify-center items-center bg-[#a62b2b] rounded-[2px] [box-shadow:0px_0px_0px_#0e0e0e,_inset_1.5px_1.5px_0px_#ffffff33,_inset_-1.5px_-1.5px_0px_#00000099] z-20">
                <span className="text-[8px]/[8px] text-[#ffdad7] font-press-start font-normal">
                  {userLevel}
                </span>
              </div>
            </div>

            {/* Info del usuario */}
            <div className="box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[0px_0px_0px_10px] justify-start items-start">
              <div className="box-border w-[170px] h-fit shrink-0 flex flex-col gap-0 justify-start items-start">
                <div className="box-border w-full h-fit shrink-0 flex flex-row gap-1 justify-start items-center">
                  <span className="text-[11px]/[14px] text-[#ffdeac] font-press-start font-normal tracking-[0.8px] truncate">
                    {user.nickname || 'ITZEL BALAM'}
                  </span>
                  {/* Verified Gold Badge Icon */}
                  <svg
                    viewBox="0 0 12.83 12.25"
                    className="w-[12px] h-[12px] shrink-0 overflow-visible fill-[#fabc4c]"
                  >
                    <path d="M4.433 12.25L3.325 10.383L1.225 9.917L1.429 7.758L0 6.125L1.429 4.492L1.225 2.333L3.325 1.867L4.433 0L6.417 0.846L8.4 0L9.508 1.867L11.608 2.333L11.404 4.492L12.833 6.125L11.404 7.758L11.608 9.917L9.508 10.383L8.4 12.25L6.417 11.404L4.433 12.25M5.804 8.196L9.1 4.9L8.283 4.054L5.804 6.533L4.55 5.308L3.733 6.125L5.804 8.196Z" />
                  </svg>
                </div>

                <div className="box-border w-full h-fit shrink-0 flex flex-col gap-0 justify-start items-start overflow-hidden mt-0.5">
                  <span className="text-[9px]/[12px] text-[#e0bfbc] font-silkscreen font-bold tracking-[0.6px] truncate">
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
              className="w-7 h-7 bg-[#0e0e0e] hover:bg-[#2a2a2a] text-[#ffdeac] hover:text-[#fabc4c] flex items-center justify-center rounded-[2px] border border-[#353535] [box-shadow:inset_1.5px_1.5px_0px_#ffffff33,_inset_-1.5px_-1.5px_0px_#00000099] cursor-pointer transition active:translate-y-0.5"
            >
              <svg viewBox="0 0 16 16" className="w-4 h-4 fill-current">
                <path d="M6 0h4v2H6V0zm0 14h4v2H6v-2zm-6-8h2v4H0V6zm14 0h2v4h-2V6zM2 2h2v2H2V2zm10 0h2v2h-2V2zM2 12h2v2H2v-2zm10 0h2v2h-2v-2zM5 5h6v6H5V5zm2 2h2v2H7V7z" />
              </svg>
            </button>

            {/* Pixel Art Exit / Salir Button */}
            <button
              onClick={onLogout}
              title="Cerrar sesión"
              className="w-7 h-7 bg-[#0e0e0e] hover:bg-[#a62b2b] text-[#a78a87] hover:text-[#ffdad7] flex items-center justify-center rounded-[2px] border border-[#353535] [box-shadow:inset_1.5px_1.5px_0px_#ffffff33,_inset_-1.5px_-1.5px_0px_#00000099] cursor-pointer transition active:translate-y-0.5"
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
            <div className="box-border flex-1 h-[34px] flex flex-row justify-between items-center p-[6px_8px] bg-[#0e0e0e] relative rounded-[2px] [box-shadow:0px_0px_0px_#0e0e0e,_inset_2px_2px_0px_#ffffff33,_inset_-2px_-2px_0px_#00000099]">
              <div className="flex flex-row items-center gap-1.5">
                {/* Coin Icon */}
                <svg
                  viewBox="0 0 13.33 13.33"
                  className="w-[12px] h-[12px] shrink-0 fill-[#fabc4c]"
                >
                  <path d="M6.067 11.333H7.233V10.5C7.789 10.4 8.267 10.183 8.667 9.85C9.067 9.517 9.267 9.022 9.267 8.367C9.267 7.9 9.133 7.472 8.867 7.083C8.6 6.694 8.067 6.356 7.267 6.067C6.6 5.844 6.139 5.65 5.883 5.483C5.628 5.317 5.5 5.089 5.5 4.8C5.5 4.511 5.603 4.283 5.808 4.117C6.014 3.95 6.311 3.867 6.7 3.867C7.056 3.867 7.333 3.953 7.533 4.125C7.733 4.297 7.878 4.511 7.967 4.767L9.033 4.333C8.911 3.944 8.686 3.606 8.358 3.317C8.031 3.028 7.667 2.867 7.267 2.833V2H6.1V2.833C5.544 2.956 5.111 3.2 4.8 3.567C4.489 3.933 4.333 4.344 4.333 4.8C4.333 5.322 4.486 5.744 4.792 6.067C5.097 6.389 5.578 6.667 6.233 6.9C6.933 7.156 7.419 7.383 7.692 7.583C7.964 7.783 8.1 8.044 8.1 8.367C8.1 8.733 7.969 9.003 7.708 9.175C7.447 9.347 7.133 9.433 6.767 9.433C6.4 9.433 6.075 9.319 5.792 9.092C5.508 8.864 5.3 8.522 5.167 8.067L4.067 8.5C4.222 9.033 4.464 9.464 4.792 9.792C5.119 10.119 5.544 10.344 6.067 10.467V11.333M6.667 13.333C5.744 13.333 4.878 13.158 4.067 12.808C3.256 12.458 2.55 11.983 1.95 11.383C1.35 10.783 0.875 10.078 0.525 9.267C0.175 8.456 0 7.589 0 6.667C0 5.744 0.175 4.878 0.525 4.067C0.875 3.256 1.35 2.55 1.95 1.95C2.55 1.35 3.256 0.875 4.067 0.525C4.878 0.175 5.744 0 6.667 0C7.589 0 8.456 0.175 9.267 0.525C10.078 0.875 10.783 1.35 11.383 1.95C11.983 2.55 12.458 3.256 12.808 4.067C13.158 4.878 13.333 5.744 13.333 6.667C13.333 7.589 13.158 8.456 12.808 9.267C12.458 10.078 11.983 10.783 11.383 11.383C10.783 11.983 10.078 12.458 9.267 12.808C8.456 13.158 7.589 13.333 6.667 13.333Z" />
                </svg>
                <span className="text-[9px]/[12px] text-[#e0bfbc] font-silkscreen font-bold tracking-[0.6px]">
                  CACAO
                </span>
              </div>
              <span className="text-[11px]/[14px] text-[#fabc4c] font-press-start font-normal tracking-[0.4px]">
                {totalCacao.toLocaleString()}
              </span>
            </div>

            {/* Jade / Rayo Cósmico - Medido por Puntos (10 Pts) */}
            <div className="box-border flex-1 h-[34px] flex flex-row justify-between items-center p-[6px_8px] bg-[#0e0e0e] relative rounded-[2px] [box-shadow:0px_0px_0px_#0e0e0e,_inset_2px_2px_0px_#ffffff33,_inset_-2px_-2px_0px_#00000099]">
              <div className="flex flex-row items-center gap-1.5">
                {/* Lightning Bolt Icon */}
                <svg
                  viewBox="0 0 10.67 13.33"
                  className="w-[10px] h-[12px] shrink-0 fill-[#76d4e4]"
                >
                  <path d="M2.667 13.333L3.333 8.667H0L6 0H7.333L6.667 5.333H10.667L4 13.333H2.667Z" />
                </svg>
                <span className="text-[9px]/[12px] text-[#e0bfbc] font-silkscreen font-bold tracking-[0.6px]">
                  JADE
                </span>
              </div>
              <div className="flex flex-row items-center gap-1.5">
                {/* 10 Mini Segmented Energy Bars */}
                <div className="flex flex-row gap-[1.5px] items-center">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-[2px] h-[10px] rounded-[0.5px] transition-colors ${
                        i < jadeEnergy ? 'bg-[#76d4e4] shadow-[0_0_2px_#76d4e4]' : 'bg-[#2a2a2a]'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px]/[12px] text-[#76d4e4] font-press-start font-normal tracking-[0.2px]">
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

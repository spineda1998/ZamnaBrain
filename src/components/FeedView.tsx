import React from 'react';
import { User, ProgressSummary, AppLanguage } from '../types';
import { getT } from '../utils/i18n';

interface FeedViewProps {
  user: User;
  progress: ProgressSummary | null;
  language?: AppLanguage;
  onOpenSendero: () => void;
  onOpenMinigames: () => void;
  onOpenCodex: () => void;
}

export const FeedView: React.FC<FeedViewProps> = ({
  user,
  progress,
  language = 'es',
  onOpenSendero,
  onOpenMinigames,
  onOpenCodex,
}) => {
  const t = getT(language);
  return (
    <div className="w-full max-w-[390px] mx-auto px-2 py-3 pb-24 font-silkscreen select-none text-[#f4efe6] space-y-4">
      {/* ── Section - 2. FEED BANNER / EVENTO CÓSMICO ACTIVO ── */}
      <div className="w-full bg-[#2a2a2a] p-[12px] relative overflow-hidden rounded-[2px] [box-shadow:0px_0px_0px_#0e0e0e,_inset_2px_2px_0px_#ffdeac,_inset_-2px_-2px_0px_#bd8717]">
        {/* Luz ambiente arcade de fondo */}
        <div className="w-[96px] h-[96px] [filter:blur(10.5px)] absolute right-[-20px] top-[-30px] bg-[#fabc4c08] rounded-full pointer-events-none" />

        {/* Header Bento: Título Marquesina + Timer Semanal */}
        <div className="w-full pb-2 border-b border-[#353535] flex flex-row justify-between items-center relative z-10">
          <div className="flex flex-row items-center gap-1.5">
            {/* Sparkles / Star Icon */}
            <svg
              viewBox="0 0 14.67 14.67"
              className="w-[14px] h-[14px] shrink-0 fill-[#fabc4c]"
            >
              <path d="M12 5.333L11.167 3.5L9.333 2.667L11.167 1.833L12 0L12.833 1.833L14.667 2.667L12.833 3.5L12 5.333M12 14.667L11.167 12.833L9.333 12L11.167 11.167L12 9.333L12.833 11.167L14.667 12L12.833 12.833L12 14.667M5.333 12.667L3.667 9L0 7.333L3.667 5.667L5.333 2L7 5.667L10.667 7.333L7 9L5.333 12.667M5.333 9.433L6 8L7.433 7.333L6 6.667L5.333 5.233L4.667 6.667L3.233 7.333L4.667 8L5.333 9.433Z" />
            </svg>
            <div className="flex flex-col">
              <span className="text-[10px]/[12px] text-[#fabc4c] font-press-start tracking-[-0.25px]">
                RETOS SEMANALES
              </span>
              <span className="text-[8px]/[12px] text-[#76d4e4] font-silkscreen tracking-[0.4px]">
                ALINEACIÓN CELESTIAL ACTIVA
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <div className="bg-[#a62b2b] px-1.5 py-0.5 rounded-[2px] [box-shadow:0px_0px_0px_#0e0e0e,_inset_1.5px_1.5px_0px_#ffffff33,_inset_-1.5px_-1.5px_0px_#00000099]">
              <span className="text-[8px]/[10px] text-[#ffdad7] font-press-start">
                X2 EXP
              </span>
            </div>
            <span className="text-[8px]/[12px] text-[#a78a87] font-silkscreen mt-0.5">
              REINICIO: 3D 14H
            </span>
          </div>
        </div>

        {/* Ticker / Bonus Notifier */}
        <div className="w-full mt-2 p-[4px_8px] bg-[#0e0e0e] rounded-[2px] flex flex-row justify-between items-center [box-shadow:0px_0px_0px_#0e0e0e,_inset_2px_2px_0px_#ffffff33,_inset_-2px_-2px_0px_#00000099] relative z-10">
          <span className="text-[8.5px]/[11px] text-[#ffdeac] font-silkscreen truncate">
            ★ BONO VIGESIMAL ACTIVO • CIEN ANTORCHAS SAGRADAS
          </span>
          <span className="w-1.5 h-1.5 bg-[#fabc4c] rounded-full shrink-0 ml-1.5 animate-pulse" />
        </div>

        {/* Lista de 3 Misiones Semanales con barras segmentadas */}
        <div className="w-full mt-2.5 flex flex-col gap-2 relative z-10">
          {/* Reto 1 */}
          <div className="w-full p-2 bg-[#0e0e0e] rounded-[2px] [box-shadow:0px_0px_0px_#0e0e0e,_inset_2px_2px_0px_#ffffff33,_inset_-2px_-2px_0px_#00000099]">
            <div className="flex flex-row justify-between items-center text-[10px]/[12px]">
              <span className="text-[#e5e2e1] font-silkscreen font-bold tracking-[0.6px] truncate">
                ✦ Descifra 3 estelas en Copán
              </span>
              <div className="flex items-center gap-1.5 shrink-0 font-press-start text-[8px]">
                <span className="text-[#76d4e4]">2/3</span>
                <span className="text-[#fabc4c]">+500XP</span>
              </div>
            </div>
            {/* Segmented Progress Bar */}
            <div className="w-full h-[8px] bg-[#353535] mt-1.5 p-[1px] flex flex-row gap-1 rounded-[1px]">
              <div className="flex-1 bg-[#76d4e4]" />
              <div className="flex-1 bg-[#76d4e4]" />
              <div className="flex-1 bg-[#0e0e0e]/50" />
            </div>
          </div>

          {/* Reto 2 */}
          <div className="w-full p-2 bg-[#0e0e0e] rounded-[2px] [box-shadow:0px_0px_0px_#0e0e0e,_inset_2px_2px_0px_#ffffff33,_inset_-2px_-2px_0px_#00000099]">
            <div className="flex flex-row justify-between items-center text-[10px]/[12px]">
              <span className="text-[#e5e2e1] font-silkscreen font-bold tracking-[0.6px] truncate">
                ✦ 5 victorias en Minijuegos
              </span>
              <div className="flex items-center gap-1.5 shrink-0 font-press-start text-[8px]">
                <span className="text-[#fabc4c]">4/5</span>
                <span className="text-[#fabc4c]">+80 CACAO</span>
              </div>
            </div>
            {/* Segmented Progress Bar */}
            <div className="w-full h-[8px] bg-[#353535] mt-1.5 p-[1px] flex flex-row gap-1 rounded-[1px]">
              <div className="flex-1 bg-[#fabc4c]" />
              <div className="flex-1 bg-[#fabc4c]" />
              <div className="flex-1 bg-[#fabc4c]" />
              <div className="flex-1 bg-[#fabc4c]" />
              <div className="flex-1 bg-[#0e0e0e]/50" />
            </div>
          </div>

          {/* Reto 3: Completado */}
          <div className="w-full p-2 bg-[#0e0e0e] border-l-2 border-[#76d4e4] rounded-[2px] [box-shadow:0px_0px_0px_#0e0e0e,_inset_2px_2px_0px_#ffffff33,_inset_-2px_-2px_0px_#00000099]">
            <div className="flex flex-row justify-between items-center text-[10px]/[12px]">
              <span className="text-[#76d4e4] font-silkscreen font-bold tracking-[0.6px] truncate">
                ✦ Duelo Matemático Vigesimal
              </span>
              <div className="flex items-center gap-1.5 shrink-0 font-press-start text-[8px]">
                <span className="text-[#76d4e4]">✓ LISTO</span>
                <span className="text-[#76d4e4]">+1 JADE</span>
              </div>
            </div>
            {/* Segmented Progress Bar (Completed) */}
            <div className="w-full h-[8px] bg-[#76d4e4]/20 mt-1.5 p-[1px] flex flex-row rounded-[1px]">
              <div className="w-full h-full bg-[#76d4e4]" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Section - 3. LOS RECUADROS PRINCIPALES (GRID RETRO ARCADE DE PIEDRA & ORO) ── */}
      <div className="w-full flex flex-col gap-3">
        {/* ── BENTO TILE 1: SENDA SAGRADA (HERO CARD) ── */}
        <div className="w-full bg-[#2a2a2a] p-[12px] rounded-[2px] [box-shadow:0px_0px_0px_#0e0e0e,_inset_2px_2px_0px_#ffdeac,_inset_-2px_-2px_0px_#bd8717] overflow-hidden relative">
          <div className="w-[112px] h-[112px] [filter:blur(10.5px)] absolute right-[-20px] top-[-20px] bg-[#ffb3ad05] rounded-full pointer-events-none" />

          {/* Header de tarjeta */}
          <div className="w-full flex flex-row justify-between items-center pb-2">
            <div className="flex flex-row items-center gap-1.5">
              <span className="bg-[#a62b2b] text-[#ffdad7] font-press-start text-[8px]/[12px] px-2 py-0.5 rounded-[2px] [box-shadow:0px_0px_0px_#0e0e0e,_inset_1.5px_1.5px_0px_#ffffff33,_inset_-1.5px_-1.5px_0px_#00000099]">
                MODO HISTORIA
              </span>
              <span className="bg-[#0e0e0e] text-[#fabc4c] font-press-start text-[8px]/[12px] px-1.5 py-0.5 rounded-[2px] [box-shadow:0px_0px_0px_#0e0e0e,_inset_1.5px_1.5px_0px_#ffffff33,_inset_-1.5px_-1.5px_0px_#00000099]">
                COPÁN
              </span>
            </div>
            <span className="text-[9px]/[14px] text-[#fabc4c] font-silkscreen tracking-[0.45px]">
              FASE ASTRONÓMICA
            </span>
          </div>

          {/* Cuerpo de Senda Sagrada */}
          <div className="w-full flex flex-row items-center gap-3 my-2">
            {/* Pyramid SVG in 64x64 Box */}
            <div className="w-[60px] h-[60px] shrink-0 bg-[#0e0e0e] p-2 flex items-center justify-center rounded-[2px] [box-shadow:0px_0px_0px_#0e0e0e,_inset_2px_2px_0px_#ffffff33,_inset_-2px_-2px_0px_#00000099] relative">
              <svg
                viewBox="0 0 40 40"
                className="w-10 h-10 stroke-[#ffdeac] fill-none"
                strokeWidth="1.5"
              >
                <path d="M18 0L22 0V4H18V0M12 8H28V12H12V8M8 16H32V20H8V16M4 24H36V28H4V24M0 32H40V40H0V32M16 12H24V36H16V12" />
              </svg>
            </div>

            <div className="flex-1 flex flex-col justify-start">
              <h2 className="text-[16px]/[22px] text-[#ffdeac] font-press-start tracking-[0.45px]">
                SENDA SAGRADA
              </h2>
              <p className="text-[10px]/[13px] text-[#e0bfbc] font-space-mono mt-1 leading-snug">
                Minimapa astronómico de Copán: resuelve enigmas y alinea estelas ceremoniales.
              </p>
            </div>
          </div>

          {/* Progreso y Botón Primario */}
          <div className="w-full mt-2 flex flex-col gap-2">
            <div className="w-full p-[6px_8px] bg-[#0e0e0e] flex flex-row justify-between items-center rounded-[2px] [box-shadow:0px_0px_0px_#0e0e0e,_inset_2px_2px_0px_#ffffff33,_inset_-2px_-2px_0px_#00000099]">
              <span className="text-[9px]/[14px] text-[#e0bfbc] font-silkscreen">
                ESTELAS TALLADAS
              </span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-[#353535] p-[1px] flex">
                  <div className="w-2/3 h-full bg-[#fabc4c]" />
                </div>
                <span className="text-[9px]/[14px] text-[#fabc4c] font-press-start">
                  8/12
                </span>
              </div>
            </div>

            <button
              onClick={onOpenSendero}
              className="w-full h-10 bg-[#a62b2b] hover:bg-[#ba3232] text-[#ffdad7] font-press-start text-[10px] tracking-[0.8px] flex items-center justify-center gap-2 rounded-[2px] [box-shadow:0px_0px_0px_#0e0e0e,_inset_3px_3px_0px_#ffb3ad,_inset_-3px_-3px_0px_#68000a] active:translate-y-0.5 cursor-pointer transition shadow-lg"
            >
              <span>CONTINUAR SENDA</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* ── GRID 2 COLUMNAS: MINIJUEGOS & CÓDICE ── */}
        <div className="w-full grid grid-cols-2 gap-2.5">
          {/* ── BENTO TILE 2: MINIJUEGOS ── */}
          <div className="bg-[#2a2a2a] p-3 rounded-[2px] [box-shadow:0px_0px_0px_#0e0e0e,_inset_2px_2px_0px_#ffffff33,_inset_-2px_-2px_0px_#00000099] flex flex-col justify-between">
            <div>
              <div className="flex flex-row justify-between items-center mb-2">
                <span className="bg-[#bd8717] text-[#3a2600] font-press-start text-[7.5px]/[12px] px-1.5 py-0.5 rounded-[2px] [box-shadow:0px_0px_0px_#0e0e0e,_inset_1.5px_1.5px_0px_#ffffff33,_inset_-1.5px_-1.5px_0px_#00000099]">
                  2 JUEGOS
                </span>
                <span className="w-1.5 h-1.5 bg-[#76d4e4] rounded-full animate-pulse" />
              </div>

              {/* Icon & Title */}
              <div className="flex flex-row items-center gap-2 mb-2">
                <div className="w-9 h-9 shrink-0 bg-[#0e0e0e] flex items-center justify-center text-xl rounded-[2px] [box-shadow:0px_0px_0px_#0e0e0e,_inset_1.5px_1.5px_0px_#ffffff33,_inset_-1.5px_-1.5px_0px_#00000099]">
                  🕹️
                </div>
                <div className="flex flex-col">
                  <h3 className="text-[10px]/[11px] text-[#ffdeac] font-press-start tracking-[0.6px]">
                    MINIJUEGOS
                  </h3>
                  <span className="text-[8px]/[12px] text-[#e0bfbc] font-silkscreen mt-0.5">
                    Tetris & Memorama
                  </span>
                </div>
              </div>

              {/* Récord */}
              <div className="p-1.5 bg-[#0e0e0e] rounded-[2px] [box-shadow:0px_0px_0px_#0e0e0e,_inset_1.5px_1.5px_0px_#ffffff33,_inset_-1.5px_-1.5px_0px_#00000099] mb-2">
                <span className="text-[7.5px]/[10px] text-[#a78a87] font-silkscreen block">
                  RÉCORD:
                </span>
                <span className="text-[8.5px]/[13px] text-[#76d4e4] font-press-start block mt-0.5">
                  48,200 PTS
                </span>
              </div>
            </div>

            <button
              onClick={onOpenMinigames}
              className="w-full h-8 bg-[#fabc4c] hover:bg-[#ffcf66] text-[#432c00] font-press-start text-[9px] flex items-center justify-center gap-1.5 rounded-[2px] [box-shadow:0px_0px_0px_#0e0e0e,_inset_2.5px_2.5px_0px_#ffdeac,_inset_-2.5px_-2.5px_0px_#855700] active:translate-y-0.5 cursor-pointer transition"
            >
              <span>JUGAR</span>
              <svg viewBox="0 0 10 10" className="w-2.5 h-2.5 fill-[#432c00]">
                <path d="M2 1L8 5L2 9V1Z" />
              </svg>
            </button>
          </div>

          {/* ── BENTO TILE 3: CÓDICE ── */}
          <div className="bg-[#2a2a2a] p-3 rounded-[2px] [box-shadow:0px_0px_0px_#0e0e0e,_inset_2px_2px_0px_#ffffff33,_inset_-2px_-2px_0px_#00000099] flex flex-col justify-between">
            <div>
              <div className="flex flex-row justify-between items-center mb-2">
                <span className="bg-[#353535] text-[#e5e2e1] font-press-start text-[7.5px]/[12px] px-1.5 py-0.5 rounded-[2px] [box-shadow:0px_0px_0px_#0e0e0e,_inset_1.5px_1.5px_0px_#ffffff33,_inset_-1.5px_-1.5px_0px_#00000099]">
                  ARCHIVOS
                </span>
                <span className="text-[8px]/[12px] text-[#a78a87] font-silkscreen">
                  RELIC
                </span>
              </div>

              {/* Icon & Title */}
              <div className="flex flex-row items-center gap-2 mb-2">
                <div className="w-9 h-9 shrink-0 bg-[#0e0e0e] flex items-center justify-center text-xl rounded-[2px] [box-shadow:0px_0px_0px_#0e0e0e,_inset_1.5px_1.5px_0px_#ffffff33,_inset_-1.5px_-1.5px_0px_#00000099]">
                  📜
                </div>
                <div className="flex flex-col">
                  <h3 className="text-[10px]/[11px] text-[#ffdeac] font-press-start tracking-[0.6px]">
                    CÓDICE
                  </h3>
                  <span className="text-[8px]/[12px] text-[#e0bfbc] font-silkscreen mt-0.5">
                    30 Pergaminos
                  </span>
                </div>
              </div>

              {/* Hallados */}
              <div className="p-1.5 bg-[#0e0e0e] rounded-[2px] [box-shadow:0px_0px_0px_#0e0e0e,_inset_1.5px_1.5px_0px_#ffffff33,_inset_-1.5px_-1.5px_0px_#00000099] mb-2">
                <span className="text-[7.5px]/[10px] text-[#a78a87] font-silkscreen block">
                  HALLADOS:
                </span>
                <span className="text-[8.5px]/[13px] text-[#fabc4c] font-press-start block mt-0.5">
                  14/30 • 3 SEC
                </span>
              </div>
            </div>

            <button
              onClick={onOpenCodex}
              className="w-full h-8 bg-[#0e0e0e] hover:bg-[#1a1a1a] text-[#ffdeac] font-press-start text-[8px] flex items-center justify-center gap-1.5 rounded-[2px] [box-shadow:0px_0px_0px_#0e0e0e,_inset_2px_2px_0px_#ffffff33,_inset_-2px_-2px_0px_#00000099] active:translate-y-0.5 cursor-pointer transition border border-[#353535]"
            >
              <span>VER CÓDICE</span>
              <svg viewBox="0 0 11 8" className="w-2.5 h-2 fill-[#ffdeac]">
                <path d="M1 1L5 4L1 7V1ZM6 1L10 4L6 7V1Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

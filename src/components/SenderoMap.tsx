import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface SenderoMapProps {
  jadeEnergy?: number;
  level4Completed?: boolean;
  onPlayLevel: (levelNumber: number, title: string, gameType: 'tetris' | 'memorama') => void;
  onBackToFeed?: () => void;
}

export const SenderoMap: React.FC<SenderoMapProps> = ({
  jadeEnergy = 10,
  level4Completed = false,
  onPlayLevel,
  onBackToFeed,
}) => {
  return (
    <div className="w-full max-w-[390px] mx-auto px-2 py-3 pb-24 font-silkscreen select-none text-[#f4efe6]">
      {/* Return to Feed Bar */}
      {onBackToFeed && (
        <div className="w-full flex items-center justify-between pb-2">
          <button
            onClick={onBackToFeed}
            className="flex items-center gap-1.5 text-[9px] text-[#ffdeac] hover:text-[#fabc4c] font-press-start bg-[#20201f] hover:bg-[#2a2a2a] px-3 py-1.5 rounded-[2px] border border-[#353535] [box-shadow:0px_0px_0px_#0e0e0e,_inset_1.5px_1.5px_0px_#ffffff33,_inset_-1.5px_-1.5px_0px_#00000099] cursor-pointer transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← VOLVER AL FEED</span>
          </button>
          <div className="flex items-center gap-1 font-press-start text-[8px] text-[#76d4e4] bg-[#0e0e0e] px-2 py-1 rounded border border-[#353535]">
            <span>⚡ {jadeEnergy}/10 JADE</span>
          </div>
        </div>
      )}

      {/* ── MAP HEADER: SENDA SAGRADA ── */}
      <div className="w-full [box-shadow:inset_2px_2px_0px_#58413f,_4px_4px_0px_#000000] flex flex-col gap-[8px] p-[12px] justify-start items-start bg-[#1b1a19] overflow-hidden rounded-[2px] mb-4">
        {/* Top Region & Progress Header */}
        <div className="w-full flex flex-row justify-between items-center pb-[8px] border-b-2 border-[#353535]">
          <div className="flex flex-row gap-[8px] items-center">
            {/* Map Fold Icon */}
            <svg
              viewBox="0 0 16.5 16.5"
              className="w-[16.5px] h-[16.5px] shrink-0 fill-[#fabc4c]"
            >
              <path d="M11 16.5L5.5 14.575L1.2375 16.225C0.9319 16.347 0.6493 16.313 0.3896 16.122C0.1299 15.931 0 15.675 0 15.354L0 2.521C0 2.322 0.0573 2.147 0.1719 1.994C0.2865 1.841 0.4431 1.726 0.6417 1.65L5.5 0L11 1.925L15.2625 0.275C15.5681 0.153 15.8507 0.187 16.1104 0.378C16.3701 0.569 16.5 0.825 16.5 1.146L16.5 13.979C16.5 14.178 16.4427 14.353 16.3281 14.506C16.2135 14.659 16.0569 14.774 15.8583 14.85L11 16.5ZM10.0833 14.254L10.0833 3.529L6.4167 2.246L6.4167 12.971L10.0833 14.254ZM11.9167 14.254L14.6667 13.338L14.6667 2.475L11.9167 3.529L11.9167 14.254ZM1.8333 14.025L4.5833 12.971L4.5833 2.246L1.8333 3.162L1.8333 14.025Z" />
            </svg>
            <div className="flex flex-col">
              <span className="text-[9px]/[14px] text-[#76d4e4] font-silkscreen font-bold tracking-[0.9px]">
                REGIÓN I • PALENQUE
              </span>
              <h2 className="text-[13px]/[20px] text-[#ffdeac] font-press-start tracking-[-0.325px]">
                SENDA SAGRADA
              </h2>
            </div>
          </div>

          {/* Progress Box */}
          <div className="[box-shadow:2px_2px_0px_#000000] p-[4px_8px] bg-[#0e0e0e] border-2 border-[#fabc4c] flex flex-col items-end">
            <span className="text-[8px]/[12px] text-[#e0bfbc] font-silkscreen font-bold tracking-[0.4px]">
              PROGRESO
            </span>
            <span className="text-[10px]/[15px] text-[#fabc4c] font-press-start tracking-[-0.5px]">
              {level4Completed ? 'NIVEL 05/05' : 'NIVEL 04/05'}
            </span>
          </div>
        </div>

        {/* Sub Info Row */}
        <div className="w-full flex flex-row justify-between items-center pt-[2px]">
          <div className="flex flex-row gap-1 items-center">
            <span className="text-[9px] text-[#fabc4c]">◆</span>
            <span className="text-[9px]/[14px] text-[#a78a87] font-silkscreen">
              {level4Completed ? '11 ESTRELLAS OBTENIDAS' : '8 ESTRELLAS OBTENIDAS'}
            </span>
          </div>
          <span className="text-[9px]/[14px] text-[#76d4e4] font-silkscreen font-bold">
            CENOTE ANCESTRAL
          </span>
        </div>
      </div>

      {/* ── MAPA DE 5 NIVELES (OVERWORLD RETRO PATH) ── */}
      <div className="w-full flex flex-col gap-[20px] px-1 justify-start items-center relative">
        {/* Dotted Center Vertical Path */}
        <div
          className="w-[6px] h-[678px] opacity-80 absolute left-[184px] top-[24px] bg-repeat-y pointer-events-none z-0"
          style={{
            backgroundImage:
              'linear-gradient(180deg, #fabc4c 0%, #fabc4c 1.2%, transparent 1.2%, transparent 2.4%, #fabc4c 2.4%, #fabc4c 3.6%, transparent 3.6%, transparent 4.8%, #fabc4c 4.8%, #fabc4c 6%, transparent 6%, transparent 7.2%, #fabc4c 7.2%, #fabc4c 8.4%, transparent 8.4%, transparent 9.6%, #fabc4c 9.6%, #fabc4c 10.8%, transparent 10.8%, transparent 12%)',
            backgroundSize: '100% 48px',
          }}
        />

        {/* ── NIVEL 01: COMPLETADO (Izquierda) ── */}
        <div className="w-full flex flex-row justify-start items-center pr-8 relative z-10">
          <div
            onClick={() => onPlayLevel(1, 'Glifos del Calendario Sagrado', 'memorama')}
            className="w-full max-w-[285px] [box-shadow:inset_1px_1px_0px_#353535,_4px_4px_0px_#000000] flex flex-row gap-[10px] p-[10px] items-center bg-[#1a1918] border-2 border-[#58413f] hover:border-[#fabc4c] cursor-pointer transition group"
          >
            {/* Thumbnail Box */}
            <div className="w-[48px] h-[48px] shrink-0 bg-[#00636f] border border-[#76d4e4] flex flex-col justify-center items-center relative [filter:drop-shadow(2px_2px_0px_#000000)]">
              {/* Codex Book SVG Icon */}
              <svg viewBox="0 0 16.5 12" className="w-[16.5px] h-[12px] fill-[#81dfef]">
                <path d="M9.75 4.425V3.15C10.1625 2.975 10.5844 2.844 11.0156 2.756C11.4469 2.669 11.9 2.625 12.375 2.625C12.7 2.625 13.0188 2.65 13.3312 2.7C13.6438 2.75 13.95 2.813 14.25 2.888V4.088C13.95 3.975 13.6469 3.891 13.3406 3.834C13.0344 3.778 12.7125 3.75 12.375 3.75C11.9 3.75 11.4438 3.809 11.0062 3.928C10.5688 4.047 10.15 4.213 9.75 4.425ZM4.125 9C4.7125 9 5.2844 9.066 5.8406 9.197C6.3969 9.328 6.95 9.525 7.5 9.788V2.4C6.9875 2.1 6.4437 1.875 5.8688 1.725C5.2938 1.575 4.7125 1.5 4.125 1.5C3.675 1.5 3.2281 1.544 2.7844 1.631C2.3406 1.719 1.9125 1.85 1.5 2.025V9.45C1.9375 9.3 2.3719 9.188 2.8031 9.113C3.2344 9.038 3.675 9 4.125 9ZM8.25 12C7.65 11.525 7 11.156 6.3 10.894C5.6 10.631 4.875 10.5 4.125 10.5C3.6 10.5 3.0844 10.569 2.5781 10.706C2.0719 10.844 1.5875 11.038 1.125 11.288C0.8625 11.425 0.6094 11.419 0.3656 11.269C0.1219 11.119 0 10.9 0 10.613V1.575C0 1.438 0.0344 1.306 0.1031 1.181C0.1719 1.056 0.275 0.962 0.4125 0.9C0.9875 0.6 1.5875 0.375 2.2125 0.225C2.8375 0.075 3.475 0 4.125 0C4.85 0 5.5594 0.094 6.2531 0.281C6.9469 0.469 7.6125 0.75 8.25 1.125C8.8875 0.75 9.5531 0.469 10.2469 0.281C10.9406 0.094 11.65 0 12.375 0C13.025 0 13.6625 0.075 14.2875 0.225C14.9125 0.375 15.5125 0.6 16.0875 0.9C16.225 0.962 16.3281 1.056 16.3969 1.181C16.4656 1.306 16.5 1.438 16.5 1.575V10.613C16.5 10.9 16.3781 11.119 16.1344 11.269C15.8906 11.419 15.6375 11.425 15.375 11.288C14.9125 11.038 14.4281 10.844 13.9219 10.706C13.4156 10.569 12.9 10.5 12.375 10.5C11.625 10.5 10.9 10.631 10.2 10.894C9.5 11.156 8.85 11.525 8.25 12Z" />
              </svg>
              <span className="text-[8px]/[12px] text-[#fabc4c] font-press-start mt-0.5">3★</span>
              {/* Checkmark Gold Badge */}
              <div className="absolute right-[-4px] top-[-4px] bg-[#fabc4c] border border-black px-1 text-[7px] text-[#432c00] font-press-start">
                ✓
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-center">
                <span className="text-[9px]/[14px] text-[#fabc4c] font-press-start">NIVEL 01</span>
                <span className="text-[8px]/[12px] text-[#76d4e4] font-silkscreen font-bold">CODEX</span>
              </div>
              <h3 className="text-[11px]/[17px] text-[#e5e2e1] font-silkscreen font-bold mt-0.5 group-hover:text-[#fabc4c] transition-colors">
                Glifos del Calendario Sagrado
              </h3>
              <span className="text-[9px]/[14px] text-[#a78a87] font-silkscreen">
                Lección ritual completada • Récord perfecto
              </span>
            </div>
          </div>
        </div>

        {/* ── NIVEL 02: COMPLETADO (Derecha) ── */}
        <div className="w-full flex flex-row justify-end items-center pl-8 relative z-10">
          <div
            onClick={() => onPlayLevel(2, 'Balanza de Jade Relámpago', 'tetris')}
            className="w-full max-w-[285px] [box-shadow:inset_1px_1px_0px_#353535,_4px_4px_0px_#000000] flex flex-row gap-[10px] p-[10px] items-center bg-[#1a1918] border-2 border-[#58413f] hover:border-[#fabc4c] cursor-pointer transition group"
          >
            {/* Info */}
            <div className="flex-1 flex flex-col items-end text-right">
              <div className="flex justify-between items-center w-full">
                <span className="text-[8px]/[12px] text-[#fabc4c] font-silkscreen font-bold">ARCADE</span>
                <span className="text-[9px]/[14px] text-[#fabc4c] font-press-start">NIVEL 02</span>
              </div>
              <h3 className="text-[11px]/[17px] text-[#e5e2e1] font-silkscreen font-bold mt-0.5 group-hover:text-[#fabc4c] transition-colors">
                Balanza de Jade Relámpago
              </h3>
              <span className="text-[9px]/[14px] text-[#a78a87] font-silkscreen">
                Récord: 19,850 pts • 3★ Oro
              </span>
            </div>

            {/* Thumbnail Box */}
            <div className="w-[48px] h-[48px] shrink-0 bg-[#a62b2b] border border-[#ffb3ad] flex flex-col justify-center items-center relative [filter:drop-shadow(2px_2px_0px_#000000)]">
              {/* Arcade Controller SVG Icon */}
              <svg viewBox="0 0 15 10.5" className="w-[15px] h-[10.5px] fill-[#ffc2bc]">
                <path d="M1.9 10.5C1.26 10.5 0.77 10.28 0.42 9.83C0.07 9.39 -0.06 8.85 0.03 8.21L0.81 2.59C0.93 1.84 1.26 1.22 1.82 0.73C2.37 0.24 3.03 0 3.78 0H11.2C11.95 0 12.6 0.24 13.16 0.73C13.72 1.22 14.05 1.84 14.16 2.59L14.95 8.21C15.04 8.85 14.91 9.39 14.56 9.83C14.21 10.28 13.71 10.5 13.08 10.5C12.81 10.5 12.57 10.45 12.35 10.36C12.12 10.27 11.91 10.13 11.73 9.94L10.04 8.25H4.94L3.25 9.94C3.06 10.13 2.86 10.27 2.63 10.36C2.41 10.45 2.16 10.5 1.9 10.5ZM11.24 6C11.45 6 11.63 5.93 11.77 5.78C11.92 5.64 11.99 5.46 11.99 5.25C11.99 5.04 11.92 4.86 11.77 4.72C11.63 4.57 11.45 4.5 11.24 4.5C11.03 4.5 10.85 4.57 10.7 4.72C10.56 4.86 10.49 5.04 10.49 5.25C10.49 5.46 10.56 5.64 10.7 5.78C10.85 5.93 11.03 6 11.24 6ZM4.3 6H5.43V4.69H6.74V3.56H5.43V2.25H4.3V3.56H2.99V4.69H4.3V6Z" />
              </svg>
              <span className="text-[8px]/[12px] text-[#fabc4c] font-press-start mt-0.5">3★</span>
              {/* Checkmark Gold Badge */}
              <div className="absolute left-[-4px] top-[-4px] bg-[#fabc4c] border border-black px-1 text-[7px] text-[#432c00] font-press-start">
                ✓
              </div>
            </div>
          </div>
        </div>

        {/* ── NIVEL 03: COMPLETADO (Izquierda) ── */}
        <div className="w-full flex flex-row justify-start items-center pr-8 relative z-10">
          <div
            onClick={() => onPlayLevel(3, 'El Cero Maya & Cuenta Larga', 'memorama')}
            className="w-full max-w-[285px] [box-shadow:inset_1px_1px_0px_#353535,_4px_4px_0px_#000000] flex flex-row gap-[10px] p-[10px] items-center bg-[#1a1918] border-2 border-[#58413f] hover:border-[#fabc4c] cursor-pointer transition group"
          >
            {/* Thumbnail Box */}
            <div className="w-[48px] h-[48px] shrink-0 bg-[#00636f] border border-[#76d4e4] flex flex-col justify-center items-center relative [filter:drop-shadow(2px_2px_0px_#000000)]">
              {/* Stela Pillar SVG Icon */}
              <svg viewBox="0 0 14.6 12" className="w-[14.6px] h-[12px] fill-[#81dfef]">
                <path d="M4.88 12C4.46 12 4.11 11.85 3.82 11.56C3.52 11.27 3.38 10.91 3.38 10.5V8.25H5.63V6.56C5.19 6.54 4.77 6.44 4.38 6.27C3.98 6.1 3.63 5.85 3.3 5.51V4.69H2.44L0 2.25C0.45 1.68 1.01 1.27 1.67 1.03C2.33 0.79 3 0.68 3.68 0.68C4.01 0.68 4.34 0.7 4.66 0.75C4.98 0.8 5.3 0.89 5.63 1.03V0H14.63V9.75C14.63 10.38 14.41 10.91 13.97 11.34C13.53 11.78 13 12 12.38 12H4.88ZM7.13 8.25H11.63V9.75C11.63 9.96 11.7 10.14 11.84 10.28C11.98 10.43 12.16 10.5 12.38 10.5C12.59 10.5 12.77 10.43 12.91 10.28C13.05 10.14 13.13 9.96 13.13 9.75V1.5H7.13V1.95L11.63 6.45V7.5H10.58L8.44 5.36L8.29 5.51C8.11 5.69 7.93 5.84 7.73 5.98C7.54 6.12 7.34 6.23 7.13 6.3V8.25Z" />
              </svg>
              <span className="text-[8px]/[12px] text-[#fabc4c] font-press-start mt-0.5">2★</span>
              {/* Checkmark Gold Badge */}
              <div className="absolute right-[-4px] top-[-4px] bg-[#fabc4c] border border-black px-1 text-[7px] text-[#432c00] font-press-start">
                ✓
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-center">
                <span className="text-[9px]/[14px] text-[#fabc4c] font-press-start">NIVEL 03</span>
                <span className="text-[8px]/[12px] text-[#76d4e4] font-silkscreen font-bold">ESTELA</span>
              </div>
              <h3 className="text-[11px]/[17px] text-[#e5e2e1] font-silkscreen font-bold mt-0.5 group-hover:text-[#fabc4c] transition-colors">
                El Cero Maya &amp; Cuenta Larga
              </h3>
              <span className="text-[9px]/[14px] text-[#a78a87] font-silkscreen">
                Sabiduría ancestral desbloqueada
              </span>
            </div>
          </div>
        </div>

        {/* ── NIVEL 04: NIVEL ACTUAL / ACTIVO (Centro Heroico Destacado) ── */}
        <div className="w-full relative z-20 py-2">
          <div className="w-full [box-shadow:inset_-2px_-2px_0px_#604100,_inset_2px_2px_0px_#ffdeac,_6px_6px_0px_#000000] flex flex-col gap-[8px] p-[12px] justify-start items-start bg-[#20201f] border-2 border-[#fabc4c] rounded-[2px]">
            {/* Banner Superior de Estado Activo */}
            <div className="w-full flex flex-row justify-between items-center p-[6px] bg-[#0e0e0e] border border-[#58413f]">
              <div className="flex flex-row gap-[6px] p-[2px_8px] items-center bg-[#fabc4c]">
                {/* Play Arrow Icon */}
                <svg viewBox="0 0 6.5 8.2" className="w-[6.5px] h-[8.2px] fill-[#432c00]">
                  <path d="M0 8.167V0L6.42 4.083L0 8.167Z" />
                </svg>
                <span className="text-[8px]/[12px] text-[#432c00] font-press-start tracking-[0.4px]">
                  {level4Completed ? '¡DOMINADO!' : '¡JUGAR AHORA!'}
                </span>
              </div>
              <div className="flex flex-row gap-1 items-center px-1.5">
                {/* Lightning Bolt */}
                <svg viewBox="0 0 9.3 11.7" className="w-[9.3px] h-[11.7px] fill-[#76d4e4]">
                  <path d="M2.33 11.67L2.92 7.58H0L5.25 0H6.42L5.83 4.67H9.33L3.5 11.67H2.33Z" />
                </svg>
                <span className="text-[9px]/[14px] text-[#76d4e4] font-silkscreen font-bold">
                  COSTE: 2⚡ JADE
                </span>
              </div>
            </div>

            {/* Contenido del Nivel Activo */}
            <div className="w-full flex flex-row gap-[12px] items-start pt-1">
              {/* Glyph Icon Box */}
              <div className="w-[56px] h-[56px] shrink-0 [box-shadow:3px_3px_0px_#000000] flex flex-col justify-center items-center bg-[#bd8717] border-2 border-[#ffdeac] relative">
                <svg viewBox="0 0 18 18" className="w-[18px] h-[18px] fill-[#131313]">
                  <path d="M0 8V0H8V8H0ZM0 18V10H8V18H0ZM10 8V0H18V8H10ZM10 18V10H18V18H10ZM2 6H6V2H2V6ZM12 6H16V2H12V6ZM12 16H16V12H12V16ZM2 16H6V12H2V16Z" />
                </svg>
                <span className="text-[8px]/[12px] text-black font-press-start mt-0.5">
                  {level4Completed ? '3★' : 'ACTIVO'}
                </span>
              </div>

              <div className="flex-1 flex flex-col">
                <span className="text-[9px]/[14px] text-[#fabc4c] font-press-start">
                  NIVEL 04 • DESAFÍO ARCADE
                </span>
                <h3 className="text-[12px]/[15px] text-white font-press-start tracking-[-0.6px] mt-1">
                  Tetris Azteca: Cascada de Jade
                </h3>
                <p className="text-[10px]/[14px] text-[#e0bfbc] font-silkscreen mt-1 leading-snug">
                  Apila bloques vigesimales y alinea glifos solares antes del colapso del cenote.
                </p>
              </div>
            </div>

            {/* Botón de Acción Pixel Art Primario */}
            <button
              onClick={() => onPlayLevel(4, 'Tetris Azteca: Cascada de Jade', 'tetris')}
              className="w-full h-10 bg-[#a62b2b] hover:bg-[#ba3232] text-[#ffdad7] font-press-start text-[11px] tracking-[0.55px] flex items-center justify-center gap-2 rounded-[2px] [box-shadow:inset_2px_2px_0px_#ffb3ad,_inset_-2px_-2px_0px_#68000a,_0px_4px_0px_#000000] active:translate-y-0.5 cursor-pointer transition mt-1"
            >
              {/* Swords / Crest Icon */}
              <svg viewBox="0 0 15 15" className="w-[15px] h-[15px] fill-[#fabc4c]">
                <path d="M12.79 14.78L10.59 12.6L8.94 14.25L8.42 13.73C8.13 13.44 7.99 13.08 7.99 12.66C7.99 12.23 8.13 11.88 8.42 11.59L11.59 8.42C11.88 8.13 12.23 7.99 12.66 7.99C13.08 7.99 13.44 8.13 13.73 8.42L14.25 8.94L12.6 10.59L14.78 12.79C14.92 12.94 15 13.11 15 13.31C15 13.51 14.92 13.69 14.78 13.84L13.84 14.78C13.69 14.92 13.51 15 13.31 15C13.11 15 12.94 14.92 12.79 14.78ZM15 3L6.49 11.51L6.58 11.59C6.87 11.88 7.01 12.23 7.01 12.66C7.01 13.08 6.87 13.44 6.58 13.73L6.06 14.25L4.41 12.6L2.21 14.78C2.06 14.92 1.89 15 1.69 15C1.49 15 1.31 14.92 1.16 14.78L0.22 13.84C0.07 13.69 0 13.51 0 13.31C0 13.11 0.07 12.94 0.22 12.79L2.4 10.59L0.75 8.94L1.28 8.42C1.56 8.13 1.92 7.99 2.34 7.99C2.77 7.99 3.13 8.13 3.41 8.42L3.49 8.51L12 0L15 0V3Z" />
              </svg>
              <span>{level4Completed ? 'REPETIR RETO' : 'ENTRAR AL RETO'}</span>
              <svg viewBox="0 0 10.7 10.7" className="w-[10.7px] h-[10.7px] fill-[#fabc4c]">
                <path d="M8.12 6H0V4.67H8.12L4.38 0.93L5.33 0L10.67 5.33L5.33 10.67L4.38 9.73L8.12 6Z" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── NIVEL 05: MINIJEFE / ENFRENTAMIENTO FINAL (Tarjetas Jefe Cinabrio 32-bit) ── */}
        <div className="w-full relative z-20 pb-4">
          <div className="w-full [box-shadow:inset_-2px_-2px_0px_#68000a,_inset_2px_2px_0px_#ffb3ad,_5px_5px_0px_#000000] flex flex-col gap-[8px] p-[12px] justify-start items-start bg-[#1c1b1b] border-2 border-[#a62b2b] rounded-[2px]">
            {/* Barra de Título de Jefe */}
            <div className="w-full flex flex-row justify-between items-center pb-[6px] border-b border-[#58413f]">
              <div className="flex flex-row gap-[6px] p-[2px_8px] items-center bg-[#93000a] border border-[#ffb4ab]">
                {/* Flame / Skull Icon */}
                <svg viewBox="0 0 9.3 11.1" className="w-[9.3px] h-[11.1px] fill-[#ffb4ab]">
                  <path d="M1.17 6.42C1.17 6.92 1.27 7.4 1.47 7.85C1.68 8.31 1.97 8.7 2.35 9.04V8.78C2.35 8.47 2.39 8.18 2.51 7.9C2.63 7.63 2.8 7.38 3.02 7.16L4.67 5.54L6.31 7.16C6.54 7.38 6.71 7.63 6.82 7.9C6.94 8.18 7 8.47 7 8.78V9.04C7.36 8.7 7.66 8.31 7.86 7.85C8.06 7.4 8.17 6.92 8.17 6.42C8.17 5.93 8.08 5.47 7.9 5.04C7.72 4.61 7.46 4.22 7.12 3.88C6.92 4.01 6.72 4.1 6.5 4.16C6.29 4.23 6.07 4.26 5.85 4.26C5.25 4.26 4.72 4.06 4.28 3.66C3.84 3.26 3.58 2.77 3.51 2.19C3.14 2.51 2.8 2.84 2.51 3.19C2.22 3.53 1.97 3.88 1.77 4.24C1.57 4.59 1.42 4.95 1.32 5.32C1.22 5.69 1.17 6.06 1.17 6.42ZM4.67 0V1.93C4.67 2.26 4.78 2.53 5.01 2.76C5.24 2.98 5.52 3.09 5.85 3.09C6.02 3.09 6.19 3.06 6.34 2.98C6.49 2.91 6.62 2.8 6.74 2.65L7 2.33C7.72 2.74 8.29 3.31 8.71 4.04C9.12 4.77 9.33 5.56 9.33 6.42C9.33 7.72 8.88 8.82 7.98 9.73C7.07 10.63 5.97 11.08 4.67 11.08C3.36 11.08 2.26 10.63 1.36 9.73C0.45 8.82 0 7.72 0 6.42C0 5.16 0.42 3.97 1.26 2.84C2.1 1.72 3.24 0.77 4.67 0Z" />
                </svg>
                <span className="text-[8px]/[12px] text-[#ffdad6] font-press-start tracking-[0.8px]">
                  MINIJEFE FINAL
                </span>
              </div>
              <span className="text-[8px]/[12px] text-[#a78a87] font-silkscreen font-bold tracking-[0.2px]">
                NIVEL 05
              </span>
            </div>

            {/* Boss Content */}
            <div className="w-full flex flex-row gap-[12px] items-start pt-1">
              {/* Boss Mask Icon Box */}
              <div className="w-[56px] h-[56px] shrink-0 [box-shadow:3px_3px_0px_#000000] flex flex-col justify-center items-center bg-[#93000a] border-2 border-[#ffb3ad]">
                <svg viewBox="0 0 23.3 23.3" className="w-[23.3px] h-[23.3px] fill-[#ffb4ab]">
                  <path d="M4.67 23.33V18.38C3.91 18.04 3.24 17.6 2.67 17.05C2.1 16.49 1.61 15.87 1.21 15.17C0.81 14.47 0.51 13.72 0.31 12.92C0.1 12.12 0 11.32 0 10.5C0 7.43 1.09 4.91 3.27 2.95C5.44 0.98 8.24 0 11.67 0C15.09 0 17.89 0.98 20.07 2.95C22.24 4.91 23.33 7.43 23.33 10.5C23.33 11.32 23.23 12.12 23.03 12.92C22.82 13.72 22.52 14.47 22.12 15.17C21.72 15.87 21.24 16.49 20.66 17.05C20.09 17.6 19.42 18.04 18.67 18.38V23.33H4.67ZM7 21H8.17V18.67H10.5V21H12.83V18.67H15.17V21H16.33V16.86C17.07 16.68 17.73 16.39 18.3 15.98C18.88 15.58 19.36 15.09 19.76 14.53C20.16 13.96 20.47 13.34 20.68 12.66C20.89 11.98 21 11.26 21 10.5C21 8.07 20.14 6.1 18.42 4.59C16.7 3.09 14.45 2.33 11.67 2.33C8.89 2.33 6.64 3.09 4.91 4.59C3.19 6.1 2.33 8.07 2.33 10.5C2.33 11.26 2.44 11.98 2.65 12.66C2.87 13.34 3.17 13.96 3.57 14.53C3.97 15.09 4.46 15.58 5.05 15.98C5.63 16.39 6.28 16.68 7 16.86V21Z" />
                </svg>
                <span className="text-[7px]/[11px] text-[#ffdad6] font-press-start mt-0.5">BOSS</span>
              </div>

              <div className="flex-1 flex flex-col">
                <span className="text-[8px]/[12px] text-[#ffb4ab] font-press-start tracking-[0.4px]">
                  ENFRENTAMIENTO MONUMENTAL
                </span>
                <h3 className="text-[11px]/[14px] text-[#ffb3ad] font-press-start tracking-[-0.55px] mt-1">
                  Juicio de Pakal - Guardián del Cenote
                </h3>
                <p className="text-[10px]/[13px] text-[#a78a87] font-silkscreen mt-1 leading-snug">
                  Supera el Nivel 04 para desbloquear el combate ritual de fracciones vigesimales y abrir la cámara dorada.
                </p>
              </div>
            </div>

            {/* Botón de Jefe Bloqueado o Desbloqueado */}
            {level4Completed ? (
              <button
                onClick={() => onPlayLevel(5, 'Juicio de Pakal - Guardián del Cenote', 'memorama')}
                className="w-full h-10 bg-[#93000a] hover:bg-[#b00010] text-[#ffdad6] font-press-start text-[10px] tracking-[0.5px] flex items-center justify-center gap-2 rounded-[2px] [box-shadow:inset_2px_2px_0px_#ffb4ab,_inset_-2px_-2px_0px_#410002,_0px_4px_0px_#000000] active:translate-y-0.5 cursor-pointer transition mt-1 animate-pulse"
              >
                <span>¡ENFRENTAR A PAKAL!</span>
                <span>⚔️</span>
              </button>
            ) : (
              <div className="w-full opacity-80 [box-shadow:inset_1px_1px_0px_#000000] flex flex-row gap-[8px] p-[8px_0px] justify-center items-center bg-[#0e0e0e] border border-[#58413f] rounded-[2px] mt-1">
                {/* Lock Icon */}
                <svg viewBox="0 0 10.7 14" className="w-[10.7px] h-[14px] fill-[#a78a87]">
                  <path d="M1.33 14C0.97 14 0.65 13.87 0.39 13.61C0.13 13.35 0 13.03 0 12.67V6C0 5.63 0.13 5.32 0.39 5.06C0.65 4.8 0.97 4.67 1.33 4.67H2V3.33C2 2.41 2.32 1.63 2.97 0.98C3.63 0.33 4.41 0 5.33 0C6.26 0 7.04 0.33 7.69 0.98C8.34 1.63 8.67 2.41 8.67 3.33V4.67H9.33C9.7 4.67 10.01 4.8 10.28 5.06C10.54 5.32 10.67 5.63 10.67 6V12.67C10.67 13.03 10.54 13.35 10.28 13.61C10.01 13.87 9.7 14 9.33 14H1.33ZM3.33 4.67H7.33V3.33C7.33 2.78 7.14 2.31 6.75 1.92C6.36 1.53 5.89 1.33 5.33 1.33C4.78 1.33 4.31 1.53 3.92 1.92C3.53 2.31 3.33 2.78 3.33 3.33V4.67Z" />
                </svg>
                <span className="text-[9px]/[14px] text-[#a78a87] font-press-start tracking-[0.225px]">
                  BLOQUEADO • SUPERA NIVEL 04
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

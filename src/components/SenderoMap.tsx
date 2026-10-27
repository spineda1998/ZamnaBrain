import React from 'react';
import { ArrowLeft, Play, Lock, Check, Zap, Sparkles } from 'lucide-react';

interface SenderoMapProps {
  jadeEnergy?: number;
  level4Completed?: boolean;
  onPlayLevel: (levelNumber: number, title: string, gameType: 'tetris' | 'memorama' | 'balanza' | 'kukulcan') => void;
  onBackToFeed?: () => void;
}

export const SenderoMap: React.FC<SenderoMapProps> = ({
  jadeEnergy = 10,
  level4Completed = false,
  onPlayLevel,
  onBackToFeed,
}) => {
  return (
    <div className="w-full max-w-[440px] mx-auto px-2.5 py-3 pb-36 font-silkscreen select-none text-[#FFFDF2]">
      {/* Return to Feed Bar */}
      {onBackToFeed && (
        <div className="w-full flex items-center justify-between pb-3">
          <button
            onClick={onBackToFeed}
            className="flex items-center gap-1.5 text-[9.5px] text-[#FFFDF2] hover:text-[#2A7B4C] font-press-start bg-[#180a0c] hover:bg-[#261013] px-3 py-2 border border-[#9E2A2B]/70 [box-shadow:2px_2px_0px_#000,_inset_1.5px_1.5px_0px_#ffffff22] cursor-pointer transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← VOLVER AL FEED</span>
          </button>
          <div className="flex items-center gap-1.5 font-press-start text-[8.5px] text-[#2A7B4C] bg-[#070203] px-2.5 py-1.5 border border-[#2A7B4C]/60 [box-shadow:1px_1px_0px_#000]">
            <Zap className="w-3.5 h-3.5 text-[#2A7B4C] fill-[#2A7B4C]" />
            <span>{jadeEnergy}/10 JADE</span>
          </div>
        </div>
      )}

      {/* ── MAP HEADER: SENDA SAGRADA ── */}
      <div className="w-full [box-shadow:inset_2px_2px_0px_#ffffff15,_3px_3px_0px_#000] flex flex-col gap-2 p-3.5 bg-[#180a0c] overflow-hidden rounded-[2px] mb-5 border-2 border-[#9E2A2B]">
        {/* Top Region & Progress Header */}
        <div className="w-full flex flex-row justify-between items-center pb-2 border-b border-[#3d181b]">
          <div className="flex flex-row gap-2.5 items-center">
            <div className="w-7 h-7 bg-[#070203] border border-[#2A7B4C] flex items-center justify-center [box-shadow:1px_1px_0px_#000]">
              <Sparkles className="w-4 h-4 text-[#FFFDF2]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9.5px]/[14px] text-[#2A7B4C] font-silkscreen font-bold tracking-[0.9px]">
                REGIÓN I • PALENQUE
              </span>
              <h2 className="text-[13px]/[20px] text-[#FFFDF2] font-press-start tracking-[-0.3px]">
                SENDA SAGRADA
              </h2>
            </div>
          </div>

          <div className="[box-shadow:2px_2px_0px_#000] px-2.5 py-1.5 bg-[#070203] border-2 border-[#2A7B4C] flex flex-col items-end">
            <span className="text-[8px]/[12px] text-[#c7bca7] font-silkscreen font-bold">
              PROGRESO
            </span>
            <span className="text-[10px]/[15px] text-[#FFFDF2] font-press-start">
              {level4Completed ? 'NIVEL 05/05' : 'NIVEL 04/05'}
            </span>
          </div>
        </div>

        {/* Sub Info Row */}
        <div className="w-full flex flex-row justify-between items-center pt-1">
          <div className="flex flex-row gap-1.5 items-center">
            <span className="text-[9.5px] text-[#2A7B4C]">◆</span>
            <span className="text-[9.5px]/[14px] text-[#e0d6c4] font-silkscreen">
              {level4Completed ? '11 ESTRELLAS OBTENIDAS' : '8 ESTRELLAS OBTENIDAS'}
            </span>
          </div>
          <span className="text-[8.5px] font-press-start text-[#2A7B4C] bg-[#06140c] px-2 py-0.5 border border-[#2A7B4C]">
            4 MINIJUEGOS INTEGRADOS
          </span>
        </div>
      </div>

      {/* ── MAPA DE 5 NIVELES (OVERWORLD RETRO PATH) ── */}
      <div className="w-full flex flex-col gap-5 px-1 justify-start items-center relative">
        {/* Dotted Center Vertical Path */}
        <div
          className="w-[6px] h-[780px] opacity-70 absolute left-[50%] -translate-x-1/2 top-[24px] bg-repeat-y pointer-events-none z-0"
          style={{
            backgroundImage:
              'linear-gradient(180deg, #2A7B4C 0%, #2A7B4C 2%, transparent 2%, transparent 4%, #2A7B4C 4%, #2A7B4C 6%, transparent 6%, transparent 8%)',
            backgroundSize: '100% 40px',
          }}
        />

        {/* ── NIVEL 01: SENDA DE KUKULKÁN (Izquierda) ── */}
        <div className="w-full flex flex-row justify-start items-center pr-6 relative z-10">
          <div
            onClick={() => onPlayLevel(1, 'Senda de Kukulkán • Orbes Vigesimales', 'kukulcan')}
            className="w-full max-w-[310px] [box-shadow:inset_1px_1px_0px_#ffffff15,_3px_3px_0px_#000] flex flex-row gap-3 p-3 items-center bg-[#180a0c] border-2 border-[#2A7B4C] hover:border-[#FFFDF2] cursor-pointer transition group"
          >
            <div className="w-13 h-13 shrink-0 bg-[#06140c] border-2 border-[#2A7B4C] flex flex-col justify-center items-center relative [box-shadow:2px_2px_0px_#000]">
              <span className="text-xl">🐍</span>
              <span className="text-[7.5px] text-[#86efac] font-press-start mt-0.5">3★</span>
              <div className="absolute right-[-5px] top-[-5px] bg-[#2A7B4C] border border-black px-1 text-[7.5px] text-[#FFFDF2] font-press-start">
                ✓
              </div>
            </div>

            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-center">
                <span className="text-[9px]/[14px] text-[#FFFDF2] font-press-start">NIVEL 01</span>
                <span className="text-[8px] text-[#86efac] font-press-start bg-[#06140c] px-1.5 py-0.5 border border-[#2A7B4C]">
                  KUKULKÁN
                </span>
              </div>
              <h3 className="text-[11.5px]/[17px] text-[#FFFDF2] font-silkscreen font-bold mt-0.5 group-hover:text-[#2A7B4C] transition-colors">
                Senda de Kukulkán
              </h3>
              <span className="text-[9.5px]/[14px] text-[#cbd5e1] font-['Space_Mono',monospace]">
                Suma 20 con los orbes sagrados
              </span>
            </div>
          </div>
        </div>

        {/* ── NIVEL 02: MÁSCARAS GEMELAS (Derecha) ── */}
        <div className="w-full flex flex-row justify-end items-center pl-6 relative z-10">
          <div
            onClick={() => onPlayLevel(2, 'Máscaras Gemelas • Glifos Ancestrales', 'memorama')}
            className="w-full max-w-[310px] [box-shadow:inset_1px_1px_0px_#ffffff15,_3px_3px_0px_#000] flex flex-row gap-3 p-3 items-center bg-[#180a0c] border-2 border-[#2A7B4C] hover:border-[#FFFDF2] cursor-pointer transition group"
          >
            <div className="flex-1 flex flex-col items-end text-right">
              <div className="flex justify-between items-center w-full">
                <span className="text-[8px] text-[#FFFDF2] font-press-start bg-[#06140c] px-1.5 py-0.5 border border-[#2A7B4C]">
                  MEMORIA
                </span>
                <span className="text-[9px]/[14px] text-[#FFFDF2] font-press-start">NIVEL 02</span>
              </div>
              <h3 className="text-[11.5px]/[17px] text-[#FFFDF2] font-silkscreen font-bold mt-0.5 group-hover:text-[#2A7B4C] transition-colors">
                Máscaras Gemelas
              </h3>
              <span className="text-[9.5px]/[14px] text-[#cbd5e1] font-['Space_Mono',monospace]">
                Empareja glifos y números arábigos
              </span>
            </div>

            <div className="w-13 h-13 shrink-0 bg-[#06140c] border-2 border-[#2A7B4C] flex flex-col justify-center items-center relative [box-shadow:2px_2px_0px_#000]">
              <span className="text-xl">🎭</span>
              <span className="text-[7.5px] text-[#86efac] font-press-start mt-0.5">3★</span>
              <div className="absolute left-[-5px] top-[-5px] bg-[#2A7B4C] border border-black px-1 text-[7.5px] text-[#FFFDF2] font-press-start">
                ✓
              </div>
            </div>
          </div>
        </div>

        {/* ── NIVEL 03: BALANZA DE JADE (Izquierda) ── */}
        <div className="w-full flex flex-row justify-start items-center pr-6 relative z-10">
          <div
            onClick={() => onPlayLevel(3, 'Balanza de Jade • Tributo Sagrado', 'balanza')}
            className="w-full max-w-[310px] [box-shadow:inset_1px_1px_0px_#ffffff15,_3px_3px_0px_#000] flex flex-row gap-3 p-3 items-center bg-[#180a0c] border-2 border-[#2A7B4C] hover:border-[#FFFDF2] cursor-pointer transition group"
          >
            <div className="w-13 h-13 shrink-0 bg-[#06140c] border-2 border-[#2A7B4C] flex flex-col justify-center items-center relative [box-shadow:2px_2px_0px_#000]">
              <span className="text-xl">⚖️</span>
              <span className="text-[7.5px] text-[#86efac] font-press-start mt-0.5">2★</span>
              <div className="absolute right-[-5px] top-[-5px] bg-[#2A7B4C] border border-black px-1 text-[7.5px] text-[#FFFDF2] font-press-start">
                ✓
              </div>
            </div>

            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-center">
                <span className="text-[9px]/[14px] text-[#FFFDF2] font-press-start">NIVEL 03</span>
                <span className="text-[8px] text-[#86efac] font-press-start bg-[#06140c] px-1.5 py-0.5 border border-[#2A7B4C]">
                  BALANZA
                </span>
              </div>
              <h3 className="text-[11.5px]/[17px] text-[#FFFDF2] font-silkscreen font-bold mt-0.5 group-hover:text-[#2A7B4C] transition-colors">
                Balanza de Jade
              </h3>
              <span className="text-[9.5px]/[14px] text-[#cbd5e1] font-['Space_Mono',monospace]">
                Equilibra pesas de 1, 5 y 20
              </span>
            </div>
          </div>
        </div>

        {/* ── NIVEL 04: TETRIS AZTECA (Centro Heroico Destacado) ── */}
        <div className="w-full relative z-20 py-1">
          <div className="w-full [box-shadow:inset_2px_2px_0px_#ffffff22,_5px_5px_0px_#000] flex flex-col gap-2.5 p-3.5 bg-[#180a0c] border-2 border-[#9E2A2B] rounded-[2px]">
            {/* Banner Superior de Estado Activo */}
            <div className="w-full flex flex-row justify-between items-center p-2 bg-[#070203] border border-[#9E2A2B]/60">
              <div className="flex flex-row gap-1.5 px-2 py-0.5 items-center bg-[#9E2A2B]">
                <Play className="w-3 h-3 text-[#FFFDF2] fill-[#FFFDF2]" />
                <span className="text-[8px] text-[#FFFDF2] font-press-start font-bold">
                  {level4Completed ? '¡DOMINADO!' : '¡NIVEL ACTIVO!'}
                </span>
              </div>
              <div className="flex flex-row gap-1 items-center px-1.5">
                <Zap className="w-3.5 h-3.5 text-[#2A7B4C] fill-[#2A7B4C]" />
                <span className="text-[9px] text-[#2A7B4C] font-silkscreen font-bold">
                  COSTE: 2⚡ JADE
                </span>
              </div>
            </div>

            {/* Contenido del Nivel Activo */}
            <div className="w-full flex flex-row gap-3 items-start pt-1">
              <div className="w-14 h-14 shrink-0 [box-shadow:2px_2px_0px_#000] flex flex-col justify-center items-center bg-[#9E2A2B] border-2 border-[#FFFDF2]/40 relative">
                <span className="text-2xl">🧱</span>
                <span className="text-[7.5px] text-[#FFFDF2] font-press-start mt-0.5">
                  {level4Completed ? '3★' : 'TETRIS'}
                </span>
              </div>

              <div className="flex-1 flex flex-col">
                <span className="text-[9px] text-[#2A7B4C] font-press-start">
                  NIVEL 04 • TETRIS AZTECA
                </span>
                <h3 className="text-[12px]/[16px] text-[#FFFDF2] font-press-start mt-1">
                  Cascada de Jade Vigesimal
                </h3>
                <p className="text-[10.5px]/[15px] text-[#e0d6c4] font-['Space_Mono',monospace] mt-1 leading-snug">
                  Apila bloques tallados y alinea estelas solares antes del colapso del cenote.
                </p>
              </div>
            </div>

            {/* Botón de Acción Pixel Art Primario */}
            <button
              type="button"
              onClick={() => onPlayLevel(4, 'Tetris Azteca: Cascada de Jade', 'tetris')}
              className="w-full py-3 bg-[#9E2A2B] hover:bg-[#b53032] text-[#FFFDF2] font-press-start text-[10.5px] tracking-wider flex items-center justify-center gap-2 rounded-[2px] [box-shadow:2px_2px_0px_#000,_inset_1.5px_1.5px_0px_#ffffff44] active:translate-y-0.5 cursor-pointer transition mt-1"
            >
              <span>{level4Completed ? 'REPETIR RETO ▶' : 'ENTRAR AL RETO ▶'}</span>
            </button>
          </div>
        </div>

        {/* ── NIVEL 05: MINIJEFE FINAL (Juicio de Pakal) ── */}
        <div className="w-full relative z-20 pb-4">
          <div className="w-full [box-shadow:inset_2px_2px_0px_#ffffff22,_5px_5px_0px_#000] flex flex-col gap-2.5 p-3.5 bg-[#180a0c] border-2 border-[#9E2A2B] rounded-[2px]">
            <div className="w-full flex flex-row justify-between items-center pb-2 border-b border-[#3d181b]">
              <div className="flex flex-row gap-1.5 px-2.5 py-0.5 items-center bg-[#9E2A2B] border border-[#FFFDF2]/40">
                <span className="text-xs">💀</span>
                <span className="text-[8px] text-[#FFFDF2] font-press-start font-bold">
                  MINIJEFE FINAL
                </span>
              </div>
              <span className="text-[8.5px] text-[#c7bca7] font-silkscreen font-bold">
                NIVEL 05 • CLÍMAX
              </span>
            </div>

            <div className="w-full flex flex-row gap-3 items-start pt-1">
              <div className="w-14 h-14 shrink-0 [box-shadow:2px_2px_0px_#000] flex flex-col justify-center items-center bg-[#9E2A2B] border-2 border-[#FFFDF2]/40">
                <span className="text-2xl">👑</span>
                <span className="text-[7.5px] text-[#FFFDF2] font-press-start mt-0.5">BOSS</span>
              </div>

              <div className="flex-1 flex flex-col">
                <span className="text-[8.5px] text-[#2A7B4C] font-press-start">
                  ENFRENTAMIENTO MONUMENTAL
                </span>
                <h3 className="text-[12px]/[15px] text-[#FFFDF2] font-press-start mt-1">
                  Juicio de Pakal
                </h3>
                <p className="text-[10.5px]/[15px] text-[#e0d6c4] font-['Space_Mono',monospace] mt-1 leading-snug">
                  Combate ritual con orbes y cálculo vigesimal para abrir la cámara de oro sagrada.
                </p>
              </div>
            </div>

            {level4Completed ? (
              <button
                type="button"
                onClick={() => onPlayLevel(5, 'Juicio de Pakal - Guardián del Cenote', 'kukulcan')}
                className="w-full py-3 bg-[#9E2A2B] hover:bg-[#b53032] text-[#FFFDF2] font-press-start text-[10px] tracking-wider flex items-center justify-center gap-2 rounded-[2px] [box-shadow:2px_2px_0px_#000,_inset_1.5px_1.5px_0px_#ffffff44] active:translate-y-0.5 cursor-pointer transition mt-1 animate-pulse"
              >
                <span>⚔️ ¡ENFRENTAR A PAKAL! ⚔️</span>
              </button>
            ) : (
              <div className="w-full opacity-85 [box-shadow:inset_1px_1px_0px_#000] flex flex-row gap-2 py-2.5 justify-center items-center bg-[#070203] border border-[#9E2A2B]/60 rounded-[2px] mt-1">
                <Lock className="w-3.5 h-3.5 text-[#9E2A2B]" />
                <span className="text-[8.5px] text-[#c7bca7] font-press-start">
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

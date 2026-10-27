import React from 'react';
import { User, ProgressSummary, AppLanguage } from '../types';
import { getT } from '../utils/i18n';
import { Sparkles, Gamepad2, BookOpen, Compass, ChevronRight, Zap } from 'lucide-react';

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
    <div className="w-full max-w-[440px] mx-auto px-2.5 py-3 pb-36 font-silkscreen select-none text-[#FFFDF2] space-y-4">
      {/* ── Section 1: EVENTO Y RETOS SEMANALES ── */}
      <div className="w-full bg-[#180a0c] border-2 border-[#9E2A2B] p-3 rounded-[2px] [box-shadow:3px_3px_0px_#000,_inset_1.5px_1.5px_0px_#ffffff15] relative overflow-hidden">
        {/* Glow de acento verde jade */}
        <div className="w-24 h-24 absolute right-[-20px] top-[-20px] bg-[#2A7B4C]/15 rounded-full blur-xl pointer-events-none" />

        {/* Header Bento */}
        <div className="w-full pb-2 border-b border-[#3d181b] flex flex-row justify-between items-center relative z-10">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#FFFDF2]" />
            <div className="flex flex-col">
              <span className="text-[10px]/[13px] text-[#FFFDF2] font-press-start">
                RETOS SAGRADOS
              </span>
              <span className="text-[8px]/[12px] text-[#2A7B4C] font-silkscreen font-bold">
                ALINEACIÓN CELESTIAL
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <span className="bg-[#9E2A2B] text-[#FFFDF2] font-press-start text-[8px] px-2 py-0.5 border border-[#FFFDF2]/30">
              X2 EXP
            </span>
            <span className="text-[7.5px] text-[#c7bca7] mt-0.5">
              REINICIO: 3D 14H
            </span>
          </div>
        </div>

        {/* Ticker / Bonus Notifier */}
        <div className="w-full mt-2 p-1.5 bg-[#0e0506] border border-[#9E2A2B]/40 flex justify-between items-center relative z-10">
          <span className="text-[8.5px] text-[#FFFDF2] truncate">
            ★ BONO VIGESIMAL ACTIVO • CIEN ANTORCHAS SAGRADAS
          </span>
          <span className="w-2 h-2 bg-[#2A7B4C] rounded-full shrink-0 ml-1.5 animate-pulse" />
        </div>

        {/* Misiones Semanales */}
        <div className="w-full mt-2.5 flex flex-col gap-2 relative z-10">
          {/* Reto 1 */}
          <div className="w-full p-2 bg-[#0e0506] border border-[#2A7B4C]/40">
            <div className="flex justify-between items-center text-[9.5px]">
              <span className="text-[#FFFDF2] font-bold truncate">
                ✦ Descifra 3 estelas en Copán
              </span>
              <div className="flex items-center gap-1 font-press-start text-[7.5px] shrink-0">
                <span className="text-[#2A7B4C]">2/3</span>
                <span className="text-[#FFFDF2]">+500XP</span>
              </div>
            </div>
            <div className="w-full h-2 bg-[#1a0c0e] mt-1.5 p-0.5 flex gap-1">
              <div className="flex-1 bg-[#2A7B4C]" />
              <div className="flex-1 bg-[#2A7B4C]" />
              <div className="flex-1 bg-[#1a0c0e]" />
            </div>
          </div>

          {/* Reto 2 */}
          <div className="w-full p-2 bg-[#0e0506] border border-[#9E2A2B]/40">
            <div className="flex justify-between items-center text-[9.5px]">
              <span className="text-[#FFFDF2] font-bold truncate">
                ✦ 5 victorias en Minijuegos
              </span>
              <div className="flex items-center gap-1 font-press-start text-[7.5px] shrink-0">
                <span className="text-[#9E2A2B]">4/5</span>
                <span className="text-[#FFFDF2]">+80 CACAO</span>
              </div>
            </div>
            <div className="w-full h-2 bg-[#1a0c0e] mt-1.5 p-0.5 flex gap-1">
              <div className="flex-1 bg-[#9E2A2B]" />
              <div className="flex-1 bg-[#9E2A2B]" />
              <div className="flex-1 bg-[#9E2A2B]" />
              <div className="flex-1 bg-[#9E2A2B]" />
              <div className="flex-1 bg-[#1a0c0e]" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 2: SENDA SAGRADA (HERO CARD) ── */}
      <div className="w-full bg-[#180a0c] border-2 border-[#9E2A2B] p-3.5 rounded-[2px] [box-shadow:3px_3px_0px_#000,_inset_1.5px_1.5px_0px_#ffffff15] relative overflow-hidden">
        {/* Header */}
        <div className="w-full flex justify-between items-center pb-2 border-b border-[#3d181b]">
          <div className="flex items-center gap-1.5">
            <span className="bg-[#9E2A2B] text-[#FFFDF2] font-press-start text-[8px] px-2 py-0.5 border border-[#FFFDF2]/30">
              MODO HISTORIA
            </span>
            <span className="bg-[#0e0506] text-[#2A7B4C] font-press-start text-[8px] px-1.5 py-0.5 border border-[#2A7B4C]/40">
              5 NIVELES
            </span>
          </div>
          <span className="text-[9px] text-[#2A7B4C] font-bold">
            REGIÓN PALENQUE
          </span>
        </div>

        {/* Content */}
        <div className="w-full flex items-center gap-3 my-3">
          <div className="w-14 h-14 shrink-0 bg-[#0e0506] border-2 border-[#9E2A2B] flex items-center justify-center text-2xl [box-shadow:2px_2px_0px_#000]">
            🏛️
          </div>
          <div className="flex-1 flex flex-col justify-start">
            <h3 className="text-[13px]/[18px] text-[#FFFDF2] font-press-start tracking-tight">
              SENDA SAGRADA
            </h3>
            <p className="text-[10.5px]/[15px] text-[#e0d6c4] font-['Space_Mono',monospace] mt-1">
              Recorre el camino ceremonial con los 4 minijuegos y enfrenta al jefe Pakal.
            </p>
          </div>
        </div>

        {/* Button */}
        <button
          type="button"
          onClick={onOpenSendero}
          className="w-full py-3 bg-[#9E2A2B] hover:bg-[#b53032] text-[#FFFDF2] font-press-start text-[10px] tracking-wider flex items-center justify-center gap-2 border-2 border-black [box-shadow:2px_2px_0px_#000,_inset_1.5px_1.5px_0px_#ffffff44] cursor-pointer active:translate-y-0.5 transition"
        >
          <Compass className="w-4 h-4" />
          <span>CONTINUAR LA SENDA ▶</span>
        </button>
      </div>

      {/* ── Section 3: MINIJUEGOS & CÓDICE (TOTALMENTE REDISEÑADOS, AMPLIOS Y VISIBLES) ── */}
      <div className="w-full flex flex-col gap-3">
        {/* ── CARD: SALA DE MINIJUEGOS ── */}
        <div className="w-full bg-[#0d1c13] border-2 border-[#2A7B4C] p-3.5 rounded-[2px] [box-shadow:3px_3px_0px_#000,_inset_1.5px_1.5px_0px_#ffffff15] flex flex-col gap-2.5">
          <div className="flex justify-between items-center">
            <span className="bg-[#2A7B4C] text-[#FFFDF2] font-press-start text-[8px] px-2 py-0.5 border border-[#FFFDF2]/30">
              5 CARTUCHOS SNES
            </span>
            <span className="text-[8px] font-press-start text-[#86efac]">
              SNES 32-BIT
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-13 h-13 shrink-0 bg-[#06140c] border-2 border-[#2A7B4C] flex items-center justify-center text-2xl [box-shadow:2px_2px_0px_#000]">
              🕹️
            </div>
            <div className="flex-1 flex flex-col">
              <h4 className="text-[12px] text-[#FFFDF2] font-press-start tracking-tight">
                SALA DE MAQUINITAS
              </h4>
              <p className="text-[10px]/[15px] text-[#d1fae5] font-['Space_Mono',monospace] mt-1">
                Kukulkán, Tetris Azteca, Balanza de Jade, Máscaras Gemelas y El Cero.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenMinigames}
            className="w-full py-2.5 bg-[#2A7B4C] hover:bg-[#34985e] text-[#FFFDF2] font-press-start text-[9.5px] tracking-wider flex items-center justify-center gap-2 border-2 border-black [box-shadow:2px_2px_0px_#000,_inset_1.5px_1.5px_0px_#ffffff44] cursor-pointer active:translate-y-0.5 transition"
          >
            <Gamepad2 className="w-4 h-4" />
            <span>ABRIR SALA DE MINIJUEGOS ▶</span>
          </button>
        </div>

        {/* ── CARD: CÓDICE REAL DE LOS SABIOS ── */}
        <div className="w-full bg-[#180a0c] border-2 border-[#9E2A2B] p-3.5 rounded-[2px] [box-shadow:3px_3px_0px_#000,_inset_1.5px_1.5px_0px_#ffffff15] flex flex-col gap-2.5">
          <div className="flex justify-between items-center">
            <span className="bg-[#9E2A2B] text-[#FFFDF2] font-press-start text-[8px] px-2 py-0.5 border border-[#FFFDF2]/30">
              ENCICLOPEDIA & CALCULADORA
            </span>
            <span className="text-[8px] font-press-start text-[#fca5a5]">
              SABIDURÍA
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-13 h-13 shrink-0 bg-[#0e0506] border-2 border-[#9E2A2B] flex items-center justify-center text-2xl [box-shadow:2px_2px_0px_#000]">
              📜
            </div>
            <div className="flex-1 flex flex-col">
              <h4 className="text-[12px] text-[#FFFDF2] font-press-start tracking-tight">
                EL CÓDICE REAL
              </h4>
              <p className="text-[10px]/[15px] text-[#ffe4e6] font-['Space_Mono',monospace] mt-1">
                Pergaminos de aritmética, geometría, astronomía y Tablilla Vigesimal interactiva.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenCodex}
            className="w-full py-2.5 bg-[#9E2A2B] hover:bg-[#b53032] text-[#FFFDF2] font-press-start text-[9.5px] tracking-wider flex items-center justify-center gap-2 border-2 border-black [box-shadow:2px_2px_0px_#000,_inset_1.5px_1.5px_0px_#ffffff44] cursor-pointer active:translate-y-0.5 transition"
          >
            <BookOpen className="w-4 h-4" />
            <span>EXPLORAR EL CÓDICE ▶</span>
          </button>
        </div>
      </div>
    </div>
  );
};

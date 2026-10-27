import React, { useState, useEffect } from 'react';
import { CodexEntry } from '../types';
import { api } from '../api';
import { Search, Lock, Unlock, Calculator, BookOpen, ArrowLeft, ChevronRight, Sparkles, BookMarked, X } from 'lucide-react';

interface CodexViewProps {
  onBackToFeed?: () => void;
}

type CodexTab = 'scrolls' | 'calculator';

export const CodexView: React.FC<CodexViewProps> = ({ onBackToFeed }) => {
  const [activeTab, setActiveTab] = useState<CodexTab>('scrolls');
  const [entries, setEntries] = useState<CodexEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<CodexEntry | null>(null);
  const [topicFilter, setTopicFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Mayan Calculator State
  const [decimalNumber, setDecimalNumber] = useState<number>(17);

  const loadEntries = async () => {
    try {
      setLoading(true);
      const data = await api.getCodexEntries(topicFilter || undefined, searchQuery || undefined);
      setEntries(data);
    } catch (err) {
      console.error('Error cargando códice:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEntries();
  }, [topicFilter, searchQuery]);

  const handleSelectEntry = async (entry: CodexEntry) => {
    try {
      const detail = await api.getCodexEntry(entry.id);
      setSelectedEntry(detail);
    } catch {
      setSelectedEntry(entry);
    }
  };

  // Maya Numeral Renderer (Base 20 positional system up to 399)
  const renderMayaLevel = (value: number) => {
    if (value === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-2">
          {/* Concha maya estilizada (0) */}
          <svg viewBox="0 0 40 28" className="w-12 h-8 [image-rendering:pixelated]" shapeRendering="crispEdges">
            <rect x="6" y="2" width="28" height="24" fill="#000000" />
            <rect x="2" y="6" width="36" height="16" fill="#000000" />
            <rect x="8" y="4" width="24" height="20" fill="#FFFDF2" />
            <rect x="4" y="8" width="32" height="12" fill="#FFFDF2" />
            <rect x="8" y="4" width="24" height="3" fill="#ffffff" />
            <rect x="8" y="21" width="24" height="3" fill="#c7bca7" />
            {/* Ribs */}
            <rect x="12" y="7" width="2" height="14" fill="#9E2A2B" />
            <rect x="20" y="7" width="2" height="14" fill="#9E2A2B" />
            <rect x="28" y="7" width="2" height="14" fill="#9E2A2B" />
            {/* Core Jade Jewel */}
            <rect x="18" y="11" width="5" height="5" fill="#2A7B4C" />
          </svg>
          <span className="font-silkscreen text-[9px] text-[#2A7B4C] font-bold mt-1">0 (CONCHA SAGRADA)</span>
        </div>
      );
    }

    const bars = Math.floor(value / 5);
    const dots = value % 5;

    return (
      <div className="flex flex-col items-center gap-2 py-1.5 w-full">
        {/* Dots (puntos = 1 en Jade #2A7B4C) */}
        {dots > 0 && (
          <div className="flex gap-2.5 justify-center items-center">
            {Array.from({ length: dots }).map((_, i) => (
              <div
                key={i}
                className="w-4 h-4 bg-[#2A7B4C] border-2 border-black [box-shadow:2px_2px_0px_#000,_inset_1px_1px_0px_#86efac] rounded-xs"
                title="Punto (1)"
              />
            ))}
          </div>
        )}

        {/* Bars (barras = 5 en Rojo Carmesí #9E2A2B) */}
        {Array.from({ length: bars }).map((_, i) => (
          <div
            key={i}
            className="w-28 h-3.5 bg-[#9E2A2B] border-2 border-black [box-shadow:2px_2px_0px_#000,_inset_1.5px_1.5px_0px_#fca5a5] rounded-xs"
            title="Barra (5)"
          />
        ))}
      </div>
    );
  };

  const level20 = Math.floor(decimalNumber / 20); // Veintenas
  const level1 = decimalNumber % 20; // Unidades

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
          <span className="font-press-start text-[8.5px] text-[#2A7B4C] bg-[#070203] px-2.5 py-1 border border-[#2A7B4C]/60 [box-shadow:1px_1px_0px_#000]">
            BIBLIOTECA MAYA
          </span>
        </div>
      )}

      {/* Header Banner */}
      <div className="w-full bg-[#180a0c] border-2 border-[#9E2A2B] p-3.5 mb-3 [box-shadow:3px_3px_0px_#000,_inset_1.5px_1.5px_0px_#ffffff15]">
        <div className="flex items-center gap-2 mb-1">
          <BookMarked className="w-4 h-4 text-[#FFFDF2]" />
          <h2 className="font-press-start text-[11px] text-[#FFFDF2] tracking-tight">
            CÓDICE DE LOS SABIOS
          </h2>
        </div>
        <p className="font-['Space_Mono',monospace] text-[10.5px]/[15px] text-[#e0d6c4]">
          Biblioteca de conocimientos ancestrales. Aritmética vigesimal, astronomía, pirámides y glifos sagrados.
        </p>
      </div>

      {/* Segmented Tab Switcher */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button
          type="button"
          onClick={() => {
            setActiveTab('scrolls');
            setSelectedEntry(null);
          }}
          className={`flex items-center justify-center gap-1.5 py-2.5 px-2 border-2 text-[9px] font-press-start cursor-pointer transition ${
            activeTab === 'scrolls'
              ? 'bg-[#9E2A2B] text-[#FFFDF2] border-black [box-shadow:2px_2px_0px_#000,_inset_1.5px_1.5px_0px_#ffffff44]'
              : 'bg-[#180a0c] text-[#a89b88] hover:text-[#FFFDF2] border-[#381518] [box-shadow:1px_1px_0px_#000]'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>PERGAMINOS</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('calculator')}
          className={`flex items-center justify-center gap-1.5 py-2.5 px-2 border-2 text-[9px] font-press-start cursor-pointer transition ${
            activeTab === 'calculator'
              ? 'bg-[#2A7B4C] text-[#FFFDF2] border-black [box-shadow:2px_2px_0px_#000,_inset_1.5px_1.5px_0px_#ffffff44]'
              : 'bg-[#180a0c] text-[#a89b88] hover:text-[#FFFDF2] border-[#381518] [box-shadow:1px_1px_0px_#000]'
          }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>CALCULADORA</span>
        </button>
      </div>

      {/* TAB 1: PERGAMINOS (LISTA DE ENTRADAS & LECTOR) */}
      {activeTab === 'scrolls' && (
        <>
          {/* Lector Expandido si se seleccionó un pergamino */}
          {selectedEntry ? (
            <div className="w-full flex flex-col bg-[#180a0c] border-2 border-[#9E2A2B] [box-shadow:3px_3px_0px_#000,_inset_1.5px_1.5px_0px_#ffffff15] p-4 space-y-4">
              <button
                type="button"
                onClick={() => setSelectedEntry(null)}
                className="flex items-center gap-2 text-[9px] font-press-start text-[#2A7B4C] hover:text-[#86efac] cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>← VOLVER AL ÍNDICE DE PERGAMINOS</span>
              </button>

              <div className="border-b border-[#3d181b] pb-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="px-2 py-0.5 bg-[#9E2A2B] text-[#FFFDF2] text-[8px] font-press-start border border-[#FFFDF2]/30">
                    {selectedEntry.topic.toUpperCase()}
                  </span>
                  {selectedEntry.unlocked ? (
                    <span className="flex items-center gap-1 text-[8px] font-press-start text-[#86efac]">
                      <Unlock className="w-3 h-3 text-[#2A7B4C]" /> DESBLOQUEADO
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[8px] font-press-start text-[#fca5a5]">
                      <Lock className="w-3 h-3 text-[#9E2A2B]" /> BLOQUEADO
                    </span>
                  )}
                </div>
                <h3 className="font-press-start text-[13px] text-[#FFFDF2] mt-2 leading-relaxed">
                  {selectedEntry.title}
                </h3>
              </div>

              {/* Glifo Emblem */}
              <div className="w-full py-4 bg-[#0e0506] border-2 border-[#9E2A2B] flex flex-col items-center justify-center [box-shadow:inset_2px_2px_0px_#000]">
                <div className="w-16 h-16 bg-[#180a0c] border-2 border-[#2A7B4C] flex items-center justify-center text-3xl [box-shadow:2px_2px_0px_#000]">
                  {selectedEntry.topic === 'calendario'
                    ? '☀️'
                    : selectedEntry.topic === 'aritmetica'
                    ? '🐚'
                    : selectedEntry.topic === 'geometria'
                    ? '📐'
                    : selectedEntry.topic === 'historia'
                    ? '👑'
                    : '📜'}
                </div>
                <span className="font-silkscreen text-[9px] text-[#2A7B4C] font-bold mt-2">
                  GLIFO SAGRADO DE {selectedEntry.topic.toUpperCase()}
                </span>
              </div>

              {/* Contenido Completo de Lectura */}
              <div className="space-y-3 font-['Space_Mono',monospace] text-[12px]/[20px] text-[#FFFDF2]">
                <p className="bg-[#0e0506] p-3 border-l-4 border-[#2A7B4C]">
                  {selectedEntry.content}
                </p>

                <div className="bg-[#0d1c13] border border-[#2A7B4C] p-3 [box-shadow:2px_2px_0px_#000]">
                  <div className="flex items-center gap-1.5 mb-1 text-[9px] font-press-start text-[#86efac]">
                    <Sparkles className="w-3.5 h-3.5 text-[#2A7B4C]" />
                    <span>ENSEÑANZA CLAVE</span>
                  </div>
                  <p className="text-[11px]/[17px] text-[#dcfce7]">
                    Los astrónomos y sacerdotes aplicaban estos cálculos para predecir ciclos celestes y orientar las pirámides con los solsticios.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEntry(null)}
                className="w-full py-2.5 bg-[#9E2A2B] hover:bg-[#b53032] text-[#FFFDF2] font-press-start text-[9.5px] border-2 border-black [box-shadow:2px_2px_0px_#000] cursor-pointer transition active:translate-y-0.5"
              >
                CERRAR LECTURA Y VOLVER AL ÍNDICE
              </button>
            </div>
          ) : (
            /* Catálogo Principal de Pergaminos */
            <div className="space-y-3">
              {/* Buscador */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#a89b88] absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Buscar conocimiento ancestral..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#180a0c] border border-[#9E2A2B]/70 px-3 py-2 pl-9 font-silkscreen text-[11px] text-[#FFFDF2] outline-none focus:border-[#2A7B4C] [box-shadow:inset_1px_1px_0px_#000]"
                />
              </div>

              {/* Filtros de Tema */}
              <div className="w-full flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {['', 'aritmetica', 'geometria', 'calendario', 'glifos', 'historia'].map((top) => (
                  <button
                    key={top}
                    onClick={() => setTopicFilter(top)}
                    className={`px-2.5 py-1 text-[8px] font-press-start whitespace-nowrap cursor-pointer transition border ${
                      topicFilter === top
                        ? 'bg-[#9E2A2B] text-[#FFFDF2] border-black [box-shadow:1px_1px_0px_#000]'
                        : 'bg-[#180a0c] text-[#a89b88] hover:text-[#FFFDF2] border-[#381518]'
                    }`}
                  >
                    {top === '' ? 'TODOS' : top.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Lista de Tarjetas de Pergaminos */}
              <div className="space-y-2.5">
                {loading ? (
                  <div className="text-center py-8 text-[10px] font-press-start text-[#2A7B4C]">
                    DESENROLLANDO CÓDICES...
                  </div>
                ) : entries.length === 0 ? (
                  <div className="text-center py-8 text-[10px] font-press-start text-[#a89b88] bg-[#180a0c] border border-[#9E2A2B]/60 p-4">
                    NO SE ENCONTRARON PERGAMINOS CON ESE CRITERIO.
                  </div>
                ) : (
                  entries.map((entry) => (
                    <div
                      key={entry.id}
                      onClick={() => handleSelectEntry(entry)}
                      className="w-full bg-[#180a0c] hover:bg-[#261013] border-2 border-[#9E2A2B] p-3.5 [box-shadow:2px_2px_0px_#000] cursor-pointer transition flex flex-col gap-2 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 bg-[#0e0506] border border-[#2A7B4C] text-[7.5px] font-press-start text-[#2A7B4C]">
                          {entry.topic.toUpperCase()}
                        </span>
                        {entry.unlocked ? (
                          <div className="flex items-center gap-1 text-[7.5px] font-press-start text-[#86efac]">
                            <Unlock className="w-3 h-3 text-[#2A7B4C]" /> ABIERTO
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-[7.5px] font-press-start text-[#fca5a5]">
                            <Lock className="w-3 h-3 text-[#9E2A2B]" /> CERRADO
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className="font-press-start text-[11.5px] text-[#FFFDF2] group-hover:text-[#2A7B4C] transition">
                          {entry.title}
                        </h4>
                        <p className="font-['Space_Mono',monospace] text-[11px]/[16px] text-[#e0d6c4] mt-1 line-clamp-2">
                          {entry.summary || entry.content}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-1.5 border-t border-[#3d181b]">
                        <span className="text-[8px] font-press-start text-[#2A7B4C]">
                          LEER PERGAMINO COMPLETO
                        </span>
                        <ChevronRight className="w-4 h-4 text-[#FFFDF2] group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* TAB 2: TABLILLA VIGESIMAL (CALCULADORA MAYA) */}
      {activeTab === 'calculator' && (
        <div className="w-full flex flex-col gap-4">
          {/* Panel de entrada y saltos */}
          <div className="w-full bg-[#180a0c] border-2 border-[#9E2A2B] p-3.5 [box-shadow:3px_3px_0px_#000,_inset_1.5px_1.5px_0px_#ffffff15]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-press-start text-[#FFFDF2]">
                NÚMERO ARÁBIGO (0 - 399)
              </span>
              <span className="text-[8px] font-press-start text-[#2A7B4C]">
                BASE 20
              </span>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <input
                type="number"
                min={0}
                max={399}
                value={decimalNumber}
                onChange={(e) => setDecimalNumber(Math.min(399, Math.max(0, Number(e.target.value) || 0)))}
                className="flex-1 bg-[#0e0506] border-2 border-[#2A7B4C] px-3 py-2.5 font-press-start text-base text-[#FFFDF2] text-center outline-none [box-shadow:inset_2px_2px_0px_#000]"
              />
            </div>

            <div className="grid grid-cols-6 gap-1 mb-3">
              {[
                { label: '-20', delta: -20 },
                { label: '-5', delta: -5 },
                { label: '-1', delta: -1 },
                { label: '+1', delta: 1 },
                { label: '+5', delta: 5 },
                { label: '+20', delta: 20 },
              ].map((step) => (
                <button
                  key={step.label}
                  type="button"
                  onClick={() => setDecimalNumber((prev) => Math.min(399, Math.max(0, prev + step.delta)))}
                  className="py-1.5 bg-[#261013] hover:bg-[#3d181b] text-[8px] font-press-start text-[#FFFDF2] border border-[#9E2A2B]/60 [box-shadow:1px_1px_0px_#000] cursor-pointer active:translate-y-0.5"
                >
                  {step.label}
                </button>
              ))}
            </div>

            <div>
              <span className="text-[8px] font-press-start text-[#a89b88] block mb-1.5">
                PREAJUSTES SAGRADOS:
              </span>
              <div className="flex gap-1.5 flex-wrap">
                {[
                  { n: 0, label: '0 (Cero)' },
                  { n: 5, label: '5 (Barra)' },
                  { n: 13, label: '13 (Trecena)' },
                  { n: 20, label: '20 (Veintena)' },
                  { n: 52, label: '52 (Rueda)' },
                  { n: 100, label: '100' },
                  { n: 260, label: '260 (Tzolk\'in)' },
                  { n: 365, label: '365 (Haab)' },
                ].map((preset) => (
                  <button
                    key={preset.n}
                    type="button"
                    onClick={() => setDecimalNumber(preset.n)}
                    className={`px-2 py-1 text-[7.5px] font-press-start border cursor-pointer transition ${
                      decimalNumber === preset.n
                        ? 'bg-[#2A7B4C] text-[#FFFDF2] border-black font-bold [box-shadow:1px_1px_0px_#000]'
                        : 'bg-[#0e0506] text-[#FFFDF2] border-[#9E2A2B]/60 hover:bg-[#1f0a0d]'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* TABLILLA CEREMONIAL */}
          <div className="w-full bg-[#0e0506] border-2 border-[#2A7B4C] p-4 [box-shadow:3px_3px_0px_#000] flex flex-col items-center">
            <div className="w-full flex items-center justify-between border-b-2 border-[#3d181b] pb-2 mb-3">
              <span className="font-press-start text-[9px] text-[#2A7B4C]">
                TABLILLA CEREMONIAL
              </span>
              <span className="font-press-start text-[8px] text-[#FFFDF2]">
                VALOR TOTAL: {decimalNumber}
              </span>
            </div>

            {level20 > 0 && (
              <div className="w-full flex flex-col items-center border-b-2 border-dashed border-[#3d181b] pb-3 mb-3">
                <span className="font-press-start text-[8px] text-[#FFFDF2] mb-1">
                  POSICIÓN 2 (VEINTENAS × 20)
                </span>
                <span className="font-['Space_Mono',monospace] text-[9.5px] text-[#2A7B4C] font-bold mb-1">
                  {level20} × 20 = {level20 * 20}
                </span>
                {renderMayaLevel(level20)}
              </div>
            )}

            <div className="w-full flex flex-col items-center">
              <span className="font-press-start text-[8px] text-[#FFFDF2] mb-1">
                {level20 > 0 ? 'POSICIÓN 1 (UNIDADES × 1)' : 'POSICIÓN 1 (UNIDADES)'}
              </span>
              <span className="font-['Space_Mono',monospace] text-[9.5px] text-[#2A7B4C] font-bold mb-1">
                {level1} × 1 = {level1}
              </span>
              {renderMayaLevel(level1)}
            </div>
          </div>

          {/* Desglose Matemático */}
          <div className="w-full bg-[#180a0c] border border-[#9E2A2B] p-3.5 [box-shadow:2px_2px_0px_#000] space-y-2">
            <span className="font-press-start text-[8.5px] text-[#FFFDF2] block">
              DESGLOSE MATEMÁTICO:
            </span>
            <div className="font-['Space_Mono',monospace] text-[11px]/[18px] text-[#FFFDF2] space-y-1">
              <div className="flex justify-between border-b border-[#3d181b] pb-1">
                <span>Nivel 2 (×20):</span>
                <span className="text-[#2A7B4C] font-bold">{level20} × 20 = {level20 * 20}</span>
              </div>
              <div className="flex justify-between border-b border-[#3d181b] pb-1">
                <span>Nivel 1 (×1):</span>
                <span className="text-[#9E2A2B] font-bold">{level1} × 1 = {level1}</span>
              </div>
              <div className="flex justify-between pt-1 text-[#FFFDF2] font-bold">
                <span>Suma total:</span>
                <span className="text-[#2A7B4C]">{level20 * 20} + {level1} = {decimalNumber}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

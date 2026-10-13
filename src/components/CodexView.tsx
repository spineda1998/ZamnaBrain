import React, { useState, useEffect } from 'react';
import { CodexEntry } from '../types';
import { api } from '../api';
import { BookOpen, Search, Lock, Unlock, Calculator, Sparkles } from 'lucide-react';

export const CodexView: React.FC = () => {
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
      if (data.length > 0 && !selectedEntry) {
        // Load details for first entry
        const detail = await api.getCodexEntry(data[0].id);
        setSelectedEntry(detail);
      }
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
          <span className="text-3xl" title="Concha maya (0)">🐚</span>
          <span className="font-silkscreen text-[10px] text-[#9ca3af]">Cero (Concha)</span>
        </div>
      );
    }

    const bars = Math.floor(value / 5);
    const dots = value % 5;

    return (
      <div className="flex flex-col items-center gap-1.5 py-1">
        {/* Dots (puntos = 1) */}
        {dots > 0 && (
          <div className="flex gap-2 justify-center">
            {Array.from({ length: dots }).map((_, i) => (
              <div
                key={i}
                className="w-3.5 h-3.5 rounded-full bg-[#fbbf24] border-2 border-[#b45309] shadow-sm"
                title="Punto (1)"
              />
            ))}
          </div>
        )}

        {/* Bars (barras = 5) */}
        {Array.from({ length: bars }).map((_, i) => (
          <div
            key={i}
            className="w-20 h-2.5 bg-[#d99b26] border border-[#78350f] rounded-xs shadow-sm"
            title="Barra (5)"
          />
        ))}
      </div>
    );
  };

  const level20 = Math.floor(decimalNumber / 20); // Veintenas
  const level1 = decimalNumber % 20; // Unidades

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="bg-[#211d17] border-4 border-[#a62b2b] p-6 rounded-lg text-center shadow-xl">
        <h2 className="font-press-start text-base sm:text-lg text-[#fbbf24]">
          EL CÓDICE REAL DE LOS SABIOS
        </h2>
        <p className="font-silkscreen text-xs text-[#d1d5db] mt-2 max-w-xl mx-auto">
          Biblioteca de conocimientos ancestrales. Descubre los secretos de la aritmética vigesimal, astronomía, pirámides y escritura jeroglífica.
        </p>
      </div>

      {/* Interactive Mayan Numeral Converter Widget */}
      <div className="bg-[#1c1c1c] border-2 border-[#d99b26] p-5 rounded-lg shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <Calculator className="w-5 h-5 text-[#fbbf24]" />
          <h3 className="font-press-start text-xs text-[#fbbf24]">
            CONVERSOR VIGESIMAL MAYA INTERACTIVO
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Controls */}
          <div className="space-y-3">
            <label className="font-silkscreen text-xs text-[#9ca3af] block">
              Ingresa un número arábigo (0 - 399):
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={0}
                max={399}
                value={decimalNumber}
                onChange={(e) => setDecimalNumber(Math.min(399, Math.max(0, Number(e.target.value) || 0)))}
                className="w-32 bg-[#111] border-2 border-[#d99b26] px-3 py-2 rounded font-press-start text-base text-[#fbbf24] text-center outline-none"
              />
              <div className="flex gap-1.5 flex-wrap">
                {[0, 5, 13, 20, 52, 100, 260].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setDecimalNumber(preset)}
                    className="px-2.5 py-1 bg-[#2b220e] hover:bg-[#3d3014] text-[#fbbf24] border border-[#d99b26] rounded font-silkscreen text-xs"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-[#161616] rounded border border-[#333] font-silkscreen text-xs text-[#d1d5db] space-y-1">
              <div>
                <strong>Desglose matemático:</strong>
              </div>
              <div>
                • Nivel superior (×20): <strong>{level20}</strong> × 20 = {level20 * 20}
              </div>
              <div>
                • Nivel inferior (×1): <strong>{level1}</strong> × 1 = {level1}
              </div>
              <div className="text-[#fbbf24]">
                Total: {level20 * 20} + {level1} = <strong>{decimalNumber}</strong>
              </div>
            </div>
          </div>

          {/* Maya Representation Tablet */}
          <div className="bg-[#121212] border-2 border-[#a62b2b] p-4 rounded-lg flex flex-col items-center justify-center min-h-[190px] relative">
            <div className="text-[10px] font-press-start text-[#a62b2b] absolute top-2 left-3">
              TABLILLA CEREMONIAL
            </div>

            {/* Level 2 (20s) */}
            {level20 > 0 && (
              <div className="w-full flex flex-col items-center border-b-2 border-dashed border-[#444] pb-3 mb-2">
                <span className="font-silkscreen text-[9px] text-[#fbbf24] mb-1">
                  POSICIÓN 2 (VEINTENAS × 20)
                </span>
                {renderMayaLevel(level20)}
              </div>
            )}

            {/* Level 1 (1s) */}
            <div className="w-full flex flex-col items-center">
              <span className="font-silkscreen text-[9px] text-[#22c55e] mb-1">
                {level20 > 0 ? 'POSICIÓN 1 (UNIDADES × 1)' : 'VALOR RITUAL'}
              </span>
              {renderMayaLevel(level1)}
            </div>
          </div>
        </div>
      </div>

      {/* Codex Encyclopedia Entries */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Entries List */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#888] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar conocimiento..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1c1c1c] border border-[#3a3a3a] rounded px-3 py-2 pl-9 font-silkscreen text-xs text-[#f4efe6] outline-none focus:border-[#d99b26]"
            />
          </div>

          <div className="flex gap-1 overflow-x-auto pb-1">
            {['', 'aritmetica', 'geometria', 'calendario', 'glifos', 'historia'].map((top) => (
              <button
                key={top}
                onClick={() => setTopicFilter(top)}
                className={`px-2.5 py-1 rounded font-silkscreen text-[11px] whitespace-nowrap transition ${
                  topicFilter === top
                    ? 'bg-[#a62b2b] text-[#fbbf24] border border-[#d99b26]'
                    : 'bg-[#222] text-[#888] hover:text-[#ddd]'
                }`}
              >
                {top === '' ? 'Todos' : top.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {entries.map((entry) => (
              <div
                key={entry.id}
                onClick={() => handleSelectEntry(entry)}
                className={`p-3 rounded border-2 transition cursor-pointer ${
                  selectedEntry?.id === entry.id
                    ? 'bg-[#31250b] border-[#d99b26]'
                    : 'bg-[#1c1c1c] border-[#333] hover:border-[#555]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-silkscreen text-[10px] text-[#fbbf24] uppercase">
                    {entry.topic}
                  </span>
                  {entry.unlocked ? (
                    <Unlock className="w-3.5 h-3.5 text-[#22c55e]" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-[#777]" />
                  )}
                </div>
                <h4 className="font-press-start text-xs text-[#f4efe6] line-clamp-1">
                  {entry.title}
                </h4>
                <p className="font-silkscreen text-[11px] text-[#9ca3af] line-clamp-2 mt-1">
                  {entry.summary}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Entry Detail Panel */}
        <div className="md:col-span-2 bg-[#1c1c1c] border-2 border-[#444] p-6 rounded-lg flex flex-col justify-between shadow-lg min-h-[360px]">
          {selectedEntry ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#333] pb-3">
                <div>
                  <span className="font-silkscreen text-xs text-[#d99b26] uppercase">
                    TEMA: {selectedEntry.topic}
                  </span>
                  <h3 className="font-press-start text-sm sm:text-base text-[#f4efe6] mt-1">
                    {selectedEntry.title}
                  </h3>
                </div>
                {selectedEntry.unlocked ? (
                  <span className="flex items-center gap-1 font-silkscreen text-xs text-[#22c55e] bg-[#14291c] px-2.5 py-1 rounded border border-[#22c55e]">
                    <Sparkles className="w-3.5 h-3.5" /> Desbloqueado
                  </span>
                ) : (
                  <span className="flex items-center gap-1 font-silkscreen text-xs text-[#777] bg-[#222] px-2.5 py-1 rounded border border-[#444]">
                    <Lock className="w-3.5 h-3.5" /> Se desbloquea en el Sendero
                  </span>
                )}
              </div>

              <div className="p-4 bg-[#141414] rounded border border-[#2c2c2c]">
                <p className="font-silkscreen text-xs text-[#fbbf24] italic mb-2">
                  "{selectedEntry.summary}"
                </p>
                <div className="font-silkscreen text-sm text-[#e5e5e5] leading-relaxed whitespace-pre-line">
                  {selectedEntry.content || selectedEntry.summary}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center font-silkscreen text-sm text-[#777]">
              Selecciona una entrada del códice para examinarla.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

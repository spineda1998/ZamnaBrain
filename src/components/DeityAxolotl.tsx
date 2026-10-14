import React from 'react';

interface DeityAxolotlProps {
  className?: string;
  size?: number;
}

/**
 * Itzamná Brain: Deidad sagrada mesoamericana en pixel art puro.
 * Cerebro sagrado de color rosa místico con penacho de plumas de quetzal,
 * diadema de oro con gema de jade central, ojos arcade expresivos y flotación sutil.
 * Sin fondo circular ni halos (mascota flotante limpia).
 */
export const DeityAxolotl: React.FC<DeityAxolotlProps> = ({
  className = '',
  size = 168,
}) => {
  return (
    <div
      data-pencil-name="Itzamna Brain Sacred Mascot"
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      {/* Floating Pixel Art Sacred Itzamná Brain (Mascota Flotante Limpia) */}
      <div className="relative w-full h-full animate-[float_3.5s_ease-in-out_infinite] flex items-center justify-center">
        <svg
          viewBox="0 0 48 48"
          className="w-full h-full drop-shadow-[0_6px_14px_rgba(0,0,0,0.85)] filter"
          style={{ imageRendering: 'pixelated' }}
        >
          {/* DEFINITIONS FOR JADE & GOLD ACCENTS */}
          <defs>
            <filter id="jadeGlint" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="0.4" floodColor="#34d399" floodOpacity="0.8" />
            </filter>
            <filter id="goldGlint" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="0.4" floodColor="#fabc4c" floodOpacity="0.9" />
            </filter>
          </defs>

          {/* ========================================================= */}
          {/* 1. PENACHO MAYA SAGRADO (QUETZAL PLUMES & GOLD TIPS)      */}
          {/* ========================================================= */}
          
          {/* Pluma Central Alta (Eje celestial) */}
          <rect x="23" y="1" width="2" height="2" fill="#fde047" /> {/* Punta dorada */}
          <rect x="23" y="3" width="2" height="3" fill="#6ee7b7" /> {/* Verde menta luminoso */}
          <rect x="22" y="6" width="4" height="4" fill="#10b981" /> {/* Jade esmeralda */}
          <rect x="23" y="10" width="2" height="3" fill="#047857" /> {/* Tallo jade profundo */}

          {/* Pluma Izquierda Secundaria */}
          <rect x="18" y="3" width="2" height="2" fill="#fde047" />
          <rect x="18" y="5" width="3" height="3" fill="#34d399" />
          <rect x="17" y="8" width="4" height="4" fill="#059669" />
          <rect x="19" y="12" width="2" height="2" fill="#065f46" />

          {/* Pluma Izquierda Exterior */}
          <rect x="13" y="6" width="2" height="2" fill="#fde047" />
          <rect x="14" y="8" width="3" height="3" fill="#10b981" />
          <rect x="15" y="11" width="3" height="3" fill="#047857" />

          {/* Pluma Derecha Secundaria */}
          <rect x="28" y="3" width="2" height="2" fill="#fde047" />
          <rect x="27" y="5" width="3" height="3" fill="#34d399" />
          <rect x="27" y="8" width="4" height="4" fill="#059669" />
          <rect x="27" y="12" width="2" height="2" fill="#065f46" />

          {/* Pluma Derecha Exterior */}
          <rect x="33" y="6" width="2" height="2" fill="#fde047" />
          <rect x="31" y="8" width="3" height="3" fill="#10b981" />
          <rect x="30" y="11" width="3" height="3" fill="#047857" />

          {/* ========================================================= */}
          {/* 2. CEREBRO SAGRADO (BASE, LÓBULOS Y CIRCUNVOLUCIONES)      */}
          {/* ========================================================= */}

          {/* Contorno Exterior Pixel Art del Cerebro */}
          {/* Lóbulo superior izquierdo */}
          <rect x="11" y="15" width="6" height="2" fill="#3b0764" />
          <rect x="9" y="17" width="2" height="4" fill="#3b0764" />
          <rect x="7" y="21" width="2" height="6" fill="#3b0764" />
          <rect x="8" y="27" width="2" height="7" fill="#3b0764" />
          <rect x="10" y="34" width="3" height="4" fill="#3b0764" />
          <rect x="13" y="38" width="6" height="2" fill="#3b0764" />
          
          {/* Base inferior del cerebro */}
          <rect x="19" y="39" width="10" height="2" fill="#3b0764" />

          {/* Lóbulo derecho */}
          <rect x="29" y="38" width="6" height="2" fill="#3b0764" />
          <rect x="35" y="34" width="3" height="4" fill="#3b0764" />
          <rect x="38" y="27" width="2" height="7" fill="#3b0764" />
          <rect x="39" y="21" width="2" height="6" fill="#3b0764" />
          <rect x="37" y="17" width="2" height="4" fill="#3b0764" />
          <rect x="31" y="15" width="6" height="2" fill="#3b0764" />

          {/* Relleno Base: Rosa Místico */}
          <rect x="11" y="17" width="26" height="21" fill="#f472b6" />
          <rect x="9" y="21" width="30" height="13" fill="#f472b6" />
          <rect x="13" y="35" width="22" height="4" fill="#f472b6" />

          {/* Luces / Highlights en la coronilla de los lóbulos (Rosa Claro) */}
          <rect x="12" y="17" width="5" height="2" fill="#fbcfe8" />
          <rect x="10" y="19" width="4" height="2" fill="#fbcfe8" />
          <rect x="31" y="17" width="5" height="2" fill="#fbcfe8" />
          <rect x="34" y="19" width="4" height="2" fill="#fbcfe8" />
          <rect x="8" y="23" width="2" height="4" fill="#fbcfe8" />
          <rect x="38" y="23" width="2" height="4" fill="#fbcfe8" />

          {/* Sombras y Pliegues del Cerebro (Magenta & Fucsia Profundo) */}
          {/* Hendidura Interhemisférica Central Superior */}
          <rect x="23" y="15" width="2" height="5" fill="#9d174d" />
          <rect x="22" y="19" width="4" height="2" fill="#be185d" />

          {/* Pliegues de circunvoluciones (Lóbulo Izquierdo) */}
          <path d="M12 21 H16 V23 H14 V26 H12 Z" fill="#db2777" />
          <path d="M10 27 H14 V29 H11 V32 H9 Z" fill="#be185d" />
          <rect x="14" y="24" width="4" height="2" fill="#be185d" />

          {/* Pliegues de circunvoluciones (Lóbulo Derecho) */}
          <path d="M32 21 H36 V26 H34 V23 H32 Z" fill="#db2777" />
          <path d="M34 27 H38 V32 H36 V29 H34 Z" fill="#be185d" />
          <rect x="30" y="24" width="4" height="2" fill="#be185d" />

          {/* Sombra inferior del cerebro */}
          <rect x="14" y="37" width="20" height="2" fill="#9d174d" />
          <rect x="11" y="33" width="3" height="3" fill="#9d174d" />
          <rect x="34" y="33" width="3" height="3" fill="#9d174d" />

          {/* ========================================================= */}
          {/* 3. DIADEMA DE ORO MAYA & GEMA DE JADE CENTRAL             */}
          {/* ========================================================= */}
          {/* Base de la corona dorada */}
          <rect x="16" y="13" width="16" height="3" fill="#b45309" />
          <rect x="16" y="14" width="16" height="2" fill="#f59e0b" />
          <rect x="17" y="13" width="14" height="1" fill="#fef08a" />
          
          {/* Greca / Dientes dorados rituales */}
          <rect x="17" y="12" width="2" height="2" fill="#fbbf24" />
          <rect x="21" y="12" width="2" height="2" fill="#fbbf24" />
          <rect x="25" y="12" width="2" height="2" fill="#fbbf24" />
          <rect x="29" y="12" width="2" height="2" fill="#fbbf24" />

          {/* Medallón Central de Jade Sagrado */}
          <rect x="22" y="12" width="4" height="4" fill="#065f46" />
          <rect x="22" y="13" width="4" height="2" fill="#10b981" filter="url(#jadeGlint)" />
          <rect x="23" y="13" width="2" height="2" fill="#a7f3d0" />

          {/* Orejeras rituales de oro y jade a los costados */}
          <rect x="7" y="27" width="2" height="3" fill="#f59e0b" />
          <rect x="8" y="28" width="1" height="1" fill="#34d399" />
          <rect x="39" y="27" width="2" height="3" fill="#f59e0b" />
          <rect x="39" y="28" width="1" height="1" fill="#34d399" />

          {/* ========================================================= */}
          {/* 4. ROSTRO EXPRESIVO ARCADE (OJOS, RUBOR, SONRISA)         */}
          {/* ========================================================= */}

          {/* Ojo Izquierdo Pixel Art Grande */}
          <rect x="16" y="24" width="4" height="5" rx="1" fill="#180424" />
          {/* Brillo especular superior blanco */}
          <rect x="16" y="24" width="2" height="2" fill="#ffffff" />
          {/* Destello cian arcade inferior */}
          <rect x="18" y="27" width="2" height="2" fill="#38bdf8" />

          {/* Ojo Derecho Pixel Art Grande */}
          <rect x="28" y="24" width="4" height="5" rx="1" fill="#180424" />
          {/* Brillo especular superior blanco */}
          <rect x="28" y="24" width="2" height="2" fill="#ffffff" />
          {/* Destello cian arcade inferior */}
          <rect x="30" y="27" width="2" height="2" fill="#38bdf8" />

          {/* Rubor en Mejillas (Rosado Brillante Suave) */}
          <rect x="13" y="29" width="3" height="2" fill="#fb7185" opacity="0.9" />
          <rect x="32" y="29" width="3" height="2" fill="#fb7185" opacity="0.9" />

          {/* Sonrisa Alegre Mística */}
          <rect x="22" y="31" width="1" height="1" fill="#9d174d" />
          <rect x="23" y="32" width="2" height="1" fill="#9d174d" />
          <rect x="25" y="31" width="1" height="1" fill="#9d174d" />

          {/* ========================================================= */}
          {/* 5. MANITAS DE CEREBRO DESCANSANDO AL FRENTE               */}
          {/* ========================================================= */}
          {/* Manita Izquierda */}
          <rect x="18" y="35" width="3" height="3" fill="#3b0764" />
          <rect x="18" y="35" width="3" height="2" fill="#f472b6" />
          <rect x="19" y="35" width="2" height="1" fill="#fbcfe8" />

          {/* Manita Derecha */}
          <rect x="27" y="35" width="3" height="3" fill="#3b0764" />
          <rect x="27" y="35" width="3" height="2" fill="#f472b6" />
          <rect x="27" y="35" width="2" height="1" fill="#fbcfe8" />
        </svg>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-8px) rotate(1deg);
          }
        }
      `}</style>
    </div>
  );
};

// Exportamos también con el alias ItzamnaBrain
export const ItzamnaBrain = DeityAxolotl;

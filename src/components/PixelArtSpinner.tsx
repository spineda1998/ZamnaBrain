import React from 'react';

export interface PixelArtSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
  inline?: boolean;
}

/**
 * PixelArtSpinner: Spinner temático ceremonial con la versión miniatura
 * de la deidad sagrada Itzamná Brain con animación sutil de flotación y levitación mística.
 */
export const PixelArtSpinner: React.FC<PixelArtSpinnerProps> = ({
  size = 'md',
  message,
  className = '',
  inline = false,
}) => {
  // Dimensiones para cada escala
  const dimensions = {
    sm: { box: 'w-6 h-6', svgSize: 24, font: 'text-[8px]' },
    md: { box: 'w-12 h-12', svgSize: 48, font: 'text-[10px]' },
    lg: { box: 'w-20 h-20', svgSize: 80, font: 'text-xs' },
  }[size];

  return (
    <div
      className={`flex ${
        inline ? 'flex-row items-center gap-2.5' : 'flex-col items-center justify-center gap-3'
      } ${className} select-none`}
    >
      <div className={`relative ${dimensions.box} shrink-0 flex items-center justify-center`}>
        {/* Itzamná Brain Mini Sprite con levitación flotante suave */}
        <div className="w-full h-full animate-[spinnerFloat_2.4s_ease-in-out_infinite] flex items-center justify-center">
          <svg
            viewBox="0 0 32 32"
            className="w-full h-full drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)] filter"
            style={{ imageRendering: 'pixelated' }}
          >
            {/* DEFINITIONS */}
            <defs>
              <filter id="miniJadeGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0.5" stdDeviation="0.4" floodColor="#34d399" floodOpacity="0.8" />
              </filter>
            </defs>

            {/* PLUMAS DE QUETZAL (MINIATURE) */}
            {/* Pluma central */}
            <rect x="15" y="1" width="2" height="2" fill="#fde047" />
            <rect x="15" y="3" width="2" height="3" fill="#34d399" />
            <rect x="15" y="6" width="2" height="2" fill="#047857" />

            {/* Pluma izquierda */}
            <rect x="11" y="3" width="2" height="2" fill="#fde047" />
            <rect x="12" y="5" width="2" height="3" fill="#10b981" />

            {/* Pluma derecha */}
            <rect x="19" y="3" width="2" height="2" fill="#fde047" />
            <rect x="18" y="5" width="2" height="3" fill="#10b981" />

            {/* CORONA DE ORO Y GEMA DE JADE */}
            <rect x="10" y="7" width="12" height="2" fill="#f59e0b" />
            <rect x="11" y="6" width="10" height="1" fill="#fef08a" />
            <rect x="15" y="6" width="2" height="3" fill="#10b981" filter="url(#miniJadeGlow)" />
            <rect x="15.5" y="6.5" width="1" height="1" fill="#a7f3d0" />

            {/* CEREBRO SAGRADO ROSA (OUTLINE & LOBES) */}
            {/* Contorno oscuro */}
            <rect x="8" y="8" width="3" height="2" fill="#3b0764" />
            <rect x="6" y="10" width="2" height="5" fill="#3b0764" />
            <rect x="7" y="15" width="2" height="6" fill="#3b0764" />
            <rect x="8" y="21" width="4" height="2" fill="#3b0764" />
            <rect x="12" y="22" width="8" height="2" fill="#3b0764" />
            <rect x="20" y="21" width="4" height="2" fill="#3b0764" />
            <rect x="23" y="15" width="2" height="6" fill="#3b0764" />
            <rect x="24" y="10" width="2" height="5" fill="#3b0764" />
            <rect x="21" y="8" width="3" height="2" fill="#3b0764" />

            {/* Relleno Rosa Místico */}
            <rect x="8" y="10" width="16" height="11" fill="#f472b6" />
            <rect x="7" y="12" width="18" height="7" fill="#f472b6" />

            {/* Luces en lóbulos */}
            <rect x="8" y="10" width="3" height="1" fill="#fbcfe8" />
            <rect x="21" y="10" width="3" height="1" fill="#fbcfe8" />
            <rect x="7" y="13" width="1" height="3" fill="#fbcfe8" />
            <rect x="24" y="13" width="1" height="3" fill="#fbcfe8" />

            {/* Surcos y sombras de cerebro */}
            <rect x="15" y="9" width="2" height="3" fill="#9d174d" />
            <rect x="9" y="14" width="3" height="1" fill="#db2777" />
            <rect x="20" y="14" width="3" height="1" fill="#db2777" />
            <rect x="10" y="20" width="12" height="1" fill="#9d174d" />

            {/* OJOS ARCADE PIXEL ART */}
            {/* Ojo izquierdo */}
            <rect x="11" y="14" width="3" height="3" fill="#180424" />
            <rect x="11" y="14" width="1" height="1" fill="#ffffff" />
            <rect x="12" y="16" width="1" height="1" fill="#38bdf8" />

            {/* Ojo derecho */}
            <rect x="18" y="14" width="3" height="3" fill="#180424" />
            <rect x="18" y="14" width="1" height="1" fill="#ffffff" />
            <rect x="19" y="16" width="1" height="1" fill="#38bdf8" />

            {/* Rubor en mejillas */}
            <rect x="9" y="17" width="2" height="1" fill="#fb7185" />
            <rect x="21" y="17" width="2" height="1" fill="#fb7185" />

            {/* Sonrisa */}
            <rect x="15" y="18" width="2" height="1" fill="#9d174d" />

            {/* Manitas descansando */}
            <rect x="12" y="21" width="2" height="1" fill="#fbcfe8" />
            <rect x="18" y="21" width="2" height="1" fill="#fbcfe8" />

            {/* Partícula sutil de jade flotante */}
            <rect x="6" y="7" width="1" height="1" fill="#34d399" className="animate-pulse" />
            <rect x="25" y="8" width="1" height="1" fill="#fde047" className="animate-pulse" />
          </svg>
        </div>
      </div>

      {message && (
        <span
          className={`font-['Press_Start_2P',sans-serif] ${dimensions.font} text-[#fabc4c] tracking-wider text-center animate-pulse drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]`}
        >
          {message}
        </span>
      )}

      <style>{`
        @keyframes spinnerFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-5px) rotate(1.5deg);
          }
        }
      `}</style>
    </div>
  );
};

import React from 'react';
import { ItzamnaTitle } from './ItzamnaTitle';

export interface PixelArtSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
  inline?: boolean;
}

/**
 * PixelArtSpinner: Spinner ceremonial minimalista con la tipografía oficial plana
 * "ITZAMNA ACADEMIA" sin ornamentos, corchetes ni decoraciones superfluas.
 * Anima con pulso suave y escalado rítmico retro pixel art.
 */
export const PixelArtSpinner: React.FC<PixelArtSpinnerProps> = ({
  size = 'md',
  message,
  className = '',
  inline = false,
}) => {
  return (
    <div
      className={`flex ${
        inline ? 'flex-row items-center gap-2.5' : 'flex-col items-center justify-center gap-3'
      } ${className} select-none`}
    >
      {/* Título canónico con patrón Dithering semitono Bayer SNES y animación de pulso/escala */}
      <div className="animate-pulse-scale-glow flex flex-col items-center justify-center">
        <ItzamnaTitle size={size} />
      </div>

      {/* Mensaje ceremonial de carga opcional */}
      {message && (
        <div className="flex flex-col items-center gap-1 mt-1 text-center">
          <span className="font-['Press_Start_2P',monospace] text-[8px] sm:text-[9px] text-[#73c2fb] tracking-wider">
            {message}
          </span>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { api } from '../api';
import { User } from '../types';
import { PixelArtSpinner } from './PixelArtSpinner';
import { CosmicBackground } from './CosmicBackground';
import { DeityAxolotl } from './DeityAxolotl';
import { AlertCircle } from 'lucide-react';

interface LoginModalProps {
  onSuccess: (user: User) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    try {
      // Simulación de latencia ritual con el Spinner pixel art
      await new Promise((r) => setTimeout(r, 650));

      // Credenciales demostrativas requeridas
      if (cleanEmail === 'miguelito@alumno.com' && cleanPassword === '12345678') {
        const dummyUser: User = {
          id: 'u_miguelito',
          email: 'miguelito@alumno.com',
          nickname: 'MIGUELITO',
          role: 'student',
          avatar: '🦅',
          difficulty: 'aprendiz',
          language: 'es',
        };
        api.setToken('dummy_token_miguelito');
        localStorage.setItem('zuma_user_nickname', 'MIGUELITO');
        localStorage.setItem('zuma_user_avatar', '🦅');
        onSuccess(dummyUser);
        return;
      }

      // Fallback intentando api backend si está disponible
      try {
        const res = await api.login(cleanEmail, cleanPassword);
        onSuccess(res.user);
        return;
      } catch {
        // Error de credenciales rituales
        throw new Error('Códice ritual no reconocido. Verifica correo y clave.');
      }
    } catch (err: any) {
      setError(err.message || 'Credenciales incorrectas. Ingresa tu códice y contraseña sagrada.');
    } finally {
      setLoading(false);
    }
  };

  // Maya Greca Vector SVG Pattern
  const renderMayaGrecaSVG = () => (
    <div
      data-pencil-name="SVG"
      className="box-border w-full shrink-0 h-[12px] overflow-hidden relative flex justify-center items-center"
    >
      <svg
        data-pencil-name="Vector"
        viewBox="0 0 377.2250061035156 12"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="box-border w-full max-w-[420px] h-[12px] overflow-visible"
      >
        <path
          d="M0 0l19.1 0 0 4-9.55 0 0 4 9.55 0 0 4-19.1 0 0-12 0 0m23.875 0l19.1 0 0 4-9.55 0 0 4 9.55 0 0 4-19.1 0 0-12 0 0m23.875 0l19.1 0 0 4-9.55 0 0 4 9.55 0 0 4-19.1 0 0-12 0 0m23.875 0l19.1 0 0 4-9.55 0 0 4 9.55 0 0 4-19.1 0 0-12 0 0m23.875 0l19.10001 0 0 4-9.55001 0 0 4 9.55001 0 0 4-19.10001 0 0-12 0 0m23.875 0l19.10001 0 0 4-9.55001 0 0 4 9.55001 0 0 4-19.10001 0 0-12 0 0m23.875 0l19.10001 0 0 4-9.55001 0 0 4 9.55001 0 0 4-19.10001 0 0-12 0 0m23.875 0l19.10001 0 0 4-9.55001 0 0 4 9.55001 0 0 4-19.10001 0 0-12 0 0m23.875 0l19.10001 0 0 4-9.55001 0 0 4 9.55001 0 0 4-19.10001 0 0-12 0 0m23.875 0l19.10001 0 0 4-9.55001 0 0 4 9.55001 0 0 4-19.10001 0 0-12 0 0m23.875 0l19.10001 0 0 4-9.55001 0 0 4 9.55001 0 0 4-19.10001 0 0-12 0 0m23.875 0l19.10001 0 0 4-9.54999 0 0 4 9.54999 0 0 4-19.10001 0 0-12 0 0m23.875 0l19.10001 0 0 4-9.54999 0 0 4 9.54999 0 0 4-19.10001 0 0-12 0 0m23.875 0l19.10001 0 0 4-9.54999 0 0 4 9.54999 0 0 4-19.10001 0 0-12 0 0m23.875 0l19.10001 0 0 4-9.54999 0 0 4 9.54999 0 0 4-19.10001 0 0-12 0 0m23.875 0l19.10001 0 0 4-9.54999 0 0 4 9.54999 0 0 4-19.10001 0 0-12 0 0"
          fill="#d99b26d9"
        />
      </svg>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-[#0a0a0ff0]">
      {/* SHADER CÓSMICO DE FONDO: GALAXIA MAYA CON AZUL MAYA, JADE, ORO Y DITHERING BAYER */}
      <CosmicBackground speed={1.0} interactive={true} variant="vibrant" />

      {/* Subtle CRT scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 z-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.45) 50%)',
          backgroundSize: '100% 4px',
        }}
      />

      {/* CONTENEDOR PRINCIPAL: SCREEN DEL SISTEMA DE DISEÑO */}
      <div
        data-pencil-name="Main Menu | Screen"
        className="relative z-10 box-border w-full max-w-[440px] min-h-[100dvh] md:min-h-[920px] md:h-[956px] bg-[#1a1a1acc] backdrop-blur-md overflow-hidden flex flex-col justify-between items-center shadow-[0_0_50px_rgba(0,0,0,0.9),0_0_30px_rgba(27,77,62,0.4)] border-x border-[#33333366]"
      >
        {/* GRECA MAYA SUPERIOR */}
        <div
          data-pencil-name="Greca Maya"
          className="box-border w-full h-[16px] shrink-0 flex flex-row gap-0 justify-center items-center bg-[#a62b2bff] overflow-hidden z-10 shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
        >
          {renderMayaGrecaSVG()}
        </div>

        {/* CONTENIDO CENTRAL */}
        <div className="w-full flex-1 flex flex-col items-center justify-center px-4 py-8 relative z-10">
          {/* HERO SECTION: Medallion & 3D Arcade Title */}
          <div
            data-pencil-name="HERO SECTION: Medallion & 3D Arcade Title"
            className="box-border w-full h-fit shrink-0 flex flex-col gap-0 justify-start items-center mb-4"
          >
            <div
              data-pencil-name="Main Arcade Title (Inspired by Pixel Paragons & Pixeria references)"
              className="box-border w-fit h-fit shrink-0 flex flex-col gap-0 justify-start items-center"
            >
              <div
                data-pencil-name="Heading 1 - Dual Sword / Glyphic Header Accents"
                className="box-border w-fit h-fit shrink-0 [filter:drop-shadow(0px_3px_0px_#4a0909)] flex flex-col gap-0 justify-start items-center"
              >
                <div
                  data-pencil-name="Text"
                  className="text-[24px]/[32px] box-border font-['Press_Start_2P',system-ui,sans-serif] font-normal tracking-[1.2px] text-center [white-space:nowrap]"
                  style={{
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    backgroundImage: 'linear-gradient(180deg, #ffe5a3ff 0%, #fabc4cff 50%, #a62b2bff 100%)',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '100% 100%',
                    color: 'transparent',
                  }}
                >
                  ITZAMNA
                </div>
              </div>
              <div data-pencil-name="Margin" className="box-border w-[82.5px] h-[14.5px] shrink-0 relative">
                <div
                  data-pencil-name="Shadow"
                  className="box-border w-[82.5px] h-[16.5px] [filter:drop-shadow(0px_2px_0px_#05363d)] absolute left-0 top-[-2px] [z-index:0]"
                >
                  <div
                    data-pencil-name="Text"
                    className="text-[11px]/[17px] box-border absolute left-[-13.75px] top-0 text-[#76d4e4ff] font-['Press_Start_2P',system-ui,sans-serif] font-normal tracking-[2.75px] text-center [white-space:nowrap] [z-index:0]"
                  >
                    ACADEMIA
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MESOBRAIN DEITY AXOLOTL */}
          <div className="mb-6 flex items-center justify-center">
            <DeityAxolotl size={168} />
          </div>

          {/* FORMULARIO TIPO CÓDICE / TABLILLA DE ARCILLA */}
          <div
            data-pencil-name="FORMULARIO TIPO CÓDICE / TABLILLA DE ARCILLA:margin"
            className="box-border w-full max-w-[358px] h-fit flex flex-col gap-0 justify-start items-center"
          >
            <div
              data-pencil-name="FORMULARIO TIPO CÓDICE / TABLILLA DE ARCILLA"
              className="box-border w-full h-fit shrink-0 flex flex-col gap-[12px] p-[12px] justify-start items-start bg-[#a62b2bff] rounded-[2px] shadow-[0px_4px_16px_rgba(0,0,0,0.8),inset_2px_2px_0px_#e44a3e40,inset_-2px_-2px_0px_#530e0b80]"
            >
              {/* ALERTA DE ERROR RITUAL */}
              {error && (
                <div className="w-full p-2.5 bg-[#450a0a] border border-[#ef4444] rounded flex items-start gap-2 shadow-[2px_2px_0px_#0e0a0b] animate-shake">
                  <AlertCircle className="w-4 h-4 text-[#ef4444] shrink-0 mt-0.5" />
                  <div className="text-[8px] leading-[14px] text-[#fef2f2] font-['Press_Start_2P',sans-serif]">
                    {error}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="w-full flex flex-col gap-[12px]">
                {/* INPUT 1: CORREO ELECTRÓNICO (CÓDICE DE ALUMNO) */}
                <div
                  data-pencil-name="Input 1: APODO / CÓDICE DE ALUMNO"
                  className="box-border w-full h-fit shrink-0 flex flex-col gap-[4px] justify-start items-start"
                >
                  <div
                    data-pencil-name="Container"
                    className="box-border w-full h-fit shrink-0 flex flex-row justify-between items-center"
                  >
                    <div
                      data-pencil-name="Label"
                      className="box-border w-fit shrink-0 h-fit flex flex-col gap-0 justify-start items-start"
                    >
                      <label
                        htmlFor="login-email"
                        data-pencil-name="Correo electronico"
                        className="text-[8px]/[12px] box-border text-[#d4af37ff] font-['Press_Start_2P',system-ui,sans-serif] font-normal tracking-[0.4px] text-left select-none"
                      >
                        Correo electronico
                      </label>
                    </div>
                  </div>
                  <div
                    data-pencil-name="Background+Border+Shadow"
                    className="box-border w-full h-fit shrink-0 [box-shadow:2px_2px_0px_#0e0a0b] flex flex-row gap-0 justify-start items-center bg-[#0e0a0bff] [border:1px_solid_#b8261e99] focus-within:border-[#fabc4c] transition-colors"
                  >
                    <div
                      data-pencil-name="Container"
                      className="box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[0px_8px] justify-start items-center select-none"
                    >
                      <div
                        data-pencil-name="Text"
                        className="text-[12px]/[16px] box-border text-[#d99b26ff] font-['Nimbus_Mono_PS',monospace] font-normal text-left"
                      >
                        ᚛
                      </div>
                    </div>
                    <div
                      data-pencil-name="Input"
                      className="box-border [flex:1_1_0] h-fit flex flex-col gap-0 p-[10px_8px_10px_4px] justify-start items-start overflow-hidden"
                    >
                      <input
                        id="login-email"
                        type="email"
                        required
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="miguelito@alumno.com"
                        className="text-[10px]/[20px] box-border w-full text-[#fdf8eeff] font-['Press_Start_2P',system-ui,sans-serif] font-normal text-left bg-transparent outline-none border-none placeholder:text-[#555] tracking-tight"
                      />
                    </div>
                  </div>
                </div>

                {/* INPUT 2: CONTRASEÑA (CÓDIGO DE AULA MAYA) */}
                <div
                  data-pencil-name="Input 2: CÓDIGO DE AULA MAYA"
                  className="box-border w-full h-fit shrink-0 flex flex-col gap-[4px] justify-start items-start"
                >
                  <div
                    data-pencil-name="Container"
                    className="box-border w-full h-fit shrink-0 flex flex-row justify-between items-center"
                  >
                    <div
                      data-pencil-name="Label"
                      className="box-border w-fit shrink-0 h-fit flex flex-col gap-0 justify-start items-start"
                    >
                      <label
                        htmlFor="login-password"
                        data-pencil-name="contraseña"
                        className="text-[8px]/[12px] box-border text-[#f9c852ff] font-['Press_Start_2P',system-ui,sans-serif] font-normal tracking-[0.4px] text-left select-none"
                      >
                        contraseña
                      </label>
                    </div>
                  </div>
                  <div
                    data-pencil-name="Background+Border+Shadow"
                    className="box-border w-full h-fit shrink-0 [box-shadow:2px_2px_0px_#0e0a0b] flex flex-row gap-0 justify-start items-center bg-[#0e0a0bff] [border:1px_solid_#d99b2699] focus-within:border-[#fabc4c] transition-colors"
                  >
                    <div
                      data-pencil-name="Container"
                      className="box-border w-fit shrink-0 h-fit flex flex-col gap-0 p-[0px_8px] justify-start items-center select-none"
                    >
                      <svg
                        data-pencil-name="Icon"
                        viewBox="0 0 10.5 10.5"
                        preserveAspectRatio="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="box-border w-[10.5px] h-[10.5px] shrink-0 overflow-visible"
                      >
                        <path
                          d="M1.5 10.5l0-1.5-1.5 0 0-1.5 1.5 0 0-4.5-1.5 0 0-1.5 1.5 0 0-1.5 3 0 0 1.5 1.5 0 0-1.5 3 0 0 1.5 1.5 0 0 1.5-1.5 0 0 4.5 1.5 0 0 1.5-1.5 0 0 1.5-3 0 0-1.5-1.5 0 0 1.5-3 0 0 0m3-3l1.5 0 0-4.5-1.5 0 0 4.5 0 0"
                          fill="#d99b26ff"
                        />
                      </svg>
                    </div>
                    <div
                      data-pencil-name="Input"
                      className="box-border [flex:1_1_0] h-fit flex flex-col gap-0 p-[10px_8px_10px_4px] justify-start items-start overflow-hidden"
                    >
                      <input
                        id="login-password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="text-[10px]/[20px] box-border w-full text-[#f9c852ff] font-['Press_Start_2P',system-ui,sans-serif] font-normal text-left bg-transparent outline-none border-none placeholder:text-[#555] tracking-widest"
                      />
                    </div>
                  </div>
                </div>

                {/* BOTÓN PRINCIPAL DE COMBATE: ROJO CINABRIO Y ORO */}
                <button
                  type="submit"
                  disabled={loading}
                  data-pencil-name="Button - BOTÓN PRINCIPAL DE COMBATE: ROJO CINABRIO"
                  className="box-border w-full h-[46px] shrink-0 [box-shadow:4px_4px_0px_#0e0a0b,_inset_-2px_-2px_0px_#530e0b,_inset_2px_2px_0px_#e44a3e] flex flex-row gap-0 p-[12px_0px] justify-center items-center bg-[#d48925ff] hover:bg-[#e29932] active:translate-y-0.5 active:[box-shadow:2px_2px_0px_#0e0a0b] [border:1px_solid_#d99b2666] cursor-pointer transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                >
                  {loading ? (
                    <PixelArtSpinner size="sm" inline={true} message="INICIANDO..." />
                  ) : (
                    <div
                      data-pencil-name="Iniciar sesiON"
                      className="text-[11px]/[17px] box-border text-[#fdf8eeff] font-['Press_Start_2P',system-ui,sans-serif] font-normal tracking-[0.55px] text-center uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                    >
                      Iniciar sesión
                    </div>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Subtítulo ritual ceremonial */}
          <div className="mt-4 text-center">
            <span className="font-['Silkscreen',sans-serif] text-[9px] text-[#bd8717aa] tracking-widest">
              2026 Cuetzpalin Team
            </span>
          </div>
        </div>

        {/* GRECA MAYA INFERIOR */}
        <div
          data-pencil-name="Greca Maya"
          className="box-border w-full h-[16px] shrink-0 flex flex-row gap-0 justify-center items-center bg-[#a62b2bff] overflow-hidden z-10 shadow-[0_-2px_4px_rgba(0,0,0,0.5)]"
        >
          {renderMayaGrecaSVG()}
        </div>
      </div>
    </div>
  );
};

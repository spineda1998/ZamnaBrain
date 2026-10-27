import React, { useState } from 'react';
import { api } from '../api';
import { User } from '../types';
import { PixelArtSpinner } from './PixelArtSpinner';
import { ItzamnaTitle } from './ItzamnaTitle';
import { GrecaBar } from './GrecaBar';
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
        try {
          const res = await api.login(cleanEmail, cleanPassword);
          localStorage.setItem('zuma_user_nickname', 'MIGUELITO');
          localStorage.setItem('zuma_user_avatar', '🦅');
          onSuccess(res.user);
          return;
        } catch {
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

  const handleSocialLogin = async (provider: 'Google' | 'Apple' | 'Discord') => {
    setError(null);
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 650));
      const profileMap: Record<string, { email: string; nickname: string; avatar: string }> = {
        Google: {
          email: 'alumno.maya@google.academiamaya.edu',
          nickname: 'KUKUL G-PILOT',
          avatar: 'quetzal',
        },
        Apple: {
          email: 'itzamna.student@apple.icloud.edu',
          nickname: 'BALAM APPLE',
          avatar: 'jaguar',
        },
        Discord: {
          email: 'cuetzpalin@discord.guild.edu',
          nickname: 'AXOLOTL DISCORD',
          avatar: 'axolotl',
        },
      };

      const prof = profileMap[provider];
      const dummyUser: User = {
        id: `social_${provider.toLowerCase()}_${Date.now()}`,
        email: prof.email,
        nickname: prof.nickname,
        avatar: prof.avatar,
        role: 'student',
      };

      api.setToken(`token_${provider.toLowerCase()}_ritual`);
      localStorage.setItem('zuma_user_nickname', prof.nickname);
      localStorage.setItem('zuma_user_avatar', prof.avatar);
      onSuccess(dummyUser);
    } catch (err: any) {
      setError(`Error al autenticar con ${provider}: ${err?.message || 'Intenta de nuevo'}`);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-transparent">
      {/* PANTALLA DE CARGA DEL SISTEMA CON SPINNER LOGOTIPO DE ITZAMNÁ (CUANDO LOADING = TRUE) */}
      {loading && (
        <div className="fixed inset-0 z-[100] bg-[#040913]/92 flex flex-col items-center justify-center p-4 animate-in fade-in duration-150">
          <PixelArtSpinner size="lg" message="AUTENTICANDO EN ITZAMNÁ ACADEMIA..." />
        </div>
      )}

      {/* CONTENEDOR PRINCIPAL: SCREEN 100% TRANSPARENTE SIN ELEMENTOS GLASS NI BLUR */}
      <div
        data-pencil-name="Main Menu | Screen"
        className="relative z-10 box-border w-full max-w-[440px] min-h-[100dvh] md:min-h-[920px] md:h-[956px] bg-transparent overflow-hidden flex flex-col justify-between items-center"
      >
        {/* GRECA MAYA SUPERIOR ANIMADA */}
        <GrecaBar height="md" animated={true} className="z-10 shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />

        {/* CONTENIDO CENTRAL */}
        <div className="w-full flex-1 flex flex-col items-center justify-center px-4 py-8 relative z-10">
          {/* HERO SECTION: Medallion & SNES Dithered Arcade Title */}
          <div
            data-pencil-name="HERO SECTION: Medallion & 3D Arcade Title"
            className="box-border w-full h-fit shrink-0 flex flex-col gap-0 justify-start items-center mb-4"
          >
            <ItzamnaTitle size="lg" className="drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]" />
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

                {/* BOTÓN PRINCIPAL: INICIAR SESIÓN */}
                <button
                  type="submit"
                  disabled={loading}
                  data-pencil-name="Button - INICIAR SESIÓN"
                  className="box-border w-full h-[46px] shrink-0 [box-shadow:4px_4px_0px_#0e0a0b,_inset_-2px_-2px_0px_#530e0b,_inset_2px_2px_0px_#e44a3e] flex flex-row gap-0 p-[12px_0px] justify-center items-center bg-[#d48925ff] hover:bg-[#e29932] active:translate-y-0.5 active:[box-shadow:2px_2px_0px_#0e0a0b] [border:1px_solid_#d99b2666] cursor-pointer transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                >
                  <div
                    data-pencil-name="Iniciar sesión"
                    className="text-[11px]/[17px] box-border text-[#fdf8eeff] font-['Press_Start_2P',system-ui,sans-serif] font-normal tracking-[0.55px] text-center uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                  >
                    {loading ? 'INICIANDO...' : 'Iniciar sesión'}
                  </div>
                </button>

                {/* SEPARADOR GLÍFICO */}
                <div className="w-full flex items-center justify-between my-1 gap-2">
                  <div className="h-[1px] flex-1 bg-[#d99b2666]" />
                  <span className="text-[7.5px] font-['Press_Start_2P',sans-serif] text-[#f9c852cc] tracking-widest uppercase">
                    O CONECTA CON
                  </span>
                  <div className="h-[1px] flex-1 bg-[#d99b2666]" />
                </div>

                {/* BOTONES SECUNDARIOS DE AUTENTICACIÓN: GOOGLE, APPLE, DISCORD */}
                <div className="w-full grid grid-cols-3 gap-2">
                  {/* Google */}
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleSocialLogin('Google')}
                    title="Iniciar sesión con Google"
                    className="h-9 px-1.5 bg-[#1f1917] hover:bg-[#2b221f] active:translate-y-0.5 [box-shadow:2px_2px_0px_#0e0a0b,_inset_1px_1px_0px_#ffffff22] border border-[#fabc4c55] rounded-[2px] flex items-center justify-center gap-1.5 cursor-pointer transition-all disabled:opacity-50"
                  >
                    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z" />
                      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                      <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z" />
                      <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z" />
                    </svg>
                    <span className="font-['Press_Start_2P',sans-serif] text-[7px] text-[#ffe5a3]">Google</span>
                  </button>

                  {/* Apple */}
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleSocialLogin('Apple')}
                    title="Iniciar sesión con Apple"
                    className="h-9 px-1.5 bg-[#1f1917] hover:bg-[#2b221f] active:translate-y-0.5 [box-shadow:2px_2px_0px_#0e0a0b,_inset_1px_1px_0px_#ffffff22] border border-[#fabc4c55] rounded-[2px] flex items-center justify-center gap-1.5 cursor-pointer transition-all disabled:opacity-50"
                  >
                    <svg className="w-3.5 h-3.5 shrink-0 fill-[#f4efe6]" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.06 1.72-.93 2.74 1.01.08 2.03-.5 2.63-1.24z" />
                    </svg>
                    <span className="font-['Press_Start_2P',sans-serif] text-[7px] text-[#ffe5a3]">Apple</span>
                  </button>

                  {/* Discord */}
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleSocialLogin('Discord')}
                    title="Iniciar sesión con Discord"
                    className="h-9 px-1.5 bg-[#1f1917] hover:bg-[#2b221f] active:translate-y-0.5 [box-shadow:2px_2px_0px_#0e0a0b,_inset_1px_1px_0px_#ffffff22] border border-[#73c2fb66] rounded-[2px] flex items-center justify-center gap-1.5 cursor-pointer transition-all disabled:opacity-50"
                  >
                    <svg className="w-3.5 h-3.5 shrink-0 fill-[#73c2fb]" viewBox="0 0 24 24">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                    </svg>
                    <span className="font-['Press_Start_2P',sans-serif] text-[7px] text-[#73c2fb]">Discord</span>
                  </button>
                </div>
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

        {/* GRECA MAYA INFERIOR ANIMADA */}
        <GrecaBar height="md" animated={true} className="z-10 shadow-[0_-2px_4px_rgba(0,0,0,0.5)]" />
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { api } from '../api';
import { User } from '../types';
import { GrecaBar } from './GrecaBar';
import { Shield, Sparkles, User as UserIcon, Lock, Mail } from 'lucide-react';

interface LoginModalProps {
  onSuccess: (user: User) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        if (!nickname.trim()) throw new Error('Por favor ingresa un apodo');
        const res = await api.register(email, password, nickname, role);
        onSuccess(res.user);
      } else {
        const res = await api.login(email, password);
        onSuccess(res.user);
      }
    } catch (err: any) {
      setError(err.message || 'Error al autenticar');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail: string) => {
    setError(null);
    setLoading(true);
    try {
      const res = await api.login(demoEmail, 'zuma1234');
      onSuccess(res.user);
    } catch (err: any) {
      setError(err.message || 'Error con cuenta demo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0f0f0fe6] backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1a1a1a] border-4 border-[#a62b2b] shadow-2xl rounded-sm overflow-hidden flex flex-col relative">
        <GrecaBar />

        {/* Header */}
        <div className="p-6 text-center border-b-2 border-[#333]">
          <div className="w-16 h-16 mx-auto mb-3 bg-[#a62b2b] border-2 border-[#d99b26] rounded-xl flex items-center justify-center text-3xl shadow-lg">
            🐸
          </div>
          <h2 className="font-press-start text-lg text-[#d99b26] drop-shadow">
            ZUMABRAIN
          </h2>
          <p className="font-silkscreen text-xs text-[#a3a3a3] mt-1">
            {isRegister ? 'Registro de Iniciado' : 'Acceso al Templo del Conocimiento'}
          </p>
        </div>

        {/* Form Container */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-[#7f1d1d] border border-[#ef4444] rounded text-xs text-red-200 font-silkscreen">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block font-press-start text-[10px] text-[#fbbf24] mb-1">
                  APODO / NOMBRE GUERRERO
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#9ca3af] absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Ej. BALAM_IX"
                    className="w-full bg-[#111] border-2 border-[#444] focus:border-[#d99b26] rounded px-3 py-2 pl-9 font-silkscreen text-sm text-[#f4efe6] outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block font-press-start text-[10px] text-[#fbbf24] mb-1">
                CORREO SAGRADO
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#9ca3af] absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alumno@zuma.dev"
                  className="w-full bg-[#111] border-2 border-[#444] focus:border-[#d99b26] rounded px-3 py-2 pl-9 font-silkscreen text-sm text-[#f4efe6] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-press-start text-[10px] text-[#fbbf24] mb-1">
                CONTRASEÑA
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#9ca3af] absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#111] border-2 border-[#444] focus:border-[#d99b26] rounded px-3 py-2 pl-9 font-silkscreen text-sm text-[#f4efe6] outline-none"
                />
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="block font-press-start text-[10px] text-[#fbbf24] mb-1">
                  ROL EN EL TEMPLO
                </label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`py-2 px-3 border-2 rounded text-xs font-press-start ${
                      role === 'student'
                        ? 'border-[#22c55e] bg-[#14291c] text-[#22c55e]'
                        : 'border-[#333] bg-[#222] text-[#888]'
                    }`}
                  >
                    Alumno
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('teacher')}
                    className={`py-2 px-3 border-2 rounded text-xs font-press-start ${
                      role === 'teacher'
                        ? 'border-[#d99b26] bg-[#31250b] text-[#fbbf24]'
                        : 'border-[#333] bg-[#222] text-[#888]'
                    }`}
                  >
                    Profesor
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#a62b2b] hover:bg-[#c0392b] text-[#f4efe6] border-2 border-[#d99b26] rounded font-press-start text-xs retro-button mt-4 shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                'Consultando a los Dioses...'
              ) : isRegister ? (
                'INICIAR RITUAL (CREAR CUENTA)'
              ) : (
                'ENTRAR AL TEMPLO'
              )}
            </button>
          </form>

          {/* Quick Demo Switcher */}
          <div className="mt-6 pt-4 border-t border-[#333]">
            <p className="font-press-start text-[9px] text-[#9ca3af] text-center mb-2.5">
              ACCESO RÁPIDO DEMO:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('balam@zuma.dev')}
                className="p-2 bg-[#262626] hover:bg-[#333] border border-[#d99b26] rounded text-left font-silkscreen text-xs text-[#f4efe6] transition"
              >
                <div className="text-[#fbbf24] font-bold text-[11px]">🐆 BALAM</div>
                <div className="text-[10px] text-[#888]">Alumno (Sendero I)</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('ixchel@zuma.dev')}
                className="p-2 bg-[#262626] hover:bg-[#333] border border-[#22c55e] rounded text-left font-silkscreen text-xs text-[#f4efe6] transition"
              >
                <div className="text-[#22c55e] font-bold text-[11px]">🌙 IXCHEL</div>
                <div className="text-[10px] text-[#888]">Alumna Avanzada</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('profe@zuma.dev')}
                className="col-span-2 p-2 bg-[#31250b] hover:bg-[#42320f] border border-[#d99b26] rounded text-center font-silkscreen text-xs text-[#fbbf24] transition flex items-center justify-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>KUKULKAN — Cuenta de Profesor (Ver Aulas)</span>
              </button>
            </div>
          </div>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError(null);
              }}
              className="font-silkscreen text-xs text-[#d99b26] hover:underline"
            >
              {isRegister
                ? '¿Ya tienes cuenta ritual? Inicia sesión'
                : '¿Nuevo en el templo? Crea tu cuenta aquí'}
            </button>
          </div>
        </div>

        <GrecaBar />
      </div>
    </div>
  );
};

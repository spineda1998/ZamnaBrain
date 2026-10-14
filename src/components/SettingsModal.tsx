import React, { useState } from 'react';
import { User, GameSettings, AppLanguage } from '../types';
import { Mail, Check, X, Globe, Sparkles } from 'lucide-react';
import { getT } from '../utils/i18n';

interface SettingsModalProps {
  user: User;
  settings: GameSettings;
  jadeEnergy?: number;
  onSave: (updatedUser: Partial<User>, updatedSettings: GameSettings) => void;
  onClose: () => void;
}

const AVATAR_OPTIONS = [
  { id: 'axolotl', emoji: '🦎', label: 'Axolotl Sabio' },
  { id: 'jaguar', emoji: '🐆', label: 'Jaguar Guerrero' },
  { id: 'serpent', emoji: '🐍', label: 'Kukulkán Jade' },
  { id: 'quetzal', emoji: '🪶', label: 'Quetzal Solar' },
  { id: 'monkey', emoji: '🐒', label: 'Escriba Ajau' },
];

const LANGUAGE_OPTIONS: { id: AppLanguage; label: string; sub: string; flag: string }[] = [
  { id: 'es', label: 'ESPAÑOL', sub: 'Castellano', flag: '🇪🇸' },
  { id: 'nah', label: 'NÁHUATL', sub: 'Tlahtolli', flag: '🏛️' },
  { id: 'myn', label: 'MAYA', sub: 'Maaya T\'aan', flag: '🌿' },
  { id: 'en', label: 'INGLÉS', sub: 'English', flag: '🌐' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  user,
  settings,
  onSave,
  onClose,
}) => {
  const [nickname, setNickname] = useState(user.nickname || 'ITZEL BALAM');
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatar || 'axolotl');
  const [language, setLanguage] = useState<AppLanguage>(settings.language || user.language || 'es');
  const [bgm, setBgm] = useState(settings.bgm);
  const [sfx, setSfx] = useState(settings.sfx);
  const [volume, setVolume] = useState(settings.volume);
  const [savedToast, setSavedToast] = useState(false);

  const t = getT(language);

  const handleSave = () => {
    onSave(
      {
        nickname: nickname.trim() || 'ITZEL BALAM',
        avatar: selectedAvatar,
        language,
      },
      {
        bgm,
        sfx,
        volume,
        difficulty: settings.difficulty || 'sacerdote',
        language,
      }
    );
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-sm select-none font-silkscreen animate-in fade-in duration-200">
      <div className="w-full max-w-[390px] bg-[#1c1b1b] [border:2px_solid_#fabc4c] [box-shadow:inset_2px_2px_0px_#ffdeac,_inset_-2px_-2px_0px_#604100,_6px_6px_0px_#000000] p-4 flex flex-col gap-3 relative max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#353535]">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚙️</span>
            <div>
              <h2 className="text-[11px]/[14px] text-[#ffdeac] font-press-start tracking-[0.5px]">
                {t.settingsTitle}
              </h2>
              <span className="text-[8px]/[12px] text-[#76d4e4] block mt-0.5">
                {t.settingsSubtitle}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 bg-[#0e0e0e] hover:bg-[#a62b2b] text-[#ffdeac] flex items-center justify-center rounded-[2px] border border-[#353535] cursor-pointer transition [box-shadow:inset_1px_1px_0px_#ffffff33,_inset_-1px_-1px_0px_#00000099]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Account & Linked Email */}
        <div className="p-2.5 bg-[#0e0e0e] rounded-[2px] border border-[#353535] [box-shadow:inset_2px_2px_0px_#000000] flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#fabc4c]" />
              <span className="text-[8.5px]/[11px] text-[#e0bfbc] font-press-start">
                {t.linkedEmail}:
              </span>
            </div>
            <span className="text-[7px]/[9px] bg-[#15803d]/40 text-[#86efac] border border-[#22c55e] px-1.5 py-0.5 rounded-[2px]">
              {t.accountLinked}
            </span>
          </div>
          <div className="font-press-start text-[9px] text-[#76d4e4] truncate px-1 py-1 bg-[#141414] rounded border border-[#2a2a2a]">
            {user.email || 'guerrero@teotihuacan.sacred'}
          </div>
        </div>

        {/* Player Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[9px]/[12px] text-[#ffdeac] font-press-start block">
            {t.playerName}:
          </label>
          <input
            type="text"
            value={nickname}
            maxLength={18}
            onChange={(e) => setNickname(e.target.value.toUpperCase())}
            className="w-full bg-[#0e0e0e] text-[#fabc4c] font-press-start text-[11px] p-2 border-2 border-[#58413f] focus:border-[#fabc4c] outline-none rounded-[2px] [box-shadow:inset_2px_2px_0px_#000000]"
          />
        </div>

        {/* Ceremonial Avatar Selection */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[9px]/[12px] text-[#ffdeac] font-press-start block">
            {t.ceremonialAvatar}:
          </span>
          <div className="grid grid-cols-5 gap-1.5">
            {AVATAR_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedAvatar(opt.id)}
                title={opt.label}
                className={`h-11 flex flex-col items-center justify-center text-xl rounded-[2px] transition cursor-pointer relative ${
                  selectedAvatar === opt.id
                    ? 'bg-[#a62b2b] border-2 border-[#fabc4c] [box-shadow:inset_2px_2px_0px_#ffdeac,_inset_-2px_-2px_0px_#604100]'
                    : 'bg-[#0e0e0e] border border-[#353535] hover:bg-[#20201f]'
                }`}
              >
                <span>{opt.emoji}</span>
                {selectedAvatar === opt.id && (
                  <span className="w-1.5 h-1.5 bg-[#fabc4c] rounded-full absolute bottom-1" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Change Language Selector (Replaces Ritual Difficulty) */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-[#fabc4c]" />
            <span className="text-[9px]/[12px] text-[#ffdeac] font-press-start block">
              {t.selectLanguage}:
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {LANGUAGE_OPTIONS.map((langOpt) => (
              <button
                key={langOpt.id}
                type="button"
                onClick={() => setLanguage(langOpt.id)}
                className={`p-2 rounded-[2px] flex flex-col items-start gap-0.5 border cursor-pointer transition text-left ${
                  language === langOpt.id
                    ? 'bg-[#fabc4c] text-[#432c00] border-[#ffdeac] [box-shadow:inset_2px_2px_0px_#ffdeac,_inset_-2px_-2px_0px_#855700]'
                    : 'bg-[#0e0e0e] text-[#a78a87] border-[#353535] hover:bg-[#20201f]'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-press-start text-[8.5px] font-bold">
                    {langOpt.flag} {langOpt.label}
                  </span>
                  {language === langOpt.id && (
                    <span className="text-[9px] font-bold">✓</span>
                  )}
                </div>
                <span className={`text-[7.5px] ${language === langOpt.id ? 'text-[#604100]' : 'text-[#76d4e4]'}`}>
                  {langOpt.sub}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Audio & Sound Effects */}
        <div className="flex flex-col gap-2 p-2 bg-[#0e0e0e] rounded-[2px] border border-[#353535]">
          <span className="text-[9px]/[12px] text-[#ffdeac] font-press-start block">
            {t.audioEffects}:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setBgm(!bgm)}
              className={`p-2 rounded-[2px] text-[8.5px] font-press-start flex items-center justify-between border cursor-pointer ${
                bgm
                  ? 'bg-[#155e75] border-[#06b6d4] text-[#a5f3fc]'
                  : 'bg-[#1f1f1f] border-[#353535] text-[#8e8579]'
              }`}
            >
              <span>{t.bgmMusic}</span>
              <span>{bgm ? 'ON' : 'OFF'}</span>
            </button>
            <button
              type="button"
              onClick={() => setSfx(!sfx)}
              className={`p-2 rounded-[2px] text-[8.5px] font-press-start flex items-center justify-between border cursor-pointer ${
                sfx
                  ? 'bg-[#15803d] border-[#22c55e] text-[#86efac]'
                  : 'bg-[#1f1f1f] border-[#353535] text-[#8e8579]'
              }`}
            >
              <span>{t.sfxEffects}</span>
              <span>{sfx ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          <div className="flex items-center justify-between mt-1 text-[8px] text-[#a78a87]">
            <span>{t.volume}:</span>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-36 accent-[#fabc4c] cursor-pointer"
            />
            <span className="font-press-start text-[#fabc4c] text-[8px]">{volume}%</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-[#353535]">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-9 bg-[#20201f] hover:bg-[#2a2a2a] text-[#a78a87] font-press-start text-[9px] rounded-[2px] border border-[#353535] cursor-pointer transition"
          >
            {t.cancel}
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 h-9 bg-[#a62b2b] hover:bg-[#ba3232] text-[#ffdad7] font-press-start text-[9px] rounded-[2px] [box-shadow:inset_2px_2px_0px_#ffb3ad,_inset_-2px_-2px_0px_#68000a] flex items-center justify-center gap-1.5 cursor-pointer transition"
          >
            <Check className="w-3.5 h-3.5" />
            <span>{savedToast ? t.saved : t.save}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

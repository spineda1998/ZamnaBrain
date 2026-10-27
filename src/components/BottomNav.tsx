import React from 'react';
import { LayoutGrid, Compass, Gamepad2, BookOpen } from 'lucide-react';
import { AppLanguage } from '../types';
import { getT } from '../utils/i18n';
import { GrecaBar } from './GrecaBar';

export type AppTab = 'feed' | 'sendero' | 'arcade' | 'codex';

interface BottomNavProps {
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  language?: AppLanguage;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab, language = 'es' }) => {
  const t = getT(language);

  const tabs = [
    {
      id: 'feed' as const,
      label: t.feedTab,
      icon: LayoutGrid,
      activeColor: 'bg-[#9E2A2B] text-[#FFFDF2] border-[#FFFDF2]/40 [box-shadow:inset_1.5px_1.5px_0px_#ffffff44,_2px_2px_0px_#000]',
      iconColor: 'text-[#FFFDF2]',
    },
    {
      id: 'sendero' as const,
      label: t.senderoTab,
      icon: Compass,
      activeColor: 'bg-[#9E2A2B] text-[#FFFDF2] border-[#FFFDF2]/40 [box-shadow:inset_1.5px_1.5px_0px_#ffffff44,_2px_2px_0px_#000]',
      iconColor: 'text-[#FFFDF2]',
    },
    {
      id: 'arcade' as const,
      label: t.minigamesTab,
      icon: Gamepad2,
      activeColor: 'bg-[#2A7B4C] text-[#FFFDF2] border-[#FFFDF2]/40 [box-shadow:inset_1.5px_1.5px_0px_#ffffff44,_2px_2px_0px_#000]',
      iconColor: 'text-[#FFFDF2]',
    },
    {
      id: 'codex' as const,
      label: t.codexTab,
      icon: BookOpen,
      activeColor: 'bg-[#9E2A2B] text-[#FFFDF2] border-[#FFFDF2]/40 [box-shadow:inset_1.5px_1.5px_0px_#ffffff44,_2px_2px_0px_#000]',
      iconColor: 'text-[#FFFDF2]',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0e0506] border-t-2 border-[#9E2A2B]/70 shadow-[0_-4px_16px_rgba(0,0,0,0.85)] pb-safe">
      <GrecaBar height="sm" animated={true} />
      <div className="max-w-[440px] mx-auto px-2 py-1.5 grid grid-cols-4 gap-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`h-12 rounded-[2px] font-press-start text-[8px] flex flex-col items-center justify-center gap-1 transition-all select-none cursor-pointer ${
                isActive
                  ? `${tab.activeColor} border scale-[1.02]`
                  : 'bg-[#180a0c] text-[#a89b88] hover:bg-[#261013] hover:text-[#FFFDF2] border border-[#381518] [box-shadow:inset_1px_1px_0px_#ffffff15,_1px_1px_0px_#000]'
              }`}
            >
              <Icon
                className={`w-4 h-4 ${
                  isActive ? `${tab.iconColor} animate-pulse` : 'text-[#827463]'
                }`}
              />
              <span className="tracking-[0.5px] truncate max-w-[70px]">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

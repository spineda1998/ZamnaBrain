import React from 'react';
import { LayoutGrid, Compass, Gamepad2, BookOpen } from 'lucide-react';
import { AppLanguage } from '../types';
import { getT } from '../utils/i18n';

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
      activeColor: 'bg-[#a62b2b] text-[#ffdad7] border-[#ffb3ad]',
      iconColor: 'text-[#fabc4c]',
    },
    {
      id: 'sendero' as const,
      label: t.senderoTab,
      icon: Compass,
      activeColor: 'bg-[#a62b2b] text-[#fbbf24] border-[#f87171]',
      iconColor: 'text-[#fabc4c]',
    },
    {
      id: 'arcade' as const,
      label: t.minigamesTab,
      icon: Gamepad2,
      activeColor: 'bg-[#bd8717] text-[#ffdeac] border-[#fabc4c]',
      iconColor: 'text-[#22c55e]',
    },
    {
      id: 'codex' as const,
      label: t.codexTab,
      icon: BookOpen,
      activeColor: 'bg-[#155e75] text-[#a5f3fc] border-[#06b6d4]',
      iconColor: 'text-[#76d4e4]',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#141414]/95 backdrop-blur-md border-t-2 border-[#3a3028] shadow-[0_-4px_20px_rgba(0,0,0,0.8)] pb-safe">
      <div className="max-w-[420px] mx-auto px-2 py-1.5 grid grid-cols-4 gap-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`h-12 rounded-[2px] font-press-start text-[8px] flex flex-col items-center justify-center gap-1 transition-all select-none cursor-pointer [box-shadow:0px_0px_0px_#0e0e0e,_inset_1.5px_1.5px_0px_#ffffff33,_inset_-1.5px_-1.5px_0px_#00000099] ${
                isActive
                  ? `${tab.activeColor} border scale-[1.02] shadow-md`
                  : 'bg-[#20201f] text-[#8e8579] hover:bg-[#2a2a2a] hover:text-[#f4efe6] border border-[#353535]'
              }`}
            >
              <Icon
                className={`w-4 h-4 ${
                  isActive ? `${tab.iconColor} animate-pulse` : 'text-[#6f675c]'
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

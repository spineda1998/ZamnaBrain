import React, { useState, useEffect, useCallback } from 'react';
import { User, Section, GameNode, ProgressSummary, GameSettings } from './types';
import { api } from './api';
import { Header } from './components/Header';
import { BottomNav, AppTab } from './components/BottomNav';
import { GrecaBar } from './components/GrecaBar';
import { LoginModal } from './components/LoginModal';
import { SettingsModal } from './components/SettingsModal';
import { FeedView } from './components/FeedView';
import { SenderoMap } from './components/SenderoMap';
import { MayaTetris } from './components/games/MayaTetris';
import { MayaMemorama } from './components/games/MayaMemorama';
import { BalanzaSagrada } from './components/games/BalanzaSagrada';
import { KukulcanOrbs } from './components/games/KukulcanOrbs';
import { MinigamesHub } from './components/games/MinigamesHub';
import { CodexView } from './components/CodexView';
import { NodeDetailModal } from './components/NodeDetailModal';
import { FloatingGameControl } from './components/games/FloatingGameControl';
import { PixelArtSpinner } from './components/PixelArtSpinner';
import { CosmicBackground } from './components/CosmicBackground';

const DEFAULT_SETTINGS: GameSettings = {
  bgm: true,
  sfx: true,
  volume: 80,
  difficulty: 'sacerdote',
  language: 'es',
};

export const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<ProgressSummary | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [nodes, setNodes] = useState<Record<string, GameNode[]>>({});
  
  // Navigation tab ('feed' by default)
  const [activeTab, setActiveTab] = useState<AppTab>('feed');

  // Jade Energy (10 Points with 24-hour daily full reset)
  const [jadeEnergy, setJadeEnergy] = useState<number>(() => {
    const saved = localStorage.getItem('zuma_jade_energy');
    const lastReset = localStorage.getItem('zuma_last_energy_reset');
    const now = Date.now();
    if (!lastReset || now - Number(lastReset) >= 24 * 60 * 60 * 1000) {
      localStorage.setItem('zuma_jade_energy', '10');
      localStorage.setItem('zuma_last_energy_reset', now.toString());
      return 10;
    }
    return saved !== null ? Math.min(10, Math.max(0, Number(saved))) : 10;
  });

  // Level 4 completion status
  const [level4Completed, setLevel4Completed] = useState<boolean>(() => {
    return localStorage.getItem('zuma_level4_completed') === 'true';
  });

  // Settings & Profile Modal
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const saved = localStorage.getItem('zuma_settings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Energy depletion toast alert
  const [energyAlert, setEnergyAlert] = useState<string | null>(null);

  // Active game session
  const [playingNode, setPlayingNode] = useState<GameNode | null>(null);
  const [activeGameType, setActiveGameType] = useState<'tetris' | 'memorama' | 'balanza' | 'kukulcan' | null>(null);
  const [isArcadePlaying, setIsArcadePlaying] = useState(false);
  const [selectedNode, setSelectedNode] = useState<GameNode | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Periodic 24h energy check
  useEffect(() => {
    const checkEnergyReset = () => {
      const lastReset = localStorage.getItem('zuma_last_energy_reset');
      const now = Date.now();
      if (!lastReset || now - Number(lastReset) >= 24 * 60 * 60 * 1000) {
        setJadeEnergy(10);
        localStorage.setItem('zuma_jade_energy', '10');
        localStorage.setItem('zuma_last_energy_reset', now.toString());
      }
    };

    checkEnergyReset();
    const interval = setInterval(checkEnergyReset, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  // Sync energy to localStorage
  useEffect(() => {
    localStorage.setItem('zuma_jade_energy', jadeEnergy.toString());
  }, [jadeEnergy]);

  // Load app data
  const loadAppData = useCallback(async () => {
    try {
      const [prog, secs] = await Promise.all([
        api.getProgress(),
        api.getSections(),
      ]);
      setProgress(prog);
      setSections(secs);

      const nodeMap: Record<string, GameNode[]> = {};
      for (const s of secs) {
        nodeMap[s.id] = await api.getNodes(s.id);
      }
      setNodes(nodeMap);
    } catch (err) {
      console.error('Error cargando datos del templo:', err);
    }
  }, []);

  // Initial auth
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (api.getToken()) {
          const me = await api.getCurrentUser();
          const savedAvatar = localStorage.getItem('zuma_user_avatar');
          const savedNick = localStorage.getItem('zuma_user_nickname');
          setUser({
            ...me,
            avatar: savedAvatar || me.avatar || '🦅',
            nickname: savedNick || me.nickname || 'MIGUELITO',
          });
          await loadAppData();
        } else {
          setShowLoginModal(true);
        }
      } catch {
        api.setToken(null);
        setShowLoginModal(true);
      } finally {
        setLoadingInitial(false);
      }
    };

    initAuth();
  }, [loadAppData]);

  const handleLogout = () => {
    api.setToken(null);
    setUser(null);
    setShowLoginModal(true);
  };

  const handleLoginSuccess = async (loggedUser: User) => {
    const savedAvatar = localStorage.getItem('zuma_user_avatar');
    const savedNick = localStorage.getItem('zuma_user_nickname');
    setUser({
      ...loggedUser,
      avatar: savedAvatar || loggedUser.avatar || '🦅',
      nickname: savedNick || loggedUser.nickname || 'MIGUELITO',
    });
    setShowLoginModal(false);
    setActiveTab('feed');
    await loadAppData();
  };

  // Save Settings & Profile
  const handleSaveSettings = (updatedUser: Partial<User>, newSettings: GameSettings) => {
    if (user) {
      const mergedUser: User = {
        ...user,
        ...updatedUser,
      };
      setUser(mergedUser);
      if (updatedUser.nickname) {
        localStorage.setItem('zuma_user_nickname', updatedUser.nickname);
      }
      if (updatedUser.avatar) {
        localStorage.setItem('zuma_user_avatar', updatedUser.avatar);
      }
    }
    setSettings(newSettings);
    localStorage.setItem('zuma_settings', JSON.stringify(newSettings));
  };

  // Node Selected on Sendero Map
  const handleSelectNode = (node: GameNode) => {
    setSelectedNode(node);
  };

  // Play Level from Sendero Map (5 Levels)
  const handlePlayLevel = (levelNumber: number, title: string, gameType: 'tetris' | 'memorama' | 'balanza' | 'kukulcan') => {
    const energyCost = levelNumber === 4 ? 2 : levelNumber === 5 ? 3 : 1;
    if (jadeEnergy < energyCost) {
      setEnergyAlert(`¡Energía de Jade insuficiente (${jadeEnergy}/10)! Necesitas ${energyCost} pts. Se recarga en 24h.`);
      setTimeout(() => setEnergyAlert(null), 4000);
      return;
    }

    // Deduct Jade energy points
    setJadeEnergy((prev) => Math.max(0, prev - energyCost));

    // Construct playing node
    const syntheticNode: GameNode = {
      id: `level-${levelNumber}`,
      sectionId: 'sec-palenque',
      order: levelNumber,
      title: title,
      isBoss: levelNumber === 5,
      status: 'active',
      stars: 0,
      jadeCoins: 50,
    };

    setPlayingNode(syntheticNode);
    setActiveGameType(gameType);
  };

  // Select Game from Node Chooser Modal
  const handleSelectGameForNode = (node: GameNode, game: 'tetris' | 'memorama') => {
    if (jadeEnergy < 1) {
      setEnergyAlert('¡Energía de Jade agotada (0/10)! Espera a la recarga diaria de 24 horas.');
      setTimeout(() => setEnergyAlert(null), 4000);
      return;
    }
    setJadeEnergy((prev) => Math.max(0, prev - 1));
    setSelectedNode(null);
    setPlayingNode(node);
    setActiveGameType(game);
  };

  // On Victory in a Level or Node
  const handleNodeVictory = async (stars: number, coins: number) => {
    if (playingNode) {
      if (playingNode.id === 'level-4') {
        setLevel4Completed(true);
        localStorage.setItem('zuma_level4_completed', 'true');
      }
      try {
        await api.updateProgress(playingNode.id, stars, coins);
        await loadAppData();
      } catch (err) {
        console.error('Error guardando progreso del nodo:', err);
      }
    }
  };

  if (loadingInitial) {
    return (
      <div className="relative min-h-screen bg-[#100506] flex flex-col items-center justify-center p-4 overflow-hidden">
        <CosmicBackground speed={0.8} dimmed={true} interactive={false} />
        <PixelArtSpinner size="lg" message="CONSULTANDO EL CÓDICE SAGRADO..." />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-transparent text-[#FFFDF2] flex flex-col justify-between selection:bg-[#2A7B4C] selection:text-[#FFFDF2]">
      {/* Fondo cósmico persistente para TODAS las pantallas (Feed, Sendero, Arcade, Códice, Login) */}
      {!activeGameType && !isArcadePlaying && (
        <CosmicBackground speed={user ? 0.65 : 1.0} dimmed={Boolean(user)} interactive={true} />
      )}

      {/* Main Container */}
      <div className="flex-1 flex flex-col">
        {/* Header: visible across all main tabs (Feed, Sendero, Arcade, Codex) */}
        {user && !activeGameType && !isArcadePlaying && (
          <Header
            user={user}
            progress={progress}
            jadeEnergy={jadeEnergy}
            language={settings.language}
            onLogout={handleLogout}
            onOpenSettings={() => setShowSettingsModal(true)}
            onGoToFeed={() => {
              setActiveTab('feed');
              setPlayingNode(null);
              setActiveGameType(null);
              setIsArcadePlaying(false);
            }}
          />
        )}

        {/* Depleted Energy Banner Toast */}
        {energyAlert && (
          <div className="w-full max-w-[440px] mx-auto px-2.5 pt-2 animate-in slide-in-from-top-2 duration-200">
            <div className="bg-[#9E2A2B] text-[#FFFDF2] font-press-start text-[8.5px]/[13px] p-2.5 rounded-[2px] border-2 border-[#FFFDF2]/40 [box-shadow:inset_1px_1px_0px_#ffffff33,_0px_4px_10px_rgba(0,0,0,0.8)] flex items-center justify-between">
              <span>{energyAlert}</span>
              <button
                onClick={() => setEnergyAlert(null)}
                className="ml-2 text-[#FFFDF2] font-bold text-xs hover:text-[#2A7B4C]"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <main className="flex-1">
          {/* Active Minigame (from Node Challenge or Sendero Map launch) in Fullscreen */}
          {activeGameType && (
            <div className="fixed inset-0 z-50 w-screen h-screen bg-[#141414] overflow-y-auto overflow-x-hidden flex flex-col justify-start items-center">
              <FloatingGameControl
                onExit={() => {
                  setPlayingNode(null);
                  setActiveGameType(null);
                  loadAppData();
                }}
                onRestart={() => {
                  const currentType = activeGameType;
                  setActiveGameType(null);
                  setTimeout(() => setActiveGameType(currentType), 50);
                }}
                gameTitle={
                  playingNode?.title ||
                  (activeGameType === 'tetris'
                    ? 'TETRIS AZTECA'
                    : activeGameType === 'memorama'
                    ? 'MÁSCARAS GEMELAS'
                    : activeGameType === 'balanza'
                    ? 'BALANZA SAGRADA'
                    : 'ORBES DE KUKULCÁN')
                }
                language={settings.language}
              />
              {activeGameType === 'tetris' && (
                <MayaTetris
                  node={playingNode}
                  onClose={() => {
                    setPlayingNode(null);
                    setActiveGameType(null);
                    loadAppData();
                  }}
                  onVictory={handleNodeVictory}
                />
              )}
              {activeGameType === 'memorama' && (
                <MayaMemorama
                  node={playingNode}
                  onClose={() => {
                    setPlayingNode(null);
                    setActiveGameType(null);
                    loadAppData();
                  }}
                  onVictory={handleNodeVictory}
                />
              )}
              {activeGameType === 'balanza' && (
                <BalanzaSagrada
                  onClose={() => {
                    setPlayingNode(null);
                    setActiveGameType(null);
                    loadAppData();
                  }}
                  onReward={(coins) => handleNodeVictory(3, coins || 50)}
                />
              )}
              {activeGameType === 'kukulcan' && (
                <KukulcanOrbs
                  onClose={() => {
                    setPlayingNode(null);
                    setActiveGameType(null);
                    loadAppData();
                  }}
                  onReward={(coins) => handleNodeVictory(3, coins || 60)}
                />
              )}
            </div>
          )}

          {activeTab === 'feed' && user ? (
            <FeedView
              user={user}
              progress={progress}
              language={settings.language}
              onOpenSendero={() => setActiveTab('sendero')}
              onOpenMinigames={() => setActiveTab('arcade')}
              onOpenCodex={() => setActiveTab('codex')}
            />
          ) : activeTab === 'sendero' ? (
            <SenderoMap
              jadeEnergy={jadeEnergy}
              level4Completed={level4Completed}
              onPlayLevel={handlePlayLevel}
              onBackToFeed={() => setActiveTab('feed')}
            />
          ) : activeTab === 'arcade' ? (
            <MinigamesHub
              onBackToFeed={() => setActiveTab('feed')}
              onGameActiveChange={setIsArcadePlaying}
              onRewardCoins={() => loadAppData()}
              language={settings.language}
            />
          ) : activeTab === 'codex' ? (
            <CodexView onBackToFeed={() => setActiveTab('feed')} />
          ) : null}
        </main>
      </div>

      {/* Settings & Profile Modal */}
      {showSettingsModal && user && (
        <SettingsModal
          user={user}
          settings={settings}
          onSave={handleSaveSettings}
          onClose={() => setShowSettingsModal(false)}
        />
      )}

      {/* Node Detail & Minigame Chooser Modal */}
      {selectedNode && (
        <NodeDetailModal
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          onSelectGame={handleSelectGameForNode}
        />
      )}

      {/* Login Modal */}
      {showLoginModal && <LoginModal onSuccess={handleLoginSuccess} />}

      {/* Fixed Bottom Navigation (visible unless in an active game session) */}
      {!activeGameType && !isArcadePlaying && user && (
        <BottomNav
          activeTab={activeTab}
          language={settings.language}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            setPlayingNode(null);
            setActiveGameType(null);
            setIsArcadePlaying(false);
          }}
        />
      )}
    </div>
  );
};

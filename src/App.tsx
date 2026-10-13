import React, { useState, useEffect, useCallback } from 'react';
import { User, Section, GameNode, ProgressSummary } from './types';
import { api } from './api';
import { Header } from './components/Header';
import { GrecaBar } from './components/GrecaBar';
import { LoginModal } from './components/LoginModal';
import { FeedView } from './components/FeedView';
import { SenderoMap } from './components/SenderoMap';
import { ZumaGame } from './components/ZumaGame';
import { MayaTetris } from './components/games/MayaTetris';
import { MayaMemorama } from './components/games/MayaMemorama';
import { MinigamesHub } from './components/games/MinigamesHub';
import { CodexView } from './components/CodexView';
import { LeaderboardView } from './components/LeaderboardView';
import { ClassroomView } from './components/ClassroomView';
import { NodeDetailModal } from './components/NodeDetailModal';

export const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<ProgressSummary | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [nodes, setNodes] = useState<Record<string, GameNode[]>>({});
  const [activeTab, setActiveTab] = useState<'feed' | 'sendero' | 'arcade' | 'codex' | 'leaderboard' | 'classrooms'>('feed');

  // Modal / Game states
  const [playingNode, setPlayingNode] = useState<GameNode | null>(null);
  const [activeMinigame, setActiveMinigame] = useState<'zuma' | 'tetris' | 'memorama' | null>(null);
  const [selectedNode, setSelectedNode] = useState<GameNode | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Load app data
  const loadAppData = useCallback(async () => {
    try {
      const [prog, secs] = await Promise.all([
        api.getProgress(),
        api.getSections(),
      ]);
      setProgress(prog);
      setSections(secs);

      // Load nodes for each section
      const nodeMap: Record<string, GameNode[]> = {};
      for (const s of secs) {
        nodeMap[s.id] = await api.getNodes(s.id);
      }
      setNodes(nodeMap);
    } catch (err) {
      console.error('Error cargando datos del templo:', err);
    }
  }, []);

  // Initial user session verification
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (api.getToken()) {
          const me = await api.getCurrentUser();
          setUser(me);
          await loadAppData();
        } else {
          // Default to demo login for immediate seamless boot
          const demo = await api.login('balam@zuma.dev', 'zuma1234');
          setUser(demo.user);
          await loadAppData();
        }
      } catch {
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
    setUser(loggedUser);
    setShowLoginModal(false);
    await loadAppData();
  };

  // Node Clicked on Map
  const handleSelectNode = (node: GameNode) => {
    setSelectedNode(node);
  };

  const handleStartGameFromModal = (node: GameNode) => {
    setSelectedNode(null);
    setPlayingNode(node);
    setActiveMinigame('zuma');
  };

  if (loadingInitial) {
    return (
      <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center font-press-start text-xs text-[#d99b26] space-y-4">
        <div className="text-4xl animate-bounce">🐸</div>
        <div>CONSULTANDO EL CÓDICE SAGRADO...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414] text-[#f4efe6] flex flex-col justify-between selection:bg-[#d99b26] selection:text-black">
      {/* Top Mesoamerican Greca border */}
      <GrecaBar />

      {/* Main Application Container */}
      <div className="flex-1 flex flex-col">
        {user && (
          <Header
            user={user}
            progress={progress}
            activeTab={activeTab}
            setActiveTab={(tab) => {
              setActiveTab(tab);
              setPlayingNode(null);
              setActiveMinigame(null);
            }}
            onLogout={handleLogout}
          />
        )}

        <main className="flex-1 pb-10">
          {/* Active Minigame Overlay (if triggered from Feed or Map) */}
          {activeMinigame === 'zuma' ? (
            <ZumaGame
              node={playingNode}
              onClose={() => {
                setPlayingNode(null);
                setActiveMinigame(null);
                loadAppData();
              }}
              onProgressUpdated={loadAppData}
            />
          ) : activeMinigame === 'tetris' ? (
            <MayaTetris
              onClose={() => {
                setActiveMinigame(null);
                loadAppData();
              }}
            />
          ) : activeMinigame === 'memorama' ? (
            <MayaMemorama
              onClose={() => {
                setActiveMinigame(null);
                loadAppData();
              }}
            />
          ) : activeTab === 'feed' && user ? (
            <FeedView
              user={user}
              progress={progress}
              onContinueSenda={() => setActiveTab('sendero')}
              onPlayTetris={() => setActiveMinigame('tetris')}
              onPlayZuma={() => setActiveMinigame('zuma')}
              onPlayMemorama={() => setActiveMinigame('memorama')}
              onOpenCodex={() => setActiveTab('codex')}
            />
          ) : activeTab === 'sendero' ? (
            <SenderoMap
              sections={sections}
              nodes={nodes}
              onSelectNode={handleSelectNode}
            />
          ) : activeTab === 'arcade' ? (
            <MinigamesHub
              onBackToSendero={() => setActiveTab('sendero')}
            />
          ) : activeTab === 'codex' ? (
            <CodexView />
          ) : activeTab === 'leaderboard' ? (
            user && <LeaderboardView currentUser={user} />
          ) : activeTab === 'classrooms' ? (
            user && <ClassroomView user={user} />
          ) : null}
        </main>
      </div>

      {/* Node Detail Modal */}
      {selectedNode && (
        <NodeDetailModal
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          onStartGame={handleStartGameFromModal}
        />
      )}

      {/* Login Modal */}
      {showLoginModal && <LoginModal onSuccess={handleLoginSuccess} />}

      {/* Bottom Mesoamerican Greca border */}
      <GrecaBar />
    </div>
  );
};

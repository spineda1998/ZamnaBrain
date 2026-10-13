import React, { useRef, useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { GameNode } from '../types';
import { api } from '../api';
import { Star, RefreshCw, Volume2, ArrowLeft, Zap, Sparkles, AlertCircle } from 'lucide-react';

interface ZumaGameProps {
  node?: GameNode | null;
  onClose: () => void;
  onProgressUpdated?: () => void;
}

// Orb Colors & Glyphs
interface OrbColor {
  id: string;
  name: string;
  color: string;
  glyph: string;
  secondary: string;
}

const ORB_TYPES: OrbColor[] = [
  { id: 'jade', name: 'Jade Sagrado', color: '#10b981', glyph: '🟢', secondary: '#047857' },
  { id: 'solar', name: 'Oro Solar', color: '#f59e0b', glyph: '🟡', secondary: '#b45309' },
  { id: 'ruby', name: 'Rojo Templo', color: '#ef4444', glyph: '🔴', secondary: '#b91c1c' },
  { id: 'sky', name: 'Turquesa Cenote', color: '#06b6d4', glyph: '🔵', secondary: '#0e7490' },
  { id: 'amethyst', name: 'Amatista Xibalba', color: '#a855f7', glyph: '🟣', secondary: '#7e22ce' },
];

interface PathPoint {
  x: number;
  y: number;
}

interface Orb {
  color: OrbColor;
  distance: number; // along path in pixels
}

interface Projectile {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: OrbColor;
}

// Educational Brain Questions
const BRAIN_QUESTIONS = [
  {
    q: '¿Cuánto vale en el sistema maya: 2 barras (⎯⎯) y 3 puntos (●●●)?',
    options: ['13', '8', '11', '15'],
    correct: 0,
    hint: 'Cada barra vale 5 y cada punto vale 1.',
  },
  {
    q: '¿Qué símbolo representa el número 0 en la aritmética maya?',
    options: ['Una concha marina (semilla)', 'Un círculo vacío', 'Una cruz ceremonial', 'Un jaguar'],
    correct: 0,
    hint: 'Los mayas usaban una concha estilizada o semilla de cacao.',
  },
  {
    q: 'Suma vigesimal: Una barra (⎯) + 4 puntos (●●●●) = ?',
    options: ['9', '7', '14', '20'],
    correct: 0,
    hint: '5 + 4 = 9',
  },
  {
    q: 'En el sistema vigesimal, ¿cuál es el valor de la segunda posición (veintenas)?',
    options: ['20', '10', '100', '40'],
    correct: 0,
    hint: 'La base es 20, por lo que la segunda posición multiplica por 20.',
  },
  {
    q: 'Si tienes 3 barras (⎯⎯⎯), ¿a qué número equivale?',
    options: ['15', '12', '18', '20'],
    correct: 0,
    hint: '3 × 5 = 15',
  },
  {
    q: '¿Cuántos días tiene el calendario ritual sagrado Tzolkin?',
    options: ['260 días', '365 días', '360 días', '52 días'],
    correct: 0,
    hint: '13 números combinados con 20 nombres de día = 260.',
  },
];

export const ZumaGame: React.FC<ZumaGameProps> = ({
  node,
  onClose,
  onProgressUpdated,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [victory, setVictory] = useState(false);
  const [starsWon, setStarsWon] = useState(0);
  const [jadeWon, setJadeWon] = useState(0);
  const [savingProgress, setSavingProgress] = useState(false);

  // Brain Challenge State
  const [showBrainQuestion, setShowBrainQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(BRAIN_QUESTIONS[0]);
  const [powerUpActive, setPowerUpActive] = useState(false);
  const [powerUpTimer, setPowerUpTimer] = useState(0);

  // Next and current ammo
  const [currentAmmo, setCurrentAmmo] = useState<OrbColor>(ORB_TYPES[0]);
  const [nextAmmo, setNextAmmo] = useState<OrbColor>(ORB_TYPES[1]);

  // Game internal refs for canvas animation loop
  const gameStateRef = useRef({
    path: [] as PathPoint[],
    orbs: [] as Orb[],
    projectiles: [] as Projectile[],
    aimAngle: -Math.PI / 2,
    speed: 0.6,
    running: true,
    score: 0,
    orbsSpawned: 0,
    maxOrbs: 36,
  });

  // Generate an Archimedean spiral track for the Zuma track
  const generateTrack = useCallback((width: number, height: number): PathPoint[] => {
    const points: PathPoint[] = [];
    const cx = width / 2;
    const cy = height / 2;
    const maxRadius = Math.min(width, height) * 0.44;
    const loops = 2.4;
    const steps = 600;

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      // Start outside and spiral inward toward the central/upper temple skull mouth
      const angle = t * loops * Math.PI * 2;
      const radius = maxRadius * (1 - t * 0.65);
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle) * 0.85; // slightly elliptic
      points.push({ x, y });
    }
    return points;
  }, []);

  // Initialize Level
  const initGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.width;
    const height = canvas.height;
    const path = generateTrack(width, height);

    const initialOrbs: Orb[] = [];
    const count = 18;
    for (let i = 0; i < count; i++) {
      const randomColor = ORB_TYPES[Math.floor(Math.random() * 4)];
      initialOrbs.push({
        color: randomColor,
        distance: (count - i) * 28,
      });
    }

    gameStateRef.current = {
      path,
      orbs: initialOrbs,
      projectiles: [],
      aimAngle: -Math.PI / 2,
      speed: node?.isBoss ? 0.75 : 0.55,
      running: true,
      score: 0,
      orbsSpawned: count,
      maxOrbs: node?.isBoss ? 45 : 32,
    };

    setScore(0);
    setGameOver(false);
    setVictory(false);
    setPowerUpActive(false);
    setCurrentAmmo(ORB_TYPES[Math.floor(Math.random() * 4)]);
    setNextAmmo(ORB_TYPES[Math.floor(Math.random() * 4)]);
  }, [generateTrack, node]);

  // Trigger Brain Question mid-game
  const triggerQuestion = () => {
    const randomQ = BRAIN_QUESTIONS[Math.floor(Math.random() * BRAIN_QUESTIONS.length)];
    setCurrentQuestion(randomQ);
    setShowBrainQuestion(true);
  };

  const handleAnswerQuestion = (optionIdx: number) => {
    if (optionIdx === currentQuestion.correct) {
      // Correct! Activate Kukulkan Divine Power (slow down orbs + explosive radius)
      setPowerUpActive(true);
      setPowerUpTimer(10);
      setScore((s) => s + 250);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    }
    setShowBrainQuestion(false);
  };

  // Swap Ammo
  const swapAmmo = () => {
    setCurrentAmmo(nextAmmo);
    setNextAmmo(currentAmmo);
  };

  // Shoot Projectile
  const handleShoot = useCallback((targetX: number, targetY: number) => {
    if (gameOver || victory || showBrainQuestion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const angle = Math.atan2(targetY - cy, targetX - cx);

    const speed = 12;
    gameStateRef.current.projectiles.push({
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color: currentAmmo,
    });

    setCurrentAmmo(nextAmmo);
    setNextAmmo(ORB_TYPES[Math.floor(Math.random() * 4)]);
  }, [currentAmmo, nextAmmo, gameOver, victory, showBrainQuestion]);

  // Main Canvas Render & Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      const state = gameStateRef.current;
      const { path, orbs, projectiles } = state;
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;

      ctx.clearRect(0, 0, width, height);

      // ── Draw Mesoamerican Stone Floor & Background ──
      ctx.fillStyle = '#171717';
      ctx.fillRect(0, 0, width, height);

      // Grid / temple stone carving patterns
      ctx.strokeStyle = '#262626';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // ── Draw Track Trench ──
      if (path.length > 1) {
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length; i++) {
          ctx.lineTo(path[i].x, path[i].y);
        }
        ctx.strokeStyle = '#2a2215';
        ctx.lineWidth = 36;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        ctx.strokeStyle = '#453823';
        ctx.lineWidth = 26;
        ctx.stroke();

        ctx.strokeStyle = '#d99b2633';
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 8]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // ── Draw Skull Maw / Pit of Xibalba at path end ──
      if (path.length > 0) {
        const pit = path[path.length - 1];
        ctx.fillStyle = '#140c0c';
        ctx.beginPath();
        ctx.arc(pit.x, pit.y, 24, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#a62b2b';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.font = '20px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('💀', pit.x, pit.y);
      }

      // ── Update and Draw Orbs ──
      const currentSpeed = powerUpActive ? state.speed * 0.35 : state.speed;

      if (!showBrainQuestion && !gameOver && !victory) {
        // Advance orbs along path
        for (let i = 0; i < orbs.length; i++) {
          orbs[i].distance += currentSpeed;
        }

        // Spawn extra orbs periodically until limit
        if (state.orbsSpawned < state.maxOrbs && Math.random() < 0.02) {
          const lastOrb = orbs[0];
          if (!lastOrb || lastOrb.distance > 30) {
            orbs.unshift({
              color: ORB_TYPES[Math.floor(Math.random() * 4)],
              distance: 0,
            });
            state.orbsSpawned++;
          }
        }
      }

      // Check if front orb entered Xibalba Pit
      const totalPathLength = path.length * 1.5;
      if (orbs.length > 0 && orbs[orbs.length - 1].distance >= totalPathLength) {
        setGameOver(true);
      }

      // Draw each orb
      const orbRadius = 13;
      orbs.forEach((orb) => {
        const pathIndex = Math.min(
          path.length - 1,
          Math.max(0, Math.floor(orb.distance / 1.5)),
        );
        const point = path[pathIndex];
        if (!point) return;

        // Orb circle
        ctx.beginPath();
        ctx.arc(point.x, point.y, orbRadius, 0, Math.PI * 2);
        ctx.fillStyle = orb.color.color;
        ctx.fill();

        ctx.strokeStyle = orb.color.secondary;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Inner Mayan Glyph or core highlight
        ctx.beginPath();
        ctx.arc(point.x - 3, point.y - 3, 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.45)';
        ctx.fill();
      });

      // ── Update and Draw Projectiles ──
      for (let pIdx = projectiles.length - 1; pIdx >= 0; pIdx--) {
        const proj = projectiles[pIdx];
        proj.x += proj.vx;
        proj.y += proj.vy;

        // Draw projectile
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, 14, 0, Math.PI * 2);
        ctx.fillStyle = proj.color.color;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Check collision with orbs
        let hit = false;
        for (let oIdx = 0; oIdx < orbs.length; oIdx++) {
          const orb = orbs[oIdx];
          const pathIndex = Math.min(
            path.length - 1,
            Math.max(0, Math.floor(orb.distance / 1.5)),
          );
          const pt = path[pathIndex];
          if (!pt) continue;

          const dist = Math.hypot(proj.x - pt.x, proj.y - pt.y);
          if (dist < 26) {
            hit = true;

            // Insert new orb at collision position
            orbs.splice(oIdx, 0, {
              color: proj.color,
              distance: orb.distance - 26,
            });

            // Check match of 3 or more consecutive identical colors
            let start = oIdx;
            while (start > 0 && orbs[start - 1].color.id === proj.color.id) {
              start--;
            }
            let end = oIdx;
            while (end < orbs.length - 1 && orbs[end + 1].color.id === proj.color.id) {
              end++;
            }

            const matchCount = end - start + 1;
            if (matchCount >= 3) {
              orbs.splice(start, matchCount);
              const pointsEarned = matchCount * 100 + (matchCount > 3 ? 150 : 0);
              state.score += pointsEarned;
              setScore((s) => s + pointsEarned);

              // Chance to pop a Brain Gate question!
              if (Math.random() < 0.25 && !showBrainQuestion && !powerUpActive) {
                triggerQuestion();
              }
            }

            // Check victory condition: all spawned and track cleared!
            if (state.orbsSpawned >= state.maxOrbs && orbs.length === 0) {
              setVictory(true);
            }

            break;
          }
        }

        // Out of bounds
        if (
          proj.x < 0 ||
          proj.x > width ||
          proj.y < 0 ||
          proj.y > height ||
          hit
        ) {
          projectiles.splice(pIdx, 1);
        }
      }

      // ── Draw Central Ajau Launcher (Frog Idol) ──
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(state.aimAngle + Math.PI / 2);

      // Launcher Platform / Idol
      ctx.fillStyle = '#a62b2b';
      ctx.beginPath();
      ctx.arc(0, 0, 32, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#d99b26';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Aiming Spout
      ctx.fillStyle = '#7a1f1f';
      ctx.fillRect(-10, -38, 20, 20);
      ctx.strokeStyle = '#d99b26';
      ctx.strokeRect(-10, -38, 20, 20);

      // Current Orb inside mouth
      ctx.beginPath();
      ctx.arc(0, -22, 12, 0, Math.PI * 2);
      ctx.fillStyle = currentAmmo.color;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Idol Face / Frog Eyes
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(-14, -6, 7, 0, Math.PI * 2);
      ctx.arc(14, -6, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(-14, -6, 3, 0, Math.PI * 2);
      ctx.arc(14, -6, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Next Ammo Preview in corner
      ctx.fillStyle = '#222';
      ctx.beginPath();
      ctx.arc(cx - 50, cy + 45, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#555';
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx - 50, cy + 45, 10, 0, Math.PI * 2);
      ctx.fillStyle = nextAmmo.color;
      ctx.fill();

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [currentAmmo, nextAmmo, powerUpActive, showBrainQuestion, gameOver, victory]);

  // Track Aim Mouse Movement
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    gameStateRef.current.aimAngle = Math.atan2(y - cy, x - cx);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    handleShoot(x, y);
  };

  // On Victory: calculate rewards & stars
  useEffect(() => {
    if (victory) {
      const calculatedStars = score >= 1200 ? 3 : score >= 600 ? 2 : 1;
      const calculatedJade = calculatedStars * 40 + (node?.isBoss ? 80 : 30);
      setStarsWon(calculatedStars);
      setJadeWon(calculatedJade);

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
      });

      // Synchronize with backend API if this is a Sendero node
      if (node) {
        setSavingProgress(true);
        api
          .updateProgress(node.id, calculatedStars, calculatedJade)
          .then(() => {
            if (onProgressUpdated) onProgressUpdated();
          })
          .catch((err) => console.error('Error saving progress:', err))
          .finally(() => setSavingProgress(false));
      }
    }
  }, [victory, score, node, onProgressUpdated]);

  // Timer for active power-up
  useEffect(() => {
    if (!powerUpActive) return;
    const interval = setInterval(() => {
      setPowerUpTimer((t) => {
        if (t <= 1) {
          setPowerUpActive(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [powerUpActive]);

  // Auto-init on mount
  useEffect(() => {
    initGame();
  }, [initGame]);

  return (
    <div className="max-w-4xl mx-auto py-4 px-2 space-y-4">
      {/* Top Bar with score, lives, and control */}
      <div className="bg-[#1f1f1f] border-2 border-[#a62b2b] p-3 rounded-lg flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1.5 bg-[#2d2d2d] hover:bg-[#3d3d3d] rounded text-[#d99b26] flex items-center gap-1 font-silkscreen text-xs border border-[#444]"
          >
            <ArrowLeft className="w-4 h-4" /> Volver
          </button>
          <div>
            <h3 className="font-press-start text-xs text-[#fbbf24]">
              {node ? node.title : 'MODO ARCADE — TEMPLO DE ENTRENAMIENTO'}
            </h3>
            <span className="font-silkscreen text-[11px] text-[#9ca3af]">
              {node ? node.category : 'Práctica Libre de Agilidad Mental'}
            </span>
          </div>
        </div>

        {/* Game Stats */}
        <div className="flex items-center gap-4">
          <div className="font-press-start text-xs text-[#22c55e]">
            PUNTOS: <span className="text-[#f4efe6]">{score}</span>
          </div>

          {powerUpActive && (
            <div className="flex items-center gap-1 bg-[#3b82f6] text-white px-2 py-0.5 rounded text-[10px] font-press-start animate-pulse">
              <Zap className="w-3 h-3 fill-current" /> TIEMPO LENTO ({powerUpTimer}s)
            </div>
          )}

          <button
            onClick={swapAmmo}
            className="p-1.5 bg-[#a62b2b] hover:bg-[#c0392b] text-[#f4efe6] rounded border border-[#d99b26] font-silkscreen text-xs flex items-center gap-1"
            title="Cambiar esfera (Barra espaciadora)"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Cambiar Esfera
          </button>
        </div>
      </div>

      {/* Main Game Screen Canvas */}
      <div className="relative bg-[#141414] border-4 border-[#333] rounded-lg overflow-hidden shadow-2xl flex justify-center">
        <canvas
          ref={canvasRef}
          width={760}
          height={500}
          onMouseMove={handleMouseMove}
          onClick={handleCanvasClick}
          className="cursor-crosshair max-w-full h-auto"
        />

        {/* Modal: Educational Mayan Brain Question Gate */}
        {showBrainQuestion && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm z-30 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-[#221c17] border-4 border-[#d99b26] p-6 rounded-lg shadow-2xl space-y-4 text-center">
              <div className="inline-flex items-center gap-1 px-3 py-1 bg-[#d99b26] text-black font-press-start text-[10px] rounded-full font-bold">
                <Sparkles className="w-3.5 h-3.5" /> RETO DEL CÓDICE SAGRADO
              </div>
              <h4 className="font-press-start text-xs text-[#f4efe6] leading-relaxed">
                {currentQuestion.q}
              </h4>
              <p className="font-silkscreen text-xs text-[#fbbf24]">
                Pista: {currentQuestion.hint}
              </p>

              <div className="grid grid-cols-2 gap-2 pt-2">
                {currentQuestion.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswerQuestion(i)}
                    className="p-3 bg-[#31250b] hover:bg-[#d99b26] hover:text-black text-[#f4efe6] border-2 border-[#d99b26] rounded font-silkscreen text-xs font-bold transition text-left retro-button cursor-pointer"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Modal: Game Over Screen */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm z-30 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-[#261717] border-4 border-[#ef4444] p-6 rounded-lg shadow-2xl space-y-4 text-center">
              <div className="text-4xl">💀</div>
              <h3 className="font-press-start text-base text-[#ef4444]">
                ¡LAS SOMBRAS DE XIBALBA TE HAN ALCANZADO!
              </h3>
              <p className="font-silkscreen text-xs text-[#d1d5db]">
                El rastro ceremonial llegó al abismo. Los sacerdotes mayas aguardan tu revancha.
              </p>
              <div className="font-press-start text-xs text-[#fbbf24]">
                PUNTOS OBTENIDOS: {score}
              </div>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={initGame}
                  className="px-4 py-2 bg-[#a62b2b] hover:bg-[#c0392b] text-[#f4efe6] border-2 border-[#d99b26] rounded font-press-start text-xs retro-button"
                >
                  REINTENTAR
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-[#333] hover:bg-[#444] text-[#f4efe6] border border-[#666] rounded font-press-start text-xs"
                >
                  SALIR AL MAPA
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Victory Screen */}
        {victory && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm z-30 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-[#18261c] border-4 border-[#22c55e] p-6 rounded-lg shadow-2xl space-y-4 text-center">
              <div className="text-4xl">👑</div>
              <h3 className="font-press-start text-base text-[#22c55e]">
                ¡VICTORIA EN EL TEMPLO!
              </h3>
              <p className="font-silkscreen text-xs text-[#d1d5db]">
                Has despejado el Sendero Sagrado y demostrado sabiduría ancestral ante los dioses.
              </p>

              {/* Stars Won */}
              <div className="flex justify-center items-center gap-2 py-2">
                {[1, 2, 3].map((s) => (
                  <Star
                    key={s}
                    className={`w-7 h-7 ${
                      s <= starsWon
                        ? 'text-[#fbbf24] fill-[#fbbf24] animate-bounce'
                        : 'text-[#444]'
                    }`}
                  />
                ))}
              </div>

              {/* Rewards Summary */}
              <div className="bg-[#14291c] p-3 rounded border border-[#22c55e] flex justify-around font-press-start text-xs">
                <div className="text-[#22c55e]">
                  🟢 +{jadeWon} JADE
                </div>
                <div className="text-[#fbbf24]">
                  ⭐ {starsWon} ESTRELLAS
                </div>
              </div>

              {savingProgress && (
                <p className="font-silkscreen text-[11px] text-[#fbbf24]">
                  Inscribiendo tu gloria en el códice del templo...
                </p>
              )}

              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={initGame}
                  className="px-4 py-2 bg-[#2d2d2d] hover:bg-[#3d3d3d] text-[#f4efe6] border border-[#555] rounded font-press-start text-xs"
                >
                  JUGAR DE NUEVO
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-[#d99b26] hover:bg-[#f59e0b] text-black border-2 border-[#fff] rounded font-press-start text-xs font-bold retro-button"
                >
                  CONTINUAR SENDERO
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Control hints */}
      <div className="flex flex-wrap items-center justify-between text-xs font-silkscreen text-[#9ca3af] bg-[#1a1a1a] p-2.5 rounded border border-[#333]">
        <div className="flex items-center gap-4">
          <span>🎯 <strong>Mover cursor:</strong> Apuntar ídolo</span>
          <span>🖱️ <strong>Click izquierdo:</strong> Disparar esfera</span>
          <span>⚡ <strong>Combinar 3+:</strong> Despejar rastro</span>
        </div>
        <div className="text-[#fbbf24]">
          💡 Responde las preguntas de sabiduría para ralentizar el tiempo
        </div>
      </div>
    </div>
  );
};

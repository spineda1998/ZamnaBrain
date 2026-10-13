import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, RotateCw, ArrowDown, ArrowLeft as MoveLeft, ArrowRight as MoveRight, Zap, RefreshCw, Trophy, Sparkles } from 'lucide-react';
import { GrecaBar } from '../GrecaBar';

interface MayaTetrisProps {
  onClose: () => void;
  onReward?: (coins: number) => void;
}

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 24;

// 7 Tetrominoes with Mayan colors and textures
const SHAPES = [
  // I (Jade)
  { shape: [[1, 1, 1, 1]], color: '#10b981', secondary: '#047857', name: 'Barra de Jade' },
  // J (Turquoise)
  { shape: [[1, 0, 0], [1, 1, 1]], color: '#06b6d4', secondary: '#0e7490', name: 'Glifo L' },
  // L (Solar Amber)
  { shape: [[0, 0, 1], [1, 1, 1]], color: '#f59e0b', secondary: '#b45309', name: 'Escuadra Solar' },
  // O (Temple Gold)
  { shape: [[1, 1], [1, 1]], color: '#fbbf24', secondary: '#d97706', name: 'Bloque Ceremonial' },
  // S (Cenote Green)
  { shape: [[0, 1, 1], [1, 1, 0]], color: '#22c55e', secondary: '#15803d', name: 'Serpiente S' },
  // T (Ruby Coral)
  { shape: [[0, 1, 0], [1, 1, 1]], color: '#ef4444', secondary: '#b91c1c', name: 'Altar T' },
  // Z (Obsidian Purple)
  { shape: [[1, 1, 0], [0, 1, 1]], color: '#a855f7', secondary: '#7e22ce', name: 'Relámpago Z' },
];

export const MayaTetris: React.FC<MayaTetrisProps> = ({ onClose, onReward }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [mathBonusActive, setMathBonusActive] = useState(false);

  // Sound generator using Web Audio API
  const playSound = useCallback((freq: number, type: OscillatorType = 'square', duration = 0.08) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch {
      // Audio might be blocked by browser policy until interaction
    }
  }, []);

  const gridRef = useRef<number[][]>(
    Array.from({ length: ROWS }, () => Array(COLS).fill(0))
  );
  const colorsRef = useRef<string[][]>(
    Array.from({ length: ROWS }, () => Array(COLS).fill(''))
  );

  const currentPieceRef = useRef<{
    shape: number[][];
    color: string;
    secondary: string;
    x: number;
    y: number;
  }>({
    shape: SHAPES[0].shape,
    color: SHAPES[0].color,
    secondary: SHAPES[0].secondary,
    x: 3,
    y: 0,
  });

  const spawnPiece = useCallback(() => {
    const randomIdx = Math.floor(Math.random() * SHAPES.length);
    const chosen = SHAPES[randomIdx];
    const piece = {
      shape: chosen.shape,
      color: chosen.color,
      secondary: chosen.secondary,
      x: Math.floor((COLS - chosen.shape[0].length) / 2),
      y: 0,
    };

    // Check collision at spawn (Game Over)
    for (let r = 0; r < piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[r].length; c++) {
        if (piece.shape[r][c] && gridRef.current[piece.y + r]?.[piece.x + c]) {
          setGameOver(true);
          playSound(150, 'sawtooth', 0.4);
          return false;
        }
      }
    }

    currentPieceRef.current = piece;
    return true;
  }, [playSound]);

  const checkCollision = (pieceX: number, pieceY: number, shape: number[][]) => {
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) {
          const newX = pieceX + c;
          const newY = pieceY + r;
          if (newX < 0 || newX >= COLS || newY >= ROWS) return true;
          if (newY >= 0 && gridRef.current[newY][newX]) return true;
        }
      }
    }
    return false;
  };

  const rotate = (shape: number[][]) => {
    const rows = shape.length;
    const cols = shape[0].length;
    const newShape: number[][] = Array.from({ length: cols }, () => Array(rows).fill(0));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        newShape[c][rows - 1 - r] = shape[r][c];
      }
    }
    return newShape;
  };

  const handleRotate = useCallback(() => {
    if (gameOver || isPaused) return;
    const piece = currentPieceRef.current;
    const rotated = rotate(piece.shape);
    if (!checkCollision(piece.x, piece.y, rotated)) {
      piece.shape = rotated;
      playSound(440, 'triangle');
    }
  }, [gameOver, isPaused, playSound]);

  const handleMove = useCallback((dx: number) => {
    if (gameOver || isPaused) return;
    const piece = currentPieceRef.current;
    if (!checkCollision(piece.x + dx, piece.y, piece.shape)) {
      piece.x += dx;
      playSound(220, 'sine', 0.04);
    }
  }, [gameOver, isPaused, playSound]);

  const lockPiece = useCallback(() => {
    const piece = currentPieceRef.current;
    for (let r = 0; r < piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[r].length; c++) {
        if (piece.shape[r][c]) {
          const boardY = piece.y + r;
          const boardX = piece.x + c;
          if (boardY >= 0 && boardY < ROWS && boardX >= 0 && boardX < COLS) {
            gridRef.current[boardY][boardX] = 1;
            colorsRef.current[boardY][boardX] = piece.color;
          }
        }
      }
    }

    playSound(180, 'square', 0.06);

    // Clear completed lines
    let cleared = 0;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (gridRef.current[r].every((cell) => cell === 1)) {
        cleared++;
        gridRef.current.splice(r, 1);
        colorsRef.current.splice(r, 1);
        gridRef.current.unshift(Array(COLS).fill(0));
        colorsRef.current.unshift(Array(COLS).fill(''));
        r++; // Recheck same row index
      }
    }

    if (cleared > 0) {
      playSound(520 + cleared * 120, 'square', 0.2);
      const points = [0, 100, 300, 500, 800][cleared] * level;
      setScore((s) => s + points);
      setLines((l) => {
        const total = l + cleared;
        setLevel(Math.floor(total / 10) + 1);
        return total;
      });

      if (cleared >= 2) {
        setMathBonusActive(true);
        setTimeout(() => setMathBonusActive(false), 2500);
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
      }
    }

    spawnPiece();
  }, [level, playSound, spawnPiece]);

  const handleDrop = useCallback(() => {
    if (gameOver || isPaused) return;
    const piece = currentPieceRef.current;
    if (!checkCollision(piece.x, piece.y + 1, piece.shape)) {
      piece.y += 1;
    } else {
      lockPiece();
    }
  }, [gameOver, isPaused, lockPiece]);

  const handleHardDrop = useCallback(() => {
    if (gameOver || isPaused) return;
    const piece = currentPieceRef.current;
    while (!checkCollision(piece.x, piece.y + 1, piece.shape)) {
      piece.y += 1;
    }
    lockPiece();
  }, [gameOver, isPaused, lockPiece]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') handleMove(-1);
      else if (e.key === 'ArrowRight' || e.key === 'd') handleMove(1);
      else if (e.key === 'ArrowDown' || e.key === 's') handleDrop();
      else if (e.key === 'ArrowUp' || e.key === 'w') handleRotate();
      else if (e.key === ' ' || e.key === 'Enter') handleHardDrop();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMove, handleDrop, handleRotate, handleHardDrop]);

  // Main Game Loop (Gravity)
  useEffect(() => {
    if (gameOver || isPaused) return;
    const speed = Math.max(120, 800 - (level - 1) * 70);
    const interval = setInterval(() => {
      handleDrop();
    }, speed);
    return () => clearInterval(interval);
  }, [gameOver, isPaused, level, handleDrop]);

  // Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const drawBlock = (x: number, y: number, color: string) => {
      const px = x * BLOCK_SIZE;
      const py = y * BLOCK_SIZE;

      ctx.fillStyle = color;
      ctx.fillRect(px + 1, py + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);

      // Carved stone border
      ctx.strokeStyle = '#00000088';
      ctx.lineWidth = 2;
      ctx.strokeRect(px + 1, py + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);

      // Inner Mayan glyph motif dot
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.fillRect(px + 5, py + 5, BLOCK_SIZE - 10, BLOCK_SIZE - 10);
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dark Temple Stone Grid Background
      ctx.fillStyle = '#141414';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = '#222222';
      ctx.lineWidth = 1;
      for (let x = 0; x <= COLS; x++) {
        ctx.beginPath();
        ctx.moveTo(x * BLOCK_SIZE, 0);
        ctx.lineTo(x * BLOCK_SIZE, ROWS * BLOCK_SIZE);
        ctx.stroke();
      }
      for (let y = 0; y <= ROWS; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * BLOCK_SIZE);
        ctx.lineTo(COLS * BLOCK_SIZE, y * BLOCK_SIZE);
        ctx.stroke();
      }

      // Draw locked board pieces
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (gridRef.current[r][c]) {
            drawBlock(c, r, colorsRef.current[r][c] || '#d99b26');
          }
        }
      }

      // Draw active falling piece
      const piece = currentPieceRef.current;
      if (piece) {
        for (let r = 0; r < piece.shape.length; r++) {
          for (let c = 0; c < piece.shape[r].length; c++) {
            if (piece.shape[r][c]) {
              drawBlock(piece.x + c, piece.y + r, piece.color);
            }
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  const restartGame = () => {
    gridRef.current = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    colorsRef.current = Array.from({ length: ROWS }, () => Array(COLS).fill(''));
    setScore(0);
    setLines(0);
    setLevel(1);
    setGameOver(false);
    setIsPaused(false);
    spawnPiece();
  };

  return (
    <div className="max-w-3xl mx-auto py-4 px-2 space-y-4">
      <GrecaBar />

      {/* Header Bar */}
      <div className="bg-[#1f1f1f] border-2 border-[#a62b2b] p-3 rounded-lg flex items-center justify-between shadow-lg">
        <button
          onClick={onClose}
          className="px-3 py-1.5 bg-[#2d2d2d] hover:bg-[#3d3d3d] text-[#d99b26] border border-[#444] rounded font-silkscreen text-xs flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al Templo
        </button>

        <div className="text-center">
          <h2 className="font-press-start text-xs sm:text-sm text-[#fbbf24]">
            TETRIS MAYA · CÁLCULO DE MAZORCAS
          </h2>
          <span className="font-silkscreen text-[11px] text-[#9ca3af]">
            Apilamiento de bloques de estelas y tributo vigesimal
          </span>
        </div>

        <button
          onClick={restartGame}
          className="p-1.5 bg-[#a62b2b] hover:bg-[#c0392b] text-[#f4efe6] rounded border border-[#d99b26] cursor-pointer"
          title="Reiniciar"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Main Play Area */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
        {/* Left Side: Stats Panel */}
        <div className="md:col-span-4 bg-[#1a1a1a] border-2 border-[#333] p-4 rounded-lg space-y-4 text-center">
          <div className="p-3 bg-[#141414] border border-[#444] rounded">
            <span className="font-silkscreen text-[10px] text-[#9ca3af] block">PUNTUACIÓN</span>
            <span className="font-press-start text-base text-[#fbbf24]">{score}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 bg-[#141414] border border-[#444] rounded">
              <span className="font-silkscreen text-[10px] text-[#9ca3af] block">LÍNEAS</span>
              <span className="font-press-start text-xs text-[#22c55e]">{lines}</span>
            </div>
            <div className="p-2.5 bg-[#141414] border border-[#444] rounded">
              <span className="font-silkscreen text-[10px] text-[#9ca3af] block">NIVEL</span>
              <span className="font-press-start text-xs text-[#06b6d4]">{level}</span>
            </div>
          </div>

          {mathBonusActive && (
            <div className="p-2.5 bg-[#31250b] border-2 border-[#fbbf24] rounded animate-pulse flex items-center justify-center gap-1.5 text-xs font-press-start text-[#fbbf24]">
              <Sparkles className="w-4 h-4" /> ¡BONO VIGESIMAL SOLAR!
            </div>
          )}

          <div className="p-3 bg-[#241a15] border border-[#d99b26] rounded text-left font-silkscreen text-xs text-[#d1d5db] space-y-1">
            <div className="text-[#fbbf24] font-bold">📜 REGLAS DEL TRIBUTO:</div>
            <div>• Cada línea = 100 × Nivel</div>
            <div>• 4 líneas juntas = 800 × Nivel</div>
            <div>• Mazorcas acumuladas se convierten en Cacaos</div>
          </div>
        </div>

        {/* Center: Canvas Board */}
        <div className="md:col-span-8 flex flex-col items-center">
          <div className="relative border-4 border-[#a62b2b] rounded-lg shadow-2xl overflow-hidden bg-[#141414]">
            <canvas
              ref={canvasRef}
              width={COLS * BLOCK_SIZE}
              height={ROWS * BLOCK_SIZE}
              className="block"
            />

            {/* Game Over Modal */}
            {gameOver && (
              <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4">
                <div className="text-4xl">🗿</div>
                <h3 className="font-press-start text-base text-[#ef4444]">
                  ¡TEMPLO LLENO!
                </h3>
                <p className="font-silkscreen text-xs text-[#d1d5db]">
                  Las estelas alcanzaron la cúspide de la pirámide.
                </p>
                <div className="font-press-start text-xs text-[#fbbf24]">
                  PUNTOS TOTALES: {score}
                </div>
                <button
                  onClick={restartGame}
                  className="px-4 py-2 bg-[#d99b26] text-black font-press-start text-xs rounded retro-button cursor-pointer"
                >
                  JUGAR DE NUEVO
                </button>
              </div>
            )}
          </div>

          {/* On-Screen Mobile & Touch Controls */}
          <div className="w-full max-w-xs mt-4 grid grid-cols-3 gap-2">
            <button
              onClick={() => handleMove(-1)}
              className="p-3 bg-[#262626] hover:bg-[#333] border border-[#444] rounded text-center flex items-center justify-center font-press-start text-xs cursor-pointer active:translate-y-1"
            >
              <MoveLeft className="w-5 h-5 text-[#fbbf24]" />
            </button>
            <button
              onClick={handleRotate}
              className="p-3 bg-[#a62b2b] hover:bg-[#c0392b] border border-[#d99b26] rounded text-center flex items-center justify-center font-press-start text-xs cursor-pointer active:translate-y-1"
            >
              <RotateCw className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => handleMove(1)}
              className="p-3 bg-[#262626] hover:bg-[#333] border border-[#444] rounded text-center flex items-center justify-center font-press-start text-xs cursor-pointer active:translate-y-1"
            >
              <MoveRight className="w-5 h-5 text-[#fbbf24]" />
            </button>
            <button
              onClick={handleDrop}
              className="col-span-2 p-2.5 bg-[#262626] hover:bg-[#333] border border-[#444] rounded text-center flex items-center justify-center font-silkscreen text-xs text-[#d1d5db] cursor-pointer active:translate-y-1"
            >
              <ArrowDown className="w-4 h-4 mr-1 text-[#22c55e]" /> Caída Suave
            </button>
            <button
              onClick={handleHardDrop}
              className="p-2.5 bg-[#14291c] hover:bg-[#1a3826] border border-[#22c55e] rounded text-center flex items-center justify-center font-silkscreen text-xs text-[#22c55e] cursor-pointer active:translate-y-1"
            >
              <Zap className="w-4 h-4" /> Caída
            </button>
          </div>
        </div>
      </div>

      <GrecaBar />
    </div>
  );
};

import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, RotateCw, ArrowDown, ArrowLeft as MoveLeft, ArrowRight as MoveRight, Zap, RefreshCw, Star } from 'lucide-react';
import { GameNode } from '../../types';
import { GrecaBar } from '../GrecaBar';

interface MayaTetrisProps {
  node?: GameNode | null;
  onClose: () => void;
  onReward?: (coins: number) => void;
  onVictory?: (stars: number, coins: number) => void;
}

interface SnesTileStyle {
  main: string;
  light: string;
  dark: string;
  glyph: string;
  detail: string;
}

const SNES_PALETTES: Record<string, SnesTileStyle> = {
  '#10b981': { main: '#10b981', light: '#6ee7b7', dark: '#047857', glyph: '#022c22', detail: '#a7f3d0' }, // Jade
  '#06b6d4': { main: '#06b6d4', light: '#67e8f9', dark: '#0e7490', glyph: '#083344', detail: '#a5f3fc' }, // Turquesa
  '#f59e0b': { main: '#f59e0b', light: '#fde68a', dark: '#b45309', glyph: '#451a03', detail: '#fef08a' }, // Ámbar Solar
  '#fbbf24': { main: '#fbbf24', light: '#fef08a', dark: '#d97706', glyph: '#78350f', detail: '#fffbeb' }, // Oro Ceremonial
  '#22c55e': { main: '#22c55e', light: '#86efac', dark: '#15803d', glyph: '#052e16', detail: '#bbf7d0' }, // Selva Esmeralda
  '#ef4444': { main: '#ef4444', light: '#fca5a5', dark: '#b91c1c', glyph: '#450a0a', detail: '#fecaca' }, // Rubí Fuego
  '#a855f7': { main: '#a855f7', light: '#d8b4fe', dark: '#7e22ce', glyph: '#3b0764', detail: '#f3e8ff' }, // Obsidiana Amatista
  'default': { main: '#d99b26', light: '#fbbf24', dark: '#78350f', glyph: '#451a03', detail: '#fef3c7' },
};

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 24; // 24px: 240x480 crisp SNES 32-bit resolution

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

export const MayaTetris: React.FC<MayaTetrisProps> = ({ node, onClose, onReward, onVictory }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused] = useState(false);
  const [mathBonusActive, setMathBonusActive] = useState(false);
  const [victoryCelebration, setVictoryCelebration] = useState(false);

  const targetLinesForNode = node ? 4 : 999;

  // Web Audio 8-bit sound generator
  const playSound = useCallback((freq: number, type: OscillatorType = 'square', duration = 0.08) => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
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
      // Audio fallback
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
          if (node && onVictory) {
            const earnedStars = score >= 800 ? 3 : score >= 400 ? 2 : 1;
            const earnedCoins = earnedStars * 40 + (node.isBoss ? 80 : 30);
            onVictory(earnedStars, earnedCoins);
          }
          return false;
        }
      }
    }
    currentPieceRef.current = piece;
    return true;
  }, [playSound, node, onVictory, score]);

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
    if (gameOver || isPaused || victoryCelebration) return;
    const piece = currentPieceRef.current;
    const rotated = rotate(piece.shape);
    if (!checkCollision(piece.x, piece.y, rotated)) {
      piece.shape = rotated;
      playSound(440, 'triangle');
    }
  }, [gameOver, isPaused, victoryCelebration, playSound]);

  const handleMove = useCallback((dx: number) => {
    if (gameOver || isPaused || victoryCelebration) return;
    const piece = currentPieceRef.current;
    if (!checkCollision(piece.x + dx, piece.y, piece.shape)) {
      piece.x += dx;
      playSound(220, 'sine', 0.04);
    }
  }, [gameOver, isPaused, victoryCelebration, playSound]);

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
        r++;
      }
    }

    if (cleared > 0) {
      playSound(520 + cleared * 120, 'square', 0.2);
      const points = [0, 100, 300, 500, 800][cleared] * level;
      setScore((s) => s + points);
      setLines((prev) => {
        const next = prev + cleared;
        setLevel(Math.floor(next / 10) + 1);

        // Check node challenge target
        if (node && next >= targetLinesForNode && !victoryCelebration) {
          setVictoryCelebration(true);
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
          const earnedStars = 3;
          const earnedCoins = 120 + (node.isBoss ? 80 : 0);
          if (onVictory) onVictory(earnedStars, earnedCoins);
          if (onReward) onReward(earnedCoins);
        }
        return next;
      });

      if (cleared >= 2) {
        setMathBonusActive(true);
        setTimeout(() => setMathBonusActive(false), 2500);
      }
    }

    if (!victoryCelebration) {
      spawnPiece();
    }
  }, [level, node, onReward, onVictory, playSound, spawnPiece, targetLinesForNode, victoryCelebration]);

  const handleDrop = useCallback(() => {
    if (gameOver || isPaused || victoryCelebration) return;
    const piece = currentPieceRef.current;
    if (!checkCollision(piece.x, piece.y + 1, piece.shape)) {
      piece.y += 1;
    } else {
      lockPiece();
    }
  }, [gameOver, isPaused, victoryCelebration, lockPiece]);

  const handleHardDrop = useCallback(() => {
    if (gameOver || isPaused || victoryCelebration) return;
    const piece = currentPieceRef.current;
    while (!checkCollision(piece.x, piece.y + 1, piece.shape)) {
      piece.y += 1;
    }
    lockPiece();
  }, [gameOver, isPaused, victoryCelebration, lockPiece]);

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

  // Gravity Loop
  useEffect(() => {
    if (gameOver || isPaused || victoryCelebration) return;
    const speed = Math.max(140, 750 - (level - 1) * 60);
    const interval = setInterval(() => {
      handleDrop();
    }, speed);
    return () => clearInterval(interval);
  }, [gameOver, isPaused, victoryCelebration, level, handleDrop]);

  // Canvas Render Loop with SNES 32x32 Quad-Bevel Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    // SNES 32-bit Quad-beveled Stone Tile Generator
    const drawBlock = (x: number, y: number, colorKey: string) => {
      const px = x * BLOCK_SIZE;
      const py = y * BLOCK_SIZE;
      const style = SNES_PALETTES[colorKey] || SNES_PALETTES['default'];

      // 1. Black outer mortar border
      ctx.fillStyle = '#060606';
      ctx.fillRect(px, py, BLOCK_SIZE, BLOCK_SIZE);

      // 2. Base stone face
      ctx.fillStyle = style.main;
      ctx.fillRect(px + 1, py + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);

      // 3. SNES Quad Bevels (Light top/left, Dark bottom/right)
      // Top light bevel (2px)
      ctx.fillStyle = style.light;
      ctx.fillRect(px + 1, py + 1, BLOCK_SIZE - 2, 2);
      // Left light bevel (2px)
      ctx.fillRect(px + 1, py + 1, 2, BLOCK_SIZE - 2);

      // Bottom dark bevel (2px)
      ctx.fillStyle = style.dark;
      ctx.fillRect(px + 1, py + BLOCK_SIZE - 3, BLOCK_SIZE - 2, 2);
      // Right dark bevel (2px)
      ctx.fillRect(px + BLOCK_SIZE - 3, py + 1, 2, BLOCK_SIZE - 2);

      // 4. Corner rivets (4 SNES stone anchor studs)
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(px + 2, py + 2, 2, 2);
      ctx.fillRect(px + BLOCK_SIZE - 4, py + 2, 2, 2);
      ctx.fillRect(px + 2, py + BLOCK_SIZE - 4, 2, 2);
      ctx.fillRect(px + BLOCK_SIZE - 4, py + BLOCK_SIZE - 4, 2, 2);

      // Rivet specular highlights
      ctx.fillStyle = '#ffffff88';
      ctx.fillRect(px + 2, py + 2, 1, 1);
      ctx.fillRect(px + BLOCK_SIZE - 4, py + 2, 1, 1);

      // 5. Engraved Central Mayan Hieroglyph (Sun Disk / Bar Relief)
      const cx = px + Math.floor(BLOCK_SIZE / 2);
      const cy = py + Math.floor(BLOCK_SIZE / 2);

      // Chiseled groove (dark inset)
      ctx.fillStyle = style.glyph;
      ctx.fillRect(cx - 4, cy - 4, 8, 8);

      // Stone core
      ctx.fillStyle = style.main;
      ctx.fillRect(cx - 3, cy - 3, 6, 6);

      // Mayan rune cross / diamond
      ctx.fillStyle = style.detail;
      ctx.fillRect(cx - 2, cy - 1, 4, 2);
      ctx.fillRect(cx - 1, cy - 2, 2, 4);
      ctx.fillStyle = '#00000044';
      ctx.fillRect(cx - 1, cy - 1, 2, 2);
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Temple dungeon stone background with alternating masonry
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const isOffset = (r % 2 === 0 ? c % 2 === 0 : c % 2 === 1);
          ctx.fillStyle = isOffset ? '#120f0e' : '#191513';
          ctx.fillRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);

          // Subtle stone texture specks
          ctx.fillStyle = '#221b18';
          ctx.fillRect(c * BLOCK_SIZE + 2, r * BLOCK_SIZE + 2, 2, 2);
          ctx.fillRect(c * BLOCK_SIZE + BLOCK_SIZE - 4, r * BLOCK_SIZE + BLOCK_SIZE - 4, 2, 2);
        }
      }

      // Stone mortar grid seams
      ctx.strokeStyle = '#090706';
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

      // Board placed blocks
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (gridRef.current[r][c]) {
            drawBlock(c, r, colorsRef.current[r][c] || '#fbbf24');
          }
        }
      }

      // Falling piece
      const piece = currentPieceRef.current;
      if (piece && !victoryCelebration) {
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
  }, [victoryCelebration]);

  const restartGame = () => {
    gridRef.current = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    colorsRef.current = Array.from({ length: ROWS }, () => Array(COLS).fill(''));
    setScore(0);
    setLines(0);
    setLevel(1);
    setGameOver(false);
    setVictoryCelebration(false);
    spawnPiece();
  };

  return (
    <div className="max-w-md sm:max-w-xl mx-auto px-2 py-3 space-y-3 pb-24">
      <GrecaBar />

      {/* Top Header */}
      <div className="bg-[#1e1916] border-2 border-[#a62b2b] p-2.5 rounded-none [box-shadow:3px_3px_0px_#000000,_inset_2px_2px_0px_#ffffff22,_inset_-2px_-2px_0px_#00000088] flex items-center justify-between">
        <button
          onClick={onClose}
          className="px-2.5 py-1 bg-[#2d2d2d] hover:bg-[#3d3d3d] text-[#d99b26] border border-[#444] rounded-none font-silkscreen text-[11px] flex items-center gap-1 cursor-pointer [box-shadow:2px_2px_0px_#000000]"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Salir
        </button>

        <div className="text-center">
          <h2 className="font-press-start text-[11px] sm:text-xs text-[#fbbf24]">
            {node ? node.title : 'TETRIS MAYA · SNES 32-BIT'}
          </h2>
          <span className="font-silkscreen text-[10px] text-[#a39c8f]">
            {node ? `Objetivo: Limpiar ${targetLinesForNode} líneas` : 'Modo Arcade Vigesimal'}
          </span>
        </div>

        <button
          onClick={restartGame}
          className="p-1.5 bg-[#a62b2b] hover:bg-[#c0392b] text-white rounded-none border border-[#d99b26] cursor-pointer [box-shadow:2px_2px_0px_#000000]"
          title="Reiniciar"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Game Layout */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        {/* Board Canvas */}
        <div className="relative border-4 border-[#7a5009] [box-shadow:4px_4px_0px_#000000,_inset_2px_2px_0px_#ffffff22,_inset_-2px_-2px_0px_#000000aa] bg-[#0c0a09] p-1">
          <canvas
            ref={canvasRef}
            width={COLS * BLOCK_SIZE}
            height={ROWS * BLOCK_SIZE}
            className="block [image-rendering:pixelated]"
          />

          {/* Victory Modal */}
          {victoryCelebration && (
            <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-4 text-center space-y-2 border-2 border-[#22c55e]">
              <div className="w-10 h-10 bg-[#22c55e] border-2 border-black [box-shadow:2px_2px_0px_#000000] flex items-center justify-center font-press-start text-xs text-black">
                ★
              </div>
              <h3 className="font-press-start text-xs text-[#22c55e]">
                ¡NODO SUPERADO!
              </h3>
              <p className="font-silkscreen text-[11px] text-[#f4efe6]">
                Has tributado las mazorcas sagradas al templo.
              </p>
              <div className="flex items-center gap-1 text-[#fbbf24] py-1">
                <Star className="w-4 h-4 fill-[#fbbf24]" />
                <Star className="w-4 h-4 fill-[#fbbf24]" />
                <Star className="w-4 h-4 fill-[#fbbf24]" />
              </div>
              <button
                onClick={onClose}
                className="px-3 py-1.5 bg-[#d99b26] text-black font-press-start text-[10px] rounded-none retro-button cursor-pointer [box-shadow:2px_2px_0px_#000]"
              >
                CONTINUAR SENDA
              </button>
            </div>
          )}

          {/* Game Over Modal */}
          {gameOver && !victoryCelebration && (
            <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-4 text-center space-y-3 border-2 border-[#ef4444]">
              <div className="w-10 h-10 bg-[#ef4444] border-2 border-black [box-shadow:2px_2px_0px_#000000] flex items-center justify-center font-press-start text-xs text-white">
                ✕
              </div>
              <h3 className="font-press-start text-xs text-[#ef4444]">
                ¡TEMPLO LLENO!
              </h3>
              <p className="font-silkscreen text-[11px] text-[#d1d5db]">
                Puntos: {score} · Líneas: {lines}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={restartGame}
                  className="px-3 py-1.5 bg-[#d99b26] text-black font-press-start text-[10px] rounded-none cursor-pointer [box-shadow:2px_2px_0px_#000]"
                >
                  REINTENTAR
                </button>
                <button
                  onClick={onClose}
                  className="px-3 py-1.5 bg-[#333] text-white font-press-start text-[10px] rounded-none cursor-pointer [box-shadow:2px_2px_0px_#000]"
                >
                  VOLVER
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Stats on Side / Bottom with SNES Bevels */}
        <div className="w-full sm:w-44 flex flex-row sm:flex-col justify-around sm:justify-start gap-2 text-center">
          <div className="flex-1 p-2 bg-[#191512] border-2 border-[#58413f] [box-shadow:2px_2px_0px_#000000,_inset_1px_1px_0px_#ffffff22]">
            <span className="font-silkscreen text-[9px] text-[#8e8576] block">PUNTOS</span>
            <span className="font-press-start text-xs text-[#fbbf24]">{score}</span>
          </div>
          <div className="flex-1 p-2 bg-[#191512] border-2 border-[#58413f] [box-shadow:2px_2px_0px_#000000,_inset_1px_1px_0px_#ffffff22]">
            <span className="font-silkscreen text-[9px] text-[#8e8576] block">LÍNEAS</span>
            <span className="font-press-start text-xs text-[#22c55e]">
              {lines} {node ? `/${targetLinesForNode}` : ''}
            </span>
          </div>
          <div className="flex-1 p-2 bg-[#191512] border-2 border-[#58413f] [box-shadow:2px_2px_0px_#000000,_inset_1px_1px_0px_#ffffff22]">
            <span className="font-silkscreen text-[9px] text-[#8e8576] block">NIVEL</span>
            <span className="font-press-start text-xs text-[#06b6d4]">{level}</span>
          </div>
        </div>
      </div>

      {mathBonusActive && (
        <div className="p-2 bg-[#2b200b] border-2 border-[#fbbf24] rounded-none text-center text-[10px] font-press-start text-[#fbbf24] animate-pulse [box-shadow:2px_2px_0px_#000000]">
          ✨ ¡BONIFICACIÓN SOLAR VIGESIMAL ACTIVADA!
        </div>
      )}

      {/* SNES D-Pad Controls for Mobile */}
      <div className="w-full max-w-xs mx-auto grid grid-cols-3 gap-2 pt-1">
        <button
          onClick={() => handleMove(-1)}
          className="h-12 bg-[#26201b] hover:bg-[#342b24] border-2 border-[#58413f] [box-shadow:2px_2px_0px_#000,_inset_1.5px_1.5px_0px_#ffffff22] flex items-center justify-center font-press-start cursor-pointer active:translate-y-0.5"
          title="Izquierda"
        >
          <MoveLeft className="w-5 h-5 text-[#fbbf24]" />
        </button>
        <button
          onClick={handleRotate}
          className="h-12 bg-[#a62b2b] hover:bg-[#ba3232] border-2 border-[#d99b26] [box-shadow:2px_2px_0px_#000,_inset_1.5px_1.5px_0px_#ffffff33] flex items-center justify-center font-press-start cursor-pointer active:translate-y-0.5"
          title="Rotar"
        >
          <RotateCw className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={() => handleMove(1)}
          className="h-12 bg-[#26201b] hover:bg-[#342b24] border-2 border-[#58413f] [box-shadow:2px_2px_0px_#000,_inset_1.5px_1.5px_0px_#ffffff22] flex items-center justify-center font-press-start cursor-pointer active:translate-y-0.5"
          title="Derecha"
        >
          <MoveRight className="w-5 h-5 text-[#fbbf24]" />
        </button>
        <button
          onClick={handleDrop}
          className="col-span-2 h-11 bg-[#201b17] hover:bg-[#2e2620] border-2 border-[#44362b] [box-shadow:2px_2px_0px_#000,_inset_1px_1px_0px_#ffffff22] flex items-center justify-center gap-1 font-silkscreen text-xs text-[#a39c8f] cursor-pointer active:translate-y-0.5"
        >
          <ArrowDown className="w-4 h-4 text-[#22c55e]" /> Caída Suave
        </button>
        <button
          onClick={handleHardDrop}
          className="h-11 bg-[#14291c] hover:bg-[#1f3d2a] border-2 border-[#22c55e] [box-shadow:2px_2px_0px_#000,_inset_1px_1px_0px_#ffffff33] flex items-center justify-center font-silkscreen text-xs text-[#22c55e] cursor-pointer active:translate-y-0.5 font-bold"
        >
          <Zap className="w-4 h-4" /> Caída Rápida
        </button>
      </div>

      <GrecaBar />
    </div>
  );
};

import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import Lenis from 'lenis';
import './index.css';

// Configuración de Lenis para desplazamiento suave con inercia equilibrada
// optimizada para preservar la nitidez de pixel art
const lenis = new Lenis({
  duration: 1.1,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});

function raf(time: number) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

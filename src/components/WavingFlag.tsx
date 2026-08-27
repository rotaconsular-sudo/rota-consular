"use client";

import { useEffect, useRef } from "react";

/**
 * Bandeira dos EUA desenhada por código (sem imagem externa) e ondulada em
 * canvas: cada fatia vertical é deslocada por duas senoides sobrepostas, com
 * amplitude crescendo do mastro pra ponta, e o sombreado sai da derivada da
 * onda — é o que dá a leitura de tecido em vez de "imagem tremendo".
 */

const TEX_W = 950;
const TEX_H = 500;
const RED = "#b22234";
const WHITE = "#ffffff";
const BLUE = "#3c3b6e";

const SLICE = 2;
const ASPECT = TEX_W / TEX_H;

function drawStar(g: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  g.beginPath();
  for (let i = 0; i < 10; i++) {
    const radius = i % 2 === 0 ? r : r * 0.382;
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    if (i === 0) g.moveTo(x, y);
    else g.lineTo(x, y);
  }
  g.closePath();
  g.fill();
}

/** Textura na proporção oficial: 13 listras, união 7/13 de altura por 0.76. */
function buildTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = TEX_W;
  canvas.height = TEX_H;
  const g = canvas.getContext("2d");
  if (!g) return null;

  const stripe = TEX_H / 13;
  for (let i = 0; i < 13; i++) {
    g.fillStyle = i % 2 === 0 ? RED : WHITE;
    g.fillRect(0, i * stripe, TEX_W, stripe + 1);
  }

  const unionH = stripe * 7;
  const unionW = TEX_H * 0.76;
  g.fillStyle = BLUE;
  g.fillRect(0, 0, unionW, unionH);

  g.fillStyle = WHITE;
  const hStep = unionW / 12;
  const vStep = unionH / 10;
  const starR = TEX_H * 0.0308;
  for (let row = 0; row < 9; row++) {
    const cols = row % 2 === 0 ? 6 : 5;
    for (let col = 0; col < cols; col++) {
      const cx = row % 2 === 0 ? hStep * (2 * col + 1) : hStep * (2 * col + 2);
      drawStar(g, cx, vStep * (row + 1), starR);
    }
  }
  return canvas;
}

export default function WavingFlag({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const texture = buildTexture();
    if (!ctx || !texture) return;

    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const render = (t: number) => {
      ctx.clearRect(0, 0, width, height);

      // "cover" preservando a proporção da bandeira
      const flagW = Math.max(width * 1.06, height * ASPECT * 0.92);
      const flagH = flagW / ASPECT;
      const x0 = (width - flagW) / 2;
      const centerY = height / 2;
      const maxAmp = flagH * 0.1;

      for (let dx = 0; dx < width; dx += SLICE) {
        const p = (dx - x0) / flagW;
        if (p < 0 || p >= 1) continue;

        const primary = p * 6.1 - t;
        const wave =
          Math.sin(primary) * 0.62 + Math.sin(p * 11.3 - t * 1.7 + 1.3) * 0.38;
        const amp = maxAmp * Math.pow(p, 1.25);
        // encurtamento de perfil: o pano "some" um pouco onde dobra
        const squeeze = 1 - 0.11 * p * (0.5 + 0.5 * Math.cos(primary));
        const dh = flagH * squeeze;
        const dy = centerY - dh / 2 + wave * amp;

        const sx = p * TEX_W;
        const sw = Math.max(1, (SLICE / flagW) * TEX_W);
        ctx.drawImage(texture, sx, 0, sw, TEX_H, dx, dy, SLICE + 1, dh);

        // luz/sombra a partir da inclinação da onda
        const shade = Math.cos(primary) * 0.3 * Math.pow(p, 0.8);
        ctx.fillStyle =
          shade > 0
            ? `rgba(255,255,255,${shade})`
            : `rgba(0,0,0,${Math.min(-shade, 0.45)})`;
        ctx.fillRect(dx, dy, SLICE + 1, dh);
      }
    };

    let start: number | null = null;
    const loop = (now: number) => {
      if (start === null) start = now;
      render(((now - start) / 1000) * 1.35);
      frame = requestAnimationFrame(loop);
    };

    const stop = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };

    const play = () => {
      if (frame || !visible) return;
      if (reduceMotion.matches) {
        render(0.7);
        return;
      }
      start = null;
      frame = requestAnimationFrame(loop);
    };

    const restart = () => {
      stop();
      resize();
      play();
      if (reduceMotion.matches) render(0.7);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) play();
        else stop();
      },
      { threshold: 0 },
    );
    observer.observe(canvas);

    const onVisibility = () => {
      if (document.hidden) stop();
      else play();
    };

    resize();
    play();
    if (reduceMotion.matches) render(0.7);

    window.addEventListener("resize", restart);
    document.addEventListener("visibilitychange", onVisibility);
    reduceMotion.addEventListener("change", restart);

    return () => {
      stop();
      observer.disconnect();
      window.removeEventListener("resize", restart);
      document.removeEventListener("visibilitychange", onVisibility);
      reduceMotion.removeEventListener("change", restart);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}

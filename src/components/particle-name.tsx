"use client";

import { useEffect, useRef } from "react";

type Particle = { ox: number; oy: number; x: number; y: number; vx: number; vy: number; accent: boolean };

/** Adaptação do exemplo de partículas enviado pelo usuário, sem moldura ou fonte extra. */
export function ParticleName({ name }: { name: string }) {
  const hostRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;
    const context = canvas.getContext("2d");
    const mask = document.createElement("canvas");
    const maskContext = mask.getContext("2d", { willReadFrequently: true });
    if (!context || !maskContext) return;

    const padding = 32;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = { x: -999, y: -999, active: false };
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let dotSize = 1.8;
    let ink = "";
    let accent = "";
    let frame = 0;
    let previousTime = 0;
    let visible = false;
    let disposed = false;
    let fontsReady = false;

    function draw() {
      context!.clearRect(0, 0, width, height);
      let color = "";
      for (const point of particles) {
        const nextColor = point.accent ? accent : ink;
        if (color !== nextColor) context!.fillStyle = color = nextColor;
        context!.fillRect(point.x, point.y, dotSize, dotSize);
      }
    }

    function stop() {
      cancelAnimationFrame(frame);
      frame = 0;
      previousTime = 0;
    }

    function animate(time: number) {
      frame = 0;
      if (disposed || !visible || document.hidden || preference.matches) return;
      const dt = previousTime ? Math.min((time - previousTime) / 16.667, 2) : 1;
      previousTime = time;
      let moving = false;
      for (const point of particles) {
        const dx = point.x - pointer.x;
        const dy = point.y - pointer.y;
        const distance = Math.hypot(dx, dy);
        if (pointer.active && distance < 52) {
          const force = (52 - distance) / 52 * 2.2 * dt;
          // Evita divisão por zero quando o cursor cai exatamente sobre um ponto.
          point.vx += (distance > .01 ? dx / distance : 1) * force;
          point.vy += (distance > .01 ? dy / distance : 0) * force;
        }
        point.vx = (point.vx + (point.ox - point.x) * .09 * dt) * Math.pow(.8, dt);
        point.vy = (point.vy + (point.oy - point.y) * .09 * dt) * Math.pow(.8, dt);
        point.x += point.vx * dt;
        point.y += point.vy * dt;
        if (Math.abs(point.vx) + Math.abs(point.vy) > .025 ||
          (!pointer.active && Math.hypot(point.ox - point.x, point.oy - point.y) > .15)) moving = true;
      }
      draw();
      if (moving) frame = requestAnimationFrame(animate);
      else {
        previousTime = 0;
        host!.dataset.particleState = "idle";
      }
    }

    function wake() {
      if (!frame && particles.length && !document.hidden && !preference.matches && !disposed) {
        // A geometria pode mudar antes da próxima notificação do observador.
        const bounds = host!.getBoundingClientRect();
        visible = bounds.width > 0 && bounds.height > 0 && bounds.bottom > 0 && bounds.top < innerHeight && bounds.right > 0 && bounds.left < innerWidth;
        if (!visible) return;
        host!.dataset.particleState = "moving";
        frame = requestAnimationFrame(animate);
      }
    }

    function build(scatter = false) {
      if (disposed || !fontsReady) return;
      stop();
      if (preference.matches) {
        delete host!.dataset.particles;
        host!.dataset.particleState = "reduced";
        particles = [];
        return;
      }
      const rect = host!.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const style = getComputedStyle(host!);
      const size = parseFloat(style.fontSize);
      const spacing = parseFloat(style.letterSpacing) || 0;
      ink = style.color;
      accent = getComputedStyle(host!.querySelector(".orange")!).color;
      width = Math.ceil(rect.width + padding * 2);
      height = Math.ceil(rect.height + padding * 2);
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(width * pixelRatio);
      canvas!.height = Math.round(height * pixelRatio);
      context!.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      mask.width = width;
      mask.height = height;
      maskContext!.font = `${style.fontWeight} ${size}px ${style.fontFamily}`;
      maskContext!.fillStyle = "#fff";
      maskContext!.textBaseline = "alphabetic";
      const text = `${name}.`;
      const metrics = maskContext!.measureText(text);
      const baseline = padding + (rect.height - metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2 + metrics.actualBoundingBoxAscent;
      for (let index = 0; index < text.length; index++) {
        const x = padding + maskContext!.measureText(text.slice(0, index)).width + spacing * index;
        maskContext!.fillStyle = index === name.length ? "#f00" : "#fff";
        maskContext!.fillText(text[index], x, baseline);
      }
      try {
        const pixels = maskContext!.getImageData(0, 0, width, height).data;
        const step = Math.max(2.4, Math.min(3.2, size / 30));
        dotSize = step * .76;
        particles = [];
        for (let y = 0; y < height; y += step) {
          for (let x = 0; x < width; x += step) {
            if (pixels[(Math.floor(y) * width + Math.floor(x)) * 4 + 3] <= 128) continue;
            particles.push({ ox: x, oy: y, x: x + (scatter ? (Math.random() - .5) * 24 : 0), y: y + (scatter ? (Math.random() - .5) * 24 : 0), vx: 0, vy: 0, accent: pixels[(Math.floor(y) * width + Math.floor(x)) * 4 + 1] < 128 });
          }
        }
        if (!particles.length) {
          delete host!.dataset.particles;
          return;
        }
        host!.dataset.particles = "ready";
        host!.dataset.particleState = "idle";
        draw();
        if (scatter || pointer.active) wake();
      } catch {
        // Navegadores que restringem leitura do canvas continuam com texto normal.
        delete host!.dataset.particles;
        particles = [];
      }
    }

    function move(event: PointerEvent) {
      if (event.type === "pointermove" && event.pointerType === "touch") return;
      const rect = host!.getBoundingClientRect();
      pointer.x = event.clientX - rect.left + padding;
      pointer.y = event.clientY - rect.top + padding;
      pointer.active = true;
      wake();
    }

    function leave() {
      pointer.active = false;
      pointer.x = pointer.y = -999;
      wake();
    }

    function visibility() {
      if (document.hidden) {
        pointer.active = false;
        stop();
        host!.dataset.particleState = "paused";
      } else wake();
    }

    const resize = new ResizeObserver(() => build());
    resize.observe(host);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) wake();
      else {
        stop();
        pointer.active = false;
        host.dataset.particleState = "paused";
      }
    });
    intersection.observe(host);
    const theme = new MutationObserver(() => build());
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const updatePreference = () => build();
    preference.addEventListener("change", updatePreference);
    host.addEventListener("pointermove", move, { passive: true });
    host.addEventListener("pointerdown", move, { passive: true });
    host.addEventListener("pointerleave", leave);
    host.addEventListener("pointercancel", leave);
    window.addEventListener("pointerup", leave);
    document.addEventListener("visibilitychange", visibility);
    void document.fonts.ready.then(() => {
      if (disposed) return;
      fontsReady = true;
      build(true);
    });

    return () => {
      disposed = true;
      stop();
      resize.disconnect();
      intersection.disconnect();
      theme.disconnect();
      preference.removeEventListener("change", updatePreference);
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerdown", move);
      host.removeEventListener("pointerleave", leave);
      host.removeEventListener("pointercancel", leave);
      window.removeEventListener("pointerup", leave);
      document.removeEventListener("visibilitychange", visibility);
      delete host.dataset.particles;
      delete host.dataset.particleState;
    };
  }, [name]);

  return (
    <strong ref={hostRef} className="particle-name">
      <span className="particle-name-label">{name}<span className="orange">.</span></span>
      <canvas ref={canvasRef} className="particle-name-canvas" aria-hidden="true" />
    </strong>
  );
}

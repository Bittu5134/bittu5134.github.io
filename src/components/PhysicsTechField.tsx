import React, { useEffect, useRef, useState } from "react";
import TechBox from "./TechBox";

export interface TechItem {
  name: string;
  src: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  ax: number;
  ay: number;
  angle: number;
  vAngle: number;
  targetAngle: number;
  isDragging: boolean;
}

interface DragState {
  index: number;
  pointerId: number;
  grabOffsetX: number;
  grabOffsetY: number;
  lastContainerX: number;
  lastContainerY: number;
}

interface MouseState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  lastTime: number;
  active: boolean;
}

interface PhysicsTechFieldProps {
  technologies: TechItem[];
}

export default function PhysicsTechField({ technologies }: PhysicsTechFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardElementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const dragStateRef = useRef<DragState | null>(null);
  const mouseRef = useRef<MouseState>({
    x: -1000,
    y: -1000,
    vx: 0,
    vy: 0,
    lastTime: 0,
    active: false,
  });
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const animFrameRef = useRef<number>(0);
  const boundsRef = useRef({ width: 1200, height: 2200 });
  const [fieldHeight, setFieldHeight] = useState<number>(2200);

  useEffect(() => {
    const updateDimensionsAndAnchors = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth || window.innerWidth;

      // Limit height strictly to the area above projects with a small 160px overflow
      const projectsEl = document.getElementById("projects");
      let height = 2200;
      if (projectsEl && projectsEl.offsetTop > 400) {
        height = projectsEl.offsetTop + 160;
      } else {
        height = Math.round(window.innerHeight * 2.15);
      }

      boundsRef.current = { width, height };
      setFieldHeight(height);

      const isMobile = width < 768;
      const cardW = isMobile ? 110 : 140;
      const cardH = isMobile ? 38 : 44;
      const padX = 16;
      const padY = 24;

      const N = technologies.length;

      // Generate 30 well-distributed natural anchor positions across the Hero & About space
      const rows = 6;
      const cols = 5;
      const anchors: { x: number; y: number }[] = [];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const rowRatio = (r + 0.45) / rows;
          const colRatio = (c + 0.5) / cols;
          // Stagger alternate rows to avoid vertical column alignment
          const staggerX = r % 2 === 1 ? 0.08 : -0.08;
          const jitterX = Math.sin(r * 12.9898 + c * 78.233) * 0.05;
          const jitterY = Math.cos(r * 39.34 + c * 11.12) * 0.04;

          const xFrac = isMobile
            ? Math.max(0.04, Math.min(0.70, colRatio * 0.72 + 0.05 + jitterX * 0.4))
            : Math.max(0.05, Math.min(0.88, colRatio + staggerX + jitterX));
          const yFrac = Math.max(0.04, Math.min(0.92, rowRatio + jitterY));

          const ax = Math.max(padX, Math.min(width - cardW - padX, xFrac * width));
          const ay = Math.max(padY, Math.min(height - cardH - padY, yFrac * height));
          anchors.push({ x: ax, y: ay });
        }
      }

      if (particlesRef.current.length !== N) {
        // Initialize particles with very gentle initial velocity
        particlesRef.current = technologies.map((_, i) => {
          const anchor = anchors[i % anchors.length];
          const targetAngle = (((i * 17) % 19) - 9) * 0.6;
          const initialSpeed = 0.08 + Math.random() * 0.08;
          const initialHeading = Math.random() * Math.PI * 2;

          return {
            x: anchor.x,
            y: anchor.y,
            vx: Math.cos(initialHeading) * initialSpeed,
            vy: Math.sin(initialHeading) * initialSpeed,
            ax: anchor.x,
            ay: anchor.y,
            angle: targetAngle,
            vAngle: 0,
            targetAngle,
            isDragging: false,
          };
        });
      } else {
        // Update anchor positions on resize
        particlesRef.current.forEach((p, i) => {
          const anchor = anchors[i % anchors.length];
          p.ax = anchor.x;
          p.ay = anchor.y;
        });
      }
    };

    updateDimensionsAndAnchors();

    const resizeObserver = new ResizeObserver(() => {
      updateDimensionsAndAnchors();
    });

    if (containerRef.current?.parentElement) {
      resizeObserver.observe(containerRef.current.parentElement);
    }
    const projectsEl = document.getElementById("projects");
    if (projectsEl) {
      resizeObserver.observe(projectsEl);
    }

    // Window pointer move to gently disturb particles with mouse movement
    let prevMouseX = -1000;
    let prevMouseY = -1000;
    let prevMouseTime = performance.now();

    const handleWindowPointerMove = (e: PointerEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      const now = performance.now();
      const dt = Math.max(1, now - prevMouseTime);
      const vx = ((mx - prevMouseX) / dt) * 16.6;
      const vy = ((my - prevMouseY) / dt) * 16.6;

      prevMouseX = mx;
      prevMouseY = my;
      prevMouseTime = now;

      mouseRef.current = {
        x: mx,
        y: my,
        vx: Math.max(-12, Math.min(12, vx)),
        vy: Math.max(-12, Math.min(12, vy)),
        lastTime: now,
        active: true,
      };
    };

    window.addEventListener("pointermove", handleWindowPointerMove, { passive: true });
    window.addEventListener("resize", updateDimensionsAndAnchors);

    // Continuous Physics Animation Loop (Calm, Majestic, Non-Cluttered)
    const tick = (currentTime: number) => {
      const particles = particlesRef.current;
      const n = particles.length;
      const { width, height } = boundsRef.current;
      const isMobile = width < 768;
      const cardW = isMobile ? 110 : 140;
      const cardH = isMobile ? 38 : 44;
      const padX = 12;
      const padY = 16;
      const minX = padX;
      const maxX = Math.max(minX + 50, width - cardW - padX);
      const minY = padY;
      const maxY = Math.max(minY + 100, height - cardH - padY);

      // Natural soft separation distance
      const minDist = isMobile ? 95 : 130;
      const minDistSq = minDist * minDist;
      const kWall = 0.08;
      const timeSec = currentTime * 0.0004;

      // 1. Soft home pull + subtle, slow space drift (calm, non-distracting)
      for (let i = 0; i < n; i++) {
        const p = particles[i];
        if (!p.isDragging) {
          const dax = p.ax - p.x;
          const day = p.ay - p.y;
          p.vx += dax * 0.0035;
          p.vy += day * 0.0035;

          // Subtle cosmic micro-drift
          const wave = timeSec + i * 1.618;
          p.vx += Math.sin(wave) * 0.008;
          p.vy += Math.cos(wave * 0.85) * 0.008;
        }
      }

      // 2. Gentle mouse disturbance: moving mouse nearby nudges particles calmly
      const mouse = mouseRef.current;
      const mouseAge = currentTime - mouse.lastTime;
      if (mouse.active && mouseAge < 1000) {
        const mouseRadius = isMobile ? 110 : 155;
        const mouseRadiusSq = mouseRadius * mouseRadius;

        for (let i = 0; i < n; i++) {
          const p = particles[i];
          if (p.isDragging) continue;

          const cx = p.x + cardW / 2;
          const cy = p.y + cardH / 2;
          const dx = cx - mouse.x;
          const dy = cy - mouse.y;

          if (Math.abs(dx) > mouseRadius || Math.abs(dy) > mouseRadius) continue;
          const distSq = dx * dx + dy * dy;

          if (distSq < mouseRadiusSq && distSq > 0.01) {
            const dist = Math.sqrt(distSq);
            // Smooth quadratic falloff: gentle nudge away from cursor
            const t = 1 - dist / mouseRadius;
            const pushForce = t * t * 0.75;
            const nx = dx / dist;
            const ny = dy / dist;

            p.vx += nx * pushForce;
            p.vy += ny * pushForce;

            // Gentle directional momentum from swipe
            p.vx += mouse.vx * t * 0.06;
            p.vy += mouse.vy * t * 0.06;

            // Subtle angular tilt
            p.vAngle += (nx * mouse.vy - ny * mouse.vx) * t * 0.05;
          }
        }
      }

      // 3. Smooth Natural Distance: soft quadratic repulsion, maintains organic breathing space
      for (let i = 0; i < n; i++) {
        const pi = particles[i];
        for (let j = i + 1; j < n; j++) {
          const pj = particles[j];

          const dy = pi.y - pj.y;
          if (Math.abs(dy) > minDist) continue;
          const dx = pi.x - pj.x;
          if (Math.abs(dx) > minDist) continue;

          const distSq = dx * dx + dy * dy;
          if (distSq < minDistSq && distSq > 0.01) {
            const dist = Math.sqrt(distSq);
            // Soft quadratic repulsion
            const t = 1 - dist / minDist;
            const force = t * t * 1.4;
            const nx = dx / dist;
            const ny = dy / dist;

            if (!pi.isDragging) {
              pi.vx += nx * force;
              pi.vy += ny * force;
            }
            if (!pj.isDragging) {
              pj.vx -= nx * force;
              pj.vy -= ny * force;
            }
          }
        }
      }

      // 4. Boundary Avoidance, Calm Cruising Speed Governor & Integration
      for (let i = 0; i < n; i++) {
        const p = particles[i];

        if (!p.isDragging) {
          // Boundary spring push
          if (p.x < minX) p.vx += (minX - p.x) * kWall;
          else if (p.x > maxX) p.vx += (maxX - p.x) * kWall;

          if (p.y < minY) p.vy += (minY - p.y) * kWall;
          else if (p.y > maxY) p.vy += (maxY - p.y) * kWall;

          // Cruising speed governor (calm, slow, uncluttered)
          const currentSpeed = Math.hypot(p.vx, p.vy);
          const minCruisingSpeed = 0.04;
          const maxCruisingSpeed = 0.22;
          const hardSpeedLimit = 16;

          if (currentSpeed > hardSpeedLimit) {
            p.vx = (p.vx / currentSpeed) * hardSpeedLimit;
            p.vy = (p.vy / currentSpeed) * hardSpeedLimit;
          } else if (currentSpeed > maxCruisingSpeed) {
            // Smoothly damp disturbances back down to calm cruising
            p.vx *= 0.90;
            p.vy *= 0.90;
          } else if (currentSpeed < minCruisingSpeed && currentSpeed > 0.0005) {
            p.vx = (p.vx / currentSpeed) * minCruisingSpeed;
            p.vy = (p.vy / currentSpeed) * minCruisingSpeed;
          }

          p.x += p.vx;
          p.y += p.vy;

          // Hard clamping within allowed space
          p.x = Math.max(minX, Math.min(maxX, p.x));
          p.y = Math.max(minY, Math.min(maxY, p.y));

          // Gentle rotation tilt based on velocity
          const tilt = Math.max(-12, Math.min(12, p.vx * 0.5));
          const targetAngle = p.targetAngle + tilt;
          p.vAngle = (p.vAngle + (targetAngle - p.angle) * 0.05) * 0.90;
          p.angle += p.vAngle;
        } else {
          // Active drag tilt
          const tilt = Math.max(-18, Math.min(18, p.vx * 0.6));
          p.angle += (p.targetAngle + tilt - p.angle) * 0.15;
        }

        // Hardware-accelerated GPU transform on DOM node
        const el = cardElementsRef.current[i];
        if (el) {
          el.style.transform = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0) rotate(${p.angle.toFixed(1)}deg)`;
        }
      }

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", handleWindowPointerMove);
      window.removeEventListener("resize", updateDimensionsAndAnchors);
    };
  }, [technologies]);

  const handlePointerDown = (index: number, e: React.PointerEvent<HTMLDivElement>) => {
    const p = particlesRef.current[index];
    if (!p) return;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    p.isDragging = true;

    const rect = containerRef.current?.getBoundingClientRect();
    const containerX = rect ? e.clientX - rect.left : e.clientX;
    const containerY = rect ? e.clientY - rect.top : e.clientY;

    dragStateRef.current = {
      index,
      pointerId: e.pointerId,
      grabOffsetX: containerX - p.x,
      grabOffsetY: containerY - p.y,
      lastContainerX: containerX,
      lastContainerY: containerY,
    };
    setDraggingIndex(index);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragStateRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    const p = particlesRef.current[drag.index];
    if (!p) return;

    const rect = containerRef.current?.getBoundingClientRect();
    const containerX = rect ? e.clientX - rect.left : e.clientX;
    const containerY = rect ? e.clientY - rect.top : e.clientY;

    const newX = containerX - drag.grabOffsetX;
    const newY = containerY - drag.grabOffsetY;

    p.vx = (containerX - drag.lastContainerX) * 0.7;
    p.vy = (containerY - drag.lastContainerY) * 0.7;
    drag.lastContainerX = containerX;
    drag.lastContainerY = containerY;

    p.x = newX;
    p.y = newY;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragStateRef.current;
    if (drag && drag.pointerId === e.pointerId) {
      const p = particlesRef.current[drag.index];
      if (p) {
        p.isDragging = false;
      }
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
      dragStateRef.current = null;
      setDraggingIndex(null);
    }
  };

  return (
    <div
      ref={containerRef}
      className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none z-0 select-none"
      style={{ height: `${fieldHeight}px` }}
    >
      {technologies.map((tech, index) => {
        const isCurrentDragging = draggingIndex === index;
        return (
          <div
            key={tech.name}
            ref={(el) => (cardElementsRef.current[index] = el)}
            onPointerDown={(e) => handlePointerDown(index, e)}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className={`absolute top-0 left-0 pointer-events-auto cursor-grab active:cursor-grabbing touch-none select-none ${
              isCurrentDragging
                ? "z-30 scale-110 opacity-100 drop-shadow-2xl"
                : "z-0 opacity-75 md:opacity-85 hover:opacity-100 hover:scale-105 transition-all duration-200"
            }`}
            style={{
              willChange: "transform",
            }}
          >
            <TechBox src={tech.src} name={tech.name} isDragging={isCurrentDragging} />
          </div>
        );
      })}
    </div>
  );
}

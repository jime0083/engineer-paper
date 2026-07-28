import React, { useEffect, useRef } from 'react';
import './ParticleReconstruction.css';

/**
 * ParticleReconstruction（粒子再構成）
 * 散らばった粒子がバネ運動で格子状の定位置へ「再構成」される。
 * 近接する粒子どうしを細い線で結び、知的・構築的なネットワークを描く。
 * カーソルに反発して構成が一時的に崩れ、離すと再び整う。
 * 装飾レイヤー（aria-hidden / pointer-events none）。reduced-motionでは静止。
 *
 * props:
 * - className: 追加クラス
 * - inkColor: 粒子・線の基調色（省略時は --color-gray-700）。暗背景では明色を渡す
 * - accentColor: アクセント粒子の色（省略時は --color-primary）
 */
function ParticleReconstruction({ className = '', inkColor, accentColor }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    const ctx = canvas.getContext('2d');
    const styles = getComputedStyle(document.documentElement);
    const ink =
      inkColor || styles.getPropertyValue('--color-gray-700').trim() || '#616161';
    const accent =
      accentColor || styles.getPropertyValue('--color-primary').trim() || '#0007F5';

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rand = (a, b) => a + Math.random() * (b - a);
    let w = 0;
    let h = 0;
    const particles = [];
    const mouse = { x: -9999, y: -9999 };

    const init = () => {
      const rect = parent.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      particles.length = 0;
      const gap = Math.max(64, Math.min(w, h) / 8);
      const cols = Math.ceil(w / gap) + 1;
      const rows = Math.ceil(h / gap) + 1;
      const offsetX = (w - (cols - 1) * gap) / 2;
      const offsetY = (h - (rows - 1) * gap) / 2;
      for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
          const tx = offsetX + c * gap + rand(-gap * 0.18, gap * 0.18);
          const ty = offsetY + r * gap + rand(-gap * 0.18, gap * 0.18);
          particles.push({
            x: rand(0, w),
            y: rand(0, h),
            tx,
            ty,
            vx: 0,
            vy: 0,
            accent: Math.random() < 0.16,
          });
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // 近接粒子どうしを線で結ぶ
      const maxD = 96;
      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        for (let j = i + 1; j < particles.length; j += 1) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < maxD * maxD) {
            const a = (1 - Math.sqrt(d2) / maxD) * 0.14;
            ctx.globalAlpha = a;
            ctx.strokeStyle = ink;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }

      // 粒子本体
      particles.forEach((p) => {
        ctx.globalAlpha = p.accent ? 0.9 : 0.45;
        ctx.fillStyle = p.accent ? accent : ink;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.accent ? 2.4 : 1.5, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    };

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    init();
    if (reduce) {
      particles.forEach((p) => {
        p.x = p.tx;
        p.y = p.ty;
      });
      draw();
      return undefined;
    }

    let raf;
    const step = () => {
      const repelR = 120;
      particles.forEach((p) => {
        // 定位置へのバネ（再構成）
        const ax = (p.tx - p.x) * 0.02;
        const ay = (p.ty - p.y) * 0.02;
        p.vx = (p.vx + ax) * 0.86;
        p.vy = (p.vy + ay) * 0.86;

        // カーソル反発（構成を一時的に崩す）
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < repelR && dist > 0) {
          const f = ((repelR - dist) / repelR) * 1.1;
          p.vx += (dx / dist) * f;
          p.vy += (dy / dist) * f;
        }

        p.x += p.vx;
        p.y += p.vy;
      });
      draw();
      raf = requestAnimationFrame(step);
    };

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };
    const onResize = () => { init(); };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('resize', onResize);
    parent.addEventListener('mouseleave', onLeave);
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
      parent.removeEventListener('mouseleave', onLeave);
    };
  }, [inkColor, accentColor]);

  return (
    <canvas
      ref={canvasRef}
      className={`particle-reconstruction ${className}`.trim()}
      aria-hidden="true"
    />
  );
}

export default ParticleReconstruction;

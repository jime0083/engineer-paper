import React, { useEffect, useRef } from 'react';
import './CursorInteraction.css';

/**
 * CursorInteraction
 * カーソルに追従するカスタムカーソル（リング）を描画する。
 * - タッチ環境（pointer: coarse）では自動的に無効化
 * - prefers-reduced-motion: reduce でも無効化
 * - hover 対象が data-cursor="hover" を持つ要素のとき、リングが拡大する
 *
 * ページのルート付近（MainLayout / トップページ）に一度だけ配置する想定。
 */
function CursorInteraction() {
  const ringRef = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return; // タッチ or モーション削減時は何もしない

    const ring = ringRef.current;
    if (!ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let rafId;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      ring.style.opacity = '1';

      // hover対象の判定（data-cursor="hover" を持つ祖先があるか）
      const interactive = e.target.closest?.('[data-cursor="hover"], a, button');
      ring.classList.toggle('cursor-ring--hover', Boolean(interactive));
    };

    const onLeave = () => {
      ring.style.opacity = '0';
    };

    const loop = () => {
      // イージング追従（0.18 = 追従の滑らかさ）
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return <div ref={ringRef} className="cursor-ring" aria-hidden="true" />;
}

export default CursorInteraction;

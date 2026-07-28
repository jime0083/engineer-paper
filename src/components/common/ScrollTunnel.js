import React, { useEffect, useRef } from 'react';
import './ScrollTunnel.css';

/**
 * ScrollTunnel（スクロールトンネル）
 * 要素がビューポート中心から離れるほど、奥へ引き込む（scale down + フェード）。
 * 中心に来たとき最前面（等倍・不透明）になり、スクロールで奥行きを移動する
 * 「トンネルを進む」ような映像的な深度表現を与える。reduced-motionでは無効。
 *
 * props:
 * - children: 対象要素
 * - strength: 効果の強さ（0〜1目安）。デフォルト 1
 * - className: 追加クラス
 */
function ScrollTunnel({ children, strength = 1, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    let raf = null;

    const update = () => {
      raf = null;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const center = rect.top + rect.height / 2;
      const progress = (center - vh / 2) / (vh / 2); // -1(上) 〜 1(下)
      const d = Math.min(Math.abs(progress), 1);
      const scale = 1 - d * 0.1 * strength;
      const opacity = 1 - d * 0.5 * strength;
      el.style.transform = `perspective(1200px) scale(${scale.toFixed(3)})`;
      el.style.opacity = opacity.toFixed(3);
    };

    const onScroll = () => {
      if (raf == null) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [strength]);

  return (
    <div ref={ref} className={`scroll-tunnel ${className}`.trim()}>
      {children}
    </div>
  );
}

export default ScrollTunnel;

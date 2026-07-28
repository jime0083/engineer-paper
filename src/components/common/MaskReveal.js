import React, { useEffect, useRef, useState } from 'react';
import './MaskReveal.css';

/**
 * MaskReveal
 * 要素が画面内に入ったとき、マスク（clip-path）が展開して中身が現れる演出。
 * IntersectionObserver でビューポート進入を検知する。
 *
 * props:
 * - children: 表示する中身
 * - direction: マスクの展開方向（'up' | 'down' | 'left' | 'right'）。デフォルト 'up'
 * - delay: 展開開始の遅延（ms）。デフォルト 0
 * - once: 一度だけ再生するか（デフォルト true）
 * - className: 追加クラス
 */
function MaskReveal({
  children,
  direction = 'up',
  delay = 0,
  once = true,
  className = '',
}) {
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // モーション削減設定時は即表示
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealed(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setRevealed(false);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  const classNames = [
    'mask-reveal',
    `mask-reveal--${direction}`,
    revealed ? 'mask-reveal--revealed' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={ref} className={classNames} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export default MaskReveal;

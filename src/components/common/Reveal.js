import React, { useEffect, useRef, useState } from 'react';
import './Reveal.css';

/**
 * Reveal
 * 子要素がビューポートに入ったときにフェード＋スライドアップで登場させるラッパー。
 * - IntersectionObserver で入場を検知し、一度表示したら監視を解除する
 * - prefers-reduced-motion: reduce の環境では即時表示（アニメーションなし）
 *
 * props:
 * - as: ラップに使うタグ（デフォルト 'div'）
 * - delay: 登場までの遅延ms（スタガー用、デフォルト 0）
 * - className: 追加クラス
 */
function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    // モーション低減設定なら即表示
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduce.matches) {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const classes = ['reveal', visible ? 'reveal--visible' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag ref={ref} className={classes} style={{ '--reveal-delay': `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  );
}

export default Reveal;

import React, { useEffect, useRef, useState } from 'react';
import './KinematicText.css';

/**
 * KinematicText（キネマティック文字）
 * 1文字ずつを「ブラー → シャープ」「わずかに下 → 定位置」で映画的に立ち上げる。
 * 派手さを抑えた知的・シネマティックなタイポグラフィ。reduced-motionでは静止表示。
 *
 * props:
 * - as: 描画タグ（'h1' | 'h2' | 'span' 等）。デフォルト 'span'
 * - children: 表示テキスト（文字列）
 * - stagger: 1文字あたりの遅延(ms)。デフォルト 55
 * - className: 追加クラス
 */
function KinematicText({ as: Tag = 'span', children, stagger = 55, className = '' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const text = typeof children === 'string' ? children : '';

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setVisible(true);
      return;
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
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const classNames = [
    'kinematic-text',
    visible ? 'kinematic-text--visible' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag ref={ref} className={classNames} aria-label={text}>
      {text.split('').map((ch, i) => (
        <span
          key={i}
          className="kinematic-char"
          style={{ transitionDelay: `${i * stagger}ms` }}
          aria-hidden="true"
        >
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </Tag>
  );
}

export default KinematicText;

import React, { useRef } from 'react';
import './GlitchImage.css';

/**
 * GlitchImage
 * 中の要素（ImagePlaceholder や <img>）を包み、カーソルに反応して
 * 歪み（RGBずれ + スキュー + 走査線）を加えるラッパー。
 *
 * カーソルのX位置に応じて歪みの向き・強度が変わる（CSS変数 --gx を更新）。
 *
 * props:
 * - children: 包む要素
 * - intensity: 歪みの強さ（'subtle' | 'normal' | 'strong'）。デフォルト 'normal'
 * - className: 追加クラス
 */
function GlitchImage({ children, intensity = 'normal', className = '' }) {
  const ref = useRef(null);

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    // -1 〜 1 に正規化したカーソルX位置
    const gx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    el.style.setProperty('--gx', gx.toFixed(3));
  };

  const handleLeave = () => {
    const el = ref.current;
    if (el) el.style.setProperty('--gx', '0');
  };

  const classNames = [
    'glitch-image',
    `glitch-image--${intensity}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={ref}
      className={classNames}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ '--gx': 0 }}
    >
      <div className="glitch-image-layer glitch-image-layer--base">
        {children}
      </div>
      <div className="glitch-image-scanlines" aria-hidden="true" />
    </div>
  );
}

export default GlitchImage;

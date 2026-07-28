import React from 'react';
import './GlitchText.css';

/**
 * GlitchText
 * RGBずれ + 走査線によるグリッチ演出のテキスト。
 * カーソルhoverで強度が上がる。
 * data-text 属性に同じテキストを渡し、疑似要素で青/ピンクのずれを描画する。
 *
 * props:
 * - as: 描画するタグ（'h1' | 'h2' | 'span' 等）。デフォルト 'span'
 * - children: 表示テキスト（文字列）
 * - active: 常時グリッチを走らせるか（デフォルト false = hover時のみ強く出る）
 * - className: 追加クラス
 */
function GlitchText({ as: Tag = 'span', children, active = false, className = '' }) {
  const text = typeof children === 'string' ? children : '';

  const classNames = [
    'glitch-text',
    active ? 'glitch-text--active' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag className={classNames} data-text={text}>
      {children}
    </Tag>
  );
}

export default GlitchText;

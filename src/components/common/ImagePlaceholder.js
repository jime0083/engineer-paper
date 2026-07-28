import React from 'react';
import './ImagePlaceholder.css';

/**
 * ImagePlaceholder
 * 実画像が用意できるまでの「ワイヤーフレーム枠」プレースホルダー。
 * どこにどんな画像を置くかは img.txt に記録している。
 * 実画像が用意できたら、このコンポーネントを <img> に差し替える。
 *
 * props:
 * - slotId: img.txt に記録したスロットID（例: 'HOME-HERO'）
 * - label: 枠内に表示する説明ラベル（省略時は slotId を表示）
 * - ratio: アスペクト比（例: '16 / 9' | '4 / 3' | '1 / 1'）。デフォルト '16 / 9'
 * - rounded: 角丸にするか（デフォルト true）
 * - className: 追加クラス
 */
function ImagePlaceholder({
  slotId,
  label,
  ratio = '16 / 9',
  rounded = true,
  className = '',
}) {
  const classNames = [
    'image-placeholder',
    rounded ? 'image-placeholder--rounded' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classNames}
      style={{ aspectRatio: ratio }}
      role="img"
      aria-label={label || slotId || '画像プレースホルダー'}
      data-slot-id={slotId}
    >
      <div className="image-placeholder-inner">
        <svg
          className="image-placeholder-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
        {slotId && <span className="image-placeholder-slot">[{slotId}]</span>}
        <span className="image-placeholder-label">{label || '画像を配置予定'}</span>
      </div>
    </div>
  );
}

export default ImagePlaceholder;

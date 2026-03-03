import React from 'react';
import './AdPlaceholder.css';

/**
 * 広告プレースホルダーコンポーネント
 * Google AdSense広告を表示するためのプレースホルダー
 * position: 'left' | 'right' | 'bottom'
 */
function AdPlaceholder({ position }) {
  const classNames = `ad-placeholder ad-${position}`;

  return (
    <aside className={classNames}>
      <div className="ad-content">
        {/* Google AdSense広告コードをここに挿入 */}
        <span className="ad-label">広告</span>
      </div>
    </aside>
  );
}

export default AdPlaceholder;

import React from 'react';
import './LoadingSpinner.css';

/**
 * ローディングスピナーコンポーネント
 * 読み込み中の状態を表示
 */
function LoadingSpinner({
  size = 'medium',
  color = 'primary',
  text = '',
  fullScreen = false,
  className = '',
}) {
  const spinnerClasses = [
    'loading-spinner',
    `loading-spinner--${size}`,
    `loading-spinner--${color}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const spinner = (
    <div className={spinnerClasses}>
      <div className="loading-spinner-circle" />
      {text && <span className="loading-spinner-text">{text}</span>}
    </div>
  );

  if (fullScreen) {
    return <div className="loading-spinner-overlay">{spinner}</div>;
  }

  return spinner;
}

export default LoadingSpinner;

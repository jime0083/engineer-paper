import React from 'react';
import './Alert.css';

/**
 * アラートコンポーネント
 * 成功/エラー/警告/情報メッセージを表示
 * type: 'success' | 'error' | 'warning' | 'info'
 */
function Alert({
  type = 'info',
  title,
  children,
  onClose,
  className = '',
}) {
  const icons = {
    success: '✓',
    error: '✕',
    warning: '!',
    info: 'i',
  };

  const alertClasses = ['alert', `alert--${type}`, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={alertClasses} role="alert">
      <span className="alert-icon" aria-hidden="true">
        {icons[type]}
      </span>
      <div className="alert-content">
        {title && <strong className="alert-title">{title}</strong>}
        {children && <div className="alert-message">{children}</div>}
      </div>
      {onClose && (
        <button
          type="button"
          className="alert-close"
          onClick={onClose}
          aria-label="閉じる"
        >
          ×
        </button>
      )}
    </div>
  );
}

export default Alert;

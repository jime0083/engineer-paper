import React from 'react';
import './Button.css';

/**
 * ボタンコンポーネント
 * variant: 'primary' | 'secondary' | 'add' | 'delete' | 'ok'
 */
function Button({
  children,
  variant = 'primary',
  type = 'button',
  onClick,
  disabled = false,
  className = '',
  size = 'medium',
  fullWidth = false,
  icon,
}) {
  const classNames = [
    'button',
    `button--${variant}`,
    `button--${size}`,
    fullWidth ? 'button--full-width' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classNames}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="button-icon">{icon}</span>}
      {children && <span className="button-text">{children}</span>}
    </button>
  );
}

/**
 * プライマリボタン（次へボタン等）
 */
export function PrimaryButton(props) {
  return <Button variant="primary" {...props} />;
}

/**
 * セカンダリボタン（前へボタン等）
 */
export function SecondaryButton(props) {
  return <Button variant="secondary" {...props} />;
}

/**
 * 追加ボタン（+）
 */
export function AddButton({ onClick, disabled, className = '' }) {
  return (
    <Button
      variant="add"
      onClick={onClick}
      disabled={disabled}
      className={className}
      icon="+"
    >
      追加
    </Button>
  );
}

/**
 * 削除ボタン
 */
export function DeleteButton({ onClick, disabled, className = '' }) {
  return (
    <Button
      variant="delete"
      onClick={onClick}
      disabled={disabled}
      className={className}
      icon="×"
    >
      削除
    </Button>
  );
}

/**
 * OKボタン
 */
export function OkButton({ onClick, disabled, className = '' }) {
  return (
    <Button
      variant="ok"
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      OK
    </Button>
  );
}

export default Button;

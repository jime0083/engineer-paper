import React from 'react';
import './TextInput.css';

/**
 * テキスト入力コンポーネント
 * ラベル・エラー表示付きの汎用テキスト入力フィールド
 */
function TextInput({
  label,
  name,
  value,
  onChange,
  placeholder = '',
  type = 'text',
  required = false,
  error = '',
  disabled = false,
  maxLength,
  className = '',
}) {
  const inputId = `input-${name}`;
  const hasError = !!error;

  return (
    <div className={`text-input-wrapper ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-input-label">
          {label}
          {required && <span className="text-input-required">*</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        className={`text-input ${hasError ? 'text-input--error' : ''}`}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${inputId}-error` : undefined}
      />
      {hasError && (
        <span id={`${inputId}-error`} className="text-input-error">
          {error}
        </span>
      )}
    </div>
  );
}

export default TextInput;

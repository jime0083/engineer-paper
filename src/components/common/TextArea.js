import React from 'react';
import './TextArea.css';

/**
 * テキストエリアコンポーネント
 * 文字数カウント付きの複数行テキスト入力フィールド
 */
function TextArea({
  label,
  name,
  value,
  onChange,
  placeholder = '',
  required = false,
  error = '',
  disabled = false,
  maxLength,
  rows = 5,
  showCount = false,
  guideText = '',
  className = '',
}) {
  const textareaId = `textarea-${name}`;
  const hasError = !!error;
  const currentLength = value ? value.length : 0;
  const isOverLimit = maxLength && currentLength > maxLength;

  return (
    <div className={`textarea-wrapper ${className}`}>
      {label && (
        <label htmlFor={textareaId} className="textarea-label">
          {label}
          {required && <span className="textarea-required">*</span>}
        </label>
      )}
      {guideText && <p className="textarea-guide">{guideText}</p>}
      <textarea
        id={textareaId}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        rows={rows}
        className={`textarea ${hasError || isOverLimit ? 'textarea--error' : ''}`}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${textareaId}-error` : undefined}
      />
      <div className="textarea-footer">
        {hasError && (
          <span id={`${textareaId}-error`} className="textarea-error">
            {error}
          </span>
        )}
        {showCount && maxLength && (
          <span
            className={`textarea-count ${isOverLimit ? 'textarea-count--error' : ''}`}
          >
            {currentLength} / {maxLength}
          </span>
        )}
      </div>
    </div>
  );
}

export default TextArea;

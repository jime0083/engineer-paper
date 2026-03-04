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
  maxLines,
  rows = 5,
  showCount = false,
  guideText = '',
  className = '',
}) {
  const textareaId = `textarea-${name}`;
  const hasError = !!error;
  const currentLength = value ? value.length : 0;
  const currentLines = value ? value.split('\n').length : 0;
  const isOverLimit = maxLength && currentLength > maxLength;
  const isOverLines = maxLines && currentLines > maxLines;

  // 行数制限を適用するハンドラー
  const handleChange = (e) => {
    const newValue = e.target.value;
    const lines = newValue.split('\n');

    // 行数制限がある場合、超過分を切り詰める
    if (maxLines && lines.length > maxLines) {
      const truncatedValue = lines.slice(0, maxLines).join('\n');
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          name: e.target.name,
          value: truncatedValue,
        },
      };
      onChange(syntheticEvent);
      return;
    }

    onChange(e);
  };

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
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        rows={rows}
        className={`textarea ${hasError || isOverLimit || isOverLines ? 'textarea--error' : ''}`}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${textareaId}-error` : undefined}
      />
      <div className="textarea-footer">
        {hasError && (
          <span id={`${textareaId}-error`} className="textarea-error">
            {error}
          </span>
        )}
        <div className="textarea-counts">
          {showCount && maxLength && (
            <span
              className={`textarea-count ${isOverLimit ? 'textarea-count--error' : ''}`}
            >
              {currentLength} / {maxLength}文字
            </span>
          )}
          {showCount && maxLines && (
            <span
              className={`textarea-count ${isOverLines ? 'textarea-count--error' : ''}`}
            >
              {currentLines} / {maxLines}行
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default TextArea;

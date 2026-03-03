import React from 'react';
import './SelectBox.css';

/**
 * セレクトボックスコンポーネント
 * ラベル・エラー表示付きのドロップダウン選択フィールド
 */
function SelectBox({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = '選択してください',
  required = false,
  error = '',
  disabled = false,
  className = '',
}) {
  const selectId = `select-${name}`;
  const hasError = !!error;

  return (
    <div className={`select-wrapper ${className}`}>
      {label && (
        <label htmlFor={selectId} className="select-label">
          {label}
          {required && <span className="select-required">*</span>}
        </label>
      )}
      <div className="select-container">
        <select
          id={selectId}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`select ${hasError ? 'select--error' : ''} ${!value ? 'select--placeholder' : ''}`}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${selectId}-error` : undefined}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="select-arrow">▼</span>
      </div>
      {hasError && (
        <span id={`${selectId}-error`} className="select-error">
          {error}
        </span>
      )}
    </div>
  );
}

export default SelectBox;

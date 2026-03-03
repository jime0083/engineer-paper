import React from 'react';
import './Checkbox.css';

/**
 * チェックボックスコンポーネント
 * 単一のチェックボックス（ラベル付き）
 */
function Checkbox({
  label,
  name,
  checked,
  onChange,
  required = false,
  error = '',
  disabled = false,
  className = '',
}) {
  const checkboxId = `checkbox-${name}`;
  const hasError = !!error;

  const handleChange = (event) => {
    if (onChange) {
      onChange(event);
    }
  };

  return (
    <div className={`checkbox-wrapper ${className}`}>
      <label
        htmlFor={checkboxId}
        className={`checkbox-label ${checked ? 'checkbox-label--checked' : ''} ${disabled ? 'checkbox-label--disabled' : ''}`}
      >
        <input
          type="checkbox"
          id={checkboxId}
          name={name}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className="checkbox-input"
          aria-invalid={hasError}
          aria-describedby={hasError ? `${checkboxId}-error` : undefined}
        />
        <span className="checkbox-custom">
          {checked && (
            <svg
              className="checkbox-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </span>
        <span className="checkbox-text">
          {label}
          {required && <span className="checkbox-required">*</span>}
        </span>
      </label>
      {hasError && (
        <span id={`${checkboxId}-error`} className="checkbox-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

export default Checkbox;

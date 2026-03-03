import React from 'react';
import './RadioGroup.css';

/**
 * ラジオボタングループコンポーネント
 * 複数の選択肢から1つを選択するためのラジオボタン群
 */
function RadioGroup({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
  error = '',
  disabled = false,
  direction = 'horizontal',
  className = '',
}) {
  const groupId = `radio-group-${name}`;
  const hasError = !!error;

  const handleChange = (event) => {
    if (onChange) {
      onChange(event);
    }
  };

  return (
    <div className={`radio-group-wrapper ${className}`}>
      {label && (
        <span className="radio-group-label">
          {label}
          {required && <span className="radio-group-required">*</span>}
        </span>
      )}
      <div
        className={`radio-group radio-group--${direction}`}
        role="radiogroup"
        aria-labelledby={groupId}
      >
        {options.map((option) => {
          const radioId = `${name}-${option.value}`;
          const isChecked = value === option.value;

          return (
            <label
              key={option.value}
              htmlFor={radioId}
              className={`radio-option ${isChecked ? 'radio-option--checked' : ''} ${disabled ? 'radio-option--disabled' : ''}`}
            >
              <input
                type="radio"
                id={radioId}
                name={name}
                value={option.value}
                checked={isChecked}
                onChange={handleChange}
                disabled={disabled}
                className="radio-input"
              />
              <span className="radio-custom" />
              <span className="radio-text">{option.label}</span>
            </label>
          );
        })}
      </div>
      {hasError && (
        <span className="radio-group-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

export default RadioGroup;

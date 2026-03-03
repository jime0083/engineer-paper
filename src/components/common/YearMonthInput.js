import React from 'react';
import './YearMonthInput.css';

/**
 * 年の選択肢を生成
 */
const generateYearOptions = (startYear = 1990, endYear = new Date().getFullYear() + 5) => {
  const years = [];
  for (let year = endYear; year >= startYear; year--) {
    years.push({ value: String(year), label: `${year}年` });
  }
  return years;
};

/**
 * 月の選択肢を生成
 */
const generateMonthOptions = () => {
  const months = [];
  for (let month = 1; month <= 12; month++) {
    months.push({ value: String(month).padStart(2, '0'), label: `${month}月` });
  }
  return months;
};

/**
 * 年月入力コンポーネント
 * 期間入力用の年・月セレクトボックス群
 */
function YearMonthInput({
  label,
  name,
  value = { year: '', month: '' },
  onChange,
  required = false,
  error = '',
  disabled = false,
  startYear = 1990,
  endYear = new Date().getFullYear() + 5,
  className = '',
}) {
  const hasError = !!error;
  const yearOptions = generateYearOptions(startYear, endYear);
  const monthOptions = generateMonthOptions();

  const handleChange = (field) => (event) => {
    const newValue = {
      ...value,
      [field]: event.target.value,
    };

    if (onChange) {
      onChange({
        target: {
          name,
          value: newValue,
        },
      });
    }
  };

  return (
    <div className={`year-month-input-wrapper ${className}`}>
      {label && (
        <span className="year-month-input-label">
          {label}
          {required && <span className="year-month-input-required">*</span>}
        </span>
      )}
      <div className="year-month-input-group">
        <div className="year-month-input-select-wrapper">
          <select
            name={`${name}-year`}
            value={value.year}
            onChange={handleChange('year')}
            disabled={disabled}
            className={`year-month-input-select year-month-input-year ${hasError ? 'year-month-input-select--error' : ''}`}
            aria-label="年"
          >
            <option value="">年</option>
            {yearOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span className="year-month-input-arrow">▼</span>
        </div>

        <div className="year-month-input-select-wrapper">
          <select
            name={`${name}-month`}
            value={value.month}
            onChange={handleChange('month')}
            disabled={disabled}
            className={`year-month-input-select year-month-input-month ${hasError ? 'year-month-input-select--error' : ''}`}
            aria-label="月"
          >
            <option value="">月</option>
            {monthOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span className="year-month-input-arrow">▼</span>
        </div>
      </div>
      {hasError && (
        <span className="year-month-input-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

export default YearMonthInput;

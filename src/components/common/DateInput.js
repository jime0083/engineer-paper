import React from 'react';
import './DateInput.css';

/**
 * 年の選択肢を生成
 */
const generateYearOptions = (startYear = 1950, endYear = new Date().getFullYear()) => {
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
 * 日の選択肢を生成（月によって日数が変わる）
 */
const generateDayOptions = (year, month) => {
  const days = [];
  const daysInMonth = year && month ? new Date(year, month, 0).getDate() : 31;
  for (let day = 1; day <= daysInMonth; day++) {
    days.push({ value: String(day).padStart(2, '0'), label: `${day}日` });
  }
  return days;
};

/**
 * 日付入力コンポーネント
 * 年・月・日を分割して入力するセレクトボックス群
 */
function DateInput({
  label,
  name,
  value = { year: '', month: '', day: '' },
  onChange,
  required = false,
  error = '',
  disabled = false,
  startYear = 1950,
  endYear = new Date().getFullYear(),
  className = '',
}) {
  const hasError = !!error;
  const yearOptions = generateYearOptions(startYear, endYear);
  const monthOptions = generateMonthOptions();
  const dayOptions = generateDayOptions(
    value.year ? parseInt(value.year, 10) : null,
    value.month ? parseInt(value.month, 10) : null
  );

  const handleChange = (field) => (event) => {
    const newValue = {
      ...value,
      [field]: event.target.value,
    };

    // 日が選択されている状態で月や年を変更した場合、日数が足りなければリセット
    if (field !== 'day' && newValue.day) {
      const maxDays = new Date(
        parseInt(newValue.year, 10) || new Date().getFullYear(),
        parseInt(newValue.month, 10) || 1,
        0
      ).getDate();
      if (parseInt(newValue.day, 10) > maxDays) {
        newValue.day = '';
      }
    }

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
    <div className={`date-input-wrapper ${className}`}>
      {label && (
        <span className="date-input-label">
          {label}
          {required && <span className="date-input-required">*</span>}
        </span>
      )}
      <div className="date-input-group">
        <div className="date-input-select-wrapper">
          <select
            name={`${name}-year`}
            value={value.year}
            onChange={handleChange('year')}
            disabled={disabled}
            className={`date-input-select date-input-year ${hasError ? 'date-input-select--error' : ''}`}
            aria-label="年"
          >
            <option value="">年</option>
            {yearOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span className="date-input-arrow">▼</span>
        </div>

        <div className="date-input-select-wrapper">
          <select
            name={`${name}-month`}
            value={value.month}
            onChange={handleChange('month')}
            disabled={disabled}
            className={`date-input-select date-input-month ${hasError ? 'date-input-select--error' : ''}`}
            aria-label="月"
          >
            <option value="">月</option>
            {monthOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span className="date-input-arrow">▼</span>
        </div>

        <div className="date-input-select-wrapper">
          <select
            name={`${name}-day`}
            value={value.day}
            onChange={handleChange('day')}
            disabled={disabled}
            className={`date-input-select date-input-day ${hasError ? 'date-input-select--error' : ''}`}
            aria-label="日"
          >
            <option value="">日</option>
            {dayOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span className="date-input-arrow">▼</span>
        </div>
      </div>
      {hasError && (
        <span className="date-input-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

export default DateInput;

import React, { useState } from 'react';
import TextInput from '../common/TextInput';
import YearMonthInput from '../common/YearMonthInput';
import Checkbox from '../common/Checkbox';
import './SkillCard.css';

/**
 * 経歴カードコンポーネント
 * 経歴情報の追加・編集・削除が可能なカード
 */
function CareerCard({
  career,
  index,
  onChange,
  onDelete,
  onConfirm,
  onMoveUp,
  onMoveDown,
  isConfirmed = false,
  isFirst = false,
  isLast = false,
  errors = {},
}) {
  const [isExpanded, setIsExpanded] = useState(!isConfirmed);

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    onChange(index, { ...career, [name]: value });
  };

  const handleCurrentJobChange = (event) => {
    const isCurrentJob = event.target.checked;
    // 「現在」をチェックした場合、終了年月をクリア
    if (isCurrentJob) {
      onChange(index, {
        ...career,
        isCurrentJob: true,
        endPeriod: { year: '', month: '' },
      });
    } else {
      onChange(index, { ...career, isCurrentJob: false });
    }
  };

  const handleToggle = () => {
    if (isConfirmed) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(index);
      setIsExpanded(false);
    }
  };

  const handleEdit = () => {
    setIsExpanded(true);
  };

  const formatPeriod = () => {
    const { startPeriod, endPeriod, isCurrentJob } = career;
    if (!startPeriod?.year || !startPeriod?.month) return '';
    const start = `${startPeriod.year}/${startPeriod.month}`;

    // 「現在」の場合は終了年月を表示しない
    if (isCurrentJob) {
      return `${start}〜`;
    }

    const end = endPeriod?.year && endPeriod?.month
      ? `${endPeriod.year}/${endPeriod.month}`
      : '';
    return `${start}〜${end}`;
  };

  return (
    <div className={`skill-card ${isConfirmed ? 'skill-card--confirmed' : ''}`}>
      <div className="skill-card-header" onClick={handleToggle}>
        {/* 並び替え矢印 */}
        <div className="skill-card-reorder">
          <button
            type="button"
            className="skill-card-arrow"
            onClick={(e) => {
              e.stopPropagation();
              onMoveUp && onMoveUp(index);
            }}
            disabled={isFirst}
            aria-label="上に移動"
            title="上に移動"
          >
            ▲
          </button>
          <button
            type="button"
            className="skill-card-arrow"
            onClick={(e) => {
              e.stopPropagation();
              onMoveDown && onMoveDown(index);
            }}
            disabled={isLast}
            aria-label="下に移動"
            title="下に移動"
          >
            ▼
          </button>
        </div>
        <div className="skill-card-title">
          <span className="skill-card-number">{index + 1}</span>
          <span className="skill-card-name">
            {career.company || '新しい経歴'}
          </span>
          {isConfirmed && career.startPeriod?.year && (
            <span className="skill-card-experience">
              （{formatPeriod()}）
            </span>
          )}
        </div>
        <div className="skill-card-actions">
          {isConfirmed && (
            <button
              type="button"
              className="skill-card-toggle"
              aria-expanded={isExpanded}
              aria-label={isExpanded ? '折りたたむ' : '展開する'}
            >
              {isExpanded ? '▲' : '▼'}
            </button>
          )}
          <button
            type="button"
            className="skill-card-delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(index);
            }}
            aria-label="削除"
          >
            ×
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="skill-card-body">
          <div className="form-row" style={{ alignItems: 'flex-start' }}>
            <YearMonthInput
              label="開始年月"
              name="startPeriod"
              value={career.startPeriod || { year: '', month: '' }}
              onChange={handleFieldChange}
              error={errors.startPeriod}
            />
            <span className="period-separator" style={{ margin: '0 8px', marginTop: '32px' }}>〜</span>
            <div>
              <YearMonthInput
                label="終了年月"
                name="endPeriod"
                value={career.endPeriod || { year: '', month: '' }}
                onChange={handleFieldChange}
                error={errors.endPeriod}
                disabled={career.isCurrentJob}
              />
              <Checkbox
                label="現在"
                name="isCurrentJob"
                checked={career.isCurrentJob || false}
                onChange={handleCurrentJobChange}
              />
            </div>
          </div>

          <TextInput
            label="職歴"
            name="company"
            value={career.company || ''}
            onChange={handleFieldChange}
            placeholder="例：株式会社〇〇〇〇,フリーランス etc..."
            required
            error={errors.company}
          />

          <div className="skill-card-footer">
            {isConfirmed ? (
              <button
                type="button"
                className="skill-card-button skill-card-button--edit"
                onClick={handleEdit}
              >
                編集
              </button>
            ) : (
              <button
                type="button"
                className="skill-card-button skill-card-button--ok"
                onClick={handleConfirm}
              >
                OK
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CareerCard;

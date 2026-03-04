import React, { useState } from 'react';
import TextInput from '../common/TextInput';
import TextArea from '../common/TextArea';
import YearMonthInput from '../common/YearMonthInput';
import Checkbox from '../common/Checkbox';
import './WorkHistoryCard.css';

/**
 * 稼働期間を計算
 */
const calculateDuration = (startYear, startMonth, endYear, endMonth, isCurrentJob) => {
  if (!startYear || !startMonth) return '';

  const start = new Date(parseInt(startYear, 10), parseInt(startMonth, 10) - 1);
  let end;

  if (isCurrentJob) {
    end = new Date();
  } else if (endYear && endMonth) {
    end = new Date(parseInt(endYear, 10), parseInt(endMonth, 10) - 1);
  } else {
    return '';
  }

  // 開始月と終了月を含めるため +1 を追加
  // 例: 2023/10 ~ 2024/09 = 12ヶ月（10月から9月まで稼働）
  const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (years > 0 && remainingMonths > 0) {
    return `${years}年${remainingMonths}ヶ月`;
  } else if (years > 0) {
    return `${years}年`;
  } else if (remainingMonths > 0) {
    return `${remainingMonths}ヶ月`;
  }
  return '';
};

/**
 * 職務経歴カードコンポーネント
 * 職務経歴情報の追加・編集・削除が可能なカード
 */
function WorkHistoryCard({
  workHistory,
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
    const { name, value, type, checked } = event.target;
    const newValue = type === 'checkbox' ? checked : value;
    onChange(index, { ...workHistory, [name]: newValue });
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

  const duration = calculateDuration(
    workHistory.startPeriod?.year,
    workHistory.startPeriod?.month,
    workHistory.endPeriod?.year,
    workHistory.endPeriod?.month,
    workHistory.isCurrentJob
  );

  return (
    <div className={`work-history-card ${isConfirmed ? 'work-history-card--confirmed' : ''}`}>
      <div className="work-history-card-header" onClick={handleToggle}>
        {/* 並び替え矢印 */}
        <div className="work-history-card-reorder">
          <button
            type="button"
            className="work-history-card-arrow"
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
            className="work-history-card-arrow"
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
        <div className="work-history-card-title">
          <span className="work-history-card-number">{index + 1}</span>
          <div className="work-history-card-info">
            <span className="work-history-card-name">
              {workHistory.projectName || '新しい職務経歴'}
            </span>
            {isConfirmed && duration && (
              <span className="work-history-card-duration">
                {duration}
              </span>
            )}
          </div>
        </div>
        <div className="work-history-card-actions">
          {isConfirmed && (
            <button
              type="button"
              className="work-history-card-toggle"
              aria-expanded={isExpanded}
              aria-label={isExpanded ? '折りたたむ' : '展開する'}
            >
              {isExpanded ? '▲' : '▼'}
            </button>
          )}
          <button
            type="button"
            className="work-history-card-delete"
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
        <div className="work-history-card-body">
          <div className="work-history-card-period">
            <div className="work-history-card-period-row">
              <YearMonthInput
                label="開始年月"
                name="startPeriod"
                value={workHistory.startPeriod || { year: '', month: '' }}
                onChange={handleFieldChange}
                required
                error={errors.startPeriod}
              />
              <span className="work-history-card-period-separator">〜</span>
              <YearMonthInput
                label="終了年月"
                name="endPeriod"
                value={workHistory.endPeriod || { year: '', month: '' }}
                onChange={handleFieldChange}
                disabled={workHistory.isCurrentJob}
                error={errors.endPeriod}
              />
            </div>
            <div className="work-history-card-current-job">
              <Checkbox
                label="在職中"
                name="isCurrentJob"
                checked={workHistory.isCurrentJob || false}
                onChange={handleFieldChange}
              />
              {duration && (
                <span className="work-history-card-calculated-duration">
                  稼働期間: {duration}
                </span>
              )}
            </div>
          </div>

          <TextInput
            label="プロジェクト名"
            name="projectName"
            value={workHistory.projectName || ''}
            onChange={handleFieldChange}
            placeholder="例: 基幹システムリニューアルプロジェクト"
            required
            error={errors.projectName}
          />

          <TextArea
            label="業務概要"
            name="description"
            value={workHistory.description || ''}
            onChange={handleFieldChange}
            placeholder="担当した業務の内容を記入してください"
            rows={6}
            maxLength={300}
            maxLines={10}
            showCount
          />

          <div className="work-history-card-row">
            <TextInput
              label="役割"
              name="role"
              value={workHistory.role || ''}
              onChange={handleFieldChange}
              placeholder="例: PL, SE, PG"
              className="work-history-card-half"
            />
            <TextInput
              label="規模"
              name="scale"
              value={workHistory.scale || ''}
              onChange={handleFieldChange}
              placeholder="例: 5名"
              className="work-history-card-half"
            />
          </div>

          <TextInput
            label="使用言語"
            name="languages"
            value={workHistory.languages || ''}
            onChange={handleFieldChange}
            placeholder="例: Java, JavaScript, SQL"
          />

          <TextInput
            label="FW・MW・ツール等"
            name="tools"
            value={workHistory.tools || ''}
            onChange={handleFieldChange}
            placeholder="例: Spring Boot, React, PostgreSQL, AWS"
          />

          <div className="work-history-card-footer">
            {isConfirmed ? (
              <button
                type="button"
                className="work-history-card-button work-history-card-button--edit"
                onClick={() => setIsExpanded(true)}
              >
                編集
              </button>
            ) : (
              <button
                type="button"
                className="work-history-card-button work-history-card-button--ok"
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

export default WorkHistoryCard;

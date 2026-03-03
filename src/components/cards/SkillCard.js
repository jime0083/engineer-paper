import React, { useState } from 'react';
import TextInput from '../common/TextInput';
import TextArea from '../common/TextArea';
import SelectBox from '../common/SelectBox';
import './SkillCard.css';

/**
 * 経験年数の選択肢
 */
const experienceOptions = [
  { value: '0', label: '1年未満' },
  { value: '1', label: '1年' },
  { value: '2', label: '2年' },
  { value: '3', label: '3年' },
  { value: '4', label: '4年' },
  { value: '5', label: '5年' },
  { value: '6', label: '6年' },
  { value: '7', label: '7年' },
  { value: '8', label: '8年' },
  { value: '9', label: '9年' },
  { value: '10', label: '10年以上' },
];

/**
 * スキルカードコンポーネント
 * スキル情報の追加・編集・削除が可能なカード
 */
function SkillCard({
  skill,
  index,
  onChange,
  onDelete,
  onConfirm,
  isConfirmed = false,
  errors = {},
}) {
  const [isExpanded, setIsExpanded] = useState(!isConfirmed);

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    onChange(index, { ...skill, [name]: value });
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

  return (
    <div className={`skill-card ${isConfirmed ? 'skill-card--confirmed' : ''}`}>
      <div className="skill-card-header" onClick={handleToggle}>
        <div className="skill-card-title">
          <span className="skill-card-number">{index + 1}</span>
          <span className="skill-card-name">
            {skill.name || '新しいスキル'}
          </span>
          {isConfirmed && skill.experience && (
            <span className="skill-card-experience">
              （{experienceOptions.find((opt) => opt.value === skill.experience)?.label}）
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
          <TextInput
            label="スキル名"
            name="name"
            value={skill.name || ''}
            onChange={handleFieldChange}
            placeholder="例: JavaScript, React, Python"
            required
            error={errors.name}
          />

          <SelectBox
            label="経験年数"
            name="experience"
            value={skill.experience || ''}
            onChange={handleFieldChange}
            options={experienceOptions}
            required
            error={errors.experience}
          />

          <TextArea
            label="習熟度・説明"
            name="description"
            value={skill.description || ''}
            onChange={handleFieldChange}
            placeholder="このスキルの習熟度や具体的な経験を記入してください"
            rows={3}
            maxLength={200}
            showCount
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

export default SkillCard;

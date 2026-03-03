import React from 'react';
import './StepIndicator.css';

/**
 * ステップの設定
 */
const STEPS = [
  { id: 1, label: 'プロフィール' },
  { id: 2, label: '住所' },
  { id: 3, label: '連絡先' },
  { id: 4, label: 'スキル' },
  { id: 5, label: '職務経歴' },
  { id: 6, label: '自己PR' },
  { id: 7, label: '作成日' },
  { id: 8, label: '確認' },
  { id: 9, label: '完了' },
];

/**
 * ステップインジケーターコンポーネント
 * 現在のステップと完了状態を視覚的に表示
 */
function StepIndicator({ currentStep }) {
  /**
   * ステップの状態を取得
   * @param {number} stepId - ステップID
   * @returns {'completed' | 'current' | 'pending'}
   */
  const getStepStatus = (stepId) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'pending';
  };

  return (
    <div className="step-indicator">
      <div className="step-list">
        {STEPS.map((step, index) => {
          const status = getStepStatus(step.id);
          const isLast = index === STEPS.length - 1;

          return (
            <div key={step.id} className="step-item">
              <div className={`step-icon step-icon--${status}`}>
                {status === 'completed' ? (
                  <span className="step-icon-completed">✓</span>
                ) : status === 'current' ? (
                  <span className="step-icon-current">●</span>
                ) : (
                  <span className="step-icon-number">{step.id}</span>
                )}
              </div>
              <span className={`step-label step-label--${status}`}>
                {step.label}
              </span>
              {!isLast && (
                <div
                  className={`step-connector step-connector--${
                    step.id < currentStep ? 'completed' : 'pending'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StepIndicator;

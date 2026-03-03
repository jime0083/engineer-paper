import React from 'react';
import { useNavigate } from 'react-router-dom';
import './StepIndicator.css';

/**
 * ステップの設定
 */
const STEPS = [
  { id: 1, label: 'プロフィール', path: '/step/1' },
  { id: 2, label: '住所', path: '/step/2' },
  { id: 3, label: '連絡先', path: '/step/3' },
  { id: 4, label: 'スキル', path: '/step/4' },
  { id: 5, label: '職務経歴', path: '/step/5' },
  { id: 6, label: '自己PR', path: '/step/6' },
  { id: 7, label: '作成日', path: '/step/7' },
  { id: 8, label: '確認', path: '/step/8' },
  { id: 9, label: '完了', path: '/complete' },
];

/**
 * ステップインジケーターコンポーネント
 * 現在のステップと完了状態を視覚的に表示
 * クリックで各ステップに移動可能
 */
function StepIndicator({ currentStep }) {
  const navigate = useNavigate();
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

  /**
   * ステップクリック時のハンドラー
   * 完了済みステップまたは現在のステップのみクリック可能
   */
  const handleStepClick = (step, status) => {
    // 完了済みまたは現在のステップのみナビゲート可能
    if (status === 'completed' || status === 'current') {
      navigate(step.path);
    }
  };

  return (
    <div className="step-indicator">
      <div className="step-list">
        {STEPS.map((step, index) => {
          const status = getStepStatus(step.id);
          const isLast = index === STEPS.length - 1;
          const isClickable = status === 'completed' || status === 'current';

          return (
            <div
              key={step.id}
              className={`step-item ${isClickable ? 'step-item--clickable' : ''}`}
              onClick={() => handleStepClick(step, status)}
              role={isClickable ? 'button' : undefined}
              tabIndex={isClickable ? 0 : undefined}
              onKeyDown={(e) => {
                if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                  handleStepClick(step, status);
                }
              }}
            >
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

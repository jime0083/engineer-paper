import React from 'react';
import './StepNavigation.css';

/**
 * ステップナビゲーションコンポーネント
 * 「前へ」「次へ」ボタンを表示
 */
function StepNavigation({
  currentStep,
  totalSteps = 9,
  onPrev,
  onNext,
  onPreview,
  isNextDisabled = false,
}) {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="step-navigation">
      <div className="step-navigation-row">
        <button
          type="button"
          className="step-nav-button step-nav-button--prev"
          onClick={onPrev}
          disabled={isFirstStep}
        >
          <span className="step-nav-icon">«</span>
          <span className="step-nav-text">前へ</span>
        </button>

        <button
          type="button"
          className="step-nav-button step-nav-button--next"
          onClick={onNext}
          disabled={isNextDisabled || isLastStep}
        >
          <span className="step-nav-text">次へ</span>
          <span className="step-nav-icon">»</span>
        </button>
      </div>

      {onPreview && (
        <div className="step-navigation-preview">
          <button
            type="button"
            className="preview-button"
            onClick={onPreview}
          >
            <span className="preview-icon">👁</span>
            <span className="preview-text">プレビュー</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default StepNavigation;

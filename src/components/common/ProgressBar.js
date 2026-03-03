import React from 'react';
import './ProgressBar.css';

/**
 * プログレスバーコンポーネント
 * 現在のステップの進捗を視覚的に表示
 */
function ProgressBar({ currentStep, totalSteps = 10 }) {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="progress-bar">
      <div
        className="progress-bar-fill"
        style={{ width: `${progressPercentage}%` }}
        role="progressbar"
        aria-valuenow={currentStep}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
      />
    </div>
  );
}

export default ProgressBar;

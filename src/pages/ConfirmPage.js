import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from '../context/FormContext';
import { downloadAsJson } from '../utils/fileHandler';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import StepIndicator from '../components/common/StepIndicator';
import ProgressBar from '../components/common/ProgressBar';
import StepNavigation from '../components/common/StepNavigation';
import './StepPage.css';
import './ConfirmPage.css';

/**
 * ステップ9 - 確認画面
 */
function ConfirmPage() {
  const navigate = useNavigate();
  const { getExportData, formData } = useFormContext();
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const handlePrev = () => {
    navigate('/step/7');
  };

  const handleNext = () => {
    navigate('/step/9');
  };

  const handlePreview = () => {
    navigate('/preview');
  };

  const handleBackToEdit = () => {
    navigate('/step/1');
  };

  const handleSaveData = () => {
    try {
      const exportData = getExportData();
      downloadAsJson(exportData);
      setSaveSuccess(true);
      setSaveError(null);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setSaveError('ファイルの保存に失敗しました');
      setSaveSuccess(false);
    }
  };

  // プロフィール情報の表示用
  const displayProfile = () => {
    const { profile } = formData;
    return `${profile.lastName} ${profile.firstName}`;
  };

  return (
    <div className="step-page">
      <StepIndicator currentStep={8} />
      <ProgressBar currentStep={8} />

      <div className="step-page-content">
        <h2 className="step-page-title">確認</h2>

        {saveSuccess && (
          <Alert
            type="success"
            message="ファイルを保存しました"
            onClose={() => setSaveSuccess(false)}
          />
        )}

        {saveError && (
          <Alert
            type="error"
            message={saveError}
            onClose={() => setSaveError(null)}
          />
        )}

        <div className="confirm-section">
          <p className="guide-text">
            入力内容を確認してください。
            プレビューボタンでPDFの出力イメージを確認できます。
          </p>

          {/* 入力内容サマリー */}
          <div className="confirm-summary">
            <div className="confirm-summary-item">
              <span className="confirm-summary-label">氏名</span>
              <span className="confirm-summary-value">{displayProfile() || '未入力'}</span>
            </div>
            <div className="confirm-summary-item">
              <span className="confirm-summary-label">スキル数</span>
              <span className="confirm-summary-value">{formData.skills.filter(s => s.name).length}件</span>
            </div>
            <div className="confirm-summary-item">
              <span className="confirm-summary-label">職務経歴数</span>
              <span className="confirm-summary-value">{formData.workHistories.filter(w => w.projectName).length}件</span>
            </div>
          </div>

          <div className="confirm-preview-area">
            <div className="confirm-preview-placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <line x1="10" y1="9" x2="8" y2="9" />
              </svg>
              <p>PDFプレビュー</p>
              <Button variant="primary" onClick={handlePreview}>
                プレビューを表示
              </Button>
            </div>
          </div>

          <div className="confirm-actions">
            <Button variant="secondary" onClick={handleBackToEdit}>
              入力画面に戻る
            </Button>
            <Button variant="secondary" onClick={handleSaveData}>
              データを保存
            </Button>
          </div>
        </div>
      </div>

      <StepNavigation
        currentStep={8}
        onPrev={handlePrev}
        onNext={handleNext}
        onPreview={handlePreview}
      />
    </div>
  );
}

export default ConfirmPage;

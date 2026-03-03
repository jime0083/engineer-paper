import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from '../context/FormContext';
import { downloadAsJson } from '../utils/fileHandler';
import { downloadPdf, generateFileName } from '../utils/pdfGenerator';
import SkillSheetTemplate from '../components/pdf/SkillSheetTemplate';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StepIndicator from '../components/common/StepIndicator';
import ProgressBar from '../components/common/ProgressBar';
import './StepPage.css';
import './CompletePage.css';

/**
 * ステップ9 - 完了画面
 */
function CompletePage() {
  const navigate = useNavigate();
  const { formData, getExportData } = useFormContext();
  const templateRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleDownloadPDF = async () => {
    if (!templateRef.current) return;

    setIsDownloading(true);
    setError(null);
    setSuccess(null);

    try {
      const fileName = generateFileName(formData);
      const result = await downloadPdf(templateRef.current, fileName);

      if (result.success) {
        setSuccess('PDFをダウンロードしました');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.error || 'PDFのダウンロードに失敗しました');
      }
    } catch (err) {
      setError('PDFの生成中にエラーが発生しました');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSaveData = () => {
    try {
      const exportData = getExportData();
      downloadAsJson(exportData);
      setSuccess('データを保存しました');
      setError(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('ファイルの保存に失敗しました');
      setSuccess(null);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="step-page">
      <StepIndicator currentStep={9} />
      <ProgressBar currentStep={9} />

      <div className="step-page-content">
        <h2 className="step-page-title">完了</h2>

        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} />
        )}

        {success && (
          <Alert type="success" message={success} onClose={() => setSuccess(null)} />
        )}

        <div className="complete-section">
          <div className="complete-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="16 8 10 16 7 13" />
            </svg>
          </div>
          <h3 className="complete-message">スキルシートの作成が完了しました</h3>
          <p className="complete-description">
            下のボタンからPDFをダウンロードするか、
            入力データをファイルに保存して次回利用することができます。
          </p>

          <div className="complete-actions">
            <Button
              variant="primary"
              size="large"
              onClick={handleDownloadPDF}
              disabled={isDownloading}
            >
              {isDownloading ? 'ダウンロード中...' : 'PDFでダウンロード'}
            </Button>
            <Button variant="secondary" size="large" onClick={handleSaveData}>
              入力情報をファイルで保存
            </Button>
          </div>

          <div className="affiliate-section">
            <h4 className="affiliate-title">おすすめサービス</h4>
            <div className="affiliate-links">
              <a
                href="#freelance"
                className="affiliate-link affiliate-link--freelance"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="affiliate-link-label">フリーランス向け</span>
                <span className="affiliate-link-text">案件を探す</span>
              </a>
              <a
                href="#career"
                className="affiliate-link affiliate-link--career"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="affiliate-link-label">転職希望の方</span>
                <span className="affiliate-link-text">転職サイトを見る</span>
              </a>
            </div>
          </div>

          <div className="complete-back">
            <Button variant="secondary" onClick={handleBackToHome}>
              トップページに戻る
            </Button>
          </div>
        </div>
      </div>

      {/* PDF生成用の非表示テンプレート */}
      <div className="pdf-template-hidden">
        <div ref={templateRef}>
          <SkillSheetTemplate formData={formData} />
        </div>
      </div>

      {/* ローディングオーバーレイ */}
      {isDownloading && (
        <div className="complete-loading-overlay">
          <LoadingSpinner size="large" text="PDFを生成中..." />
        </div>
      )}
    </div>
  );
}

export default CompletePage;

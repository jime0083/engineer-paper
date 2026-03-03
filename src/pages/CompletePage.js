import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import StepIndicator from '../components/common/StepIndicator';
import ProgressBar from '../components/common/ProgressBar';
import './StepPage.css';
import './CompletePage.css';

/**
 * ステップ10 - 完了画面
 */
function CompletePage() {
  const navigate = useNavigate();

  const handleDownloadPDF = () => {
    // TODO: PDF生成・ダウンロード処理
    alert('PDF生成機能は後のフェーズで実装されます');
  };

  const handleSaveData = () => {
    // TODO: JSON形式でデータ保存
    const data = {
      // FormContextからデータを取得
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const fileName = `skillsheet_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.json`;
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="step-page">
      <StepIndicator currentStep={10} />
      <ProgressBar currentStep={10} />

      <div className="step-page-content">
        <h2 className="step-page-title">完了</h2>

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
            <Button variant="primary" size="large" onClick={handleDownloadPDF}>
              PDFでダウンロード
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
    </div>
  );
}

export default CompletePage;

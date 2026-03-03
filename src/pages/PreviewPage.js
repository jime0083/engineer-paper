import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import './PreviewPage.css';

/**
 * プレビュー画面
 */
function PreviewPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    // 遷移元に戻る（履歴がなければ確認画面へ）
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/step/9');
    }
  };

  return (
    <div className="preview-page">
      <div className="preview-header">
        <h1 className="preview-title">PDFプレビュー</h1>
        <Button variant="secondary" onClick={handleBack}>
          入力画面に戻る
        </Button>
      </div>

      <div className="preview-content">
        <div className="preview-placeholder">
          <div className="preview-paper">
            <div className="preview-paper-header">
              <div className="preview-paper-title">スキルシート</div>
              <div className="preview-paper-date">作成日: 2026年3月3日</div>
            </div>

            <div className="preview-paper-section">
              <div className="preview-paper-section-title">基本情報</div>
              <div className="preview-paper-row">
                <span className="preview-paper-label">氏名:</span>
                <span className="preview-paper-value">（入力データが表示されます）</span>
              </div>
              <div className="preview-paper-row">
                <span className="preview-paper-label">生年月日:</span>
                <span className="preview-paper-value">（入力データが表示されます）</span>
              </div>
            </div>

            <div className="preview-paper-section">
              <div className="preview-paper-section-title">職務要約</div>
              <div className="preview-paper-text">
                （入力データが表示されます）
              </div>
            </div>

            <div className="preview-paper-section">
              <div className="preview-paper-section-title">スキル</div>
              <div className="preview-paper-text">
                （入力データが表示されます）
              </div>
            </div>

            <div className="preview-paper-section">
              <div className="preview-paper-section-title">職務経歴</div>
              <div className="preview-paper-text">
                （入力データが表示されます）
              </div>
            </div>

            <p className="preview-notice">
              ※ 実際のPDF生成機能はPhase 5で実装されます
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PreviewPage;

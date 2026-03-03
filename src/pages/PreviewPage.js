import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from '../context/FormContext';
import { downloadPdf, generateFileName } from '../utils/pdfGenerator';
import SkillSheetTemplate from '../components/pdf/SkillSheetTemplate';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './PreviewPage.css';

/**
 * プレビュー画面
 */
function PreviewPage() {
  const navigate = useNavigate();
  const { formData } = useFormContext();
  const templateRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/step/8');
    }
  };

  const handleDownload = async () => {
    if (!templateRef.current) return;

    setIsDownloading(true);
    setError(null);
    setSuccess(false);

    try {
      const fileName = generateFileName(formData);
      const result = await downloadPdf(templateRef.current, fileName);

      if (result.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(result.error || 'PDFのダウンロードに失敗しました');
      }
    } catch (err) {
      setError('PDFの生成中にエラーが発生しました');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="preview-page">
      <div className="preview-header">
        <h1 className="preview-title">PDFプレビュー</h1>
        <div className="preview-actions">
          <Button variant="primary" onClick={handleDownload} disabled={isDownloading}>
            {isDownloading ? 'ダウンロード中...' : 'PDFをダウンロード'}
          </Button>
          <Button variant="secondary" onClick={handleBack}>
            入力画面に戻る
          </Button>
        </div>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      {success && (
        <Alert type="success" message="PDFをダウンロードしました" onClose={() => setSuccess(false)} />
      )}

      {isDownloading && (
        <div className="preview-loading">
          <LoadingSpinner size="large" text="PDFを生成中..." />
        </div>
      )}

      <div className="preview-content">
        <div className="preview-scroll-area">
          <div className="preview-paper-wrapper">
            <div ref={templateRef}>
              <SkillSheetTemplate formData={formData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PreviewPage;

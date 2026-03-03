import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from '../context/FormContext';
import { readJsonFile, validateLoadedData, migrateData } from '../utils/fileHandler';
import Alert from '../components/common/Alert';
import './HomePage.css';

/**
 * トップページ
 * 4つのカード（新規作成・読み込み × スキルシート・契約書）を表示
 */
function HomePage() {
  const navigate = useNavigate();
  const { loadData, resetData } = useFormContext();
  const fileInputRef = useRef(null);
  const [error, setError] = useState(null);

  const handleCreateSkillSheet = () => {
    resetData();
    navigate('/step/1');
  };

  const handleLoadSkillSheet = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await readJsonFile(file);
      const validation = validateLoadedData(data);

      if (!validation.isValid) {
        setError(validation.errors.join('\n'));
        return;
      }

      if (validation.warnings?.length > 0) {
        // 警告があっても続行（古いバージョンのファイルなど）
      }

      const migratedData = migrateData(data);
      loadData(migratedData);
      navigate('/step/1');
    } catch (err) {
      setError(err.message || 'ファイルの読み込みに失敗しました');
    }

    event.target.value = '';
  };

  return (
    <div className="home-page">
      <div className="home-page-header">
        <h1 className="home-page-title">書類作成</h1>
        <p className="home-page-description">
          作成したい書類の種類を選択してください
        </p>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      <div className="home-page-cards">
        {/* スキルシート - 新規作成 */}
        <div className="home-card home-card--active" onClick={handleCreateSkillSheet}>
          <div className="home-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <line x1="9" y1="15" x2="15" y2="15" />
            </svg>
          </div>
          <h2 className="home-card-title">スキルシート</h2>
          <p className="home-card-subtitle">新規作成</p>
        </div>

        {/* スキルシート - 読み込み */}
        <div className="home-card home-card--active" onClick={handleLoadSkillSheet}>
          <div className="home-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <h2 className="home-card-title">スキルシート</h2>
          <p className="home-card-subtitle">ファイル読み込み</p>
        </div>

        {/* 契約書 - 新規作成（Coming Soon） */}
        <div className="home-card home-card--disabled">
          <div className="home-card-coming-soon">Coming Soon</div>
          <div className="home-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          <h2 className="home-card-title">契約書</h2>
          <p className="home-card-subtitle">新規作成</p>
        </div>

        {/* 契約書 - 読み込み（Coming Soon） */}
        <div className="home-card home-card--disabled">
          <div className="home-card-coming-soon">Coming Soon</div>
          <div className="home-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <h2 className="home-card-title">契約書</h2>
          <p className="home-card-subtitle">ファイル読み込み</p>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        style={{ display: 'none' }}
      />
    </div>
  );
}

export default HomePage;

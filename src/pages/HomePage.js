import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from '../context/FormContext';
import { readJsonFile, validateLoadedData, migrateData } from '../utils/fileHandler';
import Alert from '../components/common/Alert';
import KinematicText from '../components/common/KinematicText';
import GlitchImage from '../components/common/GlitchImage';
import MaskReveal from '../components/common/MaskReveal';
import ImagePlaceholder from '../components/common/ImagePlaceholder';
import CursorInteraction from '../components/common/CursorInteraction';
import ParticleReconstruction from '../components/common/ParticleReconstruction';
import ScrollTunnel from '../components/common/ScrollTunnel';
import './HomePage.css';

/**
 * トップページ（知的・クールなビジネスサービス基調）
 * - ファーストビュー：粒子再構成 × キネマティック文字 ＋ 書類作成ボタン（2列/横並び）
 * - スクロールトンネルで奥行きを演出
 */

const FEATURES = [
  {
    slotId: 'HOME-FEATURE-1',
    index: '01',
    title: '完全無料・登録不要',
    text: '会員登録もインストールも不要。ブラウザだけで、今すぐスキルシートの作成を始められます。',
    direction: 'left',
  },
  {
    slotId: 'HOME-FEATURE-2',
    index: '02',
    title: 'PDF / Word / Excel で出力',
    text: '作成した書類は3つの形式でダウンロード可能。提出先や用途に合わせて使い分けられます。',
    direction: 'right',
  },
  {
    slotId: 'HOME-FEATURE-3',
    index: '03',
    title: 'エンジニアに最適化した項目',
    text: 'スキル・職務経歴・経歴・自己PRなど、フリーランスエンジニアの実務に沿った項目設計。',
    direction: 'left',
  },
];

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
      <CursorInteraction />

      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      {/* ===== ヒーロー（ファーストビュー） ===== */}
      <section className="home-hero">
        <ParticleReconstruction
          className="home-hero-particles"
          inkColor="#aeb4ff"
          accentColor="#f07a98"
        />

        <ScrollTunnel className="home-hero-inner" strength={0.7}>
          <p className="home-hero-eyebrow">DOCUMENT BUILDER FOR FREELANCE ENGINEERS</p>
          <KinematicText as="h1" className="home-hero-title">
            スキルシートメーカー
          </KinematicText>
          <p className="home-hero-lead">
            フリーランスエンジニアのためのスキルシート・契約書（近日追加）を、
            無料で、正確に。PDF / Word / Excel でそのまま提出できます。
          </p>

          {/* 書類作成：スキルシート／契約書 の2列。各グループ内で新規作成・読込を横並び */}
          <div className="home-doc-groups">
            <div className="home-doc-group">
              <div className="home-doc-group-head">
                <span className="home-doc-group-label">01</span>
                <h2 className="home-doc-group-title">スキルシート</h2>
              </div>
              <div className="home-doc-actions">
                <button
                  type="button"
                  className="home-doc-btn home-doc-btn--primary"
                  data-cursor="hover"
                  onClick={handleCreateSkillSheet}
                >
                  新規作成
                </button>
                <button
                  type="button"
                  className="home-doc-btn"
                  data-cursor="hover"
                  onClick={handleLoadSkillSheet}
                >
                  ファイル読み込み
                </button>
              </div>
            </div>

            <div className="home-doc-group home-doc-group--disabled">
              <span className="home-doc-group-badge">Coming Soon</span>
              <div className="home-doc-group-head">
                <span className="home-doc-group-label">02</span>
                <h2 className="home-doc-group-title">契約書</h2>
              </div>
              <div className="home-doc-actions">
                <button type="button" className="home-doc-btn" disabled>
                  新規作成
                </button>
                <button type="button" className="home-doc-btn" disabled>
                  ファイル読み込み
                </button>
              </div>
            </div>
          </div>

          <div className="home-hero-scrollcue" aria-hidden="true">
            <span className="home-hero-scrollcue-label">SCROLL</span>
            <span className="home-hero-scrollcue-line" />
          </div>
        </ScrollTunnel>
      </section>

      {/* ===== 特徴（スクロールトンネル × 大画像） ===== */}
      <section className="home-features">
        <MaskReveal direction="up">
          <p className="home-section-eyebrow">WHY SKILL SHEET MAKER</p>
          <KinematicText as="h2" className="home-section-title">
            選ばれる理由
          </KinematicText>
        </MaskReveal>

        {FEATURES.map((feature) => (
          <ScrollTunnel key={feature.slotId} strength={0.6}>
            <MaskReveal direction={feature.direction} className="home-feature">
              <div className="home-feature-visual">
                <GlitchImage intensity="subtle">
                  <ImagePlaceholder
                    slotId={feature.slotId}
                    label={feature.title}
                    ratio="4 / 3"
                  />
                </GlitchImage>
              </div>
              <div className="home-feature-body">
                <span className="home-feature-index">{feature.index}</span>
                <h3 className="home-feature-title">{feature.title}</h3>
                <p className="home-feature-text">{feature.text}</p>
              </div>
            </MaskReveal>
          </ScrollTunnel>
        ))}
      </section>

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

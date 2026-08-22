import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from '../context/FormContext';
import { readJsonFile, validateLoadedData, migrateData } from '../utils/fileHandler';
import Alert from '../components/common/Alert';
import ImagePlaceholder from '../components/common/ImagePlaceholder';
import Reveal from '../components/common/Reveal';
import './HomePage.css';

/**
 * トップページ（ミニマル×テック）
 * - スクロールで各要素がフェード＋スライドで登場（Reveal）
 * - ファーストビューは背景画像（HOME-HERO）＋白オーバーレイの上に左寄せテキストを重ねる
 * - 画像はすべて ImagePlaceholder で配置位置を明示（内容は 必要画像.txt 参照）
 * - 訴求ポイント3点：
 *   ①ボタン1つで PDF / Word / Excel 全形式保存（フォーマット違いによる作り直しを解消）
 *   ②無料・転職の営業なし
 *   ③職務経歴の並び替えがクリック1つ・編集が簡単
 */

const FEATURES = [
  {
    slotId: 'HOME-FEATURE-FORMAT',
    image: '/images/セクション1.jpeg',
    title: '全形式で保存、作り直しはもう不要',
    text:
      'エンジニアごとにスキルシートのフォーマットは違い 会社や営業が変わるたびに新しく作らされるのは面倒です。\n' +
      'ここで一度作成すれば ボタン1つで PDF・Word・Excel すべての形式で保存でき どの提出先にもそのまま対応できます。',
  },
  {
    slotId: 'HOME-FEATURE-FREE',
    image: '/images/セクション2.jpeg',
    title: 'エージェントからの営業無し、もちろん無料',
    text:
      '会員登録は不要 すべての機能を無料で使えます。' +
      '他のスキルシート作成サービスにありがちな 転職をすすめる営業連絡も一切ありません。',
  },
  {
    slotId: 'HOME-FEATURE-EDIT',
    image: '/images/セクション3.png',
    title: '並び替えはクリック1つ、編集が簡単',
    text:
      '職務経歴の並び替えはクリック1つで完了。' +
      '項目の追加や修正もフォームに沿って入力するだけで 常に最新のスキルシートを保てます。',
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
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      {/* ===== ヒーロー（ファーストビュー：背景画像＋白オーバーレイ） ===== */}
      <section
        className="home-hero"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/images/ファーストビュー.jpeg)`,
        }}
      >
        <div className="home-hero-overlay" aria-hidden="true" />

        <div className="home-hero-inner">
          <div className="home-hero-copy">
            <Reveal as="p" className="home-eyebrow" delay={0}>
              {'// SKILL SHEET MAKER — FOR ENGINEERS'}
            </Reveal>
            <Reveal as="h1" className="home-hero-title" delay={100}>
              スキルシートの
              <br />
              面倒くさいから解放
            </Reveal>
            <Reveal as="p" className="home-hero-lead" delay={200}>
              一度作れば ボタン1つで PDF・Word・Excel すべての形式で保存。
              <br />
              会社や営業ごとに違うフォーマットに合わせて作り直す手間をなくします。
              無料・登録不要 転職の営業もありません。
            </Reveal>

            <Reveal className="home-hero-actions" delay={300}>
              <button
                type="button"
                className="home-btn home-btn--primary"
                onClick={handleCreateSkillSheet}
              >
                無料でスキルシートを作成
              </button>
              <button
                type="button"
                className="home-btn home-btn--ghost"
                onClick={handleLoadSkillSheet}
              >
                ファイル読み込み
              </button>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== 作成できる書類 ===== */}
      <section className="home-docs">
        <div className="home-section-inner">
          <Reveal as="p" className="home-eyebrow">{'// DOCUMENTS'}</Reveal>
          <Reveal as="h2" className="home-section-title" delay={80}>
            作成できる書類
          </Reveal>

          <div className="home-doc-list">
            <Reveal className="home-doc-row">
              <div className="home-doc-info">
                <h3 className="home-doc-title">スキルシート</h3>
                <p className="home-doc-text">
                  スキル・職務経歴・経歴・自己PRなど エンジニアの実務に沿った項目で作成できます。
                </p>
              </div>
              <div className="home-doc-actions">
                <button
                  type="button"
                  className="home-btn home-btn--primary home-btn--sm"
                  onClick={handleCreateSkillSheet}
                >
                  新規作成
                </button>
                <button
                  type="button"
                  className="home-btn home-btn--ghost home-btn--sm"
                  onClick={handleLoadSkillSheet}
                >
                  ファイル読み込み
                </button>
              </div>
            </Reveal>

            <Reveal className="home-doc-row home-doc-row--disabled" delay={100}>
              <div className="home-doc-info">
                <h3 className="home-doc-title">契約書</h3>
                <p className="home-doc-text">
                  業務委託契約書などのテンプレートを準備中です。
                </p>
              </div>
              <div className="home-doc-actions">
                <span className="home-doc-badge">Coming Soon</span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== 選ばれる理由（訴求ポイント3点） ===== */}
      <section className="home-features">
        <div className="home-section-inner">
          <Reveal as="p" className="home-eyebrow">{'// FEATURES'}</Reveal>
          <Reveal as="h2" className="home-section-title" delay={80}>
            スキルシートメーカーが選ばれる理由
          </Reveal>

          {FEATURES.map((feature, i) => (
            <div
              key={feature.slotId}
              className={`home-feature ${i % 2 === 1 ? 'home-feature--reverse' : ''}`}
            >
              <Reveal className="home-feature-body">
                <h3 className="home-feature-title">{feature.title}</h3>
                <p className="home-feature-text">{feature.text}</p>
              </Reveal>
              <Reveal className="home-feature-visual" delay={120}>
                <ImagePlaceholder
                  slotId={feature.slotId}
                  label={feature.title}
                  ratio="4 / 3"
                  src={`${process.env.PUBLIC_URL}${feature.image}`}
                  alt={feature.title}
                />
              </Reveal>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 下部CTA ===== */}
      <section className="home-cta">
        <div className="home-section-inner home-cta-inner">
          <Reveal as="p" className="home-eyebrow">{'// GET STARTED'}</Reveal>
          <Reveal className="home-cta-row" delay={80}>
            <h2 className="home-cta-title">
              次にスキルシートを求められたら作るのは最後の1枚に。
            </h2>
            <div className="home-hero-actions home-cta-actions">
              <button
                type="button"
                className="home-btn home-btn--primary"
                onClick={handleCreateSkillSheet}
              >
                無料でスキルシートを作成
              </button>
              <button
                type="button"
                className="home-btn home-btn--ghost"
                onClick={handleLoadSkillSheet}
              >
                ファイル読み込み
              </button>
            </div>
          </Reveal>
        </div>
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

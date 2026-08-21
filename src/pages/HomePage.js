import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from '../context/FormContext';
import { readJsonFile, validateLoadedData, migrateData } from '../utils/fileHandler';
import Alert from '../components/common/Alert';
import ImagePlaceholder from '../components/common/ImagePlaceholder';
import './HomePage.css';

/**
 * トップページ（ミニマル×テック）
 * - 演出（グリッチ/粒子/カーソル追従）は使用しない
 * - 画像はすべて ImagePlaceholder で配置位置を明示（内容は 必要画像.txt 参照）
 * - 訴求ポイント3点：
 *   ①ボタン1つで PDF / Word / Excel 全形式保存（フォーマット違いによる作り直しを解消）
 *   ②無料・転職の営業なし
 *   ③職務経歴の並び替えがクリック1つ・編集が簡単
 */

const FEATURES = [
  {
    slotId: 'HOME-FEATURE-FORMAT',
    index: '01',
    title: '全形式で保存。作り直しはもう不要',
    text:
      'エンジニアごとにスキルシートのフォーマットは違い、会社や営業が変わるたびに新しく作らされるのは面倒です。' +
      'ここで一度作成すれば、ボタン1つで PDF・Word・Excel すべての形式で保存でき、どの提出先にもそのまま対応できます。',
    tags: ['.pdf', '.docx', '.xlsx'],
  },
  {
    slotId: 'HOME-FEATURE-FREE',
    index: '02',
    title: '無料で使える。転職の営業もない',
    text:
      '会員登録は不要、すべての機能を無料で使えます。' +
      '他のスキルシート作成サービスにありがちな、転職をすすめる営業連絡も一切ありません。',
    tags: ['free', 'no-signup', 'no-sales'],
  },
  {
    slotId: 'HOME-FEATURE-EDIT',
    index: '03',
    title: '並び替えはクリック1つ。編集がかんたん',
    text:
      '職務経歴の並び替えはクリック1つで完了。' +
      '項目の追加や修正もフォームに沿って入力するだけで、常に最新のスキルシートを保てます。',
    tags: ['sort', 'edit'],
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

      {/* ===== ヒーロー（ファーストビュー） ===== */}
      <section className="home-hero">
        <div className="home-hero-inner">
          <div className="home-hero-copy">
            <p className="home-eyebrow">{'// SKILL SHEET MAKER — FOR ENGINEERS'}</p>
            <h1 className="home-hero-title">
              スキルシート、
              <br />
              もう作り直さない。
            </h1>
            <p className="home-hero-lead">
              一度作れば、ボタン1つで PDF・Word・Excel すべての形式で保存。
              会社や営業ごとに違うフォーマットに合わせて作り直す手間をなくします。
              無料・登録不要、転職の営業もありません。
            </p>

            <div className="home-hero-formats" aria-label="対応出力形式">
              <span className="home-format-chip">.pdf</span>
              <span className="home-format-chip">.docx</span>
              <span className="home-format-chip">.xlsx</span>
            </div>

            <div className="home-hero-actions">
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

            <ul className="home-hero-notes">
              <li>登録不要</li>
              <li>完全無料</li>
              <li>転職営業なし</li>
            </ul>
          </div>

          <div className="home-hero-visual">
            <ImagePlaceholder
              slotId="HOME-HERO"
              label="アプリ画面イメージ（完成スキルシート＋3形式出力）"
              ratio="4 / 3"
            />
          </div>
        </div>
      </section>

      {/* ===== 作成できる書類 ===== */}
      <section className="home-docs">
        <div className="home-section-inner">
          <p className="home-eyebrow">{'// DOCUMENTS'}</p>
          <h2 className="home-section-title">作成できる書類</h2>

          <div className="home-doc-list">
            <div className="home-doc-row">
              <span className="home-doc-index">01</span>
              <div className="home-doc-info">
                <h3 className="home-doc-title">スキルシート</h3>
                <p className="home-doc-text">
                  スキル・職務経歴・経歴・自己PRなど、エンジニアの実務に沿った項目で作成できます。
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
            </div>

            <div className="home-doc-row home-doc-row--disabled">
              <span className="home-doc-index">02</span>
              <div className="home-doc-info">
                <h3 className="home-doc-title">契約書</h3>
                <p className="home-doc-text">
                  業務委託契約書などのテンプレートを準備中です。
                </p>
              </div>
              <div className="home-doc-actions">
                <span className="home-doc-badge">Coming Soon</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 選ばれる理由（訴求ポイント3点） ===== */}
      <section className="home-features">
        <div className="home-section-inner">
          <p className="home-eyebrow">{'// FEATURES'}</p>
          <h2 className="home-section-title">選ばれる理由</h2>

          {FEATURES.map((feature, i) => (
            <div
              key={feature.slotId}
              className={`home-feature ${i % 2 === 1 ? 'home-feature--reverse' : ''}`}
            >
              <div className="home-feature-body">
                <span className="home-feature-index">{feature.index}</span>
                <h3 className="home-feature-title">{feature.title}</h3>
                <p className="home-feature-text">{feature.text}</p>
                <div className="home-feature-tags">
                  {feature.tags.map((tag) => (
                    <span key={tag} className="home-format-chip">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="home-feature-visual">
                <ImagePlaceholder
                  slotId={feature.slotId}
                  label={feature.title}
                  ratio="4 / 3"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 下部CTA ===== */}
      <section className="home-cta">
        <div className="home-section-inner home-cta-inner">
          <p className="home-eyebrow">{'// GET STARTED'}</p>
          <h2 className="home-cta-title">
            次にスキルシートを求められたら、
            <br />
            作るのは最後の1枚に。
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

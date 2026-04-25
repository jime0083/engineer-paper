import React from 'react';
import './SkillSheetGuide.css';

/**
 * スキルシートの書き方ガイドコンポーネント
 * 全ページの下部に常時表示される有用なコンテンツ
 */
function SkillSheetGuide() {
  return (
    <section className="skill-sheet-guide">
      <div className="skill-sheet-guide-container">
        <h2 className="skill-sheet-guide-title">スキルシートの書き方</h2>

        <div className="skill-sheet-guide-content">
          <div className="guide-section">
            <h3 className="guide-section-title">スキルシートとは？</h3>
            <p className="guide-section-text">
              スキルシートは、ITエンジニアが自身の技術スキルや職務経歴をまとめた書類です。
              転職活動や案件参画時に、あなたの技術力や経験を採用担当者やクライアントに伝えるための重要な資料となります。
              履歴書や職務経歴書とは異なり、より技術的な詳細に焦点を当てた内容が求められます。
            </p>
          </div>

          <div className="guide-section">
            <h3 className="guide-section-title">書き方のコツ</h3>
            <div className="guide-tips">
              <div className="guide-tip">
                <div className="guide-tip-number">1</div>
                <div className="guide-tip-content">
                  <h4 className="guide-tip-title">具体的な数値を入れる</h4>
                  <p className="guide-tip-text">
                    「Webアプリケーション開発」ではなく「月間10万PVのECサイト開発」のように、
                    規模や成果を数値で表現しましょう。数値があると説得力が増します。
                  </p>
                </div>
              </div>

              <div className="guide-tip">
                <div className="guide-tip-number">2</div>
                <div className="guide-tip-content">
                  <h4 className="guide-tip-title">担当した役割を明確に</h4>
                  <p className="guide-tip-text">
                    チーム開発の場合、自分が何を担当したのかを明確に記載します。
                    「設計から実装まで担当」「バックエンドAPIの実装を担当」など、
                    具体的な役割を書くことで、あなたのスキルレベルが伝わります。
                  </p>
                </div>
              </div>

              <div className="guide-tip">
                <div className="guide-tip-number">3</div>
                <div className="guide-tip-content">
                  <h4 className="guide-tip-title">最新のスキルを上位に</h4>
                  <p className="guide-tip-text">
                    スキル一覧では、現在メインで使用している技術や、
                    これから伸ばしていきたいスキルを上位に配置しましょう。
                    採用担当者は上から順に見ることが多いです。
                  </p>
                </div>
              </div>

              <div className="guide-tip">
                <div className="guide-tip-number">4</div>
                <div className="guide-tip-content">
                  <h4 className="guide-tip-title">経験年数は正確に</h4>
                  <p className="guide-tip-text">
                    各技術の経験年数は正確に記載しましょう。
                    実務経験と学習経験は分けて考え、実務で使用した期間を基準にすると良いでしょう。
                    誇張は面接で困ることになります。
                  </p>
                </div>
              </div>

              <div className="guide-tip">
                <div className="guide-tip-number">5</div>
                <div className="guide-tip-content">
                  <h4 className="guide-tip-title">自己PRは具体的に</h4>
                  <p className="guide-tip-text">
                    「コミュニケーション能力が高い」などの抽象的な表現ではなく、
                    「週1回のチームMTGでファシリテーターを担当」のように、
                    具体的なエピソードを交えて書くと印象に残ります。
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="guide-section">
            <h3 className="guide-section-title">よくある質問</h3>
            <div className="guide-faq">
              <div className="guide-faq-item">
                <h4 className="guide-faq-question">Q. どのくらいの分量が適切ですか？</h4>
                <p className="guide-faq-answer">
                  A. 一般的にはA4用紙2〜3枚程度が目安です。
                  経験が浅い場合は1〜2枚、ベテランエンジニアでも3〜4枚に収めるのが読みやすいとされています。
                </p>
              </div>

              <div className="guide-faq-item">
                <h4 className="guide-faq-question">Q. 古いプロジェクトも書くべきですか？</h4>
                <p className="guide-faq-answer">
                  A. 直近5年程度の経験を中心に記載するのがおすすめです。
                  それ以前の経験は、特に重要なものや現在のスキルに関連するもののみ簡潔に記載しましょう。
                </p>
              </div>

              <div className="guide-faq-item">
                <h4 className="guide-faq-question">Q. 資格は必ず書くべきですか？</h4>
                <p className="guide-faq-answer">
                  A. IT関連の資格（基本情報技術者、AWS認定など）は積極的に記載しましょう。
                  応募する職種に関連する資格があれば、スキルの証明として有効です。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SkillSheetGuide;

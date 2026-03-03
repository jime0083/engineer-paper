import React from 'react';
import { Link } from 'react-router-dom';
import './LegalPage.css';

/**
 * 利用規約ページ
 */
function TermsPage() {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1 className="legal-title">利用規約</h1>
        <p className="legal-updated">最終更新日: 2026年3月3日</p>

        <div className="legal-content">
          <section className="legal-section">
            <h2>第1条（適用）</h2>
            <p>
              本利用規約（以下「本規約」）は、スキルシートメーカー（以下「本サービス」）の利用条件を定めるものです。
              ユーザーの皆様には、本規約に同意いただいた上で、本サービスをご利用いただきます。
            </p>
          </section>

          <section className="legal-section">
            <h2>第2条（定義）</h2>
            <p>本規約において使用する用語の定義は、以下の通りとします。</p>
            <ol>
              <li>「本サービス」とは、当サイトが提供するスキルシート作成サービスを指します。</li>
              <li>「ユーザー」とは、本サービスを利用する全ての方を指します。</li>
              <li>「コンテンツ」とは、本サービスを通じてユーザーが作成・入力するデータ、テキスト、画像等を指します。</li>
            </ol>
          </section>

          <section className="legal-section">
            <h2>第3条（サービス内容）</h2>
            <p>本サービスは、以下の機能を提供します。</p>
            <ol>
              <li>スキルシートの作成・編集機能</li>
              <li>PDFファイルとしての出力機能</li>
              <li>入力データのファイル保存・読み込み機能</li>
            </ol>
          </section>

          <section className="legal-section">
            <h2>第4条（禁止事項）</h2>
            <p>ユーザーは、本サービスの利用にあたり、以下の行為を行ってはなりません。</p>
            <ol>
              <li>法令または公序良俗に違反する行為</li>
              <li>犯罪行為に関連する行為</li>
              <li>本サービスの運営を妨害する行為</li>
              <li>他のユーザーに迷惑をかける行為</li>
              <li>虚偽の情報を入力する行為</li>
              <li>本サービスを不正な目的で利用する行為</li>
              <li>その他、運営者が不適切と判断する行為</li>
            </ol>
          </section>

          <section className="legal-section">
            <h2>第5条（知的財産権）</h2>
            <p>
              本サービスに関する著作権、商標権その他の知的財産権は、運営者または正当な権利者に帰属します。
              ユーザーが本サービスを通じて作成したコンテンツの著作権は、ユーザー自身に帰属します。
            </p>
          </section>

          <section className="legal-section">
            <h2>第6条（データの取り扱い）</h2>
            <ol>
              <li>
                本サービスで入力されたデータは、ユーザーのブラウザ上でのみ処理され、
                サーバーへの送信・保存は行われません。
              </li>
              <li>
                ユーザーが保存したファイルの管理は、ユーザー自身の責任において行うものとします。
              </li>
              <li>
                本サービスは、入力データのバックアップ機能を提供しておりません。
                重要なデータは、ユーザー自身でバックアップを取ることを推奨します。
              </li>
            </ol>
          </section>

          <section className="legal-section">
            <h2>第7条（免責事項）</h2>
            <ol>
              <li>
                本サービスは「現状有姿」で提供されます。運営者は、本サービスの完全性、
                正確性、確実性、有用性等について、いかなる保証も行いません。
              </li>
              <li>
                本サービスの利用により生じた損害について、運営者は一切の責任を負いません。
              </li>
              <li>
                本サービスで作成したスキルシートの内容に関する責任は、ユーザー自身が負うものとします。
              </li>
              <li>
                運営者は、本サービスの提供の中断、停止、終了、利用不能または変更について、
                ユーザーに対して責任を負いません。
              </li>
            </ol>
          </section>

          <section className="legal-section">
            <h2>第8条（広告の表示）</h2>
            <p>
              本サービスには、第三者が提供する広告が表示される場合があります。
              広告の内容については、広告主が責任を負うものとし、運営者は広告内容について
              いかなる保証も行いません。
            </p>
          </section>

          <section className="legal-section">
            <h2>第9条（サービスの変更・終了）</h2>
            <p>
              運営者は、ユーザーへの事前通知なく、本サービスの内容を変更、
              または本サービスの提供を終了することができます。
            </p>
          </section>

          <section className="legal-section">
            <h2>第10条（利用規約の変更）</h2>
            <p>
              運営者は、必要と判断した場合には、ユーザーに通知することなく、
              いつでも本規約を変更することができます。
              変更後の利用規約は、本サービス上に表示した時点から効力を生じるものとします。
            </p>
          </section>

          <section className="legal-section">
            <h2>第11条（準拠法・裁判管轄）</h2>
            <p>
              本規約の解釈にあたっては、日本法を準拠法とします。
              本サービスに関して紛争が生じた場合には、運営者の所在地を管轄する裁判所を
              専属的合意管轄とします。
            </p>
          </section>
        </div>

        <div className="legal-back">
          <Link to="/" className="legal-back-link">
            トップページに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TermsPage;

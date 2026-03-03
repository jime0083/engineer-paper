import React from 'react';
import { Link } from 'react-router-dom';
import './LegalPage.css';

/**
 * プライバシーポリシーページ
 */
function PrivacyPage() {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1 className="legal-title">プライバシーポリシー</h1>
        <p className="legal-updated">最終更新日: 2026年3月3日</p>

        <div className="legal-content">
          <section className="legal-section">
            <h2>はじめに</h2>
            <p>
              スキルシートメーカー（以下「本サービス」）は、ユーザーのプライバシーを尊重し、
              個人情報の保護に努めます。本プライバシーポリシーは、本サービスにおける
              情報の取り扱いについて説明します。
            </p>
          </section>

          <section className="legal-section">
            <h2>1. 収集する情報</h2>
            <h3>1.1 ユーザーが入力する情報</h3>
            <p>
              本サービスでは、スキルシート作成のために以下の情報の入力を求めることがあります。
            </p>
            <ul>
              <li>氏名、ふりがな</li>
              <li>生年月日、性別</li>
              <li>住所、最寄駅</li>
              <li>連絡先（電話番号、メールアドレス）</li>
              <li>資格、スキル情報</li>
              <li>職務経歴</li>
              <li>自己PR</li>
            </ul>
            <p className="legal-important">
              <strong>重要:</strong> これらの情報はユーザーのブラウザ上でのみ処理され、
              当サービスのサーバーには送信・保存されません。
            </p>

            <h3>1.2 自動的に収集される情報</h3>
            <p>本サービスでは、以下の情報が自動的に収集される場合があります。</p>
            <ul>
              <li>IPアドレス</li>
              <li>ブラウザの種類</li>
              <li>アクセス日時</li>
              <li>参照元URL</li>
              <li>閲覧ページ</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>2. 情報の利用目的</h2>
            <p>収集した情報は、以下の目的で利用します。</p>
            <ol>
              <li>本サービスの提供・運営</li>
              <li>サービスの改善・新機能の開発</li>
              <li>利用状況の分析</li>
              <li>広告の配信・効果測定</li>
            </ol>
          </section>

          <section className="legal-section">
            <h2>3. Cookieの使用</h2>
            <p>
              本サービスでは、ユーザー体験の向上および広告配信のためにCookieを使用しています。
              Cookieとは、ウェブサイトがユーザーのブラウザに保存する小さなテキストファイルです。
            </p>
            <h3>3.1 使用するCookieの種類</h3>
            <ul>
              <li>
                <strong>必須Cookie:</strong> サービスの基本機能に必要なCookie
              </li>
              <li>
                <strong>分析Cookie:</strong> サービスの利用状況を分析するためのCookie
              </li>
              <li>
                <strong>広告Cookie:</strong> 関連性の高い広告を表示するためのCookie
              </li>
            </ul>
            <h3>3.2 Cookieの管理</h3>
            <p>
              ユーザーは、ブラウザの設定によりCookieを無効にすることができます。
              ただし、Cookieを無効にした場合、本サービスの一部機能が正常に動作しない
              可能性があります。
            </p>
          </section>

          <section className="legal-section">
            <h2>4. 第三者サービスの利用</h2>
            <h3>4.1 Google Analytics</h3>
            <p>
              本サービスでは、アクセス解析のためにGoogle Analyticsを使用しています。
              Google Analyticsは、Cookieを使用してユーザーの本サービス利用状況を収集します。
              収集されたデータはGoogleのプライバシーポリシーに基づいて管理されます。
            </p>
            <p>
              詳細は
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="legal-link"
              >
                Googleのプライバシーポリシー
              </a>
              をご確認ください。
            </p>

            <h3>4.2 Google AdSense</h3>
            <p>
              本サービスでは、広告配信のためにGoogle AdSenseを使用しています。
              Google AdSenseは、Cookieを使用してユーザーの興味に基づいた広告を表示します。
            </p>
            <p>
              広告のパーソナライズを無効にするには、
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="legal-link"
              >
                Googleの広告設定
              </a>
              をご確認ください。
            </p>
          </section>

          <section className="legal-section">
            <h2>5. 情報の第三者提供</h2>
            <p>
              本サービスは、以下の場合を除き、ユーザーの個人情報を第三者に提供することはありません。
            </p>
            <ol>
              <li>ユーザーの同意がある場合</li>
              <li>法令に基づく場合</li>
              <li>人の生命、身体または財産の保護のために必要な場合</li>
              <li>本サービスの運営に必要な範囲で業務委託先に提供する場合</li>
            </ol>
          </section>

          <section className="legal-section">
            <h2>6. データの保存</h2>
            <p>
              本サービスで入力されたスキルシートのデータは、ユーザーのブラウザ上でのみ
              処理されます。ユーザーが「ファイルで保存」機能を使用した場合、
              データはユーザーのデバイスにローカルファイルとして保存されます。
            </p>
            <p>
              本サービスのサーバーには、スキルシートのデータは保存されません。
            </p>
          </section>

          <section className="legal-section">
            <h2>7. セキュリティ</h2>
            <p>
              本サービスは、ユーザーの情報を保護するために、適切なセキュリティ対策を
              講じています。ただし、インターネット上の通信は完全に安全であることを
              保証するものではありません。
            </p>
          </section>

          <section className="legal-section">
            <h2>8. 未成年者の利用</h2>
            <p>
              本サービスは、未成年者の個人情報を意図的に収集することはありません。
              未成年者が本サービスを利用する場合は、保護者の同意を得た上で
              ご利用ください。
            </p>
          </section>

          <section className="legal-section">
            <h2>9. プライバシーポリシーの変更</h2>
            <p>
              本プライバシーポリシーは、必要に応じて変更されることがあります。
              重要な変更がある場合は、本サービス上でお知らせします。
              変更後のプライバシーポリシーは、本サービス上に掲載した時点から
              効力を生じるものとします。
            </p>
          </section>

          <section className="legal-section">
            <h2>10. お問い合わせ</h2>
            <p>
              本プライバシーポリシーに関するお問い合わせは、本サービスの
              お問い合わせフォームよりご連絡ください。
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

export default PrivacyPage;

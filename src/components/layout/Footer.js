import React from 'react';
import './Footer.css';

/**
 * フッターコンポーネント
 * 利用規約・プライバシーポリシーへのリンクを表示
 */
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <nav className="footer-nav">
          <a
            href="/terms"
            className="footer-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            利用規約
          </a>
          <span className="footer-separator">|</span>
          <a
            href="/privacy"
            className="footer-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            プライバシーポリシー
          </a>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;

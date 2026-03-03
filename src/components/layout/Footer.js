import React from 'react';
import { Link } from 'react-router-dom';
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
          <Link to="/terms" className="footer-link">
            利用規約
          </Link>
          <span className="footer-separator">|</span>
          <Link to="/privacy" className="footer-link">
            プライバシーポリシー
          </Link>
        </nav>
        <p className="footer-copyright">
          &copy; 2026 スキルシートメーカー
        </p>
      </div>
    </footer>
  );
}

export default Footer;

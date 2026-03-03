import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

/**
 * ヘッダーコンポーネント
 * アプリ名/ロゴを表示する
 */
function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <img
            src={`${process.env.PUBLIC_URL}/logo.png`}
            alt="スキルシートメーカー"
            className="header-logo-image"
          />
          <span className="header-logo-text">スキルシートメーカー</span>
        </Link>
      </div>
    </header>
  );
}

export default Header;

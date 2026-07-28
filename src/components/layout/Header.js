import React from 'react';
import { Link } from 'react-router-dom';
import GlitchText from '../common/GlitchText';
import './Header.css';

/**
 * ヘッダーコンポーネント
 * アプリ名/ロゴを表示する
 */
function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo" data-cursor="hover">
          <img
            src={`${process.env.PUBLIC_URL}/logo.png`}
            alt="スキルシートメーカー"
            className="header-logo-image"
          />
          <GlitchText as="span" className="header-logo-text">
            スキルシートメーカー
          </GlitchText>
        </Link>
      </div>
    </header>
  );
}

export default Header;

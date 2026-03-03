import React from 'react';
import './Header.css';

/**
 * ヘッダーコンポーネント
 * アプリ名/ロゴを表示する
 */
function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <h1 className="header-logo">
          {/* アプリ名は後から設定 */}
          スキルシート作成
        </h1>
      </div>
    </header>
  );
}

export default Header;

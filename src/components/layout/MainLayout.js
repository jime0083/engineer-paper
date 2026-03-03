import React from 'react';
import Header from './Header';
import Footer from './Footer';
import AdPlaceholder from './AdPlaceholder';
import useBeforeUnload from '../../hooks/useBeforeUnload';
import './MainLayout.css';

/**
 * メインレイアウトコンポーネント
 * ヘッダー、フッター、広告エリアを含む全体レイアウト
 */
function MainLayout({ children }) {
  // 入力データがある場合にページ離脱時にアラートを表示
  useBeforeUnload();

  return (
    <div className="main-layout">
      <Header />
      <div className="main-body">
        <AdPlaceholder position="left" />
        <main className="main-content">{children}</main>
        <AdPlaceholder position="right" />
      </div>
      <AdPlaceholder position="bottom" />
      <Footer />
    </div>
  );
}

export default MainLayout;

import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import AdPlaceholder from './AdPlaceholder';
import SkillSheetGuide from '../common/SkillSheetGuide';
import useBeforeUnload from '../../hooks/useBeforeUnload';
import './MainLayout.css';

/**
 * メインレイアウトコンポーネント
 * ヘッダー、フッター、広告エリアを含む全体レイアウト
 */
function MainLayout({ children }) {
  // 入力データがある場合にページ離脱時にアラートを表示
  useBeforeUnload();

  const location = useLocation();
  const isHome = location.pathname === '/';

  // 書き方ガイドは入力ステップ（step/1〜8）の下部にのみ表示する
  // （確認/完了/プレビュー/規約/プライバシー/トップでは非表示）
  const isGuideVisible = /^\/step\/[1-8]$/.test(location.pathname);

  return (
    <div className="main-layout">
      {/* ヘッダーはトップページのみ表示（Phase 14 仕様） */}
      {isHome && <Header />}
      <div className={`main-body ${isHome ? 'main-body--home' : ''}`}>
        {/* トップページは左右広告なしで幅いっぱいに表示する */}
        {!isHome && <AdPlaceholder position="left" />}
        <main className={`main-content ${isHome ? 'main-content--home' : ''}`}>
          {children}
        </main>
        {!isHome && <AdPlaceholder position="right" />}
      </div>
      {isGuideVisible && <SkillSheetGuide />}
      <AdPlaceholder position="bottom" />
      <Footer />
    </div>
  );
}

export default MainLayout;

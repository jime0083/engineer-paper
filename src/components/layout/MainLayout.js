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

  // トップページ（/）では書き方ガイドを表示しない
  // ※ 全ステップページ下部への正式な再配置は Phase 13.3 で実施
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="main-layout">
      <Header />
      <div className={`main-body ${isHome ? 'main-body--home' : ''}`}>
        {/* トップページは左右広告なしで幅いっぱいに表示する */}
        {!isHome && <AdPlaceholder position="left" />}
        <main className={`main-content ${isHome ? 'main-content--home' : ''}`}>
          {children}
        </main>
        {!isHome && <AdPlaceholder position="right" />}
      </div>
      {!isHome && <SkillSheetGuide />}
      <AdPlaceholder position="bottom" />
      <Footer />
    </div>
  );
}

export default MainLayout;

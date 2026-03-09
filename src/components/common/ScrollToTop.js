import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ルート変更時にページ上部にスクロールするコンポーネント
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;

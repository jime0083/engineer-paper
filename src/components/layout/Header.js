import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormContext } from '../../context/FormContext';
import './Header.css';

/**
 * ヘッダーコンポーネント（トップページ専用）
 * - 左端：サービスロゴ配置領域（実ロゴは後日差し替え。必要画像.txt の [LOGO-HEADER] 参照）
 * - 右側：「スキルシート作成」ボタン（新規作成として /step/1 へ遷移）
 * ※ トップページ以外では表示しない（MainLayout で制御）
 */
function Header() {
  const navigate = useNavigate();
  const { resetData } = useFormContext();

  const handleCreate = () => {
    resetData();
    navigate('/step/1');
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* ロゴ配置領域：実ロゴ画像が用意でき次第、この枠を <img> に差し替える */}
        <Link
          to="/"
          className="header-logo-slot"
          data-slot-id="LOGO-HEADER"
          aria-label="スキルシートメーカー トップページ"
        >
          <span className="header-logo-slot-id">[LOGO-HEADER]</span>
          <span className="header-logo-slot-label">サービスロゴ配置領域</span>
        </Link>

        <button
          type="button"
          className="header-create-btn"
          onClick={handleCreate}
        >
          スキルシート作成
        </button>
      </div>
    </header>
  );
}

export default Header;

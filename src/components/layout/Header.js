import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormContext } from '../../context/FormContext';
import './Header.css';

/**
 * ヘッダーコンポーネント（トップページ専用）
 * - 左端：サービスアイコン（public/icon.png）
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
        <Link
          to="/"
          className="header-logo"
          aria-label="スキルシートメーカー トップページ"
        >
          <img
            className="header-logo-img"
            src={`${process.env.PUBLIC_URL}/icon.png`}
            alt="スキルシートメーカー"
          />
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

import React from 'react';
import './SkillSheetTemplate.css';

/**
 * スキルシートPDFテンプレート
 * A4サイズ（210mm x 297mm）に最適化されたレイアウト
 * 各ページを個別にレンダリングしてページまたぎを防止
 */

// ページ定数（ピクセル単位）
const PAGE_WIDTH = 794;  // A4幅
const PAGE_HEIGHT = 1123; // A4高さ
const PADDING = 30;
const CONTENT_HEIGHT = PAGE_HEIGHT - PADDING * 2; // 1063px

// 要素の高さ（推定値）
const HEADER_HEIGHT = 50;
const BASIC_INFO_ROW_HEIGHT = 35;
const SECTION_TITLE_HEIGHT = 35;
const TABLE_HEADER_HEIGHT = 35;
const SKILL_ROW_HEIGHT = 35;
const WORK_HISTORY_ROW_HEIGHT = 180;
const SELF_PR_BASE_HEIGHT = 50;
const SELF_PR_LINE_HEIGHT = 15;

function SkillSheetTemplate({ formData }) {
  const { profile, address, contact, skills, workHistories, selfPR, creationDate } = formData;

  // ヘルパー関数
  const calculateAge = () => {
    const { birthDate } = profile;
    if (!birthDate?.year || !birthDate?.month || !birthDate?.day) return '';
    const today = new Date();
    const birth = new Date(birthDate.year, birthDate.month - 1, birthDate.day);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const formatBirthDate = () => {
    const { birthDate } = profile;
    if (!birthDate?.year || !birthDate?.month || !birthDate?.day) return '';
    return `${birthDate.year}年${birthDate.month}月${birthDate.day}日`;
  };

  const formatCreationDate = () => {
    const date = creationDate?.creationDate;
    if (!date?.year || !date?.month || !date?.day) {
      const now = new Date();
      return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
    }
    return `${date.year}年${date.month}月${date.day}日`;
  };

  const formatGender = () => {
    const genderMap = { male: '男性', female: '女性', other: 'その他', 'no-answer': '-' };
    return genderMap[profile.gender] || '-';
  };

  const formatAddress = () => {
    const parts = [];
    if (address.prefecture) parts.push(address.prefecture);
    if (address.city) parts.push(address.city);
    if (address.address) parts.push(address.address);
    return parts.join(' ') || '-';
  };

  const calculateWorkDuration = (history) => {
    const { startPeriod, endPeriod, isCurrentJob } = history;
    if (!startPeriod?.year || !startPeriod?.month) return '';
    const startDate = new Date(startPeriod.year, startPeriod.month - 1);
    let endDate;
    if (isCurrentJob) {
      endDate = new Date();
    } else if (endPeriod?.year && endPeriod?.month) {
      endDate = new Date(endPeriod.year, endPeriod.month - 1);
    } else {
      return '';
    }
    const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 +
                   (endDate.getMonth() - startDate.getMonth()) + 1;
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (years > 0 && remainingMonths > 0) return `${years}年${remainingMonths}ヶ月`;
    if (years > 0) return `${years}年`;
    return `${remainingMonths}ヶ月`;
  };

  const formatPeriod = (history) => {
    const { startPeriod, endPeriod, isCurrentJob } = history;
    if (!startPeriod?.year || !startPeriod?.month) return { start: '', end: '' };
    const start = `${startPeriod.year}/${String(startPeriod.month).padStart(2, '0')}`;
    let end = '';
    if (isCurrentJob) {
      end = '現在';
    } else if (endPeriod?.year && endPeriod?.month) {
      end = `${endPeriod.year}/${String(endPeriod.month).padStart(2, '0')}`;
    }
    return { start, end };
  };

  // データ準備
  const confirmedSkills = skills.filter(s => s.name && s.isConfirmed);
  const confirmedHistories = workHistories
    .filter(h => h.projectName && h.isConfirmed)
    .sort((a, b) => {
      const dateA = new Date(a.startPeriod?.year || 0, (a.startPeriod?.month || 1) - 1);
      const dateB = new Date(b.startPeriod?.year || 0, (b.startPeriod?.month || 1) - 1);
      return dateB - dateA;
    });

  // 自己PRの高さを推定
  const estimateSelfPRHeight = () => {
    if (!selfPR.selfPR) return 0;
    const lines = selfPR.selfPR.split('\n').length;
    const charLines = Math.ceil(selfPR.selfPR.length / 80);
    return SECTION_TITLE_HEIGHT + SELF_PR_BASE_HEIGHT + Math.max(lines, charLines) * SELF_PR_LINE_HEIGHT;
  };

  /**
   * ページ構造を計算
   */
  const calculatePages = () => {
    const pages = [];
    let currentPage = { elements: [], usedHeight: 0 };

    // ヘッダーセクションを追加
    const addToPage = (element, height) => {
      if (currentPage.usedHeight + height > CONTENT_HEIGHT) {
        // 現在のページを確定し、新しいページを開始
        pages.push(currentPage);
        currentPage = { elements: [], usedHeight: 0 };
      }
      currentPage.elements.push(element);
      currentPage.usedHeight += height;
    };

    // 1. ヘッダー（タイトル + 作成日）
    addToPage({ type: 'header' }, HEADER_HEIGHT);

    // 2. 基本情報テーブル
    addToPage({ type: 'basicInfo' }, BASIC_INFO_ROW_HEIGHT * 6);

    // 3. スキルセクション
    if (confirmedSkills.length > 0) {
      const skillsHeight = SECTION_TITLE_HEIGHT + TABLE_HEADER_HEIGHT + (confirmedSkills.length * SKILL_ROW_HEIGHT);
      addToPage({ type: 'skills' }, skillsHeight);
    }

    // 4. 自己PR
    if (selfPR.selfPR) {
      addToPage({ type: 'selfPR' }, estimateSelfPRHeight());
    }

    // 5. 職務経歴
    if (confirmedHistories.length > 0) {
      // セクションタイトル + テーブルヘッダー
      const workHistoryHeaderHeight = SECTION_TITLE_HEIGHT + TABLE_HEADER_HEIGHT;

      // 最初の職務経歴ヘッダーがページに収まるかチェック
      if (currentPage.usedHeight + workHistoryHeaderHeight + WORK_HISTORY_ROW_HEIGHT > CONTENT_HEIGHT) {
        // 収まらない場合、新しいページから開始
        pages.push(currentPage);
        currentPage = { elements: [], usedHeight: 0 };
      }

      // 職務経歴ヘッダーを追加
      addToPage({ type: 'workHistoryHeader' }, workHistoryHeaderHeight);

      // 各プロジェクト
      for (let i = 0; i < confirmedHistories.length; i++) {
        const history = confirmedHistories[i];

        // このプロジェクトが現在のページに収まるかチェック
        if (currentPage.usedHeight + WORK_HISTORY_ROW_HEIGHT > CONTENT_HEIGHT) {
          // 収まらない場合、新しいページを開始
          pages.push(currentPage);
          currentPage = { elements: [], usedHeight: 0 };

          // 新しいページにテーブルヘッダーを追加
          currentPage.elements.push({ type: 'workHistoryTableHeader' });
          currentPage.usedHeight += TABLE_HEADER_HEIGHT;
        }

        currentPage.elements.push({ type: 'workHistoryRow', data: history });
        currentPage.usedHeight += WORK_HISTORY_ROW_HEIGHT;
      }
    }

    // 最後のページを追加
    if (currentPage.elements.length > 0) {
      pages.push(currentPage);
    }

    return pages;
  };

  const pages = calculatePages();

  // レンダリング用コンポーネント
  const renderHeader = () => (
    <div className="skillsheet-header">
      <h1 className="skillsheet-title">スキルシート</h1>
      <div className="skillsheet-date">作成日: {formatCreationDate()}</div>
    </div>
  );

  const renderBasicInfo = () => (
    <table className="skillsheet-table skillsheet-basic-info">
      <tbody>
        <tr>
          <th>氏名</th>
          <td className="name-cell">{profile.lastName} {profile.firstName}</td>
          <th>ふりがな</th>
          <td>{profile.lastNameKana} {profile.firstNameKana}</td>
        </tr>
        <tr>
          <th>性別</th>
          <td>{formatGender()}</td>
          <th>生年月日</th>
          <td>{formatBirthDate()}</td>
        </tr>
        <tr>
          <th>年齢</th>
          <td>{calculateAge() ? `${calculateAge()}歳` : '-'}</td>
          <th>最寄駅</th>
          <td>{address.nearestStation || '-'}</td>
        </tr>
        <tr>
          <th>住所</th>
          <td colSpan="3">{formatAddress()}</td>
        </tr>
        <tr>
          <th>電話番号</th>
          <td>{contact?.phone || '-'}</td>
          <th>メール</th>
          <td>{contact?.email || '-'}</td>
        </tr>
        <tr>
          <th>資格</th>
          <td colSpan="3">{profile.qualifications || '-'}</td>
        </tr>
      </tbody>
    </table>
  );

  const renderSkills = () => (
    <>
      <h2 className="skillsheet-section-title">スキル</h2>
      <table className="skillsheet-table skillsheet-skills">
        <thead>
          <tr>
            <th>スキル</th>
            <th>経験年数</th>
            <th>習熟度・説明</th>
          </tr>
        </thead>
        <tbody>
          {confirmedSkills.map((skill) => (
            <tr key={skill.id}>
              <td>{skill.name}</td>
              <td className="center-cell">{skill.experience}</td>
              <td>{skill.description || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );

  const renderSelfPR = () => (
    <>
      <h2 className="skillsheet-section-title">自己PR</h2>
      <div className="skillsheet-selfpr">{selfPR.selfPR}</div>
    </>
  );

  const renderWorkHistoryHeader = () => (
    <>
      <h2 className="skillsheet-section-title">職務経歴</h2>
      {renderWorkHistoryTableHeader()}
    </>
  );

  const renderWorkHistoryTableHeader = () => (
    <table className="skillsheet-table skillsheet-work-history">
      <thead>
        <tr>
          <th>期間</th>
          <th>稼働</th>
          <th>業務内容</th>
          <th>役割/規模</th>
          <th>言語/FW/MW/ツール等</th>
        </tr>
      </thead>
    </table>
  );

  const renderWorkHistoryRow = (history) => {
    const period = formatPeriod(history);
    return (
      <table className="skillsheet-table skillsheet-work-history skillsheet-work-history-row">
        <tbody>
          <tr>
            <td className="period-cell">
              <span className="period-start">{period.start}</span>
              <span className="period-separator">～</span>
              <span className="period-end">{period.end}</span>
            </td>
            <td className="center-cell">{calculateWorkDuration(history)}</td>
            <td className="content-cell">
              <div className="project-name">{history.projectName}</div>
              <div className="project-desc">{history.description}</div>
            </td>
            <td className="role-cell">
              <div>{history.role || '-'}</div>
              {history.scale && <div className="scale">{history.scale}</div>}
            </td>
            <td className="tech-cell">
              {history.languages && <div>{history.languages}</div>}
              {history.tools && <div>{history.tools}</div>}
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  const renderElement = (element) => {
    switch (element.type) {
      case 'header':
        return renderHeader();
      case 'basicInfo':
        return renderBasicInfo();
      case 'skills':
        return renderSkills();
      case 'selfPR':
        return renderSelfPR();
      case 'workHistoryHeader':
        return renderWorkHistoryHeader();
      case 'workHistoryTableHeader':
        return renderWorkHistoryTableHeader();
      case 'workHistoryRow':
        return renderWorkHistoryRow(element.data);
      default:
        return null;
    }
  };

  return (
    <div className="skillsheet-pages">
      {pages.map((page, pageIndex) => (
        <div key={pageIndex} className="skillsheet-page">
          <div className="skillsheet-page-content">
            {page.elements.map((element, elementIndex) => (
              <React.Fragment key={`${pageIndex}-${elementIndex}`}>
                {renderElement(element)}
              </React.Fragment>
            ))}
          </div>
          <div className="skillsheet-page-number">
            {pageIndex + 1} / {pages.length}
          </div>
        </div>
      ))}
    </div>
  );
}

export default SkillSheetTemplate;

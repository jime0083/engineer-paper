import React from 'react';
import './SkillSheetTemplate.css';

/**
 * スキルシートPDFテンプレート
 * A4サイズ（210mm x 297mm）に最適化されたレイアウト
 */
function SkillSheetTemplate({ formData }) {
  const { profile, address, skills, workHistories, selfPR, creationDate } = formData;

  /**
   * 年齢を計算
   */
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

  /**
   * 生年月日をフォーマット
   */
  const formatBirthDate = () => {
    const { birthDate } = profile;
    if (!birthDate?.year || !birthDate?.month || !birthDate?.day) return '';
    return `${birthDate.year}年${birthDate.month}月${birthDate.day}日`;
  };

  /**
   * 作成日をフォーマット
   */
  const formatCreationDate = () => {
    const date = creationDate?.creationDate;
    if (!date?.year || !date?.month || !date?.day) {
      const now = new Date();
      return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
    }
    return `${date.year}年${date.month}月${date.day}日`;
  };

  /**
   * 性別を表示用に変換
   */
  const formatGender = () => {
    const genderMap = {
      male: '男性',
      female: '女性',
      other: 'その他',
      'no-answer': '-',
    };
    return genderMap[profile.gender] || '-';
  };

  /**
   * 稼働期間を計算
   */
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

    if (years > 0 && remainingMonths > 0) {
      return `${years}年${remainingMonths}ヶ月`;
    } else if (years > 0) {
      return `${years}年`;
    } else {
      return `${remainingMonths}ヶ月`;
    }
  };

  /**
   * 期間をフォーマット
   */
  const formatPeriod = (history) => {
    const { startPeriod, endPeriod, isCurrentJob } = history;
    if (!startPeriod?.year || !startPeriod?.month) return '';

    const start = `${startPeriod.year}/${String(startPeriod.month).padStart(2, '0')}`;
    let end = '';

    if (isCurrentJob) {
      end = '現在';
    } else if (endPeriod?.year && endPeriod?.month) {
      end = `${endPeriod.year}/${String(endPeriod.month).padStart(2, '0')}`;
    }

    return `${start} ～ ${end}`;
  };

  // 確定済みのスキルのみ表示
  const confirmedSkills = skills.filter(s => s.name && s.isConfirmed);

  // 確定済みの職務経歴のみ表示（新しい順）
  const confirmedHistories = workHistories
    .filter(h => h.projectName && h.isConfirmed)
    .sort((a, b) => {
      const dateA = new Date(a.startPeriod?.year || 0, (a.startPeriod?.month || 1) - 1);
      const dateB = new Date(b.startPeriod?.year || 0, (b.startPeriod?.month || 1) - 1);
      return dateB - dateA;
    });

  return (
    <div className="skillsheet-template">
      {/* ヘッダー */}
      <div className="skillsheet-header">
        <h1 className="skillsheet-title">スキルシート</h1>
        <div className="skillsheet-date">作成日: {formatCreationDate()}</div>
      </div>

      {/* 基本情報 */}
      <table className="skillsheet-table skillsheet-basic-info">
        <tbody>
          <tr>
            <th className="label-cell">氏名</th>
            <td colSpan="3" className="name-cell">
              {profile.lastName} {profile.firstName}
            </td>
            <th className="label-cell">ふりがな</th>
            <td colSpan="3">
              {profile.lastNameKana} {profile.firstNameKana}
            </td>
          </tr>
          <tr>
            <th className="label-cell">性別</th>
            <td>{formatGender()}</td>
            <th className="label-cell">生年月日</th>
            <td>{formatBirthDate()}</td>
            <th className="label-cell">年齢</th>
            <td>{calculateAge() ? `${calculateAge()}歳` : ''}</td>
            <th className="label-cell">最寄駅</th>
            <td>{address.nearestStation}</td>
          </tr>
          <tr>
            <th className="label-cell">資格</th>
            <td colSpan="7" className="qualifications-cell">
              {profile.qualifications || '-'}
            </td>
          </tr>
        </tbody>
      </table>

      {/* スキル */}
      {confirmedSkills.length > 0 && (
        <>
          <h2 className="skillsheet-section-title">スキル</h2>
          <table className="skillsheet-table skillsheet-skills">
            <thead>
              <tr>
                <th className="skill-name-header">スキル</th>
                <th className="skill-exp-header">経験年数</th>
                <th className="skill-desc-header">習熟度・説明</th>
              </tr>
            </thead>
            <tbody>
              {confirmedSkills.map((skill) => (
                <tr key={skill.id}>
                  <td className="skill-name-cell">{skill.name}</td>
                  <td className="skill-exp-cell">{skill.experience}</td>
                  <td className="skill-desc-cell">{skill.description || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* 自己PR */}
      {selfPR.selfPR && (
        <>
          <h2 className="skillsheet-section-title">自己PR</h2>
          <div className="skillsheet-selfpr">
            {selfPR.selfPR}
          </div>
        </>
      )}

      {/* 職務経歴 */}
      {confirmedHistories.length > 0 && (
        <>
          <h2 className="skillsheet-section-title">職務経歴</h2>
          <table className="skillsheet-table skillsheet-work-history">
            <thead>
              <tr>
                <th className="period-header">期間</th>
                <th className="duration-header">稼働</th>
                <th className="content-header">業務内容</th>
                <th className="role-header">役割/規模</th>
                <th className="tech-header">言語/FW/MW/ツール等</th>
              </tr>
            </thead>
            <tbody>
              {confirmedHistories.map((history) => (
                <tr key={history.id}>
                  <td className="period-cell">{formatPeriod(history)}</td>
                  <td className="duration-cell">{calculateWorkDuration(history)}</td>
                  <td className="content-cell">
                    <div className="project-name">{history.projectName}</div>
                    <div className="project-desc">{history.description}</div>
                  </td>
                  <td className="role-cell">
                    <div>{history.role || '-'}</div>
                    {history.scale && <div className="scale">{history.scale}</div>}
                  </td>
                  <td className="tech-cell">
                    {history.languages && <div className="tech-item">{history.languages}</div>}
                    {history.tools && <div className="tech-item">{history.tools}</div>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default SkillSheetTemplate;

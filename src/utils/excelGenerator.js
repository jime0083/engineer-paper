/**
 * Excel生成ユーティリティ
 * exceljsライブラリを使用してスキルシートをExcelファイルとして生成
 */
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

/**
 * 年齢を計算
 */
function calculateAge(birthDate) {
  if (!birthDate?.year || !birthDate?.month || !birthDate?.day) return '';
  const today = new Date();
  const birth = new Date(birthDate.year, birthDate.month - 1, birthDate.day);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return `${age}歳`;
}

/**
 * 生年月日をフォーマット
 */
function formatBirthDate(birthDate) {
  if (!birthDate?.year || !birthDate?.month || !birthDate?.day) return '';
  return `${birthDate.year}年${birthDate.month}月${birthDate.day}日`;
}

/**
 * 作成日をフォーマット
 */
function formatCreationDate(creationDate) {
  const date = creationDate?.creationDate;
  if (!date?.year || !date?.month || !date?.day) {
    const now = new Date();
    return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
  }
  return `${date.year}年${date.month}月${date.day}日`;
}

/**
 * 性別を表示用に変換
 */
function formatGender(gender) {
  const genderMap = {
    male: '男性',
    female: '女性',
    other: 'その他',
    'no-answer': '-',
  };
  return genderMap[gender] || '-';
}

/**
 * 住所をフォーマット
 */
function formatAddress(address) {
  const parts = [];
  if (address.prefecture) parts.push(address.prefecture);
  if (address.city) parts.push(address.city);
  if (address.address) parts.push(address.address);
  return parts.join(' ') || '-';
}

/**
 * 稼働期間を計算
 */
function calculateWorkDuration(history) {
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

  const months =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth()) +
    1;
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (years > 0 && remainingMonths > 0) {
    return `${years}年${remainingMonths}ヶ月`;
  } else if (years > 0) {
    return `${years}年`;
  } else {
    return `${remainingMonths}ヶ月`;
  }
}

/**
 * 期間をフォーマット
 */
function formatPeriod(history) {
  const { startPeriod, endPeriod, isCurrentJob } = history;
  if (!startPeriod?.year || !startPeriod?.month) return '';

  const start = `${startPeriod.year}/${String(startPeriod.month).padStart(2, '0')}`;
  let end = '';

  if (isCurrentJob) {
    end = '現在';
  } else if (endPeriod?.year && endPeriod?.month) {
    end = `${endPeriod.year}/${String(endPeriod.month).padStart(2, '0')}`;
  }

  return `${start}～${end}`;
}

/**
 * ヘッダーセルのスタイルを設定
 */
function setHeaderStyle(cell) {
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE8E8E8' },
  };
  cell.font = { bold: true, size: 10 };
  cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
  cell.border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  };
}

/**
 * ラベルセルのスタイルを設定
 */
function setLabelStyle(cell) {
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFF5F5F5' },
  };
  cell.font = { bold: true, size: 10 };
  cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
  cell.border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  };
}

/**
 * 通常セルのスタイルを設定
 */
function setCellStyle(cell) {
  cell.font = { size: 10 };
  cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
  cell.border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  };
}

/**
 * Excelワークブックを生成
 */
export async function generateExcelWorkbook(formData) {
  const { profile, address, contact, skills, workHistories, selfPR, creationDate } = formData;

  const workbook = new ExcelJS.Workbook();

  // ========== シート1: プロフィール ==========
  const profileSheet = workbook.addWorksheet('プロフィール');

  // 列幅を設定（プロフィール用）
  profileSheet.columns = [
    { width: 12 },  // A
    { width: 18 },  // B
    { width: 12 },  // C
    { width: 18 },  // D
    { width: 15 },  // E
    { width: 20 },  // F
  ];

  let rowNum = 1;

  // タイトル
  profileSheet.mergeCells(`A${rowNum}:F${rowNum}`);
  let cell = profileSheet.getCell(`A${rowNum}`);
  cell.value = 'スキルシート';
  cell.font = { bold: true, size: 18 };
  cell.alignment = { horizontal: 'center', vertical: 'middle' };
  profileSheet.getRow(rowNum).height = 30;
  rowNum++;

  // 作成日
  profileSheet.mergeCells(`A${rowNum}:F${rowNum}`);
  cell = profileSheet.getCell(`A${rowNum}`);
  cell.value = `作成日: ${formatCreationDate(creationDate)}`;
  cell.alignment = { horizontal: 'right', vertical: 'middle' };
  cell.font = { size: 10 };
  rowNum += 2;

  // 基本情報
  // 行1: 氏名・ふりがな
  cell = profileSheet.getCell(`A${rowNum}`);
  cell.value = '氏名';
  setLabelStyle(cell);
  cell = profileSheet.getCell(`B${rowNum}`);
  cell.value = `${profile.lastName || ''} ${profile.firstName || ''}`;
  setCellStyle(cell);
  cell = profileSheet.getCell(`C${rowNum}`);
  cell.value = 'ふりがな';
  setLabelStyle(cell);
  profileSheet.mergeCells(`D${rowNum}:F${rowNum}`);
  cell = profileSheet.getCell(`D${rowNum}`);
  cell.value = `${profile.lastNameKana || ''} ${profile.firstNameKana || ''}`;
  setCellStyle(cell);
  rowNum++;

  // 行2: 性別・生年月日
  cell = profileSheet.getCell(`A${rowNum}`);
  cell.value = '性別';
  setLabelStyle(cell);
  cell = profileSheet.getCell(`B${rowNum}`);
  cell.value = formatGender(profile.gender);
  setCellStyle(cell);
  cell = profileSheet.getCell(`C${rowNum}`);
  cell.value = '生年月日';
  setLabelStyle(cell);
  profileSheet.mergeCells(`D${rowNum}:F${rowNum}`);
  cell = profileSheet.getCell(`D${rowNum}`);
  cell.value = formatBirthDate(profile.birthDate);
  setCellStyle(cell);
  rowNum++;

  // 行3: 年齢・最寄駅
  cell = profileSheet.getCell(`A${rowNum}`);
  cell.value = '年齢';
  setLabelStyle(cell);
  cell = profileSheet.getCell(`B${rowNum}`);
  cell.value = calculateAge(profile.birthDate);
  setCellStyle(cell);
  cell = profileSheet.getCell(`C${rowNum}`);
  cell.value = '最寄駅';
  setLabelStyle(cell);
  profileSheet.mergeCells(`D${rowNum}:F${rowNum}`);
  cell = profileSheet.getCell(`D${rowNum}`);
  cell.value = address.nearestStation || '-';
  setCellStyle(cell);
  rowNum++;

  // 行4: 住所
  cell = profileSheet.getCell(`A${rowNum}`);
  cell.value = '住所';
  setLabelStyle(cell);
  profileSheet.mergeCells(`B${rowNum}:F${rowNum}`);
  cell = profileSheet.getCell(`B${rowNum}`);
  cell.value = formatAddress(address);
  setCellStyle(cell);
  rowNum++;

  // 行5: 電話番号・メール
  cell = profileSheet.getCell(`A${rowNum}`);
  cell.value = '電話番号';
  setLabelStyle(cell);
  cell = profileSheet.getCell(`B${rowNum}`);
  cell.value = contact?.phone || '-';
  setCellStyle(cell);
  cell = profileSheet.getCell(`C${rowNum}`);
  cell.value = 'メール';
  setLabelStyle(cell);
  profileSheet.mergeCells(`D${rowNum}:F${rowNum}`);
  cell = profileSheet.getCell(`D${rowNum}`);
  cell.value = contact?.email || '-';
  setCellStyle(cell);
  rowNum++;

  // 行6: 資格
  cell = profileSheet.getCell(`A${rowNum}`);
  cell.value = '資格';
  setLabelStyle(cell);
  profileSheet.mergeCells(`B${rowNum}:F${rowNum}`);
  cell = profileSheet.getCell(`B${rowNum}`);
  cell.value = profile.qualifications || '-';
  setCellStyle(cell);
  rowNum += 2;

  // スキル
  const confirmedSkills = skills.filter((s) => s.name && s.isConfirmed);
  if (confirmedSkills.length > 0) {
    profileSheet.mergeCells(`A${rowNum}:F${rowNum}`);
    cell = profileSheet.getCell(`A${rowNum}`);
    cell.value = 'スキル';
    cell.font = { bold: true, size: 12 };
    rowNum++;

    // ヘッダー
    cell = profileSheet.getCell(`A${rowNum}`);
    cell.value = 'スキル';
    setHeaderStyle(cell);
    profileSheet.mergeCells(`B${rowNum}:C${rowNum}`);
    cell = profileSheet.getCell(`B${rowNum}`);
    cell.value = '経験年数';
    setHeaderStyle(cell);
    profileSheet.mergeCells(`D${rowNum}:F${rowNum}`);
    cell = profileSheet.getCell(`D${rowNum}`);
    cell.value = '習熟度・説明';
    setHeaderStyle(cell);
    rowNum++;

    // データ
    confirmedSkills.forEach((skill) => {
      cell = profileSheet.getCell(`A${rowNum}`);
      cell.value = skill.name;
      setCellStyle(cell);
      profileSheet.mergeCells(`B${rowNum}:C${rowNum}`);
      cell = profileSheet.getCell(`B${rowNum}`);
      cell.value = skill.experience;
      setCellStyle(cell);
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      profileSheet.mergeCells(`D${rowNum}:F${rowNum}`);
      cell = profileSheet.getCell(`D${rowNum}`);
      cell.value = skill.description || '-';
      setCellStyle(cell);
      rowNum++;
    });

    rowNum++;
  }

  // 自己PR
  if (selfPR?.selfPR) {
    profileSheet.mergeCells(`A${rowNum}:F${rowNum}`);
    cell = profileSheet.getCell(`A${rowNum}`);
    cell.value = '自己PR';
    cell.font = { bold: true, size: 12 };
    rowNum++;

    profileSheet.mergeCells(`A${rowNum}:F${rowNum}`);
    cell = profileSheet.getCell(`A${rowNum}`);
    cell.value = selfPR.selfPR;
    setCellStyle(cell);
    cell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
    profileSheet.getRow(rowNum).height = 120;
  }

  // ========== シート2: 職務経歴 ==========
  const workSheet = workbook.addWorksheet('職務経歴');

  // 列幅を設定（職務経歴用、業務内容を広く）
  workSheet.columns = [
    { width: 14 },  // A: 期間
    { width: 10 },  // B: 稼働
    { width: 60 },  // C: 業務内容（広め）
    { width: 15 },  // D: 役割/規模
    { width: 30 },  // E: 言語等
  ];

  const confirmedHistories = workHistories
    .filter((h) => h.projectName && h.isConfirmed)
    .sort((a, b) => {
      const dateA = new Date(a.startPeriod?.year || 0, (a.startPeriod?.month || 1) - 1);
      const dateB = new Date(b.startPeriod?.year || 0, (b.startPeriod?.month || 1) - 1);
      return dateB - dateA;
    });

  let workRow = 1;

  // タイトル
  workSheet.mergeCells(`A${workRow}:E${workRow}`);
  cell = workSheet.getCell(`A${workRow}`);
  cell.value = '職務経歴';
  cell.font = { bold: true, size: 18 };
  cell.alignment = { horizontal: 'center', vertical: 'middle' };
  workSheet.getRow(workRow).height = 30;
  workRow += 2;

  if (confirmedHistories.length > 0) {
    // ヘッダー
    cell = workSheet.getCell(`A${workRow}`);
    cell.value = '期間';
    setHeaderStyle(cell);
    cell = workSheet.getCell(`B${workRow}`);
    cell.value = '稼働';
    setHeaderStyle(cell);
    cell = workSheet.getCell(`C${workRow}`);
    cell.value = '業務内容';
    setHeaderStyle(cell);
    cell = workSheet.getCell(`D${workRow}`);
    cell.value = '役割/規模';
    setHeaderStyle(cell);
    cell = workSheet.getCell(`E${workRow}`);
    cell.value = '言語/FW/MW/ツール等';
    setHeaderStyle(cell);
    workRow++;

    // データ
    confirmedHistories.forEach((history) => {
      const techStack = [history.languages, history.tools].filter(Boolean).join('\n');

      cell = workSheet.getCell(`A${workRow}`);
      cell.value = formatPeriod(history);
      setCellStyle(cell);
      cell = workSheet.getCell(`B${workRow}`);
      cell.value = calculateWorkDuration(history);
      setCellStyle(cell);
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      cell = workSheet.getCell(`C${workRow}`);
      cell.value = `${history.projectName || ''}\n${history.description || ''}`;
      setCellStyle(cell);
      cell = workSheet.getCell(`D${workRow}`);
      cell.value = `${history.role || '-'}\n${history.scale || ''}`;
      setCellStyle(cell);
      cell = workSheet.getCell(`E${workRow}`);
      cell.value = techStack || '-';
      setCellStyle(cell);
      workSheet.getRow(workRow).height = 80;
      workRow++;
    });
  } else {
    // 職務経歴がない場合
    workSheet.mergeCells(`A${workRow}:E${workRow}`);
    cell = workSheet.getCell(`A${workRow}`);
    cell.value = '職務経歴はありません';
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
  }

  return workbook;
}

/**
 * Excelファイルをダウンロード
 */
export async function downloadExcel(formData, fileName) {
  try {
    const workbook = await generateExcelWorkbook(formData);
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, fileName);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Excelファイル名を生成
 */
export function generateExcelFileName(formData) {
  const { profile, creationDate } = formData;
  const name = profile.lastName || 'skillsheet';
  const date = creationDate?.creationDate;

  let dateStr = '';
  if (date?.year && date?.month && date?.day) {
    dateStr = `_${date.year}${String(date.month).padStart(2, '0')}${String(date.day).padStart(2, '0')}`;
  } else {
    const now = new Date();
    dateStr = `_${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  }

  return `${name}${dateStr}.xlsx`;
}

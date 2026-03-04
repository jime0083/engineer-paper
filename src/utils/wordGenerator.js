/**
 * Word生成ユーティリティ
 * docxライブラリを使用してスキルシートをWordファイルとして生成
 */
import {
  Document,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  WidthType,
  AlignmentType,
  BorderStyle,
  HeadingLevel,
  Packer,
} from 'docx';
import { saveAs } from 'file-saver';

/**
 * 改行を含むテキストをTextRunの配列に変換
 * @param {string} text - 変換するテキスト
 * @param {object} options - TextRunのオプション
 * @returns {TextRun[]} TextRunの配列
 */
function createTextRunsWithBreaks(text, options = {}) {
  if (!text) return [new TextRun({ text: '-', ...options })];

  const lines = text.split('\n');
  const textRuns = [];

  lines.forEach((line, index) => {
    if (index > 0) {
      textRuns.push(new TextRun({ break: 1, ...options }));
    }
    textRuns.push(new TextRun({ text: line, ...options }));
  });

  return textRuns;
}

/**
 * 改行を含むテキストをParagraphの配列に変換
 * @param {string} text - 変換するテキスト
 * @param {object} options - TextRunのオプション
 * @returns {Paragraph[]} Paragraphの配列
 */
function createParagraphsWithBreaks(text, options = {}) {
  if (!text) return [new Paragraph({ children: [new TextRun({ text: '-', ...options })] })];

  const lines = text.split('\n');
  return lines.map(
    (line) =>
      new Paragraph({
        children: [new TextRun({ text: line, ...options })],
      })
  );
}

/**
 * 共通のテーブルセルボーダースタイル
 */
const tableBorders = {
  top: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
  bottom: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
  left: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
  right: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
};

/**
 * ヘッダーセルを作成
 */
function createHeaderCell(text, width) {
  return new TableCell({
    children: [
      new Paragraph({
        children: [new TextRun({ text, bold: true, size: 20 })],
        alignment: AlignmentType.CENTER,
      }),
    ],
    width: { size: width, type: WidthType.PERCENTAGE },
    shading: { fill: 'E8E8E8' },
    borders: tableBorders,
  });
}

/**
 * 通常セルを作成（改行対応）
 */
function createCell(text, width, options = {}) {
  const { alignment = AlignmentType.LEFT, bold = false } = options;
  return new TableCell({
    children: [
      new Paragraph({
        children: createTextRunsWithBreaks(text, { bold, size: 20 }),
        alignment,
      }),
    ],
    width: { size: width, type: WidthType.PERCENTAGE },
    borders: tableBorders,
  });
}

/**
 * 基本情報テーブルのラベルセルを作成
 */
function createLabelCell(text, width) {
  return new TableCell({
    children: [
      new Paragraph({
        children: [new TextRun({ text, bold: true, size: 20 })],
        alignment: AlignmentType.CENTER,
      }),
    ],
    width: { size: width, type: WidthType.PERCENTAGE },
    shading: { fill: 'F5F5F5' },
    borders: tableBorders,
  });
}

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
 * 基本情報テーブルを作成
 */
function createBasicInfoTable(formData) {
  const { profile, address, contact } = formData;

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          createLabelCell('氏名', 15),
          createCell(`${profile.lastName || ''} ${profile.firstName || ''}`, 35),
          createLabelCell('ふりがな', 15),
          createCell(`${profile.lastNameKana || ''} ${profile.firstNameKana || ''}`, 35),
        ],
      }),
      new TableRow({
        children: [
          createLabelCell('性別', 15),
          createCell(formatGender(profile.gender), 35),
          createLabelCell('生年月日', 15),
          createCell(formatBirthDate(profile.birthDate), 35),
        ],
      }),
      new TableRow({
        children: [
          createLabelCell('年齢', 15),
          createCell(calculateAge(profile.birthDate), 35),
          createLabelCell('最寄駅', 15),
          createCell(address.nearestStation, 35),
        ],
      }),
      new TableRow({
        children: [
          createLabelCell('住所', 15),
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: formatAddress(address), size: 20 })],
              }),
            ],
            width: { size: 85, type: WidthType.PERCENTAGE },
            columnSpan: 3,
            borders: tableBorders,
          }),
        ],
      }),
      new TableRow({
        children: [
          createLabelCell('電話番号', 15),
          createCell(contact?.phone, 35),
          createLabelCell('メール', 15),
          createCell(contact?.email, 35),
        ],
      }),
      new TableRow({
        children: [
          createLabelCell('資格', 15),
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: profile.qualifications || '-', size: 20 })],
              }),
            ],
            width: { size: 85, type: WidthType.PERCENTAGE },
            columnSpan: 3,
            borders: tableBorders,
          }),
        ],
      }),
    ],
  });
}

/**
 * スキルテーブルを作成
 */
function createSkillsTable(skills) {
  const confirmedSkills = skills.filter((s) => s.name && s.isConfirmed);

  if (confirmedSkills.length === 0) return null;

  const headerRow = new TableRow({
    children: [
      createHeaderCell('スキル', 30),
      createHeaderCell('経験年数', 20),
      createHeaderCell('習熟度・説明', 50),
    ],
  });

  const dataRows = confirmedSkills.map(
    (skill) =>
      new TableRow({
        children: [
          createCell(skill.name, 30),
          createCell(skill.experience, 20, { alignment: AlignmentType.CENTER }),
          createCell(skill.description, 50),
        ],
      })
  );

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [headerRow, ...dataRows],
  });
}

/**
 * 職務経歴テーブルを作成
 */
function createWorkHistoryTable(workHistories) {
  const confirmedHistories = workHistories
    .filter((h) => h.projectName && h.isConfirmed)
    .sort((a, b) => {
      const dateA = new Date(a.startPeriod?.year || 0, (a.startPeriod?.month || 1) - 1);
      const dateB = new Date(b.startPeriod?.year || 0, (b.startPeriod?.month || 1) - 1);
      return dateB - dateA;
    });

  if (confirmedHistories.length === 0) return null;

  const headerRow = new TableRow({
    children: [
      createHeaderCell('期間', 15),
      createHeaderCell('稼働', 10),
      createHeaderCell('業務内容', 35),
      createHeaderCell('役割/規模', 15),
      createHeaderCell('言語/FW/MW/ツール等', 25),
    ],
  });

  const dataRows = confirmedHistories.map((history) => {
    const techStack = [history.languages, history.tools].filter(Boolean).join('\n');

    // 業務内容のParagraphを作成（改行対応）
    const descriptionParagraphs = [
      new Paragraph({
        children: [new TextRun({ text: history.projectName || '', bold: true, size: 20 })],
      }),
      ...createParagraphsWithBreaks(history.description, { size: 18 }),
    ];

    return new TableRow({
      children: [
        createCell(formatPeriod(history), 15),
        createCell(calculateWorkDuration(history), 10, { alignment: AlignmentType.CENTER }),
        new TableCell({
          children: descriptionParagraphs,
          width: { size: 35, type: WidthType.PERCENTAGE },
          borders: tableBorders,
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [new TextRun({ text: history.role || '-', size: 20 })],
            }),
            new Paragraph({
              children: createTextRunsWithBreaks(history.scale, { size: 18 }),
            }),
          ],
          width: { size: 15, type: WidthType.PERCENTAGE },
          borders: tableBorders,
        }),
        createCell(techStack, 25),
      ],
    });
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [headerRow, ...dataRows],
  });
}

/**
 * Wordドキュメントを生成
 */
export function generateWordDocument(formData) {
  const { skills, workHistories, selfPR, creationDate } = formData;

  const sections = [];

  // タイトル
  sections.push(
    new Paragraph({
      children: [new TextRun({ text: 'スキルシート', bold: true, size: 36 })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    })
  );

  // 作成日
  sections.push(
    new Paragraph({
      children: [new TextRun({ text: `作成日: ${formatCreationDate(creationDate)}`, size: 20 })],
      alignment: AlignmentType.RIGHT,
      spacing: { after: 400 },
    })
  );

  // 基本情報
  sections.push(createBasicInfoTable(formData));
  sections.push(new Paragraph({ spacing: { after: 400 } }));

  // スキル
  const skillsTable = createSkillsTable(skills);
  if (skillsTable) {
    sections.push(
      new Paragraph({
        children: [new TextRun({ text: 'スキル', bold: true, size: 28 })],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 },
      })
    );
    sections.push(skillsTable);
    sections.push(new Paragraph({ spacing: { after: 400 } }));
  }

  // 自己PR
  if (selfPR?.selfPR) {
    sections.push(
      new Paragraph({
        children: [new TextRun({ text: '自己PR', bold: true, size: 28 })],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 },
      })
    );
    // 改行を含むテキストを複数のParagraphに分割
    const selfPRParagraphs = createParagraphsWithBreaks(selfPR.selfPR, { size: 20 });
    selfPRParagraphs.forEach((para, index) => {
      if (index === selfPRParagraphs.length - 1) {
        // 最後のParagraphにspacing.afterを追加
        sections.push(
          new Paragraph({
            children: para.options.children,
            spacing: { after: 400 },
          })
        );
      } else {
        sections.push(para);
      }
    });
  }

  // 職務経歴
  const workHistoryTable = createWorkHistoryTable(workHistories);
  if (workHistoryTable) {
    sections.push(
      new Paragraph({
        children: [new TextRun({ text: '職務経歴', bold: true, size: 28 })],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 },
      })
    );
    sections.push(workHistoryTable);
  }

  const doc = new Document({
    sections: [
      {
        children: sections,
      },
    ],
  });

  return doc;
}

/**
 * Wordファイルをダウンロード
 */
export async function downloadWord(formData, fileName) {
  try {
    const doc = generateWordDocument(formData);
    const blob = await Packer.toBlob(doc);
    saveAs(blob, fileName);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Wordファイル名を生成
 */
export function generateWordFileName(formData) {
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

  return `${name}${dateStr}.docx`;
}

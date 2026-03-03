/**
 * PDF生成ユーティリティ
 * jsPDF + html2canvas を使用してHTMLからPDFを生成
 */
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * HTML要素からPDFを生成
 * @param {HTMLElement} element - PDF化する要素
 * @param {string} fileName - ファイル名
 * @returns {Promise<Blob>} PDFのBlob
 */
export async function generatePdfFromElement(element, fileName = 'skillsheet.pdf') {
  // A4サイズの設定（mm）
  const a4Width = 210;
  const a4Height = 297;
  const margin = 10;
  const contentWidth = a4Width - margin * 2;

  // html2canvasでキャプチャ
  const canvas = await html2canvas(element, {
    scale: 2, // 高解像度
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  });

  // PDFを作成
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // 画像の縦横比を維持しながらA4に収める
  const imgWidth = contentWidth;
  const imgHeight = (canvas.height * contentWidth) / canvas.width;

  // 複数ページ対応
  let heightLeft = imgHeight;
  let position = margin;
  const pageHeight = a4Height - margin * 2;

  // 最初のページ
  pdf.addImage(
    canvas.toDataURL('image/png'),
    'PNG',
    margin,
    position,
    imgWidth,
    imgHeight
  );
  heightLeft -= pageHeight;

  // 追加ページが必要な場合
  while (heightLeft > 0) {
    position = heightLeft - imgHeight + margin;
    pdf.addPage();
    pdf.addImage(
      canvas.toDataURL('image/png'),
      'PNG',
      margin,
      position,
      imgWidth,
      imgHeight
    );
    heightLeft -= pageHeight;
  }

  return pdf;
}

/**
 * PDFをダウンロード
 * @param {HTMLElement} element - PDF化する要素
 * @param {string} fileName - ファイル名
 */
export async function downloadPdf(element, fileName = 'skillsheet.pdf') {
  try {
    const pdf = await generatePdfFromElement(element, fileName);
    pdf.save(fileName);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * PDFのBlobを取得（プレビュー用）
 * @param {HTMLElement} element - PDF化する要素
 * @returns {Promise<string>} BlobのURL
 */
export async function getPdfBlobUrl(element) {
  try {
    const pdf = await generatePdfFromElement(element);
    const blob = pdf.output('blob');
    return URL.createObjectURL(blob);
  } catch (error) {
    throw new Error('PDFの生成に失敗しました: ' + error.message);
  }
}

/**
 * フォームデータからファイル名を生成
 * @param {Object} formData - フォームデータ
 * @returns {string} ファイル名
 */
export function generateFileName(formData) {
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

  return `${name}${dateStr}.pdf`;
}

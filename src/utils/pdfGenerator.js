/**
 * PDF生成ユーティリティ
 * jsPDF + html2canvas を使用してHTMLからPDFを生成
 * 各ページを個別にキャプチャしてPDFに追加
 */
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * HTML要素からPDFを生成（ページ単位でキャプチャ）
 * @param {HTMLElement} element - PDF化する要素（.skillsheet-pages）
 * @returns {Promise<jsPDF>} PDFオブジェクト
 */
/**
 * PDF出力時のみ、見出し（.skillsheet-section-title）の文字を帯内で約10px上へ移動する。
 * - プレビュー（画面表示）は変更せず、html2canvasでキャプチャする瞬間だけスタイルを適用し、
 *   キャプチャ後に元へ戻す。
 * - 見出しは height:30px + display:flex + align-items:center + box-sizing:border-box。
 *   padding-bottom を 20px 足すと content領域が上に寄り、文字中心が 15px → 5px（=10px上）になる。
 *   帯の高さ・背景・位置は不変。
 * @param {HTMLElement} element
 * @returns {() => void} 元に戻す関数
 */
function applyPdfHeadingLift(element) {
  const titles = element.querySelectorAll('.skillsheet-section-title');
  const saved = [];
  titles.forEach((el) => {
    saved.push({ el, padding: el.style.getPropertyValue('padding'), priority: el.style.getPropertyPriority('padding') });
    // 現行CSSは padding:0 8px !important。左右8pxは維持し、下に20px足して文字を約10px上へ。
    el.style.setProperty('padding', '0 8px 20px 8px', 'important');
  });
  return () => {
    saved.forEach(({ el, padding, priority }) => {
      if (padding) {
        el.style.setProperty('padding', padding, priority);
      } else {
        el.style.removeProperty('padding');
      }
    });
  };
}

export async function generatePdfFromElement(element) {
  // A4サイズの設定（mm）
  const a4Width = 210;
  const a4Height = 297;
  const margin = 10;
  const contentWidth = a4Width - margin * 2;
  const contentHeight = a4Height - margin * 2;

  // PDFを作成
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // PDF出力時のみ、見出し文字を10px上へ（プレビューは変更しない）
  const revertHeadingLift = applyPdfHeadingLift(element);

  try {
  // 各ページ要素を取得
  const pages = element.querySelectorAll('.skillsheet-page');

  if (pages.length === 0) {
    // 旧形式（単一ページ）の場合
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgWidth = contentWidth;
    const imgHeight = (canvas.height * contentWidth) / canvas.width;

    pdf.addImage(
      canvas.toDataURL('image/png'),
      'PNG',
      margin,
      margin,
      imgWidth,
      Math.min(imgHeight, contentHeight)
    );

    return pdf;
  }

  // 各ページを個別にキャプチャ
  for (let i = 0; i < pages.length; i++) {
    if (i > 0) {
      pdf.addPage();
    }

    const pageElement = pages[i];

    // ページをキャプチャ
    const canvas = await html2canvas(pageElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    // PDFに追加（A4サイズに収める）
    pdf.addImage(
      canvas.toDataURL('image/png'),
      'PNG',
      margin,
      margin,
      contentWidth,
      contentHeight
    );
  }

    return pdf;
  } finally {
    // キャプチャ後、見出しのスタイルを元へ戻す（プレビュー表示を変更しない）
    revertHeadingLift();
  }
}

/**
 * PDFをダウンロード
 * @param {HTMLElement} element - PDF化する要素
 * @param {string} fileName - ファイル名
 */
export async function downloadPdf(element, fileName = 'skillsheet.pdf') {
  try {
    const pdf = await generatePdfFromElement(element);
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

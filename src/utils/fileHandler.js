/**
 * ファイル保存・読み込みユーティリティ
 */

/**
 * データをJSONファイルとしてダウンロード
 */
export function downloadAsJson(data, customFileName = null) {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const fileName = customFileName || `skillsheet_${dateStr}.json`;

  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * JSONファイルを読み込んでパース
 */
export function readJsonFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('ファイルが選択されていません'));
      return;
    }

    if (!file.name.endsWith('.json')) {
      reject(new Error('JSONファイルを選択してください'));
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        resolve(data);
      } catch {
        reject(new Error('ファイルの形式が正しくありません'));
      }
    };

    reader.onerror = () => {
      reject(new Error('ファイルの読み込みに失敗しました'));
    };

    reader.readAsText(file);
  });
}

/**
 * 読み込んだデータのバリデーション
 */
export function validateLoadedData(data) {
  const errors = [];

  if (!data || typeof data !== 'object') {
    errors.push('データの形式が正しくありません');
    return { isValid: false, errors };
  }

  // バージョンチェック
  if (data.version && data.version !== '1.0') {
    errors.push('このファイルは新しいバージョンで作成されているため、読み込めない可能性があります');
  }

  // 必須フィールドのチェック
  const requiredFields = ['profile', 'address', 'contact', 'summary', 'skills', 'workHistories', 'selfPR', 'creationDate'];
  requiredFields.forEach(field => {
    if (!data[field]) {
      errors.push(`${field}のデータがありません`);
    }
  });

  // スキルが配列かチェック
  if (data.skills && !Array.isArray(data.skills)) {
    errors.push('スキルのデータ形式が正しくありません');
  }

  // 職務経歴が配列かチェック
  if (data.workHistories && !Array.isArray(data.workHistories)) {
    errors.push('職務経歴のデータ形式が正しくありません');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: errors.filter(e => e.includes('可能性があります')),
  };
}

/**
 * データをマイグレーション（古いバージョンからの変換）
 */
export function migrateData(data) {
  // 将来のバージョンアップ時にデータ形式を変換するための関数
  const migrated = { ...data };

  // スキルにidがない場合は付与
  if (migrated.skills && Array.isArray(migrated.skills)) {
    migrated.skills = migrated.skills.map((skill, index) => ({
      ...skill,
      id: skill.id || index + 1,
    }));
  }

  // 職務経歴にidがない場合は付与
  if (migrated.workHistories && Array.isArray(migrated.workHistories)) {
    migrated.workHistories = migrated.workHistories.map((history, index) => ({
      ...history,
      id: history.id || index + 1,
    }));
  }

  return migrated;
}

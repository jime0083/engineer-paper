/**
 * バリデーションユーティリティ
 */

/**
 * 必須チェック
 */
export function isRequired(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (typeof value === 'object') {
    // 日付オブジェクトの場合
    if ('year' in value && 'month' in value) {
      return value.year && value.month;
    }
    if ('year' in value && 'month' in value && 'day' in value) {
      return value.year && value.month && value.day;
    }
  }
  return true;
}

/**
 * メールアドレス形式チェック
 */
export function isValidEmail(email) {
  if (!email) return true; // 空の場合はチェックしない
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 電話番号形式チェック（ハイフンあり）
 */
export function isValidPhone(phone) {
  if (!phone) return true; // 空の場合はチェックしない
  // 090-1234-5678, 03-1234-5678 形式
  const phoneRegex = /^0\d{1,4}-\d{1,4}-\d{4}$/;
  return phoneRegex.test(phone);
}

/**
 * 文字数チェック
 */
export function isWithinLength(value, maxLength) {
  if (!value) return true;
  return value.length <= maxLength;
}

/**
 * カタカナチェック
 */
export function isKatakana(value) {
  if (!value) return true;
  const katakanaRegex = /^[ァ-ヶー\s]+$/;
  return katakanaRegex.test(value);
}

/**
 * 郵便番号形式チェック
 */
export function isValidPostalCode(postalCode) {
  if (!postalCode) return true;
  const postalCodeRegex = /^\d{3}-?\d{4}$/;
  return postalCodeRegex.test(postalCode);
}

/**
 * プロフィールのバリデーション
 */
export function validateProfile(profile) {
  const errors = {};

  if (!isRequired(profile.lastName)) {
    errors.lastName = '姓を入力してください';
  }
  if (!isRequired(profile.firstName)) {
    errors.firstName = '名を入力してください';
  }
  if (!isRequired(profile.lastNameKana)) {
    errors.lastNameKana = 'セイを入力してください';
  } else if (!isKatakana(profile.lastNameKana)) {
    errors.lastNameKana = 'カタカナで入力してください';
  }
  if (!isRequired(profile.firstNameKana)) {
    errors.firstNameKana = 'メイを入力してください';
  } else if (!isKatakana(profile.firstNameKana)) {
    errors.firstNameKana = 'カタカナで入力してください';
  }
  if (!isRequired(profile.birthDate)) {
    errors.birthDate = '生年月日を入力してください';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * 住所のバリデーション
 */
export function validateAddress(address) {
  const errors = {};

  if (address.postalCode && !isValidPostalCode(address.postalCode)) {
    errors.postalCode = '郵便番号の形式が正しくありません（例：123-4567）';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * 連絡先のバリデーション
 */
export function validateContact(contact) {
  const errors = {};

  if (!isRequired(contact.phone)) {
    errors.phone = '電話番号を入力してください';
  } else if (!isValidPhone(contact.phone)) {
    errors.phone = '電話番号の形式が正しくありません（例：090-1234-5678）';
  }

  if (!isRequired(contact.email)) {
    errors.email = 'メールアドレスを入力してください';
  } else if (!isValidEmail(contact.email)) {
    errors.email = 'メールアドレスの形式が正しくありません';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * 職務要約のバリデーション
 */
export function validateSummary(summary) {
  const errors = {};

  if (!isWithinLength(summary.summary, 200)) {
    errors.summary = '200文字以内で入力してください';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * スキルのバリデーション
 */
export function validateSkills(skills) {
  const errors = [];
  let hasError = false;

  skills.forEach((skill, index) => {
    const skillErrors = {};
    if (!isRequired(skill.name)) {
      skillErrors.name = 'スキル名を入力してください';
      hasError = true;
    }
    if (!isRequired(skill.experience)) {
      skillErrors.experience = '経験年数を選択してください';
      hasError = true;
    }
    errors[index] = skillErrors;
  });

  return {
    isValid: !hasError,
    errors,
  };
}

/**
 * 職務経歴のバリデーション
 */
export function validateWorkHistories(workHistories) {
  const errors = [];
  let hasError = false;

  workHistories.forEach((history, index) => {
    const historyErrors = {};
    if (!isRequired(history.startPeriod)) {
      historyErrors.startPeriod = '開始年月を入力してください';
      hasError = true;
    }
    if (!history.isCurrentJob && !isRequired(history.endPeriod)) {
      historyErrors.endPeriod = '終了年月を入力してください';
      hasError = true;
    }
    if (!isRequired(history.projectName)) {
      historyErrors.projectName = 'プロジェクト名を入力してください';
      hasError = true;
    }
    errors[index] = historyErrors;
  });

  return {
    isValid: !hasError,
    errors,
  };
}

/**
 * 自己PRのバリデーション
 */
export function validateSelfPR(selfPR) {
  const errors = {};

  if (!isWithinLength(selfPR.selfPR, 1000)) {
    errors.selfPR = '1000文字以内で入力してください';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * 作成日のバリデーション
 */
export function validateCreationDate(creationDate) {
  const errors = {};

  if (!isRequired(creationDate.creationDate)) {
    errors.creationDate = '作成日を入力してください';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * ステップごとのバリデーション
 */
export function validateStep(step, formData) {
  switch (step) {
    case 1:
      return validateProfile(formData.profile);
    case 2:
      return validateAddress(formData.address);
    case 3:
      return validateContact(formData.contact);
    case 4:
      return validateSummary(formData.summary);
    case 5:
      return validateSkills(formData.skills);
    case 6:
      return validateWorkHistories(formData.workHistories);
    case 7:
      return validateSelfPR(formData.selfPR);
    case 8:
      return validateCreationDate(formData.creationDate);
    default:
      return { isValid: true, errors: {} };
  }
}

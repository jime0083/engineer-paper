import React, { createContext, useContext, useReducer, useCallback } from 'react';

/**
 * フォームデータの初期状態
 */
const initialFormData = {
  // ステップ1: プロフィール
  profile: {
    lastName: '',
    firstName: '',
    lastNameKana: '',
    firstNameKana: '',
    birthDate: { year: '', month: '', day: '' },
    gender: '',
    qualifications: '',
    specialties: '',
  },
  // ステップ2: 住所
  address: {
    postalCode: '',
    prefecture: '',
    city: '',
    address: '',
    nearestStation: '',
  },
  // ステップ3: 連絡先
  contact: {
    phone: '',
    email: '',
  },
  // ステップ4: スキル
  skills: [
    { id: 1, name: '', experience: '', description: '', isConfirmed: false },
  ],
  // ステップ5: 職務経歴
  workHistories: [
    {
      id: 1,
      startPeriod: { year: '', month: '' },
      endPeriod: { year: '', month: '' },
      isCurrentJob: false,
      projectName: '',
      description: '',
      role: '',
      scale: '',
      languages: '',
      tools: '',
      isConfirmed: false,
    },
  ],
  // ステップ6: 自己PR
  selfPR: {
    selfPR: '',
  },
  // ステップ7: 作成日
  creationDate: {
    creationDate: { year: '', month: '', day: '' },
  },
};

/**
 * アクションタイプ
 */
const ActionTypes = {
  UPDATE_PROFILE: 'UPDATE_PROFILE',
  UPDATE_ADDRESS: 'UPDATE_ADDRESS',
  UPDATE_CONTACT: 'UPDATE_CONTACT',
  UPDATE_SKILLS: 'UPDATE_SKILLS',
  UPDATE_WORK_HISTORIES: 'UPDATE_WORK_HISTORIES',
  UPDATE_SELF_PR: 'UPDATE_SELF_PR',
  UPDATE_CREATION_DATE: 'UPDATE_CREATION_DATE',
  LOAD_DATA: 'LOAD_DATA',
  RESET_DATA: 'RESET_DATA',
};

/**
 * リデューサー
 */
function formReducer(state, action) {
  switch (action.type) {
    case ActionTypes.UPDATE_PROFILE:
      return { ...state, profile: { ...state.profile, ...action.payload } };
    case ActionTypes.UPDATE_ADDRESS:
      return { ...state, address: { ...state.address, ...action.payload } };
    case ActionTypes.UPDATE_CONTACT:
      return { ...state, contact: { ...state.contact, ...action.payload } };
    case ActionTypes.UPDATE_SKILLS:
      return { ...state, skills: action.payload };
    case ActionTypes.UPDATE_WORK_HISTORIES:
      return { ...state, workHistories: action.payload };
    case ActionTypes.UPDATE_SELF_PR:
      return { ...state, selfPR: { ...state.selfPR, ...action.payload } };
    case ActionTypes.UPDATE_CREATION_DATE:
      return { ...state, creationDate: { ...state.creationDate, ...action.payload } };
    case ActionTypes.LOAD_DATA:
      return { ...initialFormData, ...action.payload };
    case ActionTypes.RESET_DATA:
      return initialFormData;
    default:
      return state;
  }
}

/**
 * FormContext
 */
const FormContext = createContext(null);

/**
 * FormProvider
 */
export function FormProvider({ children }) {
  const [formData, dispatch] = useReducer(formReducer, initialFormData);

  const updateProfile = useCallback((data) => {
    dispatch({ type: ActionTypes.UPDATE_PROFILE, payload: data });
  }, []);

  const updateAddress = useCallback((data) => {
    dispatch({ type: ActionTypes.UPDATE_ADDRESS, payload: data });
  }, []);

  const updateContact = useCallback((data) => {
    dispatch({ type: ActionTypes.UPDATE_CONTACT, payload: data });
  }, []);

  const updateSkills = useCallback((skills) => {
    dispatch({ type: ActionTypes.UPDATE_SKILLS, payload: skills });
  }, []);

  const updateWorkHistories = useCallback((workHistories) => {
    dispatch({ type: ActionTypes.UPDATE_WORK_HISTORIES, payload: workHistories });
  }, []);

  const updateSelfPR = useCallback((data) => {
    dispatch({ type: ActionTypes.UPDATE_SELF_PR, payload: data });
  }, []);

  const updateCreationDate = useCallback((data) => {
    dispatch({ type: ActionTypes.UPDATE_CREATION_DATE, payload: data });
  }, []);

  const loadData = useCallback((data) => {
    dispatch({ type: ActionTypes.LOAD_DATA, payload: data });
  }, []);

  const resetData = useCallback(() => {
    dispatch({ type: ActionTypes.RESET_DATA });
  }, []);

  /**
   * データが入力されているかチェック
   */
  const hasData = useCallback(() => {
    const { profile, address, contact, skills, workHistories, selfPR } = formData;

    // プロフィール
    if (profile.lastName || profile.firstName || profile.lastNameKana || profile.firstNameKana) {
      return true;
    }
    // 住所
    if (address.postalCode || address.prefecture || address.city) {
      return true;
    }
    // 連絡先
    if (contact.phone || contact.email) {
      return true;
    }
    // スキル
    if (skills.some(skill => skill.name || skill.description)) {
      return true;
    }
    // 職務経歴
    if (workHistories.some(history => history.projectName || history.description)) {
      return true;
    }
    // 自己PR
    if (selfPR.selfPR) {
      return true;
    }

    return false;
  }, [formData]);

  /**
   * エクスポート用データを取得
   */
  const getExportData = useCallback(() => {
    return {
      ...formData,
      exportedAt: new Date().toISOString(),
      version: '1.0',
    };
  }, [formData]);

  const value = {
    formData,
    updateProfile,
    updateAddress,
    updateContact,
    updateSkills,
    updateWorkHistories,
    updateSelfPR,
    updateCreationDate,
    loadData,
    resetData,
    hasData,
    getExportData,
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}

/**
 * useFormContext hook
 */
export function useFormContext() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
}

export default FormContext;

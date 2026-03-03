import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from '../context/FormContext';
import { validateProfile } from '../utils/validation';
import TextInput from '../components/common/TextInput';
import TextArea from '../components/common/TextArea';
import DateInput from '../components/common/DateInput';
import RadioGroup from '../components/common/RadioGroup';
import StepIndicator from '../components/common/StepIndicator';
import ProgressBar from '../components/common/ProgressBar';
import StepNavigation from '../components/common/StepNavigation';
import './StepPage.css';

/**
 * 年齢を計算
 */
const calculateAge = (birthDate) => {
  if (!birthDate.year || !birthDate.month || !birthDate.day) return null;

  const today = new Date();
  const birth = new Date(
    parseInt(birthDate.year, 10),
    parseInt(birthDate.month, 10) - 1,
    parseInt(birthDate.day, 10)
  );

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};

/**
 * 性別の選択肢
 */
const genderOptions = [
  { value: 'male', label: '男性' },
  { value: 'female', label: '女性' },
  { value: 'other', label: 'その他' },
  { value: 'no_answer', label: '回答しない' },
];

/**
 * ステップ1 - プロフィール画面
 */
function ProfilePage() {
  const navigate = useNavigate();
  const { formData: contextData, updateProfile } = useFormContext();
  const [formData, setFormData] = useState(contextData.profile);
  const [errors, setErrors] = useState({});

  // コンテキストからデータを同期
  useEffect(() => {
    setFormData(contextData.profile);
  }, [contextData.profile]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    updateProfile(newFormData);
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const age = calculateAge(formData.birthDate);

  const handlePrev = () => {
    navigate('/');
  };

  const handleNext = () => {
    const result = validateProfile(formData);
    if (!result.isValid) {
      setErrors(result.errors);
      return;
    }
    navigate('/step/2');
  };

  const handlePreview = () => {
    navigate('/preview');
  };

  return (
    <div className="step-page">
      <StepIndicator currentStep={1} />
      <ProgressBar currentStep={1} />

      <div className="step-page-content">
        <h2 className="step-page-title">プロフィール</h2>

        <div className="form-section">
          <h3 className="form-section-title">氏名</h3>
          <div className="form-row">
            <TextInput
              label="姓"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="山田"
              required
              error={errors.lastName}
              className="form-field-half"
            />
            <TextInput
              label="名"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="太郎"
              required
              error={errors.firstName}
              className="form-field-half"
            />
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">ふりがな</h3>
          <div className="form-row">
            <TextInput
              label="セイ"
              name="lastNameKana"
              value={formData.lastNameKana}
              onChange={handleChange}
              placeholder="ヤマダ"
              required
              error={errors.lastNameKana}
              className="form-field-half"
            />
            <TextInput
              label="メイ"
              name="firstNameKana"
              value={formData.firstNameKana}
              onChange={handleChange}
              placeholder="タロウ"
              required
              error={errors.firstNameKana}
              className="form-field-half"
            />
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">生年月日</h3>
          <div className="form-row form-row--align-end">
            <DateInput
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              required
              error={errors.birthDate}
            />
            {age !== null && (
              <div className="age-display">
                <span className="age-label">年齢:</span>
                <span className="age-value">{age}歳</span>
              </div>
            )}
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">性別</h3>
          <RadioGroup
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            options={genderOptions}
            direction="horizontal"
          />
        </div>

        <div className="form-section">
          <h3 className="form-section-title">資格</h3>
          <TextArea
            name="qualifications"
            value={formData.qualifications}
            onChange={handleChange}
            placeholder="お持ちの資格を入力してください（例：基本情報技術者、TOEIC 800点）"
            rows={4}
          />
        </div>

        <div className="form-section">
          <h3 className="form-section-title">得意分野</h3>
          <TextInput
            name="specialties"
            value={formData.specialties}
            onChange={handleChange}
            placeholder="例：Webアプリケーション開発、データベース設計"
          />
        </div>
      </div>

      <StepNavigation
        currentStep={1}
        onPrev={handlePrev}
        onNext={handleNext}
        onPreview={handlePreview}
      />
    </div>
  );
}

export default ProfilePage;

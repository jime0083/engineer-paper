import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDays } from 'date-fns';
import { useFormContext } from '../context/FormContext';
import { validateCreationDate } from '../utils/validation';
import DateInput from '../components/common/DateInput';
import Button from '../components/common/Button';
import StepIndicator from '../components/common/StepIndicator';
import ProgressBar from '../components/common/ProgressBar';
import StepNavigation from '../components/common/StepNavigation';
import './StepPage.css';

/**
 * ステップ8 - 作成日画面
 */
function CreationDatePage() {
  const navigate = useNavigate();
  const { formData: contextData, updateCreationDate } = useFormContext();
  const [formData, setFormData] = useState(contextData.creationDate);
  const [errors, setErrors] = useState({});
  const [initialized, setInitialized] = useState(false);

  const setTodayDate = useCallback(() => {
    const today = new Date();
    const newFormData = {
      creationDate: {
        year: String(today.getFullYear()),
        month: String(today.getMonth() + 1).padStart(2, '0'),
        day: String(today.getDate()).padStart(2, '0'),
      },
    };
    setFormData(newFormData);
    updateCreationDate(newFormData);
  }, [updateCreationDate]);

  useEffect(() => {
    // 初回のみ、作成日が空の場合は今日の日付をセット
    if (!initialized) {
      const hasDate = contextData.creationDate.creationDate?.year;
      if (!hasDate) {
        setTodayDate();
      } else {
        setFormData(contextData.creationDate);
      }
      setInitialized(true);
    } else {
      setFormData(contextData.creationDate);
    }
  }, [contextData.creationDate, initialized, setTodayDate]);

  const setTomorrowDate = useCallback(() => {
    const tomorrow = addDays(new Date(), 1);
    const newFormData = {
      creationDate: {
        year: String(tomorrow.getFullYear()),
        month: String(tomorrow.getMonth() + 1).padStart(2, '0'),
        day: String(tomorrow.getDate()).padStart(2, '0'),
      },
    };
    setFormData(newFormData);
    updateCreationDate(newFormData);
  }, [updateCreationDate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    updateCreationDate(newFormData);
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handlePrev = () => {
    navigate('/step/7');
  };

  const handleNext = () => {
    const result = validateCreationDate(formData);
    if (!result.isValid) {
      setErrors(result.errors);
      return;
    }
    navigate('/step/9');
  };

  const handlePreview = () => {
    navigate('/preview');
  };

  const formatDisplayDate = () => {
    const { year, month, day } = formData.creationDate || {};
    if (year && month && day) {
      return `${year}年${month}月${day}日`;
    }
    return '';
  };

  return (
    <div className="step-page">
      <StepIndicator currentStep={8} />
      <ProgressBar currentStep={8} />

      <div className="step-page-content">
        <h2 className="step-page-title">作成日</h2>

        <div className="form-section">
          <p className="guide-text">
            スキルシートの作成日を入力してください。
            通常は提出日を入力します。
          </p>

          <div className="date-buttons">
            <Button variant="secondary" onClick={setTodayDate}>
              今日の日付を入力
            </Button>
            <Button variant="secondary" onClick={setTomorrowDate}>
              明日の日付を入力
            </Button>
          </div>

          <div className="date-input-wrapper">
            <DateInput
              label="作成日"
              name="creationDate"
              value={formData.creationDate || { year: '', month: '', day: '' }}
              onChange={handleChange}
              required
              error={errors.creationDate}
              endYear={new Date().getFullYear() + 1}
              startYear={new Date().getFullYear() - 1}
            />
          </div>

          {formatDisplayDate() && (
            <div className="selected-date-display">
              <span className="selected-date-label">選択した日付：</span>
              <span className="selected-date-value">{formatDisplayDate()}</span>
            </div>
          )}
        </div>
      </div>

      <StepNavigation
        currentStep={8}
        onPrev={handlePrev}
        onNext={handleNext}
        onPreview={handlePreview}
      />
    </div>
  );
}

export default CreationDatePage;

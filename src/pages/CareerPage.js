import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from '../context/FormContext';
import { validateCareers } from '../utils/validation';
import CareerCard from '../components/cards/CareerCard';
import { AddButton } from '../components/common/Button';
import Alert from '../components/common/Alert';
import StepIndicator from '../components/common/StepIndicator';
import ProgressBar from '../components/common/ProgressBar';
import StepNavigation from '../components/common/StepNavigation';
import './StepPage.css';

const MAX_CAREERS = 10;

/**
 * ステップ6 - 経歴画面
 */
function CareerPage() {
  const navigate = useNavigate();
  const { formData: contextData, updateCareers } = useFormContext();
  const [careers, setCareers] = useState(contextData.careers);
  const [errors, setErrors] = useState([]);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    setCareers(contextData.careers);
  }, [contextData.careers]);

  const handleAddCareer = () => {
    if (careers.length >= MAX_CAREERS) {
      alert(`経歴は最大${MAX_CAREERS}個までです`);
      return;
    }
    const newId = Math.max(...careers.map((c) => c.id), 0) + 1;
    const newCareers = [
      ...careers,
      {
        id: newId,
        startPeriod: { year: '', month: '' },
        endPeriod: { year: '', month: '' },
        company: '',
        isConfirmed: false,
      },
    ];
    setCareers(newCareers);
    updateCareers(newCareers);
  };

  const handleChangeCareer = (index, updatedCareer) => {
    const newCareers = [...careers];
    newCareers[index] = { ...newCareers[index], ...updatedCareer };
    setCareers(newCareers);
    updateCareers(newCareers);
    if (errors[index]) {
      const newErrors = [...errors];
      newErrors[index] = {};
      setErrors(newErrors);
    }
  };

  const handleDeleteCareer = (index) => {
    if (careers.length === 1) {
      alert('経歴は最低1つ必要です');
      return;
    }
    const newCareers = careers.filter((_, i) => i !== index);
    setCareers(newCareers);
    updateCareers(newCareers);
  };

  const handleConfirmCareer = (index) => {
    const newCareers = [...careers];
    newCareers[index].isConfirmed = true;
    setCareers(newCareers);
    updateCareers(newCareers);
  };

  const handlePrev = () => {
    navigate('/step/5');
  };

  const handleNext = () => {
    const result = validateCareers(careers);
    if (!result.isValid) {
      setErrors(result.errors);
      setShowError(true);
      return;
    }
    navigate('/step/7');
  };

  const handlePreview = () => {
    navigate('/preview');
  };

  const canAddMore = careers.length < MAX_CAREERS;

  return (
    <div className="step-page">
      <StepIndicator currentStep={6} />
      <ProgressBar currentStep={6} />

      <div className="step-page-content">
        <h2 className="step-page-title">経歴</h2>

        {showError && (
          <Alert
            type="error"
            message="入力内容にエラーがあります。各経歴の必須項目を確認してください。"
            onClose={() => setShowError(false)}
          />
        )}

        <div className="add-card-area">
          <AddButton onClick={handleAddCareer} disabled={!canAddMore} />
        </div>

        <div className="card-list">
          {careers.map((career, index) => (
            <CareerCard
              key={career.id}
              career={career}
              index={index}
              onChange={handleChangeCareer}
              onDelete={handleDeleteCareer}
              onConfirm={handleConfirmCareer}
              isConfirmed={career.isConfirmed}
              errors={errors[index]}
            />
          ))}
        </div>

        <p className="limit-notice">※ 経歴は最大{MAX_CAREERS}個まで登録できます</p>
      </div>

      <StepNavigation
        currentStep={6}
        onPrev={handlePrev}
        onNext={handleNext}
        onPreview={handlePreview}
      />
    </div>
  );
}

export default CareerPage;

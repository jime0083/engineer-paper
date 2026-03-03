import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from '../context/FormContext';
import { validateSummary } from '../utils/validation';
import TextArea from '../components/common/TextArea';
import StepIndicator from '../components/common/StepIndicator';
import ProgressBar from '../components/common/ProgressBar';
import StepNavigation from '../components/common/StepNavigation';
import './StepPage.css';

/**
 * ステップ4 - 職務要約画面
 */
function SummaryPage() {
  const navigate = useNavigate();
  const { formData: contextData, updateSummary } = useFormContext();
  const [formData, setFormData] = useState(contextData.summary);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData(contextData.summary);
  }, [contextData.summary]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    updateSummary(newFormData);
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handlePrev = () => {
    navigate('/step/3');
  };

  const handleNext = () => {
    const result = validateSummary(formData);
    if (!result.isValid) {
      setErrors(result.errors);
      return;
    }
    navigate('/step/5');
  };

  const handlePreview = () => {
    navigate('/preview');
  };

  return (
    <div className="step-page">
      <StepIndicator currentStep={4} />
      <ProgressBar currentStep={4} />

      <div className="step-page-content">
        <h2 className="step-page-title">職務要約</h2>

        <div className="form-section">
          <p className="guide-text">
            これまでの職務経験を簡潔にまとめてください。
            採用担当者が最初に読む部分ですので、あなたの強みや経験を端的に表現しましょう。
          </p>
          <TextArea
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            placeholder="例：Webアプリケーション開発において5年の実務経験があります。フロントエンドからバックエンドまで幅広く対応可能で、特にReactを使用したSPA開発を得意としています。"
            rows={6}
            maxLength={200}
            showCount
            error={errors.summary}
          />
        </div>
      </div>

      <StepNavigation
        currentStep={4}
        onPrev={handlePrev}
        onNext={handleNext}
        onPreview={handlePreview}
      />
    </div>
  );
}

export default SummaryPage;

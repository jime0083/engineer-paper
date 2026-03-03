import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from '../context/FormContext';
import { validateSelfPR } from '../utils/validation';
import TextArea from '../components/common/TextArea';
import StepIndicator from '../components/common/StepIndicator';
import ProgressBar from '../components/common/ProgressBar';
import StepNavigation from '../components/common/StepNavigation';
import './StepPage.css';

/**
 * ステップ7 - 自己PR画面
 */
function SelfPRPage() {
  const navigate = useNavigate();
  const { formData: contextData, updateSelfPR } = useFormContext();
  const [formData, setFormData] = useState(contextData.selfPR);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData(contextData.selfPR);
  }, [contextData.selfPR]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    updateSelfPR(newFormData);
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handlePrev = () => {
    navigate('/step/5');
  };

  const handleNext = () => {
    const result = validateSelfPR(formData);
    if (!result.isValid) {
      setErrors(result.errors);
      return;
    }
    navigate('/step/7');
  };

  const handlePreview = () => {
    navigate('/preview');
  };

  return (
    <div className="step-page">
      <StepIndicator currentStep={6} />
      <ProgressBar currentStep={6} />

      <div className="step-page-content">
        <h2 className="step-page-title">自己PR</h2>

        <div className="form-section">
          <p className="guide-text">
            あなたの強みや経験、仕事への姿勢などを自由にアピールしてください。
            具体的なエピソードを交えると説得力が増します。
          </p>
          <TextArea
            name="selfPR"
            value={formData.selfPR}
            onChange={handleChange}
            placeholder="例：私は「粘り強さ」が強みです。前職では難易度の高い機能実装を任された際、関連技術の調査から始め、プロトタイプを何度も作り直しながら最終的に期限内に完成させました。この経験から、困難な課題にも諦めずに取り組む姿勢を身につけました。"
            rows={6}
            maxLength={300}
            showCount
            error={errors.selfPR}
          />
        </div>
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

export default SelfPRPage;

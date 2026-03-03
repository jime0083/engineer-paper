import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from '../context/FormContext';
import { validateContact } from '../utils/validation';
import TextInput from '../components/common/TextInput';
import StepIndicator from '../components/common/StepIndicator';
import ProgressBar from '../components/common/ProgressBar';
import StepNavigation from '../components/common/StepNavigation';
import './StepPage.css';

/**
 * ステップ3 - 連絡先画面
 */
function ContactPage() {
  const navigate = useNavigate();
  const { formData: contextData, updateContact } = useFormContext();
  const [formData, setFormData] = useState(contextData.contact);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData(contextData.contact);
  }, [contextData.contact]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    updateContact(newFormData);
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhoneChange = (event) => {
    const value = event.target.value.replace(/[^0-9-]/g, '');
    const newFormData = { ...formData, phone: value };
    setFormData(newFormData);
    updateContact(newFormData);
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: '' }));
    }
  };

  const handlePrev = () => {
    navigate('/step/2');
  };

  const handleNext = () => {
    const result = validateContact(formData);
    if (!result.isValid) {
      setErrors(result.errors);
      return;
    }
    navigate('/step/4');
  };

  const handlePreview = () => {
    navigate('/preview');
  };

  return (
    <div className="step-page">
      <StepIndicator currentStep={3} />
      <ProgressBar currentStep={3} />

      <div className="step-page-content">
        <h2 className="step-page-title">連絡先</h2>

        <div className="form-section">
          <h3 className="form-section-title">電話番号</h3>
          <TextInput
            name="phone"
            value={formData.phone}
            onChange={handlePhoneChange}
            placeholder="090-1234-5678"
            required
            error={errors.phone}
          />
        </div>

        <div className="form-section">
          <h3 className="form-section-title">メールアドレス</h3>
          <TextInput
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@email.com"
            required
            error={errors.email}
          />
        </div>
      </div>

      <StepNavigation
        currentStep={3}
        onPrev={handlePrev}
        onNext={handleNext}
        onPreview={handlePreview}
      />
    </div>
  );
}

export default ContactPage;

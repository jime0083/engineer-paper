import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useFormContext } from '../context/FormContext';
import { validateAddress } from '../utils/validation';
import TextInput from '../components/common/TextInput';
import StepIndicator from '../components/common/StepIndicator';
import ProgressBar from '../components/common/ProgressBar';
import StepNavigation from '../components/common/StepNavigation';
import './StepPage.css';

/**
 * ステップ2 - 住所画面
 */
function AddressPage() {
  const navigate = useNavigate();
  const { formData: contextData, updateAddress } = useFormContext();
  const [formData, setFormData] = useState(contextData.address);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFormData(contextData.address);
  }, [contextData.address]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    updateAddress(newFormData);
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handlePostalCodeChange = async (event) => {
    const value = event.target.value.replace(/[^0-9-]/g, '');
    let newFormData = { ...formData, postalCode: value };
    setFormData(newFormData);
    updateAddress(newFormData);

    const cleanCode = value.replace(/-/g, '');
    if (cleanCode.length === 7) {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${cleanCode}`
        );
        if (response.data.results && response.data.results.length > 0) {
          const result = response.data.results[0];
          newFormData = {
            ...newFormData,
            prefecture: result.address1,
            city: result.address2 + result.address3,
          };
          setFormData(newFormData);
          updateAddress(newFormData);
        }
      } catch {
        // エラー時は何もしない
      }
      setIsLoading(false);
    }
  };

  const handlePrev = () => {
    navigate('/step/1');
  };

  const handleNext = () => {
    const result = validateAddress(formData);
    if (!result.isValid) {
      setErrors(result.errors);
      return;
    }
    navigate('/step/3');
  };

  const handlePreview = () => {
    navigate('/preview');
  };

  return (
    <div className="step-page">
      <StepIndicator currentStep={2} />
      <ProgressBar currentStep={2} />

      <div className="step-page-content">
        <h2 className="step-page-title">住所</h2>

        <div className="form-section">
          <h3 className="form-section-title">郵便番号</h3>
          <TextInput
            name="postalCode"
            value={formData.postalCode}
            onChange={handlePostalCodeChange}
            placeholder="123-4567"
            maxLength={8}
            error={errors.postalCode}
            className="form-field-postal"
          />
          {isLoading && (
            <span className="loading-text">住所を検索中...</span>
          )}
        </div>

        <div className="form-section">
          <h3 className="form-section-title">都道府県</h3>
          <TextInput
            name="prefecture"
            value={formData.prefecture}
            onChange={handleChange}
            placeholder="東京都"
            error={errors.prefecture}
          />
        </div>

        <div className="form-section">
          <h3 className="form-section-title">市区町村・番地</h3>
          <TextInput
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="渋谷区渋谷1-2-3"
            error={errors.city}
          />
        </div>

        <div className="form-section">
          <h3 className="form-section-title">建物名・部屋番号</h3>
          <TextInput
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="〇〇マンション 101号室"
          />
        </div>

        <div className="form-section">
          <h3 className="form-section-title">最寄駅</h3>
          <TextInput
            name="nearestStation"
            value={formData.nearestStation}
            onChange={handleChange}
            placeholder="例：JR渋谷駅"
            error={errors.nearestStation}
          />
        </div>
      </div>

      <StepNavigation
        currentStep={2}
        onPrev={handlePrev}
        onNext={handleNext}
        onPreview={handlePreview}
      />
    </div>
  );
}

export default AddressPage;

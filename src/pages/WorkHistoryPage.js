import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from '../context/FormContext';
import { validateWorkHistories } from '../utils/validation';
import WorkHistoryCard from '../components/cards/WorkHistoryCard';
import { AddButton } from '../components/common/Button';
import Alert from '../components/common/Alert';
import StepIndicator from '../components/common/StepIndicator';
import ProgressBar from '../components/common/ProgressBar';
import StepNavigation from '../components/common/StepNavigation';
import './StepPage.css';

/**
 * ステップ6 - 職務経歴画面
 */
function WorkHistoryPage() {
  const navigate = useNavigate();
  const { formData: contextData, updateWorkHistories } = useFormContext();
  const [workHistories, setWorkHistories] = useState(contextData.workHistories);
  const [errors, setErrors] = useState([]);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    setWorkHistories(contextData.workHistories);
  }, [contextData.workHistories]);

  const handleAddWorkHistory = () => {
    const newId = Math.max(...workHistories.map((w) => w.id), 0) + 1;
    const newHistories = [
      {
        id: newId,
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
      ...workHistories,
    ];
    setWorkHistories(newHistories);
    updateWorkHistories(newHistories);
  };

  const handleChangeWorkHistory = (index, updatedHistory) => {
    const newHistories = [...workHistories];
    newHistories[index] = { ...newHistories[index], ...updatedHistory };
    setWorkHistories(newHistories);
    updateWorkHistories(newHistories);
    if (errors[index]) {
      const newErrors = [...errors];
      newErrors[index] = {};
      setErrors(newErrors);
    }
  };

  const handleDeleteWorkHistory = (index) => {
    if (workHistories.length === 1) {
      alert('職務経歴は最低1つ必要です');
      return;
    }
    const newHistories = workHistories.filter((_, i) => i !== index);
    setWorkHistories(newHistories);
    updateWorkHistories(newHistories);
  };

  const handleConfirmWorkHistory = (index) => {
    const newHistories = [...workHistories];
    newHistories[index].isConfirmed = true;
    setWorkHistories(newHistories);
    updateWorkHistories(newHistories);
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const newHistories = [...workHistories];
    [newHistories[index - 1], newHistories[index]] = [newHistories[index], newHistories[index - 1]];
    setWorkHistories(newHistories);
    updateWorkHistories(newHistories);
  };

  const handleMoveDown = (index) => {
    if (index === workHistories.length - 1) return;
    const newHistories = [...workHistories];
    [newHistories[index], newHistories[index + 1]] = [newHistories[index + 1], newHistories[index]];
    setWorkHistories(newHistories);
    updateWorkHistories(newHistories);
  };

  const handlePrev = () => {
    navigate('/step/4');
  };

  const handleNext = () => {
    const result = validateWorkHistories(workHistories);
    if (!result.isValid) {
      setErrors(result.errors);
      setShowError(true);
      return;
    }
    navigate('/step/6');
  };

  const handlePreview = () => {
    navigate('/preview');
  };

  return (
    <div className="step-page">
      <StepIndicator currentStep={5} />
      <ProgressBar currentStep={5} />

      <div className="step-page-content">
        <h2 className="step-page-title">職務経歴</h2>

        {showError && (
          <Alert
            type="error"
            message="入力内容にエラーがあります。各職務経歴の必須項目を確認してください。"
            onClose={() => setShowError(false)}
          />
        )}

        <p className="guide-text">
          新しい経歴から順に入力してください。上部の「追加」ボタンで新しい経歴を追加できます。
        </p>

        <div className="add-card-area">
          <AddButton onClick={handleAddWorkHistory} />
        </div>

        <div className="card-list">
          {workHistories.map((history, index) => (
            <WorkHistoryCard
              key={history.id}
              workHistory={history}
              index={index}
              onChange={handleChangeWorkHistory}
              onDelete={handleDeleteWorkHistory}
              onConfirm={handleConfirmWorkHistory}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              isConfirmed={history.isConfirmed}
              isFirst={index === 0}
              isLast={index === workHistories.length - 1}
              errors={errors[index]}
            />
          ))}
        </div>
      </div>

      <StepNavigation
        currentStep={5}
        onPrev={handlePrev}
        onNext={handleNext}
        onPreview={handlePreview}
      />
    </div>
  );
}

export default WorkHistoryPage;

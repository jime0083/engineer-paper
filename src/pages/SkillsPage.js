import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from '../context/FormContext';
import { validateSkills } from '../utils/validation';
import SkillCard from '../components/cards/SkillCard';
import { AddButton } from '../components/common/Button';
import Alert from '../components/common/Alert';
import StepIndicator from '../components/common/StepIndicator';
import ProgressBar from '../components/common/ProgressBar';
import StepNavigation from '../components/common/StepNavigation';
import './StepPage.css';

/**
 * ステップ5 - スキル画面
 */
function SkillsPage() {
  const navigate = useNavigate();
  const { formData: contextData, updateSkills } = useFormContext();
  const [skills, setSkills] = useState(contextData.skills);
  const [errors, setErrors] = useState([]);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    setSkills(contextData.skills);
  }, [contextData.skills]);

  const handleAddSkill = () => {
    const newId = Math.max(...skills.map((s) => s.id), 0) + 1;
    const newSkills = [
      ...skills,
      { id: newId, name: '', experience: '', description: '', isConfirmed: false },
    ];
    setSkills(newSkills);
    updateSkills(newSkills);
  };

  const handleChangeSkill = (index, updatedSkill) => {
    const newSkills = [...skills];
    newSkills[index] = { ...newSkills[index], ...updatedSkill };
    setSkills(newSkills);
    updateSkills(newSkills);
    if (errors[index]) {
      const newErrors = [...errors];
      newErrors[index] = {};
      setErrors(newErrors);
    }
  };

  const handleDeleteSkill = (index) => {
    if (skills.length === 1) {
      alert('スキルは最低1つ必要です');
      return;
    }
    const newSkills = skills.filter((_, i) => i !== index);
    setSkills(newSkills);
    updateSkills(newSkills);
  };

  const handleConfirmSkill = (index) => {
    const newSkills = [...skills];
    newSkills[index].isConfirmed = true;
    setSkills(newSkills);
    updateSkills(newSkills);
  };

  const handlePrev = () => {
    navigate('/step/3');
  };

  const handleNext = () => {
    const result = validateSkills(skills);
    if (!result.isValid) {
      setErrors(result.errors);
      setShowError(true);
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
        <h2 className="step-page-title">スキル</h2>

        {showError && (
          <Alert
            type="error"
            message="入力内容にエラーがあります。各スキルの必須項目を確認してください。"
            onClose={() => setShowError(false)}
          />
        )}

        <div className="add-card-area">
          <AddButton onClick={handleAddSkill} />
        </div>

        <div className="card-list">
          {skills.map((skill, index) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              index={index}
              onChange={handleChangeSkill}
              onDelete={handleDeleteSkill}
              onConfirm={handleConfirmSkill}
              isConfirmed={skill.isConfirmed}
              errors={errors[index]}
            />
          ))}
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

export default SkillsPage;

import React, { useState } from 'react';
import './Accordion.css';

/**
 * アコーディオンコンポーネント
 * 展開/折りたたみ可能なコンテンツセクション
 */
function Accordion({
  title,
  children,
  defaultExpanded = false,
  disabled = false,
  className = '',
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleToggle = () => {
    if (!disabled) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className={`accordion ${isExpanded ? 'accordion--expanded' : ''} ${disabled ? 'accordion--disabled' : ''} ${className}`}>
      <button
        type="button"
        className="accordion-header"
        onClick={handleToggle}
        aria-expanded={isExpanded}
        disabled={disabled}
      >
        <span className="accordion-title">{title}</span>
        <span className="accordion-icon" aria-hidden="true">
          {isExpanded ? '▲' : '▼'}
        </span>
      </button>
      <div
        className="accordion-content"
        aria-hidden={!isExpanded}
      >
        <div className="accordion-body">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Accordion;

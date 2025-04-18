import React from 'react';
import { useChecker } from '../context/CheckerContext';
import './button.css'; // ✅ Import your CSS file here

const ContinueButton = ({ onClick, disabled }) => {
  const { nextTab } = useChecker();

  const handleClick = async () => {
    if (onClick) {
      await onClick();
    }
    nextTab();
  };

  return (
    <button 
      className="continue-button" 
      onClick={handleClick}
      disabled={disabled}
    >
      Continue
      <span className="arrow">→</span>
    </button>
  );
};

export default ContinueButton;

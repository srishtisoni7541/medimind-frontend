// PreviousButton.js
import React from 'react';
import { useChecker } from '../context/CheckerContext';
import './button.css';

const PreviousButton = () => {
  const { previousTab, currentTab } = useChecker();
  
  // Don't show on the first tab
  if (currentTab === 'info') return null;
  
  return (
    <button className="previous-button" onClick={previousTab}>
      Previous
    </button>
  );
};

export default PreviousButton;


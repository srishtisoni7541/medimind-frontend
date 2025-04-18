import React, { createContext, useState, useContext } from 'react';

const CheckerContext = createContext();

export const CheckerProvider = ({ children }) => {
  const [currentTab, setCurrentTab] = useState('info');
  const [userData, setUserData] = useState({
    age: '',
    sex: '',
    symptoms: '',
    conditions: [],
    selectedCondition: null,
    details: null,
    treatments: null
  });

  const updateUserData = (newData) => {
    setUserData(prev => ({ ...prev, ...newData }));
  };

  const nextTab = () => {
    const tabs = ['info', 'symptoms', 'conditions', 'details', 'treatment'];
    const currentIndex = tabs.indexOf(currentTab);
    if (currentIndex < tabs.length - 1) {
      setCurrentTab(tabs[currentIndex + 1]);
    }
  };

  const previousTab = () => {
    const tabs = ['info', 'symptoms', 'conditions', 'details', 'treatment'];
    const currentIndex = tabs.indexOf(currentTab);
    if (currentIndex > 0) {
      setCurrentTab(tabs[currentIndex - 1]);
    }
  };

  return (
    <CheckerContext.Provider value={{ 
      currentTab, 
      userData, 
      updateUserData, 
      nextTab, 
      previousTab 
    }}>
      {children}
    </CheckerContext.Provider>
  );
};

export const useChecker = () => useContext(CheckerContext);

export default CheckerContext;
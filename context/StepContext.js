import React, { createContext, useState, useContext } from 'react';

const StepContext = createContext();

export const useStepContext = () => useContext(StepContext);

export const StepProvider = ({ children }) => {
  const [steps, setSteps] = useState(0);
  const [stepCounts, setStepCounts] = useState([0, 0, 0, 0, 0, 0, 0]);

  const incrementSteps = () => {
    setSteps(prevSteps => prevSteps + 1);
    const currentDay = new Date().getDay();
    setStepCounts(prevCounts => {
      const newCounts = [...prevCounts];
      newCounts[currentDay] += 1;
      console.log('Updated stepCounts:', newCounts);
      return newCounts;
    });
  };

  const resetSteps = () => {
    setSteps(0);
    setStepCounts([0, 0, 0, 0, 0, 0, 0]);
  };

  return (
    <StepContext.Provider value={{ steps, stepCounts, incrementSteps, resetSteps }}>
      {children}
    </StepContext.Provider>
  );
};
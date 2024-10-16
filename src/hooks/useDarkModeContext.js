import React, {createContext, useContext} from 'react';
import {useDarkMode} from './useDarkMode';

const DarkModeContext = createContext();

export const DarkModeProvider = ({children}) => {
  const {isDark, handleDarkMode} = useDarkMode();

  return (
    <DarkModeContext.Provider value={{isDark, handleDarkMode}}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkModeContext = () => useContext(DarkModeContext);

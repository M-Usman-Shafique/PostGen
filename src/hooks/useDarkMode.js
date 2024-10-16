import {useState} from 'react';

export const useDarkMode = () => {
  const [isDark, setIsDark] = useState(false);

  const handleDarkMode = () => {
    setIsDark(prevMode => !prevMode);
  };

  return {isDark, handleDarkMode};
};

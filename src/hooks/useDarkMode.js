import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useDarkMode = () => {
  const [isDark, setIsDark] = useState(true);

  const saveDarkMode = async value => {
    try {
      await AsyncStorage.setItem('isDark', JSON.stringify(value));
    } catch (e) {
      console.log('Failed to save the dark mode state', e);
    }
  };

  const handleDarkMode = () => {
    setIsDark(prevMode => {
      const newMode = !prevMode;
      saveDarkMode(newMode);
      return newMode;
    });
  };

  const getDarkMode = async () => {
    try {
      const savedDarkMode = await AsyncStorage.getItem('isDark');
      if (savedDarkMode !== null) {
        setIsDark(JSON.parse(savedDarkMode));
      }
    } catch (e) {
      console.log('Failed to fetch the dark mode state', e);
    }
  };

  useEffect(() => {
    getDarkMode();
  }, []);

  return {isDark, handleDarkMode};
};

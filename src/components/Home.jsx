import {View, Text} from 'react-native';
import React from 'react';
import {useDarkModeContext} from '../hooks/useDarkModeContext';

export default function Home() {
  const {isDark} = useDarkModeContext();

  return (
    <View className={`flex-1 ${isDark ? 'bg-darkPrimary' : 'bg-primary'}`}>
      <Text>Home</Text>
    </View>
  );
}

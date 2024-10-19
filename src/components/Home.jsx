import {View, Text, ScrollView} from 'react-native';
import React from 'react';
import {useDarkModeContext} from '../hooks/useDarkModeContext';
import CreatePost from './CreatePost';
import ShowPosts from './ShowPosts';

export default function Home() {
  const {isDark} = useDarkModeContext();

  return (
    <ScrollView
      className={`flex-1 ${isDark ? 'bg-darkPrimary' : 'bg-primary'}`}>
      <CreatePost isDark={isDark} />
      <ShowPosts isDark={isDark} />
    </ScrollView>
  );
}

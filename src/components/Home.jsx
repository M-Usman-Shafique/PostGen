import {View} from 'react-native';
import React, {useState} from 'react';
import {useDarkModeContext} from '../hooks/useDarkModeContext';
import CreatePost from './CreatePost';
import ShowPosts from './ShowPosts';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const {isDark} = useDarkModeContext();

  const handleAddPost = newPost => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  return (
    <View className={`flex-1 ${isDark ? 'bg-darkPrimary' : 'bg-primary'}`}>
      <CreatePost isDark={isDark} onAddPost={handleAddPost} />
      <ShowPosts isDark={isDark} posts={posts} setPosts={setPosts} />
    </View>
  );
}

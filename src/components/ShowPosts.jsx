import React, {useEffect, useState} from 'react';
import {View, Text, Image, FlatList} from 'react-native';
import {getPosts} from '../services/firestore';
import Avatar from '../images/emoji.png';
import {multiFormatDate} from '../services/formatDate';

export default function ShowPosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts);
    };
    fetchPosts();
  }, []);

  const renderPostCard = ({item}) => {
    return (
      <View className="bg-white shadow-md rounded-lg p-4 mb-4 border border-gray-300">
        {/* User Avatar and Username */}
        <View className="flex-row items-center mb-4">
          <Image
            source={item.userAvatar ? {uri: item.userAvatar} : Avatar}
            className="w-12 h-12 rounded-full mr-4"
          />
          <View>
            <Text className="text-lg font-semibold text-secondary">
              {item.username || 'Anonymous'}
            </Text>
            <Text className="text-gray-500 text-xs">
              {multiFormatDate(item.createdAt)}
            </Text>
          </View>
        </View>

        {/* Post Title */}
        <Text className="text-xl font-bold text-secondary mb-2">
          {item.title}
        </Text>

        {/* Post Image */}
        {item.image && (
          <Image
            source={{uri: item.image}}
            className="w-full h-64 rounded-md mb-4"
            resizeMode="cover"
          />
        )}
      </View>
    );
  };

  return (
    <View className="mx-6 mt-6">
      {posts?.length > 0 ? (
        <FlatList
          data={posts}
          renderItem={renderPostCard}
          keyExtractor={item => item.id}
        />
      ) : (
        <Text className="text-center text-secondary">No posts available.</Text>
      )}
    </View>
  );
}

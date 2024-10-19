import React, {useEffect, useState} from 'react';
import {View, Text, Image, FlatList, Pressable, Alert} from 'react-native';
import {deletePost, getPosts} from '../services/firestore';
import Avatar from '../images/emoji.png';
import {multiFormatDate} from '../services/formatDate';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icony from 'react-native-vector-icons/FontAwesome6';
import Icono from 'react-native-vector-icons/Ionicons';
import {useDarkModeContext} from '../hooks/useDarkModeContext';
import auth from '@react-native-firebase/auth';
import EditPost from './EditPost';

export default function ShowPosts() {
  const [posts, setPosts] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const {isDark} = useDarkModeContext();
  const user = auth().currentUser;

  const dots = (
    <Icon
      name="dots-horizontal"
      size={30}
      color={isDark ? 'dimgray' : 'gray'}
    />
  );
  const edit = (
    <Icony
      name="pen-to-square"
      size={20}
      color={isDark ? '#877EFF' : '#1A202C'}
    />
  );
  const del = <Icono name="trash-outline" size={24} color="#C53030" />;

  const handleDropdownToggle = index => {
    setDropdownVisible(prev => (prev === index ? null : index));
  };

  const handleEdit = postId => {
    setEditingPostId(postId);
    setDropdownVisible(null);
  };

  const handleDelete = async postId => {
    setDropdownVisible(null);
    Alert.alert('Delete Post', 'Are you sure you want to delete this post?', [
      {
        text: 'Cancel',
        onPress: () => setDropdownVisible(null),
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            await deletePost(postId);
            setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
          } catch (error) {
            console.error('Error deleting post:', error);
          }
        },
      },
    ]);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts);
    };
    fetchPosts();
  }, []);

  const handleUpdate = () => {
    setEditingPostId(null);
    const fetchPosts = async () => {
      const updatedPosts = await getPosts();
      setPosts(updatedPosts);
    };
    fetchPosts();
  };

  const renderPostCard = ({item}) => {
    return (
      <View
        className={`shadow-2xl rounded-lg p-4 mb-4 ${
          isDark ? 'bg-darkAccent' : 'bg-gray-200'
        }`}>
        {/* Post Card */}
        <View className="flex-row justify-between mb-2 -z-10">
          <View className="flex-row">
            <Image
              source={item.userAvatar ? {uri: item.userAvatar} : Avatar}
              className="w-12 h-12 rounded-full mr-4"
            />
            <View>
              <Text
                className={`text-lg font-semibold ${
                  isDark ? 'text-gray-300' : 'text-secondary'
                }`}>
                {item.username || 'Anonymous'}
              </Text>
              <Text className="text-gray-500 text-xs">
                {multiFormatDate(item.createdAt.toDate())}
              </Text>
            </View>
          </View>
          {user?.uid === item.userId && editingPostId !== item.id && (
            <Pressable onPress={() => handleDropdownToggle(item.id)}>
              {dots}
            </Pressable>
          )}
        </View>

        {/* Dropdown Menu */}
        {dropdownVisible === item.id && (
          <View
            className={`absolute right-4 top-10 z-50 shadow-xl rounded-md border py-2 w-1/2 ${
              isDark
                ? 'bg-darkAccent border-gray-700'
                : 'border-gray-400 bg-gray-200'
            }`}>
            <Pressable
              onPress={() => handleEdit(item.id)}
              className={`flex-row items-center py-2 px-3 border-b ${
                isDark ? 'border-gray-700' : 'border-gray-400'
              }`}>
              {edit}
              <Text
                className={`px-2 text-lg ${
                  isDark ? 'text-darkSecondary' : 'text-gray-900'
                }`}>
                Edit
              </Text>
            </Pressable>
            <Pressable
              onPress={() => handleDelete(item.id)}
              className="flex-row items-center py-2 px-2">
              {del}
              <Text className={`px-1 text-lg text-red-700`}>Delete</Text>
            </Pressable>
          </View>
        )}

        {editingPostId === item.id ? (
          <EditPost
            postId={item.id}
            initialTitle={item.title}
            initialImage={item.image}
            onClose={() => setEditingPostId(null)}
            onUpdate={handleUpdate}
            isDark={isDark}
          />
        ) : (
          <>
            {/* Post Title */}
            <Text
              className={`text-lg mb-2 ${
                isDark ? 'text-white' : 'text-black'
              }`}>
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
          </>
        )}
      </View>
    );
  };

  return (
    <View className="flex-1 mx-6 mt-6">
      {posts?.length > 0 ? (
        <FlatList
          data={posts}
          renderItem={renderPostCard}
          keyExtractor={item => item.id}
        />
      ) : (
        <Text
          className={`text-center ${
            isDark ? 'text-gray-500' : 'text-secondary'
          }`}>
          No posts available.
        </Text>
      )}
    </View>
  );
}

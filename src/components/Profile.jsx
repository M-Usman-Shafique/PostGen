import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import auth from '@react-native-firebase/auth';
import Avatar from '../images/avatar.png';
import Iconi from 'react-native-vector-icons/FontAwesome6';
import Icony from 'react-native-vector-icons/MaterialIcons';
import {useNotifications} from 'react-native-notificated';
import {addPostData} from '../services/firestore';
import {useDarkModeContext} from '../hooks/useDarkModeContext';

export default function Profile() {
  const {isDark} = useDarkModeContext();
  const {notify} = useNotifications();
  const [user, setUser] = useState(null);
  const [postsCount, setPostsCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const currentUser = auth().currentUser;
    setUser(currentUser);
  }, []);

  const logout = (
    <Icony name="logout" size={24} color={isDark ? '#877EFF' : 'dimgray'} />
  );

  const edit = (
    <Iconi
      name="pen-to-square"
      size={20}
      color={isDark ? '#877EFF' : 'dimgray'}
    />
  );
  const editImg = <Iconi name="pencil" size={22} color="#384A60" />;

  //   const fetchUserData = async (userId) => {
  //     // Implement this function to fetch the user's post count, follower count, and following count
  //     // Here is just an example using placeholders
  //     setPostsCount(10); // Replace with actual data
  //     setFollowersCount(100); // Replace with actual data
  //     setFollowingCount(50); // Replace with actual data
  //   };

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    notify('success', {
      params: {
        title: isFollowing ? 'Unfollowed' : 'Followed',
        description: `You have ${
          isFollowing ? 'unfollowed' : 'followed'
        } this user.`,
      },
    });
  };

  const handleLogout = async () => {
    try {
      await auth().signOut();
      notify('success', {
        params: {
          title: 'Logout Successful',
          description: 'Hope to see you again.',
        },
      });
    } catch (error) {
      console.error('Error logging out: ', error);
    }
  };

  return (
    <View
      className={`flex-1 items-center p-6 pt-0 ${
        isDark ? 'bg-darkPrimary' : 'bg-primary'
      }`}>
      <View
        className={`h-32 w-full  shadow-lg ${
          isDark ? 'bg-darkSecondary' : 'bg-secondary'
        }`}
      />

      {user ? (
        <>
          <View
            className={`relative -mt-12 rounded-full p-1 ${
              isDark && 'border-2 border-gray-200'
            }`}>
            <Image source={Avatar} className={`w-28 h-28 rounded-full`} />
            <TouchableOpacity
              activeOpacity={0.6}
              className={`absolute bottom-0 right-2 bg-gray-300 rounded-full p-2`}>
              {editImg}
            </TouchableOpacity>
          </View>
          <Text
            className={`text-2xl font-bold mt-3 ${
              isDark ? 'text-darkSecondary' : 'text-secondary'
            }`}>
            {user.displayName || 'Username'}
          </Text>
          <Text
            className={`mb-5 text-lg ${
              isDark ? 'text-gray-500' : 'text-gray-500'
            }`}>
            {user.email}
          </Text>

          <View className={`flex-row justify-center gap-10 mb-5`}>
            <View className={`items-center`}>
              <Text
                className={`text-xl font-bold ${isDark && 'text-gray-300'}`}>
                {postsCount}
              </Text>
              <Text
                className={`text-lg ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                Posts
              </Text>
            </View>
            <View className={`items-center`}>
              <Text
                className={`text-xl font-bold ${isDark && 'text-gray-300'}`}>
                {followersCount}
              </Text>
              <Text
                className={`text-lg ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                Followers
              </Text>
            </View>
            <View className={`items-center`}>
              <Text
                className={`text-xl font-bold ${isDark && 'text-gray-300'}`}>
                {followingCount}
              </Text>
              <Text
                className={`text-lg ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                Following
              </Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            className={`py-2 px-7 my-[10px] rounded-lg ${
              isDark ? 'bg-darkSecondary' : 'bg-secondary'
            }`}
            onPress={handleFollowToggle}>
            <Text className={`text-lg font-semibold text-white`}>
              {isFollowing ? 'Unfollow' : 'Follow'}
            </Text>
          </TouchableOpacity>

          <View className={`flex-row justify-between w-full`}>
            <TouchableOpacity
              activeOpacity={0.7}
              className={`flex-row items-center p-3 mx-3 rounded-md border ${
                isDark ? 'bg-[#1F1F22]' : 'bg-zinc-300 border-gray-400'
              }`}
              onPress={handleLogout}>
              {logout}
              <Text
                className={`ml-1 text-lg font-semibold ${
                  isDark ? 'text-gray-300' : ''
                }`}>
                Logout
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              className={`flex-row items-center p-3 mx-3 rounded-md border ${
                isDark ? 'bg-[#1F1F22]' : 'bg-zinc-300 border-gray-400'
              }`}>
              {edit}
              <Text
                className={`ml-1 text-lg font-semibold ${
                  isDark ? 'text-gray-300' : ''
                }`}>
                Edit Profile
              </Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Text>No user is logged in.</Text>
      )}
    </View>
  );
}

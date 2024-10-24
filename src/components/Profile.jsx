// src/components/Profile.jsx
import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Avatar from '../images/avatar.png';
import Iconi from 'react-native-vector-icons/FontAwesome6';
import Icony from 'react-native-vector-icons/MaterialIcons';
import {useNotifications} from 'react-native-notificated';
import {useDarkModeContext} from '../hooks/useDarkModeContext';
import EditProfile from './EditProfile';

export default function Profile() {
  const {isDark} = useDarkModeContext();
  const {notify} = useNotifications();
  const [user, setUser] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    const currentUser = auth().currentUser;
    setUser(currentUser);
  }, []);

  const logout = (
    <Icony name="logout" size={24} color={isDark ? '#877EFF' : '#4B5563'} />
  );

  const edit = (
    <Iconi
      name="pen-to-square"
      size={20}
      color={isDark ? '#877EFF' : '#4B5563'}
    />
  );

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

  const handleSave = async updatedProfile => {
    try {
      const currentUser = auth().currentUser;

      if (currentUser) {
        // Update the displayName and photoURL in Firebase Auth
        await currentUser.updateProfile({
          displayName: updatedProfile.username,
          photoURL:
            updatedProfile.avatar === Avatar ? null : updatedProfile.avatar,
        });

        // Update the user document in Firestore
        await firestore()
          .collection('users')
          .doc(currentUser.uid)
          .update({
            displayName: updatedProfile.username,
            photoURL:
              updatedProfile.avatar === Avatar ? null : updatedProfile.avatar,
          });

        setUser({
          ...currentUser,
          displayName: updatedProfile.username,
          photoURL:
            updatedProfile.avatar === Avatar ? '' : updatedProfile.avatar,
        });

        setIsEdit(false);
      }
    } catch (error) {
      console.error('Error updating profile: ', error);
    }
  };

  return (
    <View
      className={`flex-1 items-center ${
        isDark ? 'bg-darkPrimary' : 'bg-primary'
      }`}>
      <View
        className={`profile-cover h-32 w-full  shadow-lg ${
          isDark ? 'bg-darkSecondary' : 'bg-secondary'
        }`}
      />
      {isEdit ? (
        <EditProfile
          isDark={isDark}
          user={user}
          onSave={handleSave}
          onCancel={() => setIsEdit(false)}
        />
      ) : (
        <>
          <View
            className={`relative -mt-14 rounded-full border-4 ${
              isDark ? 'border-darkPrimary' : 'border-gray-300'
            }`}>
            <Image
              source={user?.photoURL ? {uri: user.photoURL} : Avatar}
              className={`w-28 h-28 rounded-full`}
            />
          </View>
          <Text
            className={`text-2xl font-bold mt-3 ${
              isDark ? 'text-darkSecondary' : 'text-secondary'
            }`}>
            {user?.displayName || 'Username'}
          </Text>
          <Text
            className={`mb-5 text-lg ${
              isDark ? 'text-gray-500' : 'text-gray-600'
            }`}>
            {user?.email}
          </Text>
          <View className={`flex-row justify-center`}>
            <TouchableOpacity
              activeOpacity={0.7}
              className={`flex-row items-center p-3 mx-3 rounded-lg border ${
                isDark ? 'bg-[#1F1F22]' : 'border-gray-400'
              }`}
              onPress={handleLogout}>
              {logout}
              <Text
                className={`ml-1 text-lg font-semibold ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                Logout
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setIsEdit(true)}
              className={`flex-row items-center p-3 mx-3 rounded-lg border ${
                isDark ? 'bg-[#1F1F22]' : 'border-gray-400'
              }`}>
              {edit}
              <Text
                className={`ml-1 text-lg font-semibold ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                Edit Profile
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

import React, {useEffect, useState} from 'react';
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import {Image, Text, View} from 'react-native';
import {useDarkModeContext} from '../hooks/useDarkModeContext';
import auth from '@react-native-firebase/auth';
import Avatar from '../images/emoji.jpg';
import Icon from 'react-native-vector-icons/Ionicons';
import Icony from 'react-native-vector-icons/MaterialIcons';
import Icono from 'react-native-vector-icons/Feather';
import ToggleSwitch from 'toggle-switch-react-native';
import {useNotifications} from 'react-native-notificated';

export default function CustomDrawer(props) {
  const {notify} = useNotifications();
  const {isDark, handleDarkMode} = useDarkModeContext();
  const [user, setUser] = useState(null);

  const moon = (
    <Icon name="moon-outline" size={31} color={isDark ? '#877EFF' : 'black'} />
  );
  const sun = (
    <Icono name="sun" size={31} color={isDark ? '#877EFF' : '#1F2937'} />
  );
  const logout = (
    <Icony name="logout" size={33} color={isDark ? '#877EFF' : '#1F2937'} />
  );

  useEffect(() => {
    const currentUser = auth().currentUser;
    setUser(currentUser);
  }, []);

  const handleLogout = async () => {
    try {
      await auth().signOut();
      notify('success', {
        params: {
          title: 'Logout Successfull',
          description: 'Hope to see you again.',
        },
      });
    } catch (error) {
      console.error('Error logging out: ', error);
    }
  };

  return (
    <DrawerContentScrollView
      {...props}
      // contentContainerStyle={{
      //   backgroundColor: isDark ? 'gold' : '#D1D5DB',
      //   flex: 1,
      // }}
    >
      {user && (
        <View className="flex items-center p-4">
          {/* Display profile info (avatar, username & email) */}
          <Image source={Avatar} className="w-24 h-24 rounded-full" />
          <Text
            className={`text-2xl font-bold mt-3 ${
              isDark ? 'text-darkSecondary' : 'text-secondary'
            }`}>
            {user.displayName || 'Username'}
          </Text>
          <Text
            style={{
              color: isDark ? 'gray' : '#1F2937',
              fontSize: 16,
              marginBottom: 10,
            }}>
            {user.email}
          </Text>
        </View>
      )}

      {/* Display "Create New Post" from DrawerMenu*/}
      {/* <DrawerItemList {...props} /> */}

      {/* Display Current Mode */}
      <View className="flex-row items-center p-4">
        {isDark ? moon : sun}
        <Text
          className={`flex-1 text-2xl font-semibold ml-4 ${
            isDark ? 'text-darkSecondary' : 'text-secondary'
          }`}>
          {isDark ? 'Dark' : 'Light'}
        </Text>
        <ToggleSwitch
          isOn={isDark}
          onColor="#877EFF"
          offColor="#767577"
          thumbOnStyle={{backgroundColor: '#000000'}}
          size="medium"
          onToggle={handleDarkMode}
        />
      </View>
      <DrawerItem
        label="Logout"
        onPress={handleLogout}
        icon={() => logout}
        labelStyle={{
          color: isDark ? '#877EFF' : '#1F2937',
          fontSize: 23,
          fontWeight: 'bold',
          marginLeft: -18,
        }}
      />
    </DrawerContentScrollView>
  );
}

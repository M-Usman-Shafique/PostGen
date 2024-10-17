import React, {useEffect, useState} from 'react';
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import {Image, Switch, Text, View} from 'react-native';
import {useDarkModeContext} from '../hooks/useDarkModeContext';
import auth from '@react-native-firebase/auth';
import Avatar from '../images/avatar.jpg';
import Icon from 'react-native-vector-icons/Ionicons';
import Icony from 'react-native-vector-icons/MaterialIcons';
import Icono from 'react-native-vector-icons/Feather';
import ToggleSwitch from 'toggle-switch-react-native';

export default function CustomDrawer(props) {
  const {isDark, handleDarkMode} = useDarkModeContext();
  const [user, setUser] = useState(null);

  const moon = (
    <Icon name="moon" size={31} color={isDark ? '#877EFF' : 'black'} />
  );
  const sun = (
    <Icono name="sun" size={31} color={isDark ? '#877EFF' : '#1F2937'} />
  );
  const logout = (
    <Icony name="logout" size={34} color={isDark ? '#877EFF' : '#1F2937'} />
  );

  useEffect(() => {
    const currentUser = auth().currentUser;
    setUser(currentUser);
  }, []);

  const handleLogout = async () => {
    try {
      await auth().signOut();
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
          {/* Display user avatar user.photoURL */}
          <Image
            source={Avatar}
            style={{width: 80, height: 80, borderRadius: 40}}
          />
          {/* Display username and email */}
          <Text
            style={{
              color: isDark ? '#877EFF' : '#1F2937',
              fontSize: 20,
              fontWeight: 'bold',
              marginTop: 10,
            }}>
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

      <DrawerItemList {...props} />
      <View className="flex-row items-center p-4">
        {isDark ? moon : sun}
        <Text
          className={`flex-1 text-2xl ml-8 ${
            isDark ? 'text-darkSecondary' : 'text-secondary'
          }`}>
          {isDark ? 'Dark' : 'Light'}
        </Text>
        {/* <Switch
          value={isDark}
          onValueChange={handleDarkMode}
          trackColor={{false: '#767577', true: '#ccc'}}
          thumbColor={isDark ? '#877EFF' : '#f4f3f3'}
        /> */}
        <ToggleSwitch
          isOn={isDark}
          onColor="#f7f7f7"
          offColor="#767577"
          thumbOnStyle={{backgroundColor: '#877EFF'}}
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
          fontSize: 22,
        }}
      />
    </DrawerContentScrollView>
  );
}

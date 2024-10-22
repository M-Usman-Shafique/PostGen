import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
import {ActivityIndicator, StatusBar, View} from 'react-native';
import DrawerMenu from './src/screens/DrawerMenu';
import {useDarkModeContext} from './src/hooks/useDarkModeContext';
import Renderer from './src/components/Renderer';

const Stack = createNativeStackNavigator();

export default function App() {
  const {isDark} = useDarkModeContext();
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log('Setting up Firebase auth state change listener');

    const subscriber = auth().onAuthStateChanged(handleAuthStateChanged);

    const fallbackTimeout = setTimeout(() => {
      if (initializing) {
        console.log('Fallback: Setting initializing to false due to timeout');
        setInitializing(false);
      }
    }, 5000);

    return () => {
      console.log('Cleaning up Firebase auth state change listener');
      subscriber();
      clearTimeout(fallbackTimeout);
    };
  }, []);

  function handleAuthStateChanged(user) {
    console.log('Auth state changed:', user);
    setUser(user);
    if (initializing) {
      console.log('Setting initializing to false');
      setInitializing(false);
    }
  }

  if (initializing) {
    console.log('App is initializing, showing ActivityIndicator');
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  console.log('App initialized, rendering main components');

  return (
    <>
      <StatusBar
        backgroundColor={isDark ? 'black' : '#D1D5DB'}
        barStyle={isDark ? 'light-content' : 'dark-content'}
      />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Renderer">
          {user?.emailVerified ? (
            <Stack.Screen
              name="DrawerMenu"
              component={DrawerMenu}
              options={{headerShown: false}}
            />
          ) : (
            <Stack.Screen
              name="Renderer"
              component={Renderer}
              options={{headerShown: false}}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

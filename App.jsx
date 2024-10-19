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

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

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

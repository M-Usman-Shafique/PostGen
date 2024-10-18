import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Toggle from './src/components/Toggle';
import auth from '@react-native-firebase/auth';
import {ActivityIndicator, StatusBar, View} from 'react-native';
import DrawerMenu from './src/screens/DrawerMenu';
import {useDarkModeContext} from './src/hooks/useDarkModeContext';

const Stack = createNativeStackNavigator();

export default function App() {
  const {isDark} = useDarkModeContext();
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  // Handle user state changes
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
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
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
        <Stack.Navigator initialRouteName="Toggle">
          {user?.emailVerified ? (
            <Stack.Screen
              name="DrawerMenu"
              component={DrawerMenu}
              options={{headerShown: false}}
            />
          ) : (
            <Stack.Screen
              name="Toggle"
              component={Toggle}
              options={{headerShown: false}}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

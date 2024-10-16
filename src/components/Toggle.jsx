import {View, Text, Animated, Easing, Pressable, StatusBar} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import Login from './Login';
import Register from './Register';
import Icon from 'react-native-vector-icons/Feather';
import {useDarkModeContext} from '../hooks/useDarkModeContext';

export default function Toggle() {
  const [isLogin, setIsLogin] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const {isDark, handleDarkMode} = useDarkModeContext();

  const moon = (
    <Icon name="moon" size={40} color={isDark ? '#877EFF' : 'black'} />
  );
  const sun = (
    <Icon name="sun" size={40} color={isDark ? 'white' : '#1F2937'} />
  );

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isLogin ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
      easing: Easing.inOut(Easing.ease),
    }).start();
  }, [isLogin, slideAnim]);

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 125],
  });

  return (
    <>
      <StatusBar
        backgroundColor={isDark ? 'black' : '#D1D5DB'}
        barStyle={isDark ? 'light-content' : 'dark-content'}
      />
      <View
        className={`flex items-end justify-center ${
          isDark ? 'bg-darkPrimary' : 'bg-primary'
        }`}>
        <Pressable onPress={handleDarkMode} className={`p-3`}>
          {isDark ? moon : sun}
        </Pressable>
      </View>

      <View
        className={`flex-1 justify-center items-center ${
          isDark ? 'bg-darkPrimary' : 'bg-primary'
        }`}>
        {/* Form Section */}
        <Animated.View
          style={{
            height: 300,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {isLogin ? <Login isDark={isDark} /> : <Register isDark={isDark} />}
        </Animated.View>

        {/* Toggle Switch */}
        <View
          className={`relative flex-row mx-20 border-2 ${
            isDark ? 'border-[#312d63]' : 'border-secondary'
          } mt-32 rounded-full overflow-hidden`}>
          {/* Animated sliding background */}
          <Animated.View
            style={{
              width: '50%',
              height: '100%',
              backgroundColor: isDark ? '#877EFF' : '#1F2937',
              position: 'absolute',
              left: 0,
              transform: [{translateX}],
              borderRadius: 9999,
            }}
          />

          {/* Sign-up Button */}
          <Pressable
            className="flex-1 py-3 rounded-full"
            onPress={() => setIsLogin(false)}>
            <Text
              className={`text-center font-semibold text-lg ${
                !isLogin && isDark
                  ? 'text-black'
                  : isLogin
                  ? isDark
                    ? 'text-darkSecondary'
                    : 'text-secondary'
                  : 'text-white'
              }`}>
              Sign-up
            </Text>
          </Pressable>

          {/* Login Button */}
          <Pressable
            className="flex-1 py-3 rounded-full"
            onPress={() => setIsLogin(true)}>
            <Text
              className={`text-center font-semibold text-lg ${
                isLogin && isDark
                  ? 'text-black'
                  : isLogin
                  ? 'text-white'
                  : isDark
                  ? 'text-darkSecondary'
                  : 'text-secondary'
              }`}>
              Login
            </Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}

import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  Pressable,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import Register from './Register';
import Login from './Login';

export default function Toggle() {
  const [isLogin, setIsLogin] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current; // Animated value for sliding

  // Handle animation whenever isLogin changes
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isLogin ? 1 : 0, // Move to "Login" if true, otherwise "Sign-up"
      duration: 300,
      useNativeDriver: false, // Layout animation needs useNativeDriver to be false
      easing: Easing.inOut(Easing.ease),
    }).start();
  }, [isLogin, slideAnim]);

  // Interpolate the animated value to move between two positions
  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 130], // Adjust these values based on the width of the toggle container
  });

  return (
    <View className="flex-1 justify-center items-center bg-gray-100">
      {/* Form Section */}
      <Animated.View
        style={{
          height: 300, // Set a fixed height to prevent layout jerk
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {isLogin ? <Login /> : <Register />}
      </Animated.View>

      {/* Toggle Switch */}
      <View className="relative flex-row mx-20 border-2 border-gray-700 mt-40 rounded-full overflow-hidden">
        {/* Animated sliding background */}
        <Animated.View
          style={{
            width: '50%', // Fixed width of 50% for both Sign-up and Login
            height: '100%',
            backgroundColor: 'rgba(31, 41, 55, 1)', // bg-gray-800
            position: 'absolute',
            left: 0,
            transform: [{translateX}], // Move the background
            borderRadius: 9999, // Rounded corners
          }}
        />

        {/* Sign-up Button */}
        <Pressable
          className="flex-1 py-3 rounded-full"
          onPress={() => setIsLogin(false)}>
          <Text
            className={`text-center font-semibold text-lg ${
              !isLogin ? 'text-gray-200' : 'text-black'
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
              isLogin ? 'text-gray-200' : 'text-black'
            }`}>
            Login
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

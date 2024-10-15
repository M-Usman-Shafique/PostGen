import {View, Text, TextInput, TouchableOpacity, Alert} from 'react-native';
import React from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {loginUser} from '../services/auth';

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export default function Login({navigation}) {
  const handleLogin = async (values, {setSubmitting, resetForm}) => {
    const {email, password} = values;
    try {
      const {emailVerified} = await loginUser(email, password);
      if (emailVerified) {
        Alert.alert('Success', 'You are logged in');
        resetForm();
        setSubmitting(false);
      } else {
        Alert.alert('Error', 'Email is not verified');
        resetForm();
        setSubmitting(false);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
      resetForm();
      setSubmitting(false);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-100">
      <View className="p-8 rounded-lg shadow-lg w-96">
        <Text className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Login
        </Text>

        {/* Formik Form */}
        <Formik
          initialValues={{email: '', password: ''}}
          validationSchema={validationSchema}
          onSubmit={handleLogin}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            isSubmitting,
          }) => (
            <>
              {/* Email Input */}
              <TextInput
                placeholder="Email"
                className="border border-gray-300 p-4 w-full mb-4 rounded-lg focus:border-gray-700"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {touched.email && errors.email && (
                <Text className="text-red-500 text-sm">{errors.email}</Text>
              )}

              {/* Password Input */}
              <TextInput
                placeholder="Password"
                className="border border-gray-300 p-4 w-full mb-4 rounded-lg focus:border-gray-700"
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                secureTextEntry
              />
              {touched.password && errors.password && (
                <Text className="text-red-500 text-sm">{errors.password}</Text>
              )}

              {/* Login Button */}
              <TouchableOpacity
                className="bg-gray-800 p-4 rounded-lg"
                onPress={handleSubmit}
                disabled={isSubmitting}>
                <Text className="text-white text-center font-semibold text-lg">
                  Login
                </Text>
              </TouchableOpacity>

              {/* Stack Toggle */}
              <View className="flex-row border-2 border-gray-700 mt-12 rounded-full">
                <TouchableOpacity
                  className="flex-1 py-3"
                  onPress={() => navigation.navigate('Register')}>
                  <Text className="text-lg font-semibold text-center text-gray-800">
                    Sign-up
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 bg-gray-800 py-3 rounded-full"
                  onPress={() => navigation.navigate('Login')}>
                  <Text className="text-lg font-semibold text-center text-gray-200">
                    Login
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Formik>
      </View>
    </View>
  );
}

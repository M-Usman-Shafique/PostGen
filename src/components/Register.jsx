import {View, Text, TextInput, TouchableOpacity, Alert} from 'react-native';
import React from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {registerUser} from '../services/auth';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

export default function Register({navigation}) {
  const handleRegister = async (values, {setSubmitting, resetForm}) => {
    const {email, password} = values;
    try {
      await registerUser(email, password);
      Alert.alert(
        'Success',
        'A Verification Email has been sent to your email address',
      );
      resetForm();
      setSubmitting(false);
    } catch (error) {
      Alert.alert('Error registering user: ', error.message);
      setSubmitting(false);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-100">
      <View className="p-8 rounded-lg shadow-lg w-96">
        <Text className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Create Account
        </Text>

        {/* Formik Form */}
        <Formik
          initialValues={{email: '', password: '', confirmPassword: ''}}
          validationSchema={validationSchema}
          onSubmit={handleRegister}>
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
                className="border border-gray-300 p-4 w-full mb-4 rounded-lg focus:border-gray-700"
                placeholder="Email"
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
                className="border border-gray-300 p-4 w-full mb-4 rounded-lg focus:border-gray-700"
                placeholder="Password"
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                secureTextEntry
              />
              {touched.password && errors.password && (
                <Text className="text-red-500 text-sm">{errors.password}</Text>
              )}

              {/* Confirm Password Input */}
              <TextInput
                className="border border-gray-300 p-4 w-full mb-4 rounded-lg focus:border-gray-700"
                placeholder="Confirm Password"
                value={values.confirmPassword}
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                secureTextEntry
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <Text className="text-red-500 text-sm">
                  {errors.confirmPassword}
                </Text>
              )}

              {/* Register Button */}
              <TouchableOpacity
                className="bg-gray-800 p-4 rounded-lg"
                onPress={handleSubmit}
                disabled={isSubmitting}>
                <Text className="text-white text-center font-semibold text-lg">
                  Sign-up
                </Text>
              </TouchableOpacity>

              {/* Stack Toggle */}
              <View className="flex-row border-2 border-gray-700 mt-12 rounded-full">
                <TouchableOpacity
                  className="flex-1 bg-gray-800 py-3 rounded-full"
                  onPress={() => navigation.navigate('Login')}
                  disabled={isSubmitting}>
                  <Text className="text-gray-200 text-center font-semibold text-lg">
                    Sign-up
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-1 py-3"
                  onPress={() => navigation.navigate('Login')}>
                  <Text className="text-lg font-semibold text-center">
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

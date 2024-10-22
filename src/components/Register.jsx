import {View, Text, TextInput, TouchableOpacity, Keyboard} from 'react-native';
import React from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {registerUser} from '../services/auth';
import {useNotifications} from 'react-native-notificated';

const validationSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
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

export default function Register({isDark}) {
  const {notify} = useNotifications();

  const handleRegister = async (values, {setSubmitting, resetForm}) => {
    Keyboard.dismiss();
    const {email, password, username} = values;
    try {
      await registerUser(email, password, username);
      notify('success', {
        params: {
          title: 'Success:',
          description:
            'A verification email has been sent to your email address.',
        },
      });
      resetForm();
      setSubmitting(false);
    } catch (error) {
      notify('error', {
        params: {
          title: 'Error:',
          description: `${error.message}`,
        },
      });
      setSubmitting(false);
    }
  };

  return (
    <View className="">
      <View className="p-8 rounded-lg shadow-lg w-96">
        <Text
          className={`text-3xl font-bold mb-8 text-center ${
            isDark ? 'text-darkSecondary' : 'text-secondary'
          }`}>
          Create Account
        </Text>

        {/* Formik Form */}
        <Formik
          initialValues={{
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
          }}
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
              {/* Username Input */}
              <TextInput
                className={`p-4 mb-4 w-full rounded-lg text-lg ${
                  isDark
                    ? 'border-none focus:border-none bg-darkAccent text-white'
                    : 'border border-gray-600 focus:border-gray-700 text-darkPrimary'
                }`}
                placeholderTextColor={isDark ? '#718096' : '#4B5563'}
                placeholder="Username"
                value={values.username}
                onChangeText={handleChange('username')}
                onBlur={handleBlur('username')}
              />
              {touched.username && errors.username && (
                <Text
                  className={`mb-4 -mt-4 text-sm ${
                    isDark ? 'text-red-500' : 'text-red-600'
                  }`}>
                  {errors.username}
                </Text>
              )}
              {/* Email Input */}
              <TextInput
                className={`p-4 mb-4 w-full rounded-lg text-lg ${
                  isDark
                    ? 'border-none focus:border-none bg-darkAccent text-white'
                    : 'border border-gray-600 focus:border-gray-700 text-darkPrimary'
                }`}
                placeholderTextColor={isDark ? '#718096' : '#4B5563'}
                placeholder="Email"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {touched.email && errors.email && (
                <Text
                  className={`mb-4 -mt-4 text-sm ${
                    isDark ? 'text-red-500' : 'text-red-600'
                  }`}>
                  {errors.email}
                </Text>
              )}

              {/* Password Input */}
              <TextInput
                className={`p-4 mb-4 w-full rounded-lg text-lg ${
                  isDark
                    ? 'border-none focus:border-none bg-darkAccent text-white'
                    : 'border border-gray-600 focus:border-gray-700 text-darkPrimary'
                }`}
                placeholderTextColor={isDark ? '#718096' : '#4B5563'}
                placeholder="Password"
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                secureTextEntry
              />
              {touched.password && errors.password && (
                <Text
                  className={`mb-4 -mt-4 text-sm ${
                    isDark ? 'text-red-500' : 'text-red-600'
                  }`}>
                  {errors.password}
                </Text>
              )}

              {/* Confirm Password Input */}
              <TextInput
                className={`p-4 mb-4 w-full rounded-lg text-lg ${
                  isDark
                    ? 'border-none focus:border-none bg-darkAccent text-white'
                    : 'border border-gray-600 focus:border-gray-700 text-darkPrimary'
                }`}
                placeholderTextColor={isDark ? '#718096' : '#4B5563'}
                placeholder="Confirm Password"
                value={values.confirmPassword}
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                secureTextEntry
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <Text
                  className={`mb-4 -mt-4 text-sm ${
                    isDark ? 'text-red-500' : 'text-red-600'
                  }`}>
                  {errors.confirmPassword}
                </Text>
              )}

              {/* Register Button */}
              <TouchableOpacity
                activeOpacity={0.7}
                className={`${
                  isDark ? 'bg-darkSecondary' : 'bg-secondary'
                } p-4 rounded-lg`}
                onPress={handleSubmit}
                disabled={isSubmitting}>
                <Text
                  className={`text-center font-semibold text-lg ${
                    isDark ? 'text-black' : 'text-white'
                  }`}>
                  Sign-up
                </Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </View>
    </View>
  );
}

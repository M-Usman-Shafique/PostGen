import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import React from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {loginUser} from '../services/auth';
import {useNotifications} from 'react-native-notificated';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export default function Login({isDark, navigation}) {
  const {notify} = useNotifications();

  const handleLogin = async (values, {setSubmitting, resetForm}) => {
    const {email, password} = values;
    try {
      const {emailVerified} = await loginUser(email, password);
      if (emailVerified) {
        notify('success', {
          params: {
            title: 'Welcome!',
            description: 'You are successfully logged in.',
          },
        });
        resetForm();
        setSubmitting(false);
        navigation.navigate('DrawerMenu', {screen: 'Home'});
      } else {
        notify('error', {
          params: {
            title: 'Login failed.',
            description: 'Email is not verified.',
          },
        });
        resetForm();
        setSubmitting(false);
      }
    } catch (error) {
      notify('error', {
        params: {
          title: 'Login failed.',
          description: `${error.message}`,
        },
      });
      resetForm();
      setSubmitting(false);
    }
  };

  return (
    <View className="">
      <View className="p-8 rounded-lg shadow-lg w-96">
        <Text
          className={`text-3xl font-bold ${
            isDark ? 'text-darkSecondary' : 'text-secondary'
          } mb-8 text-center`}>
          Login
        </Text>
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
                className={`p-4 w-full mb-4 rounded-lg text-lg ${
                  isDark
                    ? 'border-none focus:border-none bg-darkAccent text-white'
                    : 'border border-gray-600 focus:border-gray-500 text-darkPrimary'
                }`}
                placeholderTextColor={isDark ? '#718096' : '#4B5563'}
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
                className={`p-4 w-full mb-4 rounded-lg text-lg ${
                  isDark
                    ? 'border-none focus:border-none bg-darkAccent text-white'
                    : 'border border-gray-600 focus:border-gray-500 text-darkPrimary'
                }`}
                placeholderTextColor={isDark ? '#718096' : '#4B5563'}
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
                className={`${
                  isDark ? 'bg-darkSecondary' : 'bg-secondary'
                } p-4 rounded-lg`}
                onPress={handleSubmit}
                disabled={isSubmitting}>
                <Text
                  className={`text-center font-semibold text-lg ${
                    isDark ? 'text-black' : 'text-white'
                  }`}>
                  Login
                </Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </View>
    </View>
  );
}

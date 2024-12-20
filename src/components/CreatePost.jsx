// src/components/CreatePost.jsx
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Pressable,
  ScrollView,
} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import {addPostData} from '../services/firestore';
import auth from '@react-native-firebase/auth';
import {useNotifications} from 'react-native-notificated';
import Avatar from '../images/avatar.png';

const PostSchema = Yup.object().shape({
  title: Yup.string(),
  image: Yup.string(),
});

export default function CreatePost({isDark}) {
  const {notify} = useNotifications();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const inputRef = useRef(null);
  const user = auth().currentUser;

  const upload = <Icon name="images" size={42} color="gray" />;
  const camera = <Icon name="camera" size={45} color="gray" />;

  const handleCameraLaunch = setFieldValue => {
    const options = {
      mediaType: 'photo',
    };
    launchCamera(options, response => {
      if (!response.didCancel && !response.error) {
        const imageUri = response.uri || response.assets?.[0]?.uri;
        setSelectedImage(imageUri);
        setFieldValue('image', imageUri);
      }
    });
  };

  const openImagePicker = async setFieldValue => {
    const options = {
      mediaType: 'photo',
    };
    launchImageLibrary(options, response => {
      if (!response.didCancel && !response.error) {
        const imageUri = response.uri || response.assets?.[0]?.uri;
        setSelectedImage(imageUri);
        setFieldValue('image', imageUri);
      }
    });
  };

  const handlePostSubmit = async (values, {resetForm}) => {
    const trimmedTitle = values.title.trim();

    if (!trimmedTitle && !values.image) {
      inputRef.current.focus();
      return;
    }

    if (user) {
      const postData = {
        userId: user.uid,
        title: trimmedTitle,
        image: values.image,
        createdAt: new Date(),
      };

      try {
        const postAdded = await addPostData(postData);
        if (postAdded) {
          notify('success', {
            params: {
              title: 'Success:',
              description: 'A new post has been created.',
            },
          });
        }
        resetForm();
        setSelectedImage(null);
      } catch (error) {
        notify('error', {
          params: {
            title: 'Error:',
            description: `${error}`,
          },
        });
        console.error('Error adding post:', error);
      }
    } else {
      console.error('User is not authenticated');
    }
  };

  return (
    <Formik
      initialValues={{title: '', image: ''}}
      validationSchema={PostSchema}
      onSubmit={handlePostSubmit}>
      {({handleChange, handleSubmit, setFieldValue, values}) => (
        <View className={`mx-6 mt-3 ${isTitleFocused ? 'mb-4' : 'mb-0'}`}>
          <View className="flex-row gap-2 items-center mb-2">
            <Image
              source={user?.photoURL ? {uri: user.photoURL} : Avatar}
              className="w-14 h-14 rounded-full"
            />
            {/* Title Input */}
            <TextInput
              value={values.title}
              onFocus={() => setIsTitleFocused(true)}
              onBlur={() => setIsTitleFocused(false)}
              onChangeText={handleChange('title')}
              placeholder="What's on your mind?"
              placeholderTextColor={isDark ? '#6B7280' : '#6B7280'}
              className={`flex-1 text-lg pl-4 pb-5 pt-2 border ${
                isDark
                  ? 'rounded-lg border-none bg-darkAccent text-gray-200'
                  : 'rounded-lg border-gray-400 text-gray-950'
              }`}
              ref={inputRef}
            />
          </View>

          {isTitleFocused && (
            <>
              {/* Camera and Image Picker */}
              <View className={`flex-row gap-2`}>
                <Pressable
                  onPress={() => handleCameraLaunch(setFieldValue)}
                  className={`flex-1 justify-center items-center p-4 rounded-md mb-2 h-32 ${
                    isDark && 'bg-darkAccent'
                  }`}>
                  {camera}
                  <Text
                    className={`-mb-1 mt-2 text-base ${
                      isDark && 'text-gray-500'
                    }`}>
                    Take a photo
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => openImagePicker(setFieldValue)}
                  className={`flex-1 justify-center items-center p-4 rounded-md h-32 ${
                    isDark && 'bg-darkAccent'
                  }`}>
                  {upload}
                  <Text
                    className={`-mb-2 mt-2 text-base ${
                      isDark && 'text-gray-500'
                    }`}>
                    Select a photo
                  </Text>
                </Pressable>
              </View>
              {/* Image Preview */}
              {selectedImage && (
                <Image
                  source={{uri: selectedImage}}
                  className="w-full h-40 mb-4 rounded-md"
                />
              )}

              <View className="flex-row gap-2">
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setIsTitleFocused(false)}
                  className={`flex-1 p-2 rounded-md ${
                    isDark ? 'bg-gray-300' : 'bg-gray-500'
                  }`}>
                  <Text
                    className={`text-center text-base ${
                      isDark ? 'text-black' : 'text-white'
                    }`}>
                    Discard
                  </Text>
                </TouchableOpacity>

                {/* Create Post Button */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleSubmit}
                  className={`flex-1 p-2 rounded-md ${
                    isDark ? 'bg-darkSecondary' : 'bg-secondary'
                  }`}>
                  <Text className="text-white text-center text-base">
                    Create Post
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      )}
    </Formik>
  );
}

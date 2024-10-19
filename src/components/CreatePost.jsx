import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Pressable,
} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import {addPostData} from '../services/firestore';
import auth from '@react-native-firebase/auth';

const PostSchema = Yup.object().shape({
  title: Yup.string(),
  image: Yup.string(),
});

export default function CreatePost({isDark}) {
  const [selectedImage, setSelectedImage] = useState(null);
  const inputRef = useRef(null);
  const user = auth().currentUser;

  const upload = <Icon name="images" size={42} color="gray" />;
  const camera = <Icon name="camera" size={45} color="gray" />;

  // Function to launch camera
  const handleCameraLaunch = setFieldValue => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };
    launchCamera(options, response => {
      if (!response.didCancel && !response.error) {
        const imageUri = response.uri || response.assets?.[0]?.uri;
        setSelectedImage(imageUri);
        setFieldValue('image', imageUri);
      }
    });
  };

  // Function to open image picker
  const openImagePicker = setFieldValue => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };
    launchImageLibrary(options, response => {
      if (!response.didCancel && !response.error) {
        const imageUri = response.uri || response.assets?.[0]?.uri;
        setSelectedImage(imageUri);
        setFieldValue('image', imageUri);
      }
    });
  };

  // Function to submit post data
  const handlePostSubmit = async (values, {resetForm}) => {
    const trimmedTitle = values.title.trim();

    if (!trimmedTitle && !values.image) {
      inputRef.current.focus();
      return;
    }

    if (user) {
      const postData = {
        userId: user.uid,
        username: user.displayName || 'Anonymous',
        title: trimmedTitle,
        image: values.image,
        createdAt: new Date(),
      };

      try {
        await addPostData(postData);
        resetForm();
        setSelectedImage(null);
      } catch (error) {
        console.error('Error adding post:', error);
      }
    } else {
      console.error('No user is authenticated');
    }
  };

  return (
    <Formik
      initialValues={{title: '', image: ''}}
      validationSchema={PostSchema}
      onSubmit={handlePostSubmit}>
      {({handleChange, handleSubmit, setFieldValue, values}) => (
        <View className="mx-6 mt-4">
          {/* Title Input */}
          <TextInput
            value={values.title}
            className={`rounded-md text-lg p-4 mb-2 border ${
              isDark
                ? 'border-none bg-darkAccent text-gray-200'
                : 'border-secondary text-gray-950'
            }`}
            placeholderTextColor={isDark ? '#718096' : '#4B5563'}
            placeholder="What's on your mind?"
            onChangeText={handleChange('title')}
            ref={inputRef}
          />

          {/* Camera and Image Picker Buttons */}
          <View className={`flex-row gap-2`}>
            <Pressable
              onPress={() => handleCameraLaunch(setFieldValue)}
              className={`flex-1 justify-center items-center p-4 rounded-md mb-2 h-32 ${
                isDark && 'bg-darkAccent'
              }`}>
              {camera}
              <Text
                className={`-mb-1 mt-2 text-base ${isDark && 'text-gray-500'}`}>
                Take a snapshot
              </Text>
            </Pressable>
            <Pressable
              onPress={() => openImagePicker(setFieldValue)}
              className={`flex-1 justify-center items-center p-4 rounded-md h-32 ${
                isDark && 'bg-darkAccent'
              }`}>
              {upload}
              <Text
                className={`-mb-2 mt-2 text-base ${isDark && 'text-gray-500'}`}>
                Select an image
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

          {/* Create Post Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            className={`p-3 rounded-md ${
              isDark ? 'bg-darkSecondary' : 'bg-secondary'
            }`}>
            <Text className="text-white text-center text-base">
              Create Post
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
}

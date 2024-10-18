import React, {useState} from 'react';
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

export default function CreatePost() {
  const [selectedImage, setSelectedImage] = useState(null);

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
  const handlePostSubmit = async values => {
    const user = auth().currentUser;

    if (user) {
      const postData = {
        userId: user.uid,
        username: user.displayName || 'Anonymous',
        title: values.title,
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
      {({handleChange, handleSubmit, setFieldValue}) => (
        <View className="mx-6 mt-6">
          <Text className="text-3xl font-bold text-secondary text-center mb-4">
            Create New Post
          </Text>

          {/* Title Input */}
          <TextInput
            className="border border-secondary rounded-md text-lg p-4 mb-2 text-secondary"
            placeholder="What's on your mind?"
            onChangeText={handleChange('title')}
            style={{color: '#1F2937'}}
          />

          {/* Camera and Image Picker Buttons */}
          <View className="flex-row gap-4">
            <Pressable
              onPress={() => handleCameraLaunch(setFieldValue)}
              className="flex-1 justify-center items-center p-4 rounded-md mb-2 h-32">
              {camera}
              <Text className="text-base">Take a snapshot</Text>
            </Pressable>
            <Pressable
              onPress={() => openImagePicker(setFieldValue)}
              className="flex-1 justify-center items-center p-4 rounded-md mb-2 h-32">
              {upload}
              <Text className="text-base">Select an image</Text>
            </Pressable>
          </View>
          {selectedImage && (
            <Image
              source={{uri: selectedImage}}
              className="w-full h-40 mb-4 rounded-md"
            />
          )}

          {/* Create Post Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-secondary p-4 rounded-md">
            <Text className="text-white text-center">Create Post</Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
}

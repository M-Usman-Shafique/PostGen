import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import {updatePost} from '../services/firestore';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNotifications} from 'react-native-notificated';

export default function EditPost({
  postId,
  initialTitle,
  initialImage,
  onClose,
  onUpdate,
  isDark,
}) {
  const {notify} = useNotifications();
  const [title, setTitle] = useState(initialTitle);
  const [selectedImage, setSelectedImage] = useState(initialImage);
  const titleInputRef = useRef(null);

  const upload = <Icon name="images" size={42} color="gray" />;
  const camera = <Icon name="camera" size={45} color="gray" />;

  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, []);

  const handleCameraLaunch = () => {
    const options = {
      mediaType: 'photo',
    };
    launchCamera(options, response => {
      if (!response.didCancel && !response.error) {
        const imageUri = response.uri || response.assets?.[0]?.uri;
        setSelectedImage(imageUri);
      }
    });
  };

  const openImagePicker = () => {
    const options = {
      mediaType: 'photo',
    };
    launchImageLibrary(options, response => {
      if (!response.didCancel && !response.error) {
        const imageUri = response.uri || response.assets?.[0]?.uri;
        setSelectedImage(imageUri);
      }
    });
  };

  const handleRemovePreview = () => {
    setSelectedImage(null);
  };

  const handleUpdate = async () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle && !selectedImage) {
      return;
    }

    const updatedData = {title: trimmedTitle, image: selectedImage};
    try {
      const result = await updatePost(postId, updatedData);
      onUpdate();
      if (result.success) {
        notify('success', {
          params: {
            title: 'Success:',
            description: 'A post has been updated.',
          },
        });
      }
    } catch (error) {
      notify('error', {
        params: {
          title: 'Error:',
          description: `${error}`,
        },
      });
      console.error('Error updating post:', error);
    }
  };

  return (
    <>
      {/* Title Input */}
      <TextInput
        className={`text-lg p-3 mb-3 border rounded-lg ${
          isDark ? 'text-white border-gray-700' : 'text-black border-gray-400'
        }`}
        value={title}
        onChangeText={setTitle}
        placeholder="What's on your mind?"
        placeholderTextColor={isDark ? '#718096' : '#4B5563'}
        ref={titleInputRef}
      />

      {/* Editable Image Preview */}
      {selectedImage && (
        <View className="relative w-full h-64 mb-4">
          <Image
            source={{uri: selectedImage}}
            className="w-full h-full rounded-md"
            resizeMode="cover"
          />
          <Pressable
            onPress={handleRemovePreview}
            className="absolute top-1 right-2 bg-gray-600 px-2 py-[3px] rounded-full">
            <Text className="text-white text-xl">✕</Text>
          </Pressable>
        </View>
      )}

      {/* Camera and Image Picker */}
      <View className="flex-row gap-4">
        <Pressable
          onPress={handleCameraLaunch}
          className="flex-1 justify-center items-center p-4 rounded-md mb-2 h-32">
          {camera}
          <Text className={`text-base ${isDark && 'text-gray-500'}`}>
            Take a snapshot
          </Text>
        </Pressable>
        <Pressable
          onPress={openImagePicker}
          className="flex-1 justify-center items-center p-4 rounded-md mb-2 h-32">
          {upload}
          <Text className={`text-base ${isDark && 'text-gray-500'}`}>
            Select an image
          </Text>
        </Pressable>
      </View>

      {/* Action Buttons */}
      <View className="flex-row gap-2">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onClose}
          className="flex-1 bg-gray-300 p-2 rounded-md">
          <Text className="text-center text-black">Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleUpdate}
          className={`flex-1 p-2 rounded-md ${
            isDark ? 'bg-darkSecondary text-white' : 'bg-secondary'
          }`}>
          <Text className="text-center text-white">Update</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

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

export default function EditPost({
  postId,
  initialTitle,
  initialImage,
  onClose,
  onUpdate,
}) {
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
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
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
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };
    launchImageLibrary(options, response => {
      if (!response.didCancel && !response.error) {
        const imageUri = response.uri || response.assets?.[0]?.uri;
        setSelectedImage(imageUri);
      }
    });
  };

  const handleRemoveImg = () => {
    setSelectedImage(null);
  };

  const handleUpdate = async () => {
    if (!title.trim() && !selectedImage) {
      return;
    }

    const updatedData = {title, image: selectedImage};
    try {
      await updatePost(postId, updatedData);
      onUpdate();
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  return (
    <>
      {/* Title Input */}
      <TextInput
        className="text-lg text-black"
        value={title}
        onChangeText={setTitle}
        placeholder="What's on your mind?"
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
            onPress={handleRemoveImg}
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
          <Text className="text-base">Take a snapshot</Text>
        </Pressable>
        <Pressable
          onPress={openImagePicker}
          className="flex-1 justify-center items-center p-4 rounded-md mb-2 h-32">
          {upload}
          <Text className="text-base">Select an image</Text>
        </Pressable>
      </View>

      {/* Action Buttons */}
      <View className="flex-row gap-2">
        <TouchableOpacity
          onPress={onClose}
          className="flex-1 bg-gray-300 p-2 rounded-md">
          <Text className="text-center text-black">Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleUpdate}
          className="flex-1 bg-secondary p-2 rounded-md">
          <Text className="text-center text-white">Update</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

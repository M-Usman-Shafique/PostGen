// src/components/EditProfile.jsx
import React, {useState} from 'react';
import {View, TextInput, Image, TouchableOpacity, Text} from 'react-native';
import Avatar from '../images/avatar.png';
import {launchImageLibrary} from 'react-native-image-picker';
import Iconi from 'react-native-vector-icons/FontAwesome5';
import CustomModal from './CustomModal';

export default function EditProfile({isDark, user, onSave, onCancel}) {
  const [username, setUsername] = useState(user.displayName || '');
  const [email, setEmail] = useState(user.email || '');
  const [avatar, setAvatar] = useState(
    user.photoURL ? {uri: user.photoURL} : Avatar,
  );
  const [modalVisible, setModalVisible] = useState(false);

  const editImg = <Iconi name="pen" size={20} color="#384A60" />;

  const openImagePicker = () => {
    const options = {
      mediaType: 'photo',
    };
    launchImageLibrary(options, response => {
      if (!response.didCancel && !response.errorCode) {
        const imageUri = response.assets?.[0]?.uri;
        if (imageUri) {
          setAvatar({uri: imageUri});
        }
      }
    });
  };

  const handleEditImgPress = () => {
    setModalVisible(true);
  };

  const handleRemovePhoto = () => {
    setAvatar(Avatar);
    setModalVisible(false);
  };

  const handleSelectPhoto = () => {
    openImagePicker();
    setModalVisible(false);
  };

  const handleSave = () => {
    const avatarUri =
      typeof avatar === 'object' && avatar.uri ? avatar.uri : avatar;
    onSave({
      username,
      avatar: avatarUri,
    });
  };

  return (
    <View className="w-full gap-5 items-center -mt-20">
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handleEditImgPress}
        className={`relative rounded-full ${
          isDark && 'border-4 border-gray-200'
        }`}>
        <Image
          source={
            typeof avatar === 'object' && avatar.uri
              ? {uri: avatar.uri}
              : avatar
          }
          className="w-28 h-28 rounded-full"
        />
        <View
          className={`absolute bottom-0 right-0 bg-gray-300/90 rounded-full p-2`}>
          {editImg}
        </View>
      </TouchableOpacity>
      <TextInput
        className={`w-[70%] px-4 py-3 text-base rounded-lg ${
          isDark
            ? 'border-none focus:border-none bg-darkAccent text-white'
            : 'border border-gray-400 focus:border-gray-400 text-darkPrimary'
        }`}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        className={`w-[70%] px-4 py-3 text-base rounded-lg ${
          isDark
            ? 'border-none focus:border-none bg-darkAccent text-white/30'
            : 'border border-gray-400 focus:border-gray-400 text-darkPrimary/40'
        }`}
        placeholder="Email Address"
        value={email}
        editable={false}
        selectTextOnFocus={false}
      />
      <View className={`flex-row w-2/3 gap-2`}>
        <TouchableOpacity
          onPress={onCancel}
          className={`flex-1 items-center p-2 rounded-md ${
            isDark ? 'bg-gray-300 text-black' : ' bg-gray-200'
          }`}>
          <Text className={`text-black`}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSave}
          className={`flex-1 items-center p-2 rounded-md ${
            isDark ? 'bg-darkSecondary' : 'bg-secondary'
          }`}>
          <Text className={`${isDark ? 'text-black' : 'text-gray-100'}`}>
            Save
          </Text>
        </TouchableOpacity>
      </View>
      {/* Custom Modal */}
      <CustomModal
        isDark={isDark}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        iconName="image-outline"
        title="Edit Photo"
        cancelText="Select Photo"
        confirmText="Remove Photo"
        onConfirm={handleRemovePhoto}
        onCancel={handleSelectPhoto}
      />
    </View>
  );
}

import React from 'react';
import {Modal, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function CustomModal({
  isDark,
  modalVisible,
  setModalVisible,
  iconName,
  iconColor = 'white',
  iconSize = 30,
  title,
  description,
  cancelText = 'CANCEL',
  confirmText = 'CONFIRM',
  onConfirm,
  onCancel,
}) {
  const icon = <Icon name={iconName} size={iconSize} color={iconColor} />;

  return (
    <View className="flex-1 justify-center items-center">
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View
          style={styles.centeredView}
          className="modal-bg flex-1 justify-center items-center">
          <View
            className={`rounded-xl p-8 items-center shadow-lg gap-2 m-5 ${
              isDark ? 'bg-neutral-800' : 'bg-neutral-600'
            }`}>
            <View className="flex-row gap-2 items-center">
              {icon}
              <Text className="text-white text-2xl font-bold">{title}</Text>
            </View>
            {description && (
              <Text className="text-slate-200 text-base">{description}</Text>
            )}
            <View className="flex-row gap-2">
              <TouchableOpacity
                activeOpacity={0.7}
                className="flex-1 items-center bg-gray-300 rounded-lg px-2 py-2"
                onPress={onCancel}>
                <Text className="text-black text-lg font-semibold">
                  {cancelText}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                className="flex-1 items-center bg-red-600 rounded-lg px-2 py-2"
                onPress={onConfirm}>
                <Text className="text-slate-100 text-lg font-semibold">
                  {confirmText}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
});

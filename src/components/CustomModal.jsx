import React from 'react';
import {Modal, StyleSheet, Text, Pressable, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function CustomModal({
  modalVisible,
  setModalVisible,
  confirmDelete,
}) {
  const trash = <Icon name="trash-outline" size={30} color="white" />;

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
          <View className="bg-neutral-600 rounded-xl p-8 items-center shadow-lg gap-2 m-5">
            <View className="flex-row gap-2 items-center">
              {trash}
              <Text className="text-white text-2xl font-bold">Delete Post</Text>
            </View>
            <Text className="text-slate-200 text-base">
              Are you sure you want to delete this post?
            </Text>
            <View className="flex-row gap-2">
              <Pressable
                className="flex-1 items-center bg-gray-300 rounded-lg px-2 py-2"
                onPress={() => setModalVisible(!modalVisible)}>
                <Text className="text-black text-lg  font-semibold">
                  CANCEL
                </Text>
              </Pressable>
              <Pressable
                className="flex-1 items-center bg-red-600 rounded-lg px-2 py-2"
                onPress={() => {
                  confirmDelete();
                  setModalVisible(!modalVisible);
                }}>
                <Text className="text-slate-100 text-lg  font-semibold">
                  DELETE
                </Text>
              </Pressable>
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

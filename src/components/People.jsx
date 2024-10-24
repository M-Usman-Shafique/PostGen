// src/components/People.jsx
import {View, Text, ActivityIndicator, FlatList, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {getUsers} from '../services/firestore';
import auth from '@react-native-firebase/auth';
import Avatar from '../images/avatar.png';

export default function People({isDark}) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = auth().currentUser;

  useEffect(() => {
    const unsubscribe = getUsers(retrievedUsers => {
      const reorderedUsers = reorderUsers(retrievedUsers, currentUser.uid);
      setUsers(reorderedUsers);
      setLoading(false);
    });

    return () => unsubscribe && unsubscribe();
  }, []);

  const reorderUsers = (users, currentUserId) => {
    const currentUserIndex = users.findIndex(user => user.id === currentUserId);
    if (currentUserIndex > -1) {
      const [currentUser] = users.splice(currentUserIndex, 1);
      users.unshift(currentUser);
    }
    return users;
  };

  const renderUsersAvatar = ({item}) => {
    const username = item.id === currentUser.uid ? 'You' : item.displayName;
    const borderColor =
      item.id === currentUser.uid
        ? 'border-green-500 border-4'
        : isDark
        ? 'border-[#b7b1ff]'
        : 'border-slate-500';

    return (
      <View className="avatar-container items-center gap-1">
        <View
          className={`image-container border-2 rounded-full p-1 ${borderColor}`}>
          <Image
            source={item?.photoURL ? {uri: item.photoURL} : Avatar}
            className="w-16 h-16 rounded-full"
          />
        </View>
        <Text className={`${isDark ? 'text-[#b7b1ff]' : 'text-secondary'}`}>
          {username}
        </Text>
      </View>
    );
  };

  const ItemSeparator = () => <View className="w-2" />;

  return (
    <View>
      {loading ? (
        <ActivityIndicator
          size="large"
          color={isDark ? '#877EFF' : '#1A202C'}
        />
      ) : (
        <FlatList
          horizontal
          data={users}
          renderItem={renderUsersAvatar}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={ItemSeparator}
        />
      )}
    </View>
  );
}

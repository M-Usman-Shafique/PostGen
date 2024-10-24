// src/components/People.jsx
import {View, Text, ActivityIndicator, FlatList, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {getUsers} from '../services/firestore';
import Avatar from '../images/avatar.png';

export default function People({isDark}) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = getUsers(retrievedUsers => {
      setUsers(retrievedUsers);
      setLoading(false);
    });

    return () => unsubscribe && unsubscribe();
  }, []);

  const renderUsersAvatar = ({item}) => {
    return (
      <View className="avatar-container items-center">
        <View
          className={`image-container border-2 p-1 rounded-full ${
            isDark ? 'border-[#b7b1ff]' : 'border-slate-500'
          }`}>
          <Image
            source={item?.photoURL ? {uri: item.photoURL} : Avatar}
            className="w-14 h-14 rounded-full"
          />
        </View>
        <Text className={`${isDark ? 'text-[#b7b1ff]' : 'text-secondary'}`}>
          {item.displayName}
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

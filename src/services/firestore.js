// src/services/firestore.js
import firestore from '@react-native-firebase/firestore';

export const addPostData = async postData => {
  try {
    const postRef = await firestore().collection('posts').add(postData);
    return postRef;
  } catch (error) {
    console.error('Error adding post data:', error);
    throw error;
  }
};

export const getPosts = setPosts => {
  try {
    return firestore()
      .collection('posts')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const posts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(posts);
      });
  } catch (error) {
    console.error('Error fetching real-time posts data: ', error);
  }
};

export const updatePost = async (id, updatedData) => {
  try {
    await firestore().collection('posts').doc(id).update(updatedData);
    return {success: true};
  } catch (error) {
    console.error('Error updating post data:', error);
    throw error;
  }
};

export const deletePost = async id => {
  try {
    await firestore().collection('posts').doc(id).delete();
    return {success: true};
  } catch (error) {
    console.error('Error deleting post data:', error);
    throw error;
  }
};

export const getUsers = setUsers => {
  try {
    return firestore()
      .collection('users')
      .onSnapshot(snapshot => {
        const users = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(users);
      });
  } catch (error) {
    console.error('Error fetching real-time users data: ', error);
  }
};

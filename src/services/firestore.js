// src/services/firestore.js
import firestore from '@react-native-firebase/firestore';

export const addPostData = async postData => {
  try {
    await firestore().collection('posts').add(postData);
    console.log('Post created Successfully!');
  } catch (error) {
    console.error('Error adding post data:', error);
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
    console.error('Error fetching real-time data: ', error);
  }
};

export const updatePost = async (id, updatedData) => {
  try {
    await firestore().collection('posts').doc(id).update(updatedData);
    console.log('Post updated Successfully!');
  } catch (error) {
    console.error('Error updating post data:', error);
  }
};

export const deletePost = async id => {
  try {
    await firestore().collection('posts').doc(id).delete();
    console.log('Post deleted Successfully!');
  } catch (error) {
    console.error('Error deleting post data:', error);
  }
};

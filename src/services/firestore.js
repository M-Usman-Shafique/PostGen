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

export const getPosts = async () => {
  try {
    const postsSnapshot = await firestore().collection('posts').get();
    const posts = postsSnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));

    return posts;
  } catch (error) {
    console.error('Error fetching data: ', error);
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

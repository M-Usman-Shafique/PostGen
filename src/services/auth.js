// src/services/auth.js
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const registerUser = async (email, password, username) => {
  try {
    // Create user with email and password
    const userCredential = await auth().createUserWithEmailAndPassword(
      email,
      password,
    );

    // set the username as displayName
    await userCredential.user.updateProfile({
      displayName: username,
      photoURL: '',
    });

    // Store user details in Firestore
    await firestore().collection('users').doc(userCredential.user.uid).set({
      displayName: username,
      email: email,
      photoURL: '',
    });

    // Send email verification
    await userCredential.user.sendEmailVerification();

    return userCredential.user;
  } catch (error) {
    let errorMessage;
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'Email is already in use. Please use a different email.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid Email Address';
        break;
      case 'auth/weak-password':
        errorMessage = 'Password is too weak, Please use at least 6 characters';
        break;
      default:
        errorMessage = 'An unknown error occured';
        break;
    }
    throw new Error(errorMessage);
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(
      email,
      password,
    );

    await userCredential.user.reload();

    const user = auth().currentUser;
    return {user, emailVerified: user.emailVerified};
  } catch (error) {
    let errorMessage;
    switch (error.code) {
      case 'auth/wrong-password':
        errorMessage = 'Incorrect Password';
        break;
      case 'auth/invalid-credential':
        errorMessage = 'Invalid email or password';
        break;
      default:
        errorMessage = 'An unknown error occurred';
    }
    throw new Error(errorMessage);
  }
};

import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, Image} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {launchImageLibrary} from 'react-native-image-picker';

const PostSchema = Yup.object().shape({
  title: Yup.string(),
  image: Yup.string(),
});

export default function CreatePost() {
  const [imageUri, setImageUri] = useState(null);

  const pickImage = setFieldValue => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response && response.assets && response.assets.length > 0) {
        const selectedImage = response.assets[0];
        setImageUri(selectedImage.uri);
        setFieldValue('image', selectedImage.uri);
      }
    });
  };

  return (
    <Formik
      initialValues={{title: '', image: ''}}
      validationSchema={PostSchema}
      onSubmit={values => {
        console.log(values);
        // Handle form submission here
      }}>
      {({handleChange, handleSubmit, setFieldValue, errors, touched}) => (
        <View className="flex-1 justify-center px-6 bg-primary">
          <Text className="text-2xl font-bold text-secondary mb-4">
            Create a Post
          </Text>

          {/* Title Input */}
          <TextInput
            className="border border-secondary rounded-md p-4 mb-2 bg-white text-secondary"
            placeholder="Post Title"
            onChangeText={handleChange('title')}
            style={{color: '#1F2937'}}
          />
          {touched.title && errors.title && (
            <Text className="text-red-500">{errors.title}</Text>
          )}

          {/* Image Picker */}
          <TouchableOpacity
            onPress={() => pickImage(setFieldValue)}
            className="bg-secondary p-4 rounded-md mb-2">
            <Text className="text-white text-center">Pick Image</Text>
          </TouchableOpacity>
          {imageUri && (
            <Image
              source={{uri: imageUri}}
              className="w-full h-40 mb-4 rounded-md"
            />
          )}
          {touched.image && errors.image && (
            <Text className="text-red-500">{errors.image}</Text>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-secondary p-4 rounded-md">
            <Text className="text-white text-center">Submit</Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
}

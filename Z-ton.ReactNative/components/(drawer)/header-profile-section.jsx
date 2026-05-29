import React from 'react'
import { View, Text, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy'; // Importing legacy version for better compatibility with base64 handling
import axios from 'axios';
import { API_URL, supabase } from '../../app/server/config';

const COLORS = {
  black: "#000000",
  gold: "#B8860B",
  gray: "#9CA3AF", 
  white: "#FFFFFF",
  darkGray: "#1F2937",
};

const HeaderProfileSection = ({ user, setUser, styles, profileImage, setProfileImage, profilePublicId, setProfilePublicId, uploadStatus, setUploadStatus }) => {


    
  const BUCKET_NAME = 'Z-ton-Mobile-App'; // Update this to your Supabase storage bucket name

  // Helper function to convert base64 string to Uint8Array for file upload
  const base64ToUint8Array = (base64) => {
    const binaryString = typeof atob === 'function' ? atob(base64) : Buffer.from(base64, 'base64').toString('binary');
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };
  
  // Function to upload image to Supabase storage and return the public URL
  const uploadProfileImage = async (uri) => {
    try {
      console.log('Uploading image from URI:', uri);
 
      const extension = uri.split('.').pop().split('?')[0] || 'png';
      const filename = `${Date.now()}.${extension}`; // Generate a unique filename
      const filePath = `profile_image/${filename}`;
  
      // Read image as base64 and convert to bytes
      const base64Data = await FileSystem.readAsStringAsync(uri, {
        encoding: 'base64',
      });
      const bytes = base64ToUint8Array(base64Data); // Convert base64 string to Uint8Array for upload

      // Upload file using standard upload logic
      const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, bytes, {
        contentType: `image/${extension}`,
        upsert: false,
      });

      
      if (error) { // Handle upload error
        console.error('Upload failed:', error.message);
        return null;
      } else { // On successful upload, get the public URL of the uploaded image
        const { data: publicUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
        console.log('Upload success! Public URL:', publicUrlData.publicUrl);
        return { 
          publicUrl: publicUrlData.publicUrl, 
          filePath: filePath 
        };
      }
    } catch (err) {
      console.error('Upload error:', err.message || err);
      return null;
    }
  };

  // Function to handle image selection from camera or gallery
  const pickImage = async () => {
    Alert.alert(
      "Profile Picture",
      "Choose an option",
      [
        { text: "Camera", onPress: () => openPicker(true) },
        { text: "Gallery", onPress: () => openPicker(false) },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };


  // Function to handle permission and image picking
  const openPicker = async (isCamera) => {
    const permission = isCamera 
      ? await ImagePicker.requestCameraPermissionsAsync() 
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

      // Check if permission is granted
    if (!permission.granted) {
      Alert.alert("Permission Required", "We need access to your photos to change your profile picture.");
      return;
    }

    const result = isCamera 
      ? await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.7 })
      : await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.7 });

      // If the user didn't cancel the picker, update the profile image
    if (!result.canceled) {
      const localUri = result.assets[0].uri;
      console.log(localUri); // Log the local URI for debugging
      
      const oldFilePath = profilePublicId; // Save the old ID to delete it later

      // Indicate that uploading has started
      setUploadStatus('loading');

      // 1. Upload the new image to Supabase
      const uploadResult = await uploadProfileImage(localUri);

      if (uploadResult) {
        const { publicUrl, filePath } = uploadResult;

        // 2. Update the Laravel backend with the new information
        const isBackendUpdated = await sendUserImageToBackend(publicUrl, filePath);

        if (isBackendUpdated) {
          // Update local state if backend update was successful
          setProfileImage(publicUrl);
          setProfilePublicId(filePath);
          setUploadStatus('success');

          // 3. Delete the OLD image from Supabase Storage now that the new one is safely saved
          if (oldFilePath) {
            console.log('Deleting old profile image from Supabase:', oldFilePath);
            const { error: deleteError } = await supabase.storage.from(BUCKET_NAME).remove([oldFilePath]);
            if (deleteError) {
              console.error('Failed to delete old image from storage:', deleteError.message);
            }
          }
        } else {
          setUploadStatus('error');
          // Cleanup: delete the newly uploaded image in Supabase if the backend update fails
          await supabase.storage.from(BUCKET_NAME).remove([filePath]);
        }
      } else {
        setUploadStatus('error');
      }

      // Hide the status indicator after a short delay (2 seconds)
      setTimeout(() => setUploadStatus(null), 2000);
    }
  };


  // Function to send user image to laravel backend for processing
  const sendUserImageToBackend = async (url, publicId) => {
       try {
           const response = await axios.post(`${API_URL}/process-image/upload-profile-image/${user.id}`,{
            profile_url: url,
            profile_public_id: publicId,
           });

           const responseData = response.data;   

           if (responseData === "success" || responseData.status === "success") {
                console.log(responseData.message || "Profile image synchronized with backend.");
                return true;
           }
           return false;
       } catch (error) {
        console.error('Backend synchronization failed:', error);
        return false;
       }
  };


  return (
    <>
    
            {/* Header Profile Section */}

            <View style={styles.drawerHeader}>
              <TouchableOpacity style={styles.profileImageContainer} onPress={pickImage} disabled={!!uploadStatus}>
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
                
                {/* Upload Status Overlay */}
                {uploadStatus && (
                  <View style={styles.uploadOverlay}>
                    {uploadStatus === 'loading' && <ActivityIndicator size="large" color={COLORS.gold} />}
                    {uploadStatus === 'success' && <Ionicons name="checkmark-circle" size={45} color="#10B981" />}
                    {uploadStatus === 'error' && <Ionicons name="close-circle" size={45} color="#FF3B30" />}
                  </View>
                )}
    
                <View style={styles.editIconContainer}>
                  <Ionicons name="camera" size={16} color={COLORS.white} />
                </View>
              </TouchableOpacity>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.accountNumber}>Acc: {user.account_number}</Text>
            </View>

    </>
  )
}

export default HeaderProfileSection

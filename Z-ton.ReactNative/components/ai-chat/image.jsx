import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { TouchableOpacity} from 'react-native';
 
function ImagePickerAttachment({styles, COLORS, recording, setMessages, simulateAIResponse}) {

    // Function to handle image selection from the user's library
    const handleImagePicker = async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });
  
      if (!result.canceled) {
        const selectedImage = result.assets[0];

        // Create a new message object for the image
        const newMessage = {
          id: Date.now().toString(),
          uri: selectedImage.uri,
          sender: 'user',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'image',
        };
        setMessages(prev => [...prev, newMessage]);

        // Prepare FormData for Laravel
        const formData = new FormData();
        formData.append('image', {  // The key 'image' should match what your Laravel backend expects
          uri: selectedImage.uri,
          name: selectedImage.fileName || `upload_${Date.now()}.jpg`,
          type: selectedImage.mimeType || 'image/jpeg',
        });

        // Passing the formData to the simulation to send it to Laravel
        simulateAIResponse(formData, 'image');
      }
    };
  
 
  return (
     <>
        {/* Attachment Button for Image Picker (disabled during recording) */}
        <TouchableOpacity onPress={handleImagePicker} style={styles.attachButton} disabled={!!recording}>
        <Ionicons name="image-outline" size={26} color={COLORS.gold} />
        </TouchableOpacity>
     </>
  )
}

export default ImagePickerAttachment

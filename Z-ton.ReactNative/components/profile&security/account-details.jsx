import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { UserContext } from '../../app/UserContext';
import axios from 'axios';
import * as Haptics from 'expo-haptics';
import { API_URL } from '../../app/server/config';
const COLORS = { // Define colors for consistency
  black: "#000000",
  gold: "#B8860B",
  gray: "#9CA3AF",
  white: "#FFFFFF",
  darkGray: "#1F2937",
  lightGray: "#F9FAFB",
};

const AccountDetails = ({styles,user}) => {

     const [isLoading, setIsLoading] = useState(false);

      const [name, setName] = useState(user.name);
      const [email, setEmail] = useState(user.email);
      // error
      const [nameError, setNameError] = useState('');
      const [emailError, setEmailError] = useState('');


      
   // handle submit the updated account details to the server
   const handleSubmit = async () => {

            setIsLoading(true);
            setNameError(""); 
            setEmailError("");

            try {

                const response = await axios.put(`${API_URL}/user/updateInfo/${user.id}`,{
                    name: name,
                    email: email,
                });

                const data = response.data;

                if (data.status == "success") {

                  //  Save the user data to global context for access across the app
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                  setUser(data.user);

                   Alert.alert("Updated", data.message);
                }
                
            }catch (error) { // handle errors from the API or network issues
                       const data = error.response?.data; // Safely extract response data if it exists
                      
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                        // validation error from Laravel
                        if (data?.errors) { // check if there are validation errors in the response
                          setNameError(data.errors.name?.[0] || "");
                          setEmailError(data.errors.email?.[0] || "");
                        }

               } finally { // reset loading state after the login process is complete, regardless of success or failure
                 setIsLoading(false);
               }

  }




  return ( 
     <>
        {/* Account Details */}
        <Text style={styles.sectionTitle}>Account Details</Text>
        
        {/* Full Name */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color={COLORS.gold} />
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
            />
          </View>
                {/* nameError */}
                {nameError ? ( // Corrected syntax for optional chaining
                    <Text style={{ color: "red", marginTop: 4 }}>{nameError}</Text>
                ) : null}
        </View>

        {/* Email Address */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={COLORS.gold} />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
                {/* emailError */}
                {emailError ? ( // Corrected syntax for optional chaining
                    <Text style={{ color: "red", marginTop: 4 }}>{emailError}</Text>
                    ) : null}
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={() => handleSubmit()}>
            {isLoading ? ( // Only show spinner if login is loading, not biometric success animation
            <ActivityIndicator color="#fff" />
            ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
            )}
        </TouchableOpacity>
     </>
  )
}

export default AccountDetails

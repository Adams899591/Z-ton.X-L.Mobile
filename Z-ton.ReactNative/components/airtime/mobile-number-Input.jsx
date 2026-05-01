import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, TextInput, Switch, Modal, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const COLORS = {
  black: "#000000",
  gold: "#B8860B",
  gray: "#9CA3AF",
  white: "#FFFFFF",
  darkGray: "#1F2937",
  lightGray: "#F3F4F6",
};

const MobileNumberInput = ({styles,phoneNumber,setPhoneNumber}) => {

    // Function to trigger native contact selection from the user mobile
    const handleSelectContact = async () => {
    try {
        const { status } = await Contacts.requestPermissionsAsync();
        if (status === 'granted') {
        // Opens the system UI to select a contact
        const contact = await Contacts.presentContactPickerAsync();

        if (contact && contact.phoneNumbers && contact.phoneNumbers.length > 0) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            
            // Get the first phone number and remove non-numeric characters (like spaces or dashes)
            const rawNumber = contact.phoneNumbers[0].number;
            const cleanedNumber = rawNumber.replace(/[^0-9]/g, ''); 
            
            setPhoneNumber(cleanedNumber);
        }
        } else {
        Alert.alert("Permission Denied", "We need permission to access your contacts to use this feature.");
        }
    } catch (error) {
        console.error("Error selecting contact:", error);
    }
    };
    
  return (
    <>
            {/* Mobile Number Input */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Mobile Number</Text>
                <TouchableOpacity style={styles.contactTrigger} onPress={handleSelectContact}>
                  <Ionicons name="person-add-outline" size={16} color={COLORS.gold} />
                  <Text style={styles.contactText}>Select from contacts</Text>
                </TouchableOpacity>
              </View>
              <TextInput 
                style={styles.input}
                placeholder="e.g. 08012345678"
                placeholderTextColor={COLORS.gray}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="numeric"
              />
            </View>
    </>
  )
}

export default MobileNumberInput


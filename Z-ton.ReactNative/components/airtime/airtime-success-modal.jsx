import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, TextInput, Switch, Modal, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Contacts from 'expo-contacts';
import * as Haptics from 'expo-haptics';


const COLORS = {
  black: "#000000",
  gold: "#B8860B",
  gray: "#9CA3AF",
  white: "#FFFFFF",
  darkGray: "#1F2937",
  lightGray: "#F3F4F6",
};

const AirtimeSuccessModal = ({styles, showSuccessModal, setShowSuccessModal, amount, phoneNumber, selectedOperator,setPhoneNumber,setAmount}) => {
 


  // Function to handle closing the success modal and resetting the form
 function handleCloseSuccessModal() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setAmount('');
    setPhoneNumber('');
    setShowSuccessModal(false);
  }
 
  return (
     <>
        {/* Airtime Success Modal */}
           <Modal
             animationType="fade"
             transparent={true}
             visible={showSuccessModal}
             onRequestClose={() => setShowSuccessModal(false)}
           >
             <View style={styles.modalOverlay}>
               <View style={styles.successModalContent}>
                 <View style={styles.successIconContainer}>
                   <Ionicons name="checkmark-circle" size={100} color={COLORS.gold} />
                 </View>
                 
                 <Text style={styles.successTitle}>Top-up Successful</Text>
                 <Text style={styles.successMessage}>
                   Your airtime purchase of <Text style={{ fontWeight: 'bold', color: COLORS.black }}>${amount || '0.00'}</Text> for {phoneNumber} was successful.
                 </Text>
     
                 <TouchableOpacity 
                   style={styles.successCloseButton}
                   onPress={() => handleCloseSuccessModal()}
                 >
                   <Text style={styles.successCloseButtonText}>Close</Text>
                 </TouchableOpacity>
               </View>
             </View>
           </Modal>
     </>
  )
}

export default AirtimeSuccessModal


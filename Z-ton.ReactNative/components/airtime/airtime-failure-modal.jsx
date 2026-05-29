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
  red: "#DC2626",
};

const AirtimeFailureModal = ({styles, showFailureModal, setShowFailureModal, amount, phoneNumber, selectedOperator}) => {
 
  // Function to handle closing the failure modal
 function handleCloseFailureModal() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowFailureModal(false);
  }
 
  return (
     <>
        {/* Airtime Failure Modal */}
           <Modal
             animationType="fade"
             transparent={true}
             visible={showFailureModal}
             onRequestClose={() => setShowFailureModal(false)}
           >
             <View style={styles.modalOverlay}>
               <View style={styles.successModalContent}>
                 <View style={styles.successIconContainer}>
                   <Ionicons name="close-circle" size={100} color={COLORS.red} />
                 </View>
                 
                 <Text style={styles.successTitle}>Top-up Failed</Text>
                 <Text style={styles.successMessage}>
                   Your airtime purchase of <Text style={{ fontWeight: 'bold', color: COLORS.black }}>${amount || '0.00'}</Text> for {phoneNumber} could not be completed at this time.
                 </Text>
     
                 <TouchableOpacity 
                   style={[styles.successCloseButton, { backgroundColor: COLORS.red }]}
                   onPress={() => handleCloseFailureModal()}
                 >
                   <Text style={styles.successCloseButtonText}>Try Again</Text>
                 </TouchableOpacity>
               </View>
             </View>
           </Modal>
     </>
  )
}

export default AirtimeFailureModal

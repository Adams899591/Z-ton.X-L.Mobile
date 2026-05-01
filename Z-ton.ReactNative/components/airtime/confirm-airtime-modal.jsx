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

const ConfirmAirtimeModal = ({styles,phoneNumber,selectedOperator,isLoading,setIsLoading,showConfirmModal,setShowConfirmModal,setShowSuccessModal}) => {

   const [pin, setPin] = useState('');

  // Handle number press for PIN input
  const handleNumberPress = (num) => {
    if (pin.length < 4 && !isLoading) {
      setPin(prev => prev + num);
    }
  };

  // Handle backspace for PIN input
  const handleBackspace = () => {
    if (!isLoading) {
      setPin(pin.slice(0, -1));
    }
  };

   // 
  const handleTopUp = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowConfirmModal(false);
      setShowSuccessModal(true);
      setPin('');
    }, 3000);
  };
  
  return (
    <>
          {/* Confirm Airtime Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={showConfirmModal}
            onRequestClose={() => setShowConfirmModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.confirmModalContent}>
                <View style={styles.confirmHeader}>
                  <Text style={styles.confirmTitle}>Confirm Top-up</Text>
                  <TouchableOpacity onPress={() => { setShowConfirmModal(false); setPin(''); }}>
                    <Ionicons name="close" size={24} color={COLORS.black} />
                  </TouchableOpacity>
                </View>
    
                <View style={styles.confirmBody}>
                  <Text style={styles.confirmSubtext}>You are about to top up:</Text>
                  <View style={styles.staticDetailBox}>
                    <Text style={styles.staticName}>{phoneNumber || "Enter Number"}</Text>
                    <Text style={styles.staticAccount}>{selectedOperator} Network</Text>
                  </View>
    
                  <View style={styles.modalHorizontalDivider} />
    
                  <Text style={styles.enterPinLabel}>Enter PIN</Text>
                  
                  <View style={styles.pinDisplayRow}>
                    {isLoading ? (
                      <ActivityIndicator size="small" color={COLORS.gold} />
                    ) : (
                      [1, 2, 3, 4].map((_, index) => (
                        <View 
                          key={index} 
                          style={[
                            styles.pinDot, 
                            pin.length > index && styles.pinDotFilled
                          ]} 
                        />
                      ))
                    )}
                  </View>
    
                  <View style={styles.keypadContainer}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                      <TouchableOpacity 
                        key={num} 
                        style={[styles.keypadButton, isLoading && { opacity: 0.5 }]}
                        disabled={isLoading}
                        onPress={() => handleNumberPress(num.toString())}
                      >
                        <Text style={styles.keypadButtonText}>{num}</Text>
                      </TouchableOpacity>
                    ))}
                    <View style={styles.keypadButton} />
                    <TouchableOpacity 
                      style={[styles.keypadButton, isLoading && { opacity: 0.5 }]}
                      disabled={isLoading}
                      onPress={() => handleNumberPress('0')}
                    >
                      <Text style={styles.keypadButtonText}>0</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.keypadButton, isLoading && { opacity: 0.5 }]}
                      disabled={isLoading}
                      onPress={handleBackspace}
                    >
                      <Ionicons name="backspace-outline" size={24} color={COLORS.black} />
                    </TouchableOpacity>
                  </View>
    
                  <TouchableOpacity 
                    style={[styles.modalTransferButton, (pin.length < 4 || isLoading) && styles.disabledButton]}
                    disabled={pin.length < 4 || isLoading}
                    onPress={handleTopUp}
                  >
                    {isLoading ? (
                      <ActivityIndicator color={COLORS.white} />
                    ) : (
                      <Text style={styles.modalTransferButtonText}>Confirm & Pay</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
    </>
  )
}

export default ConfirmAirtimeModal

const styles = StyleSheet.create({})
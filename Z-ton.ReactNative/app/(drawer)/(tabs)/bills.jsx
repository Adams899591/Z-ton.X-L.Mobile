import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, TextInput, Switch, StatusBar, Modal, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  black: "#000000",
  gold: "#B8860B",
  gray: "#9CA3AF",
  white: "#FFFFFF",
  darkGray: "#1F2937",
  lightGray: "#F3F4F6",
};
const billCategories = [
  { id: 'electricity', name: 'Electricity', icon: 'flash-outline' },
  { id: 'water', name: 'Water', icon: 'water-outline' },
  { id: 'internet', name: 'Internet', icon: 'wifi-outline' },
  { id: 'cable', name: 'Cable TV', icon: 'tv-outline' },
  { id: 'education', name: 'Education', icon: 'school-outline' },
  { id: 'government', name: 'Govt. Payments', icon: 'business-outline' },
];

const BillsScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [biller, setBiller] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);

  // Modal & PIN States
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleNumberPress = (num) => {
    if (pin.length < 4 && !isLoading) {
      setPin(prev => prev + num);
    }
  };

  const handleBackspace = () => {
    if (!isLoading) {
      setPin(pin.slice(0, -1));
    }
  };

  const handlePay = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowConfirmModal(false);
      setShowSuccessModal(true);
      setPin('');
    }, 3000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.darkGray} />
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Account Selection */}
        <Text style={styles.label}>Select Account</Text>
        <TouchableOpacity style={styles.accountBox}>
          <View>
            <Text style={styles.accountNumber}>0123456789</Text>
            <Text style={styles.accountBalance}>Balance: $1,234.56</Text>
          </View>
          <Ionicons name="chevron-down" size={20} color={COLORS.gray} />
        </TouchableOpacity>

        {/* Bill Categories Selection */}
        <Text style={styles.sectionTitle}>Select Bill Category</Text>
        <View style={styles.categoryGrid}>
          {billCategories.map((category) => (
            <TouchableOpacity 
              key={category.id} 
              style={[
                styles.categoryButton, 
                selectedCategory === category.id && styles.selectedCategoryButton
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Ionicons 
                name={category.icon} 
                size={28} 
                color={selectedCategory === category.id ? COLORS.white : COLORS.gold} 
              />
              <Text 
                style={[
                  styles.categoryText, 
                  selectedCategory === category.id && styles.selectedCategoryText
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Input Fields */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Biller / Service Provider</Text>
          <TextInput 
            style={styles.input}
            placeholder="e.g., Electricity Company, Water Board"
            placeholderTextColor={COLORS.gray}
            value={biller}
            onChangeText={setBiller}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Customer ID / Account Number</Text>
          <TextInput 
            style={styles.input}
            placeholder="Enter customer ID or account number"
            placeholderTextColor={COLORS.gray}
            value={customerId}
            onChangeText={setCustomerId}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Amount</Text>
          <TextInput 
            style={styles.input}
            placeholder="Enter Amount"
            placeholderTextColor={COLORS.gray}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Transaction Description (Optional)</Text>
          <TextInput 
            style={styles.input}
            placeholder="Add a note for this bill"
            placeholderTextColor={COLORS.gray}
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* Schedule Toggle */}
        <View style={styles.scheduleRow}>
          <View>
            <Text style={styles.scheduleTitle}>Schedule Bill Payment</Text>
            <Text style={styles.scheduleSubtitle}>Set a recurring or future payment for this bill</Text>
          </View>
          <Switch 
            value={isScheduled}
            onValueChange={setIsScheduled}
            trackColor={{ false: COLORS.gray, true: COLORS.gold }}
            thumbColor={COLORS.white}
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.continueButton} onPress={() => setShowConfirmModal(true)}>
            <Text style={styles.continueButtonText}>CONTINUE</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.fingerprintButton}>
            <Ionicons name="finger-print" size={40} color={COLORS.gold} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Confirm Bill Payment Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showConfirmModal}
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModalContent}>
            <View style={styles.confirmHeader}>
              <Text style={styles.confirmTitle}>Confirm Bill Payment</Text>
              <TouchableOpacity onPress={() => { setShowConfirmModal(false); setPin(''); }}>
                <Ionicons name="close" size={24} color={COLORS.black} />
              </TouchableOpacity>
            </View>

            <View style={styles.confirmBody}>
              <Text style={styles.confirmSubtext}>You are about to pay for:</Text>
              <View style={styles.staticDetailBox}>
                <Text style={styles.staticName}>{biller || "Biller Name"}</Text>
                <Text style={styles.staticAccount}>{customerId || "Account Number"}</Text>
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
                onPress={handlePay}
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

      {/* Success Modal */}
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
            
            <Text style={styles.successTitle}>Payment Successful</Text>
            <Text style={styles.successMessage}>
              Your payment of <Text style={{ fontWeight: 'bold', color: COLORS.black }}>${amount || '0.00'}</Text> to {biller} was successful.
            </Text>

            <TouchableOpacity 
              style={styles.successCloseButton}
              onPress={() => setShowSuccessModal(false)}
            >
              <Text style={styles.successCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default BillsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  content: { padding: 20, paddingBottom: 30 },
  label: { fontSize: 14, color: COLORS.gray, marginBottom: 8, fontWeight: '500' },
  accountBox: {
    backgroundColor: '#F9FAFB', // Using a light gray similar to other screens
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 1,
  },
  accountNumber: { fontSize: 18, fontWeight: 'bold', color: COLORS.black },
  accountBalance: { fontSize: 12, color: COLORS.gray },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.black, marginBottom: 15 },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  categoryButton: {
    backgroundColor: '#F9FAFB',
    paddingVertical: 15,
    width: '30%', // Adjusted for 3 columns with spacing
    marginBottom: 15,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  selectedCategoryButton: {
    backgroundColor: COLORS.darkGray,
  },
  categoryText: {
    marginTop: 8,
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.black,
    textAlign: 'center',
  },
  selectedCategoryText: {
    color: COLORS.white,
  },
  inputGroup: { marginBottom: 20 },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    color: COLORS.black,
    elevation: 1,
  },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 15,
    borderRadius: 12,
    marginBottom: 30,
    elevation: 1,
  },
  scheduleTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.black },
  scheduleSubtitle: { fontSize: 12, color: COLORS.gray },
  actionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  continueButton: {
    backgroundColor: COLORS.black,
    flex: 1,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 15,
  },
  continueButtonText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
  fingerprintButton: { padding: 5 },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  confirmModalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingBottom: 20,
    minHeight: '55%',
  },
  confirmHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  confirmTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.black },
  confirmBody: { padding: 15, alignItems: 'center' },
  confirmSubtext: { fontSize: 14, color: COLORS.gray, marginBottom: 8 },
  staticDetailBox: { alignItems: 'center', marginBottom: 10 },
  staticName: { fontSize: 20, fontWeight: 'bold', color: COLORS.black },
  staticAccount: { fontSize: 14, color: COLORS.gray, marginTop: 5 },
  modalHorizontalDivider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    width: '100%',
    marginVertical: 15,
  },
  enterPinLabel: { fontSize: 16, fontWeight: '600', color: COLORS.black, marginBottom: 15 },
  pinDisplayRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  pinDot: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    borderWidth: 1,
    borderColor: COLORS.gray,
    marginHorizontal: 15,
  },
  pinDotFilled: {
    backgroundColor: COLORS.gold,
    borderColor: COLORS.gold,
  },
  keypadContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  keypadButton: {
    width: '30%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  keypadButtonText: { fontSize: 24, fontWeight: '600', color: COLORS.black },
  modalTransferButton: {
    backgroundColor: COLORS.black,
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  modalTransferButtonText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
  disabledButton: { backgroundColor: COLORS.gray },
  successModalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 25,
    padding: 25,
    width: '90%',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 'auto',
    marginTop: 'auto',
  },
  successIconContainer: { marginBottom: 20 },
  successTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.black, marginBottom: 10 },
  successMessage: { fontSize: 15, color: COLORS.gray, textAlign: 'center', lineHeight: 22, marginBottom: 30 },
  successCloseButton: { backgroundColor: COLORS.black, width: '100%', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  successCloseButtonText: { color: COLORS.white, fontWeight: 'bold', fontSize: 16 },
});

import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, TextInput, Switch, Modal, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Contacts from 'expo-contacts';
import * as Haptics from 'expo-haptics';
import MobileOperatorsSelection from '../../../components/airtime/mobile-operators-selection';
import ConfirmAirtimeModal from '../../../components/airtime/confirm-airtime-modal';
import AirtimeSuccessModal from '../../../components/airtime/airtime-success-modal';
import MobileNumberInput from '../../../components/airtime/mobile-number-Input';

const COLORS = {
  black: "#000000",
  gold: "#B8860B",
  gray: "#9CA3AF",
  white: "#FFFFFF",
  darkGray: "#1F2937",
  lightGray: "#F3F4F6",
};

const AirtimeScreen = () => {

 
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  
  // Modal & PIN States
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState('MTN');





  return (
    <SafeAreaView style={styles.container}>
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

        {/* Mobile Operator Selection .props */}
        <MobileOperatorsSelection
         styles={styles}
         setSelectedOperator={setSelectedOperator}
         selectedOperator={selectedOperator}
         showConfirmModal={showConfirmModal}
         setShowConfirmModal={setShowConfirmModal}
        />

        {/* Mobile Number Input  .props*/}
        <MobileNumberInput
           styles={styles}
           phoneNumber={phoneNumber}
           setPhoneNumber={setPhoneNumber}
        />
        
        {/* Amount Input */}
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

        {/* Schedule Toggle */}
        <View style={styles.scheduleRow}>
          <View>
            <Text style={styles.scheduleTitle}>Schedule payment</Text>
            <Text style={styles.scheduleSubtitle}>Set a recurring time for this top-up</Text>
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

      {/* Confirm Airtime Modal  .props*/}
      <ConfirmAirtimeModal
       styles={styles}
       phoneNumber={phoneNumber}
       selectedOperator={selectedOperator}
       showConfirmModal={showConfirmModal}
       setShowConfirmModal={setShowConfirmModal}
       setShowSuccessModal={setShowSuccessModal}
       isLoading={isLoading}
       setIsLoading={setIsLoading}
      />
 
      {/* Airtime Success Modal */}
      <AirtimeSuccessModal
       styles={styles} 
       showSuccessModal={showSuccessModal}
       setShowSuccessModal={setShowSuccessModal}
       amount={amount}
       phoneNumber={phoneNumber}
       selectedOperator={selectedOperator}
      />
    </SafeAreaView>
  );
};

export default AirtimeScreen

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  content: { padding: 20 },
  label: { fontSize: 14, color: COLORS.gray, marginBottom: 8, fontWeight: '500' },
  accountBox: {
    backgroundColor: COLORS.lightGray,
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  accountNumber: { fontSize: 18, fontWeight: 'bold', color: COLORS.black },
  accountBalance: { fontSize: 12, color: COLORS.gray },
  operatorRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 25 
  },
  operatorItem: { alignItems: 'center', width: '22%' },
  selectedOperatorItem: { 
    borderBottomWidth: 2, 
    borderBottomColor: COLORS.gold, 
    paddingBottom: 5 
  },
  operatorIcon: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 5,
    elevation: 2,
  },
  operatorInitial: { color: COLORS.white, fontWeight: 'bold', fontSize: 20 },
  operatorText: { fontSize: 12, fontWeight: '600' },
  inputGroup: { marginBottom: 20 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  contactTrigger: { flexDirection: 'row', alignItems: 'center' },
  contactText: { color: COLORS.gold, fontSize: 12, marginLeft: 4, fontWeight: 'bold' },
  input: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    color: COLORS.black,
  },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    padding: 15,
    borderRadius: 12,
    marginBottom: 30,
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
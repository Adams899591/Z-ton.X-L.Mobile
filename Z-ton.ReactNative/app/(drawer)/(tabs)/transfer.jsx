import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, TextInput, Switch, Modal, FlatList, StatusBar, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import BankSelectionModal from '../../../components/transfer/bank-selection-modal';
import ConfirmTransferModal from '../../../components/transfer/confirm-transfer-modal';
import TransferSuccessModal from '../../../components/transfer/transfer-success-modal';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Haptics from 'expo-haptics';
import { API_URL } from '../../server/config';
import { useContext } from 'react';
import { UserContext } from '../../UserContext';
import BeneficiaryTransferToggle from '../../../components/transfer/beneficiary-transfer-toggle';

const COLORS = {
  black: "#000000",
  gold: "#B8860B",
  gray: "#9CA3AF",
  white: "#FFFFFF",
  darkGray: "#1F2937",
  lightGray: "#F3F4F6",
};



const TransferScreen = () => {
    //  Access user data and updater function from context
    const { user, setUser } = useContext(UserContext);
  const [selectedMode, setSelectedMode] = useState('Other Bank');
  const [showBankModal, setShowBankModal] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null); // Stores the selected bank object { id, name }
  const [saveBeneficiary, setSaveBeneficiary] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pin, setPin] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [receiverName, setReceiverName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [bankSearchQuery, setBankSearchQuery] = useState(''); // New state for bank search
  const [transectionHistory, setTransectionHistory] = useState([{
                    reference: "",
                    sender: "",
                    sender_account: "",
                    receiver: "",
                    receiver_bank: "",
                    amount: "",
                    description: "",
                    date: "", }]); // State to hold transfer history data

 
  // this hold the all the transfer  value as an objecet   
  const [transferDetails, setTransferDetails] = useState({
    account_number: '',
    amount: '',
    description: '',
    
  })

  // this hold all the transfer error as an object
  const [errors, setErrors] = useState({
    account_number: '',
    amount: '',
    description: '',
    bank_id: '',
  });

  const router = useRouter();

    // this Function handles the Authentication of User Transfer
    const handleAuthenticateBankDetails = async () => {
      
      // empty error state and set is loading to be true
      setReceiverName(''); // Clear previous receiver name before attempting new authentication
      setErrors({account_number: '',amount: '',description: '',bank_id: '',});
      setIsLoading(true);
      setSaveBeneficiary(false); // Reset saveBeneficiary when looking up account

        try {

            // Send request to laravel
             const response = await axios.post(`${API_URL}/transfer/authenticateBankDetails/${user.id}`,{
                  // send the input data to laravel
                  account_number: transferDetails.account_number,
                  amount: transferDetails.amount,
                  description: transferDetails.description,
                  bank_id: selectedBank?.id,
             });

            const  responseData = response.data;
             if (responseData.status == "success") {
                setReceiverName(responseData.receiver_name); // Set the receiver name on successful authentication
                setShowConfirmModal(true)
             }

        } catch (error) { // handle errors from the API or network issues
                   const data = error.response?.data; // Safely extract response data if it exists
                  
                    // validation error from Laravel
                    if (data?.errors) { // check if there are validation errors in the response
                      setErrors({
                        account_number: data.errors.account_number?.[0] || "",
                        amount: data.errors.amount?.[0] || "",
                        description: data.errors.description?.[0] || "",
                        bank_id: data.errors.bank_id?.[0] || "",
                      });
                      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                    } else {
                      // other errors (e.g. connection issues)
                      const message = data?.message || "Connection failed. Something went wrong.";
                      Alert.alert("Failed", message);
                    } 
        
        
           } finally { // reset loading state after the login process is complete, regardless of success or failure
             setIsLoading(false);
           }
    }

    // Function to handle Biometric Transfer
    const handleBiometricTransfer = async () => {
      // 1. Validation Check: Ensure user has met the validation (receiver name exists)
      if (!receiverName || !transferDetails.amount || !transferDetails.account_number) {
          Alert.alert("Validation Incomplete", "Please ensure account details are validated and amount is entered before using biometrics.");
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          return;
      }

      try {
          // 2. Check if Biometrics is enabled in Secure Storage (Local Verification)
          // const biometricEnabled = await SecureStore.getItemAsync('biometric_token');
          const biometricEnabled = await SecureStore.getItemAsync('biometric_token');

          if (!biometricEnabled ) {
              Alert.alert("Biometrics Not Set Up", "Please enable fingerprint authentication in your profile settings before using this feature.");
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
              return;
          }

          // 3. Check if hardware supports biometrics
          const hasHardware = await LocalAuthentication.hasHardwareAsync();
          const isEnrolled = await LocalAuthentication.isEnrolledAsync();

          if (!hasHardware || !isEnrolled) {
              Alert.alert("Biometrics Not Available", "Please enable biometrics in your device settings.");
              return;
          }

          // 3. Trigger Biometric Authentication
          const auth = await LocalAuthentication.authenticateAsync({
              promptMessage: `Authorize transfer of $${transferDetails.amount} to ${receiverName}`,
              fallbackLabel: 'Use Passcode',
          });

          if (auth.success) {
              setIsLoading(true);
              // 4. Send request to the new Biometric Transfer Controller
              const response = await axios.post(`${API_URL}/transfer/biometric-transfer`, {
                  user_id: user.id,
                  account_number: transferDetails.account_number,
                  amount: transferDetails.amount,
                  description: transferDetails.description,
                  bank_id: selectedBank?.id,
                  bank_name: selectedBank?.name
              });

              if (response.data.status === "success") {
                  setTransectionHistory([response.data.transaction]);
                  setShowSuccessModal(true);
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              } else {
                  Alert.alert("Transfer Failed", response.data.message);
              }
          }
      } catch (error) {
          // console.error("Biometric Error:", error);
          const message = error.response?.data?.message || "An error occurred during biometric transfer.";
          Alert.alert("Error", message);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } finally {
          setIsLoading(false);
      }
    };

    // this Function is called during useEffect
    const handleAccountLookup = async () => {
      
      // empty error state and set is loading to be true
      setReceiverName(''); // Clear previous receiver name before attempting new authentication
      setErrors({account_number: '',amount: '',description: '',bank_id: '',});
      setIsLoading(true);
      setSaveBeneficiary(false); // Reset saveBeneficiary when authenticating new bank details

        try {

            // Send request to laravel
             const response = await axios.post(`${API_URL}/transfer/authenticateBankDetails/${user.id}`,{
                  // send the input data to laravel
                  account_number: transferDetails.account_number,
                  amount: "100",
                  description: transferDetails.description,
                  bank_id: selectedBank?.id,
             });

            const  responseData = response.data;
             if (responseData.status == "success") {
                setReceiverName(responseData.receiver_name); // Set the receiver name on successful authentication

                setErrors({}); // empty all error state if Recipant is found
             }

        } catch (error) { // handle errors from the API or network issues
                   const data = error.response?.data; // Safely extract response data if it exists
                  
                    // validation error from Laravel
                    if (data?.errors) { // check if there are validation errors in the response
                      setErrors({
                        account_number: data.errors.account_number?.[0] || "",
                        amount: data.errors.amount?.[0] || "",
                        description: data.errors.description?.[0] || "",
                        bank_id: data.errors.bank_id?.[0] || "",
                      });
                    } else {
                      // other errors (e.g. connection issues)
                      const message = data?.message || "Connection failed. Something went wrong.";
                      Alert.alert("Failed", message);
                    } 
        
        
           } finally { // reset loading state after the login process is complete, regardless of success or failure
             setIsLoading(false);
           }
    }

  // Run only when selectedBank or account_number changes 
  useEffect(() => {
    if (!selectedBank || transferDetails.account_number.length < 9) return;
      handleAccountLookup(); 
  }, [selectedBank, transferDetails.account_number]);
  



  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      > 
      <ScrollView contentContainerStyle={styles.content}>

        {/* Top Action Row: History and Saved */}
        <View style={styles.topActionRow}>
          <TouchableOpacity style={styles.topActionButton} onPress={() => router.push("/pages/navigate/transfer-history")}>
            <Ionicons name="time-outline" size={20} color={COLORS.gold} />
            <Text style={styles.topActionText}>Transfer History</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.topActionButton}  onPress={() => router.push("/pages/navigate/saved-transfer")}>
            <Ionicons name="save-outline" size={20} color={COLORS.gold} />
            <Text style={styles.topActionText}>Saved Transfer</Text>
          </TouchableOpacity>
        </View>

        {/* Select Transfer Mode */}
        <Text style={styles.sectionLabel}>Select Transfer Mode</Text>
        <View style={styles.modeRow}>
          {['Own Accounts', 'Z-ton Bank', 'Other Bank'].map((mode) => (
            <TouchableOpacity 
              key={mode} 
              style={[
                styles.modeItem, 
                selectedMode === mode && styles.selectedModeItem
              ]}
              onPress={() => setSelectedMode(mode)}
            >
              <Text style={[
                styles.modeText, 
                selectedMode === mode && styles.selectedModeText
              ]}>
                {mode}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Input Fields */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Select Source Account</Text>
          <TouchableOpacity style={styles.pickerBox}>
            <Text style={styles.pickerText}>{user.account_number} (${user.balance})</Text>
            <Ionicons name="chevron-down" size={20} color={COLORS.gray} />
          </TouchableOpacity>
        </View>

        {/* Select Bank (Conditional for 'Other Bank' mode) */}
        {selectedMode === "Other Bank" ? (          
          <View style={styles.inputGroup} >
          <Text style={styles.label}>Select Bank</Text>
          <TouchableOpacity 
            style={styles.pickerBox} 
            onPress={() => setShowBankModal(true)}
          >
           <Text style={styles.pickerText}>{selectedBank ? selectedBank.name : "Choose Bank"}</Text>
            <Ionicons name="chevron-down" size={20} color={COLORS.gray} />
          </TouchableOpacity>
           {errors.bank_id && <Text style={styles.errorText}>{errors.bank_id}</Text>}
        </View> )
         : null }
       

        {/* Select Destination Account */}
        {selectedMode !== "Own Accounts" ? (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Select Destination Account</Text>
            <TextInput 
              style={styles.input}
              placeholder="Enter account number"
              placeholderTextColor={COLORS.gray}
              keyboardType="numeric" // Keep numeric for account number
              value={transferDetails.account_number}
              onChangeText={text => {
                setTransferDetails({...transferDetails, account_number: text});
                setReceiverName(''); // Clear receiver name if account number is changed
                setSaveBeneficiary(false); // Reset saveBeneficiary when account number changes
              }}
            />
            {errors.account_number && <Text style={styles.errorText}>{errors.account_number}</Text>}
          </View>
        ) : null}

        {/* Display Receiver Name if authenticated */}
        {receiverName ? (
          <View style={styles.receiverNameContainer}>
            <Text style={styles.receiverNameLabel}>Transfer to:</Text>
            <Text style={styles.receiverNameText}>{receiverName}</Text>
          </View>
        ) : null}

        {/* Horizontal Divider */}
        <View style={styles.horizontalDivider} />

        {/* Quick Select Beneficiary */}
        {selectedMode !== "Own Accounts" ? ( 
        <TouchableOpacity 
          style={styles.quickSelectRow} 
          onPress={() => router.push("/pages/navigate/select-beneficiary")}
        >
          <Text style={styles.quickSelectText}>Quick Select Beneficiary? <Text style={styles.goldText}>Choose from Saved</Text></Text>
          <Ionicons name="chevron-forward" size={16} color={COLORS.gold} />
        </TouchableOpacity>
        ) : null}

        
        {/* Amount Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Amount</Text>
          <TextInput 
            style={styles.input}
            placeholder="Enter Amount"
            placeholderTextColor={COLORS.gray}
            keyboardType="numeric"
            onChangeText={text=>setTransferDetails({...transferDetails,amount:text})}
            value={transferDetails.amount}
          />
           {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
        </View>
        

       {/* Transaction Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Transaction Description</Text>
          <TextInput 
            style={styles.input}
            placeholder="Add a note (Optional)"
            placeholderTextColor={COLORS.gray}
            onChangeText={text=>setTransferDetails({...transferDetails,description:text})}
            value={transferDetails.description}
          />
           {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
        </View>

        {/* Save Beneficiary Transfer Toggle pass .props */}
        <BeneficiaryTransferToggle
          styles={styles}
          saveBeneficiary={saveBeneficiary}
          setSaveBeneficiary={setSaveBeneficiary}
          receiverName={receiverName}
          transectionHistory={transectionHistory}
        />

        {/* Footer Actions: Continue and Fingerprint */}
        <View style={styles.footerRow}>
           <TouchableOpacity style={styles.continueButton} onPress={() => handleAuthenticateBankDetails()}>
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) :  <Text style={styles.continueButtonText}>CONTINUE</Text> }
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.fingerprintButton, isLoading && { opacity: 0.5 }]} 
            onPress={handleBiometricTransfer}
            disabled={isLoading}
          >
            <Ionicons name="finger-print" size={44} color={COLORS.gold} />
          </TouchableOpacity>
        </View>

      </ScrollView>
      </KeyboardAvoidingView>




     {/*NOTE:: THE BELOW SECTION HANDLES THE MODEL OF TRANSFER  */}

      {/* Bank Selection Modal .props passing approach*/}
      <BankSelectionModal 
        styles={styles}
        showBankModal={showBankModal}
        bankSearchQuery={bankSearchQuery}
        setBankSearchQuery={setBankSearchQuery}
        selectedBank={selectedBank}
        setSelectedBank={setSelectedBank}
        setShowBankModal={setShowBankModal}
      />

      {/* Confirm Transfer Modal .props passing approach*/}
      <ConfirmTransferModal
        styles={styles}
        showConfirmModal={showConfirmModal}
        setShowConfirmModal={setShowConfirmModal}
        pin={pin}
        setPin={setPin}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setShowSuccessModal={setShowSuccessModal}
        receiverName={receiverName}
        accountNumber={transferDetails.account_number}
        bankName={selectedBank?.name}
        userId={user.id}
        amount={transferDetails.amount}
        description={transferDetails.description}
        bankId={selectedBank?.id}
        setTransectionHistory={setTransectionHistory}
      />

      {/*Transfer Success Modal .props accepting approach*/}
      <TransferSuccessModal
        styles={styles}
        showSuccessModal={showSuccessModal}
        setShowSuccessModal={setShowSuccessModal}
        receiverName={receiverName}
        accountNumber={transferDetails.account_number}
        bankName={selectedBank?.name}
        amount={transferDetails.amount}
        transectionHistory={transectionHistory}
        setTransferDetails={setTransferDetails}
        setSelectedBank={setSelectedBank}
        setReceiverName={setReceiverName}
      />


    </SafeAreaView>
  );
};






export default TransferScreen

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  content: { padding: 20 },
  topActionRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 25 
  },
  topActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    width: '48%',
  },
  topActionText: { marginLeft: 8, fontSize: 12, fontWeight: '600', color: COLORS.black },
  sectionLabel: { fontSize: 14, fontWeight: 'bold', color: COLORS.black, marginBottom: 15 },
  modeRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 25 
  },
  modeItem: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    width: '31%',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: COLORS.lightGray,
  },
  selectedModeItem: { backgroundColor: COLORS.black },
  modeText: { fontSize: 11, color: COLORS.black, fontWeight: '600' },
  selectedModeText: { color: COLORS.white },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 13, color: COLORS.gray, marginBottom: 8, fontWeight: '500' },
  input: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    color: COLORS.black,
  },
  pickerBox: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerText: { fontSize: 16, color: COLORS.black, fontWeight: '500' },

  horizontalDivider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: 25, // Adjust spacing as needed
  }, 
  quickSelectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: -10,
  },
  quickSelectText: {
    fontSize: 13,
    color: COLORS.gray,
    fontWeight: '500',
  },
  // goldText: { color: COLORS.gold, fontWeight: 'bold' },
  errorText:{
    color:"red",
    fontSize:12,
    fontWeight:"500",
  },
  // Modal Styles
  bankModalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: '75%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  modalCloseButton: { padding: 5 },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  modalSearchInput: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    margin: 15,
    fontSize: 16,
    color: COLORS.black,
  },
  bankListItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: 12, 
    paddingHorizontal: 20, 
    borderBottomWidth: 1, 
    borderBottomColor: '#F0F0F0' 
  },
  bankListItemText: { fontSize: 16, color: COLORS.black },

  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 10,
  },
  scheduleTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.black },
  scheduleSubtitle: { fontSize: 12, color: COLORS.gray },
  footerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
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
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  emptyText: { color: COLORS.gray, fontSize: 16 },

  // Confirm Modal Specific Styles
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

  // Success Modal Styles
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
  successIconContainer: {
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 10,
  },
  successMessage: {
    fontSize: 15,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  successButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
  },
  outlineButton: {
    flex: 0.48,
    borderWidth: 1,
    borderColor: COLORS.gold,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  outlineButtonText: { color: COLORS.gold, fontWeight: 'bold', fontSize: 14 },
  successCloseButton: {
    backgroundColor: COLORS.black,
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  successCloseButtonText: { color: COLORS.white, fontWeight: 'bold', fontSize: 16 },

  // New styles for receiver name display
  receiverNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20, // Add some space below it
  },
  receiverNameLabel: { fontSize: 13, color: COLORS.gray, marginRight: 8, fontWeight: '500' },
  receiverNameText: { fontSize: 16, fontWeight: 'bold', color: COLORS.black },
});

import { StyleSheet, Text, View, TouchableOpacity, Modal, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '../../app/server/config';
import { useRouter } from 'expo-router';
import { useState, useContext } from 'react';
import { UserContext } from '../../app/UserContext';
const COLORS = {
  black: "#000000",
  gold: "#B8860B",
  gray: "#9CA3AF", 
  white: "#FFFFFF", 
  darkGray: "#1F2937",
  lightGray: "#F3F4F6",
};

const TransferSuccessModal = ({
  styles, 
  showSuccessModal, 
  setShowSuccessModal, 
  receiverName, 
  accountNumber, 
  bankName, 
  amount, 
  transectionHistory,
  // Added setters to reset form fields
  setTransferDetails,
  setSelectedBank,
  setReceiverName,
  saveBeneficiary,
  setSaveBeneficiary
}) => { 
  const { user } = useContext(UserContext);
  const [isPaymentSaved, setIsPaymentSaved] = useState(false);

  const router = useRouter();

  // Function to handle "View Receipt" button press, navigating to the receipt page with transaction details
  const handleViewRecelpt = () => {
       router.push({
        pathname: '/pages/navigate/transection-details', // Path to the receipt page
        params: {  // Pass the transaction details as parameters to the receipt page
                    // Note: all this are the details that we get from the response of the transfer API call from confirm-transfer-model.jsx and we set it to the transectionHistory state so that we can use it on the receipt page without having to make another API call to fetch the transaction details again
          reference: transectionHistory[0].reference,
          sender: transectionHistory[0].sender,
          sender_account: transectionHistory[0].sender_account,
          receiver: transectionHistory[0].receiver,
          receiver_bank: transectionHistory[0].receiver_bank,
          amount: transectionHistory[0].amount,
          description: transectionHistory[0].description,
          date: transectionHistory[0].date,
        },
       });
  }


  // This Function  help to send request to laravel to saved the user transfer
  const handleSavePayment = async () => {
    if (!user || !user.id || !transectionHistory[0]) {
      Alert.alert("Error", "User data or transaction history is missing.");
      return;
    }

    // Extract relevant data from transectionHistory
    const transaction = transectionHistory[0];

    try {
      // Make API call to save the transfer
      const response = await axios.post(`${API_URL}/transfer/save-transfer`, {
            user_id: user.id,
            reference: transaction.reference,
            sender_name: transaction.sender,
            sender_account: transaction.sender_account,
            receiver_name: transaction.receiver,
            receiver_bank: transaction.receiver_bank,
            receiver_account: accountNumber, // Use accountNumber from props for accuracy
            amount: transaction.amount,
            description: transaction.description,
            transaction_date: transaction.date,
      });

      if (response.data.status === "success") {
        setIsPaymentSaved(true);
        Alert.alert("Success", "Payment saved successfully!");
      } else {
        Alert.alert("Error", response.data.message || "Failed to save payment.");
      }
    } catch (error) {
      console.error("Error saving payment:", error);
      Alert.alert("Error", error.response?.data?.message || "An unexpected error occurred while saving payment.");
    }
  };

  // Function to reset all form fields and UI states before closing
  const handleClose = () => {
    setShowSuccessModal(false);
      
    // Reset parent form fields (if setters are passed as props)
    if (setTransferDetails) setTransferDetails({});
    if (setSelectedBank) setSelectedBank(null);
    if (setReceiverName) setReceiverName('');
    if (saveBeneficiary) setSaveBeneficiary(false);
    
    // Reset local modal state so the next transfer doesn't start as "Saved"
    setIsPaymentSaved(false);
  };


  return (
    <>
    
      {/*Transfer Success Modal .props accepting approach */}
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
            
            <Text style={styles.successTitle}>Transfer Successful</Text>
            <Text style={styles.successMessage}>
              Your transfer of <Text style={{ fontWeight: 'bold', color: COLORS.black }}>${amount}</Text> to <Text style={{ fontWeight: 'bold', color: COLORS.black }}>{receiverName}</Text> ({bankName} - {accountNumber}) was successful.
            </Text>

            <View style={styles.successButtonRow}>
              <TouchableOpacity style={styles.outlineButton} onPress={() => handleViewRecelpt()}>
                <Text style={styles.outlineButtonText}>View Receipt</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.outlineButton, isPaymentSaved && styles.savedButton]}
                onPress={handleSavePayment}
                disabled={isPaymentSaved}
              >
                <Text style={[styles.outlineButtonText, isPaymentSaved && styles.savedButtonText]}>{isPaymentSaved ? "Saved" : "Save Payment"}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.successCloseButton}
              onPress={() => handleClose()}
            >
              <Text style={styles.successCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </>
  )
}

export default TransferSuccessModal 

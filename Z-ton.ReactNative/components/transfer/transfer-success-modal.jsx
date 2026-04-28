import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, TextInput, Switch, Modal, FlatList, StatusBar, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '../../app/server/config';
import { useRouter } from 'expo-router';
const COLORS = {
  black: "#000000",
  gold: "#B8860B",
  gray: "#9CA3AF", 
  white: "#FFFFFF", 
  darkGray: "#1F2937",
  lightGray: "#F3F4F6",
};


const TransferSuccessModal = ({styles, showSuccessModal, setShowSuccessModal, receiverName, accountNumber, bankName, amount,transectionHistory}) => { 

  const router = useRouter();

  // Function to handle "View Receipt" button press, navigating to the receipt page with transaction details
  const handleViewRecelpt = () => {
       router.push({
        pathname: '/pages/navigate/transection-receipt', // Path to the receipt page
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
              <TouchableOpacity style={styles.outlineButton}>
                <Text style={styles.outlineButtonText}>Save Payment</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.successCloseButton}
              onPress={() => setShowSuccessModal(false)}
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

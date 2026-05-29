import {  Text, View,  TouchableOpacity,  Modal,  ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import axios from 'axios';
import { API_URL } from '../../app/server/config';
const COLORS = {
  black: "#000000", 
  gold: "#B8860B",
  gray: "#9CA3AF",
  white: "#FFFFFF", 
  darkGray: "#1F2937",
  lightGray: "#F3F4F6",
};
const ConfirmTransferModal = ({styles, showConfirmModal, setShowConfirmModal, pin, setPin, isLoading,setIsLoading,setShowSuccessModal,receiverName, accountNumber, bankName, amount, description, bankId, userId,setTransectionHistory}) => {
 
    // Handle number press for PIN input
    const handleNumberPress = (num) => {
        if (pin.length < 4 && !isLoading) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setPin(prev => prev + num);
        }
    };

    // Handle backspace for PIN input
    const handleBackspace = () => {
        if (!isLoading) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setPin(pin.slice(0, -1));
        }
    };

    // Simulate transfer action
   const handleTransfer = async ()  => {
    setIsLoading(true);
    // Simulate an API call delay
     try {

            // send response to laravel
            const response = await axios.post(`${API_URL}/transfer/confirm-user-transfer`,{
                pin: pin, // the pin is design to hold 4 digite
                userId: userId, // Ensure userId is sent
                account_number: accountNumber, // Ensure account_number is sent
                bank_id: bankId, // Ensure bankId is sent
                amount: amount, // Ensure amount is sent
                description: description, // Ensure description is sent
            });

            const responseData = response.data;

            if (responseData.status === "success") {

                setIsLoading(false);
                setShowConfirmModal(false);
                setShowSuccessModal(true);
                setPin(''); // Clear PIN after successful transfer

                // Update transfer history state with the new transaction details from the response
                // so that we can use it on the receipt page without having to make another API call to fetch the transaction details again
                setTransectionHistory([{
                    reference: responseData.reference || "",
                    sender: responseData.sender || "",
                    sender_account: responseData.sender_account || "",
                    receiver: responseData.receiver || "",
                    receiver_bank: responseData.receiver_bank || "",
                    amount: responseData.amount || "",
                    description: responseData.description || "",
                    date: responseData.date || "",
                }])
                console.log("Transfer successful:", responseData);

            } else {
                // Display general error message if status is not 'success'
                alert(responseData.message || "Transfer failed. Please try again."); 
                setIsLoading(false);
            }
     } catch (error) {
            let message = error.response?.data?.message || "An unexpected error occurred during transfer.";
            if (error.response?.data?.errors) {
                // If Laravel sent validation errors, format them for display
                const validationErrors = Object.values(error.response.data.errors).map(err => err.join('\n')).join('\n');
                message = `Validation Error:\n${validationErrors}`;
            }
            alert(message);
            setIsLoading(false);
     } finally {
        setIsLoading(false);
     }
   }

   
    return (
      <>
       {/* Confirm Transfer Modal .props accepting approach*/}
        <Modal
            animationType="slide"
            transparent={true}
            visible={showConfirmModal}
            onRequestClose={() => setShowConfirmModal(false)}
        >
            <View style={styles.modalOverlay}>
            <View style={styles.confirmModalContent}>
                <View style={styles.confirmHeader}>
                <Text style={styles.confirmTitle}>Confirm Transfer</Text>
                <TouchableOpacity onPress={() => { setShowConfirmModal(false); setPin(''); }}>
                    <Ionicons name="close" size={24} color={COLORS.black} />
                </TouchableOpacity>
                </View>

                <View style={styles.confirmBody}>
                <Text style={styles.confirmSubtext}>You are about to transfer the money to:</Text>
                <View style={styles.staticDetailBox}>
                    <Text style={styles.staticName}>{receiverName || 'Recipient'}</Text>
                    <Text style={styles.staticAccount}>{accountNumber || 'Account Number'} | {bankName || 'Bank'}</Text>
                </View>

                <View style={styles.modalHorizontalDivider} />

                <Text style={styles.enterPinLabel}>Enter PIN</Text>
                
                {/* PIN Display Dots */}
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

                {/* Custom Keypad */}
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
                    onPress={handleTransfer}
                >
                    {isLoading ? (
                    <ActivityIndicator color={COLORS.white} />
                    ) : (
                    <Text style={styles.modalTransferButtonText}>Confirm & Transfer</Text>
                    )}
                </TouchableOpacity>
                </View>
            </View>
            </View>
        </Modal>
      </>
  )
}

export default ConfirmTransferModal

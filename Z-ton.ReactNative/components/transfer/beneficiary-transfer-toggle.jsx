import { Text, View, Switch, Alert } from 'react-native';
import React from 'react'
import axios from 'axios';
import { API_URL } from '../../app/server/config';

const COLORS = { // Assuming COLORS is defined globally or imported
  black: "#000000",
  gold: "#B8860B",
  gray: "#9CA3AF",
  white: "#FFFFFF",
  darkGray: "#1F2937",
  lightGray: "#F3F4F6",
};

const BeneficiaryTransferToggle = ({styles,user, saveBeneficiary, setSaveBeneficiary, receiverName, selectedBank,transferDetails}) => {
  
  // Function to save Beneficiary 
  const handlesavedBeneficiary = async () => {
     try {
        const response = await axios.post(`${API_URL}/transfer/save-beneficiary`, {
            sender_id: user.id,
            receiver_name: receiverName,
            receiver_bank: selectedBank?.name, // Send only the bank name
            receiver_account: transferDetails.account_number,
        });
     } catch (error) {
        console.log("Error saving beneficiary:", error);
     }
  }


  return (
    <>
            {/* Save Beneficiary Transfer Toggle */}
            <View style={styles.scheduleRow}>
              <View>
                <Text style={styles.scheduleTitle}>Save Beneficiary</Text>
                <Text style={styles.scheduleSubtitle}>Save this account for future transfers</Text>
              </View>
              <Switch 
                trackColor={{ false: COLORS.gray, true: COLORS.gold }}
                thumbColor={COLORS.white}
                onValueChange={(newValue) => {
                  if (newValue) {
                    if (!receiverName) {
                      Alert.alert("Warning", "Please enter an account number to resolve the name first.");
                      return;
                    }
                    setSaveBeneficiary(true);
                    handlesavedBeneficiary();
                  } else {
                    setSaveBeneficiary(false);
                  }
                }}
                value={saveBeneficiary}
              />
            </View>
    </>
  )
}

export default BeneficiaryTransferToggle

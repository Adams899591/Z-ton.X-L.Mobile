import { Text, View, Switch } from 'react-native';
import React from 'react'
const COLORS = { // Assuming COLORS is defined globally or imported
  black: "#000000",
  gold: "#B8860B",
  gray: "#9CA3AF",
  white: "#FFFFFF",
  darkGray: "#1F2937",
  lightGray: "#F3F4F6",
};

// const BeneficiaryTransferToggle = ({styles,saveBeneficiary,setSaveBeneficiary,receiverName,transectionHistory}) => {
const BeneficiaryTransferToggle = ({styles, saveBeneficiary, setSaveBeneficiary, receiverName}) => {
  // Removed unused transectionHistory prop and console.log

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
                disabled={!receiverName} // Disable the switch if no receiverName is present
              />
            </View>
    </>
  )
}

export default BeneficiaryTransferToggle


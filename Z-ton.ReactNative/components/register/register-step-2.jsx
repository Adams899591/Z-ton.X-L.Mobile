import React from 'react'
import { View, Text, TextInput } from 'react-native'

function RegisterStep2({ styles, COLORS, accountNumber, setAccountNumber, errorAccountNumber }) {
  return (
    <>
              {/* Verify Account section Step 2 */}
       
                   {/* Verify Account */}
                   <View style={styles.introSection}>
                     <Text style={styles.welcomeText}>Verify Account</Text>
                     <Text style={styles.subText}>We've generated your account number. Enter it below to activate and receive your welcome credit.</Text>
                   </View>
       
                   {/* Account Number */}
                   <View style={styles.inputGroup}>
                     <Text style={styles.label}>Account Number</Text>
                     <TextInput
                       style={styles.input}
                       placeholder="Enter 10-digit account number"
                       placeholderTextColor={COLORS.gray}
                       keyboardType="numeric"
                       maxLength={10}
                       onChangeText={setAccountNumber}
                       value={accountNumber}
                     />
                     {errorAccountNumber && <Text style={styles.errorText}>{errorAccountNumber}</Text>}
                   </View>
    </>
  )
}

export default RegisterStep2
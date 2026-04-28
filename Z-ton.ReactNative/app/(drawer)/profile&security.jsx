import React, { useContext, useState } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
} from 'react-native';

import AccountDetails from '../../components/profile&security/account-details';
import SecuritySettings from '../../components/profile&security/security-settings';
import FingerprintVerificationModal from '../../components/profile&security/fingerprint-verification-modal';
import { UserContext } from '../UserContext';

const COLORS = { // Define colors for consistency
  black: "#000000",
  gold: "#B8860B",
  gray: "#9CA3AF",
  white: "#FFFFFF",
  darkGray: "#1F2937",
  lightGray: "#F9FAFB",
};

const ProfileSecurityScreen = () => {

  
       // Access user data and updater function from context
        const { user, setUser } = useContext(UserContext); 
  const [isFingerprintEnabled, setIsFingerprintEnabled] = useState(!!user.biometric_token);
  const [modalVisible, setModalVisible] = useState(false);
 
    

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        
              {/* Account Details Props */}
              <AccountDetails styles={styles} user={user}/>
            

              <View style={styles.divider} />

              {/* Security Settings Props */}
              <SecuritySettings 
                    styles={styles}
                    user={user}
                    setModalVisible={setModalVisible} 
                    isFingerprintEnabled={isFingerprintEnabled}
                    setIsFingerprintEnabled={setIsFingerprintEnabled}   
              />

      </ScrollView>

            {/* Fingerprint Verification Modal Props*/}
            <FingerprintVerificationModal
                styles={styles}
                user={user}
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                setIsFingerprintEnabled={setIsFingerprintEnabled}
            />

    </SafeAreaView>
  );
};

export default ProfileSecurityScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  content: { padding: 25 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.black, marginBottom: 20 },
  formGroup: { marginBottom: 20 },
  label: { fontSize: 14, color: COLORS.gray, marginBottom: 8, fontWeight: '500' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  input: { flex: 1, paddingVertical: 15, paddingHorizontal: 10, fontSize: 16, color: COLORS.black },
  saveButton: { backgroundColor: COLORS.darkGray, padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  saveButtonText: { color: COLORS.white, fontWeight: 'bold', fontSize: 16 },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 30 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.lightGray, padding: 20, borderRadius: 15 },
  settingInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  settingTextContainer: { marginLeft: 15, flex: 1 },
  settingLabel: { fontSize: 16, fontWeight: 'bold', color: COLORS.black },
  settingSubLabel: { fontSize: 12, color: COLORS.gray, marginTop: 2 },
  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalView: { width: '85%', backgroundColor: COLORS.white, borderRadius: 30, padding: 35, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
  closeModal: { position: 'absolute', right: 20, top: 20 },
  iconCircle: { width: 140, height: 140, borderRadius: 70, backgroundColor: COLORS.lightGray, justifyContent: 'center', alignItems: 'center', marginBottom: 15, borderWidth: 2, borderColor: COLORS.gold },
  scanningLine: { position: 'absolute', width: '70%', height: 3, borderRadius: 2, opacity: 0.8 },
  progressContainer: { width: '100%', height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, overflow: 'hidden', marginTop: 10, marginBottom: 20 },
  progressBar: { height: '100%', backgroundColor: COLORS.gold },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.black, marginBottom: 15 },
  modalText: { textAlign: 'center', color: COLORS.gray, fontSize: 16, lineHeight: 24, marginBottom: 10 },
  holdStatus: { textAlign: 'center', color: COLORS.darkGray, fontSize: 14, marginBottom: 20 },
  verifyButton: { backgroundColor: COLORS.gold, paddingVertical: 15, paddingHorizontal: 40, borderRadius: 30 },
  verifyButtonText: { color: COLORS.white, fontWeight: 'bold', fontSize: 16 },
});

import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Pressable,
  Modal,
  Alert,
  Animated, // Import Animated for animation
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication'; // Import LocalAuthentication
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import * as Haptics from 'expo-haptics';
import axios from 'axios';
import { UserContext } from '../../app/UserContext';
import { API_URL } from '../../app/server/config';

const COLORS = { // Define colors for consistency
  black: "#000000",
  gold: "#B8860B",
  gray: "#9CA3AF",
  white: "#FFFFFF",
  darkGray: "#1F2937",
  lightGray: "#F9FAFB",
};


const FingerprintVerificationModal = ({user,styles,modalVisible,setModalVisible,setIsFingerprintEnabled}) => {

  // const { user, setUser } = useContext(UserContext);
  const [isHolding, setIsHolding] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const scanningLineAnim = useRef(new Animated.Value(0)).current; // For scanning line animation
  const timerRef = useRef(null); // Ref to store the 5-second timer
  const progressIntervalRef = useRef(null); // Ref to update the progress indicator


  
  // function to start the scanning animation (a line moving up and down over the fingerprint icon)
  const startScanningAnimation = () => {
    scanningLineAnim.setValue(0); // Reset animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanningLineAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(scanningLineAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

   // function to stop the scanning animation and reset the position of the scanning line
  const stopScanningAnimation = () => {
    scanningLineAnim.stopAnimation();
    scanningLineAnim.setValue(0); // Reset position
  };


  // function to clean up timers and intervals to prevent memory leaks and unintended behavior when the user cancels authentication or when the component unmounts
  const cleanupTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };


  // useEffect to clean up timers and stop animations when the modal is closed, ensuring that if the user cancels the process or if the component unmounts, there are no lingering timers or animations running in the background
  useEffect(() => {
    if (!modalVisible) {
      stopScanningAnimation();
      cleanupTimer();
      setIsHolding(false);
    }
    return cleanupTimer;
  }, [modalVisible]);

  // 
  const translateY = scanningLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-45, 45], // Widened range to cover the 80px icon
  });

  // function to start the hold progress, which will update the holdProgress state every 50ms to create a visual progress indicator for the user as they hold the fingerprint icon, giving them feedback on how long they need to hold before authentication is triggered
  const startHoldProgress = () => {
    const duration = 5000;
    const intervalDuration = 50;
    let elapsed = 0;
    setHoldProgress(0);
    progressIntervalRef.current = setInterval(() => {
      elapsed += intervalDuration;
      setHoldProgress(Math.min(elapsed / duration, 1));
    }, intervalDuration);
  };

    // function to handle press in and out for the fingerprint icon (for visual feedback and hold-to-authenticate)
    function handlePressIn() {
        if (isAuthenticating) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setIsHolding(true);
        startScanningAnimation();
        cleanupTimer();
        startHoldProgress();
        timerRef.current = setTimeout(() => {
        handleBiometricAuthentication();
        }, 5000);
    }

    // function to handle press out, which will reset the hold state and stop the scanning animation if the user releases the icon before the 5-second threshold, ensuring that the authentication process is only triggered if they hold for the full duration
    function handlePressOut() {
        if (isAuthenticating) return;
        cleanupTimer();
        setIsHolding(false);
        setHoldProgress(0);
        stopScanningAnimation();
    }


  // Function to generate a 16-character random string (The "Crystal")
  const generateBiometricToken = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 16; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };


    // function to handle the biometric authentication process when the user successfully holds the fingerprint icon for 5 seconds, which will attempt to authenticate and provide feedback based on the result
  const handleBiometricAuthentication = async () => {
    cleanupTimer();
    setIsAuthenticating(true);
    setHoldProgress(1);
    try {   

      // this call the main finger print from the user ios 
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to enable Fingerprint Login',
        cancelLabel: 'Cancel',
      });

      if (result.success) {

          //  ================ this part handles submission to laravel ==================

          const newToken = generateBiometricToken();  // function that generate token 
          
          // 1. Save the biometric token to  SecureStore
          await SecureStore.setItemAsync("biometric_token", newToken);
     
          // 2. Save the token locally on the device
          await AsyncStorage.setItem("biometric_token", newToken);

          // 3. Send the token to Laravel to link it with this user
          await axios.post(`${API_URL}/auth/enable-biometric/${user.id}`, {
            biometric_token: newToken,
          });

            // =============================
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setIsFingerprintEnabled(true);
        Alert.alert("Success", "Fingerprint authentication enabled!");
      } else if (result.error === 'user_cancel') {
        Alert.alert("Cancelled", "Fingerprint authentication cancelled.");
      } else {
        Alert.alert("Authentication Failed", "Could not authenticate with fingerprint. Please try again.");
      }
    } catch (error) {
      console.error("Biometric authentication error:", error);
      Alert.alert("Error", "An error occurred during biometric authentication.");
    } finally {
      setIsAuthenticating(false);
      setIsHolding(false);
      setModalVisible(false);
      stopScanningAnimation();
    } 
  };



return (
    <>
      <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => { setModalVisible(false); stopScanningAnimation(); setIsFingerprintEnabled(false); }}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalView}>
                <TouchableOpacity 
                  style={styles.closeModal} 
                  onPress={() => { setModalVisible(false); stopScanningAnimation(); setIsFingerprintEnabled(false); }}
                >
                  <Ionicons name="close" size={24} color={COLORS.gray} />
                </TouchableOpacity>
    
                <Pressable
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                >
                  <View style={styles.iconCircle}>
                    <Ionicons name="finger-print" size={80} color={COLORS.gold} />
                    <Animated.View
                      style={[
                        styles.scanningLine,
                        {
                          backgroundColor: COLORS.gold, // Gold scanning line
                          transform: [{ translateY }],
                        },
                      ]}
                    />
                  </View>
                </Pressable>
                
                <View style={styles.progressContainer}>
                  <View style={[styles.progressBar, { width: `${Math.floor(holdProgress * 100)}%` }]} />
                </View>
                <Text style={styles.modalTitle}>Fingerprint Authentication</Text>
                <Text style={styles.modalText}>
                  Press and hold the fingerprint icon for 5 seconds to authenticate and enable biometric security.
                </Text>
                <Text style={styles.holdStatus}>
                  {isAuthenticating ? 'Authenticating...' : isHolding ? `Hold for ${Math.max(0, 5 - Math.floor(holdProgress * 5))}s` : 'Tap and hold to start.'}
                </Text>
    
                {/* The "Simulate Scan" button is removed as the process is now automatic */}
              </View>
            </View>
     </Modal>
    </>
  )
}

export default FingerprintVerificationModal

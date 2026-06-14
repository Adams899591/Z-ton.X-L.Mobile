import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import axios from 'axios';
import * as Haptics from 'expo-haptics';
import { API_URL } from '../../server/config';
import { useSafeAreaInsets } from 'react-native-safe-area-context';




const COLORS = {
  black: "#000000",
  gold: "#B8860B",
  gray: "#9CA3AF",
  white: "#FFFFFF",
  darkGray: "#1F2937",
  lightGray: "#F3F4F6",
  red: "#EF4444",
};

function ForgotPassword() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  const handleForgotPassword = async () => {
    setEmailError('');


    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      const data = response.data;

      if (data.status === "success") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert("Success", data.message || "Password reset link sent to your email.");
        router.push('/pages/views/login');
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert("Error", data.message || "Failed to send password reset link.");
      }
    } catch (error) {
      const data = error.response?.data;
      if (data?.errors?.email) {
        setEmailError(data.errors.email[0]);
      } else {
        Alert.alert("Error", data?.message || "Something went wrong. Please try again.");
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.darkGray} />

      {/* Header */}
      <View style={[styles.header, {  paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Forgot Password</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.welcomeText}>Reset Your Password</Text>
        <Text style={styles.subText}>
          Enter your email address below and we'll send you a link to reset your password.
        </Text>

        {/* Email Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor={COLORS.gray}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, isLoading && { opacity: 0.7 }]}
          onPress={handleForgotPassword}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.submitButtonText}>SEND RESET LINK</Text>
          )}
        </TouchableOpacity>

        {/* Back to Login Link */}
        <View style={styles.loginLinkContainer}>
          <Text style={styles.noAccountText}>Remembered your password? </Text>
          <TouchableOpacity onPress={() => router.push('/pages/views/login')}>
            <Text style={styles.loginLinkText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default ForgotPassword

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    // height: 70,
    paddingVertical: 15,
    backgroundColor: COLORS.darkGray,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.white },
  backButton: { padding: 5 },
  content: { flex: 1, padding: 25, paddingTop: 30 },
  welcomeText: { fontSize: 28, fontWeight: 'bold', color: COLORS.black, marginBottom: 10 },
  subText: { fontSize: 14, color: COLORS.gray, lineHeight: 20, marginBottom: 30 },
  inputGroup: { marginBottom: 20 },
  label: { color: COLORS.darkGray, fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 15,
    color: COLORS.black,
    fontSize: 16,
  },
  errorText: { color: COLORS.red, fontSize: 12, marginTop: 5 },
  submitButton: {
    backgroundColor: COLORS.black,
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 4,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  submitButtonText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
  loginLinkContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
  noAccountText: { color: COLORS.gray, fontSize: 14 },
  loginLinkText: { color: COLORS.gold, fontSize: 14, fontWeight: 'bold' },
});

import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import axios from 'axios';
import * as Haptics from 'expo-haptics';
import { API_URL } from '../../server/config';
import { useLocalSearchParams } from 'expo-router';

const COLORS = {
  black: "#000000",
  gold: "#B8860B",
  gray: "#9CA3AF",
  white: "#FFFFFF",
  darkGray: "#1F2937",
  lightGray: "#F3F4F6",
  red: "#EF4444",
};

function ResetPasswordScreen() {
  const router = useRouter();
  // Move the hook to the top level of the component
  const { token, email } = useLocalSearchParams();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const handleResetPassword = async () => {
    setNewPasswordError('');
    setConfirmPasswordError('');

    // get the token and email from the url query parameters
    // const { token, email } = useLocalSearchParams();
    console.log('Token:', token);
    console.log('Email:', email);


    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/reset-password`, {
        password: newPassword,
        password_confirmation: confirmPassword,
        token: token, // send the pass url token to laravel
        email: email, // send the pass url email to laravel
      });
      const data = response.data;

      if (data.status === "success") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert("Success", data.message || "Your password has been reset successfully.");
        router.replace('/pages/views/login');
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert("Error", data.message || "Failed to reset password.");
      }
    } catch (error) {
      const data = error.response?.data;
      if (data?.errors) {
        if (data.errors.password) setNewPasswordError(data.errors.password[0]);
        if (data.errors.password_confirmation) setConfirmPasswordError(data.errors.password_confirmation[0]);
      } else {
        Alert.alert("Error", data?.message || "Something went wrong. Please try again.");
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.darkGray} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/pages/views/forgot-password')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reset Password</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>

        {/* Set New Password */}
        <Text style={styles.welcomeText}>Set New Password</Text>
        <Text style={styles.subText}>
          Enter your new password below. Make sure it's strong and memorable.
        </Text>

        {/* New Password Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>New Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter new password"
            placeholderTextColor={COLORS.gray}
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          {newPasswordError ? <Text style={styles.errorText}>{newPasswordError}</Text> : null}
        </View>

        {/* Confirm Password Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirm New Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirm new password"
            placeholderTextColor={COLORS.gray}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, isLoading && { opacity: 0.7 }]}
          onPress={handleResetPassword}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.submitButtonText}>RESET PASSWORD</Text>
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
    </SafeAreaView>
  );
}

export default ResetPasswordScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 70,
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
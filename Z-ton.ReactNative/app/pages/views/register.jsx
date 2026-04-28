import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';

const COLORS = {
  black: "#000000",
  gold: "#B8860B",
  gray: "#9CA3AF",
  white: "#FFFFFF",
  darkGray: "#1F2937",
  lightGray: "#F3F4F6",
};

const RegisterScreen = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    nin: '',
    bvn: '',
    password: '',
    confirmPassword: '',
    receivedAccountNumber: '',
  });
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleAction = () => {
    if (step === 1) {
      // Move to account number verification step
      setStep(2);
    } else {
      // Finalize and redirect to dashboard
      console.log("Activating account and crediting:", formData);
      router.replace("/(drawer)/(tabs)/overview");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.darkGray} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => step === 2 ? setStep(1) : router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{step === 1 ? 'Create Account' : 'Activate Account'}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {step === 1 ? (
          <>
            <View style={styles.introSection}>
              <Text style={styles.welcomeText}>Join Z-ton Bank</Text>
              <Text style={styles.subText}>Enter your details and identification to get started.</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor={COLORS.gray}
                onChangeText={(text) => setFormData({ ...formData, fullName: text })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={COLORS.gray}
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={(text) => setFormData({ ...formData, email: text })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter phone number"
                placeholderTextColor={COLORS.gray}
                keyboardType="phone-pad"
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>NIN (National Identity Number)</Text>
              <TextInput
                style={styles.input}
                placeholder="11-digit NIN"
                placeholderTextColor={COLORS.gray}
                keyboardType="numeric"
                maxLength={11}
                onChangeText={(text) => setFormData({ ...formData, nin: text })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>BVN (Bank Verification Number)</Text>
              <TextInput
                style={styles.input}
                placeholder="11-digit BVN"
                placeholderTextColor={COLORS.gray}
                keyboardType="numeric"
                maxLength={11}
                onChangeText={(text) => setFormData({ ...formData, bvn: text })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Create a password"
                placeholderTextColor={COLORS.gray}
                secureTextEntry
                onChangeText={(text) => setFormData({ ...formData, password: text })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Repeat your password"
                placeholderTextColor={COLORS.gray}
                secureTextEntry
                onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
              />
            </View>

            <TouchableOpacity 
              style={styles.termsContainer} 
              onPress={() => setAgreeTerms(!agreeTerms)}
            >
              <Ionicons 
                name={agreeTerms ? "checkbox" : "square-outline"} 
                size={24} 
                color={COLORS.gold} 
              />
              <Text style={styles.termsText}>
                I agree to the <Text style={styles.linkText}>Terms of Service</Text> and <Text style={styles.linkText}>Privacy Policy</Text>
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.introSection}>
              <Text style={styles.welcomeText}>Verify Account</Text>
              <Text style={styles.subText}>We've generated your account number. Enter it below to activate and receive your welcome credit.</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Account Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter 10-digit account number"
                placeholderTextColor={COLORS.gray}
                keyboardType="numeric"
                maxLength={10}
                onChangeText={(text) => setFormData({ ...formData, receivedAccountNumber: text })}
              />
            </View>
          </>
        )}

        <TouchableOpacity style={styles.registerButton} onPress={handleAction}>
          <Text style={styles.registerButtonText}>{step === 1 ? 'REGISTER' : 'ACTIVATE & CREDIT'}</Text>
        </TouchableOpacity>

        {/* Login Link */}
        <View style={styles.loginLinkContainer}>
          <Text style={styles.noAccountText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/pages/views/login')}>
            <Text style={styles.loginLinkText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

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
  scrollContent: { padding: 25, paddingBottom: 40 },
  introSection: { marginBottom: 30 },
  welcomeText: { fontSize: 28, fontWeight: 'bold', color: COLORS.black, marginBottom: 10 },
  subText: { fontSize: 14, color: COLORS.gray, lineHeight: 20 },
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
  termsContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  termsText: { color: COLORS.black, marginLeft: 10, fontSize: 13, flex: 1 },
  linkText: { color: COLORS.gold, fontWeight: 'bold' },
  registerButton: {
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
  registerButtonText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
  loginLinkContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
  noAccountText: { color: COLORS.gray, fontSize: 14 },
  loginLinkText: { color: COLORS.gold, fontSize: 14, fontWeight: 'bold' },
});
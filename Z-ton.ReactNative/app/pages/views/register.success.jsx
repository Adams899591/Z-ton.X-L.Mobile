import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
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

function RegisterSuccess() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.darkGray} />
      
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark-circle" size={120} color={COLORS.gold} />
        </View>

        {/* Text Section */}
        <Text style={styles.title}>Registration Successful!</Text>
        <Text style={styles.welcomeText}>Welcome to Z-ton Bank</Text>
        
        <Text style={styles.description}>
          Your account has been created and activated successfully. You are now ready to experience seamless digital banking.
        </Text>

        {/* Login Button */}
        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={() => router.replace('/pages/views/login')}
        >
          <Text style={styles.loginButtonText}>SIGN IN TO GET STARTED</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Authorized by Z-ton X-L Bank PLC</Text>
      </View>
    </SafeAreaView>
  );
}

export default RegisterSuccess;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  iconContainer: {
    marginBottom: 40,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 18,
    color: COLORS.gold,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 15,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 50,
  },
  loginButton: {
    backgroundColor: COLORS.black,
    width: '100%',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  loginButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  footer: {
    paddingBottom: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: COLORS.gray,
    fontStyle: 'italic',
  },
});

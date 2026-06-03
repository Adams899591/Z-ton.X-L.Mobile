
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

const AccountRestricted = () => {
  const router = useRouter();


   return(
    <>
        <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.darkGray} />


        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.replace('/pages/views/login')} style={styles.backButton}>
            <Ionicons name="close-outline" size={28} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Security Notice</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.content}>
          {/* Security Icon Section */}
          <View style={styles.iconContainer}>
            <View style={styles.outerRing}>
              <View style={styles.pulseRing}>
                <Ionicons name="shield-half-outline" size={80} color={COLORS.gold} />
              </View>
            </View>
          </View>

          {/* Message Section */}
          <Text style={styles.title}>Access Restricted</Text>
          <Text style={styles.welcomeText}>TEMPORARY SECURITY HOLD</Text>

          <Text style={styles.description}>
            For your protection and to comply with global banking security regulations, your account dashboard is currently unavailable.
          </Text>

          <View style={styles.instructionCard}>
            <Ionicons name="information-circle" size={24} color={COLORS.gold} />
            <Text style={styles.instructionText}>
              To verify your identity and restore full access to your Z-ton Bank account, please speak with a security specialist.
            </Text>
          </View>

          <View style={styles.referenceContainer}>
            <Text style={styles.referenceLabel}>Reference ID:</Text>
            <Text style={styles.referenceValue}>ZTN-ERR-990124</Text>
          </View>

            {/* Action Buttons */}
            <TouchableOpacity
            style={styles.supportButton}
            onPress={() => router.push('/pages/views/contact-us')}
            >
            <Ionicons name="call" size={20} color={COLORS.white} style={{ marginRight: 10 }} />
            <Text style={styles.supportButtonText}>CONTACT SUPPORT</Text>
            </TouchableOpacity>

            <TouchableOpacity
            style={styles.loginLink}
            onPress={() => router.replace('/pages/views/login')}
            >
            <Text style={styles.loginLinkText}>Return to Sign In</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.footer}>
            <Text style={styles.footerText}>Authorized by Z-ton X-L Bank PLC</Text>
        </View>
        </SafeAreaView>
    </>
   )

};

export default AccountRestricted;

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
    elevation: 5,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.white },
  backButton: { padding: 5 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30 },
  iconContainer: { marginBottom: 40 },
  outerRing: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(184, 134, 11, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseRing: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(184, 134, 11, 0.2)',
  },
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.black, textAlign: 'center', marginBottom: 8 },
  welcomeText: { fontSize: 13, color: COLORS.gold, fontWeight: 'bold', marginBottom: 25, letterSpacing: 2 },
  description: { fontSize: 15, color: COLORS.gray, textAlign: 'center', lineHeight: 22, marginBottom: 35 },
  instructionCard: {
    flexDirection: 'row',
    backgroundColor: '#FAFAFA',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 25,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  instructionText: { flex: 1, marginLeft: 15, color: COLORS.darkGray, fontSize: 14, lineHeight: 20 },
  referenceContainer: {
    flexDirection: 'row',
    marginBottom: 40,
    alignItems: 'center',
  },
  referenceLabel: { fontSize: 12, color: COLORS.gray, marginRight: 5 },
  referenceValue: { fontSize: 12, color: COLORS.black, fontWeight: '600' },
  supportButton: {
    backgroundColor: COLORS.black,
    width: '100%',
    paddingVertical: 18,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  supportButtonText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
  loginLink: { marginTop: 25 },
  loginLinkText: { color: COLORS.gold, fontSize: 15, fontWeight: 'bold' },
  footer: { paddingBottom: 30, alignItems: 'center' },
  footerText: { fontSize: 12, color: COLORS.gray, fontStyle: 'italic' },
});

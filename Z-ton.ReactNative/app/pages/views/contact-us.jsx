import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const COLORS = {
  black: "#000000",
  gold: "#B8860B",
  gray: "#9CA3AF",
  white: "#FFFFFF",
  darkGray: "#1F2937",
  lightGray: "#F3F4F6",
};

const ContactUsScreen = () => {
  const router = useRouter();

  const ContactItem = ({ icon, label, value, onPress }) => (
    <TouchableOpacity style={styles.contactItem} onPress={onPress}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={20} color={COLORS.gold} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.itemLabel}>{label}</Text>
        <Text style={styles.itemValue}>{value}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={COLORS.gray} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact Us</Text>
        <View style={{ width: 40 }} />
      </View>

        {/* Phone Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Phone</Text>
          <View style={styles.horizontalLine} />
          <ContactItem 
            icon="call-outline" 
            label="Customer Care" 
            value="+234 800 123 4567" 
            onPress={() => Linking.openURL('tel:+2348001234567')}
          />
          <ContactItem 
            icon="call-outline" 
            label="Technical Support" 
            value="+234 800 987 6543" 
            onPress={() => Linking.openURL('tel:+2348009876543')}
          />
          <ContactItem 
            icon="alert-circle-outline" 
            label="Report Fraud" 
            value="+234 800 000 0000" 
            onPress={() => Linking.openURL('tel:+2348000000000')}
          />
        </View>

        {/* Email Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Email</Text>
          <View style={styles.horizontalLine} />
          <ContactItem 
            icon="mail-outline" 
            label="General Inquiries" 
            value="support@ztonbank.com" 
            onPress={() => Linking.openURL('mailto:support@ztonbank.com')}
          />
          <ContactItem 
            icon="chatbox-ellipses-outline" 
            label="Complaints" 
            value="complaints@ztonbank.com" 
            onPress={() => Linking.openURL('mailto:complaints@ztonbank.com')}
          />
        </View>

        {/* Social Media Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Social Media</Text>
          <View style={styles.horizontalLine} />
          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-facebook" size={32} color={COLORS.gold} />
              <Text style={styles.socialText}>Facebook</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-twitter" size={32} color={COLORS.gold} />
              <Text style={styles.socialText}>Twitter</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-instagram" size={32} color={COLORS.gold} />
              <Text style={styles.socialText}>Instagram</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Live Chat Action */}
        <TouchableOpacity style={styles.liveChatButton}>
          <Ionicons name="chatbubbles-outline" size={24} color={COLORS.white} />
          <Text style={styles.liveChatText}>Start Live Chat</Text>
        </TouchableOpacity>
        
        <Text style={styles.availabilityText}>Our team is available 24/7 to assist you.</Text>
      </ScrollView>
    </SafeAreaView>
  )
};

export default ContactUsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: COLORS.darkGray,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.white },
  backButton: { padding: 5 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  section: { marginBottom: 30 },
  sectionHeading: { fontSize: 20, fontWeight: 'bold', color: COLORS.black, marginBottom: 10 },
  horizontalLine: { height: 1, backgroundColor: COLORS.lightGray, marginBottom: 15 },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  textContainer: { flex: 1 },
  itemLabel: { fontSize: 12, color: COLORS.gray, fontWeight: '500' },
  itemValue: { fontSize: 15, color: COLORS.black, fontWeight: 'bold', marginTop: 2 },
  socialRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
  socialButton: { alignItems: 'center' },
  socialText: { fontSize: 12, color: COLORS.black, marginTop: 5, fontWeight: '500' },
  liveChatButton: {
    backgroundColor: COLORS.black,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    borderRadius: 12,
    marginTop: 10,
    elevation: 4,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  liveChatText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
  availabilityText: { textAlign: 'center', color: COLORS.gray, fontSize: 13, marginTop: 20 },
});
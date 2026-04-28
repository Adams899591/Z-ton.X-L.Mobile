import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
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

const AboutBankScreen = () => {
  const router = useRouter();

  const ValueItem = ({ icon, title, description }) => (
    <View style={styles.valueItem}>
      <View style={styles.valueIconContainer}>
        <Ionicons name={icon} size={24} color={COLORS.gold} />
      </View>
      <View style={styles.valueTextContainer}>
        <Text style={styles.valueTitle}>{title}</Text>
        <Text style={styles.valueDescription}>{description}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About Z-ton Bank</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Ionicons name="business" size={80} color={COLORS.gold} />
          <Text style={styles.heroTitle}>Z-ton X-L Bank PLC</Text>
          <Text style={styles.heroSubtitle}>Redefining Digital Excellence</Text>
        </View>

        {/* Story Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Story</Text>
          <Text style={styles.paragraph}>
            Founded on the principles of trust and innovation, Z-ton Bank has emerged as a leader in digital financial services. We bridge the gap between traditional banking reliability and the speed of modern technology.
          </Text>
          <Text style={styles.paragraph}>
            Our journey began with a simple mission: to make world-class banking accessible to everyone, everywhere, at any time.
          </Text>
        </View>

        {/* Mission & Vision */}
        <View style={styles.row}>
          <View style={[styles.card, { marginRight: 10 }]}>
            <Ionicons name="eye-outline" size={28} color={COLORS.gold} />
            <Text style={styles.cardTitle}>Our Vision</Text>
            <Text style={styles.cardText}>To be the world's most customer-centric digital bank.</Text>
          </View>
          <View style={[styles.card, { marginLeft: 10 }]}>
            <Ionicons name="rocket-outline" size={28} color={COLORS.gold} />
            <Text style={styles.cardTitle}>Our Mission</Text>
            <Text style={styles.cardText}>Empowering our users through seamless financial solutions.</Text>
          </View>
        </View>

        {/* Core Values */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Core Values</Text>
          <ValueItem 
            icon="shield-checkmark-outline" 
            title="Security First" 
            description="Protecting your assets with state-of-the-art encryption and security protocols."
          />
          <ValueItem 
            icon="flash-outline" 
            title="Innovation" 
            description="Constantly evolving our tools to provide the fastest banking experience."
          />
          <ValueItem 
            icon="people-outline" 
            title="Integrity" 
            description="Transparency in every transaction and honesty in every interaction."
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Licensed by the Central Bank of Nigeria (CBN)</Text>
          <Text style={styles.footerText}>© 2024 Z-ton X-L Bank PLC. All rights reserved.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutBankScreen;

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
  scrollContent: { padding: 20 },
  heroSection: { alignItems: 'center', marginVertical: 30 },
  heroTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.black, marginTop: 10 },
  heroSubtitle: { fontSize: 14, color: COLORS.gold, fontWeight: '600', letterSpacing: 1 },
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.black, marginBottom: 15 },
  paragraph: { fontSize: 15, color: COLORS.darkGray, lineHeight: 22, marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  card: { flex: 1, backgroundColor: COLORS.lightGray, padding: 15, borderRadius: 15, alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.black, marginVertical: 8 },
  cardText: { fontSize: 12, color: COLORS.gray, textAlign: 'center' },
  valueItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20, backgroundColor: COLORS.lightGray, padding: 15, borderRadius: 12 },
  valueIconContainer: { marginRight: 15, marginTop: 2 },
  valueTextContainer: { flex: 1 },
  valueTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.black, marginBottom: 4 },
  valueDescription: { fontSize: 14, color: COLORS.gray, lineHeight: 20 },
  footer: { marginTop: 20, paddingBottom: 40, alignItems: 'center' },
  footerText: { fontSize: 11, color: COLORS.gray, textAlign: 'center', marginBottom: 5 },
});
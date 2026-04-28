import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const COLORS = {
  black: "#000000",
  gold: "#B8860B",
  gray: "#9CA3AF",
  white: "#FFFFFF",
  darkGray: "#1F2937",
  lightGray: "#F3F4F6",
};
const AboutDeveloperScreen = () => {
  const router = useRouter();

  const SocialItem = ({ icon, label, onPress }) => (
    <TouchableOpacity style={styles.socialItem} onPress={onPress}>
      <View style={styles.socialIconCircle}>
        <Ionicons name={icon} size={20} color={COLORS.gold} />
      </View>
      <Text style={styles.socialLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About the Developer</Text>
        {/* Spacer for centering title, matching back button's typical width */}
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Image Section */}
        <View style={styles.imageContainer}> 
          <Image
            source={require('../../../assets/images/developer.jpg')} // <--- REPLACE THIS WITH YOUR ACTUAL IMAGE PATH
            style={styles.profileImage}
          />
          <Text style={styles.developerName}>Usman Adams</Text>
          <Text style={styles.developerTitle}>Full-Stack Web & Mobile Developer</Text>
        </View>

        {/* Introduction */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Introduction</Text>
          <Text style={styles.paragraph}>
            Hello! I'm Usman Adams, a passionate full-stack developer specializing in building robust web and mobile applications. My expertise spans across various modern technologies, with a strong focus on Laravel for efficient backend development in both web and mobile environments.
          </Text>
        </View>

        {/* Connect With Me */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connect with Me</Text>
          <View style={styles.socialGrid}>
            <SocialItem 
              icon="logo-linkedin" 
              label="LinkedIn" 
              // onPress={() => Linking.openURL('https://linkedin.com/in/your-profile')} 
            />
            <SocialItem 
              icon="mail-outline" 
              label="Email" 
              // onPress={() => Linking.openURL('mailto:adamsusman@example.com')} 
            />
            <SocialItem 
              icon="call-outline" 
              label="Call" 
              onPress={() => Linking.openURL('tel:+2348000000000')} 
            />
            <SocialItem 
              icon="logo-whatsapp" 
              label="WhatsApp" 
              // onPress={() => Linking.openURL('https://wa.me/2348000000000')} 
            />
            <SocialItem 
              icon="globe-outline" 
              label="Portfolio" 
              // onPress={() => Linking.openURL('https://your-portfolio.com')} 
            />
          </View>
        </View>
         
        {/* Education */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          <Text style={styles.paragraph}>I am currently a 300-level student at the Federal University Dutsin-Ma, pursuing a degree that complements my passion for software development.</Text>
        </View>

        {/* Skills & Expertise */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills & Expertise</Text>
          <Text style={styles.paragraph}>
            As a full-stack developer, I possess a versatile skill set covering both front-end and back-end development for web and mobile applications.
          </Text>
          <Text style={styles.paragraph}>
            My primary strength lies in backend development, where I extensively use **Laravel** to build robust, scalable, and secure APIs and systems. This expertise allows me to handle complex data management and business logic efficiently for diverse projects.
          </Text>
          <View style={styles.skillTagsContainer}>
            <Text style={styles.skillTag}>#FullStack</Text>
            <Text style={styles.skillTag}>#WebDevelopment</Text>
            <Text style={styles.skillTag}>#MobileDevelopment</Text>
            <Text style={styles.skillTag}>#Laravel</Text>
            <Text style={styles.skillTag}>#Backend</Text>
            <Text style={styles.skillTag}>#ReactNative</Text>
          </View>
        </View>

        {/* Featured Projects */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Projects</Text>
          <View style={styles.projectItem}>
            <Ionicons name="desktop-outline" size={24} color={COLORS.gold} style={styles.projectIcon} />
            <View style={styles.projectTextContent}>
              <Text style={styles.projectName}>Web Digital Banking Platform</Text>
              <Text style={styles.projectDescription}>A comprehensive and secure web-based banking solution featuring real-time transaction processing, account management, and an administrative dashboard.</Text>
            </View>
          </View>
          <View style={styles.projectItem}>
            <Ionicons name="briefcase-outline" size={24} color={COLORS.gold} style={styles.projectIcon} />
            <View style={styles.projectTextContent}>
              <Text style={styles.projectName}>CoreXBusiness</Text>
              <Text style={styles.projectDescription}>A professional corporate business website designed to streamline operations, showcase services, and enhance digital brand presence for modern enterprises.</Text>
            </View>
          </View>
          <View style={styles.projectItem}>
            <Ionicons name="home-outline" size={24} color={COLORS.gold} style={styles.projectIcon} />
            <View style={styles.projectTextContent}>
              <Text style={styles.projectName}>DevLux Estate</Text>
              <Text style={styles.projectDescription}>A comprehensive web system designed for modern real estate management, offering features for property listing, client management, and streamlined operations.</Text>
            </View>
          </View>
          <View style={styles.projectItem}>
            <Ionicons name="fast-food-outline" size={24} color={COLORS.gold} style={styles.projectIcon} />
            <View style={styles.projectTextContent}>
              <Text style={styles.projectName}>Dine with Esty</Text>
              <Text style={styles.projectDescription}>A dynamic food restaurant website providing an intuitive platform for customers to browse menus, place orders, and manage reservations efficiently.</Text>
            </View>
          </View>
          <View style={styles.projectItem}>
            <Ionicons name="cart-outline" size={24} color={COLORS.gold} style={styles.projectIcon} />
            <View style={styles.projectTextContent}>
              <Text style={styles.projectName}>Cartevo</Text>
              <Text style={styles.projectDescription}>A robust e-commerce platform built to deliver a seamless online shopping experience with secure transactions and extensive product management capabilities.</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Thank you for exploring my work!</Text>
          <Text style={styles.footerText}>© 2024 Usman Adams. All rights reserved.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutDeveloperScreen;

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
  imageContainer: { alignItems: 'center', marginVertical: 30 },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: COLORS.lightGray, // Placeholder background
    marginBottom: 15,
    borderWidth: 3,
    borderColor: COLORS.gold,
  },
  developerName: { fontSize: 24, fontWeight: 'bold', color: COLORS.black, marginBottom: 5 },
  developerTitle: { fontSize: 16, color: COLORS.gray, textAlign: 'center' },
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.black, marginBottom: 15 },
  paragraph: { fontSize: 15, color: COLORS.darkGray, lineHeight: 22, marginBottom: 10 },
  skillTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  skillTag: {
    backgroundColor: COLORS.lightGray,
    color: COLORS.black,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    fontSize: 13,
    fontWeight: '500',
  },
  projectItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.lightGray,
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  projectIcon: { marginRight: 15, marginTop: 2 },
  projectTextContent: { flex: 1 },
  projectName: { fontSize: 16, fontWeight: 'bold', color: COLORS.black, marginBottom: 4 },
  projectDescription: { fontSize: 14, color: COLORS.gray, lineHeight: 20 },
  socialGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'flex-start',
    gap: 12 
  },
  socialItem: { 
    alignItems: 'center', 
    width: '30%', 
    marginBottom: 10 
  },
  socialIconCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  socialLabel: { fontSize: 12, color: COLORS.darkGray, fontWeight: '500' },
  footer: { marginTop: 20, paddingBottom: 40, alignItems: 'center' },
  footerText: { fontSize: 12, color: COLORS.gray, textAlign: 'center', marginBottom: 5 },
});

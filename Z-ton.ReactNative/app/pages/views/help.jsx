import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { router } from 'expo-router';

const COLORS = {
  black: "#000000",
  gold: "#B8860B",
  gray: "#9CA3AF",
  white: "#FFFFFF",
  darkGray: "#1F2937",
  lightGray: "#F3F4F6",
};

const HelpScreen = () => {
  const helpOptions = [
    { id: '1', title: 'Contact Us', icon: 'call-outline', route: '/pages/views/contact-us' },
    { id: '2', title: 'About Z-ton Bank', icon: 'business-outline', route: '/pages/views/about-bank' },
    { id: '3', title: 'About Developer', icon: 'code-slash-outline', route: '/pages/views/about-developer' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.darkGray} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        {/* Spacer for centering title */}
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.welcomeText}>How can we help you today?</Text>

        {helpOptions.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.optionItem}
            activeOpacity={0.7}
            onPress={() => item.route && router.push(item.route)}
          >
            <View style={styles.optionLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name={item.icon} size={22} color={COLORS.gold} />
              </View>
              <Text style={styles.optionText}>{item.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.versionText}>Z-ton Mobile | Version 1.0.0</Text>
      </View>
    </SafeAreaView>
  );
};

export default HelpScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 70,
    backgroundColor: COLORS.darkGray,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
  backButton: { padding: 5 },
  content: { flex: 1, padding: 25, paddingTop: 30 },
  welcomeText: { fontSize: 24, fontWeight: 'bold', color: COLORS.black, marginBottom: 35 },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.lightGray,
    padding: 18,
    borderRadius: 15,
    marginBottom: 16,
  },
  optionLeft: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    elevation: 1,
  },
  optionText: { fontSize: 16, fontWeight: '600', color: COLORS.black },
  footer: { padding: 20, alignItems: 'center' },
  versionText: { color: COLORS.gray, fontSize: 12 },
});
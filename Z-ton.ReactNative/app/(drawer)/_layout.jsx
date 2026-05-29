import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { UserContext } from '../UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderProfileSection from '../../components/(drawer)/header-profile-section';
 
const COLORS = {
  black: "#000000",
  gold: "#B8860B",
  gray: "#9CA3AF",
  white: "#FFFFFF",
  darkGray: "#1F2937",
};

// Custom Drawer Content with Profile Section and Navigation Items
function CustomDrawerContent(props) {
       
        // Access user data and updater function from context
        const { user, setUser } = useContext(UserContext);  

  // Profile Image
  const [profileImage, setProfileImage] = useState(user?.profile_url);
  const [profilePublicId, setProfilePublicId] = useState(user?.profile_public_id);
  const [uploadStatus, setUploadStatus] = useState(null); // 'loading', 'success', 'error'



 
  // Function to loug user out 
  function handleUserLogout() {

        // Save the user data to AsyncStorage for persistence across app restarts
         AsyncStorage.removeItem("user");

        // Save the user data to global context for access across the app
        setUser(false);

        // direct user to login page
        router.replace('/')
  }

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ backgroundColor: COLORS.white }}>


        {/* Header Profile Section .props*/}
        <HeaderProfileSection
          user={user}
          setUser={setUser}
          styles={styles}
          profileImage={profileImage}
          setProfileImage={setProfileImage}
          profilePublicId={profilePublicId}
          setProfilePublicId={setProfilePublicId}
          uploadStatus={uploadStatus}
          setUploadStatus={setUploadStatus}

        />


        {/* Drawer Items */}
        <View style={styles.drawerItemsContainer}>
          
          {/* Automatically lists screens defined in the Drawer navigator */}
          {/* <DrawerItemList {...props} /> */}
          
          <View style={styles.divider} />
          <Text style={styles.sectionLabel}>CARD BANK SERVICES</Text>
          
          <DrawerItem
            label="My Cards"
            icon={({ size }) => <Ionicons name="card-outline" size={size} color={COLORS.gold} />}
            onPress={() => router.push('/(drawer)/cards')}
            labelStyle={styles.drawerLabel}
          />
          <DrawerItem
            label="Account Details"
            icon={({ size }) => <Ionicons name="information-circle-outline" size={size} color={COLORS.gold} />}
            onPress={() => router.push('/(drawer)/account-details')}
            labelStyle={styles.drawerLabel}
          />
          <DrawerItem
            label="Profile & Security"
            icon={({ size }) => <Ionicons name="person-outline" size={size} color={COLORS.gold} />}
            onPress={() => router.push('/(drawer)/profile&security')}
            labelStyle={styles.drawerLabel}
          />
           <DrawerItem
            label="Analytics"
            icon={({ size }) => <Ionicons name="stats-chart-outline" size={size} color={COLORS.gold} />}
            onPress={() => router.push('/(drawer)/analytics')}
            labelStyle={styles.drawerLabel}
          />
          <DrawerItem
            label="Live Chat"
            icon={({ size }) => <Ionicons name="chatbubble-outline" size={size} color={COLORS.gold} />}
            onPress={() => router.push('/(drawer)/live-chat')}
            labelStyle={styles.drawerLabel}
          />
          <DrawerItem
            label="Z-ton Ai"
            icon={({ size }) => <Ionicons name="sparkles-outline" size={size} color={COLORS.gold} />} // Changed icon to sparkles-outline for AI
            onPress={() => router.push('/(drawer)/ai-onboarding')} // Navigate to AI onboarding
            labelStyle={styles.drawerLabel}
          />
        </View>
      </DrawerContentScrollView>

      {/* Bottom Logout */}
      <View style={styles.footer}>
        <DrawerItem
          label="Logout"
          icon={({ size }) => <Ionicons name="log-out-outline" size={size} color="#FF3B30" />}
          onPress={() => handleUserLogout()}
          labelStyle={{ color: '#FF3B30', fontWeight: 'bold' }}
        />
      </View>
    </View>
  );
}


// Main Drawer Layout
export default function DrawerLayout() {


  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: COLORS.darkGray },
        headerTintColor: COLORS.white,
        headerRight: () => (
          <TouchableOpacity 
            style={{ marginRight: 20, position: 'relative' }} 
            onPress={() => router.push('/pages/views/global-notification')}
          >
            <Ionicons name="notifications-outline" size={26} color={COLORS.white} />
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        ),
        drawerActiveBackgroundColor: COLORS.gold + '15', // Subtle gold background for active item
        drawerActiveTintColor: COLORS.gold,
        drawerInactiveTintColor: COLORS.black,
      }}
    >
      {/* This screen points to your existing (tabs) group */}
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: 'Dashboard',
          title: 'Z-ton Bank',
          drawerIcon: ({ color, size }) => <Ionicons name="grid-outline" size={size} color={color} />,
        }}
      />
      {/* Hidden from the main list if you want it only in the custom section, 
          but we'll keep it here for direct access if needed */}
      <Drawer.Screen
        name="cards"
        options={{
          drawerLabel: 'Card Management',
          title: 'My Cards',
          drawerIcon: ({ color, size }) => <Ionicons name="card-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="analytics"
        options={{
          drawerLabel: 'Analytics',
          title: 'Financial Analytics',
          drawerIcon: ({ color, size }) => <Ionicons name="stats-chart-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="ai-onboarding"
        options={{
          drawerLabel: 'Z-ton AI',
          title: 'Z-ton AI Assistant',
          drawerIcon: ({ color, size }) => <Ionicons name="sparkles-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="ai-chat"
        options={{
          drawerLabel: 'Z-ton AI',
          title: 'AI Assistant',
          drawerIcon: ({ color, size }) => <Ionicons name="sparkles-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="profile&security"
        options={{
          drawerLabel: 'Profile & Security',
          title: 'Security Settings',
          drawerIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="account-details"
        options={{
          drawerLabel: 'Account Details',
          title: 'My Account',
          drawerIcon: ({ color, size }) => <Ionicons name="information-circle-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="live-chat"
        options={{
          drawerLabel: 'Support Chat',
          title: 'Customer Support',
          drawerIcon: ({ color, size }) => <Ionicons name="chatbubble-outline" size={size} color={color} />,
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawerHeader: { paddingVertical: 30, paddingHorizontal: 20, backgroundColor: COLORS.darkGray, alignItems: 'center', marginBottom: 10 },
  profileImageContainer: { marginBottom: 12, position: 'relative' },
  profileImage: { width: 90, height: 90, borderRadius: 45, borderWidth: 3, borderColor: COLORS.gold },
  uploadOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIconContainer: { position: 'absolute', bottom: 0, right: 0, backgroundColor: COLORS.gold, borderRadius: 15, width: 28, height: 28, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.darkGray },
  userName: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
  accountNumber: { color: COLORS.gray, fontSize: 14 },
  drawerItemsContainer: { flex: 1 },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 15, marginHorizontal: 20 },
  sectionLabel: { fontSize: 12, color: COLORS.gray, marginLeft: 20, marginBottom: 10, fontWeight: 'bold' },
  drawerLabel: { fontSize: 15 },
  footer: { borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingBottom: 20 },
  headerBadge: {
    position: 'absolute',
    right: -4,
    top: -2,
    backgroundColor: '#FF3B30',
    borderRadius: 9,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.darkGray,
  },
  headerBadgeText: { color: COLORS.white, fontSize: 10, fontWeight: 'bold' },
});

import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import React from 'react';

const COLORS = {
  black: "#000000",
  gold: "#B8860B",
  gray: "#9CA3AF",
  white: "#FFFFFF",
  darkGray: "#1F2937", // Used for consistent dark header/tab bar background
};

const ZenTonBanklayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.gold, // Gold for active tabs
        tabBarInactiveTintColor: COLORS.gray, // Gray for inactive tabs
        tabBarStyle: {
          backgroundColor: COLORS.darkGray, // Dark background for the tab bar
          borderTopWidth: 0, // Remove the default top border
          paddingBottom: 5, // Add some padding at the bottom for better visual
          height: 75, // Fixed height for the tab bar
        },
        headerShown: false, // Hide the header by default for all tab screens
      }}
    >
      <Tabs.Screen
        name="overview" // This name should match the file name: overview.tsx or overview.jsx
        options={{
          title: "Overview",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="airtime" // This name should match the file name: airtime.tsx or airtime.jsx
        options={{
          title: "Airtime",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="phone-portrait-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="transfer" // This name should match the file name: transfer.tsx or transfer.jsx
        options={{
          title: "Transfer",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="swap-horizontal-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="bills" // This name should match the file name: bills.tsx or bills.jsx
        options={{
          title: "Bills",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="receipt-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default ZenTonBanklayout

const styles = StyleSheet.create({})

import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
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

const GlobalNotificationScreen = () => {
  const router = useRouter();

  const notifications = [
    {
      id: '1',
      title: 'System Maintenance',
      message: 'Z-ton Bank will undergo routine maintenance on Sunday between 12:00 AM and 3:00 AM. Some digital services may be delayed.',
      time: 'Just now',
      icon: 'construct-outline',
      type: 'info'
    },
    {
      id: '2',
      title: 'Security Notice',
      message: 'Always remember that Z-ton Bank will never ask for your PIN, BVN, or Password via phone or email.',
      time: '4 hours ago',
      icon: 'shield-half-outline',
      type: 'warning'
    },
    {
      id: '3',
      title: 'New Feature: Virtual Cards',
      message: 'You can now create secure virtual cards for your online shopping directly from the Card Management section!',
      time: 'Yesterday',
      icon: 'card-outline',
      type: 'promo'
    }
  ];

  const NotificationItem = ({ item }) => (
    <View style={styles.notificationCard}>
      <View style={[styles.iconBox, { backgroundColor: item.type === 'warning' ? '#FFFBEB' : '#F0F9FF' }]}>
        <Ionicons name={item.icon} size={22} color={item.type === 'warning' ? '#D97706' : COLORS.gold} />
      </View>
      <View style={styles.contentBox}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemTime}>{item.time}</Text>
        </View>
        <Text style={styles.itemBody}>{item.message}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.darkGray} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Z-ton Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Recent Notifications</Text>
        {notifications.map((item) => (
          <NotificationItem key={item.id} item={item} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default GlobalNotificationScreen;

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
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.white },
  backButton: { padding: 5 },
  scrollContent: { padding: 25 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.black, marginBottom: 25 },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.lightGray,
    padding: 18,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  iconBox: { width: 45, height: 45, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  contentBox: { flex: 1 },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  itemTitle: { fontSize: 15, fontWeight: 'bold', color: COLORS.black },
  itemTime: { fontSize: 11, color: COLORS.gray },
  itemBody: { fontSize: 13, color: COLORS.darkGray, lineHeight: 19 },
});
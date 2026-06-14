import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  StatusBar,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const COLORS = {
  black: "#000000",
  gold: "#B8860B",
  gray: "#9CA3AF",
  white: "#FFFFFF",
  darkGray: "#1F2937",
  lightGray: "#F3F4F6",
  red: "#FF3B30",
  green: "#34C759",
};

// Mock data for debit and credit transactions
const MOCK_TRANSACTIONS = [
  {
    id: '1',
    type: 'debit',
    title: 'Grocery Shopping',
    amount: '-$120.50',
    date: '25 May 2024',
    time: '03:30 PM',
    category: 'Food',
  },
  {
    id: '2',
    type: 'credit',
    title: 'Salary Deposit',
    amount: '+$2500.00',
    date: '24 May 2024',
    time: '09:00 AM',
    category: 'Income',
  },
  {
    id: '3',
    type: 'debit',
    title: 'Online Subscription',
    amount: '-$15.99',
    date: '23 May 2024',
    time: '11:45 AM',
    category: 'Entertainment',
  },
  // Add more mock transactions as needed
];


const TransferHistory = () => {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState(MOCK_TRANSACTIONS); // Initialize with mock data

  // this handles delete action
  const handleDeleteTransection = (id) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Update the UI by filtering out the deleted item
    setData(prevData => prevData.filter(item => item.id !== id));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  // this function renders the right action (delete button) when a transaction item is swiped
  const renderRightActions = (id) => (
    <TouchableOpacity
      style={styles.deleteAction}
      onPress={() => handleDeleteTransection(id)}
    >
      <Ionicons name="trash-outline" size={24} color={COLORS.white} />
    </TouchableOpacity>
  );

  // this function renders each transaction item with swipeable delete action
  const renderItem = ({ item }) => {
    const isDebit = item.type === 'debit';

    return (
      <Swipeable
        renderRightActions={() => renderRightActions(item.id)}
        friction={2}
        rightThreshold={40}
      >
        <TouchableOpacity style={styles.transactionItem} activeOpacity={0.7}>
          <View style={[styles.iconContainer, { backgroundColor: isDebit ? COLORS.red + '15' : COLORS.green + '15' }]}>
            <Ionicons
              name={isDebit ? "arrow-up-outline" : "arrow-down-outline"}
              size={22}
              color={isDebit ? COLORS.red : COLORS.green}
            />
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.transactionTitle}>{item.title}</Text>
            <Text style={styles.transactionSubtitle}>{item.date} • {item.time}</Text>
          </View>
          <View style={styles.amountContainer}>
            <Text style={[styles.amountText, { color: isDebit ? COLORS.red : COLORS.green }]}>
              {item.amount}
            </Text>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  // Filter transactions based on search query
  const filteredTransactions = data.filter(item =>
    item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.date?.toLowerCase().includes(searchQuery.toLowerCase())
  );



  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

        {/* Professional Header - Always Visible */}
        <View style={[styles.header,{
           paddingTop: insets.top,
        }]}>

          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Transaction History</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options-outline" size={24} color={COLORS.gold} />
          </TouchableOpacity>
        </View>

        {/* Search Input - Always Visible */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color={COLORS.gray} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search transactions..."
            placeholderTextColor={COLORS.gray}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Transaction List */}
        <FlatList
          data={filteredTransactions}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No transactions found.</Text>
            </View>
          }
        />
      </View>
    </GestureHandlerRootView>
  );
};

export default TransferHistory;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: COLORS.darkGray,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.darkGray, 
  },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.white },
  filterButton: { padding: 5 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    margin: 20,
    paddingHorizontal: 15,
    borderRadius: 12,
    height: 50,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: COLORS.black },
  listContent: { paddingHorizontal: 20, paddingBottom: 20 },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    backgroundColor: COLORS.white
  },
  iconContainer: { width: 45, height: 45, borderRadius: 22.5, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  detailsContainer: { flex: 1 },
  transactionTitle: { fontSize: 15, fontWeight: '600', color: COLORS.black, marginBottom: 4 },
  transactionSubtitle: { fontSize: 12, color: COLORS.gray },
  amountContainer: { alignItems: 'flex-end' },
  amountText: { fontSize: 15, fontWeight: 'bold', marginBottom: 4 },
  categoryText: { fontSize: 10, color: COLORS.gray, textTransform: 'uppercase', letterSpacing: 0.5 },
  emptyContainer: { marginTop: 50, alignItems: 'center' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, color: COLORS.gray, fontSize: 14 },
  emptyText: { color: COLORS.gray, fontSize: 16 },
  deleteAction: {
    backgroundColor: COLORS.red,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
});
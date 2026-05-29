import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { UserContext } from '../../UserContext';
import axios from 'axios';
import { API_URL } from '../../server/config';

const COLORS = {
  black: "#000000",
  gold: "#B8860B",
  gray: "#9CA3AF",
  white: "#FFFFFF",
  darkGray: "#1F2937",
  lightGray: "#F3F4F6",
  red: "#FF3B30",
};

// // Mock data for "Saved Payments" (Past transaction records saved by user)
// const INITIAL_SAVED_PAYMENTS = [
//   { 
//     id: '1', 
//     reference: 'ZTN-78291044', 
//     sender: 'John Doe', 
//     sender_account: '1234567890', 
//     receiver: 'Usman Adams', 
//     receiver_bank: 'Z-ton Bank', 
//     amount: '15000', 
//     description: 'Project Fee', 
//     date: '21 Apr 2026' 
//   },
//   { 
//     id: '2', 
//     reference: 'ZTN-99382100', 
//     sender: 'John Doe', 
//     sender_account: '1234567890', 
//     receiver: 'Grace Ojo', 
//     receiver_bank: 'Zenith Bank', 
//     amount: '2500', 
//     description: 'Lunch refund', 
//     date: '18 Apr 2026' 
//   },
// ];

const SavedTransfer = () => {
    //  Access user data and updater function from context
    const { user, setUser } = useContext(UserContext);
  const router = useRouter();
  const [payments, setPayments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Function to fetch saved transfers from the backend API
  const fetchSavedTransfers = async () => {
    if (!user?.id) return;
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/save-transfer/save-payment/${user.id}`);
      const responseData = response.data;

      if (responseData.status === "success") {
        // Map the Laravel data to match your frontend item structure if necessary
        const formattedData = responseData.data.map(item => ({
          id: item.id.toString(),
          reference: item.reference,
          sender: item.sender_name,
          sender_account: item.sender_account,
          receiver: item.receiver_name,
          receiver_bank: item.receiver_bank,
          amount: item.amount,
          description: item.description ? item.description : null,
          date: item.transaction_date,
        }));
        setPayments(formattedData);
      }
    } catch (error) {
      console.log("Error fetching saved transfer data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch saved transfers when component mounts or when user ID changes
  useEffect(() => {
    fetchSavedTransfers();
  }, [user]);


  // Pull-to-refresh handler
  const onRefresh = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setRefreshing(true);
    await fetchSavedTransfers();
    setRefreshing(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };
  


  const handleDelete = async function (id) {

    // send request to larave to delete
      await axios.delete(`${API_URL}/save-transfer/delete-payment/${id}`);

      // update the UI
      setPayments(prev => prev.filter(p => p.id !== id))
  }

  // Function to call alert
  const callAlert = async (id) => {
    
    Alert.alert(
      "Delete Payment Record",
      "Are you sure you want to delete this saved transaction record?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          // onPress: () => setPayments(prev => prev.filter(p => p.id !== id)),
           onPress: () => handleDelete(id),
          style: "destructive" 
        },
      ]
    );
  };

  // Function to Direct user to view receipt
  const handleViewReceipt = (item) => {
    router.push({
      pathname: '/pages/navigate/transection-details',
      params: { ...item }
    });
  };

  // this hold all the item passed to Flatlist
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* Header Row: Amount (View Button) and Delete Icon */}
      <View style={styles.cardHeader}>
        {/* Amount View Button */}
        <TouchableOpacity style={styles.amountViewButton} onPress={() => handleViewReceipt(item)}>
          <Text style={styles.amountText}>${parseFloat(item.amount).toLocaleString()}</Text>
          <View style={styles.viewLabelContainer}>
            <Text style={styles.viewLabelText}>View Details</Text>
            <Ionicons name="eye-outline" size={14} color={COLORS.white} />
          </View>
        </TouchableOpacity>
        
        {/* Delete Icon */} 
        <TouchableOpacity style={styles.deleteIconButton} onPress={() => callAlert(item.id)}>
          <Ionicons name="trash-outline" size={24} color={COLORS.red} />
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>

      {/* Body: Transaction Details */}
      <View style={styles.cardBody}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Receiver:</Text>
          <Text style={styles.detailValue}>{item.receiver}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Bank:</Text>
          <Text style={styles.detailValue}>{item.receiver_bank}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date:</Text>
          <Text style={styles.detailValue}>{item.date}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Ref:</Text>
          <Text style={styles.refValue}>{item.reference}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.darkGray} />
      
      {/* Professional Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Payments</Text>
        <View style={{ width: 40 }} />
      </View>


    {/* is loading */}
     { isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.gray} />
          <Text style={styles.loadingText}>Fetching saved payments...</Text>
        </View>
      ) : (
          //  FlatList to display saved payments with pull-to-refresh and empty state
          <FlatList
          data={payments}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          onRefresh={onRefresh}
          refreshing={refreshing}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="receipt-outline" size={60} color={COLORS.lightGray} />
              <Text style={styles.emptyText}>No saved payment records found.</Text>
            </View>
          }
         />
      )}

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: COLORS.darkGray,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.white },
  listContent: { padding: 20 },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    paddingBottom: 10,
    marginBottom: 10,
  },
  amountViewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.black,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  amountText: { color: COLORS.white, fontWeight: 'bold', fontSize: 15, marginRight: 8 },
  viewLabelContainer: { flexDirection: 'row', alignItems: 'center', borderLeftWidth: 1, borderLeftColor: COLORS.gray, paddingLeft: 8 },
  viewLabelText: { color: COLORS.white, fontSize: 11, marginRight: 4 },
  deleteIconButton: { alignItems: 'center', flexDirection: 'row' },
  deleteText: { color: COLORS.red, fontSize: 12, fontWeight: 'bold', marginLeft: 4 },
  cardBody: { gap: 6 },
  detailRow: { flexDirection: 'row', alignItems: 'center' },
  detailLabel: { fontSize: 12, color: COLORS.gray, width: 70 },
  detailValue: { fontSize: 14, color: COLORS.black, fontWeight: '600', flex: 1 },
  refValue: { 
    fontSize: 12, 
    color: COLORS.gray, 
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: 'bold' 
  },
  emptyContainer: { marginTop: 100, alignItems: 'center' },
  emptyText: { color: COLORS.gray, fontSize: 16, marginTop: 10 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, color: COLORS.gray, fontSize: 14 },
});

export default SavedTransfer; 
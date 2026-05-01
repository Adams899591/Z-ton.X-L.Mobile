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
  Alert,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const COLORS = {
  black: "#000000",
  gold: "#B8860B",
  gray: "#9CA3AF",
  white: "#FFFFFF",
  darkGray: "#1F2937",
  lightGray: "#F3F4F6",
};
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import axios from 'axios';
import { API_URL } from '../../server/config';
import { UserContext } from '../../UserContext';


const SelectBeneficiary = () => {
  //  Access user data and updater function from context
  const { user, setUser } = useContext(UserContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);

  // Fetch beneficiaries when the component mounts or when the user changes
  useEffect(() => {
   if(!user) return
     
   const handlesFetchUserBeneficiaries = async () => {
       setIsLoading(true);
       try {
            const response = await axios.post(`${API_URL}/select-beneficiary/fetch-beneficiaries/${user.id}`);
            const responseData = response.data;
            
            if (responseData.status == "success") {
                  const data = responseData.user;
                  
                  // Map backend fields to the format expected by your FlatList
                  const formattedBeneficiaries = data.map(item => ({
                    id: item.id.toString(),
                    name: item.receiver_name,
                    bank: item.receiver_bank,
                    account: item.receiver_account,
                    bank_id: item.bank_id // This is the ID we resolved in the controller
                  }));
                  
                  setBeneficiaries(formattedBeneficiaries);
              
            }
       } catch (error) {
        console.log(error);
        
       } finally {
        setIsLoading(false);
       }
   }

   handlesFetchUserBeneficiaries();
  }, [user])
  




  const handleSelect = (item) => {
    setSelectedBeneficiary(item); 
    
    // Navigate to the transfer page with the selected data
    router.push({
      pathname: '/(drawer)/(tabs)/transfer', // Replace', // Adjust this path to your actual transfer page
      params: { // Pass the selected beneficiary details as query parameters
        receiver: item.name,
        receiver_bank: item.bank,
        receiver_account: item.account,
        bank_id: item.bank_id,
      }
    });
  };

  // Function to handle deletion of a beneficiary
  const handleDelete = (id) => {
    Alert.alert(
      "Delete Beneficiary",
      "Are you sure you want to delete this saved beneficiary?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => setBeneficiaries(prevData => prevData.filter(item => item.id !== id)),
          style: "destructive",
        },
      ]
    );
  };

  // Function to render the delete button when swiping
  const renderRightActions = (id, progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
    return (
      <TouchableOpacity 
        style={styles.deleteAction} 
        onPress={() => handleDelete(id)}
      >
        <Animated.View style={[{ transform: [{ scale }]}] }>
          <Ionicons name="trash-outline" size={28} color={COLORS.white} />
        </Animated.View>
        <Text style={styles.deleteActionText}>Delete</Text>
      </TouchableOpacity>
    );
  };

  // Function to render each beneficiary item in the list
  const renderItem = ({ item }) => (
    <Swipeable
      renderRightActions={(progress, dragX) => renderRightActions(item.id, progress, dragX)}
      friction={2} // How much the swipeable will move with a swipe
      rightThreshold={80} // How far the swipeable must be swiped to open to reveal actions
    >
      {/* Beneficiary Item */}
      <TouchableOpacity style={styles.beneficiaryItem} activeOpacity={0.7} onPress={() => handleSelect(item)}>
        <View style={styles.iconContainer}>
          <Ionicons name="person-circle-outline" size={28} color={COLORS.gold} />
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.beneficiaryName}>{item.name}</Text>
          <Text style={styles.beneficiaryDetails}>{item.bank} • {item.account}</Text>
        </View>
        {/* Removed 'View' button as tapping the item can show details. The delete is via swipe. */}
      </TouchableOpacity>
    </Swipeable>
  );

  // Filter beneficiaries based on search query (search by name or account number)
  const filteredData = beneficiaries.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.account.includes(searchQuery)
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.darkGray} />
      
      {/* Professional Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Beneficiary</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={COLORS.gray} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search beneficiaries..."
          placeholderTextColor={COLORS.gray}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Beneficiary List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.gold} />
          <Text style={styles.loadingText}>Loading beneficiaries...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={60} color={COLORS.lightGray} />
              <Text style={styles.emptyText}>No saved beneficiaries found.</Text>
            </View>
          }
        />
      )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default SelectBeneficiary;

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
  beneficiaryItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 15, 
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    backgroundColor: COLORS.white, // Important for the swipeable background
  },
  iconContainer: { 
    width: 45, 
    height: 45, 
    borderRadius: 22.5, 
    backgroundColor: COLORS.gold + '15',
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 15 
  },
  detailsContainer: { flex: 1, paddingRight: 10 }, // Added paddingRight to prevent text overlapping delete
  beneficiaryName: { fontSize: 15, fontWeight: '600', color: COLORS.black, marginBottom: 4 },
  beneficiaryDetails: { fontSize: 12, color: COLORS.gray },
  emptyContainer: { marginTop: 80, alignItems: 'center' },
  emptyText: { color: COLORS.gray, fontSize: 16, marginTop: 10 },
  deleteAction: {
    backgroundColor:"red",
    justifyContent: 'center',
    alignItems: 'center',
    width: 80, // Width of the delete button
    height: '100%', // Ensure it covers the full height of the item
    paddingTop: 10, // Add some padding for the icon
    paddingBottom: 10, // Add some padding for the icon
  },
  deleteActionText: {
    color: COLORS.white,
    fontWeight: 'bold',
    marginTop: 5,
    fontSize: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  loadingText: {
    marginTop: 10,
    color: COLORS.gray,
    fontSize: 14,
  },
});

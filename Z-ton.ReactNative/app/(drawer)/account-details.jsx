import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router'; // Assuming expo-router is used for navigation
import { UserContext } from '../UserContext';
import axios from 'axios';
import { API_URL } from '../server/config';

const COLORS = {
  black: "#000000",
  gold: "#B8860B",
  gray: "#9CA3AF",
  white: "#FFFFFF",
  darkGray: "#1F2937",
  lightGray: "#F3F4F6", // A lighter gray for backgrounds
};
 

const AccountDetailsScreen = () => {
  const [showBVN, setShowBVN] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [morkAccountData, setMorkAccountData] = useState({
                                                accountHolder: "",
                                                accountNumber: "",
                                                accountType: '',
                                                bankName: "",
                                                branch: '',
                                                accountBalance: "", // Example balance
                                                currency: '',
                                                bvn:  "", // Bank Verification Number
                                                dateOpened:  "",
                                                status: '',
                                            });

  const { user, setUser } = useContext(UserContext);
 

// fetch user and the bank details
useEffect(() => {

   if(!user) return;  // only run if user id is set
   setIsLoading(true);

   
   // Fetch user and bank details from the server
  const fetchUserAndBankDetails = async () => {

       // send response to laravel to fetch the bank details of the user
       const response = await axios.post(`${API_URL}/user/fetchBankDetails/${user.id}`);

       const data = response.data; // extract data from the response

       // if the response is successful and contains the expected data
       if (data.status == "success") {

                 const resultUser = data.result[0];

                 // Format the date to "Month Day, Year" (e.g., January 15, 2020)
                 const formattedDate = new Date(resultUser.created_at).toLocaleDateString('en-US', {
                   year: 'numeric',
                   month: 'long',
                   day: 'numeric',
                 });

                  // Mock data for the user's account details
                  setMorkAccountData({
                        accountHolder: resultUser.name,
                        accountNumber: resultUser.account_number,
                        accountType: resultUser.account_type || 'Savings Account',
                        bankName: resultUser.bank?.name,
                        branch: resultUser.bank?.branch || 'Main Branch',
                        accountBalance: resultUser.balance, // Example balance
                        currency: resultUser.currency || 'USD',
                        bvn:  resultUser.bvn, // Bank Verification Number 
                        dateOpened: formattedDate,
                        status: resultUser.status || 'Active',
                  });               
       };

       setIsLoading(false);
   }; 

   fetchUserAndBankDetails(); // Call the function to fetch user and bank details when the component mounts or when the user changes
}, [user])



  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {isLoading ? (
          <ActivityIndicator size="large" color={COLORS.gold} />
        ) : (
          <>
            {/* Account Holder Info */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Account Holder</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Name</Text>
                <Text style={styles.detailValue}>{morkAccountData.accountHolder}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status</Text>
                <Text style={styles.detailValueStatus}>{morkAccountData.status}</Text>
              </View>
            </View>

            {/* Account Summary */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Account Summary</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Current Balance</Text>
                <Text style={styles.detailValue}>{morkAccountData.currency} {morkAccountData.accountBalance}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Account Type</Text>
                <Text style={styles.detailValue}>{morkAccountData.accountType}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date Opened</Text>
                <Text style={styles.detailValue}>{morkAccountData.dateOpened}</Text>
              </View>
            </View>

            {/* Bank & Account Details */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Bank & Account Info</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Bank Name</Text>
                <Text style={styles.detailValue}>{morkAccountData.bankName}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Account Number</Text>
                <Text style={styles.detailValue}>{morkAccountData.accountNumber}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Branch</Text>
                <Text style={styles.detailValue}>{morkAccountData.branch}</Text>
              </View>
            </View>

            {/* Security Information */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Security Information</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>BVN</Text>
                <TouchableOpacity onPress={() => setShowBVN(!showBVN)} style={styles.bvnToggle}>
                  <Text style={styles.detailValue}>{showBVN ? morkAccountData.bvn : '************'}</Text>
                  <Ionicons 
                    name={showBVN ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color={COLORS.gray} 
                    style={{ marginLeft: 10 }}
                  />
                </TouchableOpacity>
              </View>
              {/* Add more security details if needed, e.g., Last Password Change */}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccountDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    backgroundColor: COLORS.white,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  scrollContent: {
    padding: 20,
  },
  sectionCard: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  detailLabel: {
    fontSize: 15,
    color: COLORS.gray,
    flex: 1,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.black,
    flex: 2,
    textAlign: 'right',
  },
  detailValueStatus: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.gold, // Highlight active status
    flex: 2,
    textAlign: 'right',
  },
  bvnToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
    justifyContent: 'flex-end',
  },
});

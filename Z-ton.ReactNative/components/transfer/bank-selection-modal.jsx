import { Text, View,  TouchableOpacity,  TextInput,  Modal, FlatList } from 'react-native';
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useEffect } from 'react';
import { API_URL } from '../../app/server/config';

const COLORS = {
  black: "#000000",
  gold: "#B8860B",
  gray: "#9CA3AF",
  white: "#FFFFFF",
  darkGray: "#1F2937",
  lightGray: "#F3F4F6",
};


const BankSelectionModal = ({styles,showBankModal, setShowBankModal, bankSearchQuery, setBankSearchQuery,selectedBank, setSelectedBank}) => {

  const [bankList, setBankList] = useState([{ id: '', name: '' }]);
   
  // fetch banks from API
  useEffect(() => {
     const fetchBanks = async () => {
       try {
         const response = await axios.post(`${API_URL}/transfer/fetch-banks`);
         const responseData = response.data;

         if (responseData.status === "success") {

           const bankData = responseData.banks; // Assuming bankData is an array of {id, name} objects
           // Map the bank data to the desired format and update the state once
           setBankList(bankData.map(bank => ({
             id: bank.id.toString(), // Ensure ID is a string for FlatList keyExtractor consistency
             name: bank.name
           })));
         }
         
       } catch (error) {
         console.log(error);
       }
     }
  

     fetchBanks();
  }, [])
  

  // Filtered bank list for the modal search
  const filteredBankList = bankList.filter(bank => 
    bank.name.toLowerCase().includes(bankSearchQuery.toLowerCase())
  );



    return (
      <>
        {/* Bank Selection Modal .props accepting approach */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={showBankModal}
              onRequestClose={() => setShowBankModal(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.bankModalContent}>
                  <View style={styles.modalHeader}>
                  <TouchableOpacity onPress={() => setShowBankModal(false)} style={styles.modalCloseButton}>
                    <Ionicons name="close-outline" size={28} color={COLORS.black} />
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>Select a Bank</Text>
                  <View style={{ width: 28 }} />
                </View>
                <TextInput 
                  style={styles.modalSearchInput}
                  placeholder="Search banks..."
                  placeholderTextColor={COLORS.gray}
                  value={bankSearchQuery}
                  onChangeText={setBankSearchQuery}
                />
                <FlatList
                  data={filteredBankList} // Use the filtered list here
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity 
                      style={styles.bankListItem}
                      onPress={() => {
                        setSelectedBank(item);
                        setShowBankModal(false);
                      }}
                    >
                      <Text style={styles.bankListItemText}>{item.name}</Text>
                      {selectedBank && selectedBank.id === item.id && (
                        <Ionicons name="checkmark-circle" size={20} color={COLORS.gold} />
                      )}
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                      <Text style={styles.emptyText}>No banks found.</Text>
                    </View>
                  }
                />
                </View>
              </View>
            </Modal>
      </>
  )
}

export default BankSelectionModal

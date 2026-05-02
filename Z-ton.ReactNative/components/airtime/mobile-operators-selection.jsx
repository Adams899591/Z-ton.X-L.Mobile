import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, TextInput, Switch, Modal, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import axios from 'axios';
import { API_URL } from '../../app/server/config';

const COLORS = {
  black: "#000000",
  gold: "#B8860B", 
  gray: "#9CA3AF",
  white: "#FFFFFF",
  darkGray: "#1F2937",
  lightGray: "#F3F4F6",
};

const MobileOperatorsSelection = ({styles,setSelectedOperator,selectedOperator}) => {
  // Define a local state to hold the list of operators fetched from the server
  const [operators, setOperators] = useState([]);



  // useEffect to run only once to fetch the network from laravel
  useEffect(() => {

    const handlefetchNetworks = async () => {
        try {
               const response = await axios.post(`${API_URL}/airtime/fetch-networks`);
               const responseData = response.data;

               if (responseData.status === "success") {
                  const networks =  responseData.network; 

                  const formattedOperators = networks.map(network => ({
                    id: network.id,
                    name: network.name,
                    color: network.color,
                  }));
                  
                  // Update the local list of operators
                  setOperators(formattedOperators);
               }
 
        } catch (error) {
           console.log(error);
           
        }
    }

    handlefetchNetworks();
  },[])
  


  return (
     <>
             {/* Mobile Operator Selection */}
             <Text style={styles.label}>Select Mobile Operator</Text>
             <View style={styles.operatorRow}>
               {operators && operators.length > 0 ? (
                 operators.map((op) => (
                 <TouchableOpacity 
                   key={op.id} 
                   style={[
                     styles.operatorItem, 
                     selectedOperator === op.id && styles.selectedOperatorItem
                   ]}
                   onPress={() => setSelectedOperator(op.id)}
                 >
                   <View style={[styles.operatorIcon, { backgroundColor: op.color }]}>
                     <Text style={styles.operatorInitial}>{op.name[0]}</Text>
                   </View>
                   <Text style={styles.operatorText}>{op.name}</Text>
                 </TouchableOpacity>
               ))
               ) : (
                 <ActivityIndicator size="small" color={COLORS.gold} />
               )}
             </View>

     </>
  )
}

export default MobileOperatorsSelection

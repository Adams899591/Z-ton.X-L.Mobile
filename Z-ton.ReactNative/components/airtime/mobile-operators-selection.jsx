import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, TextInput, Switch, Modal, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const COLORS = {
  black: "#000000",
  gold: "#B8860B",
  gray: "#9CA3AF",
  white: "#FFFFFF",
  darkGray: "#1F2937",
  lightGray: "#F3F4F6",
};
const MobileOperatorsSelection = ({styles,setSelectedOperator,selectedOperator}) => {

// Define mobile operators with their respective colors
  const operators = [
    { id: 'MTN', name: 'MTN', color: '#FFCC00' },
    { id: 'GLO', name: 'Glo', color: '#00FF00' },
    { id: '9MOBILE', name: '9mobile', color: '#006600' },
    { id: 'AIRTEL', name: 'Airtel', color: '#FF0000' },
  ];


  return (
     <>
             {/* Mobile Operator Selection */}
             <Text style={styles.label}>Select Mobile Operator</Text>
             <View style={styles.operatorRow}>
               {operators.map((op) => (
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
               ))}
             </View>

     </>
  )
}

export default MobileOperatorsSelection


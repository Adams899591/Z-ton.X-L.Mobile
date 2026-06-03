import React, { useState, useRef, useEffect, useMemo, useContext } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, StatusBar, Modal, Pressable, PanResponder } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '../server/config';
import CardVisualization from '../../components/cards/card-visualization';
import CardControls from '../../components/cards/card-controls';
import ManageLimitsModal from '../../components/cards/manage-limits-modal';
import { UserContext } from '../UserContext';
const COLORS = {
  black: "#000000",
  gold: "#B8860B",
  gray: "#9CA3AF",
  white: "#FFFFFF",
  darkGray: "#1F2937",
  lightGray: "#F3F4F6",
};
 
const CardsScreen = () => {

  //  Access user data and updater function from context
  const { user, setUser } = useContext(UserContext);
  const [isPinVisible, setIsPinVisible] = useState(false);
  const [isLimitModalVisible, setLimitModalVisible] = useState(false);



  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.darkGray} />
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Card Visualization  .props*/}
        <CardVisualization
            styles={styles}
            user={user}
            COLORS={COLORS}
            isPinVisible={isPinVisible}
        />

        {/* Card Controls  .props*/}
        <CardControls
            styles={styles}
            COLORS={COLORS}
            isPinVisible={isPinVisible}
            setIsPinVisible={setIsPinVisible}
            setLimitModalVisible={setLimitModalVisible}
        />
      </ScrollView>

      {/* Manage Limits Bottom Modal */}
       <ManageLimitsModal
          user={user}
          isLimitModalVisible={isLimitModalVisible}
          setLimitModalVisible={setLimitModalVisible}
          COLORS={COLORS}
          styles={styles}
       />
    </SafeAreaView>
  );
};

export default CardsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  content: { padding: 20 },
  creditCard: {
    backgroundColor: COLORS.darkGray,
    height: 200,
    borderRadius: 20,
    padding: 25,
    justifyContent: 'space-between',
    marginBottom: 30,
    elevation: 8,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  bankName: { color: COLORS.white, fontWeight: 'bold', fontSize: 16 },
  chip: { color: COLORS.gold, fontSize: 30 },
  cardNumber: { color: COLORS.white, fontSize: 22, letterSpacing: 2, textAlign: 'center' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  cardLabel: { color: COLORS.gray, fontSize: 10 },
  cardValue: { color: COLORS.white, fontWeight: 'bold' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: COLORS.black },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  actionButton: {
    backgroundColor: '#F9FAFB',
    padding: 20,
    borderRadius: 15,
    width: '48%',
    alignItems: 'center',
    marginBottom: 15,
  },
  actionText: { marginTop: 10, fontWeight: '600', color: COLORS.black, fontSize: 13 },
  
  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { 
    backgroundColor: COLORS.white, 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30, 
    padding: 30, 
    paddingBottom: 50 
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.black },
  limitAmount: { fontSize: 40, fontWeight: 'bold', color: COLORS.gold, textAlign: 'center', marginTop: 10 },
  limitSubtext: { textAlign: 'center', color: COLORS.gray, marginBottom: 30 },
  rangeContainer: { height: 40, justifyContent: 'center', marginBottom: 30 },
  rangeTrack: { 
    height: 6, 
    backgroundColor: COLORS.lightGray, 
    borderRadius: 3, 
    position: 'relative' 
  },
  rangeFill: { 
    height: 6, 
    backgroundColor: COLORS.gold, 
    borderRadius: 3, 
    position: 'absolute',
    left: 0,
  },
  rangeThumb: { 
    width: 24, 
    height: 24, 
    borderRadius: 12, 
    backgroundColor: COLORS.white, 
    borderWidth: 3, 
    borderColor: COLORS.gold, 
    position: 'absolute', 
    top: -9, 
    marginLeft: -12,
    elevation: 3,
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  saveButton: { backgroundColor: COLORS.darkGray, padding: 18, borderRadius: 15, alignItems: 'center' },
  saveButtonText: { color: COLORS.white, fontWeight: 'bold', fontSize: 16 },
});
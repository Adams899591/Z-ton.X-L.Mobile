import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, StatusBar, Modal, Pressable, PanResponder } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '../server/config';
const COLORS = {
  black: "#000000",
  gold: "#B8860B",
  gray: "#9CA3AF",
  white: "#FFFFFF",
  darkGray: "#1F2937",
  lightGray: "#F3F4F6",
};

const CardsScreen = () => {

  const [isPinVisible, setIsPinVisible] = useState(false);
  const [isLimitModalVisible, setLimitModalVisible] = useState(false);
  const [dailyLimit, setDailyLimit] = useState(2500); // Initial daily limit
  const [trackWidth, setTrackWidth] = useState(0); // Width of the slider track
  const [currentSliderPosition, setCurrentSliderPosition] = useState(0); // Position of the thumb in pixels
  const startPos = useRef(0); // Store the position where the drag started

  const minLimit = 0;
  const maxLimit = 10000; // Maximum possible limit
  const thumbWidth = 24; // Width defined in styles.rangeThumb

  // When track width is measured, set the initial position based on the $2500 default
  useEffect(() => {
    if (trackWidth > 0) {
      const initialPosition = (dailyLimit / maxLimit) * trackWidth;
      setCurrentSliderPosition(initialPosition);
    }
  }, [trackWidth, isLimitModalVisible]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        // Capture the position of the thumb when the user first touches it
        startPos.current = currentSliderPosition;
      },
      onPanResponderMove: (evt, gestureState) => {
        if (trackWidth <= 0) return;

        // Calculate new position using the delta (change) in X
        let newPosition = startPos.current + gestureState.dx;

        // Boundary checks: don't let the thumb go off the track
        if (newPosition < 0) {
          newPosition = 0;
        } else if (newPosition > trackWidth) {
          newPosition = trackWidth;
        }

        // Update the visual position of the thumb
        setCurrentSliderPosition(newPosition);

        // Calculate the limit value based on the thumb percentage
        const percentage = newPosition / trackWidth;
        const newLimit = Math.round(percentage * (maxLimit - minLimit) + minLimit);
        
        // Round to nearest 50 for a smoother feel
        setDailyLimit(Math.round(newLimit / 50) * 50);
      },
      onPanResponderRelease: () => {}
    })
  ).current;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.darkGray} />
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Card Visualization */}
        <View style={styles.creditCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.bankName}>Z-TON X-L BANK</Text>
            <Ionicons name="wifi" size={24} color="white" style={{ transform: [{ rotate: '90deg' }] }} />
          </View>
          
          <Text style={styles.chip}>══</Text>
          
          <Text style={styles.cardNumber}>
            {isPinVisible ? "4582 1234 8890 4582" : "**** **** **** 4582"}
          </Text>
          
          <View style={styles.cardFooter}>
            <View>
              <Text style={styles.cardLabel}>CARD HOLDER</Text>
              <Text style={styles.cardValue}>Z-TON USER</Text>
            </View>
            <View>
              <Text style={styles.cardLabel}>EXPIRES</Text>
              <Text style={styles.cardValue}>12/28</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Card Controls</Text>
        
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="lock-closed" size={24} color={COLORS.gold} />
            <Text style={styles.actionText}>Freeze Card</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setIsPinVisible(!isPinVisible)}
          >
            <Ionicons name={isPinVisible ? "eye" : "eye-off"} size={24} color={COLORS.gold} />
            <Text style={styles.actionText}>{isPinVisible ? "Hide PIN" : "Show PIN"}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setLimitModalVisible(true)}
          >
            <Ionicons name="infinite" size={24} color={COLORS.gold} />
            <Text style={styles.actionText}>Manage Limits</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="refresh" size={24} color={COLORS.gold} />
            <Text style={styles.actionText}>Replace Card</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Manage Limits Bottom Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isLimitModalVisible}
        onRequestClose={() => setLimitModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setLimitModalVisible(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Card Transaction Limit</Text>
              <TouchableOpacity onPress={() => setLimitModalVisible(false)}>
                <Ionicons name="close-circle" size={28} color={COLORS.gray} />
              </TouchableOpacity>
            </View>

            <Text style={styles.limitAmount}>${dailyLimit.toLocaleString('en-US')}</Text>
            <Text style={styles.limitSubtext}>Adjust your daily spending limit</Text>

            <View style={styles.rangeContainer}>
              <View 
                onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
                style={styles.rangeTrack}
              >
                <View style={[styles.rangeFill, { width: currentSliderPosition }]} />
                <View 
                  style={[
                    styles.rangeThumb, 
                    { left: currentSliderPosition - (thumbWidth / 2) }
                  ]} 
                  {...panResponder.panHandlers} // Attach pan handlers to the thumb
                />
              </View>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={() => setLimitModalVisible(false)}>
              <Text style={styles.saveButtonText}>Set New Limit</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
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
    position: 'absolute' 
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  saveButton: { backgroundColor: COLORS.darkGray, padding: 18, borderRadius: 15, alignItems: 'center' },
  saveButtonText: { color: COLORS.white, fontWeight: 'bold', fontSize: 16 },
});
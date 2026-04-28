import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  black: "#000000",
  gold: "#B8860B",
  gray: "#9CA3AF",
  white: "#FFFFFF",
  darkGray: "#1F2937",
};

const CardsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Card Visualization */}
        <View style={styles.creditCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.bankName}>Z-TON X-L BANK</Text>
            <Ionicons name="wifi" size={24} color="white" style={{ transform: [{ rotate: '90deg' }] }} />
          </View>
          
          <Text style={styles.chip}>══</Text>
          
          <Text style={styles.cardNumber}>**** **** **** 4582</Text>
          
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
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="eye-off" size={24} color={COLORS.gold} />
            <Text style={styles.actionText}>Show PIN</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="infinite" size={24} color={COLORS.gold} />
            <Text style={styles.actionText}>Manage Limits</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="refresh" size={24} color={COLORS.gold} />
            <Text style={styles.actionText}>Replace Card</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
});
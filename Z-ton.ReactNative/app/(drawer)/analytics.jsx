import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const COLORS = {
  black: "#000000",
  gold: "#B8860B",
  gray: "#9CA3AF",
  white: "#FFFFFF",
  darkGray: "#1F2937",
  lightGray: "#F3F4F6",
  success: "#10B981",
  danger: "#EF4444",
};

const screenWidth = Dimensions.get("window").width;

const AnalyticsScreen = () => {
  const [timeframe, setTimeframe] = useState('Month');

  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [1200, 1900, 1500, 2100, 1800, 2400]
      }
    ]
  };

  const chartConfig = {
    backgroundColor: COLORS.white,
    backgroundGradientFrom: COLORS.white,
    backgroundGradientTo: COLORS.white,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(184, 134, 11, ${opacity})`, // Gold
    labelColor: (opacity = 1) => `rgba(31, 41, 55, ${opacity})`, // Dark Gray
    style: {
      borderRadius: 16,
    },
    propsForLabels: {
      fontSize: 10,
      fontWeight: '600'
    },
    barPercentage: 0.6,
  };

  const renderSummaryCard = (title, amount, icon, color) => (
    <View style={styles.summaryCard}>
      <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View>
        <Text style={styles.summaryTitle}>{title}</Text>
        <Text style={[styles.summaryAmount, { color: COLORS.black }]}>${amount}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Timeframe Selector */}
        <View style={styles.timeframeContainer}>
          {['Week', 'Month', 'Year'].map((item) => (
            <TouchableOpacity 
              key={item} 
              onPress={() => setTimeframe(item)}
              style={[styles.timeframeBtn, timeframe === item && styles.timeframeBtnActive]}
            >
              <Text style={[styles.timeframeText, timeframe === item && styles.timeframeTextActive]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Main Chart Section */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.sectionTitle}>Spending Overview</Text>
            <Text style={styles.totalSpent}>Total: $10,900</Text>
          </View>
          
          <BarChart
            data={chartData}
            width={screenWidth - 60}
            height={220}
            yAxisLabel="$"
            chartConfig={chartConfig}
            verticalLabelRotation={0}
            fromZero
            style={styles.chartStyle}
            showValuesOnTopOfBars
          />
        </View>

        {/* Summary Stats */}
        <View style={styles.summaryRow}>
          {renderSummaryCard("Income", "4,500", "arrow-down-circle", COLORS.success)}
          {renderSummaryCard("Expenses", "2,400", "arrow-up-circle", COLORS.danger)}
        </View>

        {/* Spending Categories */}
        <Text style={[styles.sectionTitle, { marginLeft: 5, marginBottom: 15 }]}>Top Categories</Text>
        
        <View style={styles.categoryList}>
          {[
            { name: 'Transfers', amount: '$850.00', color: '#8B5CF6', icon: 'exchange-outline' },
            { name: 'Bills', amount: '$1,200.00', color: '#F59E0B', icon: 'receipt-outline' },
            { name: 'Investments', amount: '$420.50', color: '#10B981', icon: 'trending-up-outline' },
          ].map((cat, index) => (
            <View key={index} style={styles.categoryItem}>
              <View style={styles.categoryInfo}>
                <View style={[styles.categoryIcon, { backgroundColor: cat.color }]}>
                  <Ionicons name={cat.icon} size={18} color={COLORS.white} />
                </View>
                <Text style={styles.categoryName}>{cat.name}</Text>
              </View>
              <Text style={styles.categoryAmount}>{cat.amount}</Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default AnalyticsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  scrollContent: { padding: 20 },
  timeframeContainer: { 
    flexDirection: 'row', 
    backgroundColor: COLORS.lightGray, 
    borderRadius: 12, 
    padding: 5, 
    marginBottom: 25 
  },
  timeframeBtn: { 
    flex: 1, 
    paddingVertical: 10, 
    alignItems: 'center', 
    borderRadius: 8 
  },
  timeframeBtnActive: { 
    backgroundColor: COLORS.white, 
    elevation: 2, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 2 
  },
  timeframeText: { fontSize: 14, color: COLORS.gray, fontWeight: '600' },
  timeframeTextActive: { color: COLORS.gold },
  
  chartCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 15,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    elevation: 4,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  chartHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 5
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.darkGray },
  totalSpent: { color: COLORS.gold, fontWeight: 'bold' },
  chartStyle: { marginVertical: 8, borderRadius: 16 },

  summaryRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 30 
  },
  summaryCard: { 
    backgroundColor: COLORS.white, 
    width: '48%', 
    padding: 15, 
    borderRadius: 15, 
    flexDirection: 'row', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  iconContainer: { 
    width: 40, 
    height: 40, 
    borderRadius: 10, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 12 
  },
  summaryTitle: { fontSize: 12, color: COLORS.gray, marginBottom: 2 },
  summaryAmount: { fontSize: 16, fontWeight: 'bold' },

  categoryList: { backgroundColor: COLORS.lightGray, borderRadius: 20, padding: 15 },
  categoryItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  categoryInfo: { flexDirection: 'row', alignItems: 'center' },
  categoryIcon: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  categoryName: { fontSize: 15, fontWeight: '600', color: COLORS.darkGray },
  categoryAmount: { fontSize: 15, fontWeight: 'bold', color: COLORS.black },
});

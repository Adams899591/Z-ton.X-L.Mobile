import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const COLORS = {
  black: "#000000",
  gold: "#B8860B",
  gray: "#9CA3AF",
  white: "#FFFFFF",
  darkGray: "#1F2937",
  lightGray: "#F3F4F6",
};

const AI_ONBOARDING_DATA = [
  {
    id: '1',
    title: 'Your AI Financial Partner',
    description: 'Meet Z-ton AI, your 24/7 intelligent assistant designed to simplify your banking experience.',
    icon: 'sparkles-outline',
  },
  {
    id: '2',
    title: 'Deep Spending Insights',
    description: 'Ask Z-ton AI to analyze your monthly spending, track subscriptions, or suggest saving plans.',
    icon: 'bulb-outline',
  },
  {
    id: '3',
    title: 'Instant Voice Support',
    description: 'Speak or type your commands. Z-ton AI can freeze cards, check balances, or initiate transfers in seconds.',
    icon: 'mic-outline',
  },
];

const AIOnboardingScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const handleNext = () => {
    if (currentIndex < AI_ONBOARDING_DATA.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      // Navigate to the actual AI Chat
      router.replace('/(drawer)/ai-chat');
    }
  };

  const handleSkip = () => {
    router.replace('/(drawer)/ai-chat');
  };

  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      <View style={styles.iconWrapper}>
        <View style={styles.iconCircle}>
          <Ionicons name={item.icon} size={80} color={COLORS.gold} />
        </View>
        {/* Subtle decorative elements for AI feel */}
        <View style={[styles.pulse, { transform: [{ scale: 1.2 }] }]} />
        <View style={[styles.pulse, { transform: [{ scale: 1.5 }] }]} />
      </View>
      
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.darkGray} />
      
      <ImageBackground 
        source={{ uri: 'https://www.transparenttextures.com/patterns/diagmonds-light.png' }} 
        style={styles.background}
        imageStyle={{ opacity: 0.1, tintColor: COLORS.gold }}
      >
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        <FlatList
          ref={flatListRef}
          data={AI_ONBOARDING_DATA}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
          keyExtractor={(item) => item.id}
        />

        <View style={styles.footer}>
          <View style={styles.pagination}>
            {AI_ONBOARDING_DATA.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  currentIndex === index ? styles.activeDot : null,
                ]}
              />
            ))}
          </View>

          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>
              {currentIndex === AI_ONBOARDING_DATA.length - 1 ? 'Launch AI' : 'Next'}
            </Text>
            <Ionicons 
              name={currentIndex === AI_ONBOARDING_DATA.length - 1 ? "rocket" : "arrow-forward"} 
              size={20} 
              color={COLORS.white} 
              style={{ marginLeft: 10 }}
            />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default AIOnboardingScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  background: { flex: 1 },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  skipText: { color: COLORS.gray, fontSize: 16, fontWeight: '600' },
  slide: { width, justifyContent: 'center', alignItems: 'center', padding: 40 },
  iconWrapper: { marginBottom: 60, justifyContent: 'center', alignItems: 'center' },
  iconCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    zIndex: 2,
  },
  pulse: { position: 'absolute', width: 180, height: 180, borderRadius: 90, borderWidth: 1, borderColor: COLORS.gold + '40' },
  textContainer: { alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.darkGray, textAlign: 'center', marginBottom: 20 },
  description: { fontSize: 16, color: COLORS.gray, textAlign: 'center', lineHeight: 26 },
  footer: { paddingHorizontal: 40, paddingBottom: 60 },
  pagination: { flexDirection: 'row', justifyContent: 'center', marginBottom: 30 },
  dot: { height: 6, width: 6, borderRadius: 3, backgroundColor: COLORS.lightGray, marginHorizontal: 4 },
  activeDot: { backgroundColor: COLORS.gold, width: 20 },
  nextButton: {
    backgroundColor: COLORS.darkGray,
    paddingVertical: 18,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
});

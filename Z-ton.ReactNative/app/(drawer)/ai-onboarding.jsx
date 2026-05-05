import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

// Get screen width for responsive image sizing
const { width } = Dimensions.get('window');

// Define a consistent color palette for the app
const COLORS = {
  black: "#000000",
  gold: "#B8860B",
  gray: "#9CA3AF",
  white: "#FFFFFF",
  darkGray: "#1F2937",
  lightGray: "#F3F4F6",
};

// Define the content for each onboarding slide
const onboardingSlides = [
  {
    id: '1',
    title: 'Welcome to Z-ton AI Assistant',
    description: 'Your intelligent financial companion is here to help you manage your money, answer questions, and provide insights.',
    icon: 'sparkles-outline',
  },
  {
    id: '2',
    title: 'Smart Financial Insights',
    description: 'Get personalized recommendations, spending analysis, and future projections to make informed financial decisions.',
    icon: 'analytics-outline',
  },
  {
    id: '3',
    title: '24/7 Support & Guidance',
    description: 'Ask any question, anytime. Our AI is always ready to provide instant answers and support for your banking needs.',
    icon: 'shield-checkmark-outline',
  },
];

const AiOnboardingScreen = () => {
  // State to keep track of the current slide being displayed
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const currentSlide = onboardingSlides[currentSlideIndex];

  // Function to handle navigation to the next slide or the main AI chat
  const handleNext = () => {
    if (currentSlideIndex < onboardingSlides.length - 1) {
      // If not the last slide, move to the next one
      setCurrentSlideIndex(currentSlideIndex + 1);
    } else {
      // If it's the last slide, navigate to the main AI chat screen
      router.replace('/(drawer)/ai-chat');
    }
  };

  // Function to skip the onboarding and go directly to the main AI chat
  const handleSkip = () => {
    router.replace('/(drawer)/ai-chat');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Skip button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Main content area for the current slide */}
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name={currentSlide.icon} size={100} color={COLORS.gold} />
        </View>
        <Text style={styles.title}>{currentSlide.title}</Text>
        <Text style={styles.description}>{currentSlide.description}</Text>
      </View>

      {/* Footer with pagination dots and Next/Get Started button */}
      <View style={styles.footer}>
        {/* Pagination dots */}
        <View style={styles.pagination}>
          {onboardingSlides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentSlideIndex === index && styles.dotActive, // Active dot styling
              ]}
            />
          ))}
        </View>
        {/* Next/Get Started button */}
        <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
          <Text style={styles.nextButtonText}>
            {currentSlideIndex === onboardingSlides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <Ionicons name="arrow-forward" size={20} color={COLORS.white} style={{ marginLeft: 5 }} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AiOnboardingScreen;

// Styles for the onboarding screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.darkGray,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 30,
  },
  skipButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  skipButtonText: {
    color: COLORS.gray,
    fontWeight: '600',
    fontSize: 15,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(184, 134, 11, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
    borderWidth: 2,
    borderColor: 'rgba(184, 134, 11, 0.15)',
    // Subtle glow effect
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 15,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '400',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 30,
    backgroundColor: 'transparent',
  },
  pagination: {
    flexDirection: 'row',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.gray,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: COLORS.gold,
    width: 20, // Active dot is wider
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gold,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  nextButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

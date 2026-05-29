import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

const COLORS = {
  black: "#000000",
  gold: "#B8860B",
  gray: "#9CA3AF",
  white: "#FFFFFF",
  darkGray: "#1F2937",
  lightGray: "#F3F4F6",
};

const LOADING_STEPS = [
  "Establishing secure connection...",
  "Authenticating user session...",
  "Synchronizing account ledger...",
  "Finalizing secure environment...",
];

const PreparingDashboard = () => {
  const [statusMessage, setStatusMessage] = useState(LOADING_STEPS[0]);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rippleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Professional "Bloom" Ripple & Pulse Animation
    Animated.loop(
      Animated.parallel([
        // The central icon pulses
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.1, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ]),
        // The ripples bloom outward
        Animated.timing(rippleAnim, {
          toValue: 1,
          duration: 1600,
          useNativeDriver: true,
        })
      ])
    ).start();

    // 2. Sync Haptics with the pulse rhythm
    const hapticInterval = setInterval(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, 1600);

    // 3. Progress Bar Fill (5 seconds transition for a smooth feel)
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 4500, // set to 4.5 seconds to allow some time for the final status message to be read
      useNativeDriver: false, 
    }).start(() => {
      // Final navigation to dashboard after setup is "complete"
      router.replace("(drawer)/(tabs)/overview");
    });

    // 4. Step-through status messages
    let step = 0;
    const interval = setInterval(() => {
      if (step < LOADING_STEPS.length - 1) {
        step++;
        setStatusMessage(LOADING_STEPS[step]);
      } else {
        clearInterval(interval);
      }
    }, 700);

    return () => {
        clearInterval(interval);
        clearInterval(hapticInterval);
    };
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  // Ripple styles
  const rippleScale = rippleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2.5],
  });
  const rippleOpacity = rippleAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.4, 0],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.darkGray} />
      
      <View style={styles.content}>
        {/* Animated Icon with Blooming Halos */}
        <View style={styles.iconWrapper}>
            {/* Ripple 1 */}
            <Animated.View style={[styles.ripple, { 
                transform: [{ scale: rippleScale }], 
                opacity: rippleOpacity 
            }]} />
            
            {/* Ripple 2 (Delayed start appearance) */}
            <Animated.View style={[styles.ripple, { 
                transform: [{ scale: rippleScale }], 
                opacity: rippleOpacity,
                backgroundColor: 'rgba(184, 134, 11, 0.1)'
            }]} />

            {/* Main Pulse Icon */}
            <Animated.View style={[styles.iconContainer, { transform: [{ scale: pulseAnim }] }]}>
              <Ionicons name="shield-checkmark" size={90} color={COLORS.gold} />
            </Animated.View>
        </View>

        <Text style={styles.title}>Z-ton X-L Bank</Text>
        <Text style={styles.subtitle}>{statusMessage}</Text>

        {/* Modern Minimalist Progress Bar */}
        <View style={styles.progressBarContainer}>
          <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
        </View>

        <Text style={styles.footerText}>Authorized Access Only</Text>
      </View>
    </SafeAreaView>
  );
};

export default PreparingDashboard;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.darkGray },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 50 },
  iconWrapper: {
    width: 200,
    height: 200, 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  ripple: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.gold,
  },
  iconContainer: { zIndex: 10 },
  title: { fontSize: 26, fontWeight: 'bold', color: COLORS.white, marginBottom: 8, letterSpacing: 1.5 },
  subtitle: { fontSize: 14, color: COLORS.gray, marginBottom: 50, letterSpacing: 0.5 },
  progressBarContainer: { width: '100%', height: 3, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 1.5, overflow: 'hidden' },
  progressBar: { height: '100%', backgroundColor: COLORS.gold },
  footerText: { position: 'absolute', bottom: 60, fontSize: 10, color: COLORS.gray, opacity: 0.4, letterSpacing: 3, textTransform: 'uppercase' },
});